# Search API

The site calls one endpoint on its own origin. For local work, `python3 mock_server.py` serves the pages and a mock of this endpoint (see README.md).

## POST /api/search

Request (JSON, body at most 4 KB):

```json
{"query": "Give me a deck built around Nicol Bolas", "weights": {"story": 0.5, "synergy": 0.3, "similarity": 0.2}}
```

- `query`: required string, 1 to 300 characters after whitespace is collapsed.
- `weights`: optional. Each key is optional, each value is a number from 0 to 1. Missing keys use the ranker defaults (story 0.5, synergy 0.3, similarity 0.2). `story` = lore link score, `synergy` = deck co-occurrence score, `similarity` = embedding similarity score.

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
          "reason": "string",
          "evidence": "name match",
          "scores": {"story": 1.0, "synergy": 0.42, "similarity": 0.31, "total": 1.05},
          "source_urls": ["https://example.com/placeholder-source-1"]
        }
      ]
    }
  ]
}
```

- `chips`: how the request was read (parsed intent), ready to show as labels.
- `evidence`: set by the engine, not the browser. The first that applies: `name match` (card name contains a requested character), `story link` (lore link to the request), `deck synergy` (often played with the seed cards in real decks), `similarity` (only embedding similarity).
- `scores`: the ranker's normalized signals (0 to 1) and the weighted `total` (includes the name-match boost).
- `source_urls`: lore sources that ground `reason`; empty for a purely mechanical reason.
- `image_url`, `scryfall_url` can be null.

## POST /api/search?stream=1

Used by the site (`app.js`). Same request body. The response is `text/event-stream` with these events, in this order:

| event | data |
|---|---|
| `understood` | `{"chips": [...]}` after the request is parsed |
| `cards` | `{"cards": [...]}` the ranked candidates (up to 30), same card fields without `reason` and `source_urls` |
| `explanation` | `{"index", "title", "explanation", "cards"}` one per group as it is written; `index` is the group's place in the final list |
| `done` | the full non-stream response body (may carry `error: "empty"`) |
| `error` | `{"error", "message"}` if the engine fails after events started; the stream then ends |

Errors found before the first event (bad request, paused, rate limited) come back as plain JSON with their HTTP status, as below. Events can also arrive all at once, with no pause between them.

## Errors

Every error body is `{"error": code, "message": text}`.

| status | error | when |
|---|---|---|
| 200 | `empty` | No cards found. Body also has `chips`, `intro`, `groups: []`. |
| 400 | `bad_request` | Missing, empty or too long query, bad JSON, or bad weights. |
| 429 | `rate_limited` | The daily search limit is reached. |
| 503 | `paused` | Search is paused. |
| 500 | `server_error` | Engine failed. No details are sent. |
