# Taleforge website

Taleforge is a free website for Magic: The Gathering Commander players. You describe a deck idea, and it shows matching cards grouped by theme, with a short explanation for each card and links to its sources.

This repository holds only the website: pages, styles, scripts and design references. The search engine lives somewhere else. A small mock server stands in for it here and answers every search with placeholder data, so you can work on the site without the engine.

## Run it

You need Python 3, which macOS already includes. In Terminal:

```
git clone <repository URL> taleforge-web && cd taleforge-web
python3 mock_server.py
open http://127.0.0.1:8000
```

Press Ctrl+C in Terminal to stop the server.

## What is where

| Path | What it is |
|---|---|
| `index.html` | Home page (the search box) |
| `results.html` | Results page |
| `compare.html` | Puts the two dark tones side by side |
| `v-lifted/`, `v-blackout/` | Static previews of the two dark tones, with their own `app.css` |
| `app.css` | Styles for the home and results pages |
| `app.js` | Results page behaviour: runs the search and shows each step as it arrives |
| `filters.js` | The filter controls (color chips, card-type chips, commander) used by both pages, and their URL and request helpers |
| `footer.js` | Footer on every page: privacy line, disclaimer, credits |
| `theme.js` | Light/dark and tone switches |
| `sample_result.js` | Placeholder search result used by the static previews |
| `disclaimer.txt` | The footer disclaimer, word for word |
| `design/`, `design-dark/`, `design-blackout/` | Reference exports from Claude Design: the design system (`_ds/`, colour, type and spacing tokens) and the full design file `Taleforge.dc.html`. Not shipped. |
| `API.md` | The contract between the site and the search engine |
| `mock_server.py`, `fixtures/` | The mock search server and the placeholder answers it sends |
| `tests/` | Checks that the placeholder answers match `API.md` |

## Try every state

On the home page, type an idea that contains one of these words, then search:

| Word in the idea | What you see |
|---|---|
| (none) | Normal results, arriving step by step |
| `slow` | Normal results, with long pauses so you can study the loading states |
| `empty` | The "no matches" page |
| `limit` | The "daily limit reached" page |
| `paused` | The "search is paused" page |
| `error` | The search starts, then fails partway through |

For example, "a slow Bolas deck" or "show me the empty state".

### Filters

Both pages have the same filter controls: color chips (W U B R G and Colorless; Colorless clears the others and picking a color clears Colorless), card-type chips, and an optional commander field. On the home page they sit under "Filters (optional)". On the results page they are in the sidebar and apply on their own: 1.5 seconds after your last chip click or Clear click, any search still running is cancelled and one new search starts (none if the filters ended up as they were). The commander field does not search while you type: it applies when you press Enter or leave the field, and only if its text changed since the last search; a chip wait still pending is applied together with it. The Update button is only under the Mix; it also applies any filter change still waiting. They are kept in the address as `colors=W,U` (or `colors=C`), `types=Creature,Instant` and `commander=Name`, sent as `colors`, `types` and `commander` per `API.md`, and shown as "Filter ·" chips under "Read as".

The mock applies them to the 13 fixture cards, the way the real server filters before it picks the best 30:

| Filter | What the mock does |
|---|---|
| colors | A card's color identity must be inside the chosen colors. Colorless cards always pass. Colorless alone keeps only colorless cards (Ugin). |
| types | A card must have at least one of the chosen types. |
| commander | The commander is removed. If it is one of the fixture cards (for example `Nicol Bolas, Dragon-God`, or the front face `Nicol Bolas, the Ravager`), the answer has `commander_card` and the results page shows it above the results (whole card image, name, color identity, Scryfall link); if no colors are chosen, its colors become the allowed colors. Any other name is accepted, changes nothing and gets no `commander_card`, so no commander block shows. |
| commander `unknown` | 400 `unknown_commander`: the "commander not found" page. |
| bad values | 400 `bad_request`. |
| nothing left | The "no matches" page. Groups that lose all their cards disappear. |

Cards show a Lore tag, a Synergy tag, both side by side, or no tag, from their `evidence` list. One fixture card has an empty list (no tag). Every search returns the same placeholder result. Its card names, images and Scryfall links are real, and all text and source links are placeholders. One card has five sources (to show "+N more"), and two cards are in no theme (to show "More cards").

## Send me changes

1. Make a new branch for each change, for example `self-host-fonts`.
2. Commit your work to that branch and push it.
3. Open a pull request on GitHub and say what changed and which pages to look at. Screenshots help.

I review it and merge it. Please don't push to `main` directly.

## Rules

- `API.md` is the contract. Change it first, in a pull request, before changing what the page expects.
- No Wizards logos or trademarks. No Wizards video, music or art. No Scryfall logo.
- No wording that implies Wizards, Scryfall or Moxfield endorses the site.
- Card images only from the API, uncropped, with the artist line visible.
- No external requests except card images from cards.scryfall.io.
- The `design*/` folders are reference exports from Claude Design and are not shipped.
- Self-hosting the fonts (Spectral, Manrope, Space Mono) is task one for the designer. After that, no Google Fonts call may remain.
- The footer disclaimer comes from `disclaimer.txt` and must not be reworded or edited.
- Free access: no login, payment or email gate.
- Respect `prefers-reduced-motion`.
- Keep text readable over any background: contrast at least 4.5:1.

## Checks (optional)

`python3 -m unittest discover -s tests` checks that every placeholder answer in `fixtures/` uses the field names in `API.md`, that the mock sends the events in the right order and applies the filters and sends `commander_card`, and (when `node` is installed) the tag rule, the filter helpers and the filter delay.
