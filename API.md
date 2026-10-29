# Search API

The site calls one endpoint on its own origin. For local work, `python3 mock_server.py` serves the pages and a mock of this endpoint (see README.md).

## POST /api/search

Optional header `X-OpenAI-Key`: the visitor's own OpenAI API key (20 to 200 characters), used for that one search only and never stored or logged. A search with a key skips the budget and every limit and is not counted in the ledger. Without it, the search is free but limited: a daily total for the whole site and `VISITOR_LIMIT` (5) searches per visitor per day. Cached answers are always free.

Request (JSON, body at most 4 KB):

```json
{"query": "Give me a deck built around Nicol Bolas", "weights": {"story": 0.5, "synergy": 0.3, "similarity": 0.2},
 "colors": ["U", "B", "R"], "types": ["Creature", "Instant"], "commander": "Nicol Bolas, Dragon-God"}
```

- `query`: required string, 1 to 300 characters after whitespace is collapsed.
- `weights`: optional. Each key is optional, each value is a number from 0 to 1. Missing keys use the ranker defaults (story 0.5, synergy 0.3, similarity 0.2). `story` = lore link score, `synergy` = deck co-occurrence score, `similarity` = embedding similarity score.
- `colors`: optional list of `W`, `U`, `B`, `R`, `G`. A card's color identity must be a subset of the list. Colorless cards are always allowed. `["C"]` (alone) means colorless cards only. Anything else is a 400 `bad_request`.
- `types`: optional list from `Creature`, `Instant`, `Sorcery`, `Artifact`, `Enchantment`, `Planeswalker`, `Land`, `Battle`. A card must have at least one of them. Anything else is a 400 `bad_request`.
- `commander`: optional card name, at most 100 characters, looked up in local card data only (case ignored; the front face of a two-faced card works). The commander never appears in the results. If `colors` is missing, the commander's color identity is used as the allowed colors (a colorless commander allows colorless cards only). If `colors` is given, it wins. A name that is not found is a 400 `unknown_commander`. A card that exists but cannot be a commander is a 400 `not_a_commander` (see Errors). One name only: a Partner or Background pair counts as a single commander for now.
- An empty `colors` or `types` list means no filter.
- All three filters are applied to the candidate pool before the top 30 are taken, so the list is still filled with up to 30 matching cards. They are part of the cache key.

Response 200:

```json
{
  "chips": ["Character: Nicol Bolas", "Play style: control"],
  "intro": "string",
  "groups": [
    {
      "title": "string",
      "explanation": "string",
      "cards": [
        {
          "name": "Nicol Bolas, Dragon-God",
          "image_url": "https://cards.scryfall.io/...",
          "scryfall_url": "https://scryfall.com/card/...",
          "types": ["Creature"],
          "color_identity": ["U", "B", "R"],
          "reason": "string",
          "evidence": ["lore", "synergy"],
          "scores": {"story": 1.0, "synergy": 0.42, "similarity": 0.31, "total": 1.05},
          "source_urls": ["https://example.com/placeholder-source-1"],
          "source_titles": ["The Elder Dragon Returns"]
        }
      ]
    }
  ]
}
```

