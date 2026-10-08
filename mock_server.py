"""Mock of the Taleforge search API for working on the site without the engine.

python3 mock_server.py [--port 8000]   -> http://127.0.0.1:8000/

Serves the files in this folder plus POST /api/search (contract in API.md), answering
from fixtures/. Words in the query pick the state:
  empty  -> no-results state        limit  -> 429 daily limit
  paused -> 503 paused               error  -> engine fails mid-stream (500)
  slow   -> normal results with long delays
anything else -> normal results. Standard library only.
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
STEP_DELAY = 0.8  # seconds between stream events; "slow" multiplies it
SLOW_FACTOR = 5


def fixture(name):
    return json.loads((FIXTURES / f"{name}.json").read_text())


def _err(code, message):
    return {"error": code, "message": message}


def check_request(raw_body):
    """Returns (query, None) or (None, (status, body)), with the real server's 400 rules."""
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
    # Other fields (commander, colors, ...) are accepted and ignored.
    return query, None


def state_for(query):
    words = set(re.findall(r"[a-z]+", query.lower()))
    for state in ("paused", "limit", "error", "empty", "slow"):
        if state in words:
            return state
    return "results"


def events_for(state):
    """The stream events (event, data) the real server sends for this state, in order."""
    body = fixture("empty" if state == "empty" else "results")
    events = [("understood", {"chips": body["chips"]})]
    # cards.json is the ranked list; two of its cards are in no group, so the page shows "More cards".
    events.append(("cards", {"cards": [] if state == "empty" else fixture("cards")["cards"]}))
    if state == "error":
        return events + [("error", fixture("server_error"))]
    for i, g in enumerate(body["groups"]):
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
        query, error = check_request(self.rfile.read(length))
        if error:
            return self._send_json(*error)
        state = state_for(query)
        # Errors found before the first event come back as plain JSON with their HTTP status.
        if state == "paused":
            return self._send_json(503, fixture("paused"))
        if state == "limit":
            return self._send_json(429, fixture("limit"))
        events = events_for(state)
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
