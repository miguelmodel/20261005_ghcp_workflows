# Research Report: Enterprise and Organization Governance for Copilot Agents (Appendix)

**Date:** 2026-10-05
**Researcher:** Copilot Web Researcher Agent
**Topic slug:** copilot-governance-appendix
**Sources consulted:** 54 cited — 39 GitHub Docs pages (docs.github.com) and 15 GitHub Changelog posts (github.blog/changelog); 0 third-party sources cited (one third-party article was read for background only and isn't counted; see §12)
**Required MCP:** verified - WebIQ-MCP; tools used: web, browse, news

> Assignment R7 of the brief "Subagents & Multi-Agent Orchestration with GitHub Copilot CLI" (appendix). Boundaries: practitioner-level CLI permissions, hooks and the tool-approval model → **R4**; CLI MCP configuration files and what subagents inherit → **R3**; `.agent.md` keys and precedence in depth → **R2**; cloud agent, the GitHub Copilot app and third-party agents in depth → **R6**; pricing, AI credits and billing → **R8/R9** (cross-reference only). JetBrains and other editors are excluded under the brief, even where an official table lists them.
>
> Docs pages on docs.github.com carry no publication date. Each one is cited as "read 2026-10-05". Changelog posts are cited with their publication dates.

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overview and Key Concepts](#2-overview-and-key-concepts)
3. [Admin Control → Effect on CLI Subagents (Summary Table)](#3-admin-control--effect-on-cli-subagents-summary-table)
4. [Policies That Gate the CLI, Agents and Models](#4-policies-that-gate-the-cli-agents-and-models)
5. [Enterprise Managed Settings (`managed-settings.json`)](#5-enterprise-managed-settings-managed-settingsjson)
6. [MCP Governance](#6-mcp-governance)
7. [Org and Enterprise Custom Agents, Skills, Plugins and Policy Hooks](#7-org-and-enterprise-custom-agents-skills-plugins-and-policy-hooks)
8. [Visibility: Audit Logs, Agent Sessions, Usage Metrics and OpenTelemetry](#8-visibility-audit-logs-agent-sessions-usage-metrics-and-opentelemetry)
9. [Content Exclusion](#9-content-exclusion)
10. [Network Controls](#10-network-controls)
11. [Practical Guidance: Rollout Recipe and Pitfalls](#11-practical-guidance-rollout-recipe-and-pitfalls)
12. [Research Limitations](#12-research-limitations)
13. [Complete Reference List](#13-complete-reference-list)

---

## 1. Executive Summary

**The answer.** In Copilot Business and Copilot Enterprise, three administrator-controlled governance mechanisms decide what a Copilot CLI subagent can do before any `.agent.md` file or command-line flag applies. The grouping is conceptual, not a precedence order; §5.2 and §5.6 cover how layers actually combine.

1. **GitHub policies (AI Controls on GitHub.com).** These switch the CLI, cloud agent, models, MCP and content exclusion on or off.
2. **Client managed settings (`managed-settings.json`).** These set floors and ceilings inside the client: bypass mode, permission rules, MCP allow/deny lists, plugins, sandbox and telemetry. One set of keys reaches the client through three channels: a `.github-private` repository (server-managed), native MDM, or a root-owned file on the device.
3. **Host-level controls.** These are machine-wide **policy hooks** installed by IT with elevated privileges. They are a separate mechanism from managed settings and end users can't modify them.

A subagent runs inside the parent CLI session, so it can only use what these layers allow. This is an inference: the docs specify subagent inheritance only in part (see R4 and §12). ([Administering Copilot CLI for your enterprise](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise); [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference))

**Why it matters for this deck.** Several behaviours that practitioners see in the CLI are admin decisions, not bugs:

- An MCP server is "blocked by your enterprise".
- `--yolo` or `--allow-all` is silently suppressed.
- A custom agent's pinned model is replaced by the session model.
- An org-level agent appears in `/agent` without a matching file in the repository.

([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))

**Key takeaways (status and source date in brackets):**

- **The Copilot CLI has its own client policy.** An admin must enable it for Business and Enterprise users [CLI GA, 2026-02-25]. `/delegate` additionally needs the **Copilot cloud agent** policy. ([CLI GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/); [Administering Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise))
- **Use `allowedMcpServers` / `deniedMcpServers` in managed settings for MCP governance** [GA, 2026-08-06]. They are enforced in the GitHub Copilot app, Copilot CLI and VS Code, but **not** in Copilot cloud agent. The older registry approach ("Restrict MCP access to registry servers" → **Registry only**) is **public preview, not prioritized for development**, and users can bypass it by editing configuration files. ([MCP allowlists changelog](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/); [MCP server usage in your company](https://docs.github.com/en/copilot/concepts/enterprise/mcp-management))
- **`managed-settings.json` is GA** [2026-07-01; MDM and file delivery for the CLI GA 2026-07-08]. It can disable bypass ("YOLO") mode, impose deny/ask/allow rules, pin plugins and marketplaces, enforce a sandbox floor and export OpenTelemetry. Not every key has its own GA label; §2.3 gives per-key status. ([GA changelog](https://github.blog/changelog/2026-07-01-enterprise-managed-settings-json-is-generally-available/); [MDM changelog](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli/))
- **Org and enterprise custom agents reach the CLI, but at the *lowest* priority.** They are the "Remote" tier, so a user or repository agent with the same ID wins. These agents are a distribution mechanism, not an enforcement mechanism. Org-level custom agents are labeled **public preview** (docs, read 2026-10-05). ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Preparing to use custom agents in your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents))
- **Enforced hooks come through two channels.** Machine-wide **policy hooks** can't be turned off with `disableAllHooks`, and they run on the host even when the session is sandboxed (documented; no dated status found). The second channel is managed plugins (`enabledPlugins`), which GitHub describes as a way to define "hooks and MCP configurations that are always enabled across your enterprise". ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference); [Enterprise-managed plugins changelog, 2026-05-06](https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/))
- **Date to flag to admins: October 22, 2026.** On that date the new **Default policy for new features** begins applying to unconfigured GA features, including the **MCP servers in Copilot** policy. Its default is "Enabled". ([Default availability](https://docs.github.com/en/copilot/concepts/enterprise/default-availability); [Changelog, 2026-09-24](https://github.blog/changelog/2026-09-24-default-enablement-of-copilot-features-for-copilot-business-and-enterprise/))
- **The usage dashboard does not show CLI activity, and the agent-sessions documentation doesn't establish coverage of local CLI subagents.** The usage-dashboard reference says "These charts do **not** include Copilot CLI usage". The enterprise agent-sessions view is described in terms of cloud agent and custom-agent task sessions (§8.2). The documented local observability paths are the usage-metrics API fields (`used_cli`, `totals_by_cli`, `totals_by_custom_agent`, `totals_by_mcp`) and managed OpenTelemetry export. ([Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics); [Agent management for enterprises](https://docs.github.com/en/copilot/concepts/enterprise/agent-management); [OpenTelemetry for agent monitoring](https://docs.github.com/en/copilot/concepts/enterprise/opentelemetry))
- **Two security controls became GA in September 2026.** Managed `permissions.deny` / `ask` / `allow` rules went GA on 2026-09-09 in the GitHub Copilot app, Copilot CLI and VS Code Agent Host sessions. CLI content exclusion went GA on 2026-09-02. ([Managed permissions changelog](https://github.blog/changelog/2026-09-09-enterprise-managed-permissions-for-github-copilot-agent-operations/); [Content exclusions changelog](https://github.blog/changelog/2026-09-02-content-exclusions-generally-available-in-copilot-app-and-cli/))

---

## 2. Overview and Key Concepts

### 2.1 The three control planes

This grouping by where a control is administered is conceptual, not a precedence hierarchy. Managed settings reach the client through three channels (server, MDM, file), and §5.2 and §5.6 explain how those channels combine.

| Plane | Where it lives | Who sets it | What it governs for the CLI | Primary source |
|---|---|---|---|---|
| **AI Controls policies** | Enterprise **AI controls** tab (Agents, Copilot, Features & clients, MCP pages) and organization **Settings → Copilot → Policies** | Enterprise owners, users with the "Manage enterprise AI controls" custom role permission, and organization owners | Whether the CLI, cloud agent, models, MCP, content exclusion and Copilot Memory are available | [Policies concept](https://docs.github.com/en/copilot/concepts/enterprise/policies); [Managing enterprise policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies) |
| **Enterprise managed settings** | `copilot/managed-settings.json` in a `.github-private` repository (server-managed), native MDM values, or a root-owned file on the device | Enterprise owners and AI managers; IT for MDM and file delivery | In-client behaviour: bypass mode, permission rules, MCP allow/deny, plugins, sandbox, telemetry, default model | [Getting started](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started); [Deploying managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings) |
| **Device and repository controls** | Policy hook directories, repository content exclusion, cloud agent firewall ("Internet access") | IT (policy hooks); repository and organization admins (exclusion, firewall) | Programmable pre-tool checks, excluded context, egress for delegated or cloud sessions | [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference); [Content exclusion](https://docs.github.com/en/copilot/concepts/context/content-exclusion); [Firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) |

The managed settings file supplements the AI Controls policies; it doesn't replace them:

> "The configuration in `managed-settings.json` is in addition to the policies available in the **AI Controls** tab in enterprise settings."
> - Source: [Enterprise managed-settings.json is generally available (2026-07-01)](https://github.blog/changelog/2026-07-01-enterprise-managed-settings-json-is-generally-available/)

### 2.2 Who a policy applies to, and how conflicts resolve

- **Scope.** Policies generally apply to users on the enterprise or organization's Copilot plan. In an enterprise, enterprise owners set each policy first and can delegate with "Let organizations decide". For cloud agent, the enterprise can pick specific organizations. A separate **Policies for enterprise-assigned users** setting covers users licensed directly by the enterprise. ([Policies concept](https://docs.github.com/en/copilot/concepts/enterprise/policies))
- **Multiple licenses.** Within one enterprise, "the least restrictive policy usually applies, but there are some exceptions". Across different enterprises, "the most restrictive policy across enterprises almost always applies". ([Policies concept](https://docs.github.com/en/copilot/concepts/enterprise/policies))
- **CLI and app are separate.**

  > "The GitHub Copilot app and Copilot CLI are governed by separate, independent client policies, so you can allow one without allowing the other."
  > - Source: [GitHub Copilot policies for enterprises and organizations](https://docs.github.com/en/copilot/concepts/enterprise/policies)

- **Not every policy reaches every surface.** The official matrix warns that the table "documents whether specific policies apply to different surfaces, but does not necessarily reflect whether the equivalent functionality is available." ([Supported surfaces for policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies))

### 2.3 Lifecycle status at a glance

Labels follow the brief's rule. "GA" or "public preview" is used only when an official source states it. Items with no dated evidence are marked "documented; no dated status found" and are kept out of labeled claims and demos.

| Capability | Status | Source and date |
|---|---|---|
| Copilot CLI (admin must enable for Business/Enterprise) | **GA** | [CLI GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), 2026-02-25 |
| `managed-settings.json`, server-managed via `.github-private` | **GA** | [Changelog](https://github.blog/changelog/2026-07-01-enterprise-managed-settings-json-is-generally-available/), 2026-07-01 |
| MDM and file-based delivery for CLI and VS Code | **GA** | [Changelog](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli/), 2026-07-08 |
| Managed settings in the Copilot app and cloud agent | Shipped 2026-07-27; no separate status label | [Changelog](https://github.blog/changelog/2026-07-27-enterprise-managed-settings-now-apply-to-the-github-copilot-app/), 2026-07-27 |
| Enterprise-team overrides (`overridable`, `team-mappings.json`) | Shipped 2026-08-03; no separate status label | [Changelog](https://github.blog/changelog/2026-08-03-enterprise-team-specialization-for-managed-settings/), 2026-08-03 |
| `allowedMcpServers` / `deniedMcpServers` | **GA** | [Changelog](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/), 2026-08-06 |
| Managed-settings in-product validator | Shipped 2026-09-25; no separate status label | [Changelog](https://github.blog/changelog/2026-09-25-enterprise-managed-settings-in-product-validator/), 2026-09-25 |
| MCP registry URL + "Restrict MCP access to registry servers" | **Public preview** ("not prioritized for development") | [MCP server usage in your company](https://docs.github.com/en/copilot/concepts/enterprise/mcp-management), read 2026-10-05 |
| `disableBypassPermissionsMode` | Introduced 2026-06-17; listed among the GA keys on 2026-07-01 | [Changelog](https://github.blog/changelog/2026-06-17-enterprise-managed-settings-now-support-bypass-permission-controls/); [GA changelog](https://github.blog/changelog/2026-07-01-enterprise-managed-settings-json-is-generally-available/) |
| Managed plugins (`enabledPlugins`, `extraKnownMarketplaces`, `strictKnownMarketplaces`) | Public preview 2026-05-06 → listed among the GA keys 2026-07-01 | [Preview changelog](https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/); [GA changelog](https://github.blog/changelog/2026-07-01-enterprise-managed-settings-json-is-generally-available/) |
| Managed `permissions.deny` / `ask` / `allow` rules | **GA** in the GitHub Copilot app, Copilot CLI and VS Code sessions that use Agent Host. Not supported in cloud agent | [Changelog](https://github.blog/changelog/2026-09-09-enterprise-managed-permissions-for-github-copilot-agent-operations/), 2026-09-09; [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings), read 2026-10-05 |
| Content exclusion in Copilot CLI (and the Copilot app) | **GA** for Copilot Business and Copilot Enterprise | [Changelog](https://github.blog/changelog/2026-09-02-content-exclusions-generally-available-in-copilot-app-and-cli/), 2026-09-02 |
| Local and cloud sandboxes (the managed `sandbox` key builds on them) | **Public preview** | [Changelog](https://github.blog/changelog/2026-06-02-cloud-and-local-sandboxes-for-github-copilot-now-in-public-preview/), 2026-06-02 |
| Global model policy ("Default availability for released models") | **GA**; rollout 2026-08-26 → 2026-09-01 | [Changelog](https://github.blog/changelog/2026-08-26-global-model-policy-generally-available/), 2026-08-26 |
| "Default policy for new features" | Configurable now; **takes effect 2026-10-22** | [Changelog](https://github.blog/changelog/2026-09-24-default-enablement-of-copilot-features-for-copilot-business-and-enterprise/), 2026-09-24 |
| Org-level custom agents (`.github` / `.github-private` `/agents/`) | **Public preview** (page banner) | [Org prep](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents), read 2026-10-05 |
| Remote (org/enterprise) skills in the CLI | Documented; no dated status found | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), read 2026-10-05 |
| Policy hooks (machine-wide, CLI only) | Documented; no dated status found | [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference), read 2026-10-05 |
| Third-party coding agents (Claude, Codex) | **Public preview** | [About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents), read 2026-10-05 |
| Audit-log streaming of agent session events | **Public preview** (EMU and data-residency enterprises) | [Monitoring agentic activity](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity), read 2026-10-05 |
| Single unified policy for cloud agent + Copilot Chat on github.com + Mobile | Announced for "no earlier than September 28th, 2026"; rollout **not verified** | [Changelog](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/), 2026-08-28 |

---

## 3. Admin Control → Effect on CLI Subagents (Summary Table)

A subagent runs inside the parent CLI session. Anything that gates the session therefore also gates its subagents. The rows below say "inference" wherever the docs don't state the subagent effect explicitly. "Docs" means docs.github.com, read 2026-10-05.

| Admin control (exact name / key) | Where it's set | Effect on the CLI and its subagents | Status (source date) |
|---|---|---|---|
| **Copilot CLI** client policy ("Enabled everywhere" / "Disabled everywhere" / "Let organizations decide") | AI controls → Copilot → Features & clients → Clients | Off means no CLI session, and therefore no subagents. Users need a seat **and** the policy enabled in at least one licensing org | GA (2026-02-25); [docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise) |
| **Copilot cloud agent** policy (incl. "Enabled for selected organizations") | AI controls → Agents | Required, together with the CLI policy, for `/delegate`. `copilot --cloud` sessions inherit cloud agent policies | Policy documented ([docs](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent)); cloud sandboxes public preview (2026-06-02); unified-policy change announced 2026-08-28 |
| **Configure models** + **Default availability for released models** | AI controls → Copilot (models) | The CLI, and therefore each subagent, sees only enabled models. An agent's `model`/`models` that can't be honored falls back to the session model, unless the agent sets `modelPolicy: "required"`, in which case dispatch is refused | Global model policy GA (2026-08-26) |
| Managed `model` / `autoTier` | `managed-settings.json` | Sets the default model or Auto tier for new conversations. A bare `autoTier` string locks the tier. `autoTier` needs CLI ≥ 1.0.87-0 | Managed settings GA (2026-07-01); `autoTier` documented, no separate label |
| `permissions.disableBypassPermissionsMode` (`"disable"` / `"allow-auto-only"`) | `managed-settings.json` (server, MDM, file) | Suppresses `--yolo`, `--allow-all*`, `/yolo` and `/allow-all`. A session, and so its subagents, can't be escalated to allow-all (subagent effect is an inference) | Introduced 2026-06-17; GA key 2026-07-01 |
| `permissions.deny` / `ask` / `allow` | `managed-settings.json` | Enforces deny > ask > allow. Operations that match no rule default to "ask". A managed `ask` can't be satisfied by bypass mode, hooks or persisted grants | GA (2026-09-09); CLI, app and VS Code Agent Host only, not cloud agent |
| `allowedMcpServers` / `deniedMcpServers` | `managed-settings.json` | Non-matching or denied MCP servers are blocked. Malformed lists fail closed. Built-in default servers are exempt. Applying these lists to agent-profile `mcp-servers` and plugin-provided servers is an inference (§6.5) | GA (2026-08-06) |
| **MCP servers in Copilot** | AI controls → MCP | Must be enabled for any MCP server to run. Covered by the 2026-10-22 default-feature policy | Documented; default-policy change takes effect 2026-10-22 |
| **MCP Registry URL** + **Restrict MCP access to registry servers** ("Allow all" / "Registry only") | AI controls → MCP (enterprise or org) | CLI v1.0.11+ enforces ID/name matching against the registry. Users can bypass it by editing config. The CLI's evaluate check fails closed. Doesn't apply to cloud agent | Public preview, not prioritized |
| `enabledPlugins` / `extraKnownMarketplaces` / `strictKnownMarketplaces` | `managed-settings.json` | Force-installs (or blocks) plugins, which can ship agents, skills, hooks and MCP servers, and restricts marketplaces. Pinned entries can't be changed locally | GA keys (2026-07-01) |
| Enterprise / org **custom agents** (`/agents/*.md` in `.github-private` or `.github`) | Governance repository | Appear in the CLI as the lowest-priority "Remote" agents. User, project and plugin agents with the same ID override them | Org level: public preview (docs) |
| Remote org/enterprise **skills** | Org/enterprise (no admin page found) | "projected via the AHP relay"; fetched when invoked | Documented; no dated status |
| **Policy hooks** (`/etc/github-copilot/policy.d/*.json`, `C:\ProgramData\GitHub\Copilot\policy.d\*.json`, `HKLM\Software\Policies\GitHub\Copilot`) | Device (IT) | Load before all other hooks, can't be disabled by `disableAllHooks`, and run on the host even when sandboxed. Timeouts fail open (R4). CLI only | Documented; no dated status |
| `sandbox` (floor) | `managed-settings.json` | Forces the sandbox on, can block execution if it's unavailable, can sandbox local MCP/LSP servers, and narrows filesystem and network access | Sandboxes public preview (2026-06-02) |
| `telemetry` | `managed-settings.json` | OTel traces, metrics and events for sessions, including tool and model calls. Content capture is off by default and can be locked | Telemetry keys listed for MDM GA (2026-07-08) |
| **Content exclusion** | Repo / org / enterprise settings | Excluded files are not used as context in the CLI. This is context filtering, not an OS-level access boundary (§9) | GA in the CLI (2026-09-02) |
| **Store local sessions in the Cloud** | AI controls (policy) | Must be at least "View from cloud" for CLI session sync. Disabled or unconfigured means local-only storage | Documented; no dated status |
| Cloud agent firewall ("Internet access") | Org / repo Copilot settings | Applies to `/delegate`d cloud work and `--cloud` sandboxes, not to local CLI subagents | Documented; no dated status |
| Subscription-based network routing | Corporate firewall | Copilot CLI is in scope. Allowlist `*.business.githubcopilot.com` / `*.enterprise.githubcopilot.com` and block `*.individual.githubcopilot.com` | Documented; no dated status |

Sources for the table: [Administering Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise); [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [MCP private registry enforcement](https://docs.github.com/en/copilot/reference/enterprise-administrators/mcp-private-registry-enforcement); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference); [Session data](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data); [Firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall); [Network routing](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access/manage-network-access); plus the changelog posts dated in the Status column.

---

## 4. Policies That Gate the CLI, Agents and Models

### 4.1 Copilot CLI client policy

- **Location.** Enterprise → **AI controls** → **Copilot** → "Features & clients" → **Configure features & clients** → "Clients" section → Copilot CLI. ([Administering Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise))
- **Required for Business and Enterprise users:**

  > "For Copilot Business and Enterprise subscribers, an administrator must enable Copilot CLI from the Policies page."
  > - Source: [GitHub Copilot CLI is now generally available (2026-02-25)](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)

- **Troubleshooting order.** The user needs a seat. An "Enabled everywhere" or "Disabled everywhere" enterprise setting overrides organizations. Under "Let organizations decide", the CLI "must be enabled in **at least one** of the organization granting them a GitHub Copilot license". ([Administering Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise))
- **Controls the CLI page says *do* apply:** CLI enablement, model selection, enterprise-configured custom agents, content exclusion, MCP server policies, cloud agent enablement (for `/delegate`), audit logging of policy changes, and seat assignment. **Controls that don't apply:** "IDE-specific policies". ([Administering Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise))

### 4.2 Copilot cloud agent, `/delegate` and `--cloud`

> "Both the Copilot CLI policy and the Copilot cloud agent policy must be enabled for users to be able to use the `/delegate` command in Copilot CLI."
> - Source: [Administering Copilot CLI for your enterprise](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise)

- **Policy location and states.** Enterprise → AI controls → **Agents** → "Available agents" → **Copilot Cloud Agent**. Admins choose a global policy. With **Enabled for selected organizations**, organizations can be picked individually in the UI or by custom property through the REST API. ([Enabling Copilot cloud agent in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent))
- **Custom-property caveat:**

  > "Please note that using custom properties to enable CCA is evaluated once at the time of configuration. Organizations will not be automatically enabled or disabled for CCA if the custom property is added, removed, or modified later."
  > - Source: [Agent management for enterprises](https://docs.github.com/en/copilot/concepts/enterprise/agent-management)

- **Cloud sessions started from the CLI inherit cloud agent policy:**

  > "Cloud sandbox policies inherit from Copilot cloud agent policies, so existing security controls like firewall rules extend to cloud sandboxes without additional setup."
  > - Source: [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)

- **Upcoming change (pending verification).** A changelog post dated 2026-08-28 says that "No earlier than September 28th, 2026", Copilot Chat on github.com, Copilot Chat in Mobile and cloud agent will relaunch as one experience, and "The separate policies for these experiences will be replaced by a single policy". Admins configure it under **Copilot cloud agent (coming soon)**. Rollout completion was not confirmed by 2026-10-05 (§12). ([Upcoming changes to GitHub Copilot policies and billing](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/))

### 4.3 Third-party agents (Claude, Codex)

- **Status.** "Third-party coding agents are currently in public preview." The supported agents are Anthropic Claude and OpenAI Codex. ([About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents))
- **Independent of cloud agent:**

  > "Disabling or restricting Copilot cloud agent does not automatically disable third-party agents, and vice versa. Each agent type must be configured independently."
  > - Source: [Agent management for enterprises](https://docs.github.com/en/copilot/concepts/enterprise/agent-management)

- **Scope is GitHub.com, not the CLI.** "These policies govern third-party agent usage on GitHub.com." In the organization's cloud agent settings, the toggles **Allow Claude coding agent** and **Allow Codex coding agent** install the `anthropic code agent` and `openai code agent` GitHub Apps. Their actions appear in the audit log. ([Agent management for enterprises](https://docs.github.com/en/copilot/concepts/enterprise/agent-management); [About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents))
- **Agent apps.** Enterprise owners can also enable third-party "agent apps", and organization owners then choose which agents to allow. ([Enabling Copilot cloud agent in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent)) The docs read for this report describe no CLI-side effect of these policies. R6 covers Agent HQ terminology and usage.

### 4.4 Model policies and what they mean for subagent model pins

- **The CLI follows enterprise model enablement:**

  > "Users can only access AI models that are enabled at the enterprise level. When you enable or disable models in your enterprise settings, those changes are reflected in Copilot CLI."
  > - Source: [Administering Copilot CLI for your enterprise](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise)

- **Global default ("Default availability for released models").** Enforcement rolled out from 2026-08-26 through September 1. Unconfigured GA models move to "Delegate to default policy". Open-weight models and models not covered by GitHub's data retention agreement stay disabled by default. ([Global model policy generally available](https://github.blog/changelog/2026-08-26-global-model-policy-generally-available/); [Default availability](https://docs.github.com/en/copilot/concepts/enterprise/default-availability))
- **Effect on custom agents and subagents.** This is what admins need to explain to agent authors:

  > "A declared model or effort that can't be honored falls back to the session's value instead of failing the dispatch—unless the agent declares `modelPolicy: "required"`, in which case dispatch is refused rather than silently substituting an unauthored model."
  > - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

  For `models` lists, "The runtime uses the first model the user's plan can access". So a prioritized list survives a model being disabled by policy better than a single pin does. See R2 for authoring. ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference))
- **Custom models and BYOK.** Enterprise- and org-provided custom models ("Configure custom models") are selectable in the CLI. Locally supplied keys are not:

  > "Separately, users can also provide their own LLM keys locally. This is not controlled by enterprise policies."
  > - Source: [Administering Copilot CLI for your enterprise](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise)

  The CLI-only managed key `forceLoginOrgs` closes this gap at the device level. It pins sign-in to listed organizations, and "BYOK/API-key authentication is refused with an actionable error". It "fails closed" and should be delivered through MDM or the file channel. A repository-level `.github/allowed_models.txt` can restrict built-in models per repository but "cannot filter out custom models added using the bring your own API keys (BYOK) method". ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))

### 4.5 Preview features and the October 22, 2026 default

- **"Default policy for new features."** This policy is configurable now and starts applying on **October 22, 2026** to unconfigured GA features on the "Features & clients" page, plus **Copilot code review** and **MCP servers in Copilot**. Its options are **Enabled**, **Disabled** and **Let organizations decide**.

  > "This policy is enabled by default. If you don't take action, unconfigured features will be enabled on October 22."
  > - Source: [About default availability of Copilot features and models](https://docs.github.com/en/copilot/concepts/enterprise/default-availability)

- **Preview features stay opt-in.** "The policy does **not** apply to features in preview." The changelog adds that "Preview features remain opt-in." The exceptions include **Store local sessions in the Cloud** for Copilot CLI and VS Code. ([Default availability](https://docs.github.com/en/copilot/concepts/enterprise/default-availability); [Changelog, 2026-09-24](https://github.blog/changelog/2026-09-24-default-enablement-of-copilot-features-for-copilot-business-and-enterprise/))
- **No CLI preview switch for admins.** According to the official matrix, the **Editor preview features** policy applies only to IDEs, not to Copilot CLI. The CLI's `experimental` flag (`--experimental`, `/experimental`) is a user setting and isn't among the documented managed keys. No admin control for CLI experimental features was found (§12). ([Supported surfaces for policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))

### 4.6 Policy-to-CLI applicability (official matrix, CLI column)

Read from the "Copilot CLI" column of the official table. Icons were parsed from their accessible labels. ([Supported surfaces for GitHub Copilot policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies))

| Policy name | Applies to Copilot CLI? | Note |
|---|---|---|
| Editor preview features | No | IDEs only |
| Copilot can search the web | No | Use managed `Domain(...)` rules or the sandbox network policy for CLI egress (§10.3) |
| Configure custom models | Yes | |
| Suggestions matching public code | No | |
| MCP servers in Copilot | Yes | Also applies to cloud agent, third-party agents, the app and code review |
| Restrict MCP access to registry servers | Yes | Not cloud agent or third-party agents |
| Content exclusion | Yes | |
| Configure models | Yes | |
| Copilot Memory | Yes | In the CLI, "Only the root agent can call `store_memory` or `vote_memory`". Subagents keep read access ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)) |

---

## 5. Enterprise Managed Settings (`managed-settings.json`)

### 5.1 What it is and where it lives

> "With enterprise managed settings, you can centrally define and distribute configuration settings for GitHub Copilot to supported clients. This ensures everyone works within the guardrails you define, with the option to specialize settings for different teams."
> - Source: [Getting started with enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started)

- **Server-managed (the default).** Create a `.github-private` repository in one organization. GitHub provides a template at `github.com/docs/custom-agents-template`. Select that organization under AI controls → **Agents** → "Configuration source", then commit `copilot/managed-settings.json` to the default branch. ([Creating a `.github-private` repository](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/create-github-private-repo); [Getting started](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started))
- **Reach.**

  > "The governance settings in this repository apply to all users who receive a Copilot license from your enterprise or any of its organizations, regardless of whether the user has access to the `.github-private` repository or the organization that owns it."
  > - Source: [Getting started with enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started)

  GitHub recommends **internal** visibility, and restricting who can edit the file to administrators and AI managers. Repository rulesets can protect the file. ([Getting started](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started); [Creating a `.github-private` repository](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/create-github-private-repo))
- **Legacy path.** Early posts used `.github-private/.github/copilot/settings.json`. The supported path is `copilot/managed-settings.json`, with "backward compatibility for `.github/copilot/settings.json`". ([GA changelog, 2026-07-01](https://github.blog/changelog/2026-07-01-enterprise-managed-settings-json-is-generally-available/); [Bypass controls changelog, 2026-06-17](https://github.blog/changelog/2026-06-17-enterprise-managed-settings-now-support-bypass-permission-controls/))
- **Supported clients.** The CLI, VS Code, the GitHub Copilot app and Copilot cloud agent are supported, plus JetBrains, which is out of scope here. "not every client supports every property." ([Getting started](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started))

### 5.2 Delivery channels, refresh and precedence

| Channel | Location / mechanism | Reaches | Refresh |
|---|---|---|---|
| Server-managed | `copilot/managed-settings.json` (+ `copilot/team-mappings.json`, `copilot/teams/*.json`) in `.github-private` | "Only applies to users who receive a GitHub Copilot license from your enterprise". Includes cloud agent | About hourly; a restart or new sign-in refreshes immediately |
| Native MDM | Windows: `REG_SZ` values under `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\GitHubCopilot`. macOS: forced managed preferences for `com.github.copilot`. Linux: not supported | Local clients; "Applies to the user regardless of where they receive their GitHub Copilot license" | Hourly checks, no restart needed |
| File-based | macOS `/Library/Application Support/GitHubCopilot/managed-settings.json`; Windows `%ProgramFiles%\GitHubCopilot\managed-settings.json`; Linux `/etc/github-copilot/managed-settings.json` | Local clients, regardless of license source | Restart the client |

Source: [Choosing how to deploy enterprise-managed settings to users](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings).

- **File hardening for the CLI.** On macOS and Linux the file must be "a regular file owned by `root`" that is not group- or world-writable, and must not be a symbolic link. "The CLI rejects files that do not meet these requirements." ([Deploying managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings))
- **Precedence across channels, as documented:** MDM → server-managed → file-based → user-level settings. The exception is that `sandbox` and `permissions.deny`/`ask`/`allow` "are composed in the most restrictive direction across different delivery methods." ([Deploying managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings)) The sources describe the merge differently; see the conflict note in §5.6.
- **All CLI entry points are covered:**

  > "Managed settings apply uniformly across every session-hosting mode—interactive, `-p`, `--acp`, `--ahp-host`, and `--server`—so enterprise MCP, permission, and plugin policy can't be bypassed by starting a session through a different entry point."
  > - Source: [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)

- **Long-running sessions.** "Long-running sessions re-fetch and re-apply managed settings hourly, so policy changes—for example, an organization enabling `permissions.disableBypassPermissionsMode`—take effect without restarting the session." ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))

### 5.3 Keys that shape CLI subagents

Supported-client marks are read from the reference table's accessible labels. Only the clients in scope are shown. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings))

| Key | Purpose (reference wording, condensed) | CLI | VS Code | Copilot app | Cloud agent |
|---|---|:-:|:-:|:-:|:-:|
| `permissions.disableBypassPermissionsMode` | Disables bypass / YOLO-style allow-all | ✓ | ✓ | ✓ | ✗ |
| `permissions.deny` / `ask` / `allow` | Block / always prompt / pre-approve specific operations | ✓ | ✓ (Agent Host sessions) | ✓ | ✗ |
| `features.computerUse` | Controls whether users can enable computer use | ✓ | ✗ | ✓ | ✗ |
| `model` | Default model for new conversations | ✓ | ✓ | ✓ | ✓ |
| `autoTier` | Default Auto routing tier | ✓ | ✓ | ✗ | ✗ |
| `enabledPlugins` / `extraKnownMarketplaces` / `strictKnownMarketplaces` | Pin plugins, add marketplaces, restrict marketplaces | ✓ | ✓ | ✓ | ✓ |
| `telemetry` | OpenTelemetry export | ✓ | ✓ | ✗ | ✗ |
| `remoteControl` | Restrict remote control of sessions hosted on the device | ✓ | ✓ | ✓ | ✗ |
| `allowedMcpServers` / `deniedMcpServers` | MCP allow/deny lists | ✓ | ✓ | ✓ | ✗ |
| `sandbox` | Minimum local sandbox restrictions | ✓ | ✗ | ✓ | ✗ |

The CLI also documents device-channel keys that the cross-client reference doesn't list: `forceLoginOrgs`, `forceRemoteSettingsRefresh`, `policyHelper` and `shellShortcut`. ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)) The docs say `policyHelper` is accepted but "the runtime doesn't yet invoke the helper—helper execution ships in a future release". ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))

**Bypass mode in the CLI.**

> "In Copilot CLI, all of the command line options for allowing all permissions (`--yolo`, `--allow-all`, and the individual `--allow-all-tools`, `--allow-all-paths`, and `--allow-all-urls` options) are suppressed at startup and cannot grant elevated permissions. The `/yolo` and `/allow-all` slash commands are also blocked."
> - Source: [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)

The CLI also accepts `"allow-auto-only"`, which blocks full allow-all "while still permitting `/permissions assisted`". An unrecognized value is enforced as `"disable"` ("fail-closed default"). ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)) Bypass controls apply only to interactive clients: "Bypass-prompt controls only apply to the interactive clients (i.e., the app, Copilot CLI, and VS Code)." ([Changelog, 2026-07-27](https://github.blog/changelog/2026-07-27-enterprise-managed-settings-now-apply-to-the-github-copilot-app/))

**Managed permission rules (GA, 2026-09-09).** Rules use `Shell(...)` (alias `Bash(...)`; `PowerShell(...)` is case-insensitive), `Read(...)`, `Edit(...)` (alias `Write(...)`) and `Domain(...)`. Precedence is deny > ask > allow. Deny and ask rules combine as a union across sources, while allow lists combine as an intersection. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))

> "These controls are generally available in the GitHub Copilot app, GitHub Copilot CLI, and Visual Studio Code sessions that use Agent Host."
> - Source: [Enterprise managed permissions for GitHub Copilot agent operations (2026-09-09)](https://github.blog/changelog/2026-09-09-enterprise-managed-permissions-for-github-copilot-agent-operations/)

The announcement says these rules cover "shell commands, file reads and edits, and network domains". It also says "Managed restrictions can’t be weakened by user or workspace settings, auto-approval, or previously saved approvals." Copilot cloud agent isn't a supported client for these keys (see the key table above). ([Changelog, 2026-09-09](https://github.blog/changelog/2026-09-09-enterprise-managed-permissions-for-github-copilot-agent-operations/); [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings))

> "A managed `ask` rule can't be satisfied by bypass mode (also known as allow-all or YOLO mode), an auto-approval setting, a hook or other approval shortcut, or a grant persisted from an earlier approval."
> - Source: [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)

In the CLI, `Edit(...)`/`Write(...)` rules also cover shell redirections and in-place `sed` edits when the target path can be determined. ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)) R4 covers user-level permission flags and subagent inheritance.

**Sandbox floor.** `sandbox.enabled: true` can't be overridden by `--no-sandbox` or `/sandbox disable`. `failIfUnavailable: true` "blocks model and tool execution instead of allowing commands to fail or run unsandboxed". `allowBypass: false` prevents commands from running outside the sandbox. `sandboxMcpServers: true` requires local MCP servers to run in the sandbox. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)) The underlying local and cloud sandboxes are **public preview** (2026-06-02). ([Changelog](https://github.blog/changelog/2026-06-02-cloud-and-local-sandboxes-for-github-copilot-now-in-public-preview/))

### 5.4 Example `managed-settings.json` for a CLI-subagent rollout

Every key and value shape below comes from the official reference and examples. The marketplace and plugin names (`contoso-plugins`, `contoso/copilot-plugins`, `security-hooks`) are illustrative.

```jsonc
// Source: https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings (adapted from "Example configuration"). Remove this comment line before committing: the docs show plain JSON and don't say whether comments are accepted.
{
  "model": "auto",
  "permissions": {
    "disableBypassPermissionsMode": "disable",
    "deny": ["Shell(rm -rf *)", "Read(~/.ssh/**)", "Edit(//etc/**)"],
    "ask": ["Shell(git push *)"]
  },
  "allowedMcpServers": [
    { "serverUrl": "https://api.githubcopilot.com/*" },
    { "serverCommand": ["npx", "@playwright/mcp@latest"] }
  ],
  "deniedMcpServers": [
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "/"] }
  ],
  "extraKnownMarketplaces": {
    "contoso-plugins": {
      "source": { "source": "github", "repo": "contoso/copilot-plugins" },
      "autoUpdate": true
    }
  },
  "strictKnownMarketplaces": [
    { "source": "github", "repo": "contoso/copilot-plugins" }
  ],
  "enabledPlugins": {
    "security-hooks@contoso-plugins": true
  },
  "telemetry": {
    "enabled": true,
    "endpoint": "https://otel-collector.example.com",
    "protocol": "http/protobuf",
    "captureContent": false,
    "lockCaptureContent": true,
    "serviceName": "copilot"
  }
}
```
> - Source: [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings) | Provenance: adapted

Notes:

- With a non-empty `strictKnownMarketplaces`, the CLI applies the allowlist to built-in marketplaces too. "an empty array (`[]`) hides and blocks every marketplace, including built-ins". ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)) The plugins page lists `copilot-plugins` and `awesome-copilot` as marketplaces "added by default". The example above would therefore also block those two unless they're added to the list (an inference from the two pages). ([About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins))
- Because `permissions.deny`/`ask` are present, any operation that matches no rule "defaults to requiring approval". ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings))
- `sandbox` is left out because sandboxes are in public preview. Add it only after piloting.

### 5.5 Team overrides and validation

```jsonc
// Source: https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started (adapted: three files shown in one block)
// File 1: .github-private/copilot/managed-settings.json
{ "model": { "overridable": "auto" } }
// File 2: .github-private/copilot/teams/no-auto.json
{ "model": "unmanaged" }
// File 3: .github-private/copilot/team-mappings.json
{ "no-auto.json": ["special-team"] }
```
> - Source: [Getting started with enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started) | Provenance: adapted

- **Ceilings and floors.** Keys that aren't marked overridable remain enterprise decisions. A user who belongs to several teams gets the **least restrictive** value for each key:

  > "If a user belongs to multiple teams, the team-level settings are combined using the least restrictive value for each key, then applied beneath the enterprise file."
  > - Source: [Enterprise team specialization for managed settings (2026-08-03)](https://github.blog/changelog/2026-08-03-enterprise-team-specialization-for-managed-settings/)

- **Validation.** AI controls → **Agents** → "Copilot settings validation" reports malformed JSON, unsupported configurations and invalid team mappings, with the file and JSON path. "If the validator finds no issues, the "Copilot settings validation" section isn't displayed." ([Getting started](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started); [Validator changelog, 2026-09-25](https://github.blog/changelog/2026-09-25-enterprise-managed-settings-in-product-validator/))

### 5.6 Enforcement caveats and source conflicts

1. **Server outage on first run.**

   > "In Copilot CLI, if a request for server-managed settings fails and no cached response is available, the server-managed policy is unavailable for that session. For restrictions that must remain available without a server response, use MDM-managed or file-based settings."
   > - Source: [Choosing how to deploy enterprise-managed settings to users](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings)

2. **License source.** Server-managed settings follow the signed-in account's license. A user licensed by another enterprise, or a personal Pro user on the same laptop, doesn't receive them. Device channels apply regardless of license. ([Deploying managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings))
3. **⚠️ Merge semantics differ between sources.** Test on a pilot device before relying on any of these:
   - The deploy page lists MDM → server → file → user precedence, with most-restrictive composition for `sandbox` and `permissions.*`. ([Deploying managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings))
   - The 2026-07-08 changelog says "the highest-precedence channel wins outright". ([MDM changelog](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli/))
   - The CLI reference says MDM and server values are "resolved **per key**". It also says "For most keys, user settings can override that baseline", but later says "Most managed keys lock the entire row: a local edit is silently overridden by the managed value on the next load". ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))
   - For MCP lists, the allowlist page says "all the settings apply". A deny from any source blocks, and a server must match the allowlist "at every layer that defines one". ([Configure enterprise allowlist](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist))

   Report recommendation: treat MCP lists, `permissions.*` and `sandbox` as most-restrictive-wins, the documented exceptions. Verify everything else on a pilot device.
4. **Two different Windows registry roots.** Managed settings use `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\GitHubCopilot`. CLI policy hooks use `HKLM\Software\Policies\GitHub\Copilot`. ([Deploying managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings); [Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference))
5. **Plugin pins lock per entry, not per key.** For `enabledPlugins` and `extraKnownMarketplaces`, "a plugin or marketplace pinned by a managed policy can't be re-enabled, disabled, or repointed locally, but other entries in the same map remain fully user-controlled". Use `strictKnownMarketplaces` to stop users adding marketplaces. ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))

### 5.7 Testing a device channel on a single Windows demo machine

Production rollout goes through your MDM platform. The snippet below writes the documented string values locally to test a policy on one machine. It needs an elevated PowerShell session.

```powershell
# Source: https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings (synthesized from the "Native MDM delivery" table)
#Requires -RunAsAdministrator
$ErrorActionPreference = 'Stop'
$policyPath = 'HKLM:\SOFTWARE\Policies\GitHubCopilot'
try {
    if (-not (Test-Path -Path $policyPath)) {
        New-Item -Path $policyPath -Force | Out-Null
    }
    # All native MDM values must be REG_SZ strings; structured values are JSON text.
    New-ItemProperty -Path $policyPath -Name 'permissions.disableBypassPermissionsMode' -Value 'disable' -PropertyType String -Force | Out-Null
    New-ItemProperty -Path $policyPath -Name 'deniedMcpServers' -Value '[{"serverCommand":["npx","-y","@modelcontextprotocol/server-filesystem","/"]}]' -PropertyType String -Force | Out-Null
    Get-ItemProperty -Path $policyPath | Format-List
}
catch {
    Write-Error "Failed to write Copilot managed settings: $($_.Exception.Message)"
    exit 1
}
```
> - Source: [Choosing how to deploy enterprise-managed settings to users](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings) | Provenance: synthesized (the key names, registry path and "values must be strings / JSON text" rule are documented; this script was not run)

---

## 6. MCP Governance

### 6.1 The on/off switch: **MCP servers in Copilot**

> "The **MCP servers in Copilot** policy defines whether MCP servers can run at all across Copilot clients. We recommend keeping this policy enabled and, if necessary, restricting the MCP servers that users can run to an approved list."
> - Source: [MCP server usage in your company](https://docs.github.com/en/copilot/concepts/enterprise/mcp-management)

- **Location.** Enterprise → AI controls → **MCP**. For organizations, the policy is in **Settings → Copilot → Policies → Features**. ([Restrict MCP server access to a custom registry](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/restrict-based-on-registry))
- **Scope note.** "The **MCP servers in Copilot** policy controls use where MCP server support is generally available (GA)." It does not govern the GitHub MCP server in third-party hosts. ([Managing enterprise policies](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies))
- **Default status is about to change.** "Copilot cloud agent and use of third-party MCP servers are disabled by default." The **MCP servers in Copilot** policy is also one of the policies covered by the **Default policy for new features**. If an enterprise leaves the policy unconfigured and the default policy stays "Enabled", the policy follows the default from 2026-10-22 (§4.5). ([Enabling Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent); [Default availability](https://docs.github.com/en/copilot/concepts/enterprise/default-availability))

### 6.2 Recommended: allowlist/denylist in managed settings (GA, 2026-08-06)

> "Enterprise owners can now centrally control which Model Context Protocol (MCP) servers GitHub Copilot clients are allowed to run by using the new `allowedMcpServers` and `deniedMcpServers` keys in enterprise managed settings."
> - Source: [MCP allowlists in enterprise managed settings (2026-08-06)](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/)

> "This capability is generally available."
> - Source: [MCP allowlists in enterprise managed settings (2026-08-06)](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/)

> "MCP allowlists are currently enforced on the GitHub Copilot app, Copilot CLI and VS Code."
> - Source: [MCP allowlists in enterprise managed settings (2026-08-06)](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/)

The reference table agrees: Copilot cloud agent is ✗ for both keys. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings))

**Matchers.** Each entry contains exactly one matcher. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings))

| Matcher | Matches | Security note |
|---|---|---|
| `serverUrl` | Remote (HTTP/SSE) servers. `*` wildcards are allowed; URLs are canonicalized (lowercase host, Punycode, default port removed, percent-decoded host, and so on) | Use for remote identity |
| `serverCommand` | The exact command and arguments of a local (`stdio`) server. No wildcards | Use for local identity |
| `serverName` | The user-assigned label | "only supplied as a convenience, not a security control, since users can rename servers" ([changelog](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/)) |

**Evaluation order.** Built-in default servers are always allowed. Next, any `deniedMcpServers` match blocks. If `allowedMcpServers` is present, non-matching servers are blocked. Finally, servers whose URL or command contains an unresolved variable are blocked. ([Configuring an MCP server allowlist for your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist))

**Fail-closed behaviour:**

> "If an allowlist or denylist is malformed (for example, has invalid JSON), the client treats the policy as an empty `allowedMcpServers` list. This blocks all servers except built-in default servers."
> - Source: [Configuring an MCP server allowlist for your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist)

> "If the client cannot determine a policy layer because of a retrieval or device-discovery error, it retains the previously enforced policy. The effective policy can become more restrictive, but not less restrictive."
> - Source: [Configuring an MCP server allowlist for your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist)

**Combining sources.** The effective allowlist is the **intersection** of every source that defines one. The effective denylist is the **union** of all sources. Both keys can be made `overridable` for enterprise teams in server-managed deployments. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings); [changelog](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/))

**CLI specifics.** For remote servers, "a match must come from a `serverUrl` entry; `serverName` only counts when no `serverUrl` entries exist". Stdio servers follow the same rule with `serverCommand`. Allowlist `serverName` entries are limited to `[A-Za-z0-9_-]+`. ([CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))

**Prerequisite.** If you are moving from the registry method, set **Restrict MCP access to registry servers** to **Allow all** and optionally clear **MCP Registry URL** "to avoid conflicts with your new allowlist and maintain a single source of truth". ([Configuring an MCP server allowlist](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist))

### 6.3 Legacy alternative: MCP registry + "Registry only" (public preview)

> "This feature is in public preview and is not the recommended method for restricting access to MCP servers. The more secure, generally available method is to define settings in your enterprise's `managed-settings.json` file."
> - Source: [Restrict MCP server access to a custom registry](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/restrict-based-on-registry)

- **Settings.** Configure **MCP Registry URL** (labeled "MCP Registry URL (optional)" for organizations) and **Restrict MCP access to registry servers**, with the options **Allow all** and **Registry only**. "Your chosen policy will immediately apply to developers". For Azure API Center registries, enter the base URL including the workspace path. "Including additional route suffixes like `/v0.1/servers` will cause the registry to error out." ([Restrict based on registry](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/restrict-based-on-registry))
- **Surfaces.** Allowlist enforcement covers Copilot CLI **v1.0.11+** and VS Code **v1.109.3+**. Copilot cloud agent gets neither registry display nor enforcement. ([MCP private registry enforcement](https://docs.github.com/en/copilot/reference/enterprise-administrators/mcp-private-registry-enforcement))
- **Limitations:**

  > "Enforcement is based only on server name/ID matching, which can be bypassed by editing configuration files."
  > - Source: [MCP private registry enforcement](https://docs.github.com/en/copilot/reference/enterprise-administrators/mcp-private-registry-enforcement)

  Under "Registry only", local servers must also be in the registry, with an ID that exactly matches. ([MCP private registry enforcement](https://docs.github.com/en/copilot/reference/enterprise-administrators/mcp-private-registry-enforcement))
- **Multiple seats.** Enterprise policy overrides organization policy. "Registry only" beats "Allow all". When both are equal, the most recently uploaded registry wins. ([MCP private registry enforcement](https://docs.github.com/en/copilot/reference/enterprise-administrators/mcp-private-registry-enforcement))
- **CLI behaviour.** The CLI computes a fingerprint for each non-default server from its command, arguments and remote URL, then calls an enterprise "evaluate" endpoint:

  > "This check is fail-closed: if the evaluate endpoint is unreachable or returns an error, non-default servers are blocked until the policy can be verified."
  > - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

  A blocked server shows the message `MCP server "SERVER-NAME" was blocked by your enterprise "ENTERPRISE-NAME".` If a custom registry URL is configured, `/mcp search`, an experimental command, connects to that registry instead of the GitHub MCP Registry. ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Adding MCP servers for Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers))

**Side-by-side (official comparison):**

| | Managed settings file | Custom registry |
|---|---|---|
| Release phase | Generally available | Public preview, not prioritized for development |
| Enforcement level | Enterprise-wide, overridable for enterprise teams | Enterprise-wide or per organization |
| Server matching | "Secure matching based on name, URL, or `stdio` commands" | "Less secure matching, based on name or ID only. Users can bypass the restriction by editing configuration files." |

Source: [MCP server usage in your company](https://docs.github.com/en/copilot/concepts/enterprise/mcp-management).

### 6.4 Cloud agent MCP is governed differently

> "Private MCP registries apply to Copilot CLI and IDEs, but not to cloud agents that run on GitHub. For Copilot cloud agent, MCP servers can be configured at the repository level or in custom agent profiles defined at the enterprise level."
> - Source: [Agent management for enterprises](https://docs.github.com/en/copilot/concepts/enterprise/agent-management)

Neither the registry policies nor `allowedMcpServers`/`deniedMcpServers` apply to cloud agent. Work handed off with `/delegate` therefore runs under the repository's cloud agent MCP configuration and the **MCP servers in Copilot** policy, not under the CLI user's allowlist. That last point is an inference from the per-client support tables. ([Enabling Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent); [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings))

### 6.5 Enforcement caveats for CLI subagents

- **Built-ins are exempt.** "Built-in default servers are always exempt from allowlist enforcement." The managed-settings reference states that first-party servers such as the built-in GitHub MCP server "cannot be blocked". The CLI's built-in servers are `github-mcp-server`, `playwright`, `fetch` and `time`. The docs don't say whether all four count as "default/first-party" for exemption, so test this before relying on it (§12). Users, not admins, can disable built-ins with `--disable-builtin-mcps` / `--disable-mcp-server`. ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings))
- **Agent-profile and plugin MCP servers (inference).** The docs state the evaluation rules for every server a client runs ("Copilot clients evaluate MCP servers in this order"). They don't exempt servers declared in a custom agent's `mcp-servers` frontmatter or shipped in a plugin. This report therefore treats those servers as subject to the same lists, but no page states this explicitly. ([Configuring an MCP server allowlist](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist))
- **Private npm registries.** The CLI treats `--registry` and similar npm options as value-consuming arguments when it fingerprints a server, "This ensures enterprise allowlist checks and registry verification work correctly when these options appear before the package name". ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference))
- **Sandboxing MCP processes.** The managed `sandbox.sandboxMcpServers: true` setting runs local MCP servers inside the sandbox. Remote servers are not affected. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings))

---

## 7. Org and Enterprise Custom Agents, Skills, Plugins and Policy Hooks

### 7.1 Custom agents defined in `.github-private`

- **Locations.** Repository agents live in `.github/agents/CUSTOM-AGENT-NAME.md`. Organization agents live in `/agents/CUSTOM-AGENT-NAME.md` in the organization's `.github` or `.github-private` repository. Enterprise agents live in `/agents/CUSTOM-AGENT-NAME.md` in the `.github-private` repository of the organization the enterprise owner designated. ([About custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents))
- **Reaching the CLI.** "Enterprise-configured custom agents are available to use with Copilot CLI." The docs list the CLI among the surfaces where custom agents can be used. ([Administering Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise); [About custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents))
- **Lowest priority in the CLI.** The CLI's agent-location table lists six tiers in order: User (`~/.copilot/agents/`), Project (`.github/agents/`, then `.claude/agents/`), Added root, Plugin, and finally **"6 (lowest) | Remote | Organization or enterprise agents"**. "When agents have the same ID, the first agent loaded is used." ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference))

  **Governance implication.** A developer or repository can shadow an enterprise agent by creating an agent with the same ID. Use enterprise agents to *distribute* vetted specialists. Use managed settings, policy hooks and MCP lists to *enforce* behaviour. R2 covers agent precedence and authoring.
- **Protecting agent files.** On the AI controls **Agents** tab, **Create ruleset** under "Protect agent files using rulesets" limits who can edit agent profiles across the enterprise. This "will also block organization owners in your enterprise from creating or editing organization-level custom agents" unless the ruleset is narrowed. ([Preparing to use custom agents in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents))
- **Status.** "Copilot custom agents are in public preview and subject to change." This banner appears on the organization preparation page. ([Preparing to use custom agents in your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents))

### 7.2 Remote (org/enterprise) skills in the CLI

The CLI's skill-location table includes an org/enterprise tier:

> "Skills hosted by your organization or enterprise, projected via the AHP relay. Content is fetched on demand when the skill is invoked."
> - Source: [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

"Remote skills are projected alongside local skills and follow the same name-based priority when a local skill has the same name." ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)) No admin how-to page, changelog entry or status label for publishing org- or enterprise-hosted skills was found. The cross-surface cheat sheet lists only project and personal skill locations. Treat this tier as **documented, status unverified**, and use managed plugins (§7.3) as the documented way to distribute skills enterprise-wide. ([Copilot customization cheat sheet](https://docs.github.com/en/copilot/reference/customization-cheat-sheet))

### 7.3 Managed plugins: the enterprise distribution channel for agents, skills, hooks and MCP

- **What a plugin can carry.** Custom agents (`*.agent.md`), skills (`SKILL.md`), hooks (`hooks.json`), MCP server configurations and LSP configurations. ([About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins))
- **Governance intent:**

  > "You can also strengthen your governance strategy by defining hooks and MCP configurations that are always enabled across your enterprise."
  > - Source: [Enterprise-managed plugins in GitHub Copilot CLI are now in public preview (2026-05-06)](https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/)

- **Keys.** `enabledPlugins` uses `PLUGIN-NAME@MARKETPLACE-NAME: true|false`. `extraKnownMarketplaces` accepts the `github`, `git` or `directory` sources, with an optional `autoUpdate`. `strictKnownMarketplaces` takes an allowlist, and an empty array means "complete lockdown". When users authenticate, the client queries `managed-settings.json` and applies the plugin standards. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings); [About enterprise-managed plugin standards](https://docs.github.com/en/copilot/concepts/enterprise/plugin-standards))
- **Caveat.** A hook delivered by a plugin loads in the plugin tier, which comes after policy, project and user hooks. Plugin hooks run inside the sandbox when it's enabled. Unlike policy hooks, the hooks reference doesn't describe plugin hooks as immune to `disableAllHooks`. For hooks a repository must not be able to switch off, use policy hooks (§7.4). ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference))

### 7.4 Admin-deployed policy hooks (Copilot CLI only)

> "Policy hooks are machine-wide hooks loaded by administrators. They load before all other hooks and cannot be disabled by `disableAllHooks`."
> - Source: [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)

| Source | Location |
|---|---|
| Linux / macOS files | `/etc/github-copilot/policy.d/*.json` (loaded alphabetically; must be root-owned, not group- or world-writable) |
| Windows files | `C:\ProgramData\GitHub\Copilot\policy.d\*.json` |
| Windows registry | `HKLM\Software\Policies\GitHub\Copilot`. Each subkey holds a `Policy` `REG_SZ` value containing a JSON policy document |

Source: [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference).

- **Format.** The same as user and project hooks (`{ "version": 1, "hooks": { ... } }`). Policy hooks "are available regardless of folder trust state" and "require elevated privileges to install. End users cannot modify them." ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference))
- **Sandbox interaction.** "Policy hooks always run on the host, outside the sandbox, even when the session sandbox is enabled. A policy hook should not run scripts from the workspace." ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference))
- **Not for cloud agent.** "Policy hooks are not supported under Copilot cloud agent." ([Hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference))
- **Subagent relevance and pitfalls (R4).** R4 covers `preToolUse`, `subagentStart`/`subagentStop`, the fail-closed vs fail-open behaviour (including timeouts of policy hooks) and a complete example hook. This appendix only covers deployment.

### 7.5 Organization custom instructions don't reach the CLI

The official support matrix lists repository-wide, path-specific, agent (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) and personal instructions for Copilot CLI. **Organization** instructions appear for Copilot Chat, cloud agent and code review on GitHub.com, but not for the CLI. ([Support for different types of custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support)) To give CLI subagents enterprise-wide guidance, distribute it through an agent profile, a skill or a plugin (§7.1–7.3).

---

## 8. Visibility: Audit Logs, Agent Sessions, Usage Metrics and OpenTelemetry

### 8.1 Audit log

- **Policy changes.** "Updates to enterprise policies that affect Copilot CLI are recorded as events in the enterprise audit log." ([Administering Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise))
- **Agent actions.**

  > "You can apply the `actor:Copilot` filter to your enterprise audit log to view agentic activity over the last 180 days."
  > - Source: [Audit log events for agents](https://docs.github.com/en/copilot/reference/enterprise-administrators/agentic-audit-log-events)

  Key fields are `action`, `actor_is_agent` (always `true`), `agent_session_id` and `user`. ([Audit log events for agents](https://docs.github.com/en/copilot/reference/enterprise-administrators/agentic-audit-log-events))
- **Streaming.** "This feature is in public preview and is available for enterprises that use Enterprise Managed Users and for enterprises that use GitHub Enterprise Cloud with data residency." Streamed Copilot API usage records include `type`, `user_id`, `endpoint`, `body` (trimmed at 1 MB, with `truncated`) and `@timestamp`. ([Audit log events for agents](https://docs.github.com/en/copilot/reference/enterprise-administrators/agentic-audit-log-events))
- **Local CLI work is attributed to the user.** When the CLI opens a PR, "Copilot creates a pull request on GitHub.com, on your behalf. You are marked as the pull request author." The docs read for this report don't say whether such actions carry `actor_is_agent`. ([About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli))

### 8.2 Agent sessions view (AI controls)

The "Agents" page shows the three most recent sessions and a 24-hour list. It can be filtered by `agent`, `organization`, `repository`, `status`, `timeframe` and `user`, for example `agent:copilot-cloud-agent`. ([Monitoring agentic activity](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity); [Available filters for agent sessions](https://docs.github.com/en/copilot/reference/enterprise-administrators/agent-session-filters)) An agent session is defined as "an entire interaction with Copilot cloud agent, or any individual custom agent", for example a task that creates a pull request or is assigned an issue. The docs don't list local CLI subagent sessions in this view. ([Agent management for enterprises](https://docs.github.com/en/copilot/concepts/enterprise/agent-management))

### 8.3 Usage metrics: what includes the CLI

- **Coverage.** "Copilot usage metrics are derived from telemetry across multiple Copilot surfaces, including IDE, Copilot CLI, and agent apps activity." ([GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics))
- **The dashboard excludes the CLI.** "These charts do not include Copilot CLI usage." The API and NDJSON exports do include it. ([Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics))
- **CLI-relevant API fields:**

| Field | Scope | Meaning |
|---|---|---|
| `used_cli` | Per-user | "Whether the user used Copilot CLI that day." |
| `totals_by_cli` | Per-user | CLI-specific metrics; omitted when there was no CLI usage |
| `totals_by_custom_agent` / `distinct_custom_agent_use_count` | Per-user | "Top custom agents used in Copilot CLI, ordered by interaction count" |
| `totals_by_mcp` / `distinct_mcp_use_count` | Per-user | MCP servers with the most connection and reconnection attempts in Copilot CLI |
| `totals_by_skill`, `totals_by_plugin`, `totals_by_slash_cmd` | Per-user | Top skills, plugins and slash commands in Copilot CLI |
| `daily_active_cli_users` | Aggregated | "This count is independent of IDE active-user counts and is not included in IDE-based active-user definitions." |
| `ai_credits_used` | Per-user | AI credits consumed. "not broken down by feature, model, or surface" (billing → R8) |

Source: [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics).

- **Freshness and attribution.** Data is available "within two full days". Organization-level reports start on December 12, 2025. Organization metrics follow membership, not the organization that assigned the seat. ([GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics))

### 8.4 OpenTelemetry for session-level traces

OTel exports **traces** (model and tool calls within a session), **metrics** (for example, token usage) and **events**. "By default, the data does not include prompts, responses, or tool arguments." ([OpenTelemetry for agent monitoring](https://docs.github.com/en/copilot/concepts/enterprise/opentelemetry)) The managed `telemetry` key enforces export on the CLI and VS Code. Its sub-keys are `enabled`, `endpoint`, `protocol` (`http/json` or `http/protobuf`), `captureContent`, `lockCaptureContent`, `serviceName`, `resourceAttributes` and `headers`. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)) OTel is the only documented admin channel found that gives step-level visibility into local CLI subagent activity.

### 8.5 Session sync policy

> "For Copilot Enterprise and Copilot Business users, the applicable "Store local sessions in the Cloud" policy must be set to at least "View from cloud" for session data to be synced. If the policy is disabled or unconfigured, sessions are stored locally only."
> - Source: [About GitHub Copilot session data](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data)

"Administrators can control whether syncing is available, but enabling syncing does not give them access to your session data." ([Session data](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data)) Session sync isn't an audit channel.

---

## 9. Content Exclusion

- **Applies to the CLI:**

  > "For Copilot Business and Copilot Enterprise users, Copilot CLI respects content exclusion policies configured at the enterprise, organization, and repository levels. Excluded files are not used as context."
  > - Source: [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)

  The content-exclusion availability table shows "GitHub Copilot CLI" as supported for chat and agent use. The official policy matrix marks **Content exclusion** as applying to Copilot CLI. ([Content exclusion for GitHub Copilot](https://docs.github.com/en/copilot/concepts/context/content-exclusion); [Supported surfaces for policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies))
- **Status: GA in the CLI (2026-09-02).** The release is titled "Content exclusions generally available in Copilot app and CLI":

  > "The GitHub Copilot app and Copilot CLI now respect content exclusion policies configured by enterprise, organization, and repository administrators. Copilot won’t use excluded files as context, helping you protect sensitive code across agentic workflows."
  > - Source: [Content exclusions generally available in Copilot app and CLI (2026-09-02)](https://github.blog/changelog/2026-09-02-content-exclusions-generally-available-in-copilot-app-and-cli/)

  "This is available for Copilot Business and Copilot Enterprise customers." GA settles the release status. It doesn't change the documented limitations below, and it doesn't make content exclusion an OS-level access boundary. ([Changelog, 2026-09-02](https://github.blog/changelog/2026-09-02-content-exclusions-generally-available-in-copilot-app-and-cli/))
- **Who configures it.** Repository administrators, organization owners and enterprise owners. ([Content exclusion](https://docs.github.com/en/copilot/concepts/context/content-exclusion))
- **Documented limitations:**

  > "Currently, content exclusions do not apply to symbolic links (symlinks) and repositories located on remote filesystems."
  > - Source: [Content exclusion for GitHub Copilot](https://docs.github.com/en/copilot/concepts/context/content-exclusion)

  The client also sends the current repository URL to GitHub to fetch the policy. ([Content exclusion](https://docs.github.com/en/copilot/concepts/context/content-exclusion))
- **Gap for agentic use (unverified).** The docs don't say whether content exclusion also stops a CLI agent or subagent from reading an excluded file through a shell command such as `cat`. Managed `Read(...)` rules are documented for "File read and view paths". Unlike `Edit(...)`, they aren't documented as covering shell commands. For secrets that must never reach the model, add sandbox `deniedPaths`, which applies to sandboxed processes, and treat content exclusion as context filtering rather than an access boundary. ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference))

---

## 10. Network Controls

### 10.1 Cloud agent firewall: applies to delegated and cloud sessions

- **Default.** "By default, Copilot's access to the internet is limited by a firewall." A recommended allowlist (OS package repositories, container registries, language registries, certificate authorities, Playwright browser downloads) is enabled by default. ([Customizing or disabling the firewall for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall))
- **Organization controls.** Under **Settings → Copilot → Internet access**: **Enable firewall** (Enabled / Disabled / Let repositories decide), **Recommended allowlist**, **Allow repository custom rules** and **Organization custom allowlist** (domains or URLs). Organization rules "cannot be deleted at the repository level". Copilot cloud agent and Copilot code review have separate sections. ([Firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall))
- **Limitations:**

  > "The firewall only applies to processes started by the agent via its Bash tool. It does not apply directly to Model Context Protocol (MCP) server processes or processes started in configured Copilot setup steps."
  > - Source: [Customizing or disabling the firewall for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall)

  The docs add that "Sophisticated attacks may bypass the firewall". ([Firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall))
- **CLI relevance.** The firewall governs `/delegate`d cloud agent work and `copilot --cloud` sandboxes, which "inherit from Copilot cloud agent policies". It doesn't govern subagents running locally. ([About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli))

### 10.2 Subscription-based network routing (corporate egress)

Copilot CLI is in scope. The routing page lists these affected features: inline suggestions and Copilot Chat in supported IDEs, Copilot Chat on GitHub, GitHub Mobile Apps, and "Copilot CLI". It adds:

> "Copilot subscription-based network routing is enabled for all users. This ensures that users access Copilot through an endpoint that is specific to their Copilot plan."
> - Source: [Managing GitHub Copilot access to your enterprise's network](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access/manage-network-access)

To limit use on the corporate network to company plans, allowlist `*.business.githubcopilot.com` and/or `*.enterprise.githubcopilot.com`, and block `*.individual.githubcopilot.com`. ([Network routing](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access/manage-network-access)) The allowlist reference warns against adding `https://*.githubcopilot.com/*` "if you are using subscription-based network routing". It also recommends the `/meta` API for the general Copilot domains. ([Copilot allowlist reference](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference))

```shell
# Source: https://docs.github.com/en/copilot/reference/copilot-allowlist-reference
gh api meta -q '.domains | .website, .copilot'
```
> - Source: [Copilot allowlist reference](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference) | Provenance: verbatim

### 10.3 Local egress controls for CLI subagents

For local sessions, and therefore local subagents, the documented admin levers are managed `permissions` `Domain(...)` rules and the managed `sandbox.userPolicy.network` settings (`allowOutbound`, `allowLocalNetwork`, `allowedHosts`, `blockedHosts`, `proxy`). ([Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)) Caveat:

> "Network behavior varies by operating system. In particular, an upstream proxy is not a complete egress-control boundary because some applications can ignore proxy settings."
> - Source: [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)

The "Copilot can search the web" policy does **not** apply to the CLI (§4.6).

---

## 11. Practical Guidance: Rollout Recipe and Pitfalls

### 11.1 Ordered rollout for CLI subagents (admin view)

1. **Enable the client.** Set the **Copilot CLI** policy. Enable **Copilot cloud agent** only if `/delegate` or `--cloud` is wanted. Remember that the app has its own policy. (§4.1–4.2)
2. **Decide models before authors pin them.** Configure model policies. Advise agent authors to use `models` priority lists and to reserve `modelPolicy: "required"` for agents where substitution is unacceptable, because that setting makes dispatch fail. (§4.4; R2)
3. **Stand up the governance repository.** Create `.github-private` from the template with internal visibility, select it as the configuration source, and add the agent-file ruleset. (§5.1, §7.1)
4. **Start low-risk.** Commit `{"model": "auto"}`, then confirm it in a client and in the "Copilot settings validation" section. (§5.5)
5. **Add guardrails in this order.** First `disableBypassPermissionsMode`, then managed `deny`/`ask` rules, then `deniedMcpServers`, then `allowedMcpServers`. Re-validate after each step. (§5.3, §6.2)
6. **Distribute specialists.** Publish agents, skills and hooks through a plugin marketplace, then pin them with `enabledPlugins` and lock sources with `strictKnownMarketplaces`. (§7.3)
7. **Cover device-level must-haves.** Deliver non-negotiable keys (bypass, MCP deny, `forceLoginOrgs`) through MDM or the file channel, and install policy hooks with elevated privileges. (§5.2, §7.4)
8. **Turn on visibility.** Enable the managed `telemetry` export, pull the usage-metrics API (`totals_by_custom_agent`, `totals_by_mcp`) and monitor `actor:Copilot` in the audit log. (§8)
9. **Before 2026-10-22,** explicitly configure every feature policy you don't want auto-enabled, including **MCP servers in Copilot**. (§4.5)

### 11.2 Common pitfalls

| Pitfall | Why it happens | Mitigation | Source |
|---|---|---|---|
| Relying on "Registry only" as a security boundary | Matching uses name/ID and can be bypassed by editing config | Use the managed `allowedMcpServers` / `deniedMcpServers` keys | [MCP private registry enforcement](https://docs.github.com/en/copilot/reference/enterprise-administrators/mcp-private-registry-enforcement) |
| Using `serverName` to allow a server | Users choose server names | Match on `serverUrl` / `serverCommand` | [Changelog, 2026-08-06](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/) |
| Expecting an enterprise agent to override a user's agent | Org/enterprise agents are the lowest-priority "Remote" tier | Enforce behaviour with managed settings and hooks, not with agent precedence | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Expecting the CLI allowlist to govern `/delegate`d work | Cloud agent isn't a supported client for the MCP lists | Configure MCP for cloud agent at repository or agent-profile level | [Agent management](https://docs.github.com/en/copilot/concepts/enterprise/agent-management) |
| Server-managed policy missing on a new laptop | No cache and a failed fetch leave the server layer unavailable for that session | Deliver critical keys through MDM or a file | [Deploying managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings) |
| Team override loosens policy unexpectedly | Users in several teams get the least restrictive value per key | Keep compliance-critical keys non-overridable | [Changelog, 2026-08-03](https://github.blog/changelog/2026-08-03-enterprise-team-specialization-for-managed-settings/) |
| Looking for CLI activity on the usage dashboard | The dashboard charts exclude CLI usage | Use the API/NDJSON CLI fields and OTel | [Usage metrics data](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics) |
| Expecting org custom instructions in the CLI | The CLI isn't listed for organization instructions | Ship guidance as an agent, skill or plugin | [Instruction support](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| Local BYOK keys bypassing model policy | Local BYOK "is not controlled by enterprise policies" | Use the CLI `forceLoginOrgs` key through the device channel | [Administering Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise); [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) |

### 11.3 Appendix demo idea (optional, a few minutes, GA features only)

On a demo VM, deliver a file-based `managed-settings.json` that contains `deniedMcpServers` (GA, 2026-08-06) and `permissions.disableBypassPermissionsMode` (GA key, 2026-07-01). On macOS or Linux the file must be root-owned. Then:

1. Run `copilot --yolo` and show that allow-all isn't granted.
2. Add the denied server to `~/.copilot/mcp-config.json` and run `/mcp` to show that it's blocked.

Keep sandbox, remote skills and policy hooks out of the demo. They are either public preview or have no dated status. ([Deploying managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings); [Enterprise managed settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)) The exact on-screen text of the blocked message for managed-settings lists (as opposed to the registry evaluate path in §6.3) isn't documented. Rehearse the demo beforehand.

---

## 12. Research Limitations

- **Undated docs.** docs.github.com pages show no publication date. They are cited as read on 2026-10-05, and their content can change without a changelog entry.
- **Conflicting merge semantics.** The deploy page, the 2026-07-08 changelog and the CLI configuration-directory reference describe how MDM, server, file and user layers combine in different, partly contradictory ways (§5.6 item 3). The CLI reference even contradicts itself ("user settings can override that baseline" vs "Most managed keys lock the entire row"). Only the documented most-restrictive exceptions (`sandbox`, `permissions.*`, MCP lists) are treated as reliable.
- **Unified cloud agent / Chat policy.** The 2026-08-28 changelog announced a single policy for cloud agent, Copilot Chat on github.com and GitHub Mobile, effective "No earlier than September 28th, 2026". No launch confirmation was found by 2026-10-05, so the cloud agent policy name and location in §4.2 may change.
- **Inferences flagged in the text.** Two effects are inferred from general wording, not stated per feature: MCP allow/deny lists applying to servers declared in agent `mcp-servers` frontmatter and in plugins (§6.5), and session-level bypass suppression propagating to subagents. R4 documents that subagent permission inheritance is only partly specified.
- **Built-in MCP exemption scope.** The docs say "built-in default servers" and "first-party Copilot servers" are exempt, and list `github-mcp-server`, `playwright`, `fetch` and `time` as CLI built-ins. They don't confirm that all four are exempt.
- **Remote skills and policy hooks.** Both are documented in CLI references, but no changelog date or GA/preview label was found. They are excluded from labeled claims and demos.
- **Content exclusion vs shell reads.** CLI content exclusion is GA (2026-09-02), but the docs and the announcement don't address whether excluded files can be read through shell commands in agentic CLI sessions (§9).
- **No admin control for CLI experimental features.** No policy or managed key for the CLI's `experimental` setting was found. The **Editor preview features** policy doesn't apply to the CLI.
- **Reading method for large pages.** Several docs pages render support tables as SVG icons. Support marks were read from the icons' accessible labels ("Supported" / "Not supported") in the raw HTML/markdown returned by `web_fetch`. The very long CLI command reference was read through WebIQ `browse` (text) and the public github/docs source file for the same page. Every phrase quoted from it in this report was then confirmed against the live page captured by `browse`.
- **Policy-conflict exceptions not enumerated.** The "Feature availability when GitHub Copilot policies conflict in organizations" reference wasn't read. Exceptions to the "least restrictive" rule are therefore not listed.
- **Terminology.** The docs read here use "third-party coding agents", "partner agents" and "agent apps". The term "Agent HQ" from the brief didn't appear in them; R6 owns that terminology.
- **Scope exclusions.** JetBrains, Eclipse, Xcode and Visual Studio support marks were deliberately omitted under the brief. GitHub Enterprise Server, VS Code-specific enterprise settings, pricing and AI-credit billing (R8/R9) are out of scope.
- **Sources read but not cited.** A Visual Studio Magazine article (2026-09-29) about Copilot app sandboxing and OpenTelemetry was read as possible corroboration. It isn't cited because it concerns the app, not the CLI, and primary sources covered the same facts. It isn't counted in the source total.

---

## 13. Complete Reference List

### Documentation (docs.github.com, all read 2026-10-05)

1. [Configuring an MCP server allowlist for your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist) (also used for the WebIQ `browse` gate check)
2. [Restrict MCP server access to a custom registry](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/restrict-based-on-registry)
3. [MCP server usage in your company](https://docs.github.com/en/copilot/concepts/enterprise/mcp-management)
4. [Enterprise managed settings (reference)](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)
5. [Getting started with enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started)
6. [MCP private registry enforcement](https://docs.github.com/en/copilot/reference/enterprise-administrators/mcp-private-registry-enforcement)
7. [Choosing how to deploy enterprise-managed settings to users](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings)
8. [Creating a `.github-private` repository](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/create-github-private-repo)
9. [Supported surfaces for GitHub Copilot policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies)
10. [Administering Copilot CLI for your enterprise](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise)
11. [GitHub Copilot policies for enterprises and organizations](https://docs.github.com/en/copilot/concepts/enterprise/policies)
12. [Managing policies and features for GitHub Copilot in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-enterprise-policies)
13. [About default availability of Copilot features and models](https://docs.github.com/en/copilot/concepts/enterprise/default-availability)
14. [Agent management for enterprises](https://docs.github.com/en/copilot/concepts/enterprise/agent-management)
15. [About third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents)
16. [Preparing to use custom agents in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents)
17. [About custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents)
18. [Preparing to use custom agents in your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents)
19. [Monitoring agentic activity in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity)
20. [Audit log events for agents](https://docs.github.com/en/copilot/reference/enterprise-administrators/agentic-audit-log-events)
21. [OpenTelemetry for agent monitoring](https://docs.github.com/en/copilot/concepts/enterprise/opentelemetry)
22. [Content exclusion for GitHub Copilot](https://docs.github.com/en/copilot/concepts/context/content-exclusion)
23. [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)
24. [Customizing or disabling the firewall for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall)
25. [Enabling GitHub Copilot cloud agent in your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-cloud-agent)
26. [About enterprise-managed plugin standards](https://docs.github.com/en/copilot/concepts/enterprise/plugin-standards)
27. [Copilot customization cheat sheet](https://docs.github.com/en/copilot/reference/customization-cheat-sheet)
28. [Support for different types of custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support)
29. [About GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins)
30. [GitHub Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics)
31. [Data available in Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/copilot-usage-metrics)
32. [GitHub Copilot CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)
33. [GitHub Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)
34. [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
35. [Adding MCP servers for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)
36. [About GitHub Copilot session data](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data)
37. [Copilot allowlist reference](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)
38. [Managing GitHub Copilot access to your enterprise's network](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access/manage-network-access)
39. [Available filters for agent sessions](https://docs.github.com/en/copilot/reference/enterprise-administrators/agent-session-filters)

### Primary announcements (GitHub Changelog)

40. [GitHub Copilot CLI is now generally available](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), 2026-02-25
41. [Enterprise-managed plugins in GitHub Copilot CLI are now in public preview](https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/), 2026-05-06
42. [Cloud and local sandboxes for GitHub Copilot now in public preview](https://github.blog/changelog/2026-06-02-cloud-and-local-sandboxes-for-github-copilot-now-in-public-preview/), 2026-06-02
43. [Enterprise-managed settings now support bypass permission controls](https://github.blog/changelog/2026-06-17-enterprise-managed-settings-now-support-bypass-permission-controls/), 2026-06-17
44. [Enterprise managed-settings.json is generally available](https://github.blog/changelog/2026-07-01-enterprise-managed-settings-json-is-generally-available/), 2026-07-01
45. [Deploy managed Copilot settings via MDM in VS Code and CLI](https://github.blog/changelog/2026-07-08-deploy-managed-copilot-settings-via-mdm-in-vs-code-and-cli/), 2026-07-08
46. [Enterprise managed settings in the GitHub Copilot app and Copilot cloud agent](https://github.blog/changelog/2026-07-27-enterprise-managed-settings-now-apply-to-the-github-copilot-app/), 2026-07-27
47. [Enterprise team specialization for managed settings](https://github.blog/changelog/2026-08-03-enterprise-team-specialization-for-managed-settings/), 2026-08-03
48. [MCP allowlists in enterprise managed settings](https://github.blog/changelog/2026-08-06-mcp-allowlists-in-enterprise-managed-settings/), 2026-08-06
49. [Global model policy generally available](https://github.blog/changelog/2026-08-26-global-model-policy-generally-available/), 2026-08-26
50. [Upcoming changes to GitHub Copilot policies and billing](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/), 2026-08-28
51. [Content exclusions generally available in Copilot app and CLI](https://github.blog/changelog/2026-09-02-content-exclusions-generally-available-in-copilot-app-and-cli/), 2026-09-02
52. [Enterprise managed permissions for GitHub Copilot agent operations](https://github.blog/changelog/2026-09-09-enterprise-managed-permissions-for-github-copilot-agent-operations/), 2026-09-09
53. [Default Enablement of Copilot features for Copilot Business and Enterprise](https://github.blog/changelog/2026-09-24-default-enablement-of-copilot-features-for-copilot-business-and-enterprise/), 2026-09-24
54. [Enterprise managed settings in-product validator](https://github.blog/changelog/2026-09-25-enterprise-managed-settings-in-product-validator/), 2026-09-25

### GitHub Repositories

None cited. The `github.com/docs/custom-agents-template` repository is mentioned only as named on docs page 8. It wasn't read separately and isn't counted.

### Code Samples

| Sample | Section | Provenance | Source |
|---|---|---|---|
| Rollout `managed-settings.json` | §5.4 | adapted | Reference 4 |
| Team override files | §5.5 | adapted | Reference 5 |
| Windows registry test script | §5.7 | synthesized | Reference 7 |
| `gh api meta` domain query | §10.2 | verbatim | Reference 37 |

