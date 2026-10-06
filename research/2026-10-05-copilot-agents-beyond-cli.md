# Research Report: Copilot Multi-Agent Capabilities Beyond the CLI (Light)

**Date:** 2026-10-05
**Researcher:** Copilot Web Researcher Agent
**Topic slug:** copilot-agents-beyond-cli
**Sources consulted:** 50 cited sources: 12 code.visualstudio.com pages (6 documentation pages, 6 release-note pages), 14 docs.github.com documentation pages, 18 github.blog posts (15 GitHub Changelog entries, 3 GitHub Blog articles), 5 GitHub Agentic Workflows documentation pages on github.github.com, and 1 file from the official `github/gh-aw` repository. No third-party sources are cited.
**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

> **Assignment:** R6, "Copilot multi-agent capabilities beyond the CLI (light)", for the presentation "Subagents & Multi-Agent Orchestration with GitHub Copilot CLI". This report favors breadth over depth and provides enough material for 2–4 slides. It cross-references, but does not repeat, CLI foundations and built-in subagents (**R1**), `.agent.md` details and portability (**R2**), the customization stack and MCP (**R3**), permissions and hooks (**R4**), `/fleet` and `/delegate` (**R5**), org and enterprise policy (**R7**), and plans and pricing (**R8**). JetBrains, Eclipse, Xcode, Visual Studio and non-Copilot frameworks are excluded. Some sources mention them, but this report does not cover them.

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overview and Key Concepts](#2-overview-and-key-concepts)
3. [Surface by Surface](#3-surface-by-surface)
   - [3.1 VS Code](#31-vs-code)
   - [3.2 The GitHub Copilot app](#32-the-github-copilot-app)
   - [3.3 GitHub.com: Copilot cloud agent and agent management](#33-githubcom-copilot-cloud-agent-and-agent-management)
   - [3.4 Agent HQ with Claude and Codex (brief)](#34-agent-hq-with-claude-and-codex-brief)
   - [3.5 Agentic Copilot code review (brief)](#35-agentic-copilot-code-review-brief)
   - [3.6 GitHub Agentic Workflows (brief)](#36-github-agentic-workflows-brief)
4. [Comparison Table](#4-comparison-table)
5. [Practical Guidance: Sharing Agent Definitions and Slide Plan](#5-practical-guidance-sharing-agent-definitions-and-slide-plan)
6. [Best Practices and Pitfalls](#6-best-practices-and-pitfalls)
7. [Research Limitations](#7-research-limitations)
8. [Complete Reference List](#8-complete-reference-list)

---

## 1. Executive Summary

Copilot's multi-agent features are not limited to the CLI. The same building blocks appear on five other surfaces: custom agents in `.agent.md` files, subagent delegation, parallel sessions, and hand-off between local and cloud execution. Each surface wraps them in a different user interface and execution location. Several surfaces also run on the same agent runtime as the CLI. VS Code's Copilot harness and the GitHub Copilot app both use the runtime behind GitHub Copilot CLI. ([Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses); [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app))

**Key takeaways for the deck (status as of 2026-10-05):**

- **VS Code:** There are two subagent paths. The **Local** harness uses the `runSubagent` tool. The **Copilot** harness delegates through the Copilot SDK. Lifecycle labels from dated VS Code release notes (details and rule in §3.1):
  - Custom agents and `handoffs`: shipped in VS Code 1.106 (2025-11-12); no separate status label.
  - Parallel subagents and the `agents`, `user-invocable` and `disable-model-invocation` keys: shipped in VS Code 1.109 (2026-02-04); no separate status label.
  - Nested subagents (opt-in): shipped in VS Code 1.113 (2026-03-25); no separate status label.
  - Agents window: **Preview** in Stable since VS Code 1.120 (2026-05-13).
  - Copilot harness: shipped in VS Code 1.140 (2026-09-30); no separate status label.
  - Custom agents *as subagents*, which the coordinator pattern relies on: last dated status is **Experimental** (1.107, 2025-12-10), and still behind a setting in 1.109.

  ([VS Code 1.106](https://code.visualstudio.com/updates/v1_106); [VS Code 1.107](https://code.visualstudio.com/updates/v1_107); [VS Code 1.109](https://code.visualstudio.com/updates/v1_109); [VS Code 1.113](https://code.visualstudio.com/updates/v1_113); [VS Code 1.120](https://code.visualstudio.com/updates/v1_120); [VS Code 1.140](https://code.visualstudio.com/updates/v1_140))
- **The GitHub Copilot app** is a desktop app for agent-driven development, built on GitHub Copilot CLI. It became **generally available on 2026-06-17** after a technical preview that started on 2026-05-14. It runs parallel sessions, each with its own worktree and branch. Its current slash-command reference documents `/fleet`, `/spawn`, `/orchestrate`, `/rubber-duck` and `/agent`. No dated per-command evidence was found, so the 2026-06-17 GA date is product-level only and these commands carry no status label in this report. ([GA changelog](https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/); [Slash commands](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands))
- **Copilot cloud agent** was formerly "Copilot coding agent", which became **GA on 2025-09-25**. That date applies to the product, not automatically to every later capability. It runs asynchronously in a GitHub Actions-powered environment. Two capabilities shipped on 2025-10-28, each with no separate status label: custom agents, and automatic security and quality validation, which includes a code review of its own work. Since 2026-04-01 it can also work on a branch without opening a pull request. ([GA changelog](https://github.blog/changelog/2025-09-25-copilot-coding-agent-is-now-generally-available/); [Custom agents changelog](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/); [Validation changelog](https://github.blog/changelog/2025-10-28-copilot-coding-agent-now-automatically-validates-code-security-and-quality/); [Research, plan, and code](https://github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent/))
- **Agent HQ / mission control:** "Mission control" was the launch name (2025-10-28) for the single place to assign, steer and track agents. Current docs call it the **Agents tab**, **Agents page** and **agents panel**. **Claude and Codex** third-party coding agents run there in **public preview**: they launched on 2026-02-04 and expanded to more plans on 2026-02-26. ([About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents); [Agents tab changelog](https://github.blog/changelog/2026-01-26-introducing-the-agents-tab-in-your-repository/))
- **Copilot code review** runs on an **agentic tool-calling architecture** on GitHub Actions and has been **GA since 2026-03-05**. Its ability to pass suggestions to the cloud agent is in public preview. ([Code review changelog](https://github.blog/changelog/2026-03-05-copilot-code-review-now-runs-on-an-agentic-architecture/); [About Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review))
- **GitHub Agentic Workflows (gh-aw)** are Markdown-defined automations that compile into GitHub Actions workflows. **Copilot CLI is the default engine.** Workflows can load `.github/agents/` files or inline sub-agents, and writes happen only through **safe outputs**. They have been in **public preview since 2026-06-11**, following a technical preview from 2026-02-13. ([About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows); [AI Engines](https://github.github.com/gh-aw/reference/engines/))

**Why it matters for a CLI-first audience:** One `.github/agents/*.agent.md` file can be picked up by the CLI, VS Code, the Copilot app, cloud agent and gh-aw. Surface-specific keys are ignored or degrade gracefully, so a team's CLI specialists can follow the work to other surfaces. Not every key is honored everywhere (§5). ([About custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents); [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration); [Copilot Agent Files (gh-aw)](https://github.github.com/gh-aw/reference/copilot-custom-agents/))

---

## 2. Overview and Key Concepts

### 2.1 One runtime, several shells

VS Code's documentation says the Copilot harness, Copilot CLI and the Copilot app share one agent runtime. The documentation also says that sharing a runtime does not mean that sessions or settings sync:

> "It uses the GitHub Copilot SDK to access the agent runtime also used by GitHub Copilot CLI and the GitHub Copilot app."
> - Source: [Choose and use an agent harness (VS Code)](https://code.visualstudio.com/docs/agents/run/agent-harnesses)

> "A shared runtime does not mean that all sessions or personal settings synchronize between products."
> - Source: [Choose and use an agent harness (VS Code)](https://code.visualstudio.com/docs/agents/run/agent-harnesses)

The VS Code agents overview says the same from the editor's side: "When you use the Copilot harness, you get a consistent agent experience across VS Code, GitHub Copilot CLI, and the GitHub Copilot app." It also notes that the app "provides a dedicated desktop experience outside VS Code". ([Build with AI in VS Code](https://code.visualstudio.com/docs/agents/overview))

The Copilot app documentation says the same thing from the app's side: "The app is built on GitHub Copilot CLI and integrates natively with GitHub." ([About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app)) The underlying Copilot SDK reached **GA on 2026-06-02**. Its changelog describes "direct, programmatic access to the same agent runtime behind GitHub Copilot". ([Copilot SDK is now generally available](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/))

### 2.2 Terminology map: old name → current name

Practitioners will see older names in blogs and screenshots. Use the current names on slides.

| Older name (date seen) | Current name | Evidence |
|---|---|---|
| Copilot coding agent (GA 2025-09-25) | **Copilot cloud agent** | "Copilot cloud agent (formerly known as Copilot coding agent)" ([2026-04-01 changelog](https://github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent/)) |
| "Mission control" (2025-10-28) | **Agents tab** (in a repository), **Agents page** (`github.com/copilot/agents`), **agents panel**; concept page: "About agent management" | [Agents tab changelog, 2026-01-26](https://github.blog/changelog/2026-01-26-introducing-the-agents-tab-in-your-repository/); [About agent management](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/agent-management) |
| VS Code custom chat modes (`.chatmode.md`) | **Custom agents** (`.agent.md`) | "Custom agents were previously known as custom chat modes." ([Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents)) |
| `infer` frontmatter key | `user-invocable` + `disable-model-invocation` | VS Code marks `infer` **Deprecated**; GitHub's reference marks it **Retired** ([Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents); [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)) |
| VS Code "Agent sessions" view with **Local / Cloud / Background** (described in the 2026-02-04 changelog, which requires VS Code 1.109 or later) | **Session Target** control with **Local / Copilot / Claude / Codex / Cloud**, plus the **Agents window** | [Claude and Codex changelog, 2026-02-04](https://github.blog/changelog/2026-02-04-claude-and-codex-are-now-available-in-public-preview-on-github/); [Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses) |

### 2.3 Four multi-agent patterns that recur across surfaces

1. **Subagent delegation:** a parent agent hands a self-contained task to a context-isolated worker and receives a summary. Seen in the VS Code Local and Copilot harnesses, the cloud agent's `agent` tool alias and gh-aw inline sub-agents.
2. **Parallel sessions:** several independent agent sessions, each usually in its own branch or worktree. Seen in the VS Code Agents window, the Copilot app and the Agents tab.
3. **Hand-off:** work moves to another agent, harness or execution location while keeping its context. Seen in VS Code `handoffs` and the Session Target control, `/delegate`, and "Continue in GitHub Copilot CLI".
4. **Creator ↔ reviewer:** one agent produces work and another critiques it. Seen in cloud agent self-review with Copilot code review, Rubber Duck in the VS Code Copilot harness and the app, and review handoffs.

Sources for the list: [Use subagents in VS Code](https://code.visualstudio.com/docs/agents/run/subagents); [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration); [Inline Sub-Agents](https://github.github.com/gh-aw/reference/inline-sub-agents/); [About agent management](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/agent-management); [What's new with GitHub Copilot coding agent](https://github.blog/ai-and-ml/github-copilot/whats-new-with-github-copilot-coding-agent/).

---

## 3. Surface by Surface

### 3.1 VS Code

**Lifecycle labels in this section.** This section applies the brief's lifecycle-label rule:
- **Explicit label available:** a feature gets its published GA, Preview or Experimental label plus the date of the source that published it.
- **Dated release evidence but no explicit label:** the feature is described as "shipped in VS Code <version> (<date>); no separate status label". It is never badged GA. These dates are VS Code product versions, not Copilot CLI versions.
- **Neither:** VS Code docs pages are undated, so behavior seen only on the current docs (read 2026-10-05) is marked **documentation observation**. It stays out of labeled slide claims and demos. A label printed on an undated docs page, such as Preview or Experimental, is reported as published but carries no date.

| VS Code capability | Dated evidence (official release notes) | Label to use |
|---|---|---|
| Custom agents (`.agent.md`, renamed from chat modes; `.github/agents`) | 1.106 (2025-11-12): "Chat modes have been renamed to custom agents throughout VS Code to better align with terminology used in other environments." | Shipped in VS Code 1.106 (2025-11-12); no separate status label |
| `handoffs` frontmatter | 1.106 (2025-11-12): "`handoffs`: wires guided transitions to other agents, letting you chain multi-step workflows." 1.109 (2026-02-04) added an optional handoff `model`. | Shipped in VS Code 1.106 (2025-11-12); no separate status label |
| Subagents, including parallel subagents | 1.109 (2026-02-04), "Subagents" section: "Subagents can now run in parallel, which can significantly speed up tasks that can be split into independent tasks." | Shipped in VS Code 1.109 (2026-02-04); no separate status label |
| Custom agents run *as* subagents (coordinator → worker pattern) | 1.107 (2025-12-10): "Run agents as subagents (Experimental)". 1.109 (2026-02-04): "The use of custom agents as subagents is currently still behind a setting." (`chat.customAgentInSubagent.enabled`) | **Experimental** (1.107, 2025-12-10), still setting-gated in 1.109. Today's settingless behavior on the docs page is a documentation observation; no later dated status was found. |
| `agents`, `user-invocable`, `disable-model-invocation` keys | 1.109 (2026-02-04), "Control how custom agents are invoked" | Shipped in VS Code 1.109 (2026-02-04); no separate status label. `agents` only takes effect when custom agents run as subagents (row above). |
| Nested subagents (opt-in `chat.subagents.allowInvocationsFromSubagents`) | 1.113 (2026-03-25): "Subagents can now invoke other subagents, enabling more complex multi-step workflows." | Shipped in VS Code 1.113 (2026-03-25); no separate status label. The depth-5 limit is a documentation observation. |
| Handing a session to another agent type | 1.109 (2026-02-04): a new session type picker can "Hand off an ongoing session to a different agent type" | Shipped in VS Code 1.109 (2026-02-04); no separate status label. Today's **Session Target** naming and its Copilot/Claude/Codex/Cloud list are documentation observations. |
| Agents window | 1.120 (2026-05-13): "it's now available as a preview in VS Code Stable" | **Preview** (1.120, 2026-05-13) |
| Copilot harness | 1.140 (2026-09-30) | Shipped in VS Code 1.140 (2026-09-30); no separate status label |
| Agents creating chats or sessions | GitHub Changelog roundup of VS Code 1.136–1.140 (2026-10-01): "Agents can now decide to create new chats or sessions." | Shipped in VS Code 1.136–1.140 (September 2026); no separate status label |
| Multi-folder sessions; delegating to remote agent hosts | 1.140 (2026-09-30) | **Experimental** (1.140, 2026-09-30) |
| Auto model for subagents, agent-scoped `hooks`, Agent Customizations editor, `/research`, Codex on Agent Host, reuse of SDK hooks | Undated docs pages only | Labels as printed on undated docs (Experimental or Preview); documentation observation, keep out of demos |
| Rubber Duck in the Copilot harness, `/remote on`, cross-product session discovery, the MCP restriction for Copilot sessions | Undated docs pages only | Documentation observation; no status label |

Sources for the table: [VS Code 1.106](https://code.visualstudio.com/updates/v1_106); [VS Code 1.107](https://code.visualstudio.com/updates/v1_107); [VS Code 1.109](https://code.visualstudio.com/updates/v1_109); [VS Code 1.113](https://code.visualstudio.com/updates/v1_113); [VS Code 1.120](https://code.visualstudio.com/updates/v1_120); [VS Code 1.140](https://code.visualstudio.com/updates/v1_140); [Copilot in VS Code, September 2026 releases](https://github.blog/changelog/2026-10-01-github-copilot-in-vs-code-september-2026-releases/); [Use subagents in VS Code](https://code.visualstudio.com/docs/agents/run/subagents); [Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents); [Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses).

#### Harnesses and where they run

VS Code now separates the **harness** from the model:

> "Visual Studio Code supports the GitHub Copilot, Anthropic Claude, and OpenAI Codex harnesses, plus a Cloud target for available cloud agents."
> - Source: [Choose and use an agent harness (VS Code)](https://code.visualstudio.com/docs/agents/run/agent-harnesses)

- **Local:** runs "In the VS Code extension host on your machine". It works on the current workspace and can use VS Code and extension tools.
- **Copilot:** runs "In the Agent Host on your machine, on a remote host, or in a Dev Container". It can work in the current folder, an isolated Git worktree, or a Dev Container workspace.
- **Claude** and **Codex:** run on your machine. Cloud sessions with Claude and Codex are labeled "currently in preview"; third-party cloud agents were already labeled Preview in VS Code 1.109 (2026-02-04). The undated docs label Codex on the Agent Host **Experimental** (documentation observation).
- **Cloud:** "On a provider's remote infrastructure", working against a GitHub repository and a pull request.

([Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses))

The Copilot harness was announced in **VS Code 1.140, released September 30, 2026**. The release notes say it "might already be the default selection for you" and describe it this way:

> "It's powered by the Copilot SDK, so its behavior and capabilities are consistent with other Copilot products, including the standalone GitHub Copilot app and the Copilot CLI."
> - Source: [VS Code 1.140 release notes](https://code.visualstudio.com/updates/v1_140)

#### Subagents (`runSubagent` and SDK-managed)

A subagent "works in its own context and returns a focused result to the main agent". How subagents behave depends on the harness ([Use subagents in VS Code](https://code.visualstudio.com/docs/agents/run/subagents)):

- **Local harness:** "The Local harness uses the VS Code `runSubagent` tool." (Subagents shipped in VS Code 1.109, 2026-02-04, with no separate status label. The tool name and the steps below are documentation observations.) To enable it, turn on **Run Subagent** (`agent/runSubagent`) in **Configure Tools**. The main agent delegates when you ask for a subagent in natural language, and it can also decide to delegate on its own.
  > "Each Local invocation is stateless: the main agent can't send follow-up messages to the same subagent."
  > - Source: [Use subagents in VS Code](https://code.visualstudio.com/docs/agents/run/subagents)
- **Coordinator allow-list:** the custom-agent `agents` key limits which workers a coordinator can call. `agents: ['Codebase Researcher', 'Reviewer']` permits only those two, `['*']` permits all, and `[]` prevents subagent use. The coordinator also needs the `agent` tool set in its `tools` list. The docs add: "Explicitly listing an agent in `agents` overrides that agent's `disable-model-invocation: true`." The key shipped in 1.109 (2026-02-04), but the pattern depends on custom agents running as subagents. That capability's last dated status is **Experimental** (1.107) and setting-gated (1.109).
- **Nesting:** "Local subagents cannot invoke further subagents by default." You can opt in with `chat.subagents.allowInvocationsFromSubagents`, which shipped in VS Code 1.113 (2026-03-25) with no separate status label. The statement "Nesting is limited to a maximum depth of five." is a documentation observation.
- **Model selection order (documentation observation):** (1) a model passed explicitly in the `runSubagent` call, (2) the custom agent's `model`, (3) Auto, when `chat.subagents.defaultToAuto` is on (labeled **Experimental** on the undated page), (4) the main conversation's model. An explicit or agent-configured model that exceeds the main model's cost tier causes the subagent not to run.
- **Copilot harness (documentation observation within the harness shipped in 1.140):** "The Copilot harness uses the Copilot SDK to manage delegation to built-in or custom subagents." In the Agents window, its subagents appear as read-only chats. R1 covers how the runtime's built-in agents behave.
- **Claude / Codex harnesses:** these use their provider's native subagents.

The page includes a cost caution for slides: "Delegation adds model usage and coordination, so consider the cost as well as the benefit of keeping intermediate work out of the main context." ([Use subagents in VS Code](https://code.visualstudio.com/docs/agents/run/subagents)) R8 covers billing details.

#### Custom agents and handoffs

Custom agents are `.agent.md` files. They shipped in VS Code 1.106 (2025-11-12) with no separate status label. VS Code reads them from `.github/agents` (workspace), `.claude/agents` (workspace, Claude format), and `~/.copilot/agents` or `~/.claude/agents` (user level). Org-level agents are discovered when `github.copilot.chat.organizationCustomAgents.enabled` is `true`. That setting name is a documentation observation: 1.107 introduced org sharing as **Experimental** under a differently named setting. ([Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents); [VS Code 1.106](https://code.visualstudio.com/updates/v1_106); [VS Code 1.107](https://code.visualstudio.com/updates/v1_107))

For Agent Host sessions such as the Copilot harness, the user-level folder is the same one the CLI uses:

> "For sessions that run on Agent Host, the agent reads user-level custom agents from the selected host's folder, such as `~/.copilot/agents` or `~/.claude/agents`, and not from VS Code profile user data."
> - Source: [Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents)

**Handoffs** (frontmatter key `handoffs`) shipped in VS Code 1.106 (2025-11-12) with no separate status label. They are guided, human-in-the-loop transitions between agents. VS Code 1.109 (2026-02-04) added an optional `model` parameter: "Agent handoffs now support an optional `model` parameter that lets you specify which language model to use when the handoff executes." ([VS Code 1.106](https://code.visualstudio.com/updates/v1_106); [VS Code 1.109](https://code.visualstudio.com/updates/v1_109))

The current docs describe them this way:

> "Handoffs connect agents into a workflow with suggested next steps. After a chat response completes, handoff buttons let you switch to another agent with the conversation context and a pre-filled prompt."
> - Source: [Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents)

Each handoff has `label`, `agent`, `prompt`, optional `send` (default `false`, which means the prompt is not auto-submitted) and optional `model`. The docs page labels two related features Preview, without a date: the **Agent Customizations editor** and agent-scoped `hooks` (Local harness only, requires `chat.useHooks`). Both are documentation observations. ([Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents))

```markdown
---
# Source: https://code.visualstudio.com/docs/agent-customization/custom-agents (Handoffs section; line breaks restored)
description: Generate an implementation plan
tools: ['search', 'web']
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: Now implement the plan outlined above.
    send: false
    model: GPT-5.2 (copilot)
---
```
> - Source: [Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents) | Provenance: adapted (the docs page rendered without line breaks when fetched; only line breaks and the `# Source:` comment were added)

#### Sessions, peer chats, Session Target handoff and the Agents window

- **Agents window:** a dedicated window for running many sessions across projects. **VS Code 1.120 (2026-05-13)** says "it's now available as a preview in VS Code Stable". No GA announcement was found (§7). ([VS Code 1.120](https://code.visualstudio.com/updates/v1_120); [Use the Agents window](https://code.visualstudio.com/docs/agents/run/agents-window))
- **Peer chats and agent-created sessions:** a session can hold several chats: "Additional interactive conversations are called **peer chats**." The docs also say: "On the Agent Host, an agent can also coordinate work across sessions. It can list sessions, create new sessions or chats, read another session's recent context, and send follow-up messages between sessions." ([Understand sessions and chats](https://code.visualstudio.com/docs/agents/concepts/sessions)) The dated evidence is the September 2026 roundup of VS Code 1.136–1.140 (2026-10-01): "Agents can now decide to create new chats or sessions." This shipped with no separate status label. ([Copilot in VS Code, September 2026 releases](https://github.blog/changelog/2026-10-01-github-copilot-in-vs-code-september-2026-releases/))
- **Harness handoff:** handing a session to another agent type shipped in VS Code 1.109 (2026-02-04) with no separate status label. Today's **Session Target** control carries the conversation to Copilot, Claude, Codex or Cloud (documentation observation). One constraint is easy to miss: "You can initiate a handoff only from a Local session." In a Copilot session, `/delegate` continues the task in the cloud (R5). ([VS Code 1.109](https://code.visualstudio.com/updates/v1_109); [Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses))
- **Cross-product session discovery (documentation observation):** "VS Code can also discover supported local sessions created in Copilot CLI, the GitHub Copilot app, Claude Code, and Codex." ([Understand sessions and chats](https://code.visualstudio.com/docs/agents/concepts/sessions))
- **Experimental in 1.140 (2026-09-30):** multi-folder sessions, and "Delegate tasks to remote agent hosts" through the `list_agent_hosts`, `create_remote_session`, `get_remote_session` and `send_remote_message` tools. ([VS Code 1.140](https://code.visualstudio.com/updates/v1_140))
- **Copilot-harness extras (documentation observations):** **Rubber Duck**, a read-only critic that is also available through `/rubber-duck`; `/remote on`; and `/research`, which the undated docs page labels Preview and Insiders-only. ([Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses))

#### What carries over from CLI `.agent.md` files (R2 has the full matrix)

- **Same files and folders.** VS Code reads `.github/agents/*.agent.md`, and Agent Host sessions read `~/.copilot/agents`. ([Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents))
- **Shared keys.** `name`, `description`, `tools`, `model`, `target`, `user-invocable` and `disable-model-invocation` appear in both the VS Code table and GitHub's cross-surface reference. ([Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration))
- **VS Code-only keys.** `agents`, `handoffs`, `argument-hint` and `hooks`. Cloud agent ignores `argument-hint` and `handoffs`.
- **CLI/cloud-only keys.** `mcp-servers` and `metadata` are "Not used in VS Code and other IDE custom agents." ([Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration))
- **Skills, instructions and hooks (documentation observations).** The Copilot harness reuses skills and instructions. Hooks are reused through the "same SDK hook implementation as Copilot CLI", which the undated docs page labels Preview. ([Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses))
- **Plugins.** Automatic pickup of CLI-installed plugins shipped in VS Code 1.120 (2026-05-13) with no separate status label: "a single `copilot plugin install` covers both surfaces." ([VS Code 1.120](https://code.visualstudio.com/updates/v1_120))
- **MCP limitation (documentation observation).** "Copilot sessions can currently access only local MCP servers that don't require authentication." ([Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses))

### 3.2 The GitHub Copilot app

**What it is.** The GitHub Copilot app is a desktop application for macOS, Windows and Linux. It is not a GitHub App integration, and it is separate from VS Code.

> "The GitHub Copilot app is a desktop application for agent-driven development that brings parallel workstreams, GitHub integration, and PR lifecycle management into one place."
> - Source: [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app)

**Status and dates.**
- **Technical preview: 2026-05-14.** The preview changelog describes it as "a GitHub-native desktop experience". ([Technical preview changelog](https://github.blog/changelog/2026-05-14-github-copilot-app-is-now-available-in-technical-preview/))
- **GA: 2026-06-17.**
  > "The GitHub Copilot app is now generally available for macOS, Windows, and Linux. It’s the desktop home for agent-driven development, built natively on GitHub."
  > - Source: [GitHub Copilot app generally available](https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/)
- **Plans.** The docs say "GitHub Copilot app is available for all Copilot plans". GitHub Enterprise Server is not supported. ([About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app); [Getting started with the GitHub Copilot app](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app))

**Relationship to agents and sessions.**
- **Parallel sessions:** "Run multiple isolated agent sessions simultaneously, each with a dedicated git worktree and branch". Each session can run in a new working tree, the local repository, or a **cloud sandbox**. Cloud and local sandboxes are in public preview. ([About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app); [Working with agent sessions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions))
- **Session modes:** **Interactive**, **Plan** and **Autopilot**, with a per-session choice of model and reasoning effort. ([Working with agent sessions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions))
- **Multi-agent slash commands** ([Slash commands for the GitHub Copilot app](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands)). These are documentation observations: the current reference has no per-command dates, and the app's 2026-06-17 GA applies to the product, not to each command. Only `/security-review` carries an explicit label (public preview).
  - `/fleet [PROMPT]`: "Launches multiple agents in parallel for one task."
  - `/spawn [PROMPT]`: "Creates a focused child session for delegated work."
  - `/orchestrate [PROMPT]`: "Coordinates work across sessions or repositories. This slash command is a built-in skill."
  - `/agent`: "Selects a custom agent for the session."
  - `/rubber-duck`, `/review`, `/research`, `/security-review` (public preview), `/fork` and `/merge-to-parent`.
- **Shared CLI history:** "Because the GitHub Copilot app is built on GitHub Copilot CLI, you can use Copilot CLI session history features such as `/chronicle`". ([Working with agent sessions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions))
- **Features added since the preview:** the GA post adds canvases, "Cloud automations", and model and tool choice through MCP. The technical preview introduced **Agent Merge**, which addresses review comments, fixes failing checks and merges when your conditions are met. ([GA changelog](https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/); [Technical preview changelog](https://github.blog/changelog/2026-05-14-github-copilot-app-is-now-available-in-technical-preview/))
- **Custom agents:** GitHub's custom-agents concept page lists the "GitHub Copilot app" among the surfaces where custom agents are available. ([About custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents))

The GA changelog and the current docs disagree on which admin policy gates the app. §7 records the conflict; R7 covers governance.

### 3.3 GitHub.com: Copilot cloud agent and agent management

**Name and status.** The current name is **Copilot cloud agent**. It is the renamed Copilot coding agent, which became GA on 2025-09-25:

> "Copilot coding agent, our asynchronous, autonomous developer agent, is now generally available for all paid Copilot subscribers."
> - Source: [Copilot coding agent is now generally available (2025-09-25)](https://github.blog/changelog/2025-09-25-copilot-coding-agent-is-now-generally-available/)

The same changelog says the agent works "in its own development environment. It does this through the power of GitHub Actions." On 2026-04-01 the agent stopped being limited to pull requests:

> "Copilot cloud agent (formerly known as Copilot coding agent) is no longer limited to pull-request workflows, unlocking a broader range of ways to put Copilot to work."
> - Source: [Research, plan, and code with Copilot cloud agent (2026-04-01)](https://github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent/)

**Issue → PR lifecycle.**
1. **Assign.** Assign an issue to **Copilot**. The dialog lets you pick the target repository, base branch, an optional prompt, a custom agent and a model.
2. **Work.** "Copilot will start working on the task, raise a pull request, then request a review from you when it's finished." The current how-to labels this assignment flow "in public preview and subject to change" (§7).
3. **Context is a snapshot.** "After assigning the issue, Copilot will not be aware of, and therefore won't react to, any further comments that are added to the issue." Put follow-ups on the pull request instead.
4. **CI gate (default).** "By default, GitHub Actions workflows will not run automatically when Copilot pushes changes to a pull request." A human clicks **Approve and run workflows**. This is a configurable default, not an invariant: the same how-to notes that "you can configure Copilot cloud agent to allow GitHub Actions workflows to run without human intervention" (R7 covers governance).
5. **Iterate.** Mention `@copilot` on the PR, use **Fix with Copilot** on review comments or merge conflicts, or batch comments. "If the pull request was created by a custom agent, mentioning `@copilot` continues using that same agent."

([Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github))

Other entry points include the Agents tab and panel, the dashboard, Copilot Chat `/task`, GitHub Mobile, IDEs, the REST API, GitHub CLI, the GitHub MCP Server, and integrations such as Slack, Teams, Jira, Azure Boards, Linear and Raycast. ([Starting GitHub Copilot sessions](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions))

**Built-in creator ↔ reviewer.** The dated introduction is the 2025-10-28 changelog, with no separate status label. It says new code is checked with CodeQL, the GitHub Advisory Database and secret scanning:

> "Copilot also proactively performs a code review to assess it for code quality issues."
> - Source: [Copilot coding agent now automatically validates code security and quality (2025-10-28)](https://github.blog/changelog/2025-10-28-copilot-coding-agent-now-automatically-validates-code-security-and-quality/)

A later GitHub Blog article (2026-02-26) confirms the behavior. It is corroboration, not the introduction date:

> "Copilot coding agent now reviews its own changes using Copilot code review before it opens the pull request."
> - Source: [What's new with GitHub Copilot coding agent (GitHub Blog, 2026-02-26)](https://github.blog/ai-and-ml/github-copilot/whats-new-with-github-copilot-coding-agent/)

The same post also describes code scanning, secret scanning and dependency vulnerability checks inside the agent's workflow.

**Custom agents on GitHub.com.** Custom agents shipped on 2025-10-28 with no separate status label: "Custom agents work across Copilot coding agent in github.com, the Copilot CLI, and will be coming to a future release of Visual Studio Code." ([Custom agents for GitHub Copilot (2025-10-28)](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/))

Agent profiles live in `.github/agents/CUSTOM-AGENT-NAME.md` (repository level) or `/agents/CUSTOM-AGENT-NAME.md` in the org's `.github` or `.github-private` repository. Enterprise-level profiles go in a designated `.github-private` repository. Per the current docs, profiles are available to cloud agent on GitHub.com, cloud agent in IDEs, the GitHub Copilot app and the GitHub Copilot CLI. ([About custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents))

The cross-surface reference defines an `agent` tool alias (compatible names `custom-agent` and `Task`) that "Allows a different custom agent to be invoked to accomplish a task". This is the subagent hook on the cloud side. It is a documentation observation: no dated release evidence was found, so it carries no status label. ([Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration))

**Limits worth a slide footnote.** Each run changes one repository; Copilot "can only work on one branch at a time and can open one pull request per task"; and "Each Copilot cloud agent session has a maximum execution time of 59 minutes." ([GitHub Copilot on GitHub.com](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github))

**Agent management (sessions view).** Use the **Agents** tab in a repository, the **Agents page** at `github.com/copilot/agents`, or the agents panel. From there you can:
- start tasks with a chosen model, a third-party agent or a custom agent;
- watch live session logs and track active sessions;
- **steer** mid-session ("Steering consumes AI credits per message");
- **Open in VS Code** or **Continue in GitHub Copilot CLI**;
- set up automations;
- query past sessions.

The docs add: "You can run multiple agent sessions concurrently, allowing you to efficiently delegate work items." ([About agent management](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/agent-management))

**History of the name.** The 2025-10-28 changelog introduced the **mission control** view for assigning, steering and tracking tasks. On 2026-01-26, GitHub moved it into a repository **Agents** tab, "bringing a new look and feel to your mission control style view directly into your repository". ([Mission control changelog](https://github.blog/changelog/2025-10-28-a-mission-control-to-assign-steer-and-track-copilot-coding-agent-tasks/); [Agents tab changelog](https://github.blog/changelog/2026-01-26-introducing-the-agents-tab-in-your-repository/))

**Automations.** "Automations let you run Copilot cloud agent automatically, on a schedule or in response to events in a repository." They are available in private and internal repositories and are managed from the Agents tab or the app's **Automations** tab. No dated release evidence was gathered for automations, so this report treats them as a documentation observation with no status label. ([About Copilot automations](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automations))

### 3.4 Agent HQ with Claude and Codex (brief)

**What it is.** GitHub announced **Agent HQ** at GitHub Universe 2025 as "GitHub’s vision for the next evolution of our platform". Its centerpiece was **mission control**:

> "Agent HQ transforms GitHub into an open ecosystem that unites every agent on a single platform."
> - Source: [Introducing Agent HQ: Any agent, any way you work (GitHub Blog)](https://github.blog/news-insights/company-news/welcome-home-agents/)

**Status and availability.**
- **2026-02-04:** Claude and Codex coding agents entered public preview for Copilot Pro+ and Copilot Enterprise:
  > "Copilot Pro+ and Copilot Enterprise users can now run multiple coding agents directly inside GitHub, GitHub Mobile, and Visual Studio Code (with Copilot CLI support coming soon)."
  > - Source: [Pick your agent: Use Claude and Codex on Agent HQ (GitHub Blog, 2026-02-04)](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)
- **2026-02-26:** access expanded: "Claude by Anthropic and OpenAI Codex are now available as coding agents for Copilot Business and Copilot Pro customers." ([Changelog, 2026-02-26](https://github.blog/changelog/2026-02-26-claude-and-codex-now-available-for-copilot-business-pro-users/))
- **Current docs:** "Third-party coding agents are currently in public preview." Admins and users must enable them in policies; the corresponding GitHub Apps are `anthropic code agent` and `openai code agent`. ([About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents)) R7 covers enablement policy and R8 covers plan eligibility.

**Multi-agent angle for one slide.** You can assign Copilot, Claude, Codex or all three to the same issue and compare the results:

> "You can assign multiple agents to a task, and see how Copilot, Claude, and Codex reason about tradeoffs and arrive at different solutions."
> - Source: [Pick your agent (GitHub Blog, 2026-02-04)](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)

Third-party agents "are subject to the same security protections, mitigations, and limitations as Copilot cloud agent". This includes automatic CodeQL, secret scanning and dependency checks on the code they generate. The policies "do not apply to **local** agents in Visual Studio Code". ([About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents))

### 3.5 Agentic Copilot code review (brief)

**The March 2026 change.**

> "Copilot code review now runs on an agentic tool-calling architecture and is generally available for all users with Copilot Pro, Copilot Pro+, Copilot Business, and Copilot Enterprise."
> - Source: [Copilot code review now runs on an agentic architecture (2026-03-05)](https://github.blog/changelog/2026-03-05-copilot-code-review-now-runs-on-an-agentic-architecture/)

The reviewer uses tool calling to gather repository context: relevant code, directory structure and references. "Agentic Copilot code review runs on GitHub Actions". Organizations that have opted out of GitHub-hosted runners must set up self-hosted runners once. ([2026-03-05 changelog](https://github.blog/changelog/2026-03-05-copilot-code-review-now-runs-on-an-agentic-architecture/))

**Current docs** ([About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review)):
- **Agentic capabilities:** "Full project context gathering" and "The ability to pass suggestions to Copilot cloud agent". The latter is a reviewer → implementer handoff and "is in public preview and subject to change".
- **Fallback:** "If GitHub Actions is unavailable or if Actions workflows used by Copilot code review fail, reviews will still be generated. However, they will not include the additional features provided by the agentic capabilities."
- **No model choice:** "Model switching is not supported". Review effort is either **Lite** or **Balanced**, and Balanced is the default.

R5 covers CLI `/review`. R8 covers the cost estimates on the docs page.

### 3.6 GitHub Agentic Workflows (brief)

**What it is.**

> "GitHub Agentic Workflows are AI-powered repository automations that you define in markdown and run as GitHub Actions workflows."
> - Source: [About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows)

**How it works.** A `.md` file with YAML frontmatter (triggers, permissions, tools, `safe-outputs`) and a natural-language body is compiled into a hardened `.lock.yml` Actions workflow. You commit both files. ([About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows))

**Status.** gh-aw entered **technical preview on 2026-02-13** through the `gh aw` CLI extension and moved to **public preview on 2026-06-11**. The docs currently say "GitHub Agentic Workflows are in public preview and subject to change." ([Technical preview changelog](https://github.blog/changelog/2026-02-13-github-agentic-workflows-are-now-in-technical-preview/); [Public preview changelog](https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/); [About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows))

**Relationship to Copilot CLI and agents.**
- **Copilot CLI is the default engine.** "Copilot CLI is the default, so `engine:` can be omitted when using Copilot." A Copilot SDK mode is available with `copilot-sdk: true`. Claude, Codex, Gemini and Pi are the other built-in engines. ([AI Engines](https://github.github.com/gh-aw/reference/engines/))
- **Custom agents.** `engine.agent` points to a `.github/agents/*.agent.md` file, and `imports` can pull agent files from other repositories, pinned by `@ref`. "Copilot supports these files natively; other engines such as Claude and Codex receive the Markdown body as prompt text." ([Copilot Agent Files](https://github.github.com/gh-aw/reference/copilot-custom-agents/))
- **Inline sub-agents.** "An inline Copilot sub-agent is a named agent definition embedded directly in a workflow markdown file." It is declared under a `## agent: \`name\`` heading, and the parent prompt invokes it by name. ([Inline Sub-Agents](https://github.github.com/gh-aw/reference/inline-sub-agents/))

```yaml
# Source: https://raw.githubusercontent.com/github/gh-aw/main/docs/src/content/docs/reference/engines.md ("Copilot Custom Configuration")
engine:
  id: copilot
  agent: technical-doc-writer  # .github/agents/technical-doc-writer.agent.md
```
> - Source: [engines.md in github/gh-aw](https://raw.githubusercontent.com/github/gh-aw/main/docs/src/content/docs/reference/engines.md) | Provenance: verbatim (only the `# Source:` comment was added). This is a frontmatter fragment, not a complete workflow; [About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows) shows a complete example.

**Safe outputs (the guardrail to put on a slide).**

> "Safe outputs enforce security through separation: agents run read-only and request actions via structured output, while separate permission-controlled jobs execute those requests."
> - Source: [Safe Outputs (gh-aw docs)](https://github.github.com/gh-aw/reference/safe-outputs/)

Other layers include read-only tokens by default, a firewalled container behind the Agent Workflow Firewall, secrets kept outside the agent runtime, and a threat-detection job that scans proposed outputs. ([About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows); [Public preview changelog](https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/)) The project homepage says: "Copilot, Claude Code, Codex or Gemini triage issues, investigate failures and open pull requests on your repo. Safely, with strong guardrails, in GitHub Actions." ([gh-aw home](https://github.github.com/gh-aw/))

**gh-aw compared with cloud agent automations.** Both automate repository work. Cloud agent automations are configured in the Agents tab. gh-aw workflows are version-controlled Markdown files that compile into Actions YAML and support several engines. ([GitHub Copilot on GitHub.com](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github))

---

## 4. Comparison Table

**How to read the status column.** Product-level status (for example, an app's GA) is kept separate from the status of individual commands or customizations. A capability without its own dated evidence is marked "documentation observation" and gets no status label. "Shipped … no separate status label" means dated release evidence exists but no explicit GA or preview label was published; it is never a GA badge.

| Surface | Where it runs | Multi-agent capability | Status (product vs. feature) | Source date |
|---|---|---|---|---|
| **VS Code: Local harness** (`runSubagent`, custom agents, `handoffs`) | VS Code extension host on your machine; active workspace | Context-isolated, stateless subagents (parallel); coordinator `agents` allow-list; opt-in nesting; handoff buttons between agents | Custom agents and `handoffs`: shipped in VS Code 1.106, no separate status label. Subagents and the `agents`/`user-invocable`/`disable-model-invocation` keys: shipped in VS Code 1.109, no separate status label. Custom agents *as* subagents: **Experimental** (1.107), setting-gated in 1.109. Nested subagents: shipped in VS Code 1.113, no separate status label. Depth-5 cap, Auto-for-subagents and agent `hooks`: documentation observations. | 2025-11-12 ([1.106](https://code.visualstudio.com/updates/v1_106)); 2025-12-10 ([1.107](https://code.visualstudio.com/updates/v1_107)); 2026-02-04 ([1.109](https://code.visualstudio.com/updates/v1_109)); 2026-03-25 ([1.113](https://code.visualstudio.com/updates/v1_113)) |
| **VS Code: Copilot harness + Agents window** | Agent Host on your machine, a remote host, or a Dev Container; folder or worktree | SDK-managed built-in/custom subagents; peer chats; agents create sessions/chats; parallel worktree sessions; `/delegate` to cloud; remote-host delegation | Copilot harness: shipped in VS Code 1.140, no separate status label. Agents window: **Preview**. Agent-created chats/sessions: shipped in VS Code 1.136–1.140, no separate status label. Remote-host delegation and multi-folder sessions: **Experimental**. | 2026-09-30 ([1.140](https://code.visualstudio.com/updates/v1_140)); 2026-05-13 ([1.120](https://code.visualstudio.com/updates/v1_120)); 2026-10-01 ([Sept. roundup](https://github.blog/changelog/2026-10-01-github-copilot-in-vs-code-september-2026-releases/)) |
| **VS Code: Claude / Codex harnesses, Cloud target** | Local machine (Claude, Codex); provider remote infrastructure (Cloud) | Provider-native subagents; handoff between harnesses and to Cloud | Hand-off to another agent type: shipped in VS Code 1.109, no separate status label. Third-party cloud agents: **Preview** in 1.109 and still "currently in preview" on the undated docs. Codex on Agent Host: Experimental per undated docs (documentation observation). | 2026-02-04 ([1.109](https://code.visualstudio.com/updates/v1_109)); docs read 2026-10-05 ([agent harnesses](https://code.visualstudio.com/docs/agents/run/agent-harnesses)) |
| **GitHub Copilot app** | Desktop (macOS, Windows, Linux); new worktree, local repo, or GitHub-hosted cloud sandbox | Parallel isolated sessions; documented commands `/fleet`, `/spawn`, `/orchestrate`, `/rubber-duck`, `/agent` | Product: **GA**. Individual commands: documentation observations (no per-command dates). Sandboxes and `/security-review`: **public preview** per docs. | 2026-06-17 ([GA](https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/)) |
| **Copilot cloud agent** (GitHub.com) | Ephemeral cloud development environment powered by GitHub Actions | Concurrent async sessions; custom agents (repo/org/enterprise); `agent` alias to invoke another custom agent; self-review with code review; automations | Product: **GA** (as coding agent). Custom agents and automatic security/quality validation, including self-review: shipped 2025-10-28, no separate status label. Branch-without-PR workflow: shipped 2026-04-01, no separate status label. Assign-issue flow: **public preview** per current how-to. `agent` alias and automations: documentation observations. | 2025-09-25 ([GA](https://github.blog/changelog/2025-09-25-copilot-coding-agent-is-now-generally-available/)); 2025-10-28 ([custom agents](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/), [validation](https://github.blog/changelog/2025-10-28-copilot-coding-agent-now-automatically-validates-code-security-and-quality/)); 2026-04-01 ([changelog](https://github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent/)) |
| **Agent management** (Agents tab, page and panel; formerly "mission control") | GitHub.com and GitHub Mobile; opens sessions in VS Code or Copilot CLI | Start, monitor, steer and track many sessions; choose Copilot, third-party or custom agents | Mission control view: shipped 2025-10-28. Repository Agents tab: shipped 2026-01-26. Neither has a separate status label. | 2025-10-28 ([mission control](https://github.blog/changelog/2025-10-28-a-mission-control-to-assign-steer-and-track-copilot-coding-agent-tasks/)); 2026-01-26 ([Agents tab](https://github.blog/changelog/2026-01-26-introducing-the-agents-tab-in-your-repository/)) |
| **Agent HQ third-party agents** (Claude, Codex) | Same GitHub cloud agent platform; also VS Code and GitHub Mobile | Assign multiple agents to one issue and compare | **Public preview** | 2026-02-04 ([launch](https://github.blog/changelog/2026-02-04-claude-and-codex-are-now-available-in-public-preview-on-github/)); 2026-02-26 ([expansion](https://github.blog/changelog/2026-02-26-claude-and-codex-now-available-for-copilot-business-pro-users/)) |
| **Copilot code review (agentic)** | GitHub Actions runners (standard, larger, or self-hosted) | Tool-calling reviewer; passes suggestions to cloud agent; used by cloud agent for self-review | Product and agentic architecture: **GA**. Passing suggestions to cloud agent: **public preview** per current docs. | 2026-03-05 ([changelog](https://github.blog/changelog/2026-03-05-copilot-code-review-now-runs-on-an-agentic-architecture/)) |
| **GitHub Agentic Workflows (gh-aw)** | GitHub Actions, in a sandboxed container behind a firewall | Engine (Copilot CLI by default) plus `.agent.md` files or inline sub-agents; separate safe-output and threat-detection jobs | Product: **public preview**. Individual features such as `engine.agent` and inline sub-agents are documented within the preview product without their own dates. | 2026-06-11 ([changelog](https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/)) |

---

## 5. Practical Guidance: Sharing Agent Definitions and Slide Plan

### 5.1 Writing one agent file for many surfaces

GitHub's cross-surface reference states two rules that make sharing work:

> "All unrecognized tool names are ignored, which allows product-specific tools to be specified in an agent profile without causing problems."
> - Source: [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

> "The `argument-hint` and `handoffs` properties from VS Code and other IDE custom agents are currently not supported for Copilot cloud agent on GitHub.com. They are ignored to ensure compatibility."
> - Source: [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

A read-only worker that uses only cross-surface keys and tool aliases (`read`, `search`) is the safest portable shape. The official VS Code example below already uses that shape:

```markdown
---
# Source: https://code.visualstudio.com/docs/agents/run/subagents (Run a custom agent as a subagent; line breaks restored)
name: Codebase Researcher
description: Find relevant code and explain existing patterns
user-invocable: false
tools: ['read', 'search']
---
Research the requested topic without changing files. Return relevant file paths, existing patterns, and unanswered questions.
```
> - Source: [Use subagents in VS Code](https://code.visualstudio.com/docs/agents/run/subagents) | Provenance: adapted (the page rendered without line breaks when fetched; only line breaks and the `# Source:` comment were added)

Where the file is picked up:
- **VS Code:** `.github/agents/`. ([Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents))
- **Cloud agent, the Copilot app and the CLI:** repository, organization or enterprise agent locations. ([About custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents))
- **gh-aw:** through `engine.agent` or `imports`. ([Copilot Agent Files](https://github.github.com/gh-aw/reference/copilot-custom-agents/))

R2 §10 documents which keys the CLI honors. For example, R2 marks `user-invocable` CLI behavior as unverified.

### 5.2 Suggested 2–4 slide plan

1. **"Same agents, more surfaces."** Use the condensed §4 table with three columns (surface, where it runs, status and date) and one line: "`.github/agents/*.agent.md` travels with the repo." Keep product-level status separate from feature-level status, and never turn "shipped … no separate status label" into a GA badge.
2. **"VS Code: subagents, handoffs, Agents window."** Use these labels:
   - Subagents (parallel): shipped in VS Code 1.109 (2026-02-04); no separate status label.
   - `handoffs` buttons: shipped in VS Code 1.106 (2025-11-12); no separate status label.
   - Hand-off of a session to another agent type: shipped in VS Code 1.109 (2026-02-04); no separate status label.
   - Agents window: **Preview** (VS Code 1.120, 2026-05-13).
   - Coordinator → custom-agent workers (`agents` allow-list): **Experimental** (1.107, 2025-12-10), setting-gated in 1.109.

   Present nesting depth, the Session Target naming and Rubber Duck only as unlabeled background documentation observations.
3. **"Desktop and cloud: the Copilot app and cloud agent."**
   - Show the app's parallel worktree sessions. The app is **GA** (2026-06-17).
   - Mention `/fleet`, `/spawn` and `/orchestrate` only as unlabeled "documented in the app's command reference" observations.
   - Show the cloud agent's issue → branch/PR → self-review → human review → `@copilot` loop. The product is **GA** (2025-09-25). Self-review and custom agents shipped 2025-10-28 with no separate status label. The assignment flow is **public preview** per the current how-to.
   - Show the Agents tab as the shared sessions view; it shipped 2026-01-26 with no separate status label.
4. **"Automation and review on GitHub.com (brief)."** Cover agentic code review (**GA**, 2026-03-05), gh-aw with safe outputs (**public preview**, 2026-06-11; Copilot CLI engine by default) and Agent HQ with Claude and Codex (**public preview**, 2026-02-04; compare agents on one issue).

### 5.3 Light demo hooks (optional)

Demos are limited to capabilities with dated evidence.

- **From the CLI to the Agents tab.** Delegate from the CLI (R5), then show the session in the repository's **Agents** tab and use **Continue in GitHub Copilot CLI** to bring it back. The Agents tab and Continue in Copilot CLI shipped 2026-01-26 with no separate status label. ([Agents tab changelog](https://github.blog/changelog/2026-01-26-introducing-the-agents-tab-in-your-repository/); [About agent management](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/agent-management))
- **VS Code.** Ask for a plain subagent in a Local session and show it appearing in the Chat view, for example the docs' read-only prompt "Use a subagent to find how authentication works in this codebase. Do not change files. Return the relevant files, the authentication flow, and any unanswered questions." Subagents shipped in VS Code 1.109 (2026-02-04) with no separate status label. Do not demo the coordinator → custom-agent-worker pattern unless it is labeled **Experimental**, because its last dated status is Experimental and setting-gated. ([VS Code 1.109](https://code.visualstudio.com/updates/v1_109); [Use subagents in VS Code](https://code.visualstudio.com/docs/agents/run/subagents))

---

## 6. Best Practices and Pitfalls

- **Write self-contained subagent prompts.** A Local subagent "doesn't inherit the main conversation history". Pass the goal, the context, the allowed actions and the expected result. ([Use subagents in VS Code](https://code.visualstudio.com/docs/agents/run/subagents))
- **Bound recursion.** Nested subagents are opt-in (shipped in VS Code 1.113). The docs cap them at depth 5, which is a documentation observation. Include a stopping condition. ([VS Code 1.113](https://code.visualstudio.com/updates/v1_113); [Use subagents in VS Code](https://code.visualstudio.com/docs/agents/run/subagents))
- **Treat worktrees as change isolation, not as a security boundary.** "A worktree isolates code changes but isn't a security boundary." Worktree sessions in VS Code use **Allow all**. ([Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses))
- **Put post-assignment requirements on the PR.** The cloud agent does not react to new issue comments after assignment. ([Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github))
- **Review workflow changes before approving CI.** By default, Actions workflows don't run on Copilot pushes until a human approves them, but this default can be configured so that workflows run without human intervention. Either way, pay special attention to changes under `.github/workflows/`. R7 covers the governance setting. ([Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github))
- **Scope cloud tasks to under an hour, one repo and one PR.** These are the documented limits of the 59-minute session. ([GitHub Copilot on GitHub.com](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github))
- **Don't expect authenticated MCP servers in VS Code Copilot-harness sessions yet.** Only local, unauthenticated MCP servers are supported. ([Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses))
- **Keep gh-aw writes in `safe-outputs`.** Agents run read-only, and declared outputs are executed by separate jobs. ([Safe Outputs](https://github.github.com/gh-aw/reference/safe-outputs/))
- **Expect per-surface differences.** VS Code warns that tools, models, permissions and supported customizations "can differ between experiences". ([Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses))

---

## 7. Research Limitations

1. **Lifecycle evidence for VS Code features.** VS Code docs pages carry no publication date, so an absent Preview tag on a docs page is not used as a status. Round 1 of this report used "Stable, no preview label" badges inferred that way; they are removed. Labels now come only from dated release notes, following the brief's rule:
   - **Explicit label:** Preview or Experimental, with the release date.
   - **Dated release evidence but no explicit label:** "shipped in VS Code <version> (<date>); no separate status label", using VS Code versions and never a GA badge.
   - **Neither:** "documentation observation", kept out of labeled claims and demos.

   Gaps remain:
   - **Custom agents as subagents:** no dated evidence shows when custom agents stopped requiring `chat.customAgentInSubagent.enabled`. The last dated status is Experimental (1.107) and still behind the setting (1.109). The current docs describe it without the setting.
   - **Documentation-only details:** the depth-5 nesting limit, Session Target naming, Rubber Duck in the harness and cross-product session discovery are documentation-only.
   - **Agents window:** it was "available as a preview in VS Code Stable" in 1.120 (2026-05-13). No later GA announcement was found, so this report labels it Preview.

   ([VS Code 1.106](https://code.visualstudio.com/updates/v1_106); [VS Code 1.107](https://code.visualstudio.com/updates/v1_107); [VS Code 1.109](https://code.visualstudio.com/updates/v1_109); [VS Code 1.113](https://code.visualstudio.com/updates/v1_113); [VS Code 1.120](https://code.visualstudio.com/updates/v1_120))
2. **Claude harness label.** The VS Code harness page links to its Claude section with the anchor `#_claude-preview`. That suggests a Preview label, but the expanded section text did not show the label explicitly. Cloud use of Claude and Codex is explicitly "currently in preview". ([Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses))
3. **Conflicting Copilot app policy statements.** The GA changelog (2026-06-17) says Business and Enterprise users need "the Copilot CLI enabled in policy settings". The current docs say "the GitHub Copilot app policy must remain enabled. This policy is enabled by default and is separate from the Copilot CLI policy." This report prefers the newer docs and leaves the policy to R7. ([GA changelog](https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/); [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app))
4. **Issue assignment flow labeled preview.** The cloud agent became GA on 2025-09-25, yet the current how-to puts "This feature is in public preview and subject to change" directly under "Assigning an issue to Copilot". The note may cover only the newer assignment dialog options (target repository, custom agent and model), but the page doesn't say. This report reports the label as published. ([Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github))
5. **Rename date not pinned.** The earliest primary source read that uses "formerly known as Copilot coding agent" is the 2026-04-01 changelog. The exact rename date was not verified. Separately, the old concept URL `.../cloud-agent/about-cloud-agent` now redirects to "GitHub Copilot on GitHub.com" (`.../copilot-surfaces/copilot-on-github`), which is cited instead. ([2026-04-01 changelog](https://github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent/); [GitHub Copilot on GitHub.com](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github))
6. **"Mission control" and Agent HQ dates.** The Agent HQ Universe blog post had no visible date in the fetched text. Its linked mission-control changelog is dated 2025-10-28, so this report dates the announcement to Universe 2025, October 2025. The Agent HQ blog said Copilot CLI support for Claude and Codex was "coming soon" on 2026-02-04. Its current status was not verified here (R5 owns the CLI). ([Introducing Agent HQ](https://github.blog/news-insights/company-news/welcome-home-agents/); [Pick your agent](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/))
7. **Superseded pricing statements.** The February 2026 posts say each third-party agent session "consumes one premium request during public preview". Current docs describe consumption of **GitHub Actions minutes and AI credits** instead. Plan eligibility also widened over time: the docs now say third-party agents "are available for all paid Copilot plans". All pricing and plan details belong to R8. ([Changelog, 2026-02-26](https://github.blog/changelog/2026-02-26-claude-and-codex-now-available-for-copilot-business-pro-users/); [About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents); [Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github))
8. **Rendering losses.** Several pages (VS Code custom agents and subagents, gh-aw docs) lost code-block line breaks or tables when fetched. The two `.agent.md` examples are reconstructed with line breaks only and are labeled "adapted". The gh-aw YAML snippet was taken verbatim from the raw Markdown source in `github/gh-aw`. The inline sub-agent page's table of per-engine extraction paths did not render and is not used.
9. **Scope boundaries.** The behavior of the Copilot-harness subagents in VS Code is deferred to GitHub's "built-in and custom agents" docs (R1). The full `.agent.md` key matrix is in R2. Org and enterprise enablement (third-party agents, the cloud agent, app policy, custom agents at org or enterprise level) belongs to R7, and cost figures belong to R8. Surfaces named in some sources but excluded by the brief (JetBrains, Eclipse, Xcode, Visual Studio) were not researched.
10. **Reading method.** WebIQ `web` was used for discovery. WebIQ `browse` was used for five pages:
    - VS Code subagents, Copilot app getting started, the Agent HQ blog (2026-02-04) and the coding agent blog (2026-02-26), the last two for publication dates;
    - in the revision, the VS Code 1.106 release notes.

    All other pages were read with `web_fetch`, and docs.github.com pages were read through the docs article-body API. No third-party sources are cited.
11. **Redirected changelog URL.** The mission-control changelog links to a custom-agents changelog at a `2025-11-27-…` URL. That URL redirects to `2025-10-28-custom-agents-for-github-copilot`, so this report uses the redirect target and its 2025-10-28 date. ([Custom agents for GitHub Copilot](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/))
12. **Self-review chronology.** The 2025-10-28 validation changelog is the earliest dated source read that describes the cloud agent reviewing its own code, so the 2026-02-26 GitHub Blog article is cited as corroboration only. The Agent HQ Universe article may also mention an integrated code-review step, but the text read for this report was truncated before any such passage, so this report doesn't rely on it. ([Validation changelog](https://github.blog/changelog/2025-10-28-copilot-coding-agent-now-automatically-validates-code-security-and-quality/); [What's new with GitHub Copilot coding agent](https://github.blog/ai-and-ml/github-copilot/whats-new-with-github-copilot-coding-agent/)) ([Validation changelog](https://github.blog/changelog/2025-10-28-copilot-coding-agent-now-automatically-validates-code-security-and-quality/); [What's new with GitHub Copilot coding agent](https://github.blog/ai-and-ml/github-copilot/whats-new-with-github-copilot-coding-agent/))

---

## 8. Complete Reference List

### Documentation and Articles: VS Code (code.visualstudio.com)

1. [Use subagents in Visual Studio Code](https://code.visualstudio.com/docs/agents/run/subagents): `runSubagent`, `agents` allow-list, nesting, model order, Copilot/Claude/Codex harness subagents.
2. [Custom agents in VS Code](https://code.visualstudio.com/docs/agent-customization/custom-agents): `.agent.md` fields, locations, `handoffs`, org-level discovery, chat modes rename.
3. [Choose and use an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses): Local/Copilot/Claude/Codex/Cloud targets, shared runtime, Session Target handoff, limitations.
4. [Build with AI in VS Code (agents overview)](https://code.visualstudio.com/docs/agents/overview): harnesses, Agents window, Copilot CLI, and the GitHub Copilot app as related surfaces.
5. [Use the Agents window](https://code.visualstudio.com/docs/agents/run/agents-window): window layout, session start, Dev Container sessions.
6. [Understand sessions and chats](https://code.visualstudio.com/docs/agents/concepts/sessions): peer chats, cross-session coordination, cross-product session discovery, handoff.
7. [Visual Studio Code 1.140 release notes (2026-09-30)](https://code.visualstudio.com/updates/v1_140): Copilot harness, experimental multi-folder sessions and remote-host delegation.
8. [Visual Studio Code 1.120 release notes (2026-05-13)](https://code.visualstudio.com/updates/v1_120): Agents window preview in Stable; CLI plugin discovery.
9. [Visual Studio Code 1.106 release notes (October 2025 release, published 2025-11-12)](https://code.visualstudio.com/updates/v1_106): chat modes renamed to custom agents; `target` and `handoffs` frontmatter.
10. [Visual Studio Code 1.107 release notes (November 2025 release, published 2025-12-10)](https://code.visualstudio.com/updates/v1_107): "Run agents as subagents (Experimental)"; experimental org-level custom agents.
11. [Visual Studio Code 1.109 release notes (January 2026 release, published 2026-02-04)](https://code.visualstudio.com/updates/v1_109): parallel subagents; `user-invocable`, `disable-model-invocation` and `agents`; custom agents as subagents still behind a setting; handoff `model`; session-type hand-off; third-party cloud agents (Preview).
12. [Visual Studio Code 1.113 release notes (2026-03-25)](https://code.visualstudio.com/updates/v1_113): nested subagents (`chat.subagents.allowInvocationsFromSubagents`).

### Documentation and Articles: GitHub Docs (docs.github.com)

13. [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app)
14. [Getting started with the GitHub Copilot app](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app) (reached from `/en/copilot/how-tos/github-copilot-app/getting-started`)
15. [Working with agent sessions in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions)
16. [Slash commands for the GitHub Copilot app](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands)
17. [GitHub Copilot on GitHub.com](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-on-github) (redirect target of `/en/copilot/concepts/agents/cloud-agent/about-cloud-agent`)
18. [About agent management](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/agent-management)
19. [Starting GitHub Copilot sessions](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions)
20. [Using Copilot cloud agent on GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github)
21. [About custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents)
22. [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
23. [About Copilot automations](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-automations)
24. [About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents)
25. [About GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review)
26. [About GitHub Agentic Workflows](https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows)

### Documentation and Articles: GitHub Changelog (github.blog/changelog)

27. [GitHub Copilot app is now available in technical preview (2026-05-14)](https://github.blog/changelog/2026-05-14-github-copilot-app-is-now-available-in-technical-preview/)
28. [GitHub Copilot app generally available (2026-06-17)](https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/)
29. [Research, plan, and code with Copilot cloud agent (2026-04-01)](https://github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent/)
30. [Copilot coding agent is now generally available (2025-09-25)](https://github.blog/changelog/2025-09-25-copilot-coding-agent-is-now-generally-available/)
31. [A mission control to assign, steer, and track Copilot coding agent tasks (2025-10-28)](https://github.blog/changelog/2025-10-28-a-mission-control-to-assign-steer-and-track-copilot-coding-agent-tasks/)
32. [Custom agents for GitHub Copilot (2025-10-28)](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/) (redirect target of the `2025-11-27-custom-agents-for-github-copilot` URL)
33. [Copilot coding agent now automatically validates code security and quality (2025-10-28)](https://github.blog/changelog/2025-10-28-copilot-coding-agent-now-automatically-validates-code-security-and-quality/)
34. [Introducing the Agents tab in your repository (2026-01-26)](https://github.blog/changelog/2026-01-26-introducing-the-agents-tab-in-your-repository/)
35. [Claude and Codex are now available in public preview on GitHub (2026-02-04)](https://github.blog/changelog/2026-02-04-claude-and-codex-are-now-available-in-public-preview-on-github/)
36. [Claude and Codex now available for Copilot Business & Pro users (2026-02-26)](https://github.blog/changelog/2026-02-26-claude-and-codex-now-available-for-copilot-business-pro-users/)
37. [Copilot code review now runs on an agentic architecture (2026-03-05)](https://github.blog/changelog/2026-03-05-copilot-code-review-now-runs-on-an-agentic-architecture/)
38. [GitHub Agentic Workflows are now in technical preview (2026-02-13)](https://github.blog/changelog/2026-02-13-github-agentic-workflows-are-now-in-technical-preview/)
39. [GitHub Agentic Workflows is now in public preview (2026-06-11)](https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/)
40. [GitHub Copilot in VS Code, September 2026 releases (2026-10-01)](https://github.blog/changelog/2026-10-01-github-copilot-in-vs-code-september-2026-releases/)
41. [Copilot SDK is now generally available (2026-06-02)](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/)

### Documentation and Articles: GitHub Blog (github.blog)

42. [Introducing Agent HQ: Any agent, any way you work (GitHub Universe 2025)](https://github.blog/news-insights/company-news/welcome-home-agents/)
43. [Pick your agent: Use Claude and Codex on Agent HQ (2026-02-04)](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)
44. [What's new with GitHub Copilot coding agent (2026-02-26)](https://github.blog/ai-and-ml/github-copilot/whats-new-with-github-copilot-coding-agent/)

### Documentation and Articles: GitHub Agentic Workflows site (github.github.com/gh-aw)

45. [GitHub Agentic Workflows (home)](https://github.github.com/gh-aw/)
46. [AI Engines](https://github.github.com/gh-aw/reference/engines/)
47. [Copilot Agent Files](https://github.github.com/gh-aw/reference/copilot-custom-agents/)
48. [Inline Sub-Agents](https://github.github.com/gh-aw/reference/inline-sub-agents/)
49. [Safe Outputs](https://github.github.com/gh-aw/reference/safe-outputs/)

### GitHub Repositories and Code Samples

50. [`github/gh-aw`: docs/src/content/docs/reference/engines.md (raw)](https://raw.githubusercontent.com/github/gh-aw/main/docs/src/content/docs/reference/engines.md): source of the verbatim `engine.agent` YAML snippet.

**Code samples in this report:**
- VS Code handoff frontmatter (adapted): from source 2.
- Portable read-only worker agent (adapted): from source 1.
- gh-aw `engine.agent` fragment (verbatim): from source 50.
