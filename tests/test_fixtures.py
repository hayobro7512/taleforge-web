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


API_BLOCKS = re.findall(r"```json\n(.*?)```", (ROOT / "API.md").read_text(), re.S)
SAMPLE = json.loads(API_BLOCKS[1])  # the 'Response 200' example
COMMANDER = set(json.loads(API_BLOCKS[2])["commander_card"])  # the commander_card example
TOP, GROUP = set(SAMPLE), set(SAMPLE["groups"][0])
CARD, SCORES = set(SAMPLE["groups"][0]["cards"][0]), set(SAMPLE["groups"][0]["cards"][0]["scores"])
ERROR = {"error", "message"}  # "Every error body is {"error": code, "message": text}"


class FixtureKeysTest(unittest.TestCase):
    def test_api_md_lists_the_expected_shape(self):
        self.assertEqual(TOP, {"chips", "intro", "groups"})
        self.assertEqual(CARD, {"name", "image_url", "scryfall_url", "types", "color_identity", "reason", "evidence",
                                "scores", "source_urls", "source_titles"})

    def test_every_fixture_matches_api_md(self):
        files = sorted((ROOT / "fixtures").glob("*.json"))
        self.assertTrue(files)
        for path in files:
            body = json.loads(path.read_text())
            with self.subTest(fixture=path.name):
                if set(body) == {"cards"}:  # the mock's ranked list: "cards" event fields plus its own commander_eligible
                    for c in body["cards"]:
                        self.assertEqual(set(c), CARD - {"reason", "source_urls", "source_titles"} | {"commander_eligible"}, c.get("name"))
                        self.assertEqual(set(c["scores"]), SCORES, c["name"])
                elif "groups" in body:
                    # results, or the 200 "empty" body (results keys plus the error keys)
                    self.assertEqual(set(body), TOP | (ERROR if "error" in body else set()))
                    for g in body["groups"]:
                        self.assertEqual(set(g), GROUP)
                        for c in g["cards"]:
                            self.assertEqual(set(c), CARD, c.get("name"))
                            self.assertEqual(len(c["source_titles"]), len(c["source_urls"]), c["name"])
                            self.assertEqual(set(c["scores"]), SCORES, c["name"])
                else:
                    self.assertEqual(set(body), ERROR)


    def test_filter_fields_use_the_api_md_vocabulary(self):
        ranked = json.loads((ROOT / "fixtures" / "cards.json").read_text())["cards"]
        for c in ranked:
            with self.subTest(card=c["name"]):
                self.assertTrue(set(c["types"]) <= set(mock_server.CARD_TYPES))
                self.assertTrue(set(c["color_identity"]) <= set("WUBRG"))
                self.assertEqual(c["color_identity"], [x for x in "WUBRG" if x in c["color_identity"]])  # WUBRG order
                self.assertTrue(set(c["evidence"]) <= {"lore", "synergy"})  # no combined "both" value
        self.assertIn([], [c["evidence"] for c in ranked])  # a similarity-only card -> no tag
        self.assertIn(["lore", "synergy"], [c["evidence"] for c in ranked])  # both tags side by side
        self.assertIn(["synergy"], [c["evidence"] for c in ranked])
        self.assertIn([], [c["color_identity"] for c in ranked])  # a colorless card
        eligible = [c["name"] for c in ranked if c["commander_eligible"]]
        self.assertEqual(eligible, ["Nicol Bolas, the Ravager // Nicol Bolas, the Arisen"])

    def test_no_both_tag_left(self):
        for name in ("index.html", "results.html", "app.js", "app.css", "filters.js", "README.md"):
            text = (ROOT / name).read_text()
            with self.subTest(file=name):
                self.assertNotIn("tag-both", text)
                self.assertNotRegex(text, r"'Both'|\"Both\"|>Both<")

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

    def post(self, query, stream=True, **extra):
        body = json.dumps({"query": query, "weights": {"story": 0.62}, **extra}).encode()
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

    def names(self, text):
        for chunk in text.strip().split("\n\n"):
            event, data = chunk.split("\n")
            if event == "event: cards":
                return [c["name"] for c in json.loads(data.removeprefix("data: "))["cards"]]

    def test_filters_are_applied_to_the_fixture_cards(self):
        everything = self.names(self.post("a Bolas deck")[2])
        self.assertEqual(len(everything), 13)
        only_ub = self.names(self.post("a Bolas deck", colors=["U", "B"])[2])
        self.assertEqual(sorted(only_ub), ["Ashiok, Dream Render", "Ugin, the Spirit Dragon"])  # colorless always passes
        self.assertEqual(self.names(self.post("a Bolas deck", colors=["C"])[2]), ["Ugin, the Spirit Dragon"])
        self.assertEqual(self.names(self.post("a Bolas deck", types=["Creature"])[2]),
                         ["Nicol Bolas, the Ravager // Nicol Bolas, the Arisen"])
        both = self.names(self.post("a Bolas deck", colors=["U", "B", "R"], types=["Creature", "Land"])[2])
        self.assertEqual(both, ["Nicol Bolas, the Ravager // Nicol Bolas, the Arisen"])

    def test_commander_is_excluded_and_sets_colors(self):
        for name in ("nicol bolas, the ravager", "Nicol Bolas, the Ravager // Nicol Bolas, the Arisen"):  # front face or both
            names = self.names(self.post("a Bolas deck", commander=name)[2])
            self.assertNotIn("Nicol Bolas, the Ravager // Nicol Bolas, the Arisen", names)
            self.assertNotIn("Dovin Baan", names)  # has W; the commander is U B R
            self.assertIn("Chandra, Torch of Defiance", names)
        given = self.names(self.post("a Bolas deck", commander="Nicol Bolas, the Ravager", colors=["W", "U"])[2])
        self.assertIn("Dovin Baan", given)  # explicit colors win over the commander's
        self.assertNotIn("Nicol Bolas, the Ravager // Nicol Bolas, the Arisen", given)
        self.assertEqual(len(self.names(self.post("a Bolas deck", commander="Someone Else")[2])), 13)  # not a fixture card

    def test_commander_card_is_sent_only_when_a_commander_is_found(self):
        def cards(text):
            out = {}
            for chunk in text.strip().split("\n\n"):
                event, data = chunk.split("\n")
                out[event.removeprefix("event: ")] = json.loads(data.removeprefix("data: "))
            return out
        got = cards(self.post("a Bolas deck", commander="Nicol Bolas, the Ravager")[2])
        card = got["understood"]["commander_card"]
        self.assertEqual(set(card), {"name", "image_url", "scryfall_url", "color_identity", "types"})
        self.assertEqual(card["name"], "Nicol Bolas, the Ravager // Nicol Bolas, the Arisen")
        self.assertEqual(got["done"]["commander_card"], card)
        self.assertNotIn("commander_card", got["cards"])
        self.assertTrue(all("commander_eligible" not in c for c in got["cards"]["cards"]))  # mock-only field
        none_left = cards(self.post("a Bolas deck", commander="Nicol Bolas, the Ravager", colors=["W"], types=["Land"])[2])
        self.assertEqual(none_left["done"]["commander_card"], card)  # the empty 200 body carries it too
        for plain in (self.post("a Bolas deck")[2], self.post("a Bolas deck", commander="Someone Else")[2]):
            got = cards(plain)
            self.assertNotIn("commander_card", got["understood"])
            self.assertNotIn("commander_card", got["done"])

    def test_groups_follow_the_filters_and_nothing_left_is_the_empty_state(self):
        _, _, text = self.post("a Bolas deck", types=["Creature"])
        chunks = [c.split("\n") for c in text.strip().split("\n\n")]
        self.assertEqual([c[0] for c in chunks], ["event: understood", "event: cards", "event: explanation", "event: done"])
        done = json.loads(chunks[-1][1].removeprefix("data: "))
        self.assertEqual(len(done["groups"]), 1)
        none_left = self.post("a Bolas deck", colors=["W"], types=["Land"])[2]
        self.assertEqual(self.events(none_left), ["understood", "cards", "done"])
        self.assertIn('"error": "empty"', none_left)

    def stream(self, text):
        return [(c.split("\n")[0].removeprefix("event: "), json.loads(c.split("\n")[1].removeprefix("data: ")))
                for c in text.strip().split("\n\n")]

    def test_commander_card_for_a_fixture_commander(self):
        # Only "Nicol Bolas, the Ravager" can lead in the mock; the others get 400 not_a_commander.
        ravager = "Nicol Bolas, the Ravager // Nicol Bolas, the Arisen"
        self.assertEqual(COMMANDER, {"name", "image_url", "scryfall_url", "color_identity", "types"})
        events = dict(self.stream(self.post("a Bolas deck", commander="nicol bolas, the ravager")[2]))
        for event in ("understood", "done"):
            card = events[event]["commander_card"]
            self.assertEqual(set(card), COMMANDER, event)
            self.assertEqual((card["name"], card["color_identity"]), (ravager, ["U", "B", "R"]))
        self.assertNotIn("commander_card", events["cards"])
        self.assertNotIn(ravager, [c["name"] for c in events["cards"]["cards"]])
        # the full two-faced name works too
        full = dict(self.stream(self.post("a Bolas deck", commander=ravager.lower())[2]))
        self.assertEqual(full["done"]["commander_card"]["name"], ravager)
        # the empty body carries it too, and the non-stream body has it
        self.assertIn("commander_card", dict(self.stream(self.post("empty", commander="Nicol Bolas, the Ravager")[2]))["done"])
        self.assertIn("commander_card", json.loads(self.post("a Bolas deck", stream=False, commander="Nicol Bolas, the Ravager")[2]))

    def test_no_commander_card_without_a_known_commander(self):
        for extra in ({}, {"commander": "Someone Else"}):
            for event, data in self.stream(self.post("a Bolas deck", **extra)[2]):
                self.assertNotIn("commander_card", data, (extra, event))

    def test_filter_errors(self):
        status, _, text = self.post("a Bolas deck", stream=False, commander="Unknown")
        self.assertEqual((status, json.loads(text)["error"]), (400, "unknown_commander"))
        status, _, text = self.post("a Bolas deck", stream=True, commander="unknown")
        self.assertEqual(status, 400)  # plain JSON before the first event
        for name in ("Nicol Bolas, Dragon-God", "ugin, the spirit dragon", "Dovin Baan"):  # fixture cards that cannot lead
            for stream in (False, True):
                status, kind, text = self.post("a Bolas deck", stream=stream, commander=name)
                self.assertEqual((status, kind, json.loads(text)["error"]), (400, "application/json", "not_a_commander"), name)
        for bad in ({"colors": ["X"]}, {"colors": ["U", "C"]}, {"colors": "U"}, {"types": ["Dragon"]},
                    {"commander": ""}, {"commander": "x" * 101}):
            status, _, text = self.post("a Bolas deck", stream=False, **bad)
            self.assertEqual((status, json.loads(text)["error"]), (400, "bad_request"), bad)


if __name__ == "__main__":
    unittest.main()
