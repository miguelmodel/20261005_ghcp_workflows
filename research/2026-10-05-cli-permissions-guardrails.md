# Research Report: Copilot CLI Permissions, Hooks and Guardrails

**Date:** 2026-10-05
**Researcher:** Copilot Web Researcher Agent
**Topic slug:** cli-permissions-guardrails
**Sources consulted:** 31 cited sources — 23 GitHub Docs pages (docs.github.com), 5 GitHub Blog posts (4 changelog entries and 1 engineering post on github.blog), 3 files in official GitHub repositories (1 in `github/copilot-cli`, 2 in `github/docs`); 0 third-party sources
**Required MCP:** verified - WebIQ-MCP; tools used: web, browse, news

> Assignment R4 of the brief "Subagents & Multi-Agent Orchestration with GitHub Copilot CLI". Scope boundaries: `.agent.md` keys in depth → R2; MCP configuration files → R3; `/fleet` and `/delegate` → R5; organization and enterprise policies → R7 (cross-referenced only).

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overview and Key Concepts](#2-overview-and-key-concepts)
3. [The Tool-Approval Model](#3-the-tool-approval-model)
4. [Allow/Deny Flags, Patterns, Paths and URLs](#4-allowdeny-flags-patterns-paths-and-urls)
5. [Allow-All, Autopilot and Non-Interactive Modes](#5-allow-all-autopilot-and-non-interactive-modes)
6. [Constraining Subagents](#6-constraining-subagents)
7. [Hooks as Policy](#7-hooks-as-policy)
8. [Human-in-the-Loop Checkpoints](#8-human-in-the-loop-checkpoints)
9. [Review-Based Guardrails](#9-review-based-guardrails)
10. [Security Considerations](#10-security-considerations)
11. [Configuration, Best Practices and Pitfalls](#11-configuration-best-practices-and-pitfalls)
12. [Research Limitations](#12-research-limitations)
13. [Complete Reference List](#13-complete-reference-list)

---

## 1. Executive Summary

GitHub Copilot CLI guards agent actions with several independent layers, and most of them also apply when work is delegated to subagents. Read-only actions run automatically. Shell commands that can change the system, file edits and URL access ask for approval by default. Approvals can last for one use, for the current session, or for a location saved to disk. Startup flags can narrow which tools the model sees (`--available-tools`, `--excluded-tools`) and which tools run without a prompt (`--allow-tool`, `--deny-tool`, `--allow-url`, `--deny-url`). In ordinary rule evaluation, deny rules beat allow rules, including `--allow-all` and saved approvals ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

> "Deny rules always take precedence over allow rules, even when `--allow-all` is set or a matching approval has been saved in `permissions-config.json`."
> - Source: [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

**Caveat on deny precedence.** The precedence statement above covers ordinary rule evaluation: flags, saved approvals and allow-all. A `permissionRequest` hook runs *before* that rule check. If the hook returns `allow` or `deny`, its decision short-circuits the normal permission flow. When several `permissionRequest` hooks run, later outputs override earlier ones. The docs don't say whether a hook's `allow` can override a `--deny-tool` rule. Until that's documented or tested, don't treat a deny flag as an absolute floor in a session that also loads `permissionRequest` hooks that return `allow` (§7.6) ([Hooks reference — permissionRequest decision control](https://docs.github.com/en/copilot/reference/hooks-reference)).

The main takeaways for practitioners:

- **Permissions are heuristic, not a sandbox.** GitHub says that scoping is heuristic and that it doesn't guarantee protection outside trusted directories. Path and URL detection inside shell commands also has documented gaps. For strong isolation, pair permissions with local sandboxing, which is experimental in the CLI, or cloud sandboxing, which is in public preview ([About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli); [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli); [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)).
- **Allow-all is a deliberate escape hatch.** `--allow-all` and `--yolo` combine `--allow-all-tools`, `--allow-all-paths` and `--allow-all-urls`. GitHub strongly recommends using these options only in isolated environments and never setting them through a shell alias. Autopilot mode works best with all permissions. If you continue with limited permissions instead, autopilot automatically denies anything that needs approval ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools); [Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).
- **Hooks are the programmable policy layer, not an unconditional floor.** The CLI supports 14 hook events. Of these, `preToolUse` can allow, deny, ask about or rewrite a tool call, and `permissionRequest` can short-circuit the permission service. The two aggregate decisions differently: for `preToolUse`, any `deny` blocks the call, while for `permissionRequest`, later hook outputs override earlier ones. `agentStop` and `subagentStop` can force a bounded number of extra turns, which is useful for retrying validation but doesn't make a hard completion gate. Command `preToolUse` hooks fail closed on crashes and non-zero exits, but every hook timeout fails open, including timeouts of admin-deployed policy hooks ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).
- **Subagents are constrained by the `tools` setting in their agent profile and by the parent session's permissions.** The built-in `task` agent gets the parent's tools with the parent's grants and denials. In plan mode, helper subagents can't edit project files either. `explore`, `code-review`, `security-review` and `rubber-duck` are read-only by design ([About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Review is built in, and stays advisory unless something outside the agent enforces it.** You can review changes with three commands: `/review` (code-review agent; listed in the CLI GA announcement, 2026-02-25), `/security-review` (public preview, experimental, announced 2026-06-10) and `/rubber-duck` (GA 2026-06-02). The rubber-duck agent uses a different model and is consulted automatically at the main agent's discretion. Creator↔reviewer loops built from custom agents, and stop hooks that force extra turns, improve quality but don't guarantee green tests or approved code. For a real merge gate, use required CI checks and human review of the pull request ([Rubber duck](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck); [Changelog 2026-06-02](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/); [Changelog 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).

## 2. Overview and Key Concepts

### 2.1 A control taxonomy (not a guaranteed isolation stack)

The table below groups the documented controls from outermost to innermost. The ordering is this report's synthesis, and each row is grounded in the cited source. The layers are **not** uniformly hard boundaries, so the "Enforcement type" column separates runtime and OS enforcement from heuristic and advisory controls.

| Layer | What it controls | Primary mechanism | Enforcement type | Source |
|---|---|---|---|---|
| 0. Where you launch | Which files the agent works on by default | Folder trust prompt; launch only from trusted folders | Runtime gate for loading configuration; scoping is heuristic | [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| 1. Tool visibility | Which tools the model knows about | `--available-tools`, `--excluded-tools`; per-agent `tools` list | Runtime: tools left out can't be called | [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) |
| 2. Permission rules | Which tool calls run without a prompt or are refused | `--allow-tool`/`--deny-tool`, `--allow-url`/`--deny-url`, path verification, saved approvals | Runtime, but path and URL detection inside shell commands is heuristic, and `permissionRequest` hooks run first (§7.6) | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli) |
| 3. Permission mode | How prompts are handled | `/permissions default\|assisted\|allow-all`, autopilot | Runtime; assisted mode adds an LLM recommendation | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| 4. Hooks | Programmable allow, deny, rewrite, audit and continue decisions | `.github/hooks/*.json`, `~/.copilot/hooks/`, policy hooks | Runtime, but timeouts fail open and a repository can turn off non-policy hooks | [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) |
| 5. OS sandbox | What shell commands and local servers can physically reach | `/sandbox enable`, `sandbox.*` settings | OS-level for spawned processes; built-in file tools check the policy only on a best-effort basis; experimental in the CLI | [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes) |
| 6. Human checkpoints | Plans, questions, diffs, rollback | Plan mode, `ask_user`, `/diff`, `/undo`/`/rewind` | Plan-mode edit blocking is enforced at runtime but "not an airtight lockdown"; the other checkpoints depend on the person | [Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices); [Roll back changes](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/roll-back-changes) |
| 7. Review agents | Second-opinion quality and security checks | `/review`, `/security-review`, `/rubber-duck`, custom reviewers | Advisory: findings must be acted on | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| 8. Organization policy (R7) | Machine-wide or account-wide floors | Policy hooks, `permissions.disableBypassPermissionsMode`, managed sandbox floor | Runtime; details in R7 | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |

GitHub's own comparison page explains why hooks hold a special place among these controls.

> "While skills and instructions guide Copilot's behavior through prompts, hooks ensure that operations you have defined will be performed at specific moments"
> - Source: [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)

### 2.2 Feature status (GA / preview / experimental)

Copilot CLI has been generally available since 2026-02-25. The newest CLI release recorded in the public changelog at research time was 1.0.91, dated 2026-10-01. The docs.github.com pages show no per-page update date, so the date given for them is the retrieval date, 2026-10-05 ([GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)).

**Lifecycle-label convention (binding brief decision).**

- A feature with an explicit GA or preview label in an official dated source carries that label and date.
- A feature with dated stable-release evidence but no explicit label is shown as **"shipped in CLI `<version>` (`<date>`); no separate status label"** and is never badged GA.
- A feature with no dated evidence stays out of labeled claims and demos and is listed in §12 instead.

CLI version dates come from the official [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md).

| Feature | Status | Source and date |
|---|---|---|
| Copilot CLI (product) | GA | [Changelog, 2026-02-25](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| Plan mode | Introduced 2026-01-21; listed in the CLI GA announcement (2026-02-25). The hard runtime block on workspace-modifying tool calls in plan mode shipped in CLI 1.0.71 (2026-07-16); no separate status label | [Changelog, 2026-01-21](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/); [GA changelog, 2026-02-25](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| `--allow-all` / `--yolo` flags; "approve for session" applies to pending parallel requests | Introduced 2026-01-21 | [Changelog, 2026-01-21](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/) |
| Path-scoped `--deny-tool='write(PATH)'` (blocks only that path) and rejection of malformed `--allow-tool`/`--deny-tool` patterns | Shipped in CLI 1.0.71 (2026-07-16); no separate status label | [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| `/review` (code-review agent) | Introduced 2026-01-21; listed in the CLI GA announcement (2026-02-25) | [Changelog, 2026-01-21](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/); [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| Autopilot mode | Listed in the CLI GA announcement (2026-02-25) | [GA changelog, 2026-02-25](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| Hooks as a capability (`preToolUse` can deny or modify; "Hooks for policy enforcement") | Listed in the CLI GA announcement (2026-02-25). The GA announcement doesn't certify individual events added later (see the next rows and §12) | [GA changelog, 2026-02-25](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) (retrieved 2026-10-05) |
| Hook behaviors used in this report's examples | `preToolUse` `matcher` honored: shipped in CLI 1.0.36 (2026-04-24). `preToolUse` hook errors deny the call: shipped in CLI 1.0.57 (2026-06-01). `preToolUse` exit code `2` denies: shipped in CLI 1.0.70 (2026-07-09). `agentStop` 8-block runaway guard and `stop_hook_active`: shipped in CLI 1.0.72 (2026-07-20). None has a separate status label | [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| Undo / rewind | Listed in the CLI GA announcement (2026-02-25). Rewind with the **Conversation + files** choice and no Git requirement shipped in CLI 1.0.78 (2026-08-03); no separate status label. It was earlier experimental in 1.0.63 (2026-06-15) | [GA changelog, 2026-02-25](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| Rubber-duck agent (`/rubber-duck`) | **GA (2026-06-02).** First shipped as experimental in CLI 1.0.49 (2026-05-18) and enabled by default in CLI 1.0.58 (2026-06-02) | [Changelog, 2026-06-02](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| `/security-review` and the `security-review` agent | **Public preview (experimental), announced 2026-06-10.** First shipped in CLI 1.0.51 (2026-05-20). Available to all users without `--experimental` since CLI 1.0.64 (2026-06-23). No later status change, such as GA, was found | [Changelog, 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) |
| Assisted / auto approval (`/allow-all auto`, now also `/permissions assisted`) | The auto allow-all mode, which auto-approves requests that an LLM judge evaluates as acceptable, shipped behind experimental mode in CLI 1.0.69 (2026-07-07). The same entry says it previously depended on an `AUTO_APPROVAL` env var or feature flag. `/permissions` for switching approval modes shipped in CLI 1.0.78 (2026-08-03). Enterprise allow-auto-only support shipped in CLI 1.0.79 (2026-08-10). Later behavior changes are in 1.0.90 (2026-09-30) and 1.0.91 (2026-10-01). No GA or preview label and no later change to its experimental gating were found, so no current lifecycle label is given | [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Local sandboxing in the CLI (`/sandbox`, `--sandbox`) | Experimental in the CLI; sandboxes overall are in public preview | [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes) (retrieved 2026-10-05) |
| Cloud sandboxing (`copilot --cloud`) | Experimental in the CLI; public preview | [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes) |

### 2.3 Terminology

- **Tool:** a capability the agent invokes, such as `bash`/`powershell`, `view`, `edit`, `create`, `grep`, `glob`, `web_fetch`, `task` (subagents) or an MCP tool ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Permission kind:** the category used in allow/deny patterns. The kinds are `shell`, `write`, `read`, `url`, `memory` and an MCP server name ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Trusted folder:** a directory where you confirmed you trust the files at session start. Trust gates the loading of repository-controlled configuration, such as workspace MCP servers and repository hooks in prompt mode ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Subagent:** a separate agent with its own context window that the main agent starts through the `task` tool. It can be a built-in agent or a custom agent ([Comparing CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)).

## 3. The Tool-Approval Model

### 3.1 Default behavior

Searching, reading files and running read-only shell commands are allowed automatically. Running destructive shell commands, editing files and accessing URLs need explicit approval, because a shell command "can do anything your user account can do" ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)). By default the CLI can access the current working directory, its subdirectories and the system temp directory. Every URL needs approval ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)). Every MCP tool invocation also needs explicit permission.

> "All MCP tool invocations require explicit permission. This applies even to read-only operations on external services."
> - Source: [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

Before execution, the CLI checks shell commands for dangerous patterns. The documented patterns are `rm -rf`, `sudo`, `chmod 777`, `curl` with sensitive paths, reads of `.env` or SSH keys, and inline overrides of variables such as `PATH=` or `LD_PRELOAD=`. High-risk commands show extra warnings and need explicit confirmation ([CLI command reference — Command safety analysis](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

### 3.2 Answering a permission prompt

The docs describe the prompt in three slightly different ways, which probably reflect different request types and UI versions (see [Research Limitations](#12-research-limitations)):

1. **The three-option prompt** described in the concept and how-to pages ([About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)):

   ```text
   1. Yes
   2. Yes, and approve TOOL for the rest of the running session
   3. No, and tell Copilot what to do differently (Esc)
   ```

   > - Source: [About GitHub Copilot CLI — Allowed tools](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) | Provenance: verbatim UI text

2. **Keyboard keys and the full dialog** in the reference: `y` allows once, `n` denies once, `!` allows all similar requests for the session, `#` denies all similar requests for the session and `?` shows details. The full dialog offers **Once** (single use), **This location** (saved to disk per location) and **Always** (permanent, stored in the config file) ([CLI command reference — Permission approval responses](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
3. **"Don't ask again in this repo / in this directory"**, which saves the approval to `permissions-config.json` ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)).

Session-wide approval is broader than it looks.

> "For example, if Copilot asks you to allow it to run the command `rm ./this-file.txt`, and you choose option 2, then Copilot can run any `rm` command (for example, `rm -rf ./*`) during the current run of this session, without asking for your approval."
> - Source: [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)

When you reject a request, you can add inline feedback so the agent changes its approach without stopping ([Changelog, 2026-01-21](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/)).

### 3.3 Where approvals are stored

| Approval | Stored in | Scope | Source |
|---|---|---|---|
| Once, or for this session | Memory only | Current session; you're asked again when you resume the session | [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| "This location" (repository or directory) | `~/.copilot/permissions-config.json` (or `$COPILOT_HOME/permissions-config.json`) | The Git root, or the working directory outside Git; linked worktrees share the main repository's key | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| Permanent URL approval | `allowedUrls` in `~/.copilot/settings.json` | All sessions | [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) |
| Permanently trusted folders | `trustedFolders` array in `~/.copilot/config.json` | All sessions | [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli) |
| Command-line flags | Not persisted | Current session only | [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) |

`permissions-config.json` stores *allow* decisions only. Each location key holds a `tool_approvals` array and an `allowed_directories` array. An approval's `kind` can be `commands`, `read`, `write`, `mcp`, `mcp-sampling`, `memory`, `custom-tool`, `extension-management` or `extension-permission-access`. The file doesn't support deny rules, ask rules, URL rules or repository-shared policy ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)). Shell command identifiers are matched literally, except for a trailing `:*`. As a result, `git:*` matches `git status` but not `gitea`, and `git*` matches nothing special.

```json
{
  "locations": {
    "/Users/YOUR-USER/src/my-repo": {
      "tool_approvals": [
        {
          "kind": "commands",
          "commandIdentifiers": [
            "git status",
            "git diff",
            "git log",
            "npm test",
            "npm run build"
          ]
        }
      ]
    }
  }
}
```

> - Source: [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) | Provenance: verbatim (the docs example "Allow selected commands while still asking before file writes")

### 3.4 Resetting approvals

- `/reset-allowed-tools` revokes the permissions granted during the session, including any granted with `/allow-all` or `/yolo`. It returns the session to the state set by the startup flags. It also clears the saved approvals for the current location from `permissions-config.json` ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)).
- `/permissions reset` resets in-memory tool and path approvals for the current session, so you're prompted again on next use ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

### 3.5 Permission modes

The canonical command is `/permissions [default|assisted|allow-all|show]`. `/allow-all [off|auto|show]` and `/yolo [off|auto|show]` are aliases of `/permissions allow-all` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). The **assisted** mode is described only briefly, in the section on restricting allow-all options.

> "Assisted approval still prompts for each request, but attaches an LLM safety recommendation so the CLI can auto-approve requests the model evaluates as acceptable."
> - Source: [CLI command reference — Restricting the --allow-all options](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

The CLI changelog dates this mode's evolution:

- **1.0.69 (2026-07-07):** an "auto allow-all mode that auto-approves requests an LLM judge evaluates as acceptable" shipped, and "/allow-all auto now requires experimental mode".
- **1.0.78 (2026-08-03):** `/permissions` shipped, to "switch between approval modes".
- **1.0.79 (2026-08-10):** an enterprise allow-auto-only policy was added.
- **1.0.90 (2026-09-30):** "Auto-approval now takes into account messages you type while the agent is working".
- **1.0.91 (2026-10-01):** complete, statically analyzable read-only shell pipelines now go to "execution-evidence review", and incomplete pipelines require explicit approval.

Source: [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md).

Under the brief's lifecycle convention, present it as "shipped behind experimental mode in CLI 1.0.69 (2026-07-07); `/permissions` shipped in CLI 1.0.78 (2026-08-03); no separate GA/preview label". Whether it still requires experimental mode today isn't confirmed by any dated source. Don't badge it GA or preview. This report doesn't use it in demos (§11.3) because its current gating is unconfirmed.

### 3.6 Trusted folders

At session start, the CLI asks you to trust the files in and below the launch directory, either for the current session or for this and future sessions ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)).

> "You should only launch Copilot CLI from directories that you trust."
> - Source: [About GitHub Copilot CLI — Trusted directories](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)

> "Typically, you should not launch Copilot CLI from your home directory."
> - Source: [About GitHub Copilot CLI — Trusted directories](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)

Trust also decides which repository-controlled configuration loads:

- Workspace MCP servers (`.mcp.json`, `.github/mcp.json`) need a trusted folder ([CLI command reference — MCP server loading priority](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- In prompt mode (`-p`), repository hooks load only when the folder is already trusted, when `COPILOT_ALLOW_ALL` is set, or when `GITHUB_COPILOT_PROMPT_MODE_REPO_HOOKS=true`. Workspace MCP servers and project extensions in prompt mode have similar opt-ins ([CLI command reference — Environment variables](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- Repository overrides of `model`, `effortLevel` and `contextTier` in `.github/copilot/settings.json` apply only when the folder is trusted ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).
- `--add-dir` and `/add-dir` grant file access to a directory *and* load its `.github/skills` and `.github/agents` as trusted configuration. Adding a directory is therefore a trust decision, not just a path grant ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

## 4. Allow/Deny Flags, Patterns, Paths and URLs

### 4.1 Two layers of tool control

| Layer | Flags | Effect | Source |
|---|---|---|---|
| What the model can *see* | `--available-tools`, `--excluded-tools` (each takes a quoted, comma-separated list of tool names) | `--available-tools` disables every tool you don't list. `--excluded-tools` disables only the tools you list. If you use both, the CLI applies the `--available-tools` allowlist and ignores `--excluded-tools` | [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) |
| What runs *without a prompt*, or never runs | `--allow-tool`, `--deny-tool` (each takes a quoted, comma-separated list of permission patterns) | An allowed tool runs without a prompt. A denied tool can't be used at all | [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) |

If a tool isn't in the available set, the model can't use it, even when you pass it with `--allow-tool` ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)). You can pass these tool names to `--available-tools` and `--excluded-tools`:

- **Shell:** `bash`/`powershell`, `list_bash`/`list_powershell`, `read_bash`/`read_powershell`, `stop_bash`/`stop_powershell`, `write_bash`/`write_powershell`.
- **Files:** `apply_patch`, `create`, `edit`, `view`.
- **Agents and delegation:** `list_agents`, `read_agent`, `task`, `write_agent`.
- **Other:** `ask_user`, `glob`, `grep` (or `rg`), `skill`, `web_fetch`.

Source: [CLI command reference — Tool availability values](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference).

### 4.2 Permission pattern grammar: `Kind(argument)`

| Kind | Controls | Example patterns |
|---|---|---|
| `memory` | Storing facts to agent memory | `memory` |
| `read` | File or directory reads | `read`, `read(.env)` |
| `shell` | Shell command execution | `shell(git push)`, `shell(git:*)`, `shell` |
| `url` | URL access via `web_fetch` or the shell | `url(github.com)`, `url(https://*.api.com)` |
| `write` | File creation or modification | `write`, `write(src/*.ts)` |
| *SERVER-NAME* | MCP server tool invocation | `MyMCP(create_issue)`, `MyMCP` |

> - Source: [CLI command reference — Tool permission patterns](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: verbatim table

Matching rules:

- **Omitting the argument** matches every tool of that kind ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Shell `:*`** matches the command stem followed by a space. `shell(git:*)` matches `git push` and `git pull` but not `gitea`. For `git` and `gh`, you can name a first-level subcommand, for example `shell(git push)` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)).
- **`write(PATH)`** with `--deny-tool` matches an exact path or a trailing path segment, "no glob support yet". The match resolves symlinks and `.`/`..`, and it's case-insensitive on macOS and Windows. With `--allow-tool`, `write(README.md)` matches any path that ends in `/README.md` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)).
- **`url(ARGUMENT)`** accepts a domain (`url(github.com)` means HTTPS on github.com), an explicit protocol and port (`url(http://localhost:3000)`), a leading-subdomain wildcard (`url(https://*.github.com)`) or a trailing path wildcard (`url(https://docs.github.com/copilot/*)`). Wildcards work only in `shell` and `url` patterns ([Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)).
- **MCP:** `SERVER(tool)` matches one tool, and `SERVER` alone matches every tool on that server. Use the server name as it appears in `/mcp` ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)).

### 4.3 Precedence rules (verified)

1. In ordinary rule evaluation, `--deny-tool` beats `--allow-tool`, `--allow-all-tools`, `--allow-all` and saved approvals ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)). **Hook caveat:** `permissionRequest` hooks run *before* rule checks, and their `allow` or `deny` short-circuits the normal flow. The docs don't say whether a hook's `allow` can override a deny rule. See §7.6 ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).
2. `--deny-url` beats `--allow-url`, and the `deniedUrls` setting beats allow rules ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).
3. `--available-tools` beats `--excluded-tools`. A tool that isn't available can't be re-enabled with `--allow-tool` ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)).
4. Settings apply in this order, with later sources winning: built-in defaults, MDM managed settings, user `settings.json`, repository `.github/copilot/settings.json`, local `.github/copilot/settings.local.json`, environment variables, then command-line flags. Some managed keys are exceptions that set floors (R7) ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).
5. A repository's `deniedUrls` is merged by **union**: the repository can add entries but never remove them ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).

### 4.4 Path permissions

Path checks apply to shell commands, file tools and search tools. For shell commands, the CLI finds paths heuristically by tokenizing the command. `--allow-all-paths` turns off path verification, `--disallow-temp-dir` removes automatic access to the temp directory, and `--add-dir` or `/add-dir` adds a directory. `/list-dirs` shows the allowed directories ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

> "Paths embedded in complex shell constructs may not be detected."
> - Source: [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)

The same page lists two more gaps. Only a fixed set of environment variables, such as `HOME`, `TMPDIR` and `PWD`, are expanded, and symlinks aren't resolved for files that are being created ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)).

### 4.5 URL and network permissions

URL permissions apply to `web_fetch` and to a curated list of network shell commands, such as `curl`, `wget` and `fetch`, whose URLs the CLI extracts with regular expressions. The documented gaps are URLs inside files, config or environment variables, obfuscated URLs, and the fact that HTTP and HTTPS need separate approvals ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)). `web_fetch` also has built-in SSRF protection. It allows only `http://` and `https://` and blocks loopback addresses, RFC 1918 private ranges and cloud metadata IPs, even after DNS resolution. It checks each redirect hop again, and a cross-origin redirect needs approval ([CLI command reference — web_fetch SSRF protection](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

The following persistent URL policy for a user or a repository is built from the documented `allowedUrls`/`deniedUrls` keys and their merge rules:

```jsonc
// Source: synthesized from the allowedUrls/deniedUrls keys documented in
// https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference
// File: ~/.copilot/settings.json (user scope; JSONC comments are supported)
{
  "allowedUrls": ["docs.github.com", "*.github.com"],
  "deniedUrls": ["pastebin.com"]
}
```

> - Source: [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) | Provenance: synthesized. At the repository level, only `deniedUrls`, not `allowedUrls`, is a supported key, and it's merged by union.

### 4.6 Recipes

```bash
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools
# Restricted session: explore, edit and commit, but no internet, no arbitrary subagents, no push.
copilot --available-tools='bash,edit,view,grep,glob' --allow-tool='shell(git:*)' --deny-tool='shell(git push)'

# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli
# Everything allowed except rm and git push.
copilot --allow-all-tools --deny-tool='shell(rm)' --deny-tool='shell(git push)'

# All tools from one MCP server except one destructive tool.
copilot --allow-tool='My-MCP-Server' --deny-tool='My-MCP-Server(tool_name)'

# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools
# Keep the model from even attempting web search during a benchmarking session.
copilot --excluded-tools='web_fetch, web_search'
```

> - Source: [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools); [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli) | Provenance: verbatim commands, with comments added

The best-practices guide lists these common allow patterns: `shell(git:*)`, `shell(npm run:*)`, `shell(npm run test:*)` and `write` ([Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).

## 5. Allow-All, Autopilot and Non-Interactive Modes

### 5.1 The permissive options

| Option | Effect | Source |
|---|---|---|
| `--allow-all-tools` | Allows all tools to run without confirmation. The reference marks it "Required when using the CLI programmatically", and its environment equivalent is `COPILOT_ALLOW_ALL` | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `--allow-all-paths` | Turns off file path verification | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `--allow-all-urls` | Allows all URLs without confirmation | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `--allow-all`, `--yolo` | Equivalent to all three of the above | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `/allow-all`, `/yolo` (aliases of `/permissions allow-all`) | Enable all permissions during a session. Entering the command again doesn't toggle permissions off | [Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `COPILOT_ALLOW_ALL` | Truthy values auto-approve tools. The exact value `true` *also trusts the working directory* | [CLI command reference — Environment variables](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |

> "Setting it to exactly `true` also trusts the working directory without prompting, loading that directory's skills, plugins, MCP servers, and hooks (including hooks that run shell commands)."
> - Source: [CLI command reference — Environment variables](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

> "It is strongly recommended that you only use these options in an isolated environment."
> - Source: [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)

The same caution says you should never use a shell alias to apply these options every time you start the CLI. Deny rules still apply under `--allow-all`, subject to the `permissionRequest` hook caveat in §7.6 ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)). Copilot Business and Copilot Enterprise administrators can block the allow-all options. Setting `permissions.disableBypassPermissionsMode` to `"disable"` suppresses every allow-all flag and slash command, and `"allow-auto-only"` still allows assisted approval. Policy details belong to R7 ([CLI command reference — Restricting the --allow-all options](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

### 5.2 Autopilot mode

Autopilot lets the agent keep working through a task without waiting for input after each step. Press <kbd>Shift</kbd>+<kbd>Tab</kbd> to cycle through standard, plan and autopilot modes. Use `--autopilot` at launch, `--mode=autopilot`, or `/autopilot [OBJECTIVE]` (alias `/goal`) during a session ([Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Autopilot stops when the task is complete, when a problem blocks progress, when you press <kbd>Ctrl</kbd>+<kbd>C</kbd>, or when the continuation limit is reached ([Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).

If you haven't granted all permissions when you enter autopilot, the CLI offers `1. Enable all permissions (recommended)`, `2. Continue with limited permissions` or `3. Cancel (Esc)` ([Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).

> "If you choose to continue with limited permissions, Copilot will automatically deny any tool requests that require approval, which may prevent it from completing certain tasks."
> - Source: [Allowing GitHub Copilot CLI to work autonomously](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)

Autopilot has several guardrails:

- **Continuation limit.** Set it with `--max-autopilot-continues=COUNT`. The docs disagree on the default (5 versus unlimited; see [Research Limitations](#12-research-limitations)), so set it explicitly ([Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Spend cap per objective.** For example, `/goal Refactor the auth module --max-ai-credits 5` pauses the objective when the cap is reached. Separately, `--max-ai-credits` and `/limits` set a soft cap per response ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Sticky mode.** Autopilot stays on between tasks by default. Set `stayInAutopilot` to `false` to return to interactive mode after each task ([Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).
- **Sandbox interaction.** With local sandboxing on, autopilot completes whatever it can inside the sandbox and denies any step that needs to escape it ([Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).

`--allow-all`, autopilot and `--no-ask-user` are separate controls. `--allow-all` grants permissions but keeps the normal interactive flow. `--no-ask-user` turns off the `ask_user` tool so the agent decides on its own, but it doesn't continue across turns autonomously. Autopilot does continue across turns ([Autopilot — Comparing autopilot mode, --allow-all, and --no-ask-user](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)).

**Plan-then-autopilot.** `--plan --mode autopilot`, or the `COPILOT_PLAN_THEN_AUTOPILOT` environment variable, starts in plan mode and moves to autopilot automatically "instead of waiting for a human to approve it". This *removes* the plan-approval checkpoint, so use it only where nobody needs to review the plan ([CLI command reference — Plan-then-autopilot](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

### 5.3 Programmatic (`-p`) mode

`-p` runs one prompt and exits, so no interactive approval prompt is available. Grant permissions up front with flags, or decide them with a `permissionRequest` hook, which the reference calls "especially useful in CLI pipe mode (`-p`)" ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference); [Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)). Several options matter for safety:

- `--secret-env-vars=VAR` keeps the values of the named variables out of what the agent displays and records. The two references word this differently, as explained below. By default, the values of `GITHUB_TOKEN` and `COPILOT_GITHUB_TOKEN` are "redacted from output" ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- `--share` and `--share-gist` export transcripts for audit, but transcripts "may contain sensitive information".
- `--available-tools` tightly scopes what an automated run can do.

Source: [Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference).

**Output masking isn't credential isolation.** The documentation describes `--secret-env-vars` in two ways:

- The command reference says the option will "Redact an environment variable from shell and MCP server environments".
- The programmatic reference describes "An environment variable whose value you want redacted in output" and calls it "Essential for preventing secrets being exposed in logs".

Neither page says whether the variable is removed from the environment of the shell commands, hooks or MCP servers that the agent starts. Neither says that a process holding the value is stopped from using or sending it. Treat the option as protection for logs and transcripts. For credential isolation:

- Don't put secrets the task doesn't need into the CLI's environment at all.
- Use the sandbox credential-injection switches `sandbox.auth.git` and `sandbox.auth.gh`, together with the sandbox filesystem and network policy (experimental in the CLI).
- Run steps that need secrets separately from the agent step.

These recommendations are this report's synthesis ([Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference); [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)).

> "Disabled by default to prevent starting repository-controlled MCP servers without interactive trust."
> - Source: [CLI command reference — `GITHUB_COPILOT_PROMPT_MODE_WORKSPACE_MCP`](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

```shell
# Source: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot
# Fully autonomous, programmatic run with a continuation cap (use only in an isolated environment).
copilot --autopilot --yolo --max-autopilot-continues 10 -p "YOUR PROMPT HERE"
```

> - Source: [Allowing GitHub Copilot CLI to work autonomously](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot) | Provenance: verbatim

The following least-privilege variant for CI is built from documented flags. It narrows what the *model* can do through its tools and approvals. Section 5.4 explains what it doesn't prevent.

```bash
#!/usr/bin/env bash
# Source: synthesized from flags documented in
#   https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference
#   https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference
# Authentication: the CLI reads COPILOT_GITHUB_TOKEN, then GH_TOKEN, then GITHUB_TOKEN
# (fine-grained PAT with the "Copilot Requests" permission; classic ghp_ tokens are not supported).
# Do not export secrets this step does not need (for example NPM_TOKEN); --secret-env-vars only
# masks values in output/logs and is not documented to remove them from child-process environments.
set -euo pipefail

: "${COPILOT_GITHUB_TOKEN:?Set COPILOT_GITHUB_TOKEN from your CI secret store}"

copilot -p "Run the unit tests and fix any failing tests in src/. Do not modify CI configuration." \
  --available-tools='bash,view,edit,create,grep,glob' \
  --allow-tool='shell(npm test), shell(npm run lint), write' \
  --deny-tool='shell(git push), shell(rm), write(.github/workflows/ci.yml)' \
  --no-ask-user \
  --max-autopilot-continues=5 \
  --autopilot \
  -s
```

> - Source: [Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli) | Provenance: synthesized. Leaving `web_fetch` out of `--available-tools` removes the fetch tool, and because no `--allow-url` is granted, shell network commands such as `curl` still fall under URL permissions, which are detected heuristically. For hard network isolation, use the sandbox network policy or a firewalled runner. `write(PATH)` deny rules match an exact path or trailing path segment with no globs (§4.2), so name each protected file. The `write(.github/workflows/ci.yml)` denial constrains only Copilot's file-writing tools. It **doesn't** protect the file from allowed scripts, and this recipe includes no file-integrity check (§5.4).

### 5.4 What tool permissions don't constrain: effects of allowed scripts

Permission rules govern the *tool calls* that the agent makes. They don't govern everything that an allowed command does once it runs:

- **`write` covers file tools, not shell commands.** The configuration guide defines `write` as permission for tools "other than shell commands" to modify files. A `--deny-tool='write(PATH)'` rule therefore stops Copilot's `edit` and `create` tools from writing that path. It doesn't stop an allowed shell command, such as `npm test`, a lint script or a build, from writing the same file ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)).
- **Allowed project scripts are trusted executable code.** `shell(npm test)` approves the command, but the test runner then runs whatever the repository's scripts, test files and dependencies contain. That code can write files or make network requests, and path and URL detection for shell commands is heuristic ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)). Allowing a test command is equivalent to trusting the code it runs. That conclusion is this report's inference from the documented scope of `write` and `shell`.
- **Prompt instructions aren't prohibitions.** A prompt line such as "Do not modify CI configuration" guides the model but isn't enforced.

If a file must not change, don't rely on tool permissions alone. One option is an OS-level filesystem policy, for example the sandbox's `sandbox.userPolicy.deniedPaths` with `--sandbox`. The sandbox is experimental in the CLI, and Windows rejects policies with denied paths ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference); [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)). The other option is to verify independently, outside the agent session, before merge, for example with required CI checks under branch protection and human pull request review. These are the same external controls GitHub documents for its own cloud agent ([Risks and mitigations for cloud agent](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations); [Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)). This report doesn't supply a file-integrity script.

## 6. Constraining Subagents

### 6.1 The per-agent `tools` list

Each custom agent profile can restrict its tools. In the CLI, `tools` defaults to `["*"]`, which means all tools, and a `*` anywhere in the list grants every tool. For example, `["view", "*"]` grants all tools ([CLI command reference — Custom agent frontmatter fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Across GitHub surfaces:

- If you omit `tools`, or set it to `["*"]`, every tool is enabled. `tools: []` disables all tools, and a list enables only the tools it names.
- These case-insensitive aliases are available: `execute` (also `shell`, `Bash`, `powershell`), `read`, `edit`, `search`, `agent` (also `custom-agent`, `Task`), `web` and `todo`.
- MCP tools are referenced as `server/tool` or `server/*`.
- Unrecognized tool names are ignored.

Source: [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration). See R2 for the full frontmatter.

GitHub suggests tool restriction as a safety pattern.

> "Example: A custom agent that can only `view/grep/glob` (read-only) for auditing."
> - Source: [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)

**Important nuance.** The docs describe a subagent's `tools` list as a filter on which tools are *available*. No source says it replaces the session's permission rules. A subagent that has `execute` is still subject to the session's deny rules and prompts. That conclusion is an inference from the `task` agent wording quoted in §6.3.

### 6.2 Read-only built-in agents

| Built-in agent | Guardrail property | Source |
|---|---|---|
| `explore` | "It will not change any files", so it can safely run in parallel. It has read-only access to GitHub MCP tools | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| `code-review` | Surfaces bugs, security vulnerabilities, race conditions and logic errors; "will not make any changes to files" | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| `security-review` | Read-only specialist that reports only high-confidence findings (more than 80% confidence of exploitability, across 11 categories) | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `rubber-duck` | Read-only critic that runs on a complementary model | [Rubber duck](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck) |
| `task` | Not read-only: it gets the parent's tools and permissions | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| `general-purpose` | Not read-only: it has essentially the same capabilities as the main agent | [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |

`code-review` and `security-review` don't forward a whole review to another review agent. `code-review` can hand security-focused portions to `security-review`, and both agents can delegate narrow fact-finding to non-review agents such as `explore` ([CLI command reference — Built-in agents](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

### 6.3 What subagents inherit from the parent session

> "It has access to all of the tools the parent agent can use (excluding some that are not appropriate in a subagent context), with the same permissions granted or denied."
> - Source: [About custom agents — `task` agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)

> "If Copilot spins up a helper session to research part of your question, that helper inherits the same restrictions and can't edit your project either."
> - Source: [CLI command reference — Security: Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

Other documented inheritance and isolation rules:

- **Memory:** only the root agent can call `store_memory` or `vote_memory`. Subagents can read memories through `read_memories` but can't write or vote ([CLI command reference — Built-in agents](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Model and effort:** a subagent inherits the parent's model and effort unless something overrides them. Precedence, from highest, is a per-call value, the `subagents` setting, the agent definition, then the parent session. `modelPolicy: "required"` refuses dispatch instead of substituting another model (R1/R2) ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Repository instructions:** custom agents that run as subagents don't receive repository instruction files unless the profile sets `include-custom-instructions: true` (R3) ([Creating custom agents for CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)).
- **Hooks:** `subagentStart` and `subagentStop` fire for every built-in YAML-based agent and every custom agent. The built-in `general-purpose` agent is the exception ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).

### 6.4 Disabling subagents and capping fan-out

- `subagents.disabledSubagents` stops the listed agents from being dispatched. You can disable any built-in agent except `rubber-duck` this way. Rubber duck has its own `builtInAgents.rubberDuck` switch ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).
- `--available-tools` without `task` stops the main agent from starting arbitrary subagents. The official recipe in §4.6 relies on this ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)).
- Depth and concurrency limits prevent runaway spawning. Details belong to R1 ([CLI command reference — Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

## 7. Hooks as Policy

### 7.1 What hooks are and where they run

Hooks are "external commands that execute at specific lifecycle points during a session, enabling custom automation, security controls, and integrations". They run in Copilot CLI, on the local machine in the CLI's shell, and in Copilot cloud agent, inside its ephemeral, non-interactive Linux sandbox, where only a subset of events fires ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)). Hooks run synchronously and block the agent, so keep each one under about 5 seconds where possible ([About hooks](https://docs.github.com/en/copilot/concepts/agents/hooks)).

### 7.2 Hook events (verified list: 14 events)

The brief named six events, and all six are verified. The current reference lists eight more.

| Event (camelCase) | VS Code-compatible name | Fires when | Output used? (CLI) | Cloud agent |
|---|---|---|---|---|
| `sessionStart` | `SessionStart` | A new or resumed session begins | Optional `additionalContext` | Fires once per job |
| `sessionEnd` | `SessionEnd` | The session ends; `/clear` also fires it with `reason: "user_exit"` | No | Fires once |
| `userPromptSubmitted` | `UserPromptSubmit` | The user submits a prompt | `modifiedPrompt` only for SDK programmatic hooks; config-file hook output is dropped | Fires at most once |
| `userPromptTransformed` | — | After the runtime turns the prompt into model-facing content | Can rewrite the content (`modifiedTransformedPrompt`) | Fires |
| `preToolUse` | `PreToolUse` | Before each tool runs | **Allow, deny, ask or modify** | Fires; `"ask"` counts as `"deny"` |
| `permissionRequest` | `PermissionRequest` | Before the permission service runs (CLI only) | **Allow or deny that short-circuits the normal flow** | Doesn't apply |
| `postToolUse` | `PostToolUse` | After a tool succeeds | Can replace the result or add context | Fires |
| `postToolUseFailure` | `PostToolUseFailure` | After a tool fails | Recovery guidance through `additionalContext` | Fires |
| `agentStop` | `Stop` | The main agent finishes a turn | **Can block and force continuation** | Fires |
| `subagentStart` | — | A subagent is spawned | `additionalContext` is prepended to the subagent prompt; can't block | Fires |
| `subagentStop` | `SubagentStop` | A subagent completes | **Can block and force continuation**, or rewrite the response | Fires |
| `errorOccurred` | `ErrorOccurred` | An error occurs | No | Fires |
| `preCompact` | `PreCompact` | Before context compaction | No | Only `auto` |
| `notification` | (`hook_event_name: "Notification"`) | A system notification is emitted, for example `permission_prompt` or `agent_idle`; fire-and-forget | Optional `additionalContext` | Doesn't fire |

> - Source: [GitHub Copilot hooks reference — Hook events](https://docs.github.com/en/copilot/reference/hooks-reference) | Provenance: adapted (condensed table)

The configured event name decides the payload format. camelCase names deliver camelCase fields. PascalCase names deliver snake_case fields that match the VS Code Copilot extension. PascalCase `PreToolUse` and `PermissionRequest` use Claude-style matchers and tool names, such as `Bash`, `Read`, `Edit` and `Agent` ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).

### 7.3 Configuration locations and load order (CLI)

The reference says that hooks load "in order (policy, then user, then project, then plugins) and combined. When the same event appears in multiple sources, all hook entries from all sources are run" ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)). The sources are:

| Source | Location |
|---|---|
| Policy hooks (admin, machine-wide; R7) | `/etc/github-copilot/policy.d/*.json` (Linux/macOS), `C:\ProgramData\GitHub\Copilot\policy.d\*.json`, or `HKLM\Software\Policies\GitHub\Copilot` (Windows). These can't be turned off with `disableAllHooks`, load whatever the folder trust state, and always run on the host, even when the session is sandboxed |
| Repository hook files | `.github/hooks/*.json` |
| User hook files | `~/.copilot/hooks/*.json` (or `$COPILOT_HOME/hooks/`) |
| Inline repository settings | The `hooks` key in `.github/copilot/settings.json` or `.github/copilot/settings.local.json`. The CLI also reads `.claude/settings.json` and `.claude/settings.local.json` |
| Inline user settings | The `hooks` key in `~/.copilot/settings.json` |
| Plugins | The plugin's `hooks.json` or `hooks/hooks.json` |

> - Source: [GitHub Copilot hooks reference — Hooks locations](https://docs.github.com/en/copilot/reference/hooks-reference) | Provenance: adapted

The CLI loads hook configuration changes at startup ([Using hooks with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks)). In cloud agent, only `.github/hooks/*.json` in the cloned repository applies ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).

**`disableAllHooks`.** Set inside a single hook file, it skips only that file's hooks. Set at the top level of a repository's `settings.json`, it skips *every* non-policy hook for sessions in that repository (CLI only), including the user's own hooks. Policy hooks keep running ([Hooks reference — Disable all hooks](https://docs.github.com/en/copilot/reference/hooks-reference)). In practice, a user-level hook can't serve as a hard guardrail against an untrusted repository. Use policy hooks (R7) for enforcement that a repository can't turn off.

### 7.4 Hook entry types and fields

| Type | Key fields | Notes |
|---|---|---|
| `command` (default) | `bash`, `powershell`, `command` (cross-platform fallback), or `exec` plus `args` (CLI only, no shell); `cwd`, `env`, `timeoutSec` (default `30`; `timeout` is an alias); optional `matcher` | Cloud agent honors only `bash`, with `command` as a fallback |
| `http` | `url`, `headers`, `allowedEnvVars`, `timeoutSec` | Only `https://` by default. For `preToolUse` and `permissionRequest`, the URL **must** use `https://` because the response can grant permissions. Plain `http://localhost` works only with `COPILOT_HOOK_ALLOW_LOCALHOST=1` |
| `prompt` | `prompt` | `sessionStart` only, for new interactive sessions only. It doesn't fire on resume or with `-p` |

> - Source: [GitHub Copilot hooks reference — Hook configuration format](https://docs.github.com/en/copilot/reference/hooks-reference) | Provenance: adapted

The `matcher` is a regular expression wrapped as `^(?:PATTERN)$`, so it must match the whole value. An invalid regex skips the hook. Matchers work on `preToolUse`, `postToolUse` and `permissionRequest` (matched against `toolName`), `subagentStart` (`agentName`), `preCompact` (`trigger`) and `notification` (`notification_type`) ([Hooks reference — Matcher filtering](https://docs.github.com/en/copilot/reference/hooks-reference)). Tool names for matching include `bash`, `powershell`, `view`, `create`, `edit`, `glob`, `grep`, `web_fetch`, `task` (subagents) and `ask_user` ([Hooks reference — Tool names for hook matching](https://docs.github.com/en/copilot/reference/hooks-reference)).

When the session sandbox is on, repository, user and plugin command hooks run *inside* the sandbox. A hook's `cwd` and `env` don't widen its access ([Hooks reference — Sandboxed sessions](https://docs.github.com/en/copilot/reference/hooks-reference)).

### 7.5 Key payloads (camelCase)

```typescript
// Source: https://docs.github.com/en/copilot/reference/hooks-reference (Hook event input payloads)
// Provenance: adapted. Non-executable SCHEMA SKETCH: field shapes as documented, not compilable source.
type PreToolUseInput = {
  sessionId: string; timestamp: number; cwd: string; toolName: string; toolArgs: unknown;
};

type SubagentStopInput = {
  sessionId: string; timestamp: number; cwd: string; transcriptPath: string;
  agentId: string; agentType: string; agentName: string; agentDisplayName?: string;
  response: string; stopReason: "end_turn";
};

type AgentStopInput = {
  sessionId: string; timestamp: number; cwd: string; transcriptPath: string;
  stopReason: "end_turn"; stop_hook_active: boolean;
};
```

> - Source: [GitHub Copilot hooks reference — Hook event input payloads](https://docs.github.com/en/copilot/reference/hooks-reference) | Provenance: adapted (wrapped in named type aliases; the field names and types are verbatim)

The reference types `toolArgs` as `unknown`. The official tutorial says it arrives as "a **JSON string**" that "your script must parse". Robust scripts should handle both a string and an object ([Hooks tutorial](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks)).

### 7.6 Decision control

| Event | Output fields | Semantics |
|---|---|---|
| `preToolUse` | `permissionDecision`: `"allow"`, `"deny"` or `"ask"`; `permissionDecisionReason` (required for a deny); `modifiedArgs` (replacement arguments) | Empty output means the default behavior. If any hook returns `deny`, the tool is blocked |
| `permissionRequest` | `behavior`: `"allow"` or `"deny"`; `message`; `interrupt` (with deny, stops the agent entirely) | Runs before rule checks, session approvals and prompts. All hooks run, and later outputs override earlier ones. `read` and `hook` permission kinds skip hooks. A hook `allow` *can't* pre-approve a sandbox-bypass request |
| `agentStop` / `subagentStop` | `decision`: `"block"` or `"allow"`; `reason` (becomes the next prompt); `modifiedResponse` (`subagentStop` only) | After 8 consecutive blocks, the runaway guard ends the turn. `block` wins over `modifiedResponse` |
| `postToolUse` | `modifiedResult` (with `resultType: "success"`); `additionalContext` | Combined `additionalContext` is capped at 10 KB |

> - Source: [GitHub Copilot hooks reference — decision control sections](https://docs.github.com/en/copilot/reference/hooks-reference) | Provenance: adapted

> "For `preToolUse`, if any hook returns `"deny"`, the tool is blocked."
> - Source: [GitHub Copilot hooks reference — Tool names for hook matching](https://docs.github.com/en/copilot/reference/hooks-reference)

> "leaving the sandbox is a privilege escalation the user must always confirm interactively."
> - Source: [GitHub Copilot hooks reference — permissionRequest decision control](https://docs.github.com/en/copilot/reference/hooks-reference)

#### How hook decisions interact with deny rules (read before designing policy)

The rule-precedence statement in §4.3 and the hook semantics in the table above come from different pages. The docs don't fully reconcile them. These points are documented:

| Mechanism | Where it runs | How multiple hooks combine | What's documented about deny rules |
|---|---|---|---|
| Deny rules (`--deny-tool`, `--deny-url`, `deniedUrls`) | In the permission service's rule evaluation | Not applicable | They win over allow rules, `--allow-all` and saved approvals ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)) |
| `permissionRequest` hooks | "before the permission service runs (rules engine, session approvals, auto-allow/auto-deny, and user prompting)" | **Later outputs override earlier ones.** Policy hooks load first, then user, project and plugin hooks, so the policy hook's output comes *earliest* | A returned `allow` or `deny` "short-circuits the normal permission flow". The reference doesn't say whether that `allow` is still subject to deny rules. The only documented exception is a sandbox-bypass request, where a hook `allow` doesn't pre-approve and only a `deny` propagates |
| `preToolUse` hooks | "Before each tool executes" | **Any `deny` wins**: "if any hook returns `"deny"`, the tool is blocked" | Ordering relative to `permissionRequest` and the rules engine isn't stated. The timeout behavior ("proceeds through the normal permission flow") implies `preToolUse` runs before that flow |

> - Source: [GitHub Copilot hooks reference — Hook events, permissionRequest decision control, Exit codes](https://docs.github.com/en/copilot/reference/hooks-reference); [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) | Provenance: adapted. The last column records documentation gaps, not tested behavior.

These design consequences are this report's inference from the documented semantics:

1. **Treat "deny beats allow" as a statement about rule evaluation, not about hooks.** Whether a `permissionRequest` hook's `allow` can override `--deny-tool` is unresolved. Don't depend on a deny flag as an absolute floor in a session that loads any `permissionRequest` hook able to return `allow`, whether it comes from a user, repository or plugin. Test the combination before you rely on it.
2. **Put policy *denials* in `preToolUse`, not in `permissionRequest`.** `preToolUse` uses any-deny-wins aggregation, so a later hook can't cancel an earlier deny. Under `permissionRequest`'s last-output-wins merging, an early policy-hook `deny` could, as documented, be overridden by a later user, project or plugin hook that returns `allow`.
3. **Use `permissionRequest` mainly for narrow, programmatic *approvals* in `-p` or CI**, which is what the reference describes it as useful for. Keep the set of hooks that can return `allow` small and reviewed.
4. **Layer the controls.** Combine deny flags, `preToolUse` denials and, where available, the OS sandbox, because hook timeouts fail open (§7.7).

### 7.7 Fail-open versus fail-closed (critical for policy design)

| Situation | Behavior |
|---|---|
| A command `preToolUse` hook exits with `2`, crashes, or exits with any other non-zero code | **Fail-closed**: the tool call is denied, even if stdout says `allow` |
| A command `permissionRequest` hook exits with `2` | Treated as a deny |
| A hook of any kind times out, including `preToolUse` and admin policy hooks | **Fail-open**: a warning is shown and the call goes through the normal permission flow |
| An HTTP `preToolUse` hook hits a network error, timeout or non-2xx response | **Fail-open** |
| Hooks for other events exit non-zero | Logged and skipped |
| stdout holds two non-progress JSON objects, or invalid JSON | Treated as no output, so the default applies. Emit exactly one decision object |

> "a slow or unreachable hook must not silently block tool calls or work, even when the hook was deployed by an administrator as policy."
> - Source: [GitHub Copilot hooks reference — Exit codes for command hooks](https://docs.github.com/en/copilot/reference/hooks-reference)

Design implication: combine hooks with deny flags or the sandbox for anything that must never run, because a hook that times out lets the call through. Keep policy hooks fast and choose `timeoutSec` deliberately ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).

### 7.8 Example: repository policy hook (adapted from the official tutorial)

The official tutorial *Using hooks with Copilot CLI for predictable, policy-compliant execution* builds a logging banner, prompt auditing and a `preToolUse` deny script ([Hooks tutorial](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks)). The version below keeps the tutorial's policy intent but makes four changes. It handles `toolArgs` as either a string or an object. It uses a `matcher` so the hook fires only for shell tools. It uses `"ask"` to force a human checkpoint on `git push`. It fails closed when `jq` is missing.

**1. Hook configuration: `.github/hooks/copilot-cli-policy.json`**

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "matcher": "bash|powershell",
        "bash": "./scripts/pre-tool-policy.sh",
        "cwd": ".github/hooks",
        "timeoutSec": 15
      }
    ]
  }
}
```

> - Source: [Hooks tutorial](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks); [Hooks reference — Matcher filtering](https://docs.github.com/en/copilot/reference/hooks-reference) | Provenance: adapted. The tutorial also ships a PowerShell version, so add a `"powershell"` entry that points to an equivalent `.ps1` script for Windows users. JSON doesn't allow comments, so this note lives outside the block.

**2. Policy script: `.github/hooks/scripts/pre-tool-policy.sh`**

```bash
#!/usr/bin/env bash
# Source: adapted from https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks
# Contract: https://docs.github.com/en/copilot/reference/hooks-reference (preToolUse decision control)
# Reads one preToolUse payload on stdin; writes at most ONE JSON decision object on stdout.
set -euo pipefail

# Fail closed: a non-zero exit from a preToolUse *command* hook denies the tool call.
if ! command -v jq >/dev/null 2>&1; then
  echo "pre-tool-policy: jq is required" >&2
  exit 1
fi

INPUT="$(cat)"
TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.toolName // empty')"

# toolArgs is typed `unknown` in the reference; the tutorial treats it as a JSON string.
COMMAND="$(printf '%s' "$INPUT" | jq -r '
  (.toolArgs // {}) as $a
  | (if ($a | type) == "string" then ($a | fromjson? // {}) else $a end)
  | .command // empty')"

decide() {  # $1 = allow|deny|ask, $2 = reason shown to the agent
  jq -cn --arg d "$1" --arg r "$2" '{permissionDecision: $d, permissionDecisionReason: $r}'
  exit 0
}

case "$TOOL_NAME" in
  bash|powershell) ;;
  *) exit 0 ;;  # empty output = normal permission flow
esac

# Privilege escalation
if printf '%s' "$COMMAND" | grep -Eq '(^|[^[:alnum:]_])(sudo|su|runas)([^[:alnum:]_]|$)'; then
  decide deny "Privilege escalation is blocked by repository policy."
fi

# Download-and-execute
if printf '%s' "$COMMAND" | grep -Eq '(curl|wget)[^|]*\|[[:space:]]*(ba)?sh'; then
  decide deny "Download-and-execute patterns are blocked by repository policy."
fi

# Recursive deletion of the filesystem root
if printf '%s' "$COMMAND" | grep -Eq 'rm[[:space:]]+-[[:alnum:]]*[rR][[:alnum:]]*[[:space:]]+/([[:space:]]|$)'; then
  decide deny "Recursive deletion of the filesystem root is blocked."
fi

# Human checkpoint for publishing changes
if printf '%s' "$COMMAND" | grep -Eq '(^|[^[:alnum:]_])git[[:space:]]+push([^[:alnum:]_]|$)'; then
  decide ask "git push requires explicit human confirmation under repository policy."
fi

exit 0
```

> - Source: [Using hooks with Copilot CLI for predictable, policy-compliant execution](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks) | Provenance: adapted. The audit-logging and redaction steps from the tutorial are left out for brevity, and the tutorial recommends adding them. The docs don't say how `"ask"` interacts with `--allow-all`, so verify that in your environment. Confirm the argument field names (`command`) with a logging-only hook before you enforce.

**3. Test locally before committing**, as the tutorial does, by piping a sample payload into the script:

```bash
# Source: adapted from https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks
chmod +x .github/hooks/scripts/pre-tool-policy.sh

# Expected: no output (allowed through the normal permission flow)
echo '{"toolName":"bash","toolArgs":"{\"command\":\"git status\"}"}' | .github/hooks/scripts/pre-tool-policy.sh

# Expected: {"permissionDecision":"deny","permissionDecisionReason":"Privilege escalation is blocked by repository policy."}
echo '{"toolName":"bash","toolArgs":"{\"command\":\"sudo rm -rf /\"}"}' | .github/hooks/scripts/pre-tool-policy.sh

# Validate the configuration file
jq '.' < .github/hooks/copilot-cli-policy.json
```

> - Source: [Hooks tutorial](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks) | Provenance: adapted

The tutorial recommends a **logging-first rollout**.

> "Start by logging prompts and tool usage without denying execution."
> - Source: [Using hooks with Copilot CLI for predictable, policy-compliant execution](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks)

### 7.9 Example: a one-retry advisory test check with `agentStop` (synthesized; not an enforcement gate)

`agentStop` can return `decision: "block"` to force another turn of the *same* main agent, with `reason` as the next prompt. `stop_hook_active` tells the hook that this turn was already forced to continue. After 8 consecutive blocks, the CLI ends the turn anyway ([Hooks reference — agentStop / subagentStop decision control](https://docs.github.com/en/copilot/reference/hooks-reference)). That supports a **bounded nudge**: when the agent tries to finish while tests fail, send it back once to fix them.

**What this example doesn't guarantee.** In each of these situations the agent's turn can end with failing or unrun tests:

- On the forced turn, `stop_hook_active` is `true`, so the script exits *before running the tests again*.
- `jq` is missing.
- `npm test` takes longer than `timeoutSec`, because timeouts fail open.
- The repository's `settings.json` sets `disableAllHooks: true`.
- The folder isn't trusted in `-p` mode, so repository hooks don't load.

These cases follow from the documented hook semantics and from the script's own logic ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Removing the self-limit wouldn't make the check a hard gate either, because the 8-block runaway guard still ends the turn. For a real completion or merge gate, use **required CI checks** and **human pull request review**. The cloud agent itself is "subject to any branch protections and required checks", and GitHub's guidance ends review workflows in "your normal pull request review workflow" ([Risks and mitigations for cloud agent](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations); [Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).

**Setup and assumptions:**

- The hook file is `.github/hooks/test-retry.json` and the script is `.github/hooks/scripts/require-green-tests.sh`. Run `chmod +x` on the script.
- `jq` and `npm` are on `PATH`.
- `npm test` runs from the repository root and returns a non-zero exit code when tests fail.
- The folder is trusted.

**`.github/hooks/test-retry.json`**

```json
{
  "version": 1,
  "hooks": {
    "agentStop": [
      {
        "type": "command",
        "bash": "./scripts/require-green-tests.sh",
        "cwd": ".github/hooks",
        "timeoutSec": 300
      }
    ]
  }
}
```

> - Source: [GitHub Copilot hooks reference — Command hooks](https://docs.github.com/en/copilot/reference/hooks-reference) | Provenance: synthesized (JSON can't carry comments, so the attribution is placed beside the block)

**`.github/hooks/scripts/require-green-tests.sh`**

```bash
#!/usr/bin/env bash
# File: .github/hooks/scripts/require-green-tests.sh   (chmod +x)
# Source: synthesized from the agentStop contract in
#   https://docs.github.com/en/copilot/reference/hooks-reference
# Provenance: synthesized. ADVISORY, ONE RETRY: if `npm test` fails when the main agent tries to
# finish, force one more turn asking it to fix the tests. It does NOT guarantee green tests:
# the forced turn is allowed to end without re-running tests (stop_hook_active short-circuit).
set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "require-green-tests: jq not found; skipping check" >&2
  exit 0   # check skipped; non-preToolUse hook failures are logged and skipped anyway
fi

INPUT="$(cat)"
ALREADY_FORCED="$(printf '%s' "$INPUT" | jq -r '.stop_hook_active // false')"

# Second stop after a forced turn: allow completion WITHOUT re-running tests (bounded retry).
if [ "$ALREADY_FORCED" = "true" ]; then
  exit 0
fi

# The hook runs from cwd .github/hooks; run tests from the repository root.
if (cd ../.. && npm test --silent >/dev/null 2>&1); then
  exit 0
fi

jq -cn '{decision: "block", reason: "The test suite is failing. Run npm test, fix the failures, and summarize what you changed."}'
```

> - Source: [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) | Provenance: synthesized. A forced turn uses more AI credits. In cloud agent, a forced turn still counts against the job timeout. To surface a remaining failure to the person reviewing the work, run the tests again in CI as a required check instead of relying on this hook.

### 7.10 Hook hygiene

GitHub's security guidance for hooks is to validate and sanitize hook input, escape shell input correctly, never log secrets, lock down permissions on scripts and logs, be cautious with external network calls, and set sensible timeouts ([About hooks — Security considerations](https://docs.github.com/en/copilot/concepts/agents/hooks)).

> "Untrusted input could lead to unexpected behavior."
> - Source: [About hooks for GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/hooks)

The tutorial notes that GitHub "does not currently provide built-in secret redaction for hooks" and recommends redacting secrets before logging ([Hooks tutorial](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks)). HTTP hooks can expand only the environment variables named in `allowedEnvVars` inside headers, and doing so requires `https://` ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).

## 8. Human-in-the-Loop Checkpoints

### 8.1 Plan mode

Plan mode, entered with <kbd>Shift</kbd>+<kbd>Tab</kbd>, `/plan [PROMPT]`, `--plan` or `--mode plan`, analyzes the request, asks clarifying questions and writes a checklist plan to `plan.md` in the session folder. It then **waits for your approval** before implementing. <kbd>Ctrl</kbd>+<kbd>y</kbd> opens the plan in your editor, and `/session plan` shows it ([Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).

> "Models achieve higher success rates when given a concrete plan to follow."
> - Source: [Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)

Plan mode is enforced by the runtime, not just by prompting. Attempts to edit, patch or run a shell command that changes workspace files are blocked, and the restriction extends to helper subagents. GitHub frames it as a safety net, not a lockdown. Shell commands with unclear effects and calls to external or MCP tools are intentionally allowed through ([CLI command reference — Security: Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).

> "This protection is designed to catch clear, direct attempts to change your files—it's not an airtight lockdown."
> - Source: [CLI command reference — Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

When a plan is ready, the CLI offers exits that include **Accept plan and build on autopilot** and **Accept plan and build on autopilot + /fleet**. Those exits hand control to autonomous execution ([Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot); [Fleet](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)).

### 8.2 Other checkpoints

| Checkpoint | How it works | Source |
|---|---|---|
| Clarifying questions | The `ask_user` tool, used heavily in plan mode. `--no-ask-user` or `askUser: false` turns it off | [Changelog 2026-01-21](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| Steering | Queue or send messages while the agent works. Rejecting a permission request with inline feedback redirects the agent | [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| Interrupt | <kbd>Esc</kbd> cancels. Pressing it twice interrupts the running turn or stops background agents | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Diff review | `/diff` reviews session changes with line comments, which you can submit as feedback | [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| Rollback | <kbd>Esc</kbd> <kbd>Esc</kbd> when idle, `/undo` or `/rewind` open the rewind picker. Choose **Conversation only** or **Conversation + files**. File changes are tracked per turn across editing tools, shell commands and subagents, and Git isn't required | [Roll back changes](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/roll-back-changes); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Attention signals | The sidebar shows a yellow `!` when a session needs permission. A `notification` hook can alert on `permission_prompt` | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) |

Rewind has limits. It can't be undone. It restores only files that Copilot changed, and it skips files you edited afterwards or that were too large to back up. It isn't available for remote-backed sessions or while work is in progress ([Roll back changes](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/roll-back-changes)).

## 9. Review-Based Guardrails

### 9.1 Built-in review commands

| Command | Agent | What it does | Status / source |
|---|---|---|---|
| `/review [PROMPT]` | `code-review` | Analyzes staged and unstaged changes and branch diffs. Reports only issues that matter, such as bugs, security problems and logic errors, and never comments on style. Doesn't modify code. An optional prompt, path or file pattern narrows the scope. Commands it proposes, such as inspecting a diff, still go through approval | Introduced 2026-01-21; listed in the CLI GA announcement (2026-02-25). [Agentic code review](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review); [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) |
| `/security-review [PROMPT]` | `security-review` | "Run a focused security review of active local code changes" with prioritized findings and remediation suggestions. It's "not a full repository security audit" | **Public preview (experimental), announced 2026-06-10.** First shipped in CLI 1.0.51 (2026-05-20); no `--experimental` needed since CLI 1.0.64 (2026-06-23). [Changelog 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| `/rubber-duck [PROMPT]` | `rubber-duck` | A second opinion on plans, code and tests from a *different model family*. The main agent also calls it automatically at high-leverage moments | GA 2026-06-02. [Rubber duck](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck); [Changelog](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) |

> "The rubber duck agent has read-only access to your codebase via the standard exploration tools. It cannot edit files or run commands that change your environment."
> - Source: [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)

The rubber-duck agent groups its findings as **blocking issues**, **non-blocking issues** and **suggestions**, and it says so explicitly when it finds nothing. Copilot consults it after planning a non-trivial change, mid-implementation, after writing tests, and after repeated failures. Each consultation adds latency and model usage ([Rubber duck](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)). Two settings control it: `builtInAgents.rubberDuck` (default `true`) turns it on, and `builtInAgents.rubberDuckAutoInvoke` (default `false`) opts in to additional prompts that nudge Copilot to call it automatically ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).

### 9.2 Official validation practices

GitHub's best-practices guide gives several validation workflows ([Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)):

- **Explore → plan → review → implement → verify → commit**, with **Verify** as an explicit prompt step: "Run the tests and fix any failures".
- **Test-driven development with human review gates.** Ask for failing tests, review and approve them, implement, then review the implementation.
- **Multi-model review.** For example: ``/review Use Claude Opus 5 and GPT-5.3-Codex to review the changes in my current branch against `main`.`` The guide also suggests Codex "as a second opinion for reviewing code produced by other models".
- **Security pass before a pull request** with `/security-review`. Triage high-severity findings first and validate your fixes.
- **Team guidance**: "Review all proposed changes before accepting" and "Use permission allowlists judiciously".

The application card for Copilot agents adds a general principle: users are responsible for reviewing and testing generated code and executed commands ([Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)).

### 9.3 Creator↔reviewer loop with custom agents (synthesized; advisory)

This pattern combines three documented building blocks:

- A writer agent with edit and execute tools.
- A read-only reviewer agent limited to `read` and `search` tools, which follows the "view/grep/glob (read-only) for auditing" pattern.
- Explicit invocation by name from the main agent.

The frontmatter keys follow the [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration) reference and the [CLI command reference — Custom agent frontmatter fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) (`include-custom-instructions`). R2 covers the keys in depth. Restart the CLI after you create agent files ([Creating custom agents for CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)).

**`.github/agents/implementer.agent.md`**

```markdown
---
name: implementer
description: Implements one scoped step of an approved plan.md, then runs the project's tests. Use for code changes.
tools: ["read", "search", "edit", "execute"]
include-custom-instructions: true
---

You implement exactly one plan step per invocation.
- Change only the files the step requires.
- Run the project's test command after editing and report the result.
- Return a list of every file you changed.
```

> - Source: [Custom agents configuration — Tools / Tool aliases](https://docs.github.com/en/copilot/reference/custom-agents-configuration); [CLI command reference — Custom agent frontmatter fields](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: synthesized. YAML frontmatter must start on the file's first line, so the attribution is placed beside the block.

**`.github/agents/reviewer.agent.md`**

```markdown
---
name: reviewer
description: Read-only reviewer. Checks changed files against plan.md for bugs, security issues and plan conformance. Never edits files.
tools: ["read", "search"]
include-custom-instructions: true
---

You are a strict reviewer. You cannot edit files or run commands.
Review only the files you are given. Report findings as:
BLOCKING: issues that must be fixed. NON-BLOCKING: issues that should be fixed. If there are no findings, reply "NO FINDINGS".
```

> - Source: [Comparing CLI customization features — "view/grep/glob (read-only) for auditing"](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features); [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration) | Provenance: synthesized

**Orchestrating prompt (main session, after `/plan` approval)**

```text
Use the implementer agent to implement step 1 of the approved plan.
Then use the reviewer agent to review the files the implementer changed against plan.md.
If the reviewer reports BLOCKING findings, send them back to the implementer and repeat,
at most 2 review rounds. Finish by running /review on the working tree.
```

> - Source: [Creating and using custom agents for GitHub Copilot CLI — Using a custom agent (explicit instruction)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) | Provenance: synthesized prompt

**What this loop does and doesn't enforce.** The main agent carries out the routing from reviewer to implementer, the two-round cap and the final `/review` because the prompt asks it to. Nothing in the runtime enforces them, so the session can end with unresolved BLOCKING findings. The reviewer's read-only `tools` list is the only part that's enforced at runtime.

Hooks don't turn this into a deterministic loop either. A `subagentStop` hook receives `agentName` and the subagent's full `response` before the parent sees it. It can return `decision: "block"` to make **that same subagent** continue, using `reason` as its next prompt, or `modifiedResponse` to redact or reformat the result ([Hooks reference — subagentStop, agentStop / subagentStop decision control](https://docs.github.com/en/copilot/reference/hooks-reference)). Blocking the read-only reviewer makes the reviewer keep working, not the implementer. It can't apply fixes, and the 8-block runaway guard still applies. The matcher table doesn't list `subagentStop`, so a script has to filter on `agentName` itself. A `subagentStart` hook, which does support a `matcher` on the agent name, can prepend shared policy text to a subagent's first message through `additionalContext` ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).

Treat the loop as a quality aid. The enforceable gate is outside the agent: required CI checks, branch protection and human pull request review before merge ([Risks and mitigations for cloud agent](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations); [Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).

## 10. Security Considerations

### 10.1 Threat model

GitHub's agentic security principles name three primary risk classes for agents: **data exfiltration**, **impersonation and action attribution**, and **prompt injection**. The same post sets out these rules: make all context visible, firewall the agent, limit access to sensitive information, prevent irreversible state changes without a human, attribute actions to both the initiator and the agent, and gather context only from authorized users ([How GitHub's agentic security principles make our AI agents as secure as possible](https://github.blog/ai-and-ml/github-copilot/how-githubs-agentic-security-principles-make-our-ai-agents-as-secure-as-possible/)). The post is written about the hosted coding agent, but the risk classes apply equally to a local CLI agent.

> "If not, malicious users could hide directives and trick repository maintainers into running agents with bad directives."
> - Source: [How GitHub's agentic security principles make our AI agents as secure as possible](https://github.blog/ai-and-ml/github-copilot/how-githubs-agentic-security-principles-make-our-ai-agents-as-secure-as-possible/)

**Prompt injection channels relevant to the CLI**, and the controls GitHub documents for each:

| Channel | Documented mitigations | Source |
|---|---|---|
| Repository files, including untrusted clones, instructions, agents, skills and hooks | Launch only from trusted folders. Workspace MCP, repository hooks in `-p` and project extensions need trust or an explicit opt-in. `/add-dir` is a trust decision. The docs warn against directories with executables you can't be sure you trust | [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Web content | URL approvals, `--deny-url` and `deniedUrls`, `web_fetch` SSRF protection, validated redirects, and the sandbox network policy (`allowedHosts`/`blockedHosts`) | [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| MCP servers | Every MCP tool call needs permission. The reference rates trust as built-in high, repository and workspace medium, and remote low, with review "Always". Tool output is filtered by `filterMapping`, which defaults to `hidden_characters` and removes hidden or control characters. Enterprise allowlists are covered in R3 and R7 | [CLI command reference — MCP server trust levels, Filter mapping](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Issue and comment text (cloud agent, for contrast) | Hidden characters are filtered and HTML comments aren't passed to the agent. Only users with write access can trigger it | [Risks and mitigations for cloud agent](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations) |

Cloud agent guidance includes a principle that also suits CLI automation: when input from untrusted users could reach the prompt, "you choose exactly which tools an automation can use" to limit the impact of prompt injection ([Risks and mitigations for cloud agent](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations)). In the CLI, the equivalent tools are `--available-tools`, deny rules and per-agent `tools` lists. That mapping is this report's inference.

### 10.2 Built-in hardening in the CLI

- **Command safety analysis** flags destructive commands, exfiltration patterns and credential reads ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **An environment-variable denylist** blocks inline assignment of variables that can run arbitrary code. Blocked categories include `LD_*`/`DYLD_*`, `GIT_CONFIG_*`, `GIT_SSH_COMMAND`, `PATH`, `BASH_ENV`, `PAGER` and `EDITOR` ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Directory-scoped access by default**, with permission prompts for file modifications and potentially dangerous commands ([Application card](https://docs.github.com/en/copilot/responsible-use/agents)).
- **Content exclusion** policies are respected for Copilot Business and Copilot Enterprise ([About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)).
- **Local sandboxing** (experimental in the CLI) restricts the filesystem, network, credential injection (`sandbox.auth.git`, `sandbox.auth.gh`), subprocesses and the macOS keychain. It's off by default. Built-in file tools run inside the CLI process, so they honor the sandbox policy only on a "best-effort basis" ([About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)).

> "Local sandboxing is turned off by default."
> - Source: [About cloud and local sandboxes for GitHub Copilot](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)

### 10.3 Secrets

- `--secret-env-vars` masks values. By default, the values of `GITHUB_TOKEN` and `COPILOT_GITHUB_TOKEN` are "redacted from output". For variables you name explicitly, the two references word the effect differently, as described in §5.3. Neither documents removing the variable from child-process environments. Masking protects logs and transcripts. It doesn't stop a shell command, hook or MCP server that can read the value from using or sending it. Isolate credentials by not exporting unneeded secrets, by using the sandbox credential-injection and network controls, and by running secret-bearing steps separately ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference); [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)).
- Authentication tokens are stored in the system credential store. If no credential store is found, the login docs say the token falls back to a plain-text file under `~/.copilot/`. The settings reference instead describes `storeTokenPlaintext` (default `false`) as the switch that allows plain-text storage. See §12 ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).
- `copilot mcp add --show-secrets` can print sensitive values. Use it only in trusted environments ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- Hooks and transcripts can capture secrets. Redact before logging, and remember that `--share` and `--share-gist` transcripts "may contain sensitive information" ([Hooks tutorial](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks); [Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)).
- The best-practices guide says to never commit secrets, adding: "Copilot is designed to avoid this, but always verify" ([Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)).

## 11. Configuration, Best Practices and Pitfalls

### 11.1 Least-privilege checklist (practitioner level)

1. **Launch from the repository root, never from your home directory**, and trust folders permanently only when you are sure they are safe ([About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)).
2. **Use narrow grants instead of allow-all.** For example, `--allow-tool='shell(git:*)'` combined with `--deny-tool='shell(git push)'`. Put deny rules on the commands you never want to run, and avoid `permissionRequest` hooks that return `allow` in sessions that rely on those deny rules (§7.6) ([Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).
3. **In automation, shrink the tool surface** with `--available-tools`. Leaving out `task` stops subagent fan-out, and leaving out `web_fetch` removes the fetch tool ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)).
4. **Give reviewers and auditors read-only `tools` lists**, and treat `task` and `general-purpose` as having full parent privileges ([About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)).
5. **Use hooks for programmable policy**, starting in logging-only mode. Put denials in `preToolUse`, where any deny wins, and make those scripts fail closed. Remember that timeouts fail open and that `permissionRequest` outputs merge so that the last one wins (§7.6–7.7). Hooks complement deny flags, the sandbox and CI checks; they don't replace them ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference); [Hooks tutorial](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks)).
6. **Pair `--allow-all` or autopilot with isolation**, either local sandboxing (experimental) or a cloud sandbox, VM or container, and always set `--max-autopilot-continues` ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools); [About GitHub Copilot CLI — Risk mitigation](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)).
7. **Plan, review and roll back.** Use `/plan` for multi-file work, `/review` or `/security-review` before a pull request, and `/undo` or `/rewind` when a turn goes wrong ([Best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices); [Roll back changes](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/roll-back-changes)).
8. **Audit and reset regularly.** Check `/list-dirs` and `~/.copilot/permissions-config.json`, and use `/reset-allowed-tools` after an exploratory session ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).

### 11.2 Pitfalls

| Pitfall | Why it matters | Source |
|---|---|---|
| Approving a tool "for the rest of the session" | Approval covers the whole tool, so one `rm` approval allows any `rm` command | [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) |
| Relying on path and URL detection in complex shell commands | Detection is heuristic. Obfuscated URLs, URLs inside files and custom variables are missed | [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli) |
| Approving `https://` and expecting `http://` to be covered | The CLI treats them as different protocols, each needing its own approval | [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli) |
| Using `write(dir/*)` globs in deny rules | Deny `write(PATH)` has "no glob support yet" | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Expecting deny rules in `permissions-config.json` | That file stores allow decisions only. Use flags or settings for denials | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |
| Exporting `COPILOT_ALLOW_ALL=true` in CI | Also trusts the working directory and loads its hooks, MCP servers, plugins and skills | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Treating user-level hooks as unbypassable | A repository's `settings.json` with `disableAllHooks: true` skips them. Only policy hooks survive | [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) |
| Slow policy hooks | Timeouts fail open, even for admin policy hooks | [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) |
| Printing two JSON objects from a hook | The combined output is invalid JSON, which is treated as no decision | [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) |
| Treating plan mode as a hard lock | Shell commands with unclear effects and MCP calls are let through | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Assuming a deny flag beats every hook | `permissionRequest` hooks run before rule checks and short-circuit them, later outputs override earlier ones, and the docs don't say whether a hook `allow` overrides `--deny-tool` | [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) |
| Treating `--secret-env-vars` as credential isolation | It's documented as masking values in output. It isn't documented as removing variables from the environments of commands, hooks or MCP servers | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference) |
| Expecting `--deny-tool='write(PATH)'` to protect a file from allowed scripts | `write` governs tools "other than shell commands". An allowed `npm test` or build script can still change the file | [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli) |
| Treating stop-hook retries or agent review loops as merge gates | `block` continues the same agent and is limited by the runaway guard. Review loops are driven by prompts. Use required CI checks and human review instead | [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference) |
| Autopilot with limited permissions | Approval-requiring calls are auto-denied, so the task may stall | [Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot) |
| `--plan --mode autopilot` | Skips human approval of the plan | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Sandbox on Windows with `deniedPaths` or a proxy | That policy is rejected and the sandboxed command fails | [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes) |

### 11.3 Demo-ready scenarios for the session

These scenarios are suggestions synthesized from the documented features above. Each one is low-risk to run live. The whole deck is 60 minutes across all assignments, so this report proposes **one primary R4 demo**, with alternatives the caller can swap in if time allows.

**Demo eligibility (lifecycle rule).** Every demo below uses only features with a dated label or dated release evidence from §2.2, and each is labeled where it appears. These features are deliberately left out of demos:

- **Assisted approval.** Its current experimental gating is unconfirmed.
- **Hook events without dated introduction evidence.** These are `permissionRequest`, `subagentStart`, `userPromptTransformed`, `notification` and `preCompact` (§12).
- **Local and cloud sandboxing.** Both are experimental in the CLI.

**Primary demo, about 5 minutes: deny beats allow, then the policy hook.** Lifecycle: the CLI permission flags are part of the GA CLI (2026-02-25). Path-scoped `write(PATH)` denial and malformed-pattern rejection shipped in CLI 1.0.71 (2026-07-16). Hooks are listed in the CLI GA announcement (2026-02-25). The `preToolUse` `matcher` has been honored since CLI 1.0.36 (2026-04-24), and hook errors have denied tool calls since 1.0.57 (2026-06-01). None of these has a separate status label.

1. Start `copilot --available-tools='bash,edit,view,grep,glob' --allow-tool='shell(git:*)' --deny-tool='shell(git push)'` and ask Copilot to commit and push. The commit runs and the push is refused ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)).
2. With the §7.8 hook committed, plus the tutorial's temporary `COPILOT_HOOKS_DENY_DEMO` rule, run `copilot -p "Run a test command: echo COPILOT_HOOKS_DENY_DEMO"` and show the hook's denial reason. The folder must be trusted for repository hooks to load in `-p` ([Hooks tutorial](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)).

**Alternatives for the caller to choose from:**

- **Plan, then build (about 5 minutes).** Plan mode and autopilot are both listed in the CLI GA announcement (2026-02-25). Use `/plan` for a small feature, show `plan.md`, then **Accept plan and build on autopilot** with limited permissions to show auto-denials ([Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot); [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)).
- **Review stack (about 4 minutes).** Run `/review` (listed in the CLI GA announcement, 2026-02-25), then `/security-review` (**public preview, experimental**, announced 2026-06-10; no `--experimental` needed since CLI 1.0.64, 2026-06-23), then `/rubber-duck What edge cases are missing?` (**GA**, 2026-06-02) on the same diff. Label `/security-review` as preview on the slide ([Rubber duck](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck); [Changelog 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)).
- **Rollback (about 2 minutes).** Undo/rewind is listed in the CLI GA announcement (2026-02-25). The **Conversation + files** choice without a Git requirement shipped in CLI 1.0.78 (2026-08-03); no separate status label. Run `/undo`, choose **Conversation + files**, then `! git status` ([Roll back changes](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/roll-back-changes); [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)).

## 12. Research Limitations

- **Conflicting default for the autopilot continuation limit.** The autopilot concept page says autopilot "pauses after 5 automatic continuation messages" by default. The command reference lists `--max-autopilot-continues=COUNT` with "default: unlimited". This report recommends always setting the value explicitly ([Autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- **Three descriptions of the permission prompt.** The concept and how-to pages show a three-option prompt. The reference documents `y`/`n`/`!`/`#`/`?` keys and Once / This location / Always. The allowing-tools page describes "don't ask again in this repo". The UI probably varies by request type and CLI version. Check it live before showing screenshots ([About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)).
- **Older hook pages conflict with the reference.** The concept page says `postToolUse` fires "whether successful or failed". The reference says it fires on success only and adds `postToolUseFailure`. The tutorial says `sessionStart` output is ignored, while the reference says `additionalContext` is consumed. This report follows the more detailed reference ([About hooks](https://docs.github.com/en/copilot/concepts/agents/hooks); [Hooks tutorial](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).
- **The type of `toolArgs` is ambiguous.** The reference says `unknown` and the tutorial says a JSON string. The example script handles both.
- **Whether config-file hooks honor `modifiedArgs` isn't fully clear.** The `preToolUse` decision table lists `modifiedArgs`, and the GA changelog says hooks "can deny or modify tool calls". But the `userPromptSubmitted` note mentions "the same runtime split as `preToolUse`" between SDK and config-file hooks. Verify argument rewriting in your environment before relying on it ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference); [GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)).
- **`"ask"` under `--allow-all` is undocumented.** No source states whether a hook's `ask` decision forces a prompt when allow-all is on.
- **Write-path globs are contradictory.** The pattern table shows `write(src/*.ts)` as an example. The deny note says "no glob support yet", and the programmatic reference says wildcards apply only to `shell` and `url`. Treat `write` globs as unsupported.
- **Plain-text token storage.** The `copilot login` section says tokens fall back to a plain-text file when no credential store exists. The settings reference describes `storeTokenPlaintext` (default `false`) as the opt-in that allows plain-text storage ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)).
- **Assisted permission mode is thinly documented.** No CLI page explains `/permissions assisted` beyond one sentence, which says it "still prompts for each request" but "can auto-approve". The dated evidence is: shipped behind experimental mode in CLI 1.0.69 (2026-07-07); `/permissions` shipped in CLI 1.0.78 (2026-08-03); behavior changes in 1.0.90 and 1.0.91. No GA or preview label was found, and no dated source confirms whether it still requires experimental mode. It carries only the shipped-version wording and isn't used in demos ([copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md)).
- **Lifecycle evidence for features in this report.** Following the brief's lifecycle convention:
  - **Explicit labels:** Copilot CLI GA (2026-02-25), rubber duck GA (2026-06-02), and `/security-review` public preview, experimental (2026-06-10). For `/security-review`, the official changelog dates the first release to CLI 1.0.51 (2026-05-20) and the removal of the `--experimental` requirement to CLI 1.0.64 (2026-06-23). No later GA announcement was found.
  - **Shipped-version wording:** behaviors with dated changelog evidence but no explicit label, such as path-scoped `write(PATH)` denial, `preToolUse` fail-closed and exit-code-2 handling, the `agentStop` runaway guard and file-restoring rewind, use the "shipped in CLI `<version>` (`<date>`); no separate status label" wording in §2.2.
  - **No dated introduction evidence found:** policy hooks and the `permissionRequest`, `subagentStart`, `subagentStop`, `agentStop`, `userPromptTransformed`, `notification`, `preCompact` and `postToolUseFailure` events. For `agentStop`, only its runaway guard and `stop_hook_active` are dated, to CLI 1.0.72 (2026-07-20). These events are documented in the current hooks reference but get no lifecycle label in this report and are kept out of demos; the §7.9 `agentStop` example is a synthesized illustration, not a demo. The earliest dated mentions found are fixes, not introductions: CLI 1.0.49 (2026-05-18) for `subagentStart`/`subagentStop` firing on sub-agent tool calls, and CLI 1.0.62 (2026-06-13) for Claude-format `permissionRequest` matchers.
  
  Sources: [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md); [Changelog 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference).
- **Subagent permission inheritance is only partly documented.** The docs explicitly cover the `task` agent (same grants and denials), plan-mode helper subagents and memory writes. No single page states that every custom-agent subagent inherits session allow/deny rules and approvals. Section 6.1 marks the related statement as an inference.
- **Prompt-injection guidance aimed at the CLI is limited.** Most explicit prompt-injection material in GitHub's docs targets the cloud agent and hosted agents. The CLI mitigations in §10 are the documented controls, and mapping them to injection channels is partly this report's synthesis.
- **Unanswered: `disableAllHooks` and folder trust.** The docs don't say whether a repository's `disableAllHooks` is honored before the folder is trusted.
- **Unresolved: deny rules versus `permissionRequest` hooks.** "Deny rules always take precedence over allow rules" is documented for rule evaluation: flags, saved approvals and `--allow-all`. The hooks reference separately documents that `permissionRequest` hooks run *before* the rules engine, that their `allow` or `deny` short-circuits the normal flow, and that later hook outputs override earlier ones. No source reconciles the two. Whether a hook `allow` can override `--deny-tool` is unknown and wasn't tested at runtime. The order in which `preToolUse` and `permissionRequest` run relative to each other also isn't stated (§7.6) ([Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).
- **Different wording for `--secret-env-vars`.** The command reference says it will "Redact an environment variable from shell and MCP server environments". The programmatic reference says the value is "redacted in output". For the default tokens, the command reference says "redacted from output". Neither page documents removing the variable from child-process environments, so this report treats the option as output masking only (§5.3, §10.3) ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)).
- **Hook-based validation has limits.** `agentStop` and `subagentStop` `block` decisions continue the same agent and stop after 8 consecutive blocks, and timeouts fail open. The §7.9 example deliberately allows completion after one retry without re-running tests. None of these mechanisms is a completion or merge gate. The report recommends required CI checks and human review instead (§7.9, §9.3) ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)).
- **Scope of write rules.** `write` permissions are documented for tools "other than shell commands". This report infers that an allowed shell command, including project test and build scripts, isn't constrained by `write(PATH)` deny rules. No source states that inference outright (§5.4) ([Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)).
- **No runtime validation.** None of the examples or recipes were run. They were checked statically against the documentation.
- **How the sources were read.** The two longest reference pages exceeded reader limits, so they were read from their source Markdown in `github/docs` ([cli-command-reference.md](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-command-reference.md); [cli-config-dir-reference.md](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-config-dir-reference.md)). Liquid variables such as `{% data variables.copilot.copilot_cli_short %}` render as product names on docs.github.com. Other docs pages were read through the docs.github.com article API. The `/hooks-reference` page was additionally checked with WebIQ browse.
- **Dates.** docs.github.com pages show no last-updated date, so their facts reflect retrieval on 2026-10-05. Model names in the docs, such as `claude-sonnet-4.6` and `gpt-5.4`, are outside R4's scope and weren't validated.
- **Scope exclusions.** Organization and enterprise controls are only cross-referenced; R7 covers them. These include `permissions.disableBypassPermissionsMode`, MDM and server-managed settings, policy hooks deployment, the enterprise MCP allowlist and the managed sandbox floor. MCP configuration files (R3), `/fleet` and `/delegate` (R5), and the full `.agent.md` key reference (R2) are excluded. Under the brief's editor exclusion, IDE-specific approval announcements aren't used, so the CLI's assisted-mode status stays unestablished rather than being inferred from another surface. No third-party sources were used.

## 13. Complete Reference List

### Documentation (docs.github.com)

1. [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)
2. [Using hooks with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks)
3. [About hooks for GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/hooks)
4. [Using hooks with Copilot CLI for predictable, policy-compliant execution (tutorial)](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks)
5. [Allowing and denying tool use](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools)
6. [Configuring GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/configure-copilot-cli)
7. [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)
8. [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
9. [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)
10. [GitHub Copilot CLI programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference)
11. [Allowing GitHub Copilot CLI to work autonomously (autopilot)](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot)
12. [Best practices for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices)
13. [Requesting a code review with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review)
14. [About the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)
15. [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)
16. [Creating and using custom agents for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)
17. [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
18. [Comparing GitHub Copilot CLI customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features)
19. [Running tasks in parallel with the `/fleet` command](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)
20. [Rolling back changes made during a GitHub Copilot CLI session](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/roll-back-changes)
21. [About cloud and local sandboxes for GitHub Copilot](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)
22. [Application card: GitHub Copilot Agents](https://docs.github.com/en/copilot/responsible-use/agents)
23. [Risks and mitigations for GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations)

### Articles and Changelog (github.blog)

24. [GitHub Copilot CLI is now generally available (2026-02-25)](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)
25. [GitHub Copilot CLI: Plan before you build, steer as you go (2026-01-21)](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/)
26. [Copilot CLI: Improved UI, rubber duck, prompt scheduling, and voice input (2026-06-02)](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/)
27. [Dedicated security review command now available in Copilot CLI (2026-06-10)](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/)
28. [How GitHub's agentic security principles make our AI agents as secure as possible](https://github.blog/ai-and-ml/github-copilot/how-githubs-agentic-security-principles-make-our-ai-agents-as-secure-as-possible/)

### GitHub Repositories

29. [github/copilot-cli — changelog.md (latest entry 1.0.91, 2026-10-01; dated version evidence used in §2.2)](https://github.com/github/copilot-cli/blob/main/changelog.md)
30. [github/docs — cli-command-reference.md (source Markdown)](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-command-reference.md)
31. [github/docs — cli-config-dir-reference.md (source Markdown)](https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-config-dir-reference.md)

### Code Samples

Each code sample in this report is labeled with its provenance (verbatim, adapted or synthesized) beside the block. The samples draw on:

- **Hooks:** sources 1 (hooks reference: configuration formats, payload schemas, decision contracts) and 4 (hooks tutorial: the policy script and test commands).
- **Permissions and flags:** sources 5, 6, 8, 9, 10 and 11.
- **Custom agents:** sources 16, 17 and 18.
- **Long reference pages, read from source:** sources 30 and 31.

No separate code repositories were used.
