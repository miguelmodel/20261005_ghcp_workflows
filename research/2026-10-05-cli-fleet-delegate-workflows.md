# Research Report: /fleet, /delegate and Copilot CLI Multi-Agent Workflows

**Date:** 2026-10-05
**Researcher:** Copilot Web Researcher Agent
**Topic slug:** cli-fleet-delegate-workflows
**Sources consulted:** 39 total — 25 GitHub Docs pages (docs.github.com), 2 GitHub Blog posts (github.blog), 8 GitHub Changelog posts (github.blog/changelog), 2 official repository files (github/copilot-cli), 2 third-party articles (labeled corroboration only)
**Revision:** Round 4 (2026-10-05; manual extra round). Addresses the remaining part of Review Round 3 finding F5: no standalone GA badges for features only named in the CLI GA announcement. F1–F4 and M1–M4 were closed in earlier rounds.
**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

> Assignment: R5 of brief `copilot-cli-subagents-orchestration`. Boundaries honored: built-in agent internals and delegation mechanics → R1; `.agent.md` details → R2; permissions/hooks → R4; github.com cloud agent internals and Agent HQ → R6; detailed pricing → R8. These topics are cross-referenced, not duplicated.

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overview and Key Concepts](#2-overview-and-key-concepts)
3. [/fleet in Depth](#3-fleet-in-depth)
4. [/delegate and the Copilot Cloud Agent](#4-delegate-and-the-copilot-cloud-agent)
5. [Other Out-of-the-Box Multi-Agent Commands and Modes](#5-other-out-of-the-box-multi-agent-commands-and-modes)
6. [Non-Interactive and Programmatic Use](#6-non-interactive-and-programmatic-use)
7. [End-to-End Workflow Patterns](#7-end-to-end-workflow-patterns)
8. [Usage and Cost Implications](#8-usage-and-cost-implications)
9. [Suggested Demo Scenarios](#9-suggested-demo-scenarios)
10. [Configuration, Best Practices, and Pitfalls](#10-configuration-best-practices-and-pitfalls)
11. [Research Limitations](#11-research-limitations)
12. [Complete Reference List](#12-complete-reference-list)

---

## 1. Executive Summary

GitHub Copilot CLI (generally available since 2026-02-25) gives you several distinct ways to run more than one agent. These are subagents the main agent delegates to, `/fleet` parallel orchestration, autopilot, `/delegate` hand-off to the Copilot cloud agent, built-in review and research agents, multiple parallel sessions, and, since 2026-10-01, **dynamic workflows** (public preview) ([GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [dynamic workflows changelog](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/)). These features overlap, so a talk for newcomers should separate them by **who decides the decomposition** (Copilot or your code) and **where the work runs** (your machine or GitHub's cloud) ([Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows); [Delegating tasks to Copilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca)).

Key takeaways:

- **`/fleet`** makes the main agent act as an orchestrator. It splits a request into independent work items, sends them to subagents in parallel "waves", checks their output, and combines the results. Each subagent has its own context window, but they all share one filesystem with **no file locking** ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet); [GitHub Blog, 2026-04-01](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)). The command shipped in CLI v0.0.411 (2026-02-17), whose changelog entry says it is "now available to all users". No separate status label exists ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)). The docs also describe a `--fleet` command-line option ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). No dated release evidence was found for that option, so it carries no status label here and is excluded from the demos.
- **Prompt quality determines how much runs in parallel.** Name concrete deliverables, assign file boundaries, and state dependencies explicitly. Vague prompts run sequentially ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)).
- **Parallelism is capped.** The default number of concurrent subagents depends on your plan: 2 (Free/Education), 4 (Pro/Pro+), 8 (Max), 16 (Business), 32 (Enterprise and usage-based billing). Default nesting depth is 6 per the current reference, but changelog v1.0.71 says 4 (§11, item 9) ([command reference — Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **`/delegate`** (or a `&` prompt prefix) sends work to the **Copilot cloud agent** (formerly "Copilot coding agent"). Copilot asks to commit your unstaged changes to a new branch as a checkpoint. The cloud agent then opens a draft PR and keeps working even if you shut down your machine. This is different from *remote control* (`--remote`, `/remote on`), which only lets you steer a session that is still running locally ([Delegating tasks](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca); [2025-10-28 changelog](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/); [Steering a CLI session remotely](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely)).
- **Other built-in multi-agent commands** include:
  - `/review` (built-in `code-review` agent).
  - `/security-review` (public preview). It shipped in CLI v1.0.51 (2026-05-20) and was announced on 2026-06-10 as experimental. CLI v1.0.64 (2026-06-23) made it "available to all users without --experimental".
  - `/rubber-duck` (critique from a different model).
  - `/research` (built-in research agent that writes a cited report).
  - Plan mode, autopilot, `/pr`, `/tasks`, and the Sessions tab and sidebar.

  Sources: [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [security-review changelog](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/); [copilot-cli changelog (main, raw)](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md). Each command's lifecycle label is in §2.1.
- **Automation:** use `copilot -p` with pre-approved tools and `--no-ask-user`. A fleet run can be started with `copilot -p "/fleet <YOUR TASK>" --no-ask-user` ([GitHub Blog, 2026-04-01](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)). The `--fleet` option is undated (see above). GitHub recommends GitHub Agentic Workflows over calling `copilot` directly in Actions steps ([Running CLI programmatically](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically); [Using CLI in Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)).
- **Cost:** parallel subagents *may* mean more model calls and therefore more GitHub AI Credits. The docs say fleet "may" increase consumption; they don't say it always does. The available controls are all soft or approximate, and some are in preview:
  - AI-credit limits (`/limits`, `--max-ai-credits`; public preview).
  - `/goal --max-ai-credits`.
  - Dynamic-workflow limits.
  
  ⚠️ The docs disagree on whether the interactive `/limits` cap applies per response or across the whole session (see [§11, item 5](#11-research-limitations)). Don't present it as a verified overall session budget. Account and organization budgets are separate controls covered in R8 ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet); [session limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit); [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

---

## 2. Overview and Key Concepts

### 2.1 Feature status at a glance

Status labels follow the brief's binding lifecycle rule, applied to sources read on 2026-10-05:

- **GA** appears only where an official source states GA for that specific item. That covers Copilot CLI itself (2026-02-25), the rubber duck agent (2026-06-02) and the Copilot SDK (2026-06-02).
- Features named in the 2026-02-25 Copilot CLI GA announcement, but without their own GA statement, are labeled "included in the Copilot CLI GA announcement (2026-02-25)". Where dated changelog evidence exists, the label adds "shipped in CLI <version> (<date>)". These features are not given a standalone per-feature GA badge.
- **Preview / experimental** appears only where an official source states it.
- Features with dated release evidence but no explicit status label are shown as "shipped in CLI <version> (<date>); no separate status label". They are never badged GA.
- Features with no dated evidence are listed separately below the table. They carry no label and are not used in demos.

Version numbers and dates come from the official `github/copilot-cli` changelog: [tag v1.0.11](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) for releases up to v1.0.10, and [main](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) for later releases.

| Feature | Lifecycle label | Dated evidence | Source |
|---|---|---|---|
| Copilot CLI | **GA** | GA 2026-02-25 (public preview since 2025-09) | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| Plan mode | Included in the Copilot CLI GA announcement (2026-02-25); shipped in CLI v0.0.387 (2026-01-20) | Announced 2026-01-21 | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md); [2026-01-21 changelog](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/) |
| Autopilot mode | Included in the Copilot CLI GA announcement (2026-02-25); "now available to all users" in CLI v0.0.411 (2026-02-17) | Experimental in CLI v0.0.400 (2026-01-30) | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) |
| Background delegation (`&`, equivalent to `/delegate`) | Included in the Copilot CLI GA announcement (2026-02-25); `&` shipped in CLI v0.0.384 (2026-01-16) | `/delegate` announced 2025-10-28 (during CLI public preview); `/delegate --base` shipped in v1.0.69 (2026-07-07) | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [2025-10-28 changelog](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/); [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `/review` | Included in the Copilot CLI GA announcement (2026-02-25); shipped in CLI v0.0.388 (2026-01-20) | — | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) |
| `/resume` (switch between local and remote sessions) | Included in the Copilot CLI GA announcement (2026-02-25); shipped in CLI v0.0.386 (2026-01-19) | — | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) |
| `/rubber-duck` (rubber duck agent) | **GA** (feature-specific announcement) | GA 2026-06-02; `/rubber-duck` added as experimental in CLI v1.0.49 (2026-05-18) | [2026-06-02 changelog](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `/fleet` slash command | Shipped in CLI v0.0.411 (2026-02-17), "now available to all users"; no separate status label | Orchestrator validation v0.0.412 (2026-02-19); autopilot + fleet plan option v0.0.415 (2026-02-23); guidance blog 2026-04-01 | [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md); [blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) |
| `/tasks` | Shipped in CLI v0.0.404 (2026-02-04); no separate status label | — | [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) |
| Subagent depth and concurrency limits | Shipped in CLI v1.0.22 (2026-04-09); no separate status label | Current values: see §3.6 and §11, item 9 | [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `/research` | Shipped in CLI v0.0.417 (2026-02-25); no separate status label | — | [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) |
| `/pr` | Shipped in CLI v1.0.5 (2026-03-13); no separate status label | The self-paced `/pr auto` loop was described in v1.0.66 (2026-06-30) | [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `--autopilot`, `--plan`, `--mode` options | Shipped in CLI v1.0.23 (2026-04-10); no separate status label | `--plan --mode autopilot` (plan-then-autopilot) v1.0.79 (2026-08-10) | [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `--max-autopilot-continues` | Shipped by CLI v1.0.40 (2026-05-01), whose entry sets a default of 5 continuations "configurable with --max-autopilot-continues"; no separate status label | See §11, item 4 for the current-docs conflict | [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `/autopilot OBJECTIVE`, `/goal` | Shipped in CLI v1.0.55 (2026-05-28); no separate status label | `/autopilot` toggle v1.0.45 (2026-05-11) | [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| Remote control (`--remote`, `/remote`) | Shipped in CLI v1.0.25 (2026-04-13); no separate status label. Requires the remote sessions feature on your account. | `/remote on`/`off` v1.0.36 (2026-04-24) | [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md); [Steering a CLI session remotely](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely) |
| `--connect` | Shipped in CLI v1.0.32 (2026-04-17); no separate status label | — | [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| Sessions tab and sidebar (multiple concurrent sessions) | Shipped in CLI v1.0.79 (2026-08-10), "Manage multiple concurrent sessions from the Sessions tab and sidebar"; no separate status label | Experimental in v1.0.10 (2026-03-20) and v1.0.76 (2026-07-29) | [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `/fork` | Shipped in CLI v1.0.45 (2026-05-11); no separate status label | — | [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `/worktree`, `/move`, `--worktree` | `/worktree` shipped in CLI v1.0.61 (2026-06-09). `--worktree` was experimental in v1.0.64 (2026-06-23). v1.0.85 (2026-09-16) allows `/worktree`, `/move` and `--worktree` "without enabling experimental mode". No separate status label. | — | [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `/security-review` | **Public preview**, announced 2026-06-10 as "an experimental feature in public preview". No later GA label found. | Shipped in CLI v1.0.51 (2026-05-20). v1.0.64 (2026-06-23) made it "available to all users without --experimental". The Copilot app version was public preview on 2026-07-14. | [security-review changelog](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md); [app changelog](https://github.blog/changelog/2026-07-14-security-reviews-now-available-in-the-github-copilot-app/) |
| `/every`, `/after` (scheduling) | **Experimental** | 2026-06-02 (editor's note 2026-06-03); v1.0.58 (2026-06-02) | [2026-06-02 changelog](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| Dynamic workflows (`/workflows`, `copilot workflow run`) | **Public preview**; the CLI needs `--experimental` | 2026-10-01 | [dynamic workflows changelog](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/) |
| AI credit session limits (`/limits`, `--max-ai-credits`) | **Public preview** (docs). Soft limit. Whether the interactive limit covers each response or the whole session is unresolved ([§11](#11-research-limitations)). | Session-limit behavior changed in CLI v1.0.66 (2026-06-30); 30-credit minimum in v1.0.67 (2026-06-30) | [session limits docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| Copilot SDK | **GA** | 2026-06-02 | [SDK GA changelog](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/) |
| SDK fleet binding (`session.rpc.fleet.start`) | **Experimental** binding (docs) | No release date found | [SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode) |

**No dated release evidence (unlabeled; research only; excluded from demos):**

- The `--fleet` command-line option. It is documented in the [how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion) and [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), but a sequential read of the `github/copilot-cli` changelog (main, raw, v1.0.91 back to v1.0.7; tag v1.0.11, v1.0.10 back to v0.0.355) found no entry introducing it.
- Teleporting into a subagent's view from `/tasks`. It is documented in the [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference). v1.0.79 (2026-08-10) only "improve[d]" an existing feature; its introduction was not identified.

The SDK fleet binding's explicit "experimental" label comes from the docs alone; no release date was found. It is presented with that label but is not used in demos.

### 2.2 Terminology

- **Subagent:** a separate agent the main agent starts through the `task` tool. It has its own context window. Related tools are `read_agent` (check a background agent), `write_agent` (send a message to a running agent), and `list_agents` ([command reference — Agent and task delegation tools](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). How the main agent decides to delegate is covered in R1.
- **Orchestrator:** when you use `/fleet`, the main agent takes this role. It manages subtasks and their dependencies and runs subagents in parallel where possible ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)).
- **Wave:** a set of independent work items dispatched together. The orchestrator "polls for completion, then dispatches the next wave" ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)).
- **Background task:** a subagent or shell command that runs while you keep working. You manage these with `/tasks` ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Copilot cloud agent:** the current name for what the October 2025 changelog called "Copilot coding agent". Old `coding-agent` docs URLs now redirect to `cloud-agent` pages ([2025-10-28 changelog](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/); [Managing access to Copilot cloud agent](https://docs.github.com/en/copilot/concepts/enterprise/cloud-agent-access)).
- **GitHub AI Credits:** the usage unit in current CLI docs; "each credit equals $0.01 USD" ([session limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit)). Detailed billing, including legacy premium requests for annual plans, belongs to R8.

### 2.3 A map of the multi-agent surfaces

The most useful distinction for newcomers is who plans the work and where it runs. The dynamic-workflows docs compare autopilot, fleet, and dynamic workflows directly ([Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows)). The `/delegate` and session rows below come from the delegation and sessions docs ([Delegating tasks](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca); [multiple sessions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions)).

| Surface | Who decides the decomposition | Where it runs | Parallel? | Typical trigger |
|---|---|---|---|---|
| Automatic subagent delegation (R1) | Main agent, case by case | Local | Sometimes | Any prompt |
| `/fleet` | Copilot (orchestrator), each time | Local, shared filesystem | Yes, in waves | `/fleet PROMPT` (also inside `-p`), plan approval option; the documented `--fleet` option is undated (§2.1) |
| Autopilot | Copilot decides next steps | Local | Not by itself | Shift+Tab, `--autopilot`, `/autopilot`/`/goal` |
| Dynamic workflow (preview) | Workflow author, in code | Local (CLI/app/SDK) | Sequential, parallel, or both | Natural-language request, `copilot workflow run` |
| `/delegate` / `&` | Copilot cloud agent | GitHub cloud | Independent of your CLI | `/delegate PROMPT`, `& PROMPT` |
| Multiple sessions / worktrees | You | Local | Yes, one session per task | Sidebar `n`, `/new worktree`, `--worktree` |
| Remote control (not delegation) | You (steering from a browser or GitHub Mobile) | Local. The machine must stay online with the session running. | No | `--remote`, `/remote on` |

Remote control and `/delegate` are often confused. Remote control "lets you connect to a running Copilot CLI session from any browser or from GitHub Mobile". It requires that "the machine where the CLI session is running must be online, with the session actively running in a terminal". It does not move any work to the cloud ([Steering a CLI session remotely](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely)).

> "Unlike `/fleet`, where Copilot delegates work to subagents and coordinates their work in parallel, a dynamic workflow carries out a process defined in code."
> - Source: [Dynamic workflows in Copilot CLI and the Copilot app (GitHub Changelog, 2026-10-01)](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/)

---

## 3. /fleet in Depth

### 3.1 What it is and how it decomposes work

In `/fleet` mode the main Copilot agent first decides whether the prompt can be split into subtasks that subagents can handle efficiently. If it can, the main agent acts as orchestrator and runs subagents in parallel where dependencies allow ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)).

> "The /fleet slash command in Copilot CLI is designed to take an implementation plan and break it down into smaller, independent tasks that can be executed in parallel by subagents."
> - Source: [Running tasks in parallel with the /fleet command (GitHub Docs)](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)

The GitHub Blog describes the orchestration loop in five steps. The orchestrator (1) breaks the task into discrete work items with dependencies, (2) works out which items can run in parallel and which must wait, (3) dispatches independent items as background subagents at the same time, (4) polls for completion and then dispatches the next wave, and (5) verifies the outputs and combines any final artifacts ([GitHub Blog, Matt Nigh & Brian LaFlamme, 2026-04-01, updated 2026-04-14](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)). The changelog backs up the verification step: "/fleet orchestrator validates subagent work" (v0.0.412, 2026-02-19) ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)).

> "Each sub-agent gets its own context window but shares the same filesystem. They can’t talk to each other directly; only the orchestrator coordinates."
> - Source: [Run multiple agents at once with /fleet in Copilot CLI (GitHub Blog)](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)

⚠️ Treat the "can’t talk to each other" sentence as a description from April 2026, not a universal rule. The current command reference documents sibling messaging through `list_agents`/`write_agent` "when a subagent runs inside a parent session with shared sibling communication enabled". No source says whether `/fleet` turns that on ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [§11, item 3](#11-research-limitations)). The shared-filesystem warning is unaffected.

**Dependency waves (coordination model).** The SDK fleet-mode page describes the runtime's internal pattern. Subagents are dispatched "via the task tool, with SQL todos as the shared coordination state". The parent agent writes todos into a `todos` table and their dependencies into a `todo_deps` table. Each todo moves through the states `pending → in_progress → done` (or `blocked`). The orchestrator dispatches only todos whose dependencies are all `done` ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)). The same page says it is "still an open question" whether this schema is a stable contract, so present it as a conceptual model, not an API. The changelog also notes that the CLI hides "noisy todo bookkeeping queries and show[s] dependency details in timeline" (v0.0.422, 2026-03-05) ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)).

```sql
-- Source: https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode | Provenance: verbatim (canonical schema described as runtime guidance, not a stable SDK contract)
CREATE TABLE todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending'
);

CREATE TABLE todo_deps (
    todo_id TEXT,
    depends_on TEXT,
    PRIMARY KEY (todo_id, depends_on)
);
```

> - Source: [Fleet mode (Copilot SDK, GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode) | Provenance: verbatim

### 3.2 How /fleet uses subagents, custom agents and models

- **Separate context per subagent.** Each subagent's context window is separate from the main agent and from other subagents ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)).
- **Custom agents as specialists.** Copilot can pick a custom agent for a subtask on its own. You can also name one in the prompt with `@CUSTOM-AGENT-NAME`, for example "Use @test-writer to create comprehensive unit tests for" a named component ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)). The blog example puts an agent in `.github/agents/technical-writer.md` and references it as `@technical-writer.md` ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)). Agent file format and locations are covered in R2.
- **Model selection.** The concept page says "By default, subagents use a low-cost AI model". It also says you can request models inline within a larger prompt (its verbatim example fragment names "Use GPT-5.3-Codex, to create" and "Use Claude Opus 5, to analyze"), and that a custom agent's own `model` setting wins ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)). The CLI reference documents model precedence for subagents in this order: explicit per-call value, then the `subagents` override in `~/.copilot/settings.json`, then the agent definition, then the parent session. It also says that when the session model is `Auto`, subagents always inherit the resolved session model ([command reference — Custom agent frontmatter fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). These defaults are worded differently across sources; see [Research Limitations](#11-research-limitations). Model-selection details belong to R1/R2.
- **Bring-your-own provider.** "Built-in sub-agents (`/review`, `/task`, explore, `/fleet`) automatically inherit your provider configuration" ([CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).
- **Plugin worker types.** Plugins loaded with `--plugin-dir` can register agents as subagent types for the `task` tool (the docs' example is `task(agent_type="security-review")`), which fleet mode can then dispatch to ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)).

### 3.3 Starting fleet mode

There are three entry points:

1. **Interactive slash command:** `/fleet [PROMPT]`, described as "Enable parallel subagent execution of parts of a task" ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
2. **From plan mode:** press Shift+Tab to enter plan mode and build a plan. Then either choose **Accept plan and build on autopilot + /fleet**, or choose **Exit plan mode and I will prompt myself** and enter something like `/fleet implement the plan` ([How-to: /fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion)). The plan-approval menu has offered "autopilot+fleet for parallelizable work" since v0.0.415 (2026-02-23) ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)).
3. **Command line:** `--fleet`, combined with `-i`, `-p`, or piped stdin. It has no effect without a prompt and is not supported together with `--acp` ([How-to: /fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion); [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). ⚠️ **Lifecycle:** no dated release evidence was found for `--fleet` (see §2.1), so the examples below are documented reference material only. They are **not** status-labeled or used in the demos. For headless fleet runs in a demo, use the dated `/fleet` slash command inside `-p`, as shown in §6.2.

```shell
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion | Provenance: verbatim
# Run a task in fleet mode without an interactive session:
copilot --fleet -p "Refactor the utils package and update everything that calls it" --allow-tool write

# Pipe a prompt into fleet mode:
echo "Update the project dependencies and run the tests" | copilot --fleet

# Start an interactive session that begins in fleet mode:
copilot --fleet -i "Add unit tests for every module in the src directory"
```

> - Source: [Speeding up task completion with the /fleet command (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion) | Provenance: verbatim

**`/fleet` and autopilot are separate features.** Autopilot is about autonomy: Copilot keeps working without waiting for input. `/fleet` is about running subagents in parallel. You can use `/fleet` in a normal interactive session, where Copilot "may ask you to answer questions or make decisions" ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet); [How-to: /fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion)).

### 3.4 Prompting guidance

The GitHub Blog gives four pieces of guidance ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)):

1. **Name a concrete deliverable for every work item.** Each item should map to a file, a test suite, or a doc section. Quote: "Vague prompts lead to sequential execution because the orchestrator can’t identify independent pieces."
2. **Set explicit boundaries.** State which directories each track owns, what must not be touched, and which validation (lint, type checks, tests) must pass.
3. **Declare dependencies.** The orchestrator "will serialize those items and parallelize the rest."
4. **Use custom agents for different kinds of work**, for example a heavier model for complex logic and a lighter one for boilerplate docs.

```text
# Source: https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/ | Provenance: verbatim (two prompts from the post; this comment line is not part of the prompt)
/fleet Create docs for the API module:
- docs/authentication.md covering token flow and examples
- docs/endpoints.md with request/response schemas for all REST endpoints
- docs/errors.md with error codes and troubleshooting steps
- docs/index.md linking to all three pages (depends on the others finishing first)

/fleet Migrate the database layer:
1. Write new schema in migrations/005_users.sql
2. Update the ORM models in src/models/user.ts (depends on 1)
3. Update API handlers in src/api/users.ts (depends on 2)
4. Write integration tests in tests/users.test.ts (depends on 2)
 Items 3 and 4 can run in parallel after item 2 completes.
```

> - Source: [Run multiple agents at once with /fleet in Copilot CLI (GitHub Blog)](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) | Provenance: verbatim

The SDK fleet-mode best practices add the following ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)):

- Give each todo a durable ID and a complete description.
- Give each worker "complete context; sub-agents are stateless across calls".
- Require every worker to report what it changed, how it validated the change, and what is still blocked.
- Don't dispatch a single background subagent.
- Have the parent verify the combined result.

### 3.5 Monitoring and steering a fleet

`/tasks` lists the session's background tasks, including fleet subtasks. In the list, press Enter for details, **x** to kill a task, **r** to remove finished tasks, and Esc to exit ([How-to: /fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion)). The current command reference adds more shortcuts ([command reference — Tasks dialog shortcuts](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)):

- Enter can "teleport into the selected subagent's own session view", where you can send that subagent a steering message. This is documented, but no dated release evidence for its introduction was found, so it is not status-labeled or used in demos (§2.1).
- `a` toggles nested subagent levels.
- `f` shows finished tasks.
- **B** promotes a sync task to the background.
- Ctrl+X then `b` promotes the running task to the background.
- Pressing Esc twice stops background agents when the main agent is idle.

To check that the fleet is actually running in parallel, the blog suggests three things. First, confirm the plan shows several tracks. Second, run `/tasks`. Third, watch for progress on separate tracks. If the work still runs sequentially, stop it and ask for an explicit decomposition. After dispatch you can steer with follow-up prompts such as `List active sub-agents and what each is currently doing.` ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)).

### 3.6 Limits

The CLI caps nesting depth and concurrency "to prevent runaway agent spawning". Concurrency is counted across the entire session tree ([command reference — Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

| Limit | Default | Max |
|---|---|---|
| Max depth | `6` (per current reference; changelog v1.0.71 says 4, see §11, item 9) | `256` (v1.0.71: 128) |
| Max concurrent | plan-based (Free/Education `2`; Pro/Pro+ `4`; Max `8`; Business `16`; Enterprise `32`; Usage-based billing `32`) | `32` |

> "When the limit is reached, new subagent requests are rejected until an active agent completes."
> - Source: [GitHub Copilot CLI command reference — Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

Only users on usage-based billing can raise the limits, using `subagents.maxConcurrency` and `subagents.maxDepth`. Values are clamped to 32 and 256. Other plans ignore these settings ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). **What this means for the demo:** on a Free plan a fleet can run at most 2 subagents at a time, so parallelism is easier to show on Pro+ or above. Plan details belong to R8.

Other relevant limits from the same reference ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)):

- Only the root agent can write memories (`store_memory`/`vote_memory`).
- Built-in `explore`, `task` and `code-review` subagents do **not** receive repository instruction files.
- Custom agents running as subagents receive repository instruction files only if they set `include-custom-instructions: true`.

### 3.7 Failure modes and when NOT to use /fleet

| Failure mode | What happens | Mitigation | Source |
|---|---|---|---|
| Two subagents edit the same file | "the last one to finish wins—silently. No error, no merge, just an overwrite." | Give each subagent its own files. Use temporary files that the orchestrator merges, or set an explicit order. | [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) |
| Subagents lack context | "Sub-agents can’t see the orchestrator’s conversation history." | Make the `/fleet` prompt self-contained, or point to files the subagents can read. | [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) |
| Vague prompt | Work runs sequentially | List deliverables and dependencies, or ask for an explicit decomposition first. | [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) |
| Inconsistent assumptions across workers | "Parallel workers can produce inconsistent assumptions that the orchestrator must reconcile." | Have the parent agent review the result, then run `/review` and the tests. | [SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode) |
| Concurrency cap reached | New subagent requests are rejected until one finishes | Expect fewer parallel workers on lower-tier plans. | [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Unexpected AI-credit usage | More LLM interactions than a single agent would make | Use cheaper subagent models and check `/usage`. Session limits are a preview soft control, and it is unresolved whether they cap the whole session (see §8 and §11, item 5). | [fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet) |
| Prompt mode stops waiting for background tasks | The CLI "now warns when it stops waiting for background tasks and explains how to change the timeout limit" (v1.0.88, 2026-09-22) | Watch for this warning in `-p` runs. Separately, v1.0.87 (2026-09-21) made "Prompt mode exits successfully when a child task fails but the parent recovers", so a zero exit code doesn't prove every subagent succeeded. | [copilot-cli changelog (main, raw)](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |

**When not to use it.** Avoid `/fleet` for sequential work, for edits that touch the same files, for small tasks, and for "tasks that require continuous shared reasoning rather than clear ownership" ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode); [fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)).

> "For strictly linear, single-file work, regular Copilot CLI prompts are simpler and just as fast. Fleet adds coordination overhead, so it pays off when there’s real work to distribute."
> - Source: [Run multiple agents at once with /fleet in Copilot CLI (GitHub Blog)](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)

GitHub's own engineering blog makes the same point about delegation generally. A June 2026 change ("smarter subagent delegation", CLI 1.0.42+) made the CLI delegate more selectively. In A/B testing it cut tool failures per session by 23% and P95 user wait time by 5%, with no quality regression ([GitHub Blog, Pingping Lin & Yu Hu, 2026-06-12](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/)).

> "Subagents should be treated as a parallelism tool, not a pause button."
> - Source: [How we made GitHub Copilot CLI more selective about delegation (GitHub Blog)](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/)

---

## 4. /delegate and the Copilot Cloud Agent

### 4.1 What happens

The CLI offers two ways to let Copilot work autonomously. **Autopilot** runs locally in your session. **`/delegate`** sends the task to the Copilot cloud agent on GitHub ([Delegating tasks to Copilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca)).

> "pushes the task to Copilot cloud agent on GitHub. The work runs remotely: Copilot creates a branch, opens a draft pull request, and works in the background. Use `/delegate` when you want to hand off a task entirely and continue running even if you shut down your local machine."
> - Source: [Delegating tasks to Copilot (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca)

```text
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca | Provenance: verbatim (interactive CLI input; this comment line is not part of the input)
/delegate complete the API integration tests and fix any failing edge cases

& complete the API integration tests and fix any failing edge cases
```

> - Source: [Delegating tasks to Copilot (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca) | Provenance: verbatim

### 4.2 Branch and pull-request behavior

> "Copilot will ask to commit any of your unstaged changes as a checkpoint in a new branch it creates. Copilot cloud agent will open a draft pull request, make changes in the background, and request a review from you."
> - Source: [Delegating tasks to Copilot (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca)

After the session starts, the CLI prints a link to the PR and to the agent session on GitHub ([Delegating tasks](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca)). Later changelog entries changed the behavior in these ways ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)):

- `/delegate` "accepts optional prompt, uses conversation context" and supports GHE Cloud (`*.ghe.com`) (v0.0.394, 2026-01-24).
- The `&` prefix was added as the equivalent of `/delegate` (v0.0.384, 2026-01-16).
- In repositories with more than one remote, `/delegate` asks which remote to target (v0.0.422, 2026-03-05).

### 4.3 Requirements and constraints

- **Copilot cloud agent must be enabled.** It is "disabled by default" for Copilot Business and Enterprise until an administrator enables it. It is enabled by default for Pro, Pro+ and Max. Administrators can opt individual repositories out ([Managing access to Copilot cloud agent](https://docs.github.com/en/copilot/concepts/enterprise/cloud-agent-access)). Org/enterprise policy details belong to R7.
- **You must be signed in to GitHub.** "`/delegate` only works if you are also signed in to GitHub. It transfers the session to GitHub's server-side Copilot, not your provider." This applies even when you use a bring-your-own model provider ([CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).
- **The repository must have a GitHub remote.** The command reference describes `/delegate` as "Delegate changes to a remote repository with an AI-generated pull request" ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). No docs page lists formal prerequisites beyond these. See [Research Limitations](#11-research-limitations).

### 4.4 Tracking delegated work from the CLI

**Delegated (cloud) work.** When the delegated session starts, the CLI prints a link to the pull request and to the agent session on GitHub ([Delegating tasks](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca)). Inside the CLI, delegated cloud sessions appear in the full-screen **Sessions** tab, not in the sidebar. From the tab you can resume them and steer them locally. Press `a` to cycle between local, remote and all sessions ([multiple sessions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions)). Announcement posts describe `/resume` as the way to "switch between local and remote GitHub Copilot coding agent sessions" ([2026-01-21 changelog](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/); [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)). The command reference also lists `--connect[=SESSION-ID]` to "Connect directly to a remote session (optionally specify a session ID or task ID)". It conflicts with `--resume` and `--continue`, and it requires the remote sessions feature on your account ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). No docs page explicitly presents `--connect` as the route for `/delegate` tasks. For a demo, use the Sessions tab and the printed links.

**Remote control is not delegation.** `--remote` (or `/remote on`) enables remote access to the CLI session that is *currently running on your machine*, so you can steer it from GitHub.com or GitHub Mobile. The remote-control prerequisites are explicit: "The machine where the CLI session is running must be online, with the session actively running in a terminal." Remote control is also distinct from session syncing, which makes sessions view-only on GitHub.com ([Steering a CLI session remotely](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely)). You don't need `--remote` to track or resume `/delegate` work, and it does not move work to the cloud. One related sentence in the command reference about `--remote` with `--resume <TASK-ID>` is ambiguous; this report does not treat it as a cloud-resumption recipe (see [§11](#11-research-limitations)).

### 4.5 When to delegate vs. work locally

The best-practices guide recommends `/delegate` for tangential tasks, documentation updates, and refactoring separate modules. It recommends staying local for core feature work, debugging, and interactive exploration ([CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)). How the cloud agent works internally, and Agent HQ, are covered in R6.

---

## 5. Other Out-of-the-Box Multi-Agent Commands and Modes

The table below lists the built-in commands that start or rely on separate agents. Unless another link is given, names and descriptions are verbatim from the [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

| Command / mode | Purpose (from docs) | Agent involved |
|---|---|---|
| `/plan [PROMPT]`, Shift+Tab | "Create an implementation plan before coding." | Main agent; helper subagents inherit plan-mode restrictions |
| `/autopilot [OBJECTIVE]`, `/goal [OBJECTIVE]`, `--autopilot` | "Start or refocus autopilot mode, optionally with an explicit objective" | Main agent (continuation loop) |
| `/fleet [PROMPT]` (`--fleet` option documented but undated, §2.1) | "Enable parallel subagent execution of parts of a task." | Orchestrator + subagents |
| `/review [PROMPT]` | "Run the code review agent to analyze changes." | Built-in `code-review` |
| `/security-review [PROMPT]` | "Run a focused security review of active local code changes and return prioritized vulnerability findings with remediation suggestions." **Public preview**, announced 2026-06-10 as experimental. CLI v1.0.64 (2026-06-23) made it "available to all users without --experimental" ([changelog](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). | Built-in `security-review` |
| `/rubber-duck [PROMPT]` | "Consult the rubber duck agent for a second opinion on plans, code, and tests." | Built-in `rubber-duck` (complementary model) |
| `/research TOPIC` | "Run a deep research investigation using GitHub search and web sources." | Built-in `research` agent |
| `/delegate [PROMPT]`, `&` | "Delegate changes to a remote repository with an AI-generated pull request." | Copilot cloud agent |
| `/pr [view\|create\|fix\|auto\|automerge]` | "Manage pull requests for the current branch." | Main agent (scheduled loop for `auto`) |
| `/tasks` | "View and manage tasks (subagents and shell commands)." | All background agents |
| `/subagents`, `/agents` | "Configure default and per-agent subagent models." | Configuration (see R1) |
| `/workflows` | "Observe workflow runs, phases, agents, and progress. Requires a token-based-billing plan." | Dynamic-workflow agents (preview) |
| `/fork`, `/worktree`, `/new worktree`, `/move` | Fork sessions or move work into Git worktrees | Parallel sessions |

The command reference lists the built-in agents behind these commands and their default models; subagent internals belong to R1.

- `code-review` and `security-review` are listed with default model claude-sonnet-4.6, and the reference says they "Will not modify code". However, changelog v1.0.56 (2026-05-29) says the code-review agent now uses the session model (§11, item 10).
- `research` is listed with claude-haiku-4.5.
- `rubber-duck` is listed with a "complementary model".

Sources: [command reference — Built-in agents](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md).

### 5.1 Plan mode

Plan mode builds a structured plan with checkboxes, asks clarifying questions, saves `plan.md` in the session folder, and waits for your approval ([CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)). Edits to project files are blocked by enforcement in the tool, not by asking the model to comply. "Delegated sub-tasks are protected too": helper sessions inherit the same restrictions ([command reference — Security: Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

> "It's a safety net, not a guarantee."
> - Source: [GitHub Copilot CLI command reference — Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

**Plan-then-autopilot:** `--plan --mode autopilot` starts in plan mode and moves to autopilot automatically once the plan is ready, without waiting for a human to approve it. The environment variable `COPILOT_PLAN_THEN_AUTOPILOT` does the same thing ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). In the SDK, a plan-mode UI can return the `autopilot_fleet` exit action to start "parallel autonomous workers" ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)). Plan-mode guardrails are covered in R4.

### 5.2 Autopilot

In autopilot, Copilot keeps working until one of these happens: the task is complete, a problem blocks progress, you press Ctrl+C, or it hits the continuation limit ([autopilot concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)). Autopilot cannot take actions that need permission unless you grant full permissions. If you choose "Continue with limited permissions", tool requests that need approval are denied automatically ([autopilot concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)). `/goal` accepts `--max-ai-credits N`. When the cap is reached, autopilot pauses and shows a panel where you can resume with a fresh credit window ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

```shell
# Source: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot | Provenance: verbatim
copilot --autopilot --yolo --max-autopilot-continues 10 -p "YOUR PROMPT HERE"
```

> - Source: [Allowing GitHub Copilot CLI to work autonomously (GitHub Docs)](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot) | Provenance: verbatim

`--no-ask-user` is different from autopilot. It suppresses clarifying questions but does not let the agent keep going through successive model calls, so "the CLI won't use additional GitHub AI Credits without your involvement" ([autopilot concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).

### 5.3 /review and /security-review (agentic code review)

`/review` reviews your changes before you commit. You can give it a prompt, path, or file pattern to narrow the scope, and it asks before running inspection commands such as diffs ([Requesting a code review](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review)). It is available non-interactively ([Running CLI programmatically](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically)):

```shell
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically | Provenance: verbatim
copilot -p '/review the changes on this branch compared to main. Focus on bugs and security issues.' \
  -s --allow-tool='shell(git:*)'
```

> - Source: [Running GitHub Copilot CLI programmatically (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically) | Provenance: verbatim

The best-practices guide suggests a review flow that uses several models. For example: ``/review Use Claude Opus 5 and GPT-5.3-Codex to review the changes in my current branch against `main`. Focus on potential bugs and security issues.`` It also suggests `/security-review` before opening a PR ([CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).

**`/security-review` status and enablement.** Lifecycle evidence, in order:

1. The command was added in CLI v1.0.51 (2026-05-20) ([main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)).
2. It was announced on 2026-06-10 as "an experimental feature in public preview". The announcement instructed users to turn on experimental mode ([security-review changelog](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/)).
3. CLI v1.0.64 (2026-06-23) then made it "available to all users without --experimental" ([main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). On current CLI versions, the experimental-mode prerequisite from the announcement no longer applies.
4. No later GA label was found as of 2026-10-05. The 2026-07-14 Copilot app announcement still calls the command "public preview" ([app changelog](https://github.blog/changelog/2026-07-14-security-reviews-now-available-in-the-github-copilot-app/)).

Present it as **public preview**, and note that CLI versions older than v1.0.64 need `--experimental` or `/experimental on` ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Per the announcement, it flags high-impact vulnerabilities across 11 categories, scores its findings by severity and confidence, and does not rely on GitHub code scanning, Dependabot or secret scanning ([security-review changelog](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/)).

> "The new /security-review slash command is shipping as an experimental feature in public preview, giving you a fast, AI-driven way to catch security vulnerabilities before they reach production code."
> - Source: [Dedicated security review command now available in Copilot CLI (GitHub Changelog, 2026-06-10)](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/)

`/security-review` "is not a full repository security audit" ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). `code-review` and `security-review` "never forward a full review to another review agent". `code-review` can, however, hand security-specific parts to `security-review`, and both can hand narrow fact-finding to `explore` ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Creator↔reviewer patterns are covered in R4, and github.com Copilot code review in R6.

### 5.4 /rubber-duck

The rubber duck agent is a read-only critic. It deliberately runs on **a different model family** from the session model and sorts its feedback into blocking issues, non-blocking issues, and suggestions. Copilot consults it automatically at high-leverage moments, such as after planning and before implementing. You can also call it with `/rubber-duck` or with a prompt like `Rubber duck your plan.` It adds latency and extra model usage ([About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)). Status: **GA** since 2026-06-02 (feature-specific announcement) ([changelog](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/)).

### 5.5 /research (verified: it exists)

`/research TOPIC` (shipped in CLI v0.0.417, 2026-02-25; no separate status label ([v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md))) starts "a specialized research agent". The agent gathers information from your codebase, GitHub repositories, and the web, and writes a Markdown report with citations. It "never interrupts you with clarifying questions" and records its assumptions in a "Confidence Assessment" section ([Researching with Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research)). Its model is fixed and "not configurable via the `/model` command". Reports are saved under `~/.copilot/session-state/SESSION-ID/research/`. You can share them with `/share gist research` or `/share file research [PATH]`, and open the latest one with Ctrl+Y ([Researching with Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research)).

> "`/research` produces a report, not code modifications."
> - Source: [Researching with GitHub Copilot CLI (GitHub Docs)](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research)

### 5.6 /pr (PR lifecycle loop)

`/pr fix` runs three phases in order: review feedback, then conflicts, then CI. `/pr auto` creates a PR if none exists, then loops through the fix phases until the PR is green. The loop runs "as a self-paced schedule rather than as a single, continuous turn" that you check or stop with `/every`. `/pr automerge` (alias `agentmerge`) enables auto-merge once the PR is green. The repository must be hosted on GitHub ([Managing pull requests with the /pr command](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/manage-pull-requests)). Lifecycle: `/pr` shipped in CLI v1.0.5 (2026-03-13), with no separate status label. The introduction date of the `auto` subcommand was not identified; the self-paced loop was described in v1.0.66 (2026-06-30). `/pr auto` is therefore not used in the demos ([v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)).

### 5.7 Background tasks, multiple sessions and worktrees

You can run several local sessions side by side, which helps when you are "waiting on a long-running task" or "handing work off". A local session stays active "for as long as the Copilot CLI process running it stays open", with no inactivity timeout ([Working with multiple sessions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions)). Commands that isolate parallel work on separate branches ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)):

- `/fork` runs while the agent is busy, and the source session keeps working.
- `/fork worktree` and `/new worktree` create a new Git worktree for the forked or new session.
- `-w/--worktree[=NAME]` starts the session in an isolated worktree.

**Synthesis (not an official recommendation):** separate sessions in separate worktrees avoid the shared-filesystem overwrite risk of `/fleet` noted in §3.7. The cost is that you coordinate the sessions yourself.

### 5.8 Dynamic workflows (public preview, 2026-10-01)

A dynamic workflow is "a program that defines how a task is carried out". It lives in a Copilot extension (`extension.mjs`) and combines deterministic steps with agents running in sequence, in parallel, or both. It can pause at checkpoints and resume later ([Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows)). Availability ([changelog, 2026-10-01](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/); [Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows)):

- It runs in the CLI (with `--experimental` or `/experimental on`), the GitHub Copilot app, and the SDK.
- The 2026-10-01 announcement says "Dynamic workflows are available on all Copilot plans". The current concept docs narrow that: they exclude "Copilot Pro and Copilot Pro+ subscribers on existing annual plans who remain on legacy premium request-based billing". Separately, the command reference says `/workflows` "Requires a token-based-billing plan" ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Use the docs wording on slides.

Limits you can set ([Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows)):

- Maximum concurrent and total workflow-owned agents.
- Active running time.
- Approximate AI credits.

You can set limits in the prompt, in the workflow code, or as personal defaults (`workflows.defaultLimits.maxConcurrentSubagents`, `maxTotalSubagents`, `timeoutSeconds`, `maxAiCredits`), in that priority order. Subagents in a workflow inherit the session's permission grants. `copilot workflow run` shows no approval prompts. You monitor, pause (P), cancel (X) and resume (R) runs from `/workflows` ([Using dynamic workflows](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows)). Recommended practice is to test on a small scope first and then set an AI-credit limit for the full run ([Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows)).

---

## 6. Non-Interactive and Programmatic Use

### 6.1 `copilot -p` and the flags that matter

`-p`/`--prompt` runs a single prompt and exits. Piped stdin also works but is ignored when you pass `-p` ([Running CLI programmatically](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically)). The programmatic reference lists the options most relevant to automation ([programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference); [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)):

| Option | Use in automation |
|---|---|
| `-p PROMPT` | Non-interactive run. The exit summary includes a `copilot --resume=SESSION-ID` hint. |
| `-s`, `--silent` | Prints only the agent response |
| `--no-ask-user` | Disables the `ask_user` tool |
| `--allow-tool` / `--deny-tool` / `--available-tools` / `--excluded-tools` | Least-privilege tool scoping (patterns covered in R4) |
| `--allow-all` / `--yolo` | All permissions. GitHub advises against this outside a sandbox. |
| `--fleet` | Fleet orchestration for `-p`, `-i` or piped input. Not supported in ACP mode. No dated release evidence (§2.1), so it is unlabeled and not used in demos. |
| `--autopilot`, `--max-autopilot-continues=COUNT` | Autonomous continuation with a cap on continuations |
| `--plan --mode autopilot` | Plan-then-autopilot |
| `--model=MODEL`, `--effort` | Pin the model and reasoning effort so runs are reproducible |
| `--max-ai-credits=CREDITS` | Soft AI-credit cap (public preview, minimum 30). In non-interactive mode the how-to says it applies for the duration of the task and the run ends at the limit. The reference describes it as per response. See §11, item 5. It is not a substitute for account or organization budgets (R8). |
| `--output-format=json` | JSONL output for parsing |
| `--share=PATH`, `--share-gist` | Export the transcript for auditing |
| `--secret-env-vars` | Redact secrets. `GITHUB_TOKEN`/`COPILOT_GITHUB_TOKEN` are redacted by default. |

> "Non-interactive (`-p`) runs can't display an interactive approval prompt, so any action that isn't pre-approved is denied automatically."
> - Source: [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)

### 6.2 Fleet in non-interactive mode

There are two documented ways to run a fleet without an interactive session. The docs use the `--fleet` option (`copilot --fleet -p "PROMPT" --allow-tool write`) ([How-to: /fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion)). The blog embeds the slash command in the prompt: `copilot -p "/fleet <YOUR TASK>" --no-ask-user`. The blog says `--no-ask-user` "is required for non-interactive mode, since there’s no way to respond to prompts" ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)). The docs say `--fleet` is "particularly useful for automation, using the `-p` option, when you know that a task can be split into parts that run in parallel" ([How-to: /fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion)). **Lifecycle:** this report uses the `-p "/fleet <YOUR TASK>"` form in its demos and its synthesized workflow, because it relies on the dated `/fleet` command (shipped in CLI v0.0.411, 2026-02-17) and a dated GitHub Blog example (2026-04-01). The `--fleet` option has no dated release evidence (§2.1).

### 6.3 Running the CLI in GitHub Actions

**Recommended path.** GitHub recommends GitHub Agentic Workflows (`github/gh-aw`) "for most automation use cases" rather than calling `copilot` directly in workflow steps. Agentic Workflows use `GITHUB_TOKEN` by default and add guardrails ([Automating tasks with Copilot CLI and GitHub Actions](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/automate-with-actions)). Agentic Workflows themselves are covered in R6.

**Authentication and billing options** ([About using Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions)):

- **Fine-grained PAT** with the "Copilot Requests" permission, passed as `COPILOT_GITHUB_TOKEN`. Usage is billed to that user's seat.
- **Built-in `GITHUB_TOKEN`** (recommended for organization-owned repos). In an org repo, usage is metered to the organization. This requires the "Allow use of Copilot CLI billed to the organization" policy and the workflow permission `copilot-requests: write`. User-level budgets do not apply to this usage; use cost centers instead ([Using CLI in Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)).
- Classic PATs (`ghp_`) are not supported ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

```yaml
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions | Provenance: verbatim
name: Copilot CLI example
on: [push]

permissions:
  contents: read
  copilot-requests: write

jobs:
  copilot:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 2
      - name: Install Copilot CLI
        run: npm install -g @github/copilot
      - name: Run Copilot
        run: copilot -p "Use git show HEAD to summarize the changes in this commit" -s --allow-tool='shell(git show:*)'
        env:
          GITHUB_TOKEN: ${{ github.token }}
```

> - Source: [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions) | Provenance: verbatim

> "Invoking Copilot CLI directly in workflow steps gives it broad access to your workflow environment. Review your workflow triggers and permissions carefully before using this approach. Workflows triggered by pull requests from forks are particularly at risk."
> - Source: [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)

The following **synthesized** variant adds fleet mode and a credit cap. Every option comes from the sources cited, but GitHub has not published this exact combination. Test it on a branch before using it in a talk.

```yaml
# Source: synthesized from https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions,
#   https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/ and
#   https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit | Provenance: synthesized
name: Copilot fleet docs draft
on:
  workflow_dispatch:

permissions:
  contents: read
  copilot-requests: write

jobs:
  fleet-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - name: Install Copilot CLI
        run: npm install -g @github/copilot
      - name: Run Copilot CLI in fleet mode
        env:
          GITHUB_TOKEN: ${{ github.token }}
        run: |
          set -euo pipefail
          copilot \
            -p "/fleet Create docs/authentication.md, docs/endpoints.md and docs/errors.md in parallel, then docs/index.md linking to all three (depends on the others). No changes outside docs/." \
            -s --no-ask-user \
            --allow-tool=write \
            --max-ai-credits 100
      - name: Summarize changed paths only (no transcript)
        run: |
          git status --short >> "$GITHUB_STEP_SUMMARY"
          if git status --porcelain | grep -v ' docs/' | grep -q .; then
            echo "Files outside docs/ were changed; failing the job." >&2
            exit 1
          fi
```

> - Source: synthesized from [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions), [Run multiple agents at once with /fleet in Copilot CLI (GitHub Blog, 2026-04-01)](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/), and [Setting an AI credit session limit](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) | Provenance: synthesized

Notes on the synthesized workflow:

- **Lifecycle (Round 3).** This variant starts fleet mode with the dated `/fleet` slash command inside `-p`, the form shown in the GitHub Blog, rather than the `--fleet` option, which has no dated release evidence (§2.1). The AI-credit limit is public preview.

- **File boundaries are enforced only by the prompt.** `--allow-tool=write` approves writes anywhere the CLI can reach. The "No changes outside docs/" instruction is a request to the model, not a permission boundary. The final step only *detects* stray changes after the fact. Precise path-scoped permissions belong to R4.
- **The transcript is not published.** Session transcripts "may contain sensitive information" ([programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)), so this variant doesn't use `--share` and writes only changed paths to the step summary. If you need a transcript for auditing, keep it as a restricted artifact rather than in the public run summary.
- **The credit cap is a preview soft control.** `--max-ai-credits` must be at least 30. In non-interactive mode, the how-to says the run ends when the limit is reached ([session limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit)). The command reference words the same flag as a per-response limit (§11, item 5). Organization billing controls for `GITHUB_TOKEN` usage are cost centers (§8 and R8).
- **A zero exit code doesn't prove every subagent succeeded.** Since v1.0.87 (2026-09-21), "Prompt mode exits successfully when a child task fails but the parent recovers" ([copilot-cli changelog (main, raw)](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)).
- **The job cannot push.** With `contents: read`, persisting changes needs a separate, deliberately permissioned step.

### 6.4 Running a dynamic workflow from scripts (preview)

```shell
# Source: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows | Provenance: verbatim
copilot --allow-tool=read workflow run java-security-checks \
   --args @workflow-input.json \
   --silent --output-format json
```

> - Source: [Using dynamic workflows (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows) | Provenance: verbatim

`copilot workflow run` cannot be combined with `-p`, `-i`, `--agent`, `--fleet`, `--autopilot`, `--resume` or `--continue`. Exit codes ([programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)):

- `0` = completed.
- `1` = did not complete (paused, limit reached, cancelled, or failed).
- `2` = workflow not found, or bad arguments.
- `130` = interrupted.

Loading project extensions in automation needs `GITHUB_COPILOT_PROMPT_MODE_EXTENSIONS=true`. Only set it "for repository code you trust" ([programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)).

### 6.5 Copilot SDK orchestration and fleet mode (brief)

The Copilot SDK became GA on 2026-06-02 with bindings for Node.js/TypeScript, Python, Go, .NET, Rust and Java. It exposes "the same agent runtime behind GitHub Copilot" ([SDK GA changelog](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/)). Sessions accept `customAgents`, each with its own `prompt`, `tools`, `mcpServers`, `model`, `reasoningEffort`, `skills`, and `infer`. The runtime "automatically delegates to that agent as a sub-agent" ([SDK custom agents and sub-agent orchestration](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)). Fleet mode is exposed as the `session.fleet.start` RPC. The binding is **experimental** and has been verified in TypeScript, Python, Go, .NET and Rust, but not Java. Subagent lifecycle shows up as `subagent.started`, `subagent.completed`, `subagent.failed`, and related events ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)).

> "The binding is experimental in the generated RPC surface; pin both the SDK and the Copilot CLI runtime if your application depends on it."
> - Source: [Fleet mode (Copilot SDK, GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)

**Setup context (from the SDK quickstart).** The SDK needs:

- Copilot CLI installed and authenticated (the Node.js, Python and .NET SDKs provide the CLI automatically).
- Node.js 20+ for TypeScript.
- `npm install @github/copilot-sdk tsx`.

Sessions are created with `new CopilotClient()` and `client.createSession()` (passing a session config object) and are shut down with `client.stop()` ([SDK quickstart](https://docs.github.com/en/copilot/get-started/sdk-quickstart)). The custom-agents page shows the `onPermissionRequest` handler pattern ([SDK custom agents](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)). **No compatible SDK/CLI version pair is published for the experimental fleet binding.** The docs only say to "pin both the SDK and the Copilot CLI runtime" ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)), so a demo should record whichever versions it was rehearsed with.

The block below is the **official excerpt, not a standalone program**. It assumes an existing `session` created as in the quickstart. It proves only that fleet mode **started**.

```typescript
// Source: https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode | Provenance: verbatim (two official TypeScript excerpts)
// NON-STANDALONE FRAGMENT: assumes an existing `session`. `result.started` confirms only that fleet mode began;
// the docs define no "fleet finished" completion contract.
const result = await session.rpc.fleet.start({
    prompt: "Refactor each SDK package independently, then summarize the changes.",
});

if (result.started) {
    console.log("Fleet mode started");
}

session.on((event) => {
    if (event.type === "subagent.started") {
        console.log(`Started ${event.data.agentDisplayName}`);
    }

    if (event.type === "subagent.completed") {
        console.log(`Completed ${event.data.agentDisplayName}`);
    }
});
```

> - Source: [Fleet mode (Copilot SDK, GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode) | Provenance: verbatim

**Completion boundary (what is and isn't documented).**

- The fleet page documents `result.started` and the lifecycle event names `subagent.started`, `subagent.completed`, `subagent.failed`, `subagent.selected` and `subagent.deselected` ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)).
- It does **not** document an event or RPC that signals that the whole fleet has finished or succeeded.
- `session.idle` is documented only for ordinary message streaming ([SDK quickstart](https://docs.github.com/en/copilot/get-started/sdk-quickstart)).

So an application should not treat the first idle event, or a timeout, as proof of success. It should apply its own policy: count `subagent.failed` events, verify the workspace with tests or a diff, and keep the parent agent's review step. Building that harness is beyond what the docs establish. The Round 1 synthesized wrapper was removed for this reason.

---

## 7. End-to-End Workflow Patterns

Each pattern below is assembled from official examples. The arrows show the sequence. GitHub does not publish a single end-to-end recipe that covers all of these.

| # | Pattern | Steps (official building blocks) | Source |
|---|---|---|---|
| A | **Plan → parallel implement → review → fix** | Shift+Tab plan mode → **Accept plan and build on autopilot + /fleet** → monitor with `/tasks` → `/review` (and `/security-review`, public preview) → fix findings → `/pr create` or `/pr auto` | [fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet); [agentic code review](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review); [security-review changelog](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/); [/pr](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/manage-pull-requests) |
| B | **Explore → plan → code → commit** | `Read the authentication files but don't write code yet` → `/plan Implement password reset flow` → review the plan → `Proceed with the plan` → `Run the tests and fix any failures` → `Commit these changes with a descriptive message` | [CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices) |
| C | **Research → plan (strong model) → implement (cheaper model)** | Research the codebase → `/plan` with a reasoning model → implement with an execution model, starting a new session between phases | [Optimizing AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage) |
| D | **Local core work + cloud tangential work** | Keep the core feature local → `/delegate` (or `&`) the docs or separate-module refactor → track it in the Sessions tab → review the draft PR | [CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices); [multiple sessions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions) |
| E | **Second-opinion loop** | Plan → rubber duck critique from a different model → implement → `/review` using two named models | [rubber duck](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck); [CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices) |
| F | **PR to green** | `/pr auto` loops through review feedback, then conflicts, then CI until checks pass. `/pr automerge` also enables auto-merge. | [/pr](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/manage-pull-requests) |
| G | **Headless batch** | `copilot -p "/fleet <YOUR TASK>" --no-ask-user` with scoped `--allow-tool` and `--max-ai-credits` (preview), in CI with `GITHUB_TOKEN` (or via gh-aw). The docs' `--fleet` form is undated (§2.1). | §6.2–6.3 sources |
| H | **Repeatable, code-defined orchestration (preview)** | Ask Copilot to author a dynamic workflow → test on a small scope → set limits → run it with `copilot workflow run` or on a schedule with `/every` | [Using dynamic workflows](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows) |

**Choosing a pattern.** Dynamic workflows suit cases where "you want to define a process you can reuse, or when a single task needs clear stages, checks, or limits". `/fleet` suits cases where Copilot can decide the split each time. A normal prompt is "usually sufficient" for quick changes ([Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows)).

---

## 8. Usage and Cost Implications

This section covers how multi-agent features affect usage. Plan allowances, model multipliers, and billing rules belong to **R8**.

- **Fleet may use more credits than a single agent.** "Using `/fleet` in a prompt may therefore cause more GitHub AI Credits to be consumed" because every subagent calls the model on its own ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)).

> "Each subagent can interact with the LLM independently of the main agent, so splitting work up into smaller tasks that are run by subagents may result in more LLM interactions than if the work was handled by the main agent."
> - Source: [Running tasks in parallel with the /fleet command (GitHub Docs)](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)

- **Autopilot spends credits without your involvement.** Each continuation consumes AI credits that Copilot initiates on its own. `--no-ask-user` alone does not ([autopilot concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).
- **Rubber duck** "runs an additional reasoning pass on a separate model", so it adds model usage ([rubber duck](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)).
- **Subagent model choice is the main lever.** "Run subagents on cheaper models." Subagents don't inherit the main conversation history, and choosing a lighter model for them does not invalidate the main agent's cache ([Optimizing AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)). Repository instructions add to each subagent's input, so leave `include-custom-instructions` off for agents that don't need them ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Caps and controls in the CLI:**
  - `/limits set max-ai-credits NUMBER` and `--max-ai-credits` (public preview, soft limit, minimum 30) ([session limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit)). ⚠️ **Scope is unresolved for interactive use.** The how-to says the interactive limit "applies for the entire session". The command reference describes `/limits set max-ai-credits` as "a soft maximum for AI Credits allowed per response" that "reset[s] for each user message". It describes `--max-ai-credits` as a soft maximum "for each response" whose limit "resets per user message" ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Until this is reconciled, don't present `/limits` as an overall session budget (see [§11, item 5](#11-research-limitations)). For `-p` runs, the how-to says the limit applies for the duration of the task and the run ends when it's reached.
  - `/goal OBJECTIVE --max-ai-credits N` for autopilot objectives ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
  - `--max-autopilot-continues` ([autopilot concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).
  - `workflows.defaultLimits.maxAiCredits` for dynamic workflows, which is "an approximate maximum, not a hard ceiling" ([Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows)).

> "If a response is in progress when the limit is reached, that response completes before the session stops, so actual usage may slightly exceed the configured number."
> - Source: [Setting an AI credit session limit in GitHub Copilot CLI (GitHub Docs)](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit)

- **Observability:**
  - `/usage` shows per-model token totals and, on token-based billing, AI credits per model ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). It has included subagent token consumption since v0.0.399, 2026-01-29 ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)).
  - `/workflows` shows AI credits per run ([Using dynamic workflows](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows)).
  - `/chronicle cost-tips` analyzes your usage patterns ([Optimizing AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)).
- **CI billing:** with `GITHUB_TOKEN` in an organization repo, usage is metered to the organization and user-level budgets are not considered. Use cost centers to attribute and cap it ([About using Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions)).
- **Session limits don't replace budgets.** They "don't replace user-level budgets or spending limits" ([Optimizing AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)). Details are in R8.

---

## 9. Suggested Demo Scenarios

Each scenario lists the documented behavior it depends on, with each step's lifecycle label (§2.1). Following the brief's lifecycle rule, features without dated release evidence are excluded: the `--fleet` option, teleporting into a subagent's view, and the `/pr auto` subcommand. To make parallelism visible, presenters should use a plan with a concurrency default of at least 4 (Pro/Pro+ or higher) ([command reference — Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

### Demo 1 — "Plan → fleet → review" on a small multi-file feature (≈8 min)

1. In a disposable repo or sandbox, run `copilot --allow-all --max-autopilot-continues 10` ([autopilot concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).
   - `--allow-all` shipped in CLI v0.0.381 (2026-01-13) ([v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)).
   - `--max-autopilot-continues` shipped by v1.0.40 (2026-05-01) ([main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)).
   - Neither has a separate status label.

   Optionally, run `/limits set max-ai-credits 100` first. It is **public preview**, and session-limit behavior changed in v1.0.66 (2026-06-30) ([session limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). ⚠️ On stage, describe this as a *soft, preview* guard whose interactive scope (per response vs. per session) is unresolved in the docs ([§11, item 5](#11-research-limitations)). It is not a guaranteed cap for the whole multi-step run.
2. Press Shift+Tab to enter plan mode (included in the Copilot CLI GA announcement (2026-02-25); shipped in CLI v0.0.387 (2026-01-20)). Ask for a feature that touches separate folders, for example the blog's three-track feature-flags prompt. Show the clarifying questions and the plan ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/); [CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).
3. Choose **Accept plan and build on autopilot + /fleet**. The plan menu's "autopilot+fleet" option shipped in CLI v0.0.415 (2026-02-23), and `/fleet` in v0.0.411 (2026-02-17); neither has a separate status label. Then open `/tasks` (shipped in v0.0.404, 2026-02-04; no separate status label) to show subagents running in parallel ([How-to: /fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion); [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)).
4. When the fleet finishes, run `/review` (included in the Copilot CLI GA announcement (2026-02-25); shipped in CLI v0.0.388 (2026-01-20)). Then run `/usage` to show subagent model usage; subagent token consumption in `/usage` shipped in CLI v0.0.399 (2026-01-29), with no separate status label ([agentic code review](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review); [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)). `/usage` before and after the demo is the reliable on-screen evidence of spend ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

*Relies on:* plan mode, the autopilot+fleet plan option, `/tasks`, `/review`, `/usage`. *Risk:* parallelism depends on the plan's concurrency cap and on how Copilot decomposes the work. Have a recorded fallback ready.

### Demo 2 — "Waves and dependencies" with the docs prompt (≈5 min)

1. Run the blog's four-file docs prompt, in which `docs/index.md` depends on the other three. `/fleet` shipped in CLI v0.0.411 (2026-02-17), with no separate status label ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/); [v1.0.11 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)).
2. Show in `/tasks` that three subagents run first and the index runs in a second wave ([How-to: /fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion)).
3. Contrast this with the vague prompt `/fleet Build the documentation`, which tends to run sequentially. Then show the pitfall slide on file partitioning ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)).
4. Optionally run the same task headless using the blog's form: `copilot -p "/fleet <YOUR TASK>" --no-ask-user`. Add the tool approvals the task needs, for example `--allow-tool=write`, because `-p` runs deny anything that isn't pre-approved ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/); [Using CLI in Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)). Don't use the undated `--fleet` option.

*Relies on:* `/fleet` decomposition, dependency serialization, `/tasks`, and `-p` with `/fleet`. *Risk:* the exact wave structure is not deterministic.

### Demo 3 — "Hand off to the cloud, keep working locally" (≈5 min)

1. In a GitHub-hosted repo where Copilot cloud agent is enabled, run `& add JSDoc comments to src/utils` (or `/delegate add JSDoc comments to src/utils`). Background delegation is included in the Copilot CLI GA announcement (2026-02-25), and the `&` prefix shipped in CLI v0.0.384 (2026-01-16). Point out the checkpoint commit to a new branch and the PR link that appears ([Delegating tasks](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca); [cloud agent access](https://docs.github.com/en/copilot/concepts/enterprise/cloud-agent-access); [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)).
2. Continue a local task in the same terminal, then show the cloud session in either of two ways:
   - Open the **Sessions** tab and press `a` to filter remote sessions. The Sessions tab shipped in CLI v1.0.79 (2026-08-10), with no separate status label ([multiple sessions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)).
   - Use `/resume`, which is included in the Copilot CLI GA announcement (2026-02-25) and shipped in CLI v0.0.386 (2026-01-19).

*Relies on:* `/delegate`/`&`, cloud agent enablement, and the Sessions tab or `/resume`. *Risk:* cloud-agent start-up latency. Pre-delegate a task before the talk so there is something to show. (`/pr auto` was removed from this demo because the `auto` subcommand's introduction is undated; see §5.6.)

*Optional advanced demo (**public preview**, 2026-10-01):* run `/experimental on`, then ask Copilot to `Create a dynamic workflow named review-changed that lists changed files, asks an agent to review them, and summarizes the findings.` Run it with a small AI-credit limit and show `/workflows`. `/workflows` "Requires a token-based-billing plan" ([Using dynamic workflows](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows); [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Label it **public preview** on the slide.

---

## 10. Configuration, Best Practices, and Pitfalls

- **Decompose explicitly.** Give one owner per file or directory, state dependencies, and define what "done" means (lint, tests) ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/); [SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)).
- **Plan first.** "Models achieve higher success rates when given a concrete plan to follow." ([CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).
- **Use least privilege in automation.** Use `--allow-tool` and `--allow-url` instead of `--allow-all` outside sandboxes, and pass `--no-ask-user` ([Running CLI programmatically](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically)). Deny rules take precedence over allow rules, even with `--allow-all` ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Detailed patterns are in R4.
- **Constrain spend with soft controls, and say that they are soft.** Use autopilot continuation caps, dynamic-workflow limits ("an approximate maximum, not a hard ceiling"), and preview AI-credit limits, and test on a small scope first ([session limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit); [Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows)). The interactive `/limits` scope is unresolved ([§11, item 5](#11-research-limitations)). None of these replace account or organization budgets, which are verified separately in R8 ([Optimizing AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)).
- **Verify after parallel work.** The parent agent's review, `/review`, `/rubber-duck`, and deterministic checks (tests, linters, scans) all reduce compounding errors ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode); [Optimizing AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)).
- **Keep sessions focused.** Use `/new` between unrelated tasks and `/compact` for long ones ([CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).
- **Pitfalls to call out on slides:**
  - Silent overwrites from the shared filesystem.
  - Concurrency caps on lower plans.
  - Built-in subagents don't see repository instructions ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
  - `-p` runs deny anything that isn't pre-approved ([Using CLI in Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)).
  - Fork-triggered workflows are exposed to prompt injection ([About using Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions)).
  - `--fleet` is not supported with `--acp` ([How-to: /fleet](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion)).
- **Don't hard-code model names on slides.** The model lineup changes often, and current pages already name different models (see Limitations).

---

## 11. Research Limitations

**Conflicts and how they were resolved**

1. **When `/fleet` was released.**
   - The official copilot-cli changelog records "Autopilot mode and /fleet command now available to all users" in v0.0.411 (2026-02-17), with fleet improvements in v0.0.412 and v0.0.415 ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md)).
   - The GitHub Blog guidance post is dated 2026-04-01 ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)).
   - Two third-party sources, used here only as corroboration, disagree with each other. htek.dev says /fleet "landed April 1" ([htek.dev, 2026-04-03](https://htek.dev/articles/copilot-cli-weekly-2026-04-03)). Awesome Agents lists fleet among the features at CLI GA in February 2026 ([awesomeagents.ai, 2026-02-27](https://awesomeagents.ai/news/github-copilot-cli-generally-available/)).
   - This report treats the official changelog as authoritative. The changelog does not show when /fleet was first introduced as an experimental feature (before v0.0.411).
   - A sequential Round 3 read of the changelog found no entry introducing the `--fleet` command-line option. That read covered main (raw) from v1.0.91 back to v1.0.7, and tag v1.0.11 from v1.0.10 back to v0.0.355. Under the brief's lifecycle rule, `--fleet` therefore carries no status label and is excluded from demos and from the synthesized workflow.
2. **Default subagent model.**
   - The fleet concept page says "By default, subagents use a low-cost AI model" ([fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)).
   - The CLI reference says a custom agent without `model` "inherits the outer agent's model", and that built-in agents have their own defaults ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
   - The blog says agents without a model "will use the current default model" ([GitHub Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)).
   - This is unresolved. R1 should confirm the exact behavior.
3. **Whether subagents can talk to each other.** The April 2026 blog says subagents "can’t talk to each other directly". The current command reference documents `list_agents`/`write_agent` sibling messaging "when a subagent runs inside a parent session with shared sibling communication enabled" ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). No source says whether `/fleet` turns on sibling communication.
4. **Autopilot continuation default.** The autopilot concept page says it "pauses after 5 automatic continuation messages" by default ([autopilot concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)). The command reference lists `--max-autopilot-continues` with "(default: unlimited)" ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). The dated changelog backs the concept page: CLI v1.0.40 (2026-05-01) says "Autopilot mode now limits continuation messages to 5 by default (configurable with --max-autopilot-continues)" ([main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). No later entry reverting this was found. This is unresolved. The talk should advise setting the value explicitly.
5. **What `/limits` covers.**
   - The reference describes `/limits set max-ai-credits` as "a soft maximum for AI Credits allowed per response" that "reset[s] for each user message".
   - The how-to says that in interactive mode the limit "applies for the entire session" ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [session limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit)).
   - The feature is in public preview. This is unresolved, so the report flags the caveat next to every place it recommends the control: the Executive Summary, §2.1, §3.7, §6.1, §6.3, §8, Demo 1 and §10. It does not claim that an overall session cap has been verified.
   - Non-interactive behavior (the limit applies for the task and the run ends at the limit) comes from the how-to alone.
   - Dated changelog context does not settle the conflict. CLI v1.0.66 (2026-06-30) says "Session limits now apply across the current conversation, reset on /clear, and use the sessionLimits option key". The same release says "Add experimental response limits controls to CLI settings" ([main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). How "session limits" relate to the reference's "response limits" is not documented.
   - Account and organization budgets are separate controls (R8).
6. **Permissions in programmatic mode.** The reference says `--allow-all-tools` is "Required when using the CLI programmatically". The official how-tos, by contrast, show `-p` working with scoped `--allow-tool` values, and state that anything not pre-approved is denied ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Running CLI programmatically](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically); [Using CLI in Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)). This report follows the how-tos (least privilege).
7. **Model names differ between pages.** For example, "Claude Opus 5" appears in the best-practices and fleet pages, while `claude-opus-5.5` appears in the reference table ([CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices); [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Model names in this report are quoted as each source states them.
8. **What "remote task" means for `--remote` with `--resume`.**
   - The command reference contains one sentence: "You can use `--remote` with `--resume <TASK-ID>` to resume a remote task locally."
   - Elsewhere, `--remote` is documented only as enabling remote access to (steering of) a session running locally, with the machine online ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Steering a CLI session remotely](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely)).
   - No source says that this combination is how to resume `/delegate` cloud-agent work.
   - The Round 1 bullet presenting it as a cloud-resumption recipe was removed. §4.4 now points to the documented Sessions tab and `/resume` route for cloud sessions.
9. **Default subagent nesting depth.** The current command reference lists max depth default `6`, maximum `256`. CLI v1.0.71 (2026-07-16) says "Lower the default maximum sub-agent nesting depth from 6 to 4 to curb runaway recursive sub-agent delegation. Usage-based billing users can still adjust `subagents.maxDepth` (up to 128)." ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). No later changelog entry restoring 6/256 was found. §3.6 reports the reference values, but this is unresolved, and R1 should confirm the runtime value.
10. **Default model of the built-in `code-review` agent.** The reference's built-in agents table lists `claude-sonnet-4.6` as the default. CLI v1.0.56 (2026-05-29) says "Code review agent now uses the same model as the current session instead of a fixed default" ([command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). This is unresolved. Built-in agent models belong to R1.

**Weak or provisional evidence**

- The SDK fleet-mode page reads like generated notes. It says "on this branch" and refers to "runtime research notes", and it calls its own SQL-todos schema an open question. Treat the coordination internals as conceptual ([SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)).
- The Actions fleet workflow in §6.3 is **synthesized**. Since Round 3 it uses `-p "/fleet <YOUR TASK>"` rather than the undated `--fleet` option. Multi-agent dispatch and permission sufficiency in that exact combination are untested. Its file boundary is enforced only by the prompt, with an after-the-fact check.
- §6.5 now contains only the official, **non-standalone** SDK fleet excerpt. The docs define no fleet-completion contract, and whether `session.idle` marks the end of a fleet is ⚠️ unverifiable. No compatible SDK/CLI version pair for the experimental binding is published.
- `/delegate` prerequisites are pieced together from several pages. No single docs page lists them. Whether `/delegate` works inside `-p` runs was not verified.
- `/security-review` lifecycle evidence:
  - Added in CLI v1.0.51 (2026-05-20).
  - Announced 2026-06-10 as "an experimental feature in public preview" ([security-review changelog](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/)).
  - Made "available to all users without --experimental" in v1.0.64 (2026-06-23) ([main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). This corrects Round 2's statement that it "requires experimental mode", which applied only before v1.0.64.
  - The 2026-07-14 Copilot app announcement still says "public preview" ([app changelog](https://github.blog/changelog/2026-07-14-security-reviews-now-available-in-the-github-copilot-app/)).
  - No later CLI GA label was found, so it remains labeled **public preview**.
- **Lifecycle labelling method (Rounds 3–4).** Release versions and dates come only from the official `github/copilot-cli` changelog and GitHub Changelog posts.
  - A standalone **GA** badge is used only where an official source states GA for that specific item: Copilot CLI (2026-02-25), the rubber duck agent (2026-06-02) and the Copilot SDK (2026-06-02).
  - Plan mode, autopilot, background delegation (`&`/`/delegate`), `/review` and `/resume` appear only as feature highlights of the CLI GA announcement. Per the brief, they are labeled "included in the Copilot CLI GA announcement (2026-02-25)", with their dated shipped versions, and get no standalone GA badge. The Round 3 rule that let inclusion in that announcement count as a GA badge was removed in Round 4.
  - The fleet coordination internals and the SDK fleet binding remain documentation-only labels.
- Recent main-branch changelog entries are now dated from the raw changelog: the prompt-mode background-task warning is in v1.0.88 (2026-09-22), and the latest release shown is v1.0.91 (2026-10-01) ([copilot-cli changelog (main, raw)](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). The rendered GitHub page used in Round 1 had dropped these version headings.

**Scope boundaries**

- Built-in agent internals and delegation heuristics → R1.
- `.agent.md` → R2.
- MCP → R3.
- Permissions, hooks and plan-mode guardrails → R4.
- Cloud agent internals, github.com code review, GitHub Agentic Workflows and Agent HQ → R6.
- Org policies → R7.
- Plans, AI-credit pricing and model multipliers → R8.
- VS Code and JetBrains fleet-like features were intentionally excluded.

---

## 12. Complete Reference List

### Documentation and Articles — GitHub Docs (25)

1. [Running tasks in parallel with the /fleet command](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet) — fleet concept (read via WebIQ browse)
2. [Speeding up task completion with the /fleet command](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion)
3. [Fleet mode (Copilot SDK)](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode)
4. [Requesting a code review with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review)
5. [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
6. [Delegating tasks to Copilot](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca)
7. [Running GitHub Copilot CLI programmatically](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically)
8. [Automating tasks with Copilot CLI and GitHub Actions](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/automate-with-actions)
9. [Researching with GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research)
10. [Allowing GitHub Copilot CLI to work autonomously](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)
11. [Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows)
12. [Using dynamic workflows](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows)
13. [GitHub Copilot CLI programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)
14. [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions)
15. [About using Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions)
16. [Working with multiple GitHub Copilot CLI sessions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions)
17. [Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)
18. [Setting an AI credit session limit in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit)
19. [Custom agents and sub-agent orchestration (Copilot SDK)](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)
20. [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)
21. [Managing access to GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/enterprise/cloud-agent-access) (redirect target of the former `coding-agent/managing-access` URL)
22. [Managing pull requests with the /pr command](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/manage-pull-requests)
23. [Optimizing your AI usage to maximize efficiency and reduce cost](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)
24. [Build your first Copilot-powered app (SDK quickstart)](https://docs.github.com/en/copilot/get-started/sdk-quickstart)
25. [Steering a GitHub Copilot CLI session from another device](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely) — added in Round 2 (remote control vs. delegation)

### Documentation and Articles — GitHub Blog (2)

26. [Run multiple agents at once with /fleet in Copilot CLI](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) — Matt Nigh & Brian LaFlamme, 2026-04-01 (updated 2026-04-14)
27. [How we made GitHub Copilot CLI more selective about delegation](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/) — Pingping Lin & Yu Hu, 2026-06-12

### Primary Announcements — GitHub Changelog (8)

28. [Dynamic workflows in Copilot CLI and the Copilot app](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/) — 2026-10-01
29. [GitHub Copilot CLI is now generally available](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) — 2026-02-25
30. [GitHub Copilot CLI: Plan before you build, steer as you go](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/) — 2026-01-21
31. [GitHub Copilot CLI: Use custom agents and delegate to Copilot coding agent](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/) — 2025-10-28
32. [Copilot SDK is now generally available](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/) — 2026-06-02
33. [Copilot CLI: Improved UI, rubber duck, prompt scheduling, and voice input](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) — 2026-06-02
34. [Dedicated security review command now available in Copilot CLI](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/) — 2026-06-10; added in Round 2 (read via WebIQ browse)
35. [Security reviews now available in the GitHub Copilot app](https://github.blog/changelog/2026-07-14-security-reviews-now-available-in-the-github-copilot-app/) — 2026-07-14; added in Round 2 (status corroboration only; app details belong to R6)

### GitHub Repositories (2)

36. [github/copilot-cli — changelog.md at tag v1.0.11 (raw)](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) — dated release entries through v1.0.10 (2026-03-20)
37. [github/copilot-cli — changelog.md on main (raw)](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) — dated entries through v1.0.91 (2026-10-01). Replaces the rendered `blob/main` page cited in Round 1, which dropped version headings.

### Third-Party Corroboration Only (2)

38. [Copilot CLI Weekly: /fleet Ships — Parallel Multi-Agent Execution (htek.dev)](https://htek.dev/articles/copilot-cli-weekly-2026-04-03) — 2026-04-03; cited only for the release-timing conflict
39. [GitHub Copilot CLI Goes Generally Available (Awesome Agents)](https://awesomeagents.ai/news/github-copilot-cli-generally-available/) — 2026-02-27; cited only for the release-timing conflict

### Code Samples (provenance index)

These samples are **verbatim**:

- Fleet CLI examples (source 2).
- Blog prompts (source 26).
- `/delegate`/`&` examples (source 6).
- Autopilot command (source 10).
- `-p /review` example (source 7).
- GITHUB_TOKEN Actions workflow (source 14).
- `copilot workflow run` example (source 12).
- SQL schema and the non-standalone TypeScript SDK fleet excerpt (source 3).

The Actions fleet workflow (which uses `-p "/fleet <YOUR TASK>"` since Round 3) is **synthesized** from sources 14, 26 and 18. Its accompanying notes also cite 13 and 37. The Round 1 synthesized TypeScript SDK wrapper was removed. The verbatim `--fleet` examples from source 2 in §3.3 are kept as documented reference material only, because `--fleet` has no dated release evidence (§2.1).

