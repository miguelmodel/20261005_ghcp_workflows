# Subagents & Multi-Agent Orchestration with GitHub Copilot CLI

A 60-minute technical presentation for practitioners who are new to multi-agent systems in GitHub Copilot. It focuses on Copilot CLI subagents (built-in and custom agents, configuration, MCP, permissions and guardrails, `/fleet`, `/delegate` and related commands) and closes with an appendix on governance, plans and pricing, and billing through Azure.

**Live deck:** https://miguelmodel.github.io/20261005_ghcp_workflows/

## Repository layout

| Path | Contents |
|---|---|
| `brief.md` | Binding brief: scope, verified facts, review rubric, content and visual preferences |
| `research/` | Nine cited research reports (official sources, reviewed and approved) |
| `presentation-content.md` | Slide-by-slide content with speaker notes and per-slide sources |
| `presentation/<build>/` | Versioned Vite + GSAP deck builds (current: `2026-10-05T2153-v2-copilot-cli-subagents-orchestration`) |
| `agent-reviews/` | Review history for research, content and slides |
| `presentation-status.md` | Workflow progress log |

## Run locally

```bash
cd presentation/2026-10-05T2153-v2-copilot-cli-subagents-orchestration
npm install
npm run dev
```

Keyboard: arrows/Space to navigate, `N` speaker notes, `A` settings (themes, hide slides, PDF export), `F` fullscreen.
