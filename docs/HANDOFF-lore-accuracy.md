# Handoff: mtg-lore-ai accuracy work (2026-10-23)

Backend repo: `../mtg-lore-ai`, branch `nvidia-summarize` (committed, not pushed, not merged). Full numbers: `../mtg-lore-ai/docs/STATS.md`. State: `../mtg-lore-ai/docs/STATE.md`.

## Done
- All 318 parsed articles summarized (314 free via NVIDIA nemotron, 4 via gpt-5-mini, $0.06). Parked as `data/lore_full.db` + `data/articles/summarized_full/`. Served lore is still the 96-article `data/lore.db`.
- Diagnosis (`tools/diagnose_stages.py`): of 390 expected cards, 33% reach top 10, 23% in pool but ranked below 10, 44% never enter pool (mostly sim rank >= 1000). Mechanics and mixed queries worst.
- Experiments E1-E7 (table in STATS.md). Only E1 adopted: `SIM_POOL_SIZE=400` (dev P@10 .198 -> .216, judged strict .485 -> .513).
- E2 request names (`MTG_LORE_REQUEST_NAMES=1`), E7 HyDE (`MTG_LORE_HYDE=1`): implemented, off by default. E7 gain marginal (dev .218, mechanics .070 -> .080).
- E6 full 318 lore: new-6 .217 < .267 rule, not adopted.
- 139 unit tests pass.

## Open / next
- Biggest loss = 44% expected cards never in pool. Retrieval-side fixes needed (better lore links, request embedding), not ranker weights.
- Decide whether to adopt full 318 lore (fails new-6 only; investigate why new-6 dropped).
- Held-out `--final` eval: run ONLY on explicit user go-ahead.
- Pre-2014 lore not covered. Wizards/Scryfall/Archidekt replies pending (see STATE.md).
- `eval/eval_results.csv` modified by eval runs.

## Constraints (mtg-lore-ai CLAUDE.md)
Never open/print `.env` or MOXFIELD_USER_AGENT. Moxfield 1 req/s, stop on 401/403/429. Ask before network calls beyond existing OpenAI/NVIDIA ones. Never commit without user ask. Never print NVIDIA key (`Projects/nvidia_key.txt`; extract with `grep -o 'nvapi-[A-Za-z0-9_-]*'`). zsh: use `${=var}` to word-split.

## Suggested skills
- `nvidia-free` (free NVIDIA endpoint before OpenAI)
- `mattpocock-skills:diagnosing-bugs` if chasing missing-from-pool cards
- `mattpocock-skills:tdd` for ranker/retrieval changes

## Run recipes
- Eval: `python3 -m eval.eval_golden --intent-cache --ranker --label X`
- Judge: `NVIDIA_API_KEY=... python3 -m tools.judge_top10 --label X`
- Adopt rule: old-5 new_lore P@10 >= .50, dev >= .198, new-6 >= .267.
