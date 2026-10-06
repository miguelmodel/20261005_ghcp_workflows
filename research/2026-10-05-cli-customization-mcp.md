# Research Report: Copilot CLI customization stack and MCP configuration

**Date:** 2026-10-05
**Researcher:** Copilot Web Researcher Agent
**Topic slug:** cli-customization-mcp
**Sources consulted:** 32 total — 22 official GitHub Docs pages (docs.github.com), 4 GitHub Changelog posts (github.blog), 1 MCP documentation page (modelcontextprotocol.io), 4 official GitHub repository files (github/copilot-cli, github/github-mcp-server), 1 public code sample (dotnet/runtime)
**Required MCP:** verified - WebIQ-MCP; tools used: web, browse, news

> Assignment: R3 of the brief "Subagents & Multi-Agent Orchestration with GitHub Copilot CLI". Boundaries: `.agent.md` frontmatter semantics in depth → R2; permissions, approvals and hooks → R4; organization/enterprise MCP and plugin policy (registry, allowlists, managed settings) → R7. These topics appear here only as cross-references.

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overview and Key Concepts](#2-overview-and-key-concepts)
3. [Custom Instructions in the CLI](#3-custom-instructions-in-the-cli)
4. [Agent Skills (`SKILL.md`)](#4-agent-skills-skillmd)
5. [Plugins and Plugin Marketplaces](#5-plugins-and-plugin-marketplaces)
6. [MCP Configuration for the CLI](#6-mcp-configuration-for-the-cli)
7. [What Subagents Inherit vs. Isolate](#7-what-subagents-inherit-vs-isolate)
8. [Practical Guidance: Composing a Multi-Agent Setup](#8-practical-guidance-composing-a-multi-agent-setup)
9. [Configuration, Best Practices, and Pitfalls](#9-configuration-best-practices-and-pitfalls)
10. [Advanced Topics and Cross-References](#10-advanced-topics-and-cross-references)
11. [Research Limitations](#11-research-limitations)
12. [Complete Reference List](#12-complete-reference-list)

**Note on code examples:** every example has a provenance label. For `verbatim` examples, the only additions are annotation comments such as `Source:` and `File:` lines. JSON examples carry these as `//` comment lines. **Delete all `//` comment lines** before you save a file that must be strict JSON; GitHub documents only `settings.json` as accepting JSON with comments (JSONC) ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)). Examples labeled `synthesized` that use `example.com` endpoints, made-up tool names or placeholder tokens are **templates**. They will not run until you substitute real values, provide the referenced credentials and sign in to Copilot. See the rehearsal checklist in §8.4.

---

## 1. Executive Summary

The Copilot CLI's customization stack has five building blocks. Each one answers a different question:

- **Custom instructions** say how Copilot should always behave.
- **Skills** say how to handle a specific kind of task, and load only when relevant.
- **Custom agents** are reusable specialist profiles. You can select one as the session agent with `/agent` or `--agent`; it then works in the main session's context. Alternatively, the main agent can delegate a task to one, which runs it as a subagent in its own context window.
- **MCP servers** add tools that reach external systems.
- **Plugins** package and distribute any combination of the above.

GitHub frames these as distinct choices. In GitHub's words, custom instructions "tell Copilot **how to behave** in general", skills "tell Copilot **how to handle a specific kind of task**", and plugins are "**packages** that can deliver preconfigured customizations such as skills, hooks, custom agents, and MCP servers" ([Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)). The CLI became generally available on 2026-02-25, and the GA announcement described it as extensible "with MCP, plugins, and skills" ([GitHub Changelog, 2026-02-25](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)).

**Key takeaways for a multi-agent setup:**

1. **Instructions do not automatically flow to every subagent.**
   - The session agent and the built-in `general-purpose` subagent receive repository instruction files.
   - The built-in `explore`, `task` and `code-review` subagents do not.
   - A custom agent running as a subagent receives them only if its frontmatter sets `include-custom-instructions: true`. This setting shipped in CLI 1.0.86 on 2026-09-17 ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)).
2. **MCP configuration has layers.** From highest to lowest priority:
   - the `--additional-mcp-config` flag (session only)
   - servers provided by plugins
   - workspace files `.mcp.json` and `.github/mcp.json`, which load only in trusted folders
   - the user file `~/.copilot/mcp-config.json`

   Separately, a custom agent can declare its own `mcp-servers` that only that agent uses ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)).
3. **The GitHub MCP server is built in.** By default only a subset of its tools is enabled. You adjust that per session with `--add-github-mcp-toolset`, `--add-github-mcp-tool` or `--enable-all-github-mcp-tools`, and you turn it off with `--disable-builtin-mcps`. Two details are not consistently documented: which tools the default subset contains, and whether the add flags add to that subset or replace it. Check both in your CLI version (§6.6) ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [github-mcp-server: Install in Copilot CLI](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md)).
4. **Plugins add to your setup, and name collisions resolve differently by component type.**
   - Agents and skills use first-found-wins, so a plugin cannot override a project or personal agent or skill with the same name.
   - MCP servers use last-wins, so a plugin's server replaces a same-named workspace or user server. Only `--additional-mcp-config` outranks it.
   - Agent Plugins 1.0 is the portable plugin format and became GA on 2026-08-12 ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference); [GitHub Changelog, 2026-08-12](https://github.blog/changelog/2026-08-12-agent-plugins-1-0-in-vs-code-copilot-cli-and-the-copilot-app/)).

---

## 2. Overview and Key Concepts

### 2.1 The stack at a glance

GitHub's overview of CLI customization lists six mechanisms: custom instructions, hooks, skills, custom agents, MCP servers and plugins. It also lists personal settings changed with `/settings`. Instructions are injected into every prompt, while custom agents "are run as subagents—separately to the main agent that responds to a prompt—with their own context window" ([Overview of customizing GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview)).

That overview sentence describes *delegated* use only. The command reference counts "a custom agent selected with `--agent`" as the **session agent** ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). The custom-agents how-to likewise separates agents "that you select yourself—with `--agent`, `/agent`, or by inference" from agents that Copilot "runs your custom agent as a subagent" ([Creating and using custom agents for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)). Isolation therefore comes from **delegation**, not from the custom-agent file itself; §7 develops this distinction.

The comparison page defines a subagent as follows:

> "These are **delegated agent processes**, tied to the main agent and used to perform specific tasks separately from the main agent process. They have their own context window, which can be populated without affecting the main agent's context."
> - Source: [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)

```text
# Source: synthesized from the Overview, Comparing-features and plugin-reference pages (links below) | Provenance: synthesized
┌──────────────────────────── Plugin (distribution unit) ────────────────────────────┐
│  agents/ (*.agent.md)   skills/ (SKILL.md)   hooks.json   MCP config   LSP config  │
└────────────────────────────────────────────────────────────────────────────────────┘
          │ installs / enables
          ▼
Session (main agent) ── always-on: custom instructions (AGENTS.md, copilot-instructions.md, …)
   │                 ── on-demand: skills (loaded when relevant or /skill-name)
   │                 ── tools: built-in tools + MCP servers (built-in GitHub MCP, user, workspace, plugin, session)
   │
   └── task tool ──► Subagents (own context window)
                       • built-in: explore, task, general-purpose, code-review, research, rubber-duck, security-review
                       • custom: *.agent.md (own tools list, optional agent-scoped mcp-servers,
                                 optional include-custom-instructions)
```
> - Source: [Overview of customizing GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview), [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features), [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference) | Provenance: synthesized

Two CLI tools tie the stack together:

- The `skill` tool is triggered when Copilot invokes a skill.
- The `task` tool is triggered when Copilot delegates to a subagent.

GitHub's comparison page describes both triggers ([Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)). The command reference also lists the `list_agents`, `read_agent` and `write_agent` tools for agent coordination ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

The cross-surface cheat sheet confirms which features the CLI supports:

- **Supported:** custom instructions, custom agents, subagents, agent skills, hooks and MCP servers.
- **Not supported:** prompt files (`.github/prompts/*.prompt.md`).

([Copilot customization cheat sheet](https://docs.github.com/en/copilot/reference/customization-cheat-sheet)).

### 2.2 MCP basics (for newcomers)

The Model Context Protocol (MCP) uses a client–server architecture. The host application creates one MCP client for each MCP server it connects to. Servers expose three main primitives: tools, resources and prompts. The specification defines two transports:

> "**Stdio transport**: Uses standard input/output streams for direct process communication between local processes on the same machine, providing optimal performance with no network overhead."
> "**Streamable HTTP transport**: Uses HTTP POST for client-to-server messages with optional Server-Sent Events for streaming capabilities."
> - Source: [MCP architecture overview (modelcontextprotocol.io)](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture.md)

GitHub's MCP overview states that "GitHub Copilot CLI supports both local and remote MCP servers. The GitHub MCP server is built in and available without additional configuration." It also notes that the GitHub MCP Registry "is currently in public preview and subject to change" ([About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp)).

### 2.3 Feature status (GA / preview / experimental)

GitHub Docs pages carry no publication date. Rows that cite docs pages reflect the version accessed on 2026-10-05.

| Feature | Status | Evidence and date |
|---|---|---|
| Copilot CLI, including MCP, plugins, skills, custom agents and hooks | **GA** | [Changelog 2026-02-25](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/): "now **generally available** for all Copilot subscribers" |
| Agent Skills in Copilot (Copilot coding agent, CLI, and VS Code Insiders at launch) | First shipped 2025-12-18; GA as part of the CLI GA | [Changelog 2025-12-18](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/) |
| `--additional-mcp-config` (per-session MCP) | Shipped; listed among the new automation flags on 2026-01-14 | [Changelog 2026-01-14](https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/) |
| Agent Plugins 1.0 plugin format | **GA** in VS Code, the Copilot CLI, the Copilot SDK and the Copilot app on 2026-08-12 | [Changelog 2026-08-12](https://github.blog/changelog/2026-08-12-agent-plugins-1-0-in-vs-code-copilot-cli-and-the-copilot-app/) |
| Legacy Copilot plugin format | Supported; "no migration required" | [Changelog 2026-08-12](https://github.blog/changelog/2026-08-12-agent-plugins-1-0-in-vs-code-copilot-cli-and-the-copilot-app/); [About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins) (accessed 2026-10-05) |
| `copilot instruction list`; `enable`/`disable` for `copilot plugin`, `copilot mcp` and `copilot skill` | Shipped in CLI 1.0.85 on 2026-09-16 | [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| `include-custom-instructions` agent frontmatter | Shipped in CLI 1.0.86 on 2026-09-17 | [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| `.claude/rules` files read as custom instructions | Shipped in CLI 1.0.89 on 2026-09-28 | [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| `--mcp-github-auth` | Shipped in CLI 1.0.90 on 2026-09-30, according to the changelog only | [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| `/mcp search` (install from the registry) | **Experimental**: requires `--experimental` or `/experimental on` | [Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) (accessed 2026-10-05) |
| Resource discovery (`discover-resources` skill) | **Experimental** | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) (accessed 2026-10-05) |
| GitHub MCP Registry | **Public preview** | [About MCP](https://docs.github.com/en/copilot/concepts/context/mcp) (accessed 2026-10-05) |
| Tool search (deferred MCP tool loading) | On by default on supported models; no preview label | [Tool search](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/tool-search) (accessed 2026-10-05) |

The CLI ships frequently. The changelog records releases 1.0.85 through 1.0.91 between 2026-09-16 and 2026-10-01 ([copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)).

---

## 3. Custom Instructions in the CLI

### 3.1 Locations

The CLI reads instructions from the locations below. Unless a row says otherwise, it searches the **standard locations**: "the repository root, the current working directory, intermediate directories between them, and any directories nested in the path of a file it is working on" ([Adding custom instructions for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)).

| Location | Scope and behavior (official) |
|---|---|
| `$HOME/.copilot/copilot-instructions.md` | User-level instructions that apply across repositories |
| `$HOME/.copilot/instructions/**/*.instructions.md` | Modular user-level instructions |
| `.github/copilot-instructions.md` | Repository-wide instructions |
| `.github/instructions/**/*.instructions.md` | Modular, path-specific repository instructions (`applyTo`); not discovered in intermediate directories |
| `AGENTS.md` | Agent instructions |
| `CLAUDE.md` (also `.claude/CLAUDE.md`) | Agent instructions |
| `GEMINI.md` | Agent instructions |
| `.claude/rules/**/*.md` | Claude Code rule files, read the same way as `*.instructions.md`; scoped with `paths` or `applyTo` (CLI 1.0.89, 2026-09-28) |
| Directories in `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` | Additional `AGENTS.md` and `*.instructions.md` files; separate directories with commas |

Sources: [Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions); [CLI command reference — Custom instructions locations](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md). If `COPILOT_HOME` is set, it replaces `$HOME/.copilot` for both user-level locations ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)).

### 3.2 Load order and precedence

The CLI has **no precedence ranking** between instruction files. It merges every applicable file:

> "When multiple applicable user-level and repository instruction files exist, Copilot CLI combines their instructions. It removes duplicate copies of identical user-level `copilot-instructions.md`, repository-wide, and agent instructions, but does not define a general precedence order between these files. Avoid conflicting instructions."
> - Source: [Adding custom instructions for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)

Practical consequences:

- **Path-specific files** apply only when their `applyTo` glob matches a file the CLI is working with. A file disabled with `/instructions` is not included ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)).
- **`--no-custom-instructions`** turns off loading from `AGENTS.md` and related files ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Edits are not live.** "Changes you make to custom instructions files are not immediately available for use in active CLI sessions." To pick them up, resume the session (for example `copilot --continue`) or start a new one with `/new` ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)).
- **File references.** `@relative/path` references in `.github/copilot-instructions.md`, `AGENTS.md` or `CLAUDE.md` are expanded. They are not expanded in `GEMINI.md` or `*.instructions.md` ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)). The two official pages disagree on whether absolute paths are allowed; see [Research Limitations](#11-research-limitations).
- **`excludeAgent`.** Path-specific files can set `excludeAgent: "code-review"` or `"cloud-agent"`. This affects only Copilot cloud agent and Copilot code review ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)).

### 3.3 Commands

| Command | Purpose |
|---|---|
| `/instructions` | View and toggle the instruction files discovered for the session |
| `copilot instruction list [--json]` | List instruction sources for the current directory without starting a session (replaces the retired `copilot plugins list --kind instruction`) |
| `copilot init` / `/init` | Analyze the codebase and write or update `.github/copilot-instructions.md` |
| `/init suppress` | Hide the "No copilot instructions found" startup hint for this repository |

Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions).

### 3.4 Example: path-specific instruction file

```markdown
---
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions | Provenance: adapted
applyTo: "**/*.ts,**/*.tsx"
---

Use TypeScript strict mode. Prefer functional components over class components.
Add JSDoc comments for public APIs.
```
> - Source: [Adding custom instructions for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) (frontmatter), [Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices) (rule text) | Provenance: adapted

Save the file as `.github/instructions/typescript.instructions.md`; the name must end in `.instructions.md`. GitHub's best-practices guide advises: "Keep instructions concise and actionable. Lengthy instructions can dilute effectiveness." ([Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).

---

## 4. Agent Skills (`SKILL.md`)

### 4.1 What a skill is and how it is structured

A skill is a directory that contains a `SKILL.md` file (Markdown with YAML frontmatter) and, optionally, scripts or other resources. GitHub Docs describe the Agent Skills specification as "an open standard, used by a range of different AI systems" ([About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)). When Copilot uses a skill, it injects the `SKILL.md` contents into the agent's context and makes the other files in the skill directory available ([Adding agent skills for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)).

The CLI reference documents these frontmatter fields:

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Unique identifier, at most 64 characters. Colons allow namespaced names such as `my-plugin:search`. |
| `description` | Yes | What the skill does and when to use it, at most 1024 characters. |
| `argument-hint` | No | Hint shown in the skill picker. |
| `allowed-tools` | No | Tools that are allowed automatically while the skill is active. `"*"` allows all tools. |
| `user-invocable` | No | Default `true`. Controls whether users can run the skill as `/SKILL-NAME`. |
| `disable-model-invocation` | No | Default `false`. Stops the agent from invoking the skill automatically. |

Source: [CLI command reference — Skills reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference). The how-to guide also mentions an optional `license` field. It asks for lowercase, hyphenated names that usually match the directory name ([Adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)).

```markdown
---
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills | Provenance: verbatim
name: github-actions-failure-debugging
description: Guide for debugging failing GitHub Actions workflows. Use this when asked to debug failing GitHub Actions workflows.
---

To debug failing GitHub Actions workflows in a pull request, follow this process, using tools provided from the GitHub MCP Server:

1. Use the `list_workflow_runs` tool to look up recent workflow runs for the pull request and their status
2. Use the `summarize_job_log_failures` tool to get an AI summary of the logs for failed jobs, to understand what went wrong without filling your context windows with thousands of lines of logs
3. If you still need more information, use the `get_job_logs` or `get_workflow_run_logs` tool to get the full, detailed failure logs
4. Try to reproduce the failure yourself in your own environment.
5. Fix the failing build. If you were able to reproduce the failure yourself, make sure it is fixed before committing your changes.
```
> - Source: [Adding agent skills for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) | Provenance: verbatim

This example is useful because it composes two features: the skill tells Copilot *how* to use tools from the *GitHub MCP server*. A skill can also bundle a script and pre-approve the tool that runs it. GitHub attaches a security warning to that:

> "Only pre-approve the `shell` or `bash` tools if you have reviewed this skill and any referenced scripts, and you fully trust their source."
> - Source: [Adding agent skills for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)

### 4.2 Locations and discovery order

When two skills share a name, the first one found wins, in this order:

1. `.github/skills/`, `.agents/skills/` and `.claude/skills/` in the project.
2. The same directories in parent folders (monorepo support).
3. `~/.copilot/skills/` and `~/.agents/skills/` (personal).
4. Skills from installed plugins.
5. Directories listed in `COPILOT_SKILLS_DIRS`.
6. `.github/skills/` under directories added with `--add-dir` or `/add-dir`. Adding a directory is a trust decision.
7. Skills bundled with the CLI (built-in, lowest priority).
8. Organization or enterprise skills ("Remote"). Their content is fetched when the skill is invoked.

Source: [CLI command reference — Skill locations](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference). Use the `ignoredSkillsLocations`, `skillDirectories` and `disabledSkills` settings to exclude, add or disable skills ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)). When two plugins ship skills with the same name, both stay available under plugin-qualified names such as `/my-plugin/search` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Copilot also picks up skills already set up for Claude Code in `.claude/skills` ([Changelog 2025-12-18](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)).

