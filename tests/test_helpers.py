"""Tag rule and filter helpers, run through node (skipped when node is missing).

python3 -m unittest discover -s tests
"""
import json
import shutil
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def node(expr):
    code = f"const T=require('./app.js'),F=require('./filters.js');console.log(JSON.stringify({expr}))"
    out = subprocess.run(["node", "-e", code], cwd=ROOT, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


@unittest.skipUnless(shutil.which("node"), "node not installed")
class TagTest(unittest.TestCase):
    def test_tags_follow_the_evidence_list(self):
        cards = [{"evidence": e} for e in (["lore", "synergy"], ["lore"], ["synergy"], [])] + [{}]
        self.assertEqual(node(f"{json.dumps(cards)}.map(T.tags)"),
                         [["Lore", "Synergy"], ["Lore"], ["Synergy"], [], []])

    def test_scores_do_not_add_tags(self):
        card = {"evidence": [], "scores": {"story": 1, "synergy": 1}}
        self.assertEqual(node(f"T.tags({json.dumps(card)})"), [])


@unittest.skipUnless(shutil.which("node"), "node not installed")
class FilterHelpersTest(unittest.TestCase):
    def test_colorless_clears_colors_and_a_color_clears_colorless(self):
        self.assertEqual(node("F.toggleColor(['W','U'],'C')"), ["C"])
        self.assertEqual(node("F.toggleColor(['C'],'C')"), [])
        self.assertEqual(node("F.toggleColor(['C'],'B')"), ["B"])
        self.assertEqual(node("F.toggleColor(['U'],'W')"), ["W", "U"])  # WUBRG order
        self.assertEqual(node("F.toggleColor(['W','U'],'W')"), ["U"])

    def test_types_toggle_in_a_fixed_order(self):
        self.assertEqual(node("F.toggleType(['Land'],'Creature')"), ["Creature", "Land"])
        self.assertEqual(node("F.toggleType(['Land','Creature'],'Land')"), ["Creature"])

    def test_url_round_trip_and_cleanup(self):
        self.assertEqual(node("F.fromParams(new URLSearchParams('colors=U,W,X&types=Land,Dragon,Creature&commander=%20Atraxa%20%20x'))"),
                         {"colors": ["W", "U"], "types": ["Creature", "Land"], "commander": "Atraxa x"})
        self.assertEqual(node("F.fromParams(new URLSearchParams('colors=C,U'))")["colors"], ["C"])
        self.assertEqual(node("F.fromParams(new URLSearchParams(''))"), {"colors": [], "types": [], "commander": ""})
        self.assertEqual(node("F.toParams({colors:['U','B'],types:['Land'],commander:''}, new URLSearchParams('q=x')).toString()"),
                         "q=x&colors=U%2CB&types=Land")
        self.assertEqual(node("F.toParams(F.empty(), new URLSearchParams('q=x&colors=U&commander=a')).toString()"), "q=x")
        self.assertEqual(node("F.fromParams(new URLSearchParams({commander:'x'.repeat(150)})).commander.length"), 100)

    def test_request_body_has_only_set_fields(self):
        self.assertEqual(node("F.body(F.empty())"), {})
        self.assertEqual(node("F.body({colors:['C'],types:['Instant'],commander:'Atraxa'})"),
                         {"colors": ["C"], "types": ["Instant"], "commander": "Atraxa"})

    def test_read_as_chips(self):
        self.assertEqual(node("F.chips(F.empty())"), [])
        self.assertEqual(node("F.chips({colors:['C'],types:[],commander:''})"), ["Filter · Colors: Colorless"])
        self.assertEqual(node("F.chips({colors:['W','U'],types:['Creature','Land'],commander:'Atraxa'})"),
                         ["Filter · Colors: W, U", "Filter · Card type: Creature, Land", "Filter · Commander: Atraxa"])

    def test_mounted_chips_follow_the_toggle_rules(self):
        script = r"""
        const El = require('./tests/dom_stub.js'), F = require('./filters.js');
        const root = new El('div'); let changes = 0;
        const ctl = F.mount(root, { colors: ['U'], types: [], commander: 'ignored' }, () => { changes++; });
        const btn = (text) => root.find((n) => n.tag === 'button' && n.textContent === text)[0];
        const pressed = () => root.find((n) => n.attrs['aria-pressed'] === 'true').map((n) => n.textContent);
        const out = [pressed()];
        btn('W').fire('click'); out.push(pressed());
        btn('Colorless').fire('click'); out.push(pressed());
        btn('R').fire('click'); out.push(pressed());
        btn('Land').fire('click'); btn('Creature').fire('click'); out.push(ctl.get().types);
        ctl.set(F.empty()); out.push(pressed(), ctl.get());
        out.push(changes, root.find((n) => n.tag === 'button').length, root.find((n) => n.tag === 'input').length);
        console.log(JSON.stringify(out));
        """
        out = subprocess.run(["node", "-e", script], cwd=ROOT, capture_output=True, text=True, check=True)
        pressed_start, after_w, after_colorless, after_r, types, cleared, cleared_state, changes, buttons, inputs = \
            json.loads(out.stdout)
        self.assertEqual(pressed_start, ["U"])
        self.assertEqual(after_w, ["W", "U"])
        self.assertEqual(after_colorless, ["Colorless"])  # clears the others
        self.assertEqual(after_r, ["R"])  # a color clears Colorless
        self.assertEqual(types, ["Creature", "Land"])
        self.assertEqual((cleared, cleared_state), ([], {"colors": [], "types": []}))
        self.assertEqual((changes, buttons, inputs), (5, 13, 0))  # 5 chip clicks; 6 color + 7 type chips; no commander field here

    def test_command_zone_commits_only_on_enter_or_blur(self):
        script = r"""
        const El = require('./tests/dom_stub.js'), F = require('./filters.js');
        const chipRoot = new El('div'), root = new El('div'); let chips = 0; const seen = [];
        F.mount(chipRoot, F.empty(), () => { chips++; });
        const cz = F.mountCommander(root, ' Atraxa  x ', (v) => seen.push(v));
        const input = root.find((n) => n.tag === 'input')[0];
        const out = [input.value, cz.get(), input.maxLength];
        'Nicol   Bolas'.split('').forEach((c) => { input.value += c; input.fire('input'); });   // typing
        out.push([chips, seen.length, cz.get()]);                                              // nothing started
        input.fire('keydown', { key: 'a' }); out.push(seen.length);                             // other keys: nothing
        let prevented = 0;
        input.fire('keydown', { key: 'Enter', preventDefault() { prevented++; } }); out.push([seen.slice(), prevented]);
        input.fire('blur'); out.push(seen.slice());
        cz.set('Ugin'); out.push(input.value, cz.get(), seen.length);                          // set() does not notify
        out.push(root.find((n) => n.textContent).map((n) => n.textContent));
        console.log(JSON.stringify(out));
        """
        out = json.loads(subprocess.run(["node", "-e", script], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
        self.assertEqual(out[:3], ["Atraxa x", "Atraxa x", 100])  # the starting name is cleaned, not committed
        self.assertEqual(out[3], [0, 0, "Atraxa xNicol Bolas"])  # typing starts nothing (the field kept its start text)
        self.assertEqual(out[4], 0)
        self.assertEqual(out[5], [["Atraxa xNicol Bolas"], 1])  # Enter commits and does not submit the form
        self.assertEqual(out[6], ["Atraxa xNicol Bolas", "Atraxa xNicol Bolas"])  # blur commits too; the page ignores an unchanged name
        self.assertEqual(out[7:10], ["Ugin", "Ugin", 2])
        self.assertEqual(out[10], ["Command zone", "Commander (optional)", "Must be a card that can be your commander."])

    def test_filter_edits_run_one_search_after_the_last_one(self):
        script = r"""
        const T = require('./app.js'); let runs = 0;
        const later = T.debounce(() => { runs++; }, 40);
        const log = (x) => console.log(JSON.stringify(x));
        later(); later();
        setTimeout(() => {                               // a third edit: one run, 40 ms after it
          later();
          setTimeout(() => log([runs, T.FILTER_DELAY]), 20);   // too early
          setTimeout(() => {
            log(runs);
            later(); later.cancel();
            setTimeout(() => log(runs), 100);            // cancel() dropped the pending run
          }, 100);
        }, 20);
        """
        out = subprocess.run(["node", "-e", script], cwd=ROOT, capture_output=True, text=True, check=True)
        self.assertEqual([json.loads(line) for line in out.stdout.split()], [[0, 1500], 1, 1])

    def test_api_md_names_the_same_types_and_colors(self):
        api = (ROOT / "API.md").read_text()
        for t in node("F.TYPES"):
            self.assertIn(f"`{t}`", api)
        self.assertIn("`Battle`", api)  # in the contract, not offered as a chip


if __name__ == "__main__":
    unittest.main()
