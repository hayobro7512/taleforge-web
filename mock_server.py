"""Mock of the Taleforge search API for working on the site without the engine.

python3 mock_server.py [--port 8000]   -> http://127.0.0.1:8000/

Serves the files in this folder plus POST /api/search (contract in API.md), answering
from fixtures/. Words in the query pick the state:
  empty  -> no-results state        limit  -> 429 daily limit
  paused -> 503 paused               error  -> engine fails mid-stream (500)
  slow   -> normal results with long delays
anything else -> normal results. Standard library only.

Filters (colors, types, commander) are applied to the fixture cards, as the real server does before it
takes the top 30: colors = color identity must be a subset (colorless always passes; ["C"] = colorless
only), types = any of them, commander = removed from the results and, unless colors are given, its
colors become the allowed colors. The mock knows only the fixture cards as commanders: other names are
accepted and change nothing. The commander "unknown" returns 400 unknown_commander.
"""
import argparse
import json
import re
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parent
FIXTURES = ROOT / "fixtures"
MAX_QUERY_CHARS = 300
MAX_BODY_BYTES = 4096
WEIGHT_KEYS = {"story", "synergy", "similarity"}
COLOR_LETTERS = "WUBRG"
CARD_TYPES = ("Creature", "Instant", "Sorcery", "Artifact", "Enchantment", "Planeswalker", "Land", "Battle")
MAX_COMMANDER_CHARS = 100
STEP_DELAY = 0.8  # seconds between stream events; "slow" multiplies it
SLOW_FACTOR = 5


def fixture(name):
    return json.loads((FIXTURES / f"{name}.json").read_text())


def _err(code, message):
    return {"error": code, "message": message}


def parse_filters(req):
    """Validate colors / types / commander like the real server. Returns (filters, None) or (None, message)."""
    colors, types, commander = req.get("colors"), req.get("types"), req.get("commander")
    if colors is not None:
        if (not isinstance(colors, list) or len(colors) > 5 or not all(isinstance(c, str) for c in colors)
                or not set(colors) <= set(COLOR_LETTERS + "C") or "C" in colors and len(colors) > 1):
            return None, 'Colors must be a list of W, U, B, R, G, or ["C"] alone for colorless.'
        colors = [c for c in COLOR_LETTERS + "C" if c in colors]
    if types is not None:
        if not isinstance(types, list) or not all(isinstance(x, str) for x in types) or not set(types) <= set(CARD_TYPES):
            return None, "Types must be a list from: " + ", ".join(CARD_TYPES) + "."
        types = [x for x in CARD_TYPES if x in types]
    if commander is not None:
        if not isinstance(commander, str) or not commander.strip():
            return None, "Commander must be a card name."
        commander = " ".join(commander.split())
        if len(commander) > MAX_COMMANDER_CHARS:
            return None, f"Commander is longer than {MAX_COMMANDER_CHARS} characters."
    return {"colors": colors or None, "types": types or None, "commander": commander}, None


def check_request(raw_body):
    """Returns ((query, filters), None) or (None, (status, body)), with the real server's 400 rules."""
    try:
        req = json.loads(raw_body)
        query = req["query"]
    except (ValueError, TypeError, KeyError):
        return None, (400, _err("bad_request", "Body must be JSON with a query."))
    if not isinstance(query, str) or not query.strip():
        return None, (400, _err("bad_request", "Query is empty."))
    query = " ".join(query.split())
    if len(query) > MAX_QUERY_CHARS:
        return None, (400, _err("bad_request", f"Query is longer than {MAX_QUERY_CHARS} characters."))
    weights = req.get("weights")
    if weights is not None and (
        not isinstance(weights, dict) or set(weights) - WEIGHT_KEYS
        or any(isinstance(v, bool) or not isinstance(v, (int, float)) or not 0 <= v <= 1 for v in weights.values())
    ):
        return None, (400, _err("bad_request", "Weights must be story, synergy, similarity, each 0 to 1."))
    filters, problem = parse_filters(req)
    if problem:
        return None, (400, _err("bad_request", problem))
    if filters["commander"] and filters["commander"].casefold() == "unknown":
        return None, (400, _err("unknown_commander", "That commander was not found."))
    return (query, filters), None