### 4.3 Invocation and management

Skills are used in two ways:

- **Automatically.** Copilot decides when to use a skill based on the prompt and the skill's description.
- **Explicitly.** Name the skill with a leading slash, for example: "Use the /frontend-design skill to create a responsive navigation bar in React."

([Adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)).

```shell
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference | Provenance: verbatim
# Install a skill for your user account (default)
copilot skill add ./my-skill/SKILL.md

# Install a skill into the current project (.github/skills; file or URL skills only)
copilot skill add --project ./my-skill/SKILL.md

# Enable, disable, or remove a skill by name
copilot skill enable my-skill
copilot skill disable my-skill
copilot skill remove my-skill
```
> - Source: [CLI command reference — Managing skills non-interactively](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: verbatim

In an interactive session, the equivalent commands are `/skills`, `/skills list`, `/skills info NAME`, `/skills add [--project] <FILE|URL|DIRECTORY>`, `/skills remove` and `/skills reload`. A skill that came from a plugin cannot be removed directly; manage the plugin instead ([Adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

**Skills versus instructions.** GitHub recommends:

> "We recommend using **custom instructions** for simple instructions relevant to almost every task (for example information about your repository's coding standards), and **skills** for more detailed instructions that Copilot should only access when relevant."
> - Source: [Adding agent skills for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)

---

## 5. Plugins and Plugin Marketplaces

### 5.1 What a plugin can bundle

A plugin is "A bundle of components in a single installable unit". It can contain any of the following:

- custom agents (`*.agent.md`)
- skills (`SKILL.md` folders)
- hooks (`hooks.json`)
- MCP server configurations
- LSP server configurations

GitHub lists the benefits as "Reusability across projects", "Team standardization of Copilot configuration", sharing domain expertise, and the ability to "Encapsulate complex MCP server setups" ([About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins)). The CLI reference adds slash commands and rules as further components of the Agent Plugins 1.0 format ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)).

### 5.2 Two plugin formats

| | Agent Plugins 1.0 (portable) | Legacy Copilot plugin |
|---|---|---|
| Opt-in | `plugin.json` declares `$schema: https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`. The CLI also recognizes the v1.1.0 schema. | No Agent Plugins `$schema` |
| Skills | `skills/<name>/SKILL.md` (fixed location) | `skills/` by default; the path can be changed with the `skills` manifest field |
| MCP | `mcp.json` at the plugin root (fixed). Transports: `stdio`, `streamable-http`, `sse`. | `.mcp.json`, `.github/mcp.json`, or the `mcpServers` manifest field |
| Agents, hooks, commands, rules, LSP | Under `com.github.copilot/` (Copilot-specific; other clients ignore it) | `agents/`, `hooks.json`, `lsp.json` and so on; paths configurable |

Sources: [About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins); [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference). GitHub's guidance: "For a new plugin, use Agent Plugins 1.0 unless you require configurable component paths." ([About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins)). The 2026-08-12 changelog explains the format:

> "Agent Plugins 1.0 is an open standard that packages agent skills and MCP servers into one installable plugin that is governed independently of any single vendor."
> - Source: [GitHub Changelog, 2026-08-12](https://github.blog/changelog/2026-08-12-agent-plugins-1-0-in-vs-code-copilot-cli-and-the-copilot-app/)

```jsonc
// Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating | Provenance: verbatim
// File: my-dev-tools/plugin.json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "my-dev-tools",
  "description": "React development utilities",
  "version": "1.2.0",
  "author": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "license": "MIT",
  "keywords": ["react", "frontend"]
}
```
> - Source: [Creating a plugin for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating) | Provenance: verbatim (the `File:` line is also an annotation)

```jsonc
// Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating | Provenance: verbatim
// File: my-dev-tools/mcp.json (Agent Plugins 1.0 MCP config at the plugin root)
{
 "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
 "mcpServers": {
   "deployment-api": {
     "type": "streamable-http",
     "url": "https://deploy.example.com/mcp"
   },
   "local-validator": {
     "type": "stdio",
     "command": "node",
     "args": ["${PLUGIN_ROOT}/server/index.js"],
     "cwd": "${PLUGIN_ROOT}",
     "env": {
       "DATA_DIR": "${PLUGIN_DATA}/validator"
     }
   }
 }
}
```
> - Source: [Creating a plugin for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating) | Provenance: verbatim

For `stdio` servers, the CLI expands `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` in `args`, `env` values and `cwd`. Configuration values for remote (`http`, `sse`, `streamable-http`) servers "are passed through literally, with no placeholder or environment-variable expansion" ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)).