- `chips`: how the request was read (parsed intent), ready to show as labels.
- `characters`: optional list, see Characters below. Sent with the `understood` event and in the full body (also in the `empty` body when the request named characters).
- `types`: the card's types from the list above (empty if unknown). `color_identity`: letters in W, U, B, R, G order; an empty list is colorless.
- `evidence`: a list set by the engine, not the browser. It holds `lore` (the card's name matches a requested character, or it has a lore link to the request) and/or `synergy` (often played with the seed cards in real decks). A card with both lists both; there is no combined value. An empty list means the card came only from embedding similarity.
- `scores`: the ranker's normalized signals (0 to 1) and the weighted `total` (includes the name-match boost).
- `source_urls`: lore sources that ground `reason`; empty for a purely mechanical reason.
- `source_titles`: the article title of each source, same length and order as `source_urls`; an entry is `null` when the title is not known. An old engine may leave the field out; the page then makes a label from the URL.
- `image_url`, `scryfall_url` can be null.
- `commander_card`: optional, see below. Present only when a `commander` was sent and found. It is never one of the recommended cards.

### commander_card

When the request has a `commander` that is found, the response body also has a top-level `commander_card` with the commander itself, so the page can show it next to the results. It is omitted when no commander was sent. It is not in any group and not in the `cards` event.

```json
{"commander_card": {
  "name": "Nicol Bolas, Dragon-God",
  "image_url": "https://cards.scryfall.io/...",
  "scryfall_url": "https://scryfall.com/card/...",
  "color_identity": ["U", "B", "R"],
  "types": ["Planeswalker"]
}}
```

- `name`: the card's full name as stored (for a two-faced card, both faces, joined with ` // `).
- `image_url`, `scryfall_url`: same as on recommended cards; can be null.
- `color_identity`, `types`: same format as on recommended cards.
- In the stream, `commander_card` is sent with the `understood` event (right after the commander is looked up) and again in the `done` body. The `empty` 200 body carries it too when the commander was found.
- It is part of the cache key through the `commander` request field.

### Characters

Each entry says how a named character figures in the request:

```json
{"characters": [
  {"name": "Nicol Bolas", "role": "opposed", "story_event": "downfall", "seen_from": "those who defeated him"}
]}
```

- `name`: string, the character as named in the request.
- `role`: one of `central` (the deck is about this character), `opposed` (the request is about this character's downfall, defeat, death, or standing against them) or `allied`. Always present. An old client can treat an unknown value as `central`.
- `story_event`: optional string, the story event the request points at (for example `downfall`). Omitted when the request names none.
- `seen_from`: optional short label for the point of view the results take (for example `those who defeated him`). Omitted when `role` is `central` or `allied` and there is nothing to say. The page can show it next to the character chip.
- For `opposed`, the results favor the people who opposed the character in that event, and at most 2 of the 30 cards are the character's own.

## POST /api/search?stream=1

Used by the site (`app.js`). Same request body. The response is `text/event-stream` with these events, in this order:

| event | data |
|---|---|
| `understood` | `{"chips": [...], "characters": [...]}` after the request is parsed (see Characters), plus `commander_card` when a commander was found |
| `cards` | `{"cards": [...]}` the ranked candidates (up to 30, after the filters), same card fields without `reason`, `source_urls` and `source_titles` |
| `explanation` | `{"index", "title", "explanation", "cards"}` one per group as it is written; `index` is the group's place in the final list |
| `done` | the full non-stream response body (may carry `error: "empty"`) |
| `error` | `{"error", "message"}` if the engine fails after events started; the stream then ends |

Errors found before the first event (bad request, paused, rate limited) come back as plain JSON with their HTTP status, as below. Events can also arrive all at once, with no pause between them.

## Errors

Every error body is `{"error": code, "message": text}`.

| status | error | when |
|---|---|---|
| 200 | `empty` | No cards found. Body also has `chips`, `intro`, `groups: []`. |
| 400 | `bad_request` | Missing, empty or too long query, bad JSON, bad weights, or bad `colors`, `types` or `commander` values. |
| 400 | `unknown_commander` | `commander` is a well-formed name that is not in the local card data. |
| 400 | `not_a_commander` | `commander` names a card that exists in the local card data but cannot lead a deck: it is not Commander-legal, or it is neither a legendary creature, nor a card whose text says it can be your commander, nor a legendary Vehicle or Spacecraft with power and toughness. |
| 400 | `bad_request` | Also: the `X-OpenAI-Key` header is not 20 to 200 characters. |
| 401 | `invalid_key` | OpenAI refused the `X-OpenAI-Key`. |
| 429 | `rate_limited` | The site's daily limit or the visitor's daily limit is reached (no key sent). |
| 503 | `paused` | Search is paused. |
| 500 | `server_error` | Engine failed. No details are sent. |