def apply_filters(cards, filters):
    """The fixture cards that pass the filters (the mock's stand-in for filtering the rank pool)."""
    allowed = None
    if filters["colors"]:
        allowed = set() if filters["colors"] == ["C"] else set(filters["colors"])
    commander = (filters["commander"] or "").casefold()
    named = [c for c in cards if c["name"].casefold() == commander]
    if allowed is None and named:  # a known commander sets the colors unless colors were given
        allowed = set(named[0]["color_identity"])
    keep = []
    for c in cards:
        if c in named:
            continue
        if allowed is not None and not set(c["color_identity"]) <= allowed:
            continue
        if filters["types"] and not set(filters["types"]) & set(c["types"]):
            continue
        keep.append(c)
    return keep


def state_for(query):
    words = set(re.findall(r"[a-z]+", query.lower()))
    for state in ("paused", "limit", "error", "empty", "slow"):
        if state in words:
            return state
    return "results"


NO_FILTERS = {"colors": None, "types": None, "commander": None}


def events_for(state, filters=NO_FILTERS):
    """The stream events (event, data) the real server sends for this state, in order."""
    body = fixture("empty" if state == "empty" else "results")
    ranked = [] if state == "empty" else fixture("cards")["cards"]
    ranked = apply_filters(ranked, filters)
    kept = {c["name"] for c in ranked}
    groups = []
    for g in body["groups"]:
        cards = [c for c in g["cards"] if c["name"] in kept]
        if cards:
            groups.append({**g, "cards": cards})
    if state != "empty" and not ranked:  # the filters left nothing
        body = fixture("empty")
        groups = []
    else:
        body = {**body, "groups": groups}
    events = [("understood", {"chips": body["chips"]})]
    # cards.json is the ranked list; two of its cards are in no group, so the page shows "More cards".
    events.append(("cards", {"cards": ranked}))
    if state == "error":
        return events + [("error", fixture("server_error"))]
    for i, g in enumerate(groups):
        events.append(("explanation", {"index": i, **g}))
    return events + [("done", body)]


class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        url = urlsplit(self.path)
        if url.path != "/api/search":
            return self._send_json(404, _err("not_found", "Unknown endpoint."))
        try:
            length = int(self.headers.get("Content-Length", ""))
        except ValueError:
            length = -1
        if not 0 < length <= MAX_BODY_BYTES:
            return self._send_json(400, _err("bad_request", "Missing or oversized body."))
        parsed, error = check_request(self.rfile.read(length))
        if error:
            return self._send_json(*error)
        query, filters = parsed
        state = state_for(query)
        # Errors found before the first event come back as plain JSON with their HTTP status.
        if state == "paused":
            return self._send_json(503, fixture("paused"))
        if state == "limit":
            return self._send_json(429, fixture("limit"))
        events = events_for(state, filters)
        if parse_qs(url.query).get("stream") != ["1"]:
            event, data = events[-1]
            return self._send_json(500 if event == "error" else 200, data)
        delay = STEP_DELAY * (SLOW_FACTOR if state == "slow" else 1)
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        try:
            for event, data in events:
                time.sleep(delay)
                self.wfile.write(f"event: {event}\ndata: {json.dumps(data)}\n\n".encode())
                self.wfile.flush()
        except OSError:
            pass  # browser left

    def _send_json(self, status, body):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def make_server(port=8000):
    return ThreadingHTTPServer(("127.0.0.1", port), partial(Handler, directory=str(ROOT)))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    server = make_server(args.port)
    print(f"Taleforge mock: http://127.0.0.1:{args.port}/  (Ctrl+C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