### 5.3 Install and manage

```shell
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing | Provenance: verbatim
copilot plugin marketplace list
copilot plugin marketplace browse awesome-copilot
copilot plugin install database-data-management@awesome-copilot
copilot plugin list                    # View installed plugins
copilot plugin update PLUGIN-NAME      # Update plugin to latest version
copilot plugin uninstall PLUGIN-NAME   # Remove plugin completely
copilot plugin disable PLUGIN-NAME     # Disable a plugin without uninstalling it
copilot plugin enable PLUGIN-NAME      # Re-enable a previously disabled plugin
copilot plugin marketplace add anthropics/claude-code
```
> - Source: [Finding and installing plugins for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing) | Provenance: verbatim (lines collected from several snippets on the same page)

- **Install sources.** `copilot plugin install` accepts several specification formats: `plugin@marketplace`, `OWNER/REPO`, `OWNER/REPO:PATH/TO/PLUGIN`, a Git URL, or a local path. Every command has a slash equivalent, such as `/plugin install` and `/plugin marketplace add`. Bare `/plugin` opens a dashboard with **Installed**, **Online** and **Marketplace** views ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Default marketplaces.** "Copilot comes with two marketplaces already registered by default: `copilot-plugins` and `awesome-copilot`" ([Finding and installing plugins](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing)).
- **Auto-update.** First-party plugins auto-update at session start in a trusted directory unless `autoUpdate` is set to `false` or `COPILOT_AUTO_UPDATE=false` is set ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)).
- **Local testing.** Load a plugin from disk for a session with `--plugin-dir=DIRECTORY` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Installed plugins are cached, so reinstall a local plugin after you edit it: "When you install a plugin its components are cached and the CLI reads from the cache for subsequent sessions." ([Creating a plugin](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating)).
- **MCP servers are not plugins.** Use `copilot mcp add` or the `/mcp` **Online** view to add MCP servers, not `copilot plugin install` ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)).

### 5.4 Declarative enablement per repository

Besides installing plugins by command, you can enable them declaratively. List them under `enabledPlugins` in `~/.copilot/settings.json` (user) or `.github/copilot/settings.json` (repository). Register extra marketplaces with `extraKnownMarketplaces`. Copilot cloud agent reads the same two repository keys ([About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)). Enabling a plugin at repository level keeps it inside that repository:

> "A plugin enabled only through a repository's `enabledPlugins` is scoped to that repository: it auto-installs and activates in the declaring repository, but stays disabled globally, so it never activates in unrelated projects."
> - Source: [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)

Here is a real `.github/copilot/settings.json` from a public repository:

```jsonc
// Source: https://github.com/dotnet/runtime/blob/main/.github/copilot/settings.json | Provenance: verbatim
{
  "extraKnownMarketplaces": {
    "dotnet-arcade-skills": {
      "source": {
        "source": "github",
        "repo": "dotnet/arcade-skills"
      }
    }
  },
  "enabledPlugins": {
    "dotnet-dnceng@dotnet-arcade-skills": true
  }
}
```
> - Source: [dotnet/runtime `.github/copilot/settings.json`](https://github.com/dotnet/runtime/blob/main/.github/copilot/settings.json) | Provenance: verbatim

### 5.5 Marketplaces

A marketplace is defined by a `marketplace.json` file. The CLI looks for it as `marketplace.json`, `.plugin/marketplace.json`, `.github/plugin/marketplace.json` or `.claude-plugin/marketplace.json`, in that order. Each entry in the `plugins` array has a `name`, a `source` and optional metadata. The `source` can be a relative path, a GitHub repository with a `ref` or `sha`, or a URL; a full 40-character `sha` pins the install to an exact commit ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference); [Creating a plugin marketplace](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace)).

```jsonc
// Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace | Provenance: adapted (one of two plugin entries kept; truncated description completed)
// File: .github/plugin/marketplace.json
{
  "name": "my-marketplace",
  "owner": {
    "name": "Your Organization",
    "email": "plugins@example.com"
  },
  "metadata": {
    "description": "Curated plugins for our team",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "security-checks",
      "description": "Check for potential security vulnerabilities in pull requests",
      "version": "1.3.0",
      "source": "./plugins/security-checks"
    }
  ]
}
```
> - Source: [Creating a plugin marketplace for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace) | Provenance: adapted

### 5.6 Precedence when names collide

> "If you have a project-level custom agent or skill with the same name or ID as one in a plugin you install, the agent or skill in the plugin is silently ignored. The plugin cannot override project-level or personal configurations."
> - Source: [GitHub Copilot CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)

MCP servers use the opposite rule, last-wins:

- If a plugin defines a server with the same name as one you already have, the plugin's definition wins.
- `--additional-mcp-config` can override a plugin's server.
- If two plugins define the same server name, the CLI uses the plugin that loaded last and shows a warning.
- "**Built-in tools and agents** are always present and cannot be overridden by user-defined components."

([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)).

