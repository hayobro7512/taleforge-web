# Handoff: Taleforge / mtg-lore-ai (2026-10-24)

## Read first (do not re-derive)
- Project handoff (full state, numbers, run recipes, constraints): `/Users/tianzefang/Desktop/ClaudeCode/Projects/ongoing/taleforge-web/docs/HANDOFF-lore-accuracy.md` (commit 13a6703, local main, NOT pushed).
- Backend rules + state: `/Users/tianzefang/Desktop/ClaudeCode/Projects/ongoing/mtg-lore-ai/CLAUDE.md`, `docs/STATE.md`; experiment tables E1-E10: `docs/STATS.md`.
- Last backend commit: `9ae8cfe` on `main` (pushed). Diff there = the E8/E9/E10 code (`mtg_lore/rank_cards.py`, `mtg_lore/retrieve.py`).

## Where this session left off
- Served engine: plane scope (E9) on by default; dev P@10 .216, old5 .500, new6 .283, judged strict .531.
- E8 (`MTG_LORE_NAME_WORDS`) and E10 (`MTG_LORE_NAME_LORE`) are opt-in, off.
- taleforge-web local main is 1 commit ahead of origin (handoff doc). User not yet asked to push; that repo normally uses PRs.

## Waiting on the user
1. Full 318-article lore: adopt + refresh golden rows for plain character decks ("a Teferi/Garruk/Chandra/Ajani/Jace deck"), or keep parked. Gap explained in STATS.md "E10".
2. Held-out `--final` eval: only on explicit go-ahead.
3. Push taleforge-web handoff commit (direct to main vs PR).

## Next technical lever (if user says continue)
173 of 390 expected cards never enter the pool; widening recall (E7 HyDE, E8 name words) did not move top 10. Work on ranking pool cards for guild/mechanic queries (synergy signal), judged on cached-intent eval + adopt rule in the project handoff.

## Gotchas from this session
- Another Claude session ("projects-b5") works in the same mtg-lore-ai tree and may commit/push; check `git log`/`git status` before acting, use targeted edits on STATE.md.
- Project agent `precommit-reviewer` is not loaded when the session starts outside mtg-lore-ai; run its prompt (`.claude/agents/precommit-reviewer.md`) through a general-purpose agent.
- Scratch scripts load `.env` via `find_dotenv(usecwd=True)` and need `PYTHONPATH=<repo>`; judge runs can exceed 10 min, run in background.
- NVIDIA key: never print; extract inline only (pattern in project handoff).

## Suggested skills
- `nvidia-free`: before any new LLM call (judge, HyDE, summarize) prefer the free NVIDIA endpoint.
- `mattpocock-skills:diagnosing-bugs`: chasing why expected cards miss the pool or rank low.
- `mattpocock-skills:tdd`: for ranker/retrieval changes (repo keeps one small unittest per behavior).
- `caveman:verify-and-stop`: for the held-out `--final` run or adopt-rule checks without scope creep.
- `mattpocock-skills:pr`: if pushing the taleforge-web handoff through a PR.
