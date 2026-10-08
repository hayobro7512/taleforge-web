# Taleforge Design System

Taleforge is a free, unofficial fan tool for Magic: The Gathering Commander players. You describe a deck idea — a character, a guild, a storyline — and it finds cards that fit, grouped into themes, each with a short original explanation and a source. **Not affiliated with or endorsed by Wizards of the Coast.**

The feel is calm, bookish, and a little arcane — a quiet library at night — rendered through a dark-first, slightly techy "quiet observatory" lens: near-black grounds, thin outlines, a faint grid/star texture, and one restrained brass accent.

This project has no existing codebase or Figma file — it was built from a written brief, two reference screenshots, and three mood-reference PDFs (award listings for dark, well-regarded one-page sites), so every token, component, and screen here is original work sized to Taleforge's stated needs, not a copy of another product.

## Sources
- `uploads/Screenshot 2026-10-05 at 9.18.30 PM.png` — Assassin's Creed Mirage promo (mood only: dark, ornate serif type, warm ember accent on near-black).
- `uploads/Screenshot 2026-10-05 at 9.18.47 PM.png` — Vault AI dashboard (mood only: near-black ground, radial glow, sparse star dots, eyebrow-label chips, pill CTA).
- `uploads/Cibby — One Page Website Award.pdf`, `uploads/Onmi — One Page Website Award.pdf`, `uploads/Vault AI — One Page Website Award.pdf` — OnePageLove award write-ups for three dark one-page sites, used for **mood and spacing only** (serif display headlines, bento/grid layouts, long soft scroll) — their layouts were not copied.
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — a curated collection of `DESIGN.md` files analyzed from other brands' design systems. GitHub access wasn't connected this session, so nothing was imported from it directly; it's referenced here as further reading — explore it yourself for more `DESIGN.md` examples to cross-reference against this one, or to see the format this design system's token/alias structure is loosely inspired by.

## Content Fundamentals

**Voice:** calm, precise, a little literary — like a knowledgeable librarian, not a hype-y SaaS bot. Short declarative sentences. No exclamation points, no "Unlock the power of AI."

**Person:** second person for instructions and UI copy ("Describe your deck idea"), first person plural sparingly for the product's own actions ("We'll find the cards"). Never first-person singular ("I found...") — Taleforge doesn't pretend to have a personality beyond a quiet tool.

**Casing:** sentence case everywhere — headings, buttons, labels. Never title case, never all-caps body copy. The one exception is mono labels/tags (evidence tags, eyebrow text), which are deliberately small-caps-via-uppercase with wide tracking, matching the "card catalog label" motif.

**Honesty about AI:** every generated explanation must be labeled, verbatim: *"Written by AI from the linked sources."* Never imply a human curator wrote it, never state a fact without a source link, never invent lore, statistics, or card legality rulings.

**Emoji:** none. Not part of this brand's voice at any scale.

**Example copy:**
- Hero: "Describe your deck idea. We'll find the cards."
- Evidence tag kinds: "Name match", "Story link", "Deck synergy", "Similarity" — sentence case, literal, no cute renaming.
- Empty/error states stay matter-of-fact: "Search is paused for maintenance." not "Oops! Something went sideways 🙃".
- Privacy note: "Taleforge doesn't require an account. Your deck ideas are used only to generate this search and aren't stored with your identity."

## Visual Foundations

**Color:** dark is the default and primary theme — a near-black, slightly blue-slate ground (`--n-0`, never pure black) that steps up through five more neutral stops for cards, raised surfaces, and borders. One accent carries the whole brand: a warm brass/candle-glow amber (`--accent-9`), used sparingly — one primary button per view, links, focus rings, the search CTA. A light theme exists as a secondary "daytime reading room" alternative (warm paper tones, deepened amber for contrast) via `[data-theme="light"]`; it is not the primary showcase. Per-result "side" groups each carry one muted glow color from a 6-hue palette (amber/teal/violet/rose/sage/slate) — color is always paired with a text label, never the only signal.

**Type:** three families, three jobs. **Spectral** (serif) is for large headlines only — it carries the "bookish, a little arcane" feeling and never appears below ~24px. **Manrope** (sans) is for everything you actually read: body copy, UI labels, buttons. **Space Mono** is reserved for small labels — evidence tags, eyebrow text, score numbers — always uppercase with wide tracking, evoking a card-catalog stamp. Body reading size is 15px (`--text-base`), slightly larger than typical UI defaults, for "easy to read" long-form explanations.

**Spacing:** a 4px-based scale (4/8/12/16/20/24/32/40/48/64/80/96/128). Cards default to 20px internal padding, 12px internal gaps, 24–32px between sections.