Enterprise-managed plugin standards (`enabledPlugins`, `extraKnownMarketplaces`, `strictKnownMarketplaces` in managed settings) are covered in **R7** ([GitHub Changelog, 2026-08-12](https://github.blog/changelog/2026-08-12-agent-plugins-1-0-in-vs-code-copilot-cli-and-the-copilot-app/)).

---

## 6. MCP Configuration for the CLI

### 6.1 Configuration levels

| Level | Where | Scope | How to manage | Notes |
|---|---|---|---|---|
| **Built-in** | `github-mcp-server`, shipped inside the CLI | Every session | Per-session flags (see 6.6); `/mcp show github-mcp-server` | Exempt from enterprise allowlist enforcement (R7) |
| **User** | `~/.copilot/mcp-config.json` (moves with `COPILOT_HOME`) | All projects | `/mcp add`, `/mcp edit`, `/mcp delete`; `copilot mcp add` and `copilot mcp remove`; or edit the file | Lowest priority |
| **Workspace / repository** | `.mcp.json` in any directory from the working directory up to the Git root, and `.github/mcp.json` | One project | Edit the file directly. `/mcp edit` refuses workspace-sourced servers. | Loads only in a **trusted** folder |
| **Plugin** | Plugin `mcp.json` (Agent Plugins 1.0), or `.mcp.json`, `.github/mcp.json` or `mcpServers` (legacy) | Wherever the plugin is enabled | `copilot plugin …` | Overrides same-named workspace and user servers |
| **Session** | `--additional-mcp-config=JSON` or `--additional-mcp-config=@file` | One session | Command-line flag | Highest priority |
| **Agent** | `mcp-servers:` in a custom agent's frontmatter | Only that agent | Edit the `.agent.md` file (R2) | Same schema as `mcp-config.json` |
| **On/off toggles** | `disabledMcpServers` (user or repo settings), `enabledMcpServers`, `--disable-mcp-server`, `--enable-mcp-server`, `/mcp disable`, `/mcp enable` | Varies by toggle | Settings and flags | Repository `disabledMcpServers` can only add entries ("union") |
| **Org / enterprise** | Registry URL, allowlists, managed settings | Policy | Administrators | **See R7** |

Sources: [Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers); [CLI command reference — MCP server configuration](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference); [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference); [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents).

### 6.2 Loading priority

> "MCP servers from different sources are merged in priority order (highest first). When servers share a name, the higher-priority source takes precedence."
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

From highest to lowest:

1. `--additional-mcp-config`
2. Servers provided by plugins
3. Workspace servers (`.mcp.json` and `.github/mcp.json`, from the working directory up to the Git root; the folder must be trusted)
4. `~/.copilot/mcp-config.json`

([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

Within the workspace level, two more rules apply. If `.mcp.json` and `.github/mcp.json` sit in the same directory, `.mcp.json` wins. When server names conflict, the file closer to the working directory wins ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)). GitHub recommends `.mcp.json` for "Local or per-checkout configuration" and `.github/mcp.json` for "Shared configuration that is committed to the repository" (same source).

**Trust gate:**

> "Project-level MCP servers are loaded only after you confirm folder trust on first launch. They are silently skipped in untrusted directories."
> - Source: [Adding MCP servers for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)

In prompt mode (`copilot -p`), workspace MCP servers load only if the directory is already trusted or `GITHUB_COPILOT_PROMPT_MODE_WORKSPACE_MCP=true` is set ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers); [CLI command reference — Environment variables](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). R4 covers trust and permissions in depth.

The CLI does not read VS Code's `.vscode/mcp.json`, because that file uses the top-level key `servers`. The documented migration command for POSIX shells is:

```shell
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference | Provenance: verbatim
jq '{mcpServers: .servers}' .vscode/mcp.json > .mcp.json
```
> - Source: [CLI command reference — Migrating from `.vscode/mcp.json`](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: verbatim (the command requires `jq`; the same section also gives a PowerShell variant)

### 6.3 Local (stdio) vs. remote (HTTP) servers: transports and fields

| `type` | Meaning | Required fields |
|---|---|---|
| `local` / `stdio` | Starts a local process and talks to it over stdin/stdout. Choose `stdio` for portability to VS Code and the cloud agent. | `command`, `args` |
| `http` | Remote server using Streamable HTTP. `"streamable-http"` is accepted and normalized to `http`. | `url` |
| `sse` | Remote server using the legacy HTTP+SSE transport, "deprecated in the MCP specification but still supported for backwards compatibility" | `url` |

Sources: [CLI command reference — Transport types](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers).

Other documented fields:

- **Local servers:** `tools`, `env` (supports `$VAR`, `${VAR}` and `${VAR:-default}`), `cwd`, `timeout` (default `30000` ms), `deferTools` (`"auto"` or `"never"`), `disableToolCache` and `slowConnectionThresholdMs`.
- **Remote servers:** additionally `headers` (supports variable expansion), `oauthClientId`, `oauthScopes`, `oauthPublicClient`, `oauthGrantType` (`"authorization_code"` or `"client_credentials"` for headless CI) and `oidc`.
- **Both:** `filterMapping` (`none`, `markdown`, or the default `hidden_characters`) controls how tool output is processed.

Source: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

Local servers in the sandbox: when OS sandboxing is enabled (experimental; see R4), local stdio servers run inside the sandbox and show `connected (sandboxed)`. Remote servers are never sandboxed ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

**User configuration file** (the format project files also accept):

```jsonc
// Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers | Provenance: verbatim (reformatted)
// File: ~/.copilot/mcp-config.json
{
  "mcpServers": {
    "playwright": {
      "type": "local",
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {},
      "tools": ["*"]
    },
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR-API-KEY"
      },
      "tools": ["*"]
    }
  }
}
```
> - Source: [Adding MCP servers for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) | Provenance: verbatim

Project-level files can also use a "bare" top-level format, in which each top-level key is a server name and there is no `mcpServers` wrapper ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)).

**Shared repository file that keeps secrets out of Git:**

```jsonc
// Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference | Provenance: adapted
// File: .github/mcp.json (committed). Values come from each developer's shell environment.
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "tools": ["*"]
    },
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      },
      "tools": ["*"]
    }
  }
}
```
> - Source: [CLI command reference — Local/Remote server configuration fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) (`${VAR}` expansion; `headers` "Supports variable expansion"), [Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) (server definitions) | Provenance: adapted

### 6.4 Adding and managing servers

```shell
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers | Provenance: verbatim
# Local stdio server (writes to ~/.copilot/mcp-config.json)
copilot mcp add context7 -- npx -y @upstash/context7-mcp

# Local server with an environment variable
copilot mcp add github --env GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_GITHUB_PAT -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server

# Remote HTTP server
copilot mcp add --transport http notion \
  https://mcp.notion.com/mcp

# Inspect and toggle from the terminal
copilot mcp list
copilot mcp get SERVER-NAME
copilot mcp disable SERVER-NAME
copilot mcp enable SERVER-NAME
copilot mcp remove SERVER-NAME
```
> - Source: [Adding MCP servers for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) | Provenance: verbatim (lines collected from several snippets on the same page)

- **`copilot mcp add` options:** `--transport` (`stdio`, `http` or `sse`; default `stdio`), `--env KEY=VALUE`, `--header "HEADER: VALUE"`, `--tools` (`"*"`, a comma-separated list, or `""` for none), `--timeout`, `--json` and `--show-secrets` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **`copilot mcp list`** shows servers grouped by source: user, workspace, plugin and built-in. The built-in `github-mcp-server` appears there once you are signed in, starting with CLI 1.0.87 on 2026-09-21 ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)).
- **Interactive form.** `/mcp add` opens a form. Choose **Local/STDIO** or **HTTP/SSE**, then enter a command or URL, environment variables or headers, and a tools filter. Press <kbd>Ctrl</kbd>+<kbd>S</kbd> to save. "The MCP server is added and available immediately without restarting the CLI." ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)).
- **Other `/mcp` subcommands:** `config`, `list`/`ls`, `show [NAME]`, `edit`, `delete`, `disable`, `enable`, `auth` (a fresh OAuth flow for servers in `needs-auth` state), `reload` and `search` (experimental). Read-only subcommands work while the agent is busy; subcommands that change state wait until the current turn finishes ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

### 6.5 Environment variables, secrets and authentication

- **Local servers do not see your whole shell environment.** For servers added with `/mcp add`: "The `PATH` variable is automatically inherited from your environment. All other environment variables must be configured here." ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)). Pass values in through `env`. It accepts `$VAR`, `${VAR}` and `${VAR:-default}`, so a committed file can reference a secret that lives in each developer's shell rather than in Git ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Secret storage.** The CLI keeps MCP OAuth tokens and secret placeholders in the system keychain. If no keychain is available, it falls back to `~/.copilot/mcp-oauth-config/` and `~/.copilot/mcp-secrets/` ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).
- **Redaction.** `--secret-env-vars=VAR` redacts a variable "from shell and MCP server environments". The values of `GITHUB_TOKEN` and `COPILOT_GITHUB_TOKEN` are redacted from output by default. GitHub warns that "`--show-secrets` can print sensitive environment variable and header values to your terminal or logs." ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **OAuth.** Remote servers can use browser-based OAuth (`/mcp auth <server-name>`). For CI, use headless `client_credentials` with `oauthClientId` and `oauthPublicClient: false`; the client secret is stored in the keychain. You can also inject OIDC tokens with `oidc: true` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Cloud-agent secret syntax is different.** The `${{ secrets.NAME }}` and `${{ vars.NAME }}` placeholders documented for custom-agent `mcp-servers` resolve from **Agents secrets and variables** on GitHub, a feature of Copilot cloud agent ([Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)). How they resolve in a local CLI session is not documented; see Research Limitations.

### 6.6 The built-in GitHub MCP server and its toolsets

> "The GitHub MCP server comes pre-installed in Copilot CLI, with read-only tools enabled by default."
> - Source: [github/github-mcp-server — Install GitHub MCP Server in Copilot CLI](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md)

