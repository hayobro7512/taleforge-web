"""Every fixture uses exactly the key names in API.md, and the mock streams events in the API.md order.

python3 -m unittest discover -s tests
"""
import json
import re
import sys
import threading
import unittest
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import mock_server  # noqa: E402


def api_md_response():
    """The 'Response 200' JSON example in API.md (the second json block)."""
    blocks = re.findall(r"```json\n(.*?)```", (ROOT / "API.md").read_text(), re.S)
    return json.loads(blocks[1])


SAMPLE = api_md_response()
TOP, GROUP = set(SAMPLE), set(SAMPLE["groups"][0])
CARD, SCORES = set(SAMPLE["groups"][0]["cards"][0]), set(SAMPLE["groups"][0]["cards"][0]["scores"])
ERROR = {"error", "message"}  # "Every error body is {"error": code, "message": text}"


class FixtureKeysTest(unittest.TestCase):
    def test_api_md_lists_the_expected_shape(self):
        self.assertEqual(TOP, {"chips", "intro", "groups"})
        self.assertEqual(CARD, {"name", "image_url", "scryfall_url", "reason", "evidence", "scores", "source_urls"})

    def test_every_fixture_matches_api_md(self):
        files = sorted((ROOT / "fixtures").glob("*.json"))
        self.assertTrue(files)
        for path in files:
            body = json.loads(path.read_text())
            with self.subTest(fixture=path.name):
                if set(body) == {"cards"}:  # the ranked list sent in the "cards" event: card fields without these two
                    for c in body["cards"]:
                        self.assertEqual(set(c), CARD - {"reason", "source_urls"}, c.get("name"))
                        self.assertEqual(set(c["scores"]), SCORES, c["name"])
                elif "groups" in body:
                    # results, or the 200 "empty" body (results keys plus the error keys)
                    self.assertEqual(set(body), TOP | (ERROR if "error" in body else set()))
                    for g in body["groups"]:
                        self.assertEqual(set(g), GROUP)
                        for c in g["cards"]:
                            self.assertEqual(set(c), CARD, c.get("name"))
                            self.assertEqual(set(c["scores"]), SCORES, c["name"])
                else:
                    self.assertEqual(set(body), ERROR)


    def test_layout_cases(self):
        results = json.loads((ROOT / "fixtures" / "results.json").read_text())
        ranked = json.loads((ROOT / "fixtures" / "cards.json").read_text())["cards"]
        grouped = {c["name"] for g in results["groups"] for c in g["cards"]}
        self.assertTrue({c["name"] for c in ranked} - grouped)  # ungrouped cards -> "More cards"
        self.assertIn(5, [len(c["source_urls"]) for g in results["groups"] for c in g["cards"]])  # "+N more"


class MockStreamTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        mock_server.STEP_DELAY = 0
        cls.httpd = mock_server.make_server(port=0)
        cls.base = f"http://127.0.0.1:{cls.httpd.server_address[1]}"
        threading.Thread(target=cls.httpd.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def post(self, query, stream=True):
        body = json.dumps({"query": query, "weights": {"story": 0.62}, "commander": "x", "colors": ["U"]}).encode()
        req = urllib.request.Request(self.base + "/api/search" + ("?stream=1" if stream else ""), data=body,
                                     headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req) as r:
                return r.status, r.headers["Content-Type"], r.read().decode()
        except urllib.error.HTTPError as e:
            return e.code, e.headers["Content-Type"], e.read().decode()

    def events(self, text):
        return [chunk.split("\n")[0].removeprefix("event: ") for chunk in text.strip().split("\n\n")]

    def test_states(self):
        status, kind, text = self.post("a Bolas deck")
        self.assertEqual((status, kind), (200, "text/event-stream"))
        self.assertEqual(self.events(text), ["understood", "cards"] + ["explanation"] * 4 + ["done"])
        self.assertEqual(self.events(self.post("empty")[2]), ["understood", "cards", "done"])
        self.assertEqual(self.events(self.post("error please")[2]), ["understood", "cards", "error"])
        self.assertEqual(self.post("limit")[:2], (429, "application/json"))
        self.assertEqual(self.post("paused")[:2], (503, "application/json"))
        self.assertEqual(self.post("error", stream=False)[0], 500)
        self.assertEqual(self.post(" ")[0], 400)


if __name__ == "__main__":
    unittest.main()
