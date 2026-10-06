# Build plan: Subagents & Multi-Agent Orchestration with GitHub Copilot CLI

- **Topic slug:** `copilot-cli-subagents-orchestration`
- **Content version:** 2 (APPROVED `presentation-content.md`)
- **Build version:** v1 (initial build; no prior folder for this slug)
- **Build folder:** `presentation/2026-10-05T2042-v1-copilot-cli-subagents-orchestration/`
- **Built (UTC):** 2026-10-05T20:42:13Z
- **Initial theme:** GitHub Cosmos (`github-cosmos`). Warm, Corporate and Cyberpunk are also available in Settings.
- **Mode:** orchestrated. Visual preferences come from `brief.md`, section "Visual preferences" (Gate 3).

## Slide inventory

There are 49 slides in total: 39 counted slides (including 3 demo slots) plus 10 non-counted appendix slides.

| Section | Slides |
|---|---|
| Opening | 1–3 |
| Foundations | 4–7 |
| Built-in subagents | 8–12 |
| Custom agents | 13–18 |
| Configuration & MCP | 19–22 |
| Permissions & guardrails | 23–29 |
| Parallel & delegated workflows | 30–35 |
| Beyond the CLI | 36–37 |
| Recap & next steps | 38–39 |
| Appendix (non-counted) | 40–49 |

### By type

- **title-slide:** 1
- **transition:** 40 (appendix divider)
- **boxes / diagram / decision-tree (visual):** 2, 3, 5, 10, 15, 17, 20, 23, 28, 30, 37, 38, 48
- **table:** 4, 6, 8, 14, 19, 25, 33, 36, 41, 45, 46, 47, 49
- **comparison** (semantic comparison tables): 9, 16, 32, 43
- **quote:** 7
- **list:** 22, 27, 39, 44
- **code-example:** 11, 13, 18, 21, 24, 26, 31, 34, 42
- **demo-placeholder:** 12, 29, 35. Each shows a centered "Live demo" badge, the title and a short subtitle. Timing, setup and steps stay in the speaker notes.
- **break:** none (the brief has no break slide; demos act as breaks)
- **image:** none. No `image:` declarations, and the project has no `presentation-images/` directory.

## Hand-crafted visuals

All slides tagged `Visual: hand-craft`. Each file starts with `<!-- HAND-CRAFTED OVERRIDE — do not regenerate -->`.

| Slide | Visual | Approach |
|---|---|---|
| 2 | Why multi-agent | `.tool-grid` 2×2 `.tool-card`s with inline SVG icons, a trade-off takeaway and a definition callout |
| 3 | Map of seven ways | Two "question" chips, then 7 numbered route cards (4 + 3) in talk order, then a status legend with pill badges |
| 5 | Agent loop + `task` tool | `.flow-container`: main-agent loop panel, then `task` / result connectors, then a subagent panel; management-tool chips |
| 10 | Model/effort resolution | `.tier-stack` priority ladder (1–4) with a highest→lowest axis, plus an "Exceptions" card |
| 15 | Agent load order | `.tier-stack` of six tiers with path chips, plus two rule callouts |
| 17 | Tool scoping | CSS org-chart `.tree-container` (parent → `task` → two children with tool chips), plus ✔/✘ verdict cards |
| 20 | MCP precedence | `.tier-stack` of four layers, plus a "Beside the stack" side panel (agent level, built-in) |
| 23 | Layers of control | `.layer-stack` of seven bands (layer / mechanism / how it holds), plus a statement and prompt-injection callout |
| 28 | Creator ↔ reviewer | Absolute-positioned nodes with an inline SVG arrow cycle (①–④), plus a three-row guarantees panel |
| 30 | `/fleet` waves | Orchestrator step card, then Wave 1 (A/B/C), a shared-filesystem warning bar, then Wave 2 (D) with SVG connectors |
| 37 | GitHub.com hand-off | `.handoff-flow` of four nodes with arrows and an SVG self-review loop, plus three surface cards |
| 38 | Choosing a pattern | CSS decision tree (`.tree-question` / `.tree-branches` / `.tree-leaf`) with spine connectors and an "Always" bar |
| 48 | Azure billing flow | Two-column flow: GitHub → connect → Azure subscription; a daily usage arrow to the Azure invoice; two rule callouts |

No conceptual ASCII is rendered in `<pre>`. `<pre>` is used only for real config, code, terminal commands and the `/fleet` prompt typed into the terminal (slide 31).

## Implementation notes

- **Stack:** Vite `^6.3.5` (base `/`, `strictPort: false`), GSAP `^3.12.7`, vanilla ES modules, and a fixed 1920×1080 canvas scaled into the viewport with black letterboxing.
- **Slide loading:** slides load in parallel from `${import.meta.env.BASE_URL}slides/slide-NNN.html`. `TOTAL_SLIDES = 49`, and the app checks the DOM count against it.
- **Lifecycle badges:** `.badge-ga`, `.badge-preview` (public preview / experimental / Preview), `.badge-announce` ("included in the Copilot CLI GA announcement (2026-02-25)"), `.badge-shipped` ("shipped in … ; no separate status label") and `.badge-nodate` (no dated status). Badge text matches the content exactly. Every theme defines the badge colors so they meet WCAG AA.
- **Status lines:** these render as `.status-line` with a "Status" tag; badges wrap the lifecycle phrases inline in normal text flow.
- **Appendix:** slides 40–49 carry `.is-appendix`: a top accent rule, an "Appendix" pill (top-left), and the section label "Appendix".
- **Code:**
  - The required wrapping rules are present: `.code-block` uses `pre-wrap`, and `code-example` uses `pre`.
  - Exception: on slides 13, 18 and 26, `.code-wrap` restores `pre-wrap` for blocks whose long lines are prose. These are the Markdown agent prompts and the one-line hook decision JSON. Without it, those lines would be clipped horizontally.
  - Syntax-highlighting spans use per-theme tokens.
- **Density:** slides with dense diagrams, code or tables use `.is-dense`, which sets a 50px title and tighter gaps; table/code-size variants handle the rest. Visible slide text stays ≥ 22px.
- **Speaker notes:** Markdown notes are converted to HTML inside the hidden `.speaker-notes`, with sources appended. The shell renders them in a bottom band (`--notes-h`, 220–360px), and the canvas refits above the band.
- **Print:** 10in × 5.625in pages with zero margins and one visible slide per page, at `zoom: .5` (with a transform fallback). Hidden slides get `.print-hidden`. GSAP inline styles are saved and cleared before printing, then restored on `afterprint`.
- **Fit:** every slide is designed to the >40px clear-margin target at 1920×1080. A visual reviewer must confirm.
- **Images:** no image slides or declarations. A missing `presentation-images/` produces a warning only, and `public/images/` stays empty.