**Backgrounds:** flat near-black, no gradients, no hero photography. Two optional faint textures layer on top at low opacity: a 40px dot-grid (`.bg-grid`, "graph paper") and a sparse irregular star-field (`.bg-stars`) — both are CSS-only, never louder than the content, and skip entirely under `prefers-reduced-motion` concerns (they're static, but respect the same "stay quiet" instinct). No illustration, no stock fantasy art, no 3D.

**Animation:** short and quiet — 120/200/360ms durations, a single standard ease (`cubic-bezier(.2,.8,.2,1)`), no bounce, no spring. `prefers-reduced-motion: reduce` collapses all durations to near-zero globally. Loading states narrate their steps (`LoadingSteps`) rather than relying on a spinner's implied motion.

**Hover / press states:** hover deepens surfaces one neutral step (`--n-4`) or deepens the accent slightly (`--accent-10`); there is no lightening-on-dark-background trick. Press states are not separately animated (no shrink/scale) — the brand is deliberately still; focus states instead get a soft 3px accent-tinted glow ring (`--glow-focus`), which also doubles as the visible focus indicator for keyboard users.

**Borders:** thin 1px hairlines everywhere (`--border-w`), always translucent-feeling neutral tones, never a heavy 2px+ rule except the optional 1.5px "strong" border on hovered/focused inputs.

**Shadows / glow:** dark theme shadows are soft and mostly about separation, not depth drama (`--shadow-card`: two stacked soft black blurs). The signature effect is **glow**, not shadow — accent buttons, focused inputs, and side-groups all use a soft colored glow (`--glow-accent`, per-side glow in `SideGroup`) instead of a hard outline, which is what gives the "observatory" feeling of looking at something lit from within.

**Corner radii:** controls, chips, and buttons round to a full pill (`--radius-pill`); cards and panels stay rectangular with a calm 10–16px radius (`--radius-md`/`--radius-lg`); nothing is square, nothing is a perfect rounded-square icon tile.

**Cards:** `--surface-card` fill, 1px hairline border, soft `--shadow-card`, 16px radius, 20px padding — no colored left-border accent strip (explicitly avoided as an AI-slop trope).

**Imagery vibe:** none shipped — Magic card art is always a labeled gray placeholder ("Card art placeholder"), per the brief's "no fake card art" constraint. When real card images are wired in, they become the brightest thing on the page by design (everything else stays quiet, near-black, and muted) — don't add filters or overlays that fight that.

**Transparency/blur:** used once, deliberately — the `BottomSheet` scrim (`rgba(0,0,0,.5)`) on mobile. No frosted-glass panels elsewhere; the brand doesn't reach for blur as decoration.

## Iconography

No icon set, icon font, or SVG sprite was provided with the brief. The handful of functional glyphs needed (checkmark, close ×, dropdown chevron, sun/moon theme toggle) are drawn as minimal inline SVG, intentionally matching **Lucide's** thin 1.6–1.8px stroke weight and rounded joins — the closest CDN-available style match to "thin outlines" and the quiet, technical mood. **This is a flagged substitution**: if Taleforge adopts a specific icon set later, swap these glyphs and update `ThemeToggle.jsx`, `Checkbox.jsx`, `Select.jsx`, and `QueryChip.jsx` accordingly. No emoji, no unicode-as-icon tricks beyond the plain `×` close glyph and `▾`/`↗` characters used as literal typography (not icon substitutes) in a couple of mono labels.

## Fonts

Spectral, Manrope, and Space Mono are loaded from Google Fonts via `@import` in `tokens/typography.css` (part of `styles.css`'s import chain) — no font files are self-hosted in this project. If Taleforge licenses different display/body typefaces later, replace the `@import` URL and the three `--font-*` tokens in `tokens/typography.css`; nothing else needs to change.

## Components
Grouped by concern under `components/`. All are from-scratch, standard-set primitives sized to Taleforge's needs (no existing component library to match) plus a handful of intentional, product-specific additions called out below.

- **forms/** — `Button`, `IconButton`, `Input`, `Select`, `Checkbox`, `Switch`, `MixSlider`
- **feedback/** — `Badge`, `EvidenceTag`, `Tooltip`, `Banner`, `LoadingSteps`
- **navigation/** — `Tabs`, `ThemeToggle`
- **cards/** — `Card`, `ResultCard`, `SideGroup`, `QueryChip`, `ScoreBreakdown`

**Intentional additions** (no generic-component equivalent; built because the product needs them): `MixSlider` (story/synergy/similarity weight control), `EvidenceTag` + `ScoreBreakdown` (the evidence-kind tag and its hover score detail), `LoadingSteps` (loading that narrates its steps), `ResultCard` + `SideGroup` + `QueryChip` (the result-page vocabulary: one card, one theme group, one parsed query chip).

## UI Kit
`ui_kits/taleforge/` — an interactive click-through of the product: **Home** (query box, mix-weight sliders, beta badge + privacy line), **Results** (removable query chips, theme `SideGroup`s full of `ResultCard`s), and **States** (search-paused maintenance, daily-limit-reached, step-by-step loading, beta + privacy note). A header toggle switches the whole kit between a full-width **desktop** layout and a 390px **phone** frame — on phone, the mix sliders move from an inline panel into a bottom sheet, per the brief.

## Index
- `styles.css` — root stylesheet; imports every token file plus the Google Fonts `@import`.
- `tokens/colors.css` · `typography.css` · `spacing.css` · `effects.css` — design tokens (colors incl. light theme + side-glow palette, type, spacing/radius, shadows/glow/texture/motion).
- `guidelines/` — 16 foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab.
- `components/` — 19 React primitives across forms/feedback/navigation/cards (see above).
- `ui_kits/taleforge/` — the interactive product recreation (see above).
- `thumbnail.html` — project tile shown on the homepage.
- `SKILL.md` — portable skill definition for using this system in Claude Code.
- `github.md` — source-repo association record.

## Caveats & what would make this better
- No real card art, logo, or brand mark exists yet — card images are labeled placeholders and the wordmark is plain type in Spectral. If Taleforge has (or wants) a mark, share it and I'll wire it into `thumbnail.html`, the header, and favicon treatment.
- Iconography is a flagged Lucide-style substitution (see above) — confirm or swap.
- Colors, type, and the accent hue are my interpretation of "bookish, arcane, quiet observatory" — if the brass accent reads too warm/steampunk versus a cooler "starlight" direction, that's a fast swap in `tokens/colors.css` (just the `--accent-*` and `--side-*` values).
- The result-matching algorithm, real card data, and exact evidence-scoring logic are out of scope here — the design system only mocks their presentation.

**I'd love your eyes on this next** — tell me if the brass accent and Spectral serif land as "arcane library" rather than too warm/fantasy, and whether the side-glow palette reads clearly enough without relying on color alone. I can iterate on either in one pass.
