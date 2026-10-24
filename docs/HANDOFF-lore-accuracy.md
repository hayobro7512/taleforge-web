# Handoff: mtg-lore-ai accuracy work (2026-10-24)

Backend repo: `../mtg-lore-ai`, branch `main` at 9ae8cfe (nvidia-summarize fast-forwarded into main; both pushed to origin). Full numbers: `../mtg-lore-ai/docs/STATS.md`. State: `../mtg-lore-ai/docs/STATE.md`. Read backend `CLAUDE.md` + `STATE.md` first.

## Current served result (cached-intent eval, round-2 lore.db, 96 articles)
dev P@10 .216 / old5 .500 / new6 .283 / new_lore 11 .382; judged strict .531 (`tools/judge_top10.py`).

## Done since last handoff (2026-10-23 -> 24)
- Stage diagnosis refreshed at pool 400: 390 expected cards -> top10 136, below10 81, never in pool 173 (44%).
- E8 request name words (`MTG_LORE_NAME_WORDS=pool|half|boost|nochar`, `rank_cards.request_name_words`): capitalized request words (guilds, half-given names) pull name-matching cards into the pool. R_all .581 -> .698 in every mode, but top 10 never improves without breaking old5 (guild word outranks a character's cards). All OFF.
- E9 plane scope ADOPTED (default on, `MTG_LORE_PLANE_SCOPE=0` off; `retrieve._plane_arcs`): plane query with no storyline facts -> limited to arcs whose facts name the plane (>= 25% of top arc). new6 .267 -> .283, judged .513 -> .531. Also fixes the full-318 lore new6 drop (.217 -> .283).
- E10 name implies lore (`MTG_LORE_NAME_LORE=1|only`): `only` = character-only requests; dev .218 but judged tie (.531). OFF.
- 144 unit tests pass.

## Open / next
- Full 318-article lore (`data/lore_full.db`, `data/articles/summarized_full/`): with E9, new6 passes; dev .202 (.211 with E10 only) vs .216 served. Remaining gap = plain character decks ("a Teferi/Garruk/Chandra/Ajani/Jace deck"): full lore links newer printings; golden rows favor older printings while the judge rates all printings as fits. User decision: adopt full lore + refresh those golden rows, or keep parked.
- 173 expected cards never enter the pool; mechanics/mixed worst. HyDE (E7) and name words (E8) widen recall but don't move top 10. Next lever is ranking pool cards (e.g. synergy for guild/mechanic queries), not pool size.
- Held-out `--final` eval: run ONLY on explicit user go-ahead.
- Pre-2014 lore not covered. Wizards/Scryfall/Archidekt replies pending (STATE.md).

## Constraints (mtg-lore-ai CLAUDE.md)
Never open/print `.env` or MOXFIELD_USER_AGENT. Moxfield 1 req/s, stop on 401/403/429. Ask before network calls beyond existing OpenAI/NVIDIA ones. Never commit without user ask; run precommit review first (`.claude/agents/precommit-reviewer.md`; if the agent type isn't loaded, run its prompt via a general-purpose agent). Never print NVIDIA key (`Projects/nvidia_key.txt`; extract with `grep -o 'nvapi-[A-Za-z0-9_-]*'`). Another Claude session may edit the same tree; use targeted edits on STATE.md.

## Run recipes
- Eval: `python3 -m eval.eval_golden --intent-cache --ranker --label X` (old5 = first 5 NEW_LORE rows, new6 = last 6).
- Judge: `NVIDIA_API_KEY=... python3 -m tools.judge_top10 --label X` (>10 min when many new cards; run in background).
- Full-lore eval without touching data/: scratch dir of symlinks to data/ with `lore.db -> lore_full.db` and `articles/summarized -> summarized_full`, then `MTG_LORE_DATA_DIR=<dir>`.
- Stage diagnosis: `python3 -m tools.diagnose_stages`.
- Adopt rule: dev >= .198, old5 >= .50, new6 >= .267, and not worse than served; judged strict as tie-break.
