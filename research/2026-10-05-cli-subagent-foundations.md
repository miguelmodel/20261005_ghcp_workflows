# Research Report: Copilot CLI multi-agent foundations and built-in subagents

**Date:** 2026-10-05
**Researcher:** Copilot Web Researcher Agent
**Topic slug:** cli-subagent-foundations
**Sources consulted:** 32 total — 14 official GitHub Docs pages (docs.github.com), 10 GitHub Blog / GitHub Changelog posts, 7 official GitHub repository sources (github/copilot-cli ×6, github/docs ×1), 1 third-party community note (labeled corroboration only)
**Required MCP:** verified - WebIQ-MCP; tools used: web, browse, news

> **Assignment:** R1 of the brief "Subagents & Multi-Agent Orchestration with GitHub Copilot CLI" (audience: practitioners new to multi-agent systems in GitHub Copilot). Everything here was re-verified against sources retrieved on 2026-10-05; prior model knowledge was not used for facts.
> **Boundaries (cross-reference only):** custom agent file format and frontmatter → R2 (`cli-custom-agents`); instructions, skills, plugins, MCP → R3 (`cli-customization-mcp`); permissions, hooks, guardrails → R4 (`cli-permissions-guardrails`); `/fleet`, `/delegate`, `/review`, programmatic use, dynamic workflows → R5 (`cli-fleet-delegate-workflows`); plans and pricing → R8.

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overview and Key Concepts](#2-overview-and-key-concepts)
3. [Built-in Agents Catalog](#3-built-in-agents-catalog)
4. [Delegation Mechanics](#4-delegation-mechanics)
5. [Model, Reasoning-Effort and Context-Tier Selection for Subagents](#5-model-reasoning-effort-and-context-tier-selection-for-subagents)
6. [Inspecting and Managing Running Agents](#6-inspecting-and-managing-running-agents)
7. [Terminology, Naming Changes and GA/Preview Status](#7-terminology-naming-changes-and-gapreview-status)
8. [Practical Guidance: Demo-able Scenarios](#8-practical-guidance-demo-able-scenarios)
9. [Configuration, Best Practices and Pitfalls](#9-configuration-best-practices-and-pitfalls)
10. [Related Multi-Agent Features (Cross-References)](#10-related-multi-agent-features-cross-references)
11. [Research Limitations](#11-research-limitations)
12. [Complete Reference List](#12-complete-reference-list)

---

## 1. Executive Summary

- **One main agent, many subagents.** Every Copilot CLI session has a main (root) agent that processes your prompt. It can start *subagents*: separate agent runs, each with its own context window, launched through the built-in `task` tool. Copilot CLI has been generally available since 2026-02-25. Sources: [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents), [Comparing Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features), [GA changelog (2026-02-25)](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/).
- **Seven built-in agents are documented today:** `explore`, `task`, `general-purpose`, `code-review`, `research`, `rubber-duck` and `security-review`. The command reference lists a default model for each one. A "Plan" agent that appeared in January–February 2026 announcements is **no longer listed**, and no removal notice was found. Planning is now done in the documented **plan mode** (`Shift+Tab`, `/plan`). Sources: [CLI command reference — Built-in agents](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Changelog 2026-01-14](https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/).
- **The model decides when to delegate.** Delegation is a judgment by the main model, guided by each agent's `description`. Since "smarter subagent delegation" (v1.0.42+, blog post dated 2026-06-12), it has been deliberately *selective*: focused work stays in the main agent, while independent, broad or parallel work goes to subagents. Sources: [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents), [GitHub Blog, 2026-06-12](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/).
- **Subagents can run in the foreground or the background, and they can be multi-turn.** The agent-management tools are `task`, `read_agent`, `write_agent` and `list_agents`. Multi-turn subagents have been "always enabled" since v1.0.72 (2026-07-20). The `/tasks` dialog lets you inspect a subagent, *teleport* into it, steer it, kill it, or promote it to the background. Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md).
- **Model and reasoning effort resolve in a documented order:** an explicit per-call value, then the `subagents` override in `~/.copilot/settings.json` (set through `/subagents`, alias `/agents`), then the agent definition, then the parent session.
  - **Context tier** has documented controls (`--context`, `/model`, the `contextTier` settings), but GitHub does not document a full ordering for it (⚠️ unverified).
  - **`"inherit"`** is valid for `model`, `effortLevel` and `contextTier`. It is not valid for `modelPolicy`, which accepts only `"preferred"` or `"required"`.
  - **Auto.** The documented rule is narrower than "always": when the session uses Auto, a **custom agent's `model` field** is overridden by the resolved session model. `research` (a fixed model) and `rubber-duck` (a complementary-model critic) follow their own documented rules, and how they interact with Auto is not documented (§5).
  - Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference).
- **Delegation has costs.** Subagents can make extra LLM calls, which consume more AI credits. Every handoff adds coordination overhead, and the CLI caps nesting depth and concurrency (the concurrency default depends on your plan). Sources: [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).
- **Lifecycle labels (§7.1 has the full table and presentation decisions):**
  - Rubber duck has been **GA since 2026-06-02**.
  - `/security-review` launched as **experimental public preview on 2026-06-10** and stopped needing `--experimental` in v1.0.64 (2026-06-23). No GA announcement was found.
  - `explore`, `task` and `code-review` are named in the CLI **GA** announcement (2026-02-25).
  - `general-purpose` and sidekick agents have **no dated lifecycle evidence**, so they are held out of labeled claims and demos.
  - `/research`, `/subagents` and `/tasks` have dated releases in the stable changelog but **no GA/preview label**. Presenting them with lifecycle wording needs the caller's decision.
  - Sources: [Changelog 2026-06-02](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/), [Changelog 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/), [copilot-cli changelog @ v1.0.67](https://raw.githubusercontent.com/github/copilot-cli/v1.0.67/changelog.md), [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/).

---

## 2. Overview and Key Concepts

### 2.1 Vocabulary: agent, main agent, subagent, custom agent, built-in agent

The GitHub Docs separate a *custom agent* (a **definition**: a profile with a prompt, tools and optional MCP servers) from a *subagent* (an **execution**: a separate agent run that the main agent starts). Built-in agents are pre-built custom agents that ship with the CLI. Source: [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features).

> "A **subagent** is the execution of a separate AI agent that the main agent of a Copilot CLI session spins up to do a specific piece of work."
> - Source: [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)

> "In addition to the main Copilot agent, which processes your request when you submit a prompt, Copilot CLI includes the following built-in agents which the main agent can run as subagents to assist with common development tasks."
> - Source: [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)

| Term (as used in official sources) | Meaning | Source |
|---|---|---|
| Main agent / root agent / session agent | The agent that handles your prompt. This is either the default agent or a custom agent you selected with `--agent` or `/agent`. | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Subagent (the SDK docs and best-practices page spell it "sub-agent") | A delegated agent run with its own context window, started through the `task` tool | [Comparing CLI features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features), [SDK: Custom agents and sub-agent orchestration](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents) |
| Custom agent / agent profile | A Markdown definition (prompt, tools, MCP servers) that the main agent can run as a subagent or that you can select as the session agent (format → R2) | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| Built-in agents ("pre-built custom agents", "default group of custom agents") | Agents shipped with the CLI: `explore`, `task`, `general-purpose`, `code-review`, `research`, `rubber-duck`, `security-review` | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents), [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents) |

Agents surface to the main model as tools. When custom agents arrived in the CLI (changelog dated 2025-10-28), GitHub described the mechanism this way:

> "Your custom agents are also made available as tools to Copilot, and the model will start a new agentic loop using a relevant custom agent when necessary."
> - Source: [GitHub Changelog, 2025-10-28](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/)

### 2.2 Why use subagents, and when not to

The docs give three reasons to use subagents. First, they keep the main context window focused. Second, they let work run in parallel or in the background. Third, they apply specialist custom agents. Source: [Comparing CLI features — Subagents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features).

> "Keep the context window of the main agent in a CLI session focused, by offloading a chunk of work to a separate agent."
> - Source: [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)

| Benefit | Mechanism | Trade-off | Sources |
|---|---|---|---|
| **Context isolation** | Each subagent works in its own context window and returns only its result. `explore`, for example, returns focused answers under 300 words. | The subagent starts without your conversation history (see §2.5), so the handoff prompt has to carry the context. | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| **Specialization** | Restricted tools and a tailored prompt, such as read-only reviewers or a command runner | More agents to describe and maintain (R2) | [Comparing CLI features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features) |
| **Parallelism** | Read-only agents such as `explore` "can be called in parallel"; work can also run in the background | Concurrency caps apply (§6.3), and parallel agents mean more LLM calls | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents), [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet) |
| **Model mix** | Cheaper or faster models for exploration and commands, stronger or different models for review and critique | Model and effort settings interact through a precedence order (§5) | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck) |

Cost and latency are real considerations. The `/fleet` concept page warns about AI-credit consumption, and the GitHub Blog post on delegation says each handoff adds coordination overhead, tool calls and wait time. Sources: [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet), [GitHub Blog, 2026-06-12](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/).

> "Each subagent can interact with the LLM independently of the main agent, so splitting work up into smaller tasks that are run by subagents may result in more LLM interactions than if the work was handled by the main agent."
> - Source: [Running tasks in parallel with the /fleet command](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)

> "Subagents should be treated as a parallelism tool, not a pause button."
> - Source: [How we made GitHub Copilot CLI more selective about delegation (2026-06-12)](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/)

### 2.3 The CLI agent loop

GitHub describes the basic loop of a coding agent as assess → plan → implement → test → iterate. The CLI runs that loop in the main agent and starts a fresh loop for each subagent. Sources: [GitHub Blog, 2026-04-06](https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/), [Changelog 2025-10-28](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/).

> "Today’s coding agents follow a clear loop. First, the agent assesses the task, then drafts a plan, implements, tests, and iterates if necessary."
> - Source: [GitHub Copilot CLI combines model families for a second opinion (2026-04-06)](https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/)

The CLI's OpenTelemetry schema is the most precise official description of the loop's structure. Each agent invocation is an `invoke_agent` span that contains `chat` spans (LLM calls) and `execute_tool` spans (tool calls). Subagent invocations get their own `invoke_agent` spans, and `github.copilot.turn_count` records the number of LLM round-trips. Source: [CLI command reference — OpenTelemetry monitoring](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

> "Wraps the entire agent invocation: all LLM calls and tool executions for one user message."
> - Source: [GitHub Copilot CLI command reference (`invoke_agent` span)](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

```text
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference (OTel spans; agent tools)
# Diagram only; synthesized from the documented span tree and tool names.
User prompt
└─ main agent ............................ invoke_agent
   ├─ chat (LLM call) → chooses tools
   ├─ execute_tool: view / grep / glob / edit / bash ...
   ├─ execute_tool: task ───────────────► subagent (own context window) .... invoke_agent
   │                                       ├─ chat …
   │                                       └─ execute_tool … → result returned to parent
   ├─ execute_tool: read_agent / write_agent (background or multi-turn agents)
   └─ … repeat until done → response to user
```
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: synthesized

You can interact with the loop while it runs. By default, a prompt you send while Copilot is working is treated as *steering* and folded into the current task. `Ctrl+Enter` or `Ctrl+Q` *queues* the message instead, so it runs as the next turn. In interactive sessions, `Shift+Tab` cycles through the standard, plan and autopilot modes (autopilot → R4/R5). Sources: [Steering agents in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-agents), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

### 2.4 Context window, compaction and checkpoints

The context window holds the system instructions, the tool definitions, your messages, Copilot's responses, and every tool call with its result. To keep a single tool from flooding that window, any tool output over 20 KiB (`COPILOT_LARGE_OUTPUT_THRESHOLD_BYTES`, default `20480`) goes to a temporary file, and the model receives the path plus a preview. `/context` shows usage broken into System Prompt, Custom Instructions, System Tools, MCP Tools, Messages, Free Space and Buffer. Source: [Managing context in GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management).

> "When your conversation reaches approximately 80% of the context window's capacity, Copilot CLI automatically starts compacting the context in the background."
> - Source: [Managing context in GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management)

How compaction works:

- **Thresholds.** Compaction starts at about 80% and leaves about 20% as a buffer. If the window reaches about 95% before compaction finishes, the CLI pauses until it is done.
- **Process.** The model writes a structured summary, which replaces the history. The summary keeps the original user instructions and the current plan or to-do state. Fine-grained detail can be lost, and a compaction cannot be reversed.
- **Checkpoints.** Every compaction creates a checkpoint. List them with `/session checkpoints` and view one with `/session checkpoints N`.
- **Manual compaction.** `/compact [FOCUS-INSTRUCTIONS]` compacts on demand, for example `/compact focus on the auth module`.

Sources: [Managing context](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

The "About Copilot CLI" page and the GA changelog give a single figure instead: compaction at "95% of the token limit". The dedicated context-management page is more detailed, and the two descriptions fit together: background compaction starts at about 80%, and about 95% is where the CLI blocks. Sources: [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli), [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/).

### 2.5 How a subagent gets its own context, and what it does and does not inherit

The main agent can run built-in and custom agents "as subagents with a separate context window". Under `/fleet`, each subagent's window is also separate from the windows of the other subagents. Sources: [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents), [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet).

| What | Session (main) agent | `explore` / `task` / `code-review` subagents | `general-purpose` subagent | Custom agent run as subagent | Source |
|---|---|---|---|---|---|
| Context window | Session window | Separate | Separate | Separate | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| Repository instruction files (`copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`) | Yes | **No** | Yes | Only with `include-custom-instructions: true` (shipped v1.0.86, 2026-09-17; details → R2/R3) | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| Tools and permissions | Session settings | `explore`: read-only (includes read-only GitHub MCP). `task`: the parent's tools, minus some that don't suit subagents, "with the same permissions granted or denied". `code-review`: makes no file changes | Essentially the same capabilities as the main agent | The agent's `tools` list (default: all) | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Copilot Memory | Read and write | Read only | Read only | Read only | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Plan-mode protections | Enforced against recognized direct mutations | Inherited by helper sessions, with the same limits (see note below) | Inherited, same limits | Inherited, same limits | [CLI command reference — Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| BYOK model provider | Session provider | Inherited ("Built-in sub-agents … automatically inherit your provider configuration") | — | — | [Best practices for Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices) |
| Model, effort and context tier | Session settings | Built-in default unless overridden (§5) | Built-in default unless overridden | Inherits from the outer agent unless set (§5) | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |

> "Only the root agent can call `store_memory` or `vote_memory` to save or vote on a memory."
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

> "**Delegated sub-tasks are protected too.** If Copilot spins up a helper session to research part of your question, that helper inherits the same restrictions and can't edit your project either."
> - Source: [GitHub Copilot CLI command reference — Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

**Safety boundary: this is not a sandbox or a no-write guarantee.** The same section of the reference qualifies the protection:

- Plan mode blocks clear, direct attempts to change project files.
- It deliberately lets two things through: shell commands whose effect can't be determined in advance, and calls to connected external/MCP tools.
- Helpers therefore inherit a safety net, not complete isolation.

The v1.0.71 changelog (2026-07-16) agrees: built-in mutating tool calls are hard-blocked, while "MCP and external tools are still allowed". Detailed permission boundaries → R4. Sources: [CLI command reference — Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md).

> "**It's a safety net, not a guarantee.** This protection is designed to catch clear, direct attempts to change your files—it's not an airtight lockdown. Some things are intentionally allowed through so research isn't overly restricted: for example, shell commands whose effect can't be clearly determined in advance, and calls to external/MCP tools you've connected."
> - Source: [GitHub Copilot CLI command reference — Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

**Practical implication for presenters:** none of the conversation is visible to a subagent unless the main agent puts it in the handoff prompt. That is why the delegation blog says a handoff should state "what the user asked, what is already known, what the subagent owns, and what kind of result the main agent needs back". Source: [GitHub Blog, 2026-06-12](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/). A third-party design note written against CLI v1.0.17 says the same thing, and is included here only as corroboration: the subagent "knows nothing beyond this [prompt], repo instructions, and its agent profile". Source: [JonathanMace/copilot_cli_design note (third-party)](https://raw.githubusercontent.com/JonathanMace/copilot_cli_design/main/docs/notes/2026_04_03_subagent_spawning_and_task_tool.md).

---

## 3. Built-in Agents Catalog

All seven candidate names in the brief are confirmed as built-in agents in the current docs. In the table, "Default model" comes from the command reference's *Built-in agents* table; purposes and tool access come from the "About custom agents" page unless another source is noted. Sources: [CLI command reference — Built-in agents](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [About custom agents — Built-in agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents).

| Agent | Purpose | Tools / access | Default model (command reference) | How it gets invoked | Status (source date) |
|---|---|---|---|---|---|
| `explore` | Fast, lightweight codebase exploration that "Returns focused answers under 300 words. Safe to run in parallel." | Code intelligence, grep, glob, view and shell. "It will not change any files." Read-only access to GitHub MCP tools. | `gpt-5.4-mini` | Automatic. The docs' example: "How does authentication work in this codebase?" usually triggers Explore. | ✅ Introduced 2026-01-14; named in the CLI **GA** announcement (2026-02-25) ([changelog](https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/), [GA](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)) |
| `task` | Runs tests, builds, linters, formatters and dependency installs. Returns a brief summary on success and full output on failure. | All parent tools except "some that are not appropriate in a subagent context", with the same permissions granted or denied | `gpt-5.6-luna` (falls back to `gpt-5.4-mini`, then `claude-haiku-4.5`); see §11 on the model ID | Automatic | ✅ Introduced 2026-01-14; named in the **GA** announcement (2026-02-25) |
| `general-purpose` | "Essentially has all of the same capabilities as the main Copilot agent". Used for work that needs a separate context window or parallel execution. | Full toolset | `claude-sonnet-4.6` | Automatic | ⛔ **Lifecycle unverifiable**: documented, but no dated launch, GA or preview evidence found. **Held** out of labeled claims and demos (§7.1). |
| `code-review` | Reviews staged and unstaged changes and branch diffs for bugs, security vulnerabilities, race conditions, memory leaks and logic errors. "It never comments on style or formatting." | "It will not make any changes to files." | `claude-sonnet-4.6` | Automatic. `/review` "Run[s] the code review agent" (workflow → R5). | ✅ Introduced 2026-01-14; named ("Code Review") in the **GA** announcement (2026-02-25) |
| `research` | Staff-level research. "Searches GitHub repositories, fetches files, verifies claims, and reports detailed findings with citations." | GitHub search and exploration, web fetch/search and local tools. Saves its report with `create` and does not use `edit` or `bash` ([Researching with Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research)). | `claude-haiku-4.5`; the docs say it uses this fixed model regardless of the main-session model | **Only** via `/research TOPIC`. The main agent cannot trigger it automatically. | ⚠️ `/research` was added in v0.0.417 (2026-02-25), the release just before the GA release v0.0.418, with no "experimental" marker ([changelog diff](https://github.com/github/copilot-cli/compare/github:f8396ae...github:3b73154.patch)). There is **no feature-specific GA/preview label**, so presenting it needs the caller's decision (§7.1). |
| `rubber-duck` | Constructive critic that reviews plans, designs, implementations and tests | Read-only exploration tools. "It cannot edit files or run commands that change your environment." ([rubber duck doc](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)) | "complementary model": a different model family from the session model, chosen automatically. Configurable in `/subagents` with a "complementary model strategy" since v1.0.64 (2026-06-23). | Automatic at high-leverage moments; on request ("Rubber duck your plan."); or `/rubber-duck [PROMPT]` | ✅ Experimental 2026-04-06 → **GA 2026-06-02**; enabled for every model family in v1.0.87 (2026-09-21) |
| `security-review` | Read-only specialist that looks for exploitable vulnerabilities across 11 categories and "Only flags issues with >80% confidence of exploitability" | Read-only. "Will not modify code." | `claude-sonnet-4.6` | `/security-review [PROMPT]`. The main agent can also delegate security-focused work to it. | ✅ **Public preview** (launched as experimental, 2026-06-10). Available "to all users without --experimental" since v1.0.64 (2026-06-23). No GA announcement found; present it as **preview**. |

The v1.0.64 (2026-06-23) items in the table come from that release's entries in the [copilot-cli changelog @ v1.0.67](https://raw.githubusercontent.com/github/copilot-cli/v1.0.67/changelog.md):

- "Make `/security-review` available to all users without --experimental"
- "Configure the rubber-duck subagent in /subagents, including a complementary model strategy that picks an opposite-family model"

The `/research` entry comes from the official [changelog diff for v0.0.417–v0.0.420](https://github.com/github/copilot-cli/compare/github:f8396ae...github:3b73154.patch).

The following notes come from the same sources unless another link is given:

- **Review agents don't hand off whole reviews to each other.** `code-review` and `security-review` never forward a full review to another review agent, no matter how deep the delegation chain goes. `code-review` still passes security-focused portions to `security-review`, and both can delegate narrow fact-finding to non-review agents such as `explore`. Source: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).
- **`/security-review` is scoped to your local changes.** It runs "a focused security review of active local code changes … This command is not a full repository security audit." The launch changelog calls it a Copilot-driven scan that doesn't depend on code scanning, Dependabot or secret scanning. Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Changelog 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/).
- **Rubber duck design.** The CLI picks a critic model from a contrasting family, re-selects it if you change `/model`, and uses the rubber duck only when a suitable critic model is available. Its findings are grouped as blocking issues, non-blocking issues and suggestions. It is consulted after planning, partway through implementation, after writing tests, or when Copilot hits repeated failures; it is usually skipped for small changes. It "is invoked through Copilot’s existing task tool". Sources: [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck), [GitHub Blog, 2026-04-06](https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/).
- **Rubber duck model pairings over time.** When the feature launched as experimental, Claude sessions used GPT-5.4 as the critic. On 2026-05-07, GPT sessions gained a Claude critic and Claude sessions moved to GPT-5.5, both still behind `/experimental`. v1.0.87 (2026-09-21) enabled rubber duck "for every model family and for low-cost-tier session models". Sources: [Blog 2026-04-06](https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/), [Changelog 2026-05-07](https://github.blog/changelog/2026-05-07-rubber-duck-in-github-copilot-cli-now-supports-more-models/), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md).

> "A key design feature of the rubber duck agent is that it deliberately runs on a **different AI model from the one driving your session**."
> - Source: [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)

> "Unlike the other agents, the research agent can only be invoked by using the `/research` slash command. It cannot be automatically triggered by the main agent."
> - Source: [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)

**What happened to "Plan".** The 2026-01-14 changelog and the GA changelog (2026-02-25) both listed a **Plan** built-in agent ("Creates implementation plans by analyzing dependencies and structure"). The GA changelog also described plan mode, so the two existed side by side. The current built-in lists in the docs and the command reference no longer include a Plan agent, and no removal or deprecation notice was found. Don't describe this as a rename or migration. The documented planning path is **plan mode** (`Shift+Tab`, `/plan`, `--plan`), and v1.0.74 (2026-07-23) added `/model plan` to pick a separate model for plan mode. Sources: [Changelog 2026-01-14](https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/), [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents), [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md).

**Turning built-ins on or off.**

- `subagents.disabledSubagents` (in `~/.copilot/settings.json`) blocks dispatch of the agents you name. It works for `explore`, `task`, `code-review`, `general-purpose`, `research` and `security-review`, but not for `rubber-duck`.
- `builtInAgents.rubberDuck` (default `true`) turns the rubber duck on or off.
- `builtInAgents.rubberDuckAutoInvoke` (default `false`) opts into extra proactive prompts to call it.

Source: [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference).

---

## 4. Delegation Mechanics

### 4.1 How the main agent decides to delegate

Delegation is a model judgment, not a fixed rule. The main model sees the available agents as callable tools; each agent's `description` appears in the agent list and in the `task` tool. Subagents start when the model calls the `task` tool. Sources: [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents), [Comparing CLI features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

> "The AI model being used by the CLI can choose to delegate a task to a subsidiary subagent process, that operates using a custom agent with specific expertise, if it judges that this would result in the work being completed more effectively. The model may equally choose to handle the work directly in the main agent."
> - Source: [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents)

- **Eligibility.** A custom agent is eligible for automatic delegation unless its frontmatter sets `infer: false` (default `true`; frontmatter → R2). The Copilot SDK describes the same steps: intent matching against `name` and `description`, then agent selection, isolated execution, lifecycle events, and finally result integration. Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [SDK: Custom agents and sub-agent orchestration](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents).
- **Typical delegation targets** are codebase exploration, running commands, reviewing changes, complex multi-step work, and custom agents. Source: [Comparing CLI features — When are subagents used?](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features).
- **Selective delegation (v1.0.42+).** GitHub's "smarter subagent delegation" change rolled out to 100% of production traffic. In an A/B test it cut tool failures per session by 23% and lowered P95 user wait time by 5%, with no quality regression. These numbers are vendor-reported. A later entry, v1.0.77 (2026-07-30), reads "Improve subagent delegation for small tasks and parallel work". Sources: [GitHub Blog, 2026-06-12](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md).

> "Copilot CLI should handle focused work directly: find a file, read it, make a targeted change, and verify it. Delegation is more useful when the work requires independent context, broad exploration, or parallel execution."
> - Source: [How we made GitHub Copilot CLI more selective about delegation (2026-06-12)](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/)

**Demo implication:** a small, well-scoped prompt may never produce a subagent. To show delegation reliably, use a broad or parallel task, or name the agent explicitly (§4.2).

### 4.2 Ways you can trigger or steer delegation

| Method | Example | Notes | Source |
|---|---|---|---|
| Let the model decide | `How does authentication work in this codebase?` | The docs say this "will typically trigger the Explore agent" | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| Name the agent in a prompt | `Use the refactoring agent to refactor this code block` | "Copilot will automatically infer the agent you want to use." | [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents) |
| `@AGENT` mention (documented for `/fleet` prompts) | `... Use @test-writer to create comprehensive unit tests for ...` | Points a subtask at a specific custom agent | [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet) |
| Slash commands bound to built-ins | `/research TOPIC`, `/rubber-duck [PROMPT]`, `/security-review [PROMPT]`, `/review [PROMPT]` | `/research` is the only way to run `research` | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Choose the *session* agent rather than a subagent | `/agent`, `copilot --agent=refactor-agent --prompt "Refactor this code block"` | Makes the custom agent the main agent → R2 | [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents) |
| Parallel orchestration | `/fleet [PROMPT]`, `--fleet` | → R5 | [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet) |

### 4.3 Sync vs background execution

**Official evidence.** The docs name the tool that checks background agents and describe sync tasks that can be promoted to the background:

- The command reference lists the delegation tools: `task` ("Run subagents"), `read_agent` ("Check background agent status"), `write_agent` ("Send a message to a running agent") and `list_agents` ("List available agents").
- In the `/tasks` dialog, an unmodified lowercase **`b`** will "Promote the selected sync task to background". The reference shows the keycap as `B`; v1.0.85 limits the shortcut to the unmodified lowercase key (§6.1). From the main prompt, **Ctrl+X** then lowercase **b** promotes the running task or shell command to the background.
- Pressing **Esc** twice stops background agents when the main agent is idle.

Source: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

- **Programmatic runs.** `-p` (and `-p --autopilot`) waits up to `COPILOT_TASK_WAIT_TIMEOUT_SECONDS` (default `600`; `0` exits immediately) for pending background agents or shell commands before exiting. Source: [CLI command reference — Environment variables](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).
- **Notifications.** The v1.0.70 entry (2026-07-09) reads "Avoid redundant background agent notifications after a blocking read_agent returns its result". This implies that the parent is notified when a background agent completes and that `read_agent` can block. Pressing Esc twice to stop background agents when the main agent is idle arrived in v1.0.69 (2026-07-07). Source: [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md).

**Third-party corroboration (not official).** A community design note written against CLI v1.0.17 describes a `mode` parameter on the `task` tool with the values `"sync"` and `"background"`. The same note says the default mode is undocumented. Source: [JonathanMace/copilot_cli_design (third-party)](https://raw.githubusercontent.com/JonathanMace/copilot_cli_design/main/docs/notes/2026_04_03_subagent_spawning_and_task_tool.md).

> "**`background`** — Agent runs independently. Parent continues working and receives a notification when the agent completes. Results are retrieved via `read_agent`."
> - Source: [Subagent Spawning and the Task Tool (third-party community note, CLI 1.0.17)](https://raw.githubusercontent.com/JonathanMace/copilot_cli_design/main/docs/notes/2026_04_03_subagent_spawning_and_task_tool.md)

**Guidance from GitHub.** Treat delegation as an opportunity for parallel work: when a subagent is running, the main agent should keep making progress instead of waiting. Source: [GitHub Blog, 2026-06-12](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/).

### 4.4 Multi-turn (idle) agents, follow-up messages and reading results

> "Multi-turn subagents are always enabled, so you can send follow-up messages to running agents"
> - Source: [copilot-cli changelog, v1.0.72 (2026-07-20)](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md)

- **Follow-ups from the main agent** use `write_agent`, which "Send[s] a message to a running agent". **Follow-ups from you** happen in `/tasks`: teleport into a subagent and type in the prompt box to steer it the same way you would the main session. Source: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).
- **Reading results.** v1.0.81 (2026-08-27): "Repeated read_agent calls now consistently return the full turn history unless since_turn is provided". v1.0.74 (2026-07-23): multi-turn subagent timelines show every prompt and response in order after you reopen `/tasks`, and they identify whether a prompt came from the main agent or from another subagent. Sources: [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md), [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md).
- **Pre-release behavior, not yet in a stable release as of 2026-10-05.** In v1.0.92-1, "Messaging a running background agent now steers its active turn at the next processing opportunity." Source: [github/copilot-cli Releases](https://github.com/github/copilot-cli/releases).
- **Official changelog evidence of idle agents.** v1.0.66 (2026-06-30) includes "Keep idle agents available after you cancel a turn" and "read_agent since_turn: 0 now correctly returns all turns including turn 0". The exact `task`-tool schema and how long an idle agent persists are still not documented as a supported API contract. Source: [copilot-cli changelog @ v1.0.67](https://raw.githubusercontent.com/github/copilot-cli/v1.0.67/changelog.md).
- **Third-party corroboration of the lifecycle:** launch → response → idle → `write_agent` → response → … → completed. Idle agents keep their full conversation context. This is community evidence written against v1.0.17, not an official contract. Source: [JonathanMace/copilot_cli_design (third-party)](https://raw.githubusercontent.com/JonathanMace/copilot_cli_design/main/docs/notes/2026_04_03_subagent_spawning_and_task_tool.md).

### 4.5 Agent-to-agent communication

Custom agents can call `list_agents` and `write_agent` to coordinate with each other:

- **Relation labels.** `list_agents` marks each visible agent as `"self"`, `"sibling"` or `"child"`.
- **Scopes.** `list_agents` accepts `"siblings"`, `"children"` or `"all"`. `write_agent` accepts `scope` values of `"siblings"` and `"children"`, or an explicit `agent_id`.
- **Restrictions.** Scoped messaging works only from a subagent running inside a parent session "with shared sibling communication enabled". If a scope matches too many agents, `write_agent` returns an error.

Source: [CLI command reference — Agent communication](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

```text
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference (Agent communication)
# Tool-call shapes the model emits inside a multi-agent session (not commands you type)
list_agents(scope="siblings")
list_agents(scope="children")
write_agent(scope="children", message="Re-check your findings against the updated schema.")
write_agent(agent_id="explore-auth", message="Focus on token refresh flow and report only confirmed issues.")
```
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: verbatim (excerpt)

### 4.6 Sidekick agents (documented; no status label)

The command reference documents **sidekick agents**: any agent definition with a `sidekick:` block. A sidekick runs automatically in the background in response to session events (`user.message`, `session.context_changed`) and publishes context into the session inbox. Its `behavior` is either `"restart"` or `"persistent"`, and `maxSendsPerTurn` limits how often it posts. No GA, preview or experimental label and no announcement were found, so treat the feature as unverified for a live demo (definition format → R2). Source: [CLI command reference — Sidekick agents](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

---

## 5. Model, Reasoning-Effort and Context-Tier Selection for Subagents

### 5.1 Model and reasoning effort: documented precedence (✅ verified in the reference)

> "Model and effort are resolved with this precedence, highest first: an explicit per-call value, the `subagents` override in `~/.copilot/settings.json`, the agent definition's `model`/`models`/`reasoningEffort` field, then the parent session's value."
> - Source: [GitHub Copilot CLI command reference — Custom agent frontmatter fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

This chain applies to **model and reasoning effort only**. Context tier is covered separately in §5.2, because no source documents the same chain for it.

| Priority | Layer | Model / effort fields at this layer | How you set it | Source |
|---|---|---|---|---|
| 1 (highest) | Per-call value | Model and effort chosen for that launch | The main agent passes them when it launches the subagent. You can request them in a prompt, for example "`... Use GPT-5.3-Codex, to create ... Use Claude Opus 5, to analyze ...`". Since v1.0.85 (2026-09-16), "Subagent launches honor explicit model, reasoning effort, and context tier preferences from applicable global and custom instructions". | [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| 2 | `subagents` override (user preference) | `subagents.agents.<name>.model`, `.effortLevel` (either can be `"inherit"`) and `.modelPolicy` (`"preferred"` or `"required"` only, **not** `"inherit"`) | The `/subagents` picker (alias `/agents`) or `~/.copilot/settings.json` | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| 3 | Agent definition | Frontmatter `model`, `models` (a priority list), `modelPolicy`, `reasoningEffort` (→ R2) | The agent file | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| 4 (lowest) | Parent session | The session model and effort | `/model`, `--model`, `--effort`/`--reasoning-effort`, `COPILOT_MODEL`, or the `model`/`effortLevel` settings | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |

**Documented fallback and lock rules (custom-agent fields):**

- **Unhonorable values fall back.** A declared model or effort that can't be honored falls back to the session's value, so the dispatch still succeeds.
- **`modelPolicy: "required"` refuses instead.** Dispatch is refused rather than silently substituting a model you didn't author. When the agent definition itself sets `"required"`, a `subagents` override can't unlock it.

Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference).

**The Auto rule, scoped to what the reference actually says.** The command reference states the Auto rule *in the description of the custom-agent `model` frontmatter field*:

> "When unset, inherits the outer agent's model. When the session model is set to `Auto` (server-selected), subagents always inherit the resolved session model regardless of this field."
> - Source: [GitHub Copilot CLI command reference (`model` field)](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

What can and cannot be said about Auto:

- **Safe claim:** with an Auto session, a **custom agent's `model` field** does not determine its model; the resolved session model is used instead.
- **Not established by any source read** (⚠️ unverified):
  - whether Auto also overrides a `subagents.agents.<name>.model` preference;
  - whether Auto overrides a per-call model request;
  - whether Auto changes the built-in defaults in §3;
  - how Auto interacts with `models` lists or `modelPolicy: "required"`. For example, whether a required agent is refused or dispatched under Auto is not documented.
- **Specialist exceptions stay separate (§5.4).** `research` uses a fixed model "regardless of what model you've selected for your main session", and `rubber-duck` deliberately uses a **complementary** model family.
- **Don't generalize.** Avoid "Auto always wins", or "Auto overrides any per-agent model", in slides.

**Reasoning-effort inheritance (CLI vs SDK wording).** The CLI reference says an unset `reasoningEffort` "inherits the outer agent's effort". The Copilot SDK docs give a narrower runtime rule: an unset effort is inherited only when the subagent runs the *same* model as the parent. The SDK rule is SDK documentation and has not been confirmed in the CLI (⚠️). Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [SDK: Custom agents and sub-agent orchestration](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents).

> "When the subagent resolves to a different model, it falls back to that model's default instead of inheriting the parent's effort."
> - Source: [Custom agents and sub-agent orchestration (Copilot SDK)](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)

### 5.2 User preferences: `/subagents` and the `subagents.*` settings

The `/subagents` command (alias `/agents`) will "Configure default and per-agent subagent models". For an agent with `modelPolicy: "required"`, the picker shows a locked **Model** entry together with a **Model enforcement** row. Source: [CLI command reference — Slash commands](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

| Setting (`~/.copilot/settings.json`) | Type / default | Meaning | Source |
|---|---|---|---|
| `subagents.agents` | object, `{}` | Per-agent configuration keyed by agent name. Optional fields: `model`, `modelPolicy` (`"preferred"`\|`"required"`), `effortLevel`, `contextTier` (`"default"`\|`"long_context"`\|`"inherit"`). | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| `subagents.disabledSubagents` | string[], `[]` | Agent names that may not be dispatched. `rubber-duck` cannot be disabled this way. | same |
| `subagents.maxConcurrency` | number, plan-based | Honored only for usage-based billing users; capped at `32` | same |
| `subagents.maxDepth` | number, `6` (docs; see §6.3 for the conflicting evidence) | Honored only for usage-based billing users | same |
| `effortLevel` (session default) | string, `"medium"` | `"low"`, `"medium"`, `"high"` or `"xhigh"` | same |
| `builtInAgents.rubberDuck` / `builtInAgents.rubberDuckAutoInvoke` | boolean, `true` / `false` | Turn the rubber duck on or off, and opt into extra auto-invoke nudges | same |

> "Set `model`, `effortLevel`, or `contextTier` to `"inherit"` to use the parent session's value at dispatch time."
> - Source: [GitHub Copilot CLI configuration directory (`subagents.agents`)](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)

`"inherit"` is valid only for these three fields. `modelPolicy` accepts only `"preferred"` or `"required"`. Source: [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference).

**Context tier: documented controls, ordering ⚠️ unverified.** The sources document these context-tier controls:

| Control | Scope | Source |
|---|---|---|
| `--context TIER` (`default`, `long_context`) | Session; "overrides the persisted setting and is honored in fresh interactive sessions" | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `/model` (`Tab` toggles a model's Context column; `--session`/`--repo`/`--global` scopes) | Session, repository or global default | same |
| `contextTier` in `.github/copilot/settings.json` | Repository default; applies only when the folder is trusted | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| `subagents.agents.<name>.contextTier` (`"default"`, `"long_context"` or `"inherit"`) | Per-subagent preference | same |
| Explicit preferences in global or custom instructions | Honored at subagent launch since v1.0.85 (2026-09-16) | [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |

Two points are not documented:

- No **agent-definition (frontmatter) context-tier field** is listed among the custom-agent frontmatter fields.
- No source gives a **precedence order** for context tier across these layers. The model/effort chain in §5.1 should not be assumed to apply.

Present context tier as "configurable per subagent, inheritable from the session", without a ranked order.

Changelog history for the picker and settings:

- v1.0.64 (2026-06-23): "Configure the rubber-duck subagent in /subagents, including a complementary model strategy that picks an opposite-family model". This is the earliest dated stable-changelog mention of `/subagents` found.
- v1.0.71 (2026-07-16): "Reopening the /subagents model picker keeps each agent's reasoning effort and context tier" and "Limit which built-in agents are available to tasks and subagents".
- v1.0.81 (2026-08-27): the experimental `/plugins` dashboard was removed, and agent configuration now lives in `/subagents`.

Sources: [copilot-cli changelog @ v1.0.67](https://raw.githubusercontent.com/github/copilot-cli/v1.0.67/changelog.md), [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md).

`/subagents` has no feature-specific GA/preview label; §7.1 gives the presentation decision.

```jsonc
// Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference (subagents.* keys)
// Illustrative ~/.copilot/settings.json fragment. Remove these comment lines before saving if your editor or parser rejects JSONC.
// Prefer the /subagents picker, which writes these keys for you.
{
  "subagents": {
    "agents": {
      "explore": { "model": "claude-haiku-4.5" },
      "code-review": { "model": "inherit", "effortLevel": "high", "contextTier": "inherit" }
    },
    "disabledSubagents": ["security-review"]
  }
}
```
> - Source: [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) | Provenance: synthesized (keys and value enums are documented; this combination was not run). An effort level the resolved model does not support is reported and left unapplied (v1.0.88 changelog wording for custom agents).

### 5.3 Session-level controls that subagents inherit

```bash
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference (Command-line options)
# Session defaults. Subagents with no higher-priority model/effort value inherit them (see §5.1).
copilot --model=gpt-5.4 --effort=high          # --effort is an alias of --reasoning-effort: low|medium|high|xhigh|max
copilot --model=auto                           # Auto: a custom agent's `model` field is overridden by the resolved session model (§5.1 scope)
copilot --context long_context                 # session context tier for tiered-pricing models: default|long_context
```
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: adapted (flag names and values are verbatim; the combinations are illustrative)

```text
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference (/model, /subagents)
# Interactive slash commands (lines starting with # are annotations; don't type them)
/model --session claude-opus-5.5
/model auto intelligence
/model plan gpt-5.4
/subagents
```
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [copilot-cli changelog @ v1.0.75 (`/model plan`)](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md) | Provenance: adapted

What these controls do:

- **`/model` scopes.** `/model` is session-scoped by default; this changed in v1.0.79, 2026-08-10. `--repo`/`--local` pin a repository default, and `--global` (or `/config model`) sets the default for future sessions. A trusted repository can pin `model`, `effortLevel` and `contextTier` in `.github/copilot/settings.json`.
- **Extended context.** The "latest models" support a 1-million-token context window and configurable reasoning levels. Both raise AI-credit consumption, and the docs recommend using them only for complex tasks.

Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md), [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli).

### 5.4 Special cases (specialist rules are separate from the general chain)

- **`research` uses a fixed model.** It is "hard-coded to use a particular AI model" (`claude-haiku-4.5` per the reference table). That model "is not configurable via the `/model` command", and the agent "always uses the defined model regardless of what model you've selected for your main session". The docs don't address Auto specifically, and whether a `subagents.agents.research` override takes effect was not verified (⚠️). Sources: [Researching with GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).
- **`rubber-duck` uses a complementary model.** It deliberately runs on a different model family from the session model, re-selects the critic when you change `/model`, and runs only when a suitable critic is available. Since v1.0.64 (2026-06-23), `/subagents` offers "a complementary model strategy that picks an opposite-family model" for it. How the critic is picked under an Auto session is not documented (⚠️). Sources: [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck), [copilot-cli changelog @ v1.0.67](https://raw.githubusercontent.com/github/copilot-cli/v1.0.67/changelog.md).
- **`/fleet` defaults.** The `/fleet` page says "By default, subagents use a low-cost AI model", and a custom agent profile's `model` takes priority. That statement is broader than the built-in table, which defaults `general-purpose`, `code-review` and `security-review` to `claude-sonnet-4.6` (see §11). Source: [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet).
- **BYOK.** When you use your own model provider, the built-in sub-agents inherit that provider configuration, and cost estimates are hidden. Source: [Best practices for Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices).
- **Auto model selection** has been **GA** in the CLI since 2026-04-17. Tiers are `efficiency`, `balance` and `intelligence`, and paid plans get a 10% discount on model cost when using Auto (pricing details → R8). For subagent effects, see the scoped rule in §5.1. Sources: [Changelog 2026-04-17](https://github.blog/changelog/2026-04-17-github-copilot-cli-now-supports-copilot-auto-model-selection/), [About Copilot auto model selection](https://docs.github.com/en/copilot/concepts/models/auto-model-selection).

---

## 6. Inspecting and Managing Running Agents

### 6.1 The `/tasks` dialog

`/tasks` will "View and manage tasks (subagents and shell commands)". Inside the dialog, type the letter keys as **unmodified lowercase letters**: no Shift, Ctrl or Alt.

| Key to type | Action | Command-reference keycap |
|---|---|---|
| `↑` or `k`, `↓` or `j` | Move the selection | `↑`/`K`, `↓`/`J` |
| `Enter` | View task details, or **teleport** into the selected subagent's own session view | `Enter` |
| `a` | Toggle between all nested subagent levels and this level only | `a` |
| `f` | Toggle showing finished subagents and shells | `f` |
| `x` | Kill the selected active task | `X` |
| `r` | Remove the selected finished task | `R` |
| `b` | Promote the selected sync task to the background | `B` |
| `Esc` | Close the dialog, or go back to the list | `Esc` |

**Why the keys differ from the docs.** The command reference prints uppercase keycaps (`K`, `J`, `X`, `R`, `B`). The newer stable v1.0.85 changelog (2026-09-16) says modified chords and capital letters no longer trigger these shortcuts: "Modified chords such as Ctrl+X, Alt+X or capital X no longer trigger the /tasks letter shortcuts; only unmodified a, f, x, r, b, j and k respond." The current stable release is 1.0.91, so this report follows the changelog and treats the uppercase keycaps as labels. This reconciles two sources; it was not tested hands-on. Sources: [CLI command reference — Tasks dialog shortcuts](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md).

> "Subagents that spawn their own nested subagents appear as an indented tree; the row you're teleported into is highlighted as "current." While drilled into a subagent's view, you can send it a steering message from the prompt box the same way you would the main session."
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

Related changelog entries:

- v1.0.79 (2026-08-10): "Improve teleported subagent /tasks navigation with nested tree browsing, current/all and finished-task filters, and a live timeline you can steer".
- v1.0.87 (2026-09-21): the timeline shows live elapsed time for execution subagents.

Source: [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md).

### 6.2 Other controls

| Control | Effect | Source |
|---|---|---|
| `Esc` twice | Interrupts the running turn, or stops background agents when the main agent is idle | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `Ctrl+X` then lowercase `b` (from the main prompt, not inside `/tasks`) | Promotes the running task or shell command to the background | same |
| `Ctrl+X` then `o` / `Ctrl+O` / `Ctrl+E` | Opens the latest timeline link / expands recent timeline items / expands all items | same |
| Sessions sidebar | Purple pulsing dot = a turn is in flight; yellow `!` = waiting for permission; yellow `?` = waiting for an answer. These indicators are for *sessions*, not subagents. | same |
| `/env` | Shows what is loaded, including agents | same |

### 6.3 Limits on nesting and concurrency (sources conflict)

| Evidence | Max depth | Max concurrent | Source |
|---|---|---|---|
| Command reference, "Subagent limits" section | default `6`, max `256` | plan-based default, max `32`. Free/Education `2`, Pro/Pro+ `4`, Max `8`, Business `16`, Enterprise `32`, usage-based billing `32` | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Configuration directory (`subagents.maxDepth` / `maxConcurrency`) | default `6`, capped at `256` | plan-based, capped at `32`. Overrides are honored only for usage-based billing | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| Command reference, environment variables | `COPILOT_SUBAGENT_MAX_DEPTH`: default `4`, range `1`–`128` | `COPILOT_SUBAGENT_MAX_CONCURRENT`: default `32`, range `1`–`256` | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Changelog v1.0.71 (2026-07-16) | "Lower the default maximum sub-agent nesting depth from 6 to 4 … Usage-based billing users can still adjust `subagents.maxDepth` (up to 128)." | — | [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md) |

> "**Depth** counts how many agents are nested within one another. When the depth limit is reached, the innermost agent cannot spawn further subagents. **Concurrency** counts how many subagents are running simultaneously across the entire session tree."
> - Source: [GitHub Copilot CLI command reference — Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

**Assessment.** For concurrency, the plan-based table is the most specific official statement; quote it with the conflict noted. For depth, the most recent dated evidence (v1.0.71) supports a default of `4`. The "6/256" figures in two docs sections may be stale or may reflect a later change that the changelog does not record. Verify on the demo machine, and avoid presenting a single depth number as definitive.

### 6.4 Observability and cost signals

- **`/usage`** shows per-model token totals and, for token-based-billing accounts, per-model AI-credit consumption. **`/context`** shows the main window only. v1.0.81 (2026-08-27) added "per-agent usage metrics to --usage-output-file JSON output". Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md).
- **OpenTelemetry.** Subagent invocations (for example `explore` and `task`) produce their own `invoke_agent` spans. The metrics `gen_ai.invoke_agent.inference_calls` and `gen_ai.invoke_agent.tool_calls` can be broken down by `gen_ai.agent.name`. Read `github.copilot.nano_aiu` from the root span only, to avoid double counting. Source: [CLI command reference — OpenTelemetry monitoring](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).
- **Hooks.** A `subagentStop` hook runs "When a subagent completes", which lets you validate output before it returns to the parent (→ R4). Source: [Comparing CLI features — Hooks](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features).

```bash
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference (OpenTelemetry monitoring)
# bash/zsh: write all OTel signals (including per-subagent invoke_agent spans) to a local JSON-lines file
export COPILOT_OTEL_FILE_EXPORTER_PATH="$PWD/copilot-otel.jsonl"   # setting this auto-enables OTel
copilot
```
```powershell
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference (OpenTelemetry monitoring)
# PowerShell equivalent
$env:COPILOT_OTEL_FILE_EXPORTER_PATH = "$PWD\copilot-otel.jsonl"
copilot
```
> - Source: [GitHub Copilot CLI command reference — OTel environment variables](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: adapted. By default only metadata is captured. Prompt and response content is captured only when `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true`, which the docs say may expose sensitive data.

---

## 7. Terminology, Naming Changes and GA/Preview Status

### 7.1 Status table and presentation-use decisions (label as stated by the source, with the source date)

**Legend for the "Presentation decision" column:**

- ✅ **Present with label.** An explicit GA or preview label exists, with a date.
- ⚠️ **Caller decision.** Dated *stable-release* evidence exists, but there is no feature-specific GA/preview label. By default, keep these out of GA/preview-labeled claims. If the caller accepts an exception to the brief, use the suggested wording, which does **not** say "GA".
- ⛔ **Hold or omit.** There is no dated primary lifecycle evidence, or the feature exists only in a pre-release. Keep it out of labeled claims and demos.

A feature being documented, or shipping inside the GA CLI, does **not** establish that the feature is individually GA.

| Feature | Lifecycle evidence (source date / version) | Presentation decision | Source |
|---|---|---|---|
| GitHub Copilot CLI | **GA** for all Copilot subscribers, 2026-02-25 (public preview began September 2025) | ✅ "GA (2026-02-25)" | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| Built-in `explore`, `task`, `code-review` (and automatic, parallel delegation to them) | Introduced 2026-01-14. Named ("Explore", "Task", "Code Review"; "Multiple agents can run in parallel") in the **GA** announcement, 2026-02-25 | ✅ "GA (2026-02-25)" | [Changelog 2026-01-14](https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/), [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| Plan mode / `/review` | Named in the **GA** announcement, 2026-02-25 | ✅ "GA (2026-02-25)" | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| Auto-compaction / `/compact` / `/context` | Auto-compaction is named in the **GA** announcement (2026-02-25). `/compact` and `/context` were announced in the 2026-01-14 changelog but aren't named in the GA post. | ✅ auto-compaction "GA (2026-02-25)". ⚠️ `/compact`, `/context`: "Available since 2026-01-14; no separate GA/preview label" | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), [Changelog 2026-01-14](https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/) |
| `rubber-duck` agent / `/rubber-duck` | Experimental 2026-04-06 → **GA 2026-06-02**; all model families v1.0.87 (2026-09-21) | ✅ "GA (2026-06-02)" | [Blog 2026-04-06](https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/), [Changelog 2026-06-02](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `security-review` agent / `/security-review` | **Experimental public preview**, 2026-06-10. Available "to all users without --experimental" from v1.0.64 (2026-06-23). No GA announcement found. | ✅ "Public preview (2026-06-10)" | [Changelog 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/), [copilot-cli changelog @ v1.0.67](https://raw.githubusercontent.com/github/copilot-cli/v1.0.67/changelog.md) |
| Auto model selection in the CLI | **GA**, 2026-04-17 | ✅ "GA (2026-04-17)" | [Changelog 2026-04-17](https://github.blog/changelog/2026-04-17-github-copilot-cli-now-supports-copilot-auto-model-selection/) |
| Dynamic workflows (→ R5) | **Public preview**, 2026-10-01; needs `--experimental` or `/experimental on` in the CLI | ✅ "Public preview (2026-10-01)", owned by R5 | [Changelog 2026-10-01](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/) |
| Custom agents in the CLI ("made available as tools"; new agentic loop) | Shipped during the CLI public preview, 2025-10-28. Named ("Custom agents") in the **GA** announcement, 2026-02-25. | ✅ "GA (2026-02-25)" (format details → R2) | [Changelog 2025-10-28](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/), [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| `research` agent / `/research` | "Add /research command for deep research with exportable reports" in **v0.0.417 (2026-02-25)**, the release just before the GA release v0.0.418. Not marked experimental, unlike `/chronicle` in v0.0.419. No feature-specific GA/preview label. | ⚠️ "Available since v0.0.417 (2026-02-25), not experimental-gated; no separate GA/preview label" | [changelog diff v0.0.417–v0.0.420](https://github.com/github/copilot-cli/compare/github:f8396ae...github:3b73154.patch) |
| `/subagents` picker and `subagents.*` settings | Earliest dated stable mention found: v1.0.64 (2026-06-23); also v1.0.71 (2026-07-16) and v1.0.81 (2026-08-27). The command reference has no "experimental mode" note. No GA/preview label. | ⚠️ "Available in stable CLI since at least v1.0.64 (2026-06-23); no separate GA/preview label" | [copilot-cli changelog @ v1.0.67](https://raw.githubusercontent.com/github/copilot-cli/v1.0.67/changelog.md), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `/tasks` dialog (inspect, teleport, steer, kill, promote) | Stable-changelog entries v1.0.74 (2026-07-23), v1.0.79 (2026-08-10) and v1.0.85 (2026-09-16). No GA/preview label. | ⚠️ "Available in stable CLI (v1.0.79 navigation, 2026-08-10); no separate GA/preview label" | [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md), [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md) |
| Multi-turn subagents / follow-up messages | "always enabled" in v1.0.72 (2026-07-20). No GA/preview label. | ⚠️ "Always enabled since v1.0.72 (2026-07-20); no separate GA/preview label" | [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md) |
| Smarter subagent delegation (a behavior, not a feature toggle) | Rolled out to 100% of production traffic (v1.0.42+); blog dated 2026-06-12 | ⚠️ Describe as a "harness behavior change (2026-06-12)", not as a labeled feature | [GitHub Blog](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/) |
| Subagent preferences read from custom instructions; `include-custom-instructions` (→ R2/R3) | Shipped in v1.0.85 (2026-09-16) and v1.0.86 (2026-09-17). No GA/preview label. | ⚠️ "Shipped vX (date); no separate label" | [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `general-purpose` agent | Documented. **No dated launch, GA or preview evidence found** in the official blog, changelog or docs searched. | ⛔ **Hold**: list it in the catalog as "documented; lifecycle unverifiable", and keep it out of labeled claims and demos | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| Sidekick agents | Documented in the command reference. **No dated announcement or status label found.** | ⛔ **Hold/omit.** At most an optional unlabeled mention, if the caller approves | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Steering a running background agent mid-turn | **Pre-release only** (1.0.92-1), about 2026-10-02 (the Releases page showed "2 days ago" when crawled on 2026-10-04) | ⛔ **Hold**: not in a stable release | [github/copilot-cli Releases](https://github.com/github/copilot-cli/releases) |

Experimental features are turned on with `copilot --experimental` or `/experimental`, and the setting persists in your config. Source: [github/copilot-cli README](https://raw.githubusercontent.com/github/copilot-cli/main/README.md).

### 7.2 Naming changes and easily confused terms

| Term(s) | What to say on a slide | Source |
|---|---|---|
| **"Plan" built-in agent no longer listed** | Say "Plan is no longer listed; use the documented plan mode (`Shift+Tab`, `/plan`, `--plan`; `/model plan` for a plan-mode model)". Add "no removal notice found", and don't describe it as a rename or deprecation. | §3 sources |
| **"Copilot coding agent" → "Copilot cloud agent"** | 2025–early 2026 changelogs say "coding agent"; current docs say "Copilot cloud agent" (for example, in the `/delegate` guidance) → R5/R6 | [Changelog 2025-10-28](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/), [Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices) |
| **"premium requests" → "AI credits"** | The README still says premium requests; current docs and pages bill in AI credits → R8 | [README](https://raw.githubusercontent.com/github/copilot-cli/main/README.md), [About Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| **`/agent` vs `/agents`** | `/agent` selects the *session* agent. `/agents` is an alias of `/subagents`, which configures *subagent models*. | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| **"task", three meanings** | (1) the built-in `task` agent, (2) the `task` *tool* that launches every subagent, (3) the entries in `/tasks` (subagents *and* shell commands) | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Comparing CLI features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features) |
| **"background", three meanings** | (1) local background *subagents* (`read_agent`), (2) "background delegation" with the `&` prefix, which sends work to the cloud agent (→ R5), (3) background *sessions* in the sessions sidebar | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| **"subagent" vs "sub-agent"** | Same concept. The CLI concept docs use "subagent"; the SDK docs, best-practices page and some changelog entries use "sub-agent". | [Comparing CLI features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features), [SDK docs](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents) |
| **"built-in agents" = "built-in custom agents"** | The docs call the shipped agents both "built-in agents" and "a set of pre-built custom agents" | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| **`/plugins` (experimental) removed** | Agent management moved to `/subagents`, and instructions to `/instructions` (v1.0.81) | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| **`/fleet` vs dynamic workflows** | With `/fleet`, Copilot decomposes and coordinates the work. A dynamic workflow is "a process defined in code" (→ R5). | [Changelog 2026-10-01](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/) |

---

## 8. Practical Guidance: Demo-able Scenarios

### 8.0 Recommended presenter extraction (R1 minimum)

The three scenarios below are **alternatives and building blocks**, not an R1 time allocation. For the foundations segment of the 60-minute session, a minimal label-safe subset is:

1. The main agent vs. subagent distinction (§2.1–§2.2).
2. The built-in catalog, showing only the ✅ rows plus `research` if the caller accepts its ⚠️ wording (§3, §7.1).
3. Selective delegation, as one sentence (§4.1).
4. Model preferences: the verified model/effort chain, the scoped Auto rule, and the specialist exceptions (§5.1, §5.4).
5. **One demo: Demo C's core path**, which uses only ✅-labeled features.

Demos A and B are optional. Their inspection steps (`/tasks`, `/context`, multi-turn follow-ups) are ⚠️ caller-decision items in §7.1.

### 8.1 Before presenting

All demos rely on model judgment, so each one includes a fallback. Before presenting:

- Run `/model` to confirm the model IDs on the demo account (see §11).
- If you plan to show per-agent model preferences, pick a **specific** session model rather than Auto. The documented Auto rule overrides a custom agent's `model` field, and Auto's effect on other overrides is unverified (§5.1).
- Consider setting `streamerMode`, which hides preview model names, quota details and timestamps, and is documented as "Useful when demonstrating Copilot CLI or screen sharing".
- In `/tasks`, type the **lowercase letter keys without Shift or other modifiers** (§6.1).

Source: [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference).

Lifecycle tags used in the demo blocks: [✅ GA/preview, dated], [⚠️ caller decision], as defined in §7.1. No ⛔ feature appears in any demo.

### Demo C (recommended core) — Specialist reviewers and cross-model critique (≈8 min)

**What it shows:** plan → second-opinion critique from a *different model family* → implement → high-signal review → security review, all through built-in specialist subagents.

**Relies on:**

- Plan mode and `/review` (✅ GA 2026-02-25) ([GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)).
- Rubber duck (✅ GA 2026-06-02) ([About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck), [Changelog 2026-06-02](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/)).
- `/security-review` (✅ public preview 2026-06-10; no `--experimental` needed since v1.0.64) ([Changelog 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/), [copilot-cli changelog @ v1.0.67](https://raw.githubusercontent.com/github/copilot-cli/v1.0.67/changelog.md)).
- Command syntax from the [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

```text
# Source: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck ; https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices ; .../cli-command-reference
# Lines starting with # are presenter annotations; don't type them.
# [✅ GA 2026-02-25] plan mode
/plan Add rate limiting to the login endpoint
# [✅ GA 2026-06-02] rubber duck: natural-language request, then the slash command
Rubber duck your plan.
/rubber-duck What edge cases are missing?
Proceed with the plan
# [✅ GA 2026-02-25] code review agent
/review
# [✅ Public preview 2026-06-10] security-review agent
/security-review Review my current local changes for security issues. Prioritize high-severity findings and suggest remediations I can apply before opening a pull request.
# OPTIONAL [⚠️ caller decision: /subagents]: show per-agent model preferences (use a specific session model, not Auto)
/subagents
```
> - Source: [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck), [Best practices for Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: adapted. The `/rubber-duck` and `/security-review` prompt texts are verbatim from the docs; the sequence and tags are synthesized.

**Talking points and risks:**

- **Cost.** Rubber duck adds latency and extra model usage.
- **Availability.** It runs only if a suitable critic model is available. A pre-release fix notes that `/subagents` could previously show it as configured when the session couldn't run it ([Releases](https://github.com/github/copilot-cli/releases)).
- **Missing `/security-review`.** If the command doesn't appear, check the CLI version: v1.0.64+ shouldn't need `/experimental on`.
- **Scope.** `/review` workflow details belong to R5.

### Demo A (optional; ⚠️ inspection steps) — Context isolation with `explore` (≈5 min)

**What it shows:** a subagent does the reading in its own context window and hands back a short answer.

**Relies on:**

- `explore` behavior and the example prompt (✅ GA 2026-02-25) ([About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)).
- The "<300 words" return ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- `/tasks` teleport and `/context` (⚠️) ([Managing context](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management)).

```text
# Source: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents ; .../cli-command-reference ; .../context-management
# Lines starting with # are presenter annotations; don't type them.
# [⚠️ caller decision: /context]
/context
# [✅ GA 2026-02-25] explore delegation (model-judged)
How does authentication work in this codebase?
# [⚠️ caller decision: /tasks] while it runs: select the explore row with lowercase j/k (no Shift),
# press Enter to teleport into it, Esc to return
/tasks
/context
# fallback if the main agent answered directly (delegation is selective since v1.0.42):
Use the explore agent to map how authentication works in this codebase and report the key files.
```
> - Source: [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Managing context](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management), [copilot-cli changelog (v1.0.85 lowercase keys)](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) | Provenance: adapted

**Talking points:**

- `explore` is read-only, so it is safe to run in parallel.
- The subagent does *not* get repository instructions by default.
- If `/context` is approved for use, compare the **Messages** bucket before and after.

### Demo B (optional; ⚠️ mostly caller-decision features) — Parallel and background subagents, steering, follow-ups (≈8 min)

**What it shows:** two independent subagents running at once, the `/tasks` tree, teleporting in, steering, promoting a task to the background, and a follow-up to a multi-turn agent.

**Relies on:**

- `explore` and `task` (✅ GA 2026-02-25).
- The `/tasks` keys and steering from the teleported view (⚠️) ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [copilot-cli changelog (v1.0.85 lowercase keys)](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)).
- Multi-turn subagents, always on since v1.0.72 (⚠️) ([changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md)).
- The "parallelism tool, not a pause button" guidance ([GitHub Blog](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/)).

```text
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference (Tasks dialog shortcuts; agent tools) ; v1.0.85 changelog (lowercase-only task keys)
# Lines starting with # are presenter annotations; don't type them.
# [✅ GA 2026-02-25] parallel delegation to task + explore (model-judged)
In parallel: have the task agent run the unit test suite in the background, and have the explore agent list every HTTP route with the file that defines it. Keep working on a summary while they run.
# [⚠️ caller decision: /tasks] keys are unmodified lowercase letters, no Shift:
#   a = show nested levels, f = show finished, b = promote a sync task to background,
#   j/k = move, x = kill, r = remove finished, Enter = teleport, then type a steering message, for example:
/tasks
Only report failing tests and the first assertion error for each.
# [⚠️ caller decision: multi-turn follow-up] back in the main session:
Ask the explore agent you started earlier which of those routes lack tests.
```
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md), [copilot-cli changelog @ v1.0.75](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md) | Provenance: synthesized

**Risks and fallbacks:**

- **Mode isn't yours to pick.** Whether the main agent chooses background or sync mode is the model's decision; the user-facing docs don't expose the `task` tool's mode.
- **Task running synchronously?** Press lowercase `b` (no Shift) on the row in `/tasks`. Alternatively, from the main prompt (not inside `/tasks`), press `Ctrl+X` then lowercase `b`.
- **Agent already finished.** The follow-up step relies on multi-turn idle agents. If the agent has completed, the main agent may start a new subagent instead.
- **Version differences.** Pre-release 1.0.92-1 changes how messages to a running background agent are applied (⛔ not shown) ([Releases](https://github.com/github/copilot-cli/releases)).

---

## 9. Configuration, Best Practices and Pitfalls

**Do:**

- **Let selective delegation work. Reserve subagents for broad, independent or parallel work.** GitHub's harness now keeps focused discovery-and-edit work in the main agent. Source: [GitHub Blog, 2026-06-12](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/).
- **Write explicit handoffs.** Subagents see neither your conversation nor, by default, your repository instructions (built-in `explore`, `task` and `code-review`). Put the constraints in the prompt, or use `general-purpose` or an agent with `include-custom-instructions: true` (→ R2/R3). Source: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).
- **Choose models deliberately.**
  - Use `/subagents` for persistent per-agent model and effort preferences, with `"inherit"` (for `model`, `effortLevel` or `contextTier`) to follow the session.
  - With an Auto session, a custom agent's `model` field is documented to be overridden by the resolved session model. Auto's effect on `/subagents` overrides and on per-call requests is unverified.
  - `research` (a fixed model) and `rubber-duck` (a complementary model) follow their own rules.
  - Sources: [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Researching with Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research), [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck).
- **Watch cost.** Each subagent can make its own LLM calls. Use `/usage`, AI-credit limits (`--max-ai-credits`, `/limits`; → R8) and, for teams, OTel per-agent metrics. Sources: [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).
- **Keep sessions focused.** Use `/clear` or `/new` between unrelated tasks, and `/compact` with a focus instruction before a new phase. Sources: [Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices), [Managing context](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management).

**Pitfalls:**

| Pitfall | Why it happens | Mitigation | Source |
|---|---|---|---|
| Expecting a subagent on every prompt | Delegation is model-judged and deliberately selective | Use broad or parallel prompts, or name the agent | [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents) |
| A custom agent's `model` field seems "ignored" | The session is on Auto. The reference says a custom agent's `model` field is overridden by the resolved session model. Auto's effect on `/subagents` overrides, per-call requests and `modelPolicy: "required"` is undocumented (⚠️). | Pick a specific session model when showing per-agent models | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Dispatch refused | `modelPolicy: "required"` and none of the authored models can be used (documented for the non-Auto case) | Use `"preferred"`, or make sure plan or policy access covers the authored models | same |
| `/tasks` keys "do nothing" | The keys were typed with Shift (capital letters) or a modifier. Since v1.0.85, only unmodified lowercase `a f x r b j k` respond, even though the reference prints uppercase keycaps. | Type lowercase letters with no modifiers | [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md), [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Treating plan mode as a sandbox | Helpers inherit plan-mode limits, but unknown-effect shell commands and external/MCP tools are let through | Present plan mode as a "safety net, not a guarantee" (→ R4 for sandboxing) | [CLI command reference — Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `research` won't auto-run and ignores `/model` | It runs only via `/research` and uses a hard-coded model | Use `/research TOPIC` | [Researching with Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research) |
| Can't disable rubber duck via `disabledSubagents` | It is exempt from that list | Set `builtInAgents.rubberDuck: false` | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| Subagent "forgot" a convention or memory | Built-ins don't load repository instructions, and subagents can't write memory | Put the rule in the handoff; let the root agent store memories | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| New subagents rejected under load | Concurrency cap reached (plan-based; Free/Education = 2) | Wait for active agents to finish, or reduce fan-out (→ R8 for plans) | same |
| `-p` run waits after printing an answer | It waits for background agents, up to `COPILOT_TASK_WAIT_TIMEOUT_SECONDS` (600 s default) | Set the variable, or avoid background work in scripts (→ R5) | same |
| `/security-review` treated as a full audit | It covers active local changes only | Pair it with code scanning, Dependabot and secret scanning | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Changelog 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/) |
| Confusing `/agent` with `/agents` | `/agents` is an alias of `/subagents` | Say "session agent" vs "subagent models" explicitly | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |

---

## 10. Related Multi-Agent Features (Cross-References)

| Topic | One-line orientation | Owner |
|---|---|---|
| Custom agent definitions (`.agent.md`, `model`/`models`/`modelPolicy`/`reasoningEffort`/`infer`/`tools`/`mcp-servers`/`include-custom-instructions`, locations, precedence) | Custom agents are the specialist profiles that subagents run with | R2 |
| Instructions, skills, plugins, MCP (including the built-in `github-mcp-server`) and what subagents inherit | Context and tool supply for all agents | R3 |
| Tool approvals, `--allow-tool`/`--deny-tool`, plan-mode enforcement, hooks such as `subagentStop`, sandboxing | Guardrails that also apply to subagents (the `task` agent shares the parent's permissions) | R4 |
| `/fleet` and `--fleet`, `/delegate` and `&`, `/review`, autopilot, `-p`, dynamic workflows, SDK orchestration | Orchestration patterns built on top of subagents | R5 |
| Plans, AI credits, Auto discount, per-plan concurrency | Cost side of multi-agent work | R8 |

The Copilot SDK exposes the same runtime concepts to application builders:

- Custom agents attached to a session through `customAgents`.
- An `infer` flag that controls automatic selection.
- Lifecycle events: `subagent.selected`, `subagent.started`, `subagent.completed`, `subagent.failed` and `subagent.deselected`.
- `skills` that must be opted into per agent ("sub-agents do not inherit skills from the parent").

Details → R5. Source: [SDK: Custom agents and sub-agent orchestration](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents).

---

## 11. Research Limitations

1. **Subagent limits conflict across official sources (§6.3).**
   - The command reference's "Subagent limits" section and the configuration directory say max depth defaults to `6` (cap `256`).
   - The environment-variable table says `COPILOT_SUBAGENT_MAX_DEPTH` defaults to `4` (range `1`–`128`).
   - The v1.0.71 changelog (2026-07-16) says the default was lowered from 6 to 4, with a maximum of 128.
   - For concurrency, the env-var table says `COPILOT_SUBAGENT_MAX_CONCURRENT` defaults to `32` (range `1`–`256`), while the limits section says the default is plan-based with a maximum of `32`.
   - This report gives the plan-based concurrency table and the dated changelog for depth, flags the conflict, and recommends checking on the demo machine.
2. **Model IDs are inconsistent across docs.**
   - The built-in table lists `task` → `gpt-5.6-luna`, but the supported-models table lists `gpt-6-luna`, and the changelog mentions GPT-5.6 (v1.0.70) as well as GPT-6 Luna and Sol (v1.0.89).
   - The best-practices page and the `/fleet` page refer to "Claude Opus 5" and "Claude Sonnet 5", while the command reference lists `claude-opus-5.5` and `claude-sonnet-4.6` (the default).
   - The github/copilot-cli README still says the default is Claude Sonnet 4.5 and bills in premium requests; it is stale.
   - Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices), [/fleet concepts](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet), [README](https://raw.githubusercontent.com/github/copilot-cli/main/README.md), [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md).
   - Treat default models as point-in-time values and confirm them with `/subagents` before presenting.
3. **"Low-cost by default" vs the built-in default table.** The `/fleet` page's "By default, subagents use a low-cost AI model" doesn't match the Sonnet-class defaults for `general-purpose`, `code-review` and `security-review`. The `/fleet` statement may refer only to fleet-dispatched subtasks. This was not resolved.
4. **Sync vs background mode and the default `mode` are not documented officially.** Official sources confirm the background-agent tools (`read_agent`, `write_agent`), promoting a sync task to the background, notifications and wait timeouts. The `mode: "sync" | "background"` parameter itself comes only from a third-party note written against v1.0.17, which also says the default is undocumented.
5. **Scoped `list_agents`/`write_agent` messaging** requires "shared sibling communication enabled". How that is turned on is not documented in the pages read.
6. **Lifecycle labels are only partly resolved (§7.1).**
   - Dated primary evidence was found for several items:
     - `/research`: v0.0.417, 2026-02-25, not experimental.
     - `/security-review`: experimental flag removed in v1.0.64, 2026-06-23.
     - `/subagents`: in the stable changelog since at least v1.0.64.
     - `/tasks`, multi-turn subagents and the instruction-preference features: dated stable-changelog entries.
   - None of these has a **feature-specific GA/preview label**. They are marked ⚠️ caller decision rather than "GA".
   - No dated lifecycle evidence was found for `general-purpose` or sidekick agents; both are ⛔ held.
   - No removal notice was found for the "Plan" agent.
   - The earliest introduction of `/subagents` before v1.0.64 was not located.
7. **Model behavior under Auto and the specialist exceptions are unverified.**
   - The command reference states the Auto rule only for the custom-agent `model` field.
   - No source read says whether Auto also overrides `subagents.agents` preferences, per-call model requests, the built-in default models, `models` lists, or `modelPolicy: "required"` (refuse vs. dispatch).
   - No source read says how `research`'s fixed model or `rubber-duck`'s complementary model is resolved in an Auto session.
   - Whether a `subagents.agents.research` override takes effect is also unknown.
   - The report states only the documented rules and doesn't reconcile these at runtime.
8. **Context-tier precedence is undocumented.** The documented model/effort precedence chain doesn't cover context tier. The custom-agent frontmatter fields have no context-tier field. The ordering among `--context`, `/model`, the repository `contextTier`, `subagents.agents.<name>.contextTier`, and instruction-stated preferences (v1.0.85) is therefore ⚠️ unverified.
9. **Reasoning-effort inheritance.** The CLI reference says unset effort is inherited. The SDK docs say it is inherited only when the subagent runs the same model. The CLI runtime behavior was not tested.
10. **`/tasks` keycaps vs. changelog.** The command reference prints uppercase keycaps (`K`, `J`, `X`, `R`, `B`). The stable v1.0.85 changelog (2026-09-16) says only unmodified lowercase letters respond. This report follows the newer changelog for the target stable version (1.0.91) and did not test it hands-on.
11. **Frontmatter key spellings differ** between the reference (`modelPolicy`, `reasoningEffort`) and changelog wording (`model-policy`, `reasoning-effort`). This is deferred to R2.
12. **Source access notes.**
    - The configuration-directory page was read in full through its [source file in the github/docs repository](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-config-dir-reference.md). The rendered [docs page](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) was confirmed through a search snippet containing identical `subagents.agents` text.
    - The command reference was read in full through the docs Markdown API.
    - Docs pages carry no visible "last updated" date, so the changelog and blog dates are used for status.
    - The latest stable CLI version at research time was 1.0.91 (2026-10-01). Pre-release 1.0.92-x notes are labeled as such.
    - The v1.0.64–v1.0.66 entries were read from the changelog at tag v1.0.67. The v0.0.417 `/research` entry was read from an official github/copilot-cli compare patch.
13. **No hands-on validation.** The demo scenarios are built from documentation and were not run. Delegation decisions are made by the model and may differ between runs and versions.
14. **Third-party evidence.** Only one third-party source is used (the JonathanMace/copilot_cli_design note), and it is clearly labeled as corroboration. The exact `task.mode` schema and idle-agent persistence it describes are not presented as a current supported API contract. Other third-party tutorials found during discovery were excluded because their content (for example, a "Plan" agent and premium-request billing) was outdated.
15. **Scope exclusions.** JetBrains-specific announcements surfaced in search and were excluded per the brief. Plans and pricing are referenced only where needed for limits (→ R8).

---

## 12. Complete Reference List

### Official documentation (docs.github.com) — 14

1. [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)
2. [About custom agents (Copilot CLI)](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)
3. [Managing context in GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management)
4. [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
5. [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)
6. [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)
7. [Researching with GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research)
8. [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)
9. [Steering agents in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-agents)
10. [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents)
11. [Running tasks in parallel with the /fleet command](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)
12. [Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)
13. [About Copilot auto model selection](https://docs.github.com/en/copilot/concepts/models/auto-model-selection)
14. [Custom agents and sub-agent orchestration (Copilot SDK)](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)

### GitHub Blog and GitHub Changelog — 10

15. [GitHub Copilot CLI: Use custom agents and delegate to Copilot coding agent — 2025-10-28](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/)
16. [GitHub Copilot CLI: Enhanced agents, context management, and new ways to install — 2026-01-14](https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/)
17. [GitHub Copilot CLI is now generally available — 2026-02-25](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)
18. [GitHub Copilot CLI combines model families for a second opinion (blog) — 2026-04-06](https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/)
19. [GitHub Copilot CLI now supports Copilot auto model selection — 2026-04-17](https://github.blog/changelog/2026-04-17-github-copilot-cli-now-supports-copilot-auto-model-selection/)
20. [Rubber Duck in GitHub Copilot CLI now supports more models — 2026-05-07](https://github.blog/changelog/2026-05-07-rubber-duck-in-github-copilot-cli-now-supports-more-models/)
21. [Copilot CLI: Improved UI, rubber duck, prompt scheduling, and voice input — 2026-06-02](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/)
22. [Dedicated security review command now available in Copilot CLI — 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/)
23. [How we made GitHub Copilot CLI more selective about delegation (blog) — 2026-06-12](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/)
24. [Dynamic workflows in Copilot CLI and the Copilot app — 2026-10-01](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/)

### GitHub repositories (official) — 7

25. [github/copilot-cli — changelog.md (main; latest stable 1.0.91, 2026-10-01)](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)
26. [github/copilot-cli — changelog.md at tag v1.0.75 (covers 1.0.69–1.0.74)](https://raw.githubusercontent.com/github/copilot-cli/v1.0.75/changelog.md)
27. [github/copilot-cli — README.md](https://raw.githubusercontent.com/github/copilot-cli/main/README.md)
28. [github/copilot-cli — Releases (including 1.0.92-x pre-releases)](https://github.com/github/copilot-cli/releases)
29. [github/docs — cli-config-dir-reference.md (source of reference 5)](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-config-dir-reference.md)
30. [github/copilot-cli — changelog.md at tag v1.0.67 (covers 1.0.64–1.0.66, including the v1.0.64 `/security-review` and `/subagents` entries)](https://raw.githubusercontent.com/github/copilot-cli/v1.0.67/changelog.md)
31. [github/copilot-cli — compare patch for changelog v0.0.417–v0.0.420 (v0.0.417 adds `/research`; v0.0.418 is the GA release)](https://github.com/github/copilot-cli/compare/github:f8396ae...github:3b73154.patch)

### Third-party (corroboration only) — 1

32. [JonathanMace/copilot_cli_design — "Subagent Spawning and the Task Tool" (community note, written against CLI 1.0.17)](https://raw.githubusercontent.com/JonathanMace/copilot_cli_design/main/docs/notes/2026_04_03_subagent_spawning_and_task_tool.md)

### Code samples

No standalone code-sample repositories were used. The code and CLI blocks in this report are labeled `verbatim`, `adapted` or `synthesized` inline, with their source.