The GA announcement says the same thing: "Copilot CLI ships with GitHub’s MCP server built in and supports custom MCP servers for connecting to any tool or service." ([GitHub Changelog, 2026-02-25](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)). The project README adds that it "ships with GitHub's MCP server by default" ([github/copilot-cli README](https://github.com/github/copilot-cli)).

The CLI command reference says that "The `github-mcp-server` provides the following tools":

- **Repository files:** `get_file_contents`, `search_code`
- **Issues:** `list_issues`, `issue_read`, `search_issues`
- **Pull requests:** `get_pull_request`, `list_pull_requests`, `get_pull_request_files`
- **Commits:** `list_commits`, `get_commit`
- **GitHub Actions:** `list_workflow_runs`, `get_workflow_run_logs`
- **Labels:** `get_label`, `list_label`, `label_write`

([CLI command reference — Built-in MCP servers](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

> ⚠️ **Not a verified default inventory.** The reference does not label this list as the default-enabled subset, and the sources do not agree:
> - The github-mcp-server guide says "read-only tools enabled by default".
> - The list above includes `label_write`, whose name indicates a write operation.
>
> Neither source gives a version-specific, authoritative list of what is enabled at startup. Do not present this list as the safe default. Inspect the actual inventory in the rehearsed CLI version with `/mcp show github-mcp-server` or `copilot mcp get github-mcp-server`. Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [install-copilot-cli.md](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md); [Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers).

These flags change which GitHub MCP tools are enabled. The wording is quoted, because the sources conflict on whether the add flags *add to* or *replace* the default subset (see the note after the table):

| Flag | Official description (CLI command reference) |
|---|---|
| `--add-github-mcp-toolset=TOOLSET` | "Add a toolset to enable for the GitHub MCP server, instead of the default CLI subset (can be used multiple times). Use `all` for all toolsets." |
| `--add-github-mcp-tool=TOOL` | "Add a tool to enable for the GitHub MCP server, instead of the default CLI subset (can be used multiple times). Use `*` for all tools." |
| `--enable-all-github-mcp-tools` | "Enable all GitHub MCP server tools, instead of the default CLI subset. Overrides the `--add-github-mcp-toolset` and `--add-github-mcp-tool` options." |
| `--disable-builtin-mcps` | "Disable all built-in MCP servers (currently: `github-mcp-server`)." |
| `--disable-mcp-server=SERVER-NAME` | "Disable a specific MCP server (can be used multiple times)." Pass `github-mcp-server` as the name to turn off only this server. |

Source: [CLI command reference — Command-line options](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

> ⚠️ **Additive vs. replacement — unresolved.** Two official sources describe the add flags differently:
> - **Command reference:** "instead of the default CLI subset", which reads as *replacing* the default.
> - **github-mcp-server CLI guide:** labels the same commands "Enable an additional toolset" and "Enable multiple additional toolsets", which reads as *adding* to the default.
>
> Neither source is version-specific, and this research did not run the CLI. Treat the semantics as unsettled. Before a demo that uses these flags, compare `/mcp show github-mcp-server` in a default session and in a flagged session. If the flagged session lost tools you rely on, add those toolsets explicitly. Sources: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [install-copilot-cli.md](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md).

```shell
# Source: https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md | Provenance: verbatim
# Enable an additional toolset
copilot --add-github-mcp-toolset discussions

# Enable multiple additional toolsets
copilot --add-github-mcp-toolset discussions --add-github-mcp-toolset stargazers

# Enable all toolsets
copilot --enable-all-github-mcp-tools

# Enable a specific tool
copilot --add-github-mcp-tool list_discussions

# Disable the built-in server entirely
copilot --disable-builtin-mcps
```
> - Source: [github/github-mcp-server — Install GitHub MCP Server in Copilot CLI](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md) | Provenance: verbatim. The "additional" wording in the comments belongs to this guide; the command reference describes the same flags as "instead of the default CLI subset" (see the note above).

- **Available toolsets.** The server's README lists `context`, `actions`, `code_quality`, `code_security`, `copilot`, `dependabot`, `discussions`, `gists`, `git`, `issues`, `labels`, `notifications`, `orgs`, `projects`, `pull_requests`, `repos`, `secret_protection`, `security_advisories`, `stargazers` and `users`, among others. When the server runs on its own, its default set is `context`, `repos`, `issues`, `pull_requests` and `users`. The README explains why to keep the set small: "Enabling only the toolsets that you need can help the LLM with tool choice and reduce the context size." ([github/github-mcp-server README](https://github.com/github/github-mcp-server/blob/main/README.md)).
- **Replacing the built-in server.** If you name your own server `github-mcp-server`, it replaces the built-in one; any other name runs alongside it ([install-copilot-cli.md](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md)).
- **What subagents see.** The built-in `explore` subagent "has read-only access to GitHub MCP server tools" ([About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)).

### 6.7 Session-level MCP control (per run, CI-friendly)

| Option | Purpose |
|---|---|
| `--additional-mcp-config=JSON` or `=@path` | "Add an MCP server for this session only." Augments `~/.copilot/mcp-config.json` and overrides any installed server with the same name. A relative `@file` path resolves against the session working directory. |
| `--disable-mcp-server=NAME` / `--enable-mcp-server=NAME` | Disable a server, or re-enable a server disabled in settings, for this session only |
| `--allow-all-mcp-server-instructions` | Put every MCP server's initialization instructions in the system prompt. By default only allowlisted servers' instructions are included up front. |
| `GITHUB_COPILOT_PROMPT_MODE_WORKSPACE_MCP=true` | Load workspace MCP servers in `-p` mode |
| `COPILOT_MCP_TOOL_CACHE=false` | Disable cached tool snapshots for local servers |

Source: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

```shell
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference | Provenance: synthesized (template)
# Shell: Bash (uses set -euo pipefail). Prerequisites: Copilot CLI installed and authenticated (copilot login or
# COPILOT_GITHUB_TOKEN); a real MCP endpoint in place of mcp.example.com; DOCS_MCP_TOKEN exported; ./ci-mcp.json contains:
#   {"mcpServers":{"docs-search":{"type":"http","url":"https://mcp.example.com/mcp",
#     "headers":{"X-API-Key":"${DOCS_MCP_TOKEN}"},"tools":["search_docs"]}}}
set -euo pipefail
copilot --additional-mcp-config @./ci-mcp.json \
  --disable-mcp-server context7 \
  --allow-tool='docs-search' \
  -p "Use the docs-search server to find the deprecation policy and summarize it in five bullets" \
  || { echo "copilot run failed" >&2; exit 1; }
```
> - Source: [CLI command reference — Command-line options and Tool permission patterns](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: synthesized. The file uses the `mcpServers` wrapper of `mcp-config.json`; that shape is an assumption (see Limitations). `--allow-tool='SERVER-NAME'` uses the documented MCP permission pattern; R4 covers permissions.

### 6.8 Tool naming, trust levels and context cost

- **Tool names.** The server name becomes a prefix on each tool name (for example `my-server-fetch`). Names are sanitized and the combined name is capped at 64 characters ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Trust levels.** The command reference assigns each source a trust level: built-in *High*; `.github/mcp.json` and `.mcp.json` *Medium* (review recommended); user config *User-defined*; remote servers *Low*. It then states: "All MCP tool invocations require explicit permission. This applies even to read-only operations on external services." ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Tool search.** Tool search defers loading MCP tool definitions. Its motivation, in GitHub's words: "A few dozen tool definitions can eat 10–20K tokens before the agent has done any work." It switches on only when it pays off: "Below roughly 30 tools, the savings you get from tool search aren't worth it, so Copilot CLI skips tool search entirely and just loads everything." Set `deferTools: "never"` to keep one server's tools always loaded, or `toolSearch: false` to turn tool search off. A custom agent that names its tools has them loaded immediately unless its frontmatter sets `deferred-tool-loading: true` ([Loading tools on demand with tool search](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/tool-search)).
- **stdio servers must keep stdout clean.** "Write all diagnostic output to **stderr**, not stdout." ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

### 6.9 Agent-level MCP servers (`mcp-servers` frontmatter)

A custom agent can declare its own `mcp-servers`. The field "Uses the same schema as `~/.copilot/mcp-config.json`" ([CLI command reference — Custom agent frontmatter fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). The plugin reference describes the scoping:

> "An agent bundled inside a plugin can declare its own `mcp-servers` in its frontmatter, scoping an MCP server to just that agent instead of exposing it through the plugin's shared `mcpServers` configuration."
> - Source: [GitHub Copilot CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)

```markdown
---
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference | Provenance: verbatim
name: Plugin Linter
description: Runs the plugin's bundled linter via its own MCP server
mcp-servers:
    plugin-linter:
        command: node
        args: ["${PLUGIN_ROOT}/tools/serve.js"]
        tools: ["*"]
---

You are a linting specialist for this plugin's bundled rules.
```
> - Source: [GitHub Copilot CLI plugin reference — Plugin-shipped agent MCP servers](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference) | Provenance: verbatim

`${PLUGIN_ROOT}` expansion applies only to agents shipped inside a plugin. Workspace and user agents have no plugin root, so their frontmatter is left unchanged ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)). R2 covers the full frontmatter, including how `tools` filters MCP tools by name (for example `server/*`).

---

## 7. What Subagents Inherit vs. Isolate

This is the most important composition topic for an audience new to multi-agent setups. Every subagent gets its **own context window**, which is the point of using one ([Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)). How much of the stack it also receives depends on the agent type.

### 7.1 Repository instructions

> "A custom agent spawned as a subagent—through the `task` tool or the SDK's `session.startSubagent`—doesn't receive repository instruction files (`copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`) by default. Set `include-custom-instructions: true` in its frontmatter to opt in"
> - Source: [GitHub Copilot CLI command reference — Repository custom instructions for subagents](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

| Agent | Receives repository instructions (official table) |
|---|---|
| Session agent: the default agent, or a custom agent selected with `--agent` | Yes |
| `general-purpose` subagent | Yes |
| Built-in `explore`, `task` and `code-review` subagents | No |
| Custom agent spawned as a subagent | Only with `include-custom-instructions: true` |

Source: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference). The same section adds three caveats:

- An opted-in subagent still does **not** inherit extra directories loaded only for the main session through `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`.
- `--no-custom-instructions` "always takes priority" and overrides the opt-in.
- Opt in only for agents that review or edit code, because repository instructions make every run larger, slower and more expensive.

The how-to guide gives the reasoning ("This keeps the subagent focused on the specific task it was given") and adds:

> "This setting only affects the agent when it runs as a subagent. A custom agent that you select yourself—with `--agent`, `/agent`, or by inference—already follows your repository's custom instructions, so the setting has no effect in that case."
> - Source: [Creating and using custom agents for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)

### 7.2 Inheritance matrix

| Capability | Main (session) agent | `general-purpose` | `explore` | `task` | `code-review` | Custom agent as subagent |
|---|---|---|---|---|---|---|
| Context window | Session window | Own | Own | Own | Own | Own |
| Repository instructions | Yes | Yes | No | No | No | Opt-in (`include-custom-instructions`) |
| User-level and `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` instructions | Yes | Not documented | Not documented | Not documented | Not documented | Extra dirs: **No**; user-level file: not documented |
| Built-in tools | All, subject to permissions | "all of the same capabilities as the main Copilot agent" | Code intelligence, grep, glob, view, shell; does not change files | "all of the tools the parent agent can use (excluding some …), with the same permissions" | Does not modify files | `tools` list; default `["*"]` (all) |
| Session MCP tools (built-in, user, workspace, plugin, `--additional-mcp-config`) | Yes | Same as main (per capabilities statement) | Read-only GitHub MCP tools | As parent, minus excluded tools | Not documented | "all available tools, including built-in tools, and MCP server tools" by default; filtered by `tools` |
| Agent-scoped MCP (`mcp-servers`) | n/a | n/a | n/a | n/a | n/a | Yes, only for that agent |
| Skills | Auto or `/skill-name` | Not documented | Not documented | Not documented | Not documented | Not documented for `.agent.md`. In the SDK, sub-agents "do not inherit skills from the parent". |
| Model | Session model | Built-in default (R1) | Built-in default (R1) | Built-in default (R1) | Built-in default (R1) | `model`; if unset, inherits the outer agent's model (R2) |
| Memory writes | Yes (root only) | No (read only) | No | No | No | No |

Sources:

- Built-in agent capabilities: [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)
- Instruction rows, `tools` default, model fallback and memory: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
- Agent-scoped MCP: [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
- SDK skills behavior: [Custom agents and sub-agent orchestration (Copilot SDK)](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)

Two quotes back up the tool and memory rows:

> "By default, agents can access all available tools, including built-in tools, and MCP server tools."
> - Source: [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)

> "Only the root agent can call `store_memory` or `vote_memory` to save or vote on a memory. Subagents keep read access to stored memories through `read_memories`, but can't write or vote on them."
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

The SDK documentation describes the same runtime from a programmatic angle. "When `tools` is `null` or omitted, the agent inherits access to all tools configured on the session", and skills there are "**opt-in**: agents receive no skills by default, and sub-agents do not inherit skills from the parent" ([Custom agents and sub-agent orchestration](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)). The SDK has a per-agent `skills` property; the CLI's documented `.agent.md` frontmatter has no `skills` field. Do not assume the SDK's skills rule carries over to CLI custom agents unchanged; check it in a demo (see 8.4).

**Isolation levers available to you:**

- Shrink a subagent's tool surface with `tools`. The narrowest example is a read-only reviewer limited to `view`, `grep` and `glob` ([Comparing customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)).
- Give one agent its own MCP server with `mcp-servers`.
- Keep instructions out of subagents by leaving `include-custom-instructions` off. That is the default.

Permissions, approvals and hooks such as `subagentStop` belong to **R4**. Model and effort selection for subagents belongs to **R1/R2**.

---

## 8. Practical Guidance: Composing a Multi-Agent Setup

### 8.1 Decision table: instruction vs. skill vs. custom agent vs. MCP vs. plugin

| If you need… | Use | When it loads | Effect on context | Where it lives | How to share it |
|---|---|---|---|---|---|
| Conventions that apply to almost every task (build/test commands, style) | **Custom instructions** | Session start; added to every prompt | Always present in the main agent. Subagents receive them only per §7. | `AGENTS.md`, `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `~/.copilot/…` | Commit to the repository |
| A repeatable procedure needed only sometimes, optionally with scripts | **Skill** | When Copilot judges it relevant, or on `/skill-name` | Full `SKILL.md` injected only when used | `.github/skills/<name>/SKILL.md`, `~/.copilot/skills/…` | Commit, `copilot skill add`, or a plugin |
| A specialist persona for the whole session (its own prompt, tool limits, model) | **Custom agent selected as the session agent** | `/agent`, or `--agent` at launch | Runs in the **session's** context window; no isolation; repository instructions apply | `.github/agents/*.agent.md`, `~/.copilot/agents/` (R2) | Commit or a plugin |
| A specialist that does a delegated piece of work in isolation (limited tools, own model, agent-only MCP) | **Custom agent delegated as a subagent** | The main agent dispatches it through the `task` tool when it delegates a subtask | **Separate** context window; the main agent receives the result; repository instructions only with `include-custom-instructions: true` | Same files | Commit or a plugin |
| Access to an external system or live data | **MCP server** | Session start; tools may be deferred by tool search | Tool definitions, unless deferred | User, workspace, plugin, session or agent level (§6) | `.github/mcp.json`, a plugin, or `--additional-mcp-config` |
| Distributing a bundle of the above across repositories or teams | **Plugin** | Install or `enabledPlugins` | Whatever its components add | Marketplace, repository or local path | Marketplace or `enabledPlugins` |
| Deterministic enforcement at lifecycle events | **Hook** | Configured events | n/a | `.github/hooks/*.json`, `~/.copilot/settings.json` | **R4** |

Sources:

- Requirement-to-option mapping: [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)
- Instructions versus skills: [Adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)
- Plugin scope, sharing and versioning: [About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins)
- Trigger and "best for" columns: [Copilot customization cheat sheet](https://docs.github.com/en/copilot/reference/customization-cheat-sheet)
- Session-agent versus delegated subagent rows: [CLI command reference — Repository custom instructions for subagents](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) and [Creating and using custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli). The command reference counts "a custom agent selected with `--agent`" as the session agent and says custom subagents are spawned "through the `task` tool". The how-to separates agents you select yourself from agents that Copilot "runs … as a subagent".
- Caveat: the how-to also groups agents chosen "by inference" with agents you select yourself. It does not say whether an inferred agent runs in the session context or as a subagent; see Research Limitations.

GitHub's own one-line summary is in the comparison page's table. A few of its rows:

- "I want Copilot to always follow our repository conventions" → **Custom instructions**
- "I need Copilot to be able to use tools provided by an external service" → **MCP servers**
- "When working on particular tasks, I want Copilot to operate as a specialist with a constrained toolset" → **Custom agent**
- "I want to add a package of functionality to Copilot CLI without configuring it manually myself" → **Plugin**

([Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)).

### 8.2 Reference repository layout for an orchestrator plus specialists

```text
# Source: synthesized from the add-custom-instructions, add-skills, add-mcp-servers, create-custom-agents-for-cli and cli-config-dir-reference pages | Provenance: synthesized
my-repo/
├── AGENTS.md                              # agent instructions: main agent, general-purpose, opted-in custom agents
├── .mcp.json                              # per-checkout MCP servers (wins over .github/mcp.json in the same dir)
└── .github/
    ├── copilot-instructions.md            # repository-wide instructions
    ├── instructions/
    │   └── api.instructions.md            # path-specific (applyTo: "src/api/**")
    ├── skills/
    │   └── release-notes/SKILL.md         # on-demand procedure (template + steps)
    ├── agents/
    │   ├── implementer.agent.md           # edits code; include-custom-instructions: true
    │   └── repo-reviewer.agent.md         # read/search-only local tools + allowlisted catalog MCP tools; include-custom-instructions: true
    ├── mcp.json                           # shared MCP servers (secrets via ${VAR})
    └── copilot/
        └── settings.json                  # enabledPlugins / extraKnownMarketplaces / disabledMcpServers
```
> - Source: [Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions), [Adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills), [Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers), [Creating and using custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli), [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) | Provenance: synthesized

### 8.3 Example: a reviewer with read-only local tools, repository instructions and an agent-scoped MCP server

```markdown
---
# Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference | Provenance: synthesized (template; not runnable until the catalog server, its tool names and CATALOG_TOKEN are real)
# File: .github/agents/repo-reviewer.agent.md. Requires CATALOG_TOKEN (a read-only credential) exported in the developer's shell.
name: repo-reviewer
description: Reviewer that does not edit files. Checks a change against this repository's conventions and the internal API catalog. Use when asked to review or audit a change.
tools: ["view", "grep", "glob", "api-catalog/get_api", "api-catalog/list_deprecations"]
include-custom-instructions: true
mcp-servers:
  api-catalog:
    type: http
    url: https://catalog.example.com/mcp
    headers:
      X-API-Key: "${CATALOG_TOKEN}"
    tools: ["get_api", "list_deprecations"]
---

Review the change and flag anything that violates the repository's conventions
or uses an API that the api-catalog server reports as deprecated. Do not edit files.
Report findings as a numbered list with file path, line, severity and suggested fix.
```
> - Source: [CLI command reference — Custom agent frontmatter fields, Repository custom instructions for subagents, Remote server configuration fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) (server-level `tools` accepts "a list of specific tool names"); [Custom agents configuration — Tools](https://docs.github.com/en/copilot/reference/custom-agents-configuration) (`server-name/tool-name` prefixing in an agent's `tools`); [Creating and using custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) (the `include-custom-instructions` pattern); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) (1.0.89: "server/tool and server/\* tool filters now match MCP tool names that contain a slash") | Provenance: synthesized. `view`, `grep` and `glob` are documented CLI tool names. `get_api` and `list_deprecations` are illustrative names. R2 covers frontmatter semantics.

**How read-only is this agent?** Only conditionally:

- **Local side.** The built-in tools are limited to reading and searching (`view`, `grep`, `glob`).
- **External side.** Catalog access is read-only *only if* the two allowlisted tools are read operations on your catalog server *and* `CATALOG_TOKEN` carries read-only rights. The CLI cannot enforce this.
- **Why no wildcard.** The example deliberately avoids `api-catalog/*` and server `tools: ["*"]`. GitHub documents that `server/*` enables every tool from that server ([Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)). The SDK guide recommends explicit tool lists "to enforce the principle of least privilege" ([Custom agents and sub-agent orchestration](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)).
- **Approvals.** MCP tool calls still require approval under the CLI permission model (R4).

How this composes:

- The orchestrator (the main agent) sees repository instructions plus all session MCP tools.
- When it delegates a review, the subagent gets:
  - a fresh context
  - the repository instructions (because it opted in)
  - read/search-only built-in tools
  - two allowlisted tools from an MCP server that no other agent sees

  It is read-only end-to-end only under the catalog conditions stated above.
- Changes are not all picked up live:
  - Edited instruction files take effect only after you resume the session or start a new one ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)).
  - A newly created custom agent needs a CLI restart ([Creating and using custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)).
  - Servers added through `/mcp add` are "available immediately without restarting the CLI" ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)).
  - After hand-editing an MCP configuration file, the github-mcp-server guide says to restart the CLI ([install-copilot-cli.md](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md)). A `/mcp reload` subcommand also exists, but its exact scope is not documented ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

### 8.4 Demo-able checks (suggested demo breaks)

Each demo below uses documented commands. The outcomes listed are what the documentation predicts; confirm them during rehearsal.

**Rehearsal prerequisites (checklist):**

- [ ] **Sign-in.** Copilot CLI is installed and signed in, via `copilot login` or a supported token in `COPILOT_GITHUB_TOKEN`, `GH_TOKEN` or `GITHUB_TOKEN` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- [ ] **Folder trust.** The demo repository has been trusted once interactively, so workspace MCP servers load ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)).
- [ ] **No placeholders left.** Every template value has been replaced: `example.com` endpoints, illustrative tool names, `${…}` secrets exported in the shell. All `//` annotation lines have been removed from strict-JSON files.
- [ ] **Fresh session.** You start a new session (`/new`) after editing instructions, or restart after adding agents ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions); [Creating and using custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)).
- [ ] **Recorded baseline.** You have captured `/mcp show github-mcp-server` output for the CLI version used on stage, because the default tool subset is not consistently documented (§6.6).

1. **"What did the CLI load?"** Run `/env`. It shows loaded instructions, MCP servers, skills, agents, hooks, plugins, LSPs and extensions. Compare its output before and after you trust the folder; workspace MCP servers should appear only after trust. Pair it with `copilot instruction list --json`, `copilot mcp list --json` and `copilot skill list --json` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)).
2. **Instruction isolation.**
   - Put an easily observable rule in `AGENTS.md`.
   - Delegate a task to a custom agent without `include-custom-instructions`, then repeat with it set to `true`.
   - Watch the subagents in `/tasks` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
3. **GitHub MCP toolsets.**
   - Start `copilot --add-github-mcp-toolset discussions`, then compare `/mcp show github-mcp-server` with a default session ([install-copilot-cli.md](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md)).
   - Also note whether the default tools are still present in the flagged session. The documentation conflicts on whether the flag adds to the default subset or replaces it (§6.6).
4. **Plugin in one command.**
   - Run `copilot plugin install <plugin>@awesome-copilot`.
   - Show its components with `/plugin`, `/skills list` and `/agent`.
   - Show that a project skill with the same name still wins ([Finding and installing plugins](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing); [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)).
5. **Session-only MCP.** Run with `--additional-mcp-config @file` and show the server in `/mcp list`. Then show it is absent from `~/.copilot/mcp-config.json` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

---

## 9. Configuration, Best Practices, and Pitfalls

### 9.1 Settings files that affect the stack

Settings are applied in this order, with later sources overriding earlier ones:

1. Built-in defaults
2. MDM (device-managed) settings
3. `~/.copilot/settings.json`
4. `.github/copilot/settings.json`
5. `.github/copilot/settings.local.json`
6. Environment variables
7. Command-line flags

([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)). At repository level, only a fixed list of keys is honored. The ones relevant here are `enabledPlugins`, `extraKnownMarketplaces`, `disabledMcpServers` and `disabledSkills` (repository can only add entries), and `hooks`:

> "Only the keys listed in the following table are supported at the repository level. Any other keys—including keys that are valid in the user configuration file—are silently ignored."
> - Source: [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)

### 9.2 Best practices (sourced)

- **Keep instructions short and avoid conflicts.** Because the CLI merges all instruction files without a precedence order, contradictory files cause confusion ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions); [Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).
- **Move occasional, detailed procedures into skills.** This keeps the always-on context small ([Adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)).
- **Opt in to repository instructions selectively.** Set `include-custom-instructions: true` only on subagents that edit or review code; leave it off for search or summarization agents to save cost and latency ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Commit shared MCP servers, keep personal ones local.** Commit shared servers in `.github/mcp.json` and reference secrets as `${VAR}`. Keep per-checkout or personal servers in `.mcp.json` or the user config ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Enable only the tools you need.** Use `--tools` or `"tools": ["tool-a", "tool-b"]` on servers and choose GitHub MCP toolsets deliberately. The github-mcp-server README notes this improves tool choice and context size ([github/github-mcp-server README](https://github.com/github/github-mcp-server/blob/main/README.md)).
- **Prefer Agent Plugins 1.0 for new plugins.** Pin marketplace sources to a full `sha` for reproducible installs ([About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins); [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)).
- **Enable plugins per repository.** Use repository `enabledPlugins` so a plugin activates only where it is needed ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).

### 9.3 Pitfalls

| Pitfall | What happens | Fix |
|---|---|---|
| Expecting `AGENTS.md` rules to bind every subagent | `explore`, `task`, `code-review` and custom subagents run without repository instructions by default | Set `include-custom-instructions: true` on custom agents that need them; put critical rules in the agent prompt ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)) |
| Using `.vscode/mcp.json` | The CLI does not read it | Migrate to `.mcp.json` with the documented `jq` command ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)) |
| Workspace MCP missing in `-p` or CI runs | Servers are skipped in untrusted directories | Trust the folder, or set `GITHUB_COPILOT_PROMPT_MODE_WORKSPACE_MCP=true` deliberately ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)) |
| A local server cannot see a variable from your shell | Only `PATH` is inherited | Declare it in `env` (for example `"API_KEY": "${API_KEY}"`) ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)) |
| `/mcp edit` on a repository server | Rejected, because saving would create a user entry that the workspace entry still shadows | Edit `.mcp.json` directly ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)) |
| A plugin silently "loses" to a local agent or skill | First-found-wins for agents and skills | Rename, or remove the local duplicate ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)) |
| A plugin silently replaces your MCP server | Last-wins for MCP servers | Rename the server, or override it with `--additional-mcp-config` ([CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)) |
| Edits to a local plugin are not picked up | Installed plugins are cached | Reinstall with `copilot plugin install ./my-plugin`, or use `--plugin-dir` ([Creating a plugin](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)) |
| A stdio server hangs during startup | Logs written to stdout corrupt the JSON-RPC stream | Log to stderr ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)) |
| Dozens of MCP tools crowd the context | Tool definitions consume tokens and degrade tool selection | Rely on tool search (supported models), trim `tools`, use `deferTools` ([Tool search](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/tool-search)) |
| Secrets leak into logs | `--show-secrets` prints environment and header values | Avoid it in shared terminals; use `--secret-env-vars` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)) |
| A skill pre-approves `shell` | Removes the confirmation prompt for terminal commands | Pre-approve only reviewed, trusted skills ([Adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)) |
| Instruction edits do not take effect | Instructions load at session start | Run `/new`, or resume the session ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)) |

---

## 10. Advanced Topics and Cross-References

- **Bring-your-own model providers.** "Built-in sub-agents (`/review`, `/task`, explore, `/fleet`) automatically inherit your provider configuration." ([Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)). Model selection is covered in R1/R2.
- **Agent coordination tools.** The two tools accept different `scope` values ([CLI command reference — Agent communication](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)):
  - **`list_agents`** accepts `siblings`, `children` or `all`. Omitting `scope` returns nearby agents in the current context.
  - **`write_agent`** scoped messaging accepts only `siblings` or `children`; `all` is not a messaging scope.
  - Scoped messaging is meant "only from a subagent running inside a parent session with shared sibling communication enabled"; in top-level sessions, target agents with explicit `agent_id` values.

  Orchestration patterns are covered in R1 and R5.
- **Custom agent locations and precedence.** User agents (`~/.copilot/agents/`) take priority over project `.github/agents/`, then `.claude/agents/`, added roots, plugins, and remote organization or enterprise agents. A plugin agent cannot override a user or project agent ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents)). R2 covers this in depth.
- **Cloud agent parity.** Custom agent profiles and `mcp-servers` also work in Copilot cloud agent. There, MCP configurations are processed in this order: "out-of-the-box MCP configurations (like the GitHub MCP) are processed first, followed by the custom agent MCP configuration, and finally MCP configurations specified through repository settings." Secrets come from Agents secrets ([Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)). R6 covers this lightly.
- **Organization and enterprise controls (R7 only).** These include the **MCP servers in Copilot** policy, which applies to Business and Enterprise; registry URL and allowlist enforcement, which fails closed; managed `allowedMcpServers`/`deniedMcpServers`; and plugin standards ([About MCP](https://docs.github.com/en/copilot/concepts/context/mcp); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).
- **Hooks, permissions, trusted folders and sandboxing (R4 only).** This includes MCP permission patterns such as `--allow-tool='MyMCP(create_issue)'` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

---

## 11. Research Limitations

**How the sources were read**

- **Undated docs.** GitHub Docs pages carry no publication date; all were read on 2026-10-05. The CLI shipped seven releases (1.0.85–1.0.91) between 2026-09-16 and 2026-10-01, so details may change soon after this date ([copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)). The repository landing page, crawled 2026-10-01, still showed 1.0.88 as the latest release, while `changelog.md` already listed 1.0.91 dated 2026-10-01. This looks like crawl lag ([github/copilot-cli](https://github.com/github/copilot-cli)).
- **Long reference pages read from source.** The rendered *CLI command reference* and *CLI configuration directory* pages were too large for the page readers on the first pass, so they were read from the Markdown source of the same articles in the public `github/docs` repository:
  - [`cli-command-reference.md` source](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-command-reference.md)
  - [`cli-config-dir-reference.md` source](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-config-dir-reference.md)

  Both files were read from the `main` branch on 2026-10-05; no commit permalink was captured. These files are *representations* of references 11 and 12, not extra logical sources, so the count of 32 stays the same. The source may be slightly ahead of the published site. The `include-custom-instructions` behavior was spot-checked on the published *Creating and using custom agents* page. The Round 1 independent review reports that the other major source-derived claims also appear on the published pages, including the GitHub MCP flag wording ("instead of the default CLI subset") and the agent-communication scope lists that this revision relies on.

**Conflicts between official sources**

1. **`@` imports with absolute paths.** The how-to guide says "Absolute paths and paths beginning with `~/` are not loaded" ([Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)). The command reference says "Paths can be relative to the instruction file's directory or absolute" ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). *Recommendation:* use relative paths inside the repository.
2. **Instruction discovery scope.** The how-to guide lists root, working directory, intermediate directories and directories along the path of files being worked on. The command reference table says "In Git root and cwd". The more detailed how-to description is preferred here.
3. **Built-in MCP servers.** The command reference lists `github-mcp-server`, `playwright`, `fetch` and `time` as built-in, yet describes `--disable-builtin-mcps` as "(currently: `github-mcp-server`)". The `enabledMcpServers` setting exists to "Enable built-in MCP servers that are disabled by default" ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)). The how-to and concept pages mention only the GitHub MCP server ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers); [About MCP](https://docs.github.com/en/copilot/concepts/context/mcp)). *Treat* `playwright`, `fetch` and `time` as unverified or opt-in, and check with `copilot mcp list` before a demo.
4. **GitHub MCP default subset and add-flag semantics.**
   - **Default subset.** The github-mcp-server guide says "read-only tools enabled by default" ([install-copilot-cli.md](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md)). The command reference lists the tools the server "provides", including `label_write`, but does not label that list as the default subset ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). The exact default subset could not be established.
   - **Add flags.** The command reference describes `--add-github-mcp-toolset` and `--add-github-mcp-tool` as enabling tools "instead of the default CLI subset". The github-mcp-server guide labels the same commands "Enable an additional toolset". Whether the flags add to or replace the default is unresolved. §6.6 flags this at the point of use and recommends inspecting the inventory during rehearsal.
5. **`tools` field required?** The command reference marks `tools` as required for both local and remote servers. The project-level examples in the how-to omit it ([Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)). The examples in this report include `"tools"` explicitly.
6. **Skill `name` rules.** The how-to asks for lowercase, hyphenated names. The reference accepts letters, numbers, hyphens, underscores, dots, colons and spaces (maximum 64 characters). Follow the stricter how-to convention.
7. **Subagent limits (R1 scope).** The command reference's environment-variable table gives `COPILOT_SUBAGENT_MAX_DEPTH` a default of `4` (range 1–128) and `COPILOT_SUBAGENT_MAX_CONCURRENT` a default of `32` (range 1–256). Its "Subagent limits" table gives a depth default of `6` (maximum 256) and a plan-based concurrency limit capped at `32`. Flagged for R1.
8. **`infer` status (R2 scope).** The CLI command reference and the comparison page still document `infer`. The *Custom agents configuration* reference marks it "**Retired**" in favor of `disable-model-invocation` and `user-invocable` ([Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)). Flagged for R2.

**Evidence gaps**

- **Session agent vs. subagent when an agent is inferred or requested in a prompt.** The custom-agents how-to treats an agent chosen "by inference" like one you select yourself, saying it "already follows your repository's custom instructions". It lists naming an agent in a prompt ("explicit instruction") as a separate method. The command reference, by contrast, defines the session agent as "the default agent, or a custom agent selected with `--agent`". Neither page says whether an inferred or prompt-requested custom agent runs in the session context or as a delegated subagent ([Creating and using custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). For demos, use `/agent` or `--agent` to show session selection, and an explicit delegation request with `/tasks` open to show subagent isolation.
- **Skills in CLI subagents.** No CLI page says whether custom or built-in subagents can see or invoke skills. The SDK says sub-agents do not inherit skills ([Copilot SDK custom agents](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)). Verify behavior in a demo.
- **Other instruction types in subagents.** Whether subagents receive user-level (`~/.copilot/copilot-instructions.md`) or path-specific instructions is not documented. Only repository files (`copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`) and `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` are addressed.
- **Agent-level MCP precedence.** Where an agent's `mcp-servers` falls relative to user, workspace, plugin and session servers in the CLI is not documented. The cloud-agent processing order is documented but may not apply to the CLI.
- **Shape of `--additional-mcp-config` input.** The JSON format is not shown explicitly. This report assumes the `mcpServers` wrapper used by `mcp-config.json`.
- **Cloud-agent secret syntax in the CLI.** How `${{ secrets.* }}` and `${{ vars.* }}` resolve in a local CLI session is not documented. These placeholders are documented only for Agents secrets in Copilot cloud agent.
- **`--mcp-github-auth`.** Appears only in the 1.0.90 changelog entry; it was not found in the command reference read for this report.

**Scope and exclusions**

- Frontmatter depth belongs to R2; permissions, hooks and sandboxing to R4; organization and enterprise MCP and plugin policy to R7; usage costs to R8. These are cross-referenced only.
- VS Code `.vscode/mcp.json` appears only as a migration note.
- Third-party blog and news results surfaced during discovery (for example Japanese-language summaries on note.com) were **not used**, because official sources covered every claim.

---

## 12. Complete Reference List

### Documentation and Articles

**GitHub Docs (docs.github.com)**

1. [Adding MCP servers for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)
2. [Overview of customizing GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview)
3. [Adding custom instructions for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)
4. [Adding agent skills for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)
5. [Finding and installing plugins for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing)
6. [Creating a plugin for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating)
7. [Creating a plugin marketplace for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace)
8. [About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins)
9. [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)
10. [GitHub Copilot CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
11. [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) — also read via its [github/docs Markdown source](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-command-reference.md) (same article; not a separate source)
12. [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) — also read via its [github/docs Markdown source](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-config-dir-reference.md) (same article; not a separate source)
13. [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
14. [About custom agents (Copilot CLI)](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)
15. [Creating and using custom agents for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)
16. [Invoking custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents)
17. [Custom agents and sub-agent orchestration (Copilot SDK)](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents)
18. [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp)
19. [About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
20. [Copilot customization cheat sheet](https://docs.github.com/en/copilot/reference/customization-cheat-sheet)
21. [Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)
22. [Loading tools on demand with tool search](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/tool-search)

**GitHub Changelog (github.blog)**

23. [GitHub Copilot CLI is now generally available (2026-02-25)](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)
24. [GitHub Copilot CLI: Enhanced agents, context management, and new ways to install (2026-01-14)](https://github.blog/changelog/2026-01-14-github-copilot-cli-enhanced-agents-context-management-and-new-ways-to-install/)
25. [GitHub Copilot now supports Agent Skills (2025-12-18)](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
26. [Agent Plugins 1.0 in VS Code, Copilot CLI, and the Copilot app (2026-08-12)](https://github.blog/changelog/2026-08-12-agent-plugins-1-0-in-vs-code-copilot-cli-and-the-copilot-app/)

### Primary Research or Standards

27. [Model Context Protocol — Architecture overview (protocol version 2026-07-28)](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture.md)

### GitHub Repositories

28. [github/copilot-cli (README)](https://github.com/github/copilot-cli)
29. [github/copilot-cli — changelog.md](https://github.com/github/copilot-cli/blob/main/changelog.md)
30. [github/github-mcp-server — README.md](https://github.com/github/github-mcp-server/blob/main/README.md)
31. [github/github-mcp-server — Install GitHub MCP Server in Copilot CLI](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md)

### Code Samples

32. [dotnet/runtime — `.github/copilot/settings.json`](https://github.com/dotnet/runtime/blob/main/.github/copilot/settings.json)
