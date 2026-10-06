---
brief_version: 1
topic: "Subagents & Multi-Agent Orchestration with GitHub Copilot CLI"
topic_slug: copilot-cli-subagents-orchestration
audience: "Technical practitioners new to multi-agent systems in GitHub Copilot"
duration_min: 60
tone: "Technical, practical, neutral; no marketing superlatives; every feature labeled GA or preview with source date"
banned_terms: []
decisions:
  - "Primary focus: subagents in the GitHub Copilot CLI (built-in and custom agents, configuration, MCP, permissions, guardrails)"
  - "Also cover /fleet, /delegate and other related CLI multi-agent functionality"
  - "Light mentions only: VS Code, the GitHub Copilot app, github.com (cloud agent, code review, agentic workflows)"
  - "Brief mention only: Claude and Codex via Agent HQ"
  - "Include both GA and preview features, clearly labeled"
  - "Practitioner level in the main deck; enterprise and org governance in an appendix"
  - "Pricing, licenses, plans, usage-based / pay-as-you-go billing and billing through Azure in an appendix"
  - "Exclude JetBrains and other editors; exclude non-GitHub-Copilot frameworks (e.g., LangChain)"
  - "60 minutes total including demo breaks; no Q&A"
  - "User requested autopilot: orchestrator records gate decisions with stated assumptions and continues"
  - "Lifecycle labels: features with dated stable-release evidence but no explicit GA/preview label are presented as 'shipped in CLI <version> (<date>); no separate status label' and never badged GA; features with no dated evidence stay out of labeled claims and demos"
  - "Features named in the 2026-02-25 Copilot CLI GA announcement (but without their own GA statement) are labeled 'included in the Copilot CLI GA announcement (2026-02-25)', not given a standalone per-feature GA badge"
assignments:
  - id: R1
    topic: "Copilot CLI multi-agent foundations and built-in subagents"
    agent: web-researcher
    out: research/2026-10-05-cli-subagent-foundations.md
    status: approved
    acceptance_mode: approved
  - id: R2
    topic: "Custom agents in the Copilot CLI"
    agent: web-researcher
    out: research/2026-10-05-cli-custom-agents.md
    status: approved
    acceptance_mode: approved
  - id: R3
    topic: "Copilot CLI customization stack and MCP configuration"
    agent: web-researcher
    out: research/2026-10-05-cli-customization-mcp.md
    status: approved
    acceptance_mode: approved
  - id: R4
    topic: "Copilot CLI permissions, hooks and guardrails"
    agent: web-researcher
    out: research/2026-10-05-cli-permissions-guardrails.md
    status: approved
    acceptance_mode: approved
  - id: R5
    topic: "/fleet, /delegate and Copilot CLI multi-agent workflows"
    agent: web-researcher
    out: research/2026-10-05-cli-fleet-delegate-workflows.md
    status: approved
    acceptance_mode: approved
  - id: R6
    topic: "Copilot multi-agent capabilities beyond the CLI (light)"
    agent: web-researcher
    out: research/2026-10-05-copilot-agents-beyond-cli.md
    status: approved
    acceptance_mode: approved
  - id: R7
    topic: "Enterprise and organization governance for Copilot agents (appendix)"
    agent: web-researcher
    out: research/2026-10-05-copilot-governance-appendix.md
    status: approved
    acceptance_mode: approved
  - id: R8
    topic: "Copilot plans, licensing and pricing (appendix)"
    agent: web-researcher
    out: research/2026-10-05-copilot-plans-pricing.md
    status: approved
    acceptance_mode: approved
  - id: R9
    topic: "GitHub Copilot billing through Azure (appendix)"
    agent: ms-docs-researcher
    out: research/2026-10-05-copilot-azure-billing.md
    status: approved
    acceptance_mode: approved
---

# Brief — Subagents & Multi-Agent Orchestration with GitHub Copilot CLI

## Goal
In the user's words: research and create a presentation on GitHub Copilot for multi-agent
workflows and orchestration — specialized subagents (definitions, model selection,
configurations, permissions), subagent-specific configuration (MCP and permissions at the
org, repo or subagent level), guardrails and configurations (agent reviews, etc.), workflows,
and the multiple ways of using multi-agent systems (subagents, workflows, fleet, out-of-the-box
commands like code review). **The GitHub Copilot CLI and its subagents are the main focus.**
"Research well and find relevant information"; assume prior knowledge is out of date and
verify everything against current, official sources.

## Audience & tone
- Technical practitioners who are **new** to multi-agent systems in GitHub Copilot.
- Start from the beginning and go deep.
- Technical, practical, neutral; label every feature GA or preview with its source date.
- 60 minutes total, including breaks for demos; no Q&A.

## Scope decisions
**In scope (main deck):**
- What agents and subagents are in the Copilot CLI and why to use them (context isolation,
  specialization, parallelism); built-in subagents; delegation mechanics; model selection.
- Custom agents (`.agent.md`): definitions, locations, precedence, model/tool/MCP settings,
  invocation, design patterns.
- CLI customization stack (instructions, skills, plugins) and MCP configuration at user,
  repo and agent levels.
- Permissions, approvals, hooks and guardrails (including review agents and
  creator↔reviewer patterns).
- `/fleet`, `/delegate` and related CLI commands/workflows, including out-of-the-box review.

**Light mention:** VS Code, the GitHub Copilot app, github.com (cloud agent, code review,
GitHub Agentic Workflows). **Brief mention:** Claude and Codex via Agent HQ.

**Appendix:** enterprise/org governance; pricing, licenses, plans, usage-based / pay-as-you-go
billing; GitHub Copilot billing through Azure.

**Out of scope:** JetBrains and other editors; non-GitHub-Copilot agent frameworks
(e.g., LangChain).

## Banned terms
None declared.

## Verified facts
Promoted from APPROVED research reviews (2026-10-05). Exact wording and lifecycle labels are
binding; see each source report for citations.

**Copilot CLI and subagents** (R1 `cli-subagent-foundations`, R2 `cli-custom-agents`)
- Copilot CLI has been generally available since **2026-02-25**.
- Every session has a main agent; it can start **subagents**, each with its **own context
  window**, through the built-in `task` tool. Agent-management tools: `task`, `read_agent`,
  `write_agent`, `list_agents`. `/tasks` lets you inspect, steer, kill or background subagents.
- Seven built-in agents are documented: `explore`, `task`, `general-purpose`, `code-review`,
  `research`, `rubber-duck`, `security-review`. Labels: rubber duck **GA (2026-06-02)**;
  `/security-review` **public preview (experimental), announced 2026-06-10** (first shipped CLI
  1.0.51, 2026-05-20; no `--experimental` needed since 1.0.64, 2026-06-23); `explore`, `task`,
  `code-review` are included in the Copilot CLI GA announcement (2026-02-25); `general-purpose`
  has no dated lifecycle evidence (no status label; keep out of labeled claims/demos).
- The main model decides when to delegate, guided by each agent's `description`; delegation has
  been deliberately selective since v1.0.42 (blog 2026-06-12).
- Model / reasoning-effort resolution (highest first): per-call value → `/subagents`
  (alias `/agents`) override in `~/.copilot/settings.json` → agent definition → parent session.
  When the session uses **Auto**, a custom agent's `model` field is overridden by the resolved
  session model.
- Custom agents are `.agent.md` profiles (YAML frontmatter + Markdown prompt), used either as the
  session agent (`/agent`, `--agent`, inference) or as a delegated subagent. Load order (highest
  first): `~/.copilot/agents/` → `.github/agents/` → `.claude/agents/` → `--add-dir` →
  plugins → org/enterprise agents; duplicates resolve by path-derived agent ID, not `name`.
- `tools` is an allow-list: omitted = all tools; `[]` = none; MCP tools are `server/tool` or
  `server/*`; unrecognized names are ignored.
- Tool restrictions persist into subagents (CLI 1.0.67/1.0.68); a parent must hold at least the
  tools its children need (a read-only coordinator delegating edits is unverified).
- Subagents do **not** inherit repository instructions unless the agent sets
  `include-custom-instructions: true` (CLI 1.0.86, 2026-09-17); the main agent and
  `general-purpose` receive them, `explore`/`task`/`code-review` do not (R3).
- Subagent nesting depth is **conflicting** across official sources (6/256 vs 4/128); per-plan
  concurrency rows (2/4/8/16/32) are documented but their current applicability is unresolved —
  do not state either as a single fact without a caveat.

**Customization and MCP** (R3 `cli-customization-mcp`)
- MCP server precedence (highest first): `--additional-mcp-config` → plugins → workspace
  `.mcp.json` / `.github/mcp.json` (trusted folders only) → `~/.copilot/mcp-config.json`.
  An agent's own `mcp-servers` are visible only to that agent. The GitHub MCP server is built in.
- Custom instructions are always loaded; skills load when relevant; plugins bundle agents,
  skills, hooks and MCP servers.

**Permissions and guardrails** (R4 `cli-permissions-guardrails`)
- Deny rules beat allow rules in ordinary rule evaluation (including `--allow-all` and saved
  approvals); `preToolUse` hooks: any deny wins. Hook allow vs `--deny-tool` is unresolved.
- Plan mode is a safety net, not a guarantee. A repo's `.github/copilot/settings.json` can set
  `disableAllHooks: true` (only admin policy hooks keep running). Local sandboxing is experimental.
- Review-based guardrails (creator↔reviewer loops, `subagentStop`/`agentStop` hooks) are
  advisory; required CI checks and human PR review are the enforcement gate.

**Parallel and delegated work** (R5 `cli-fleet-delegate-workflows`)
- `/fleet` shipped in CLI v0.0.411 (2026-02-17); no separate status label. The main agent splits
  work into parallel waves of subagents that share one filesystem with **no file locking**.
  Headless: `copilot -p "/fleet <YOUR TASK>" --no-ask-user`.
- `/delegate` (or `&` prefix) hands work to the **Copilot cloud agent** (formerly Copilot coding
  agent), which opens a draft PR; included in the Copilot CLI GA announcement (2026-02-25).
  Remote control (`--remote`) is different: it steers a still-running local session.
- Dynamic workflows: public preview since 2026-10-01.

**Beyond the CLI** (R6 `copilot-agents-beyond-cli`)
- GitHub Copilot app GA 2026-06-17 (built on Copilot CLI); Copilot cloud agent GA 2025-09-25;
  agentic Copilot code review GA 2026-03-05; Claude and Codex via Agent HQ public preview
  (2026-02-04); GitHub Agentic Workflows public preview since 2026-06-11; VS Code Agents window
  preview since 1.120 (2026-05-13).

**Governance — appendix** (R7 `copilot-governance-appendix`)
- Governance mechanisms (a grouping, not a precedence order): GitHub AI Controls policies,
  client managed settings (`managed-settings.json`, GA 2026-07-01), and host policy hooks.
- MCP allow/deny lists (`allowedMcpServers` / `deniedMcpServers`) GA 2026-08-06, enforced in the
  CLI, VS Code and the Copilot app, not the cloud agent; registry-based restriction is public
  preview and bypassable. Managed `permissions` deny/ask/allow rules GA 2026-09-09 (not cloud
  agent). Content exclusion in the Copilot app and CLI GA 2026-09-02 (context filtering, not an
  access boundary).
- Org/enterprise custom agents are the CLI's lowest-priority agent source (a user or repo agent
  with the same ID overrides them).

**Billing** (R8 `copilot-plans-pricing`, R9 `copilot-azure-billing`)
- Since **2026-06-01** all plans bill in **GitHub AI Credits** ($0.01 USD each), except legacy
  annual Pro/Pro+. Prices: Pro $10, Pro+ $39, Max $100 (new), Business $19/seat, Enterprise
  $39/seat per month. Allowances: Pro 1,500; Pro+ 7,000; Max 20,000; Business 1,900/user and
  Enterprise 3,900/user (pooled).
- `/limits` / `--max-ai-credits` session caps are soft, public preview (scope conflict:
  per-response vs per-session). Org/enterprise/cost-center budgets hard-stop only when
  "Stop usage when budget limit is reached" is enabled (off by default).
- Organization or enterprise owners (not personal accounts) can connect an Azure subscription;
  Copilot charges flow to the Azure invoice; Azure budgets only alert.

## Review rubric
1. **Banned terms:** none declared.
2. **Sourcing:** load-bearing claims rely on current primary sources — docs.github.com,
   github.blog (incl. changelog), official `github/*` repositories (e.g., copilot-cli,
   copilot-sdk, gh-aw), code.visualstudio.com, and learn.microsoft.com (Azure billing).
   Third-party blogs are corroboration only and must be labeled as such.
3. **Exact names and numbers:** feature names, commands, flags, file paths, frontmatter keys,
   plan names and prices exactly as in official sources, with GA/preview status and the
   source's date. Note renamed/deprecated features explicitly.
4. **Scope:** honor the focus split above (CLI-first; light/brief/appendix placement).
5. **Reference counts:** stated source counts equal the reference list; no orphaned citations.
6. **Artifact structure:** research reports follow the researcher report contract
   (header with `**Topic slug:**` equal to the filename slug after the date, and the exact
   `**Required MCP:** verified - …; tools used: …` marker); content and slides follow their
   agent contracts.

## Content preferences
Recorded at Gate 2 (2026-10-05) by the orchestrator under the user's autopilot delegation
("I approve of the research … and the next steps").
- **Audience:** confirmed as above — start from first principles, then go deep.
- **Exact duration:** 60 counted minutes = ~45 min of core slides + 3 demo slots of 5 min each.
  No Q&A. **No separate audience break slide** (demo segments serve as the breaks).
- **Appendix:** governance (R7), plans/pricing (R8) and billing through Azure (R9) slides are
  `Allocation: non-counted` and appear after the closing slide.
- **Emphasis (in order):** what agents/subagents are and why; built-in subagents and delegation;
  custom agents as specialized subagents (definition, model selection, tools, MCP, permissions);
  configuration levels (user / repo / agent; instructions, skills, plugins, MCP); permissions,
  hooks and guardrails (deny rules, review agents, creator↔reviewer); `/fleet`, `/delegate` and
  out-of-the-box commands (`/review`, `/security-review`, `/research`, rubber duck).
- **De-emphasis:** VS Code, Copilot app and github.com (2–4 slides total); Agent HQ with
  Claude/Codex (at most one brief mention); org/enterprise governance and pricing only in the
  appendix.
- **Structure:** opening (why multi-agent) → a "map" slide of the ways to use multi-agent in
  Copilot (subagents → custom agents → `/fleet` → `/delegate` to cloud → dynamic workflows →
  out-of-the-box review commands → beyond the CLI) → foundations → built-in subagents →
  custom agents → configuration & MCP → permissions & guardrails → parallel & delegated
  workflows → beyond the CLI → recap & next steps → appendix.
- **Demo placeholders:** enabled, three, using only lifecycle-eligible features from the research:
  1. Built-in subagents in action (delegation, `/tasks`, `/subagents` model settings).
  2. Custom specialists: implementer + read-only reviewer `.agent.md`, tool scoping, a deny
     rule / `preToolUse` guardrail.
  3. Parallel and hand-off: plan mode → `/fleet` → `/review`; `&` / `/delegate` to the cloud agent.
- **Lifecycle labels:** follow the `decisions` rules; keep conflicting numbers (nesting depth,
  concurrency, `/limits` scope) out of visible text or show them with an explicit caveat.
- **Research allowlist:** all nine `research/*.md` files (mode: all).

## Visual preferences
Recorded at Gate 3 (2026-10-05) by the orchestrator under the user's autopilot delegation.
- **Initial theme:** GitHub Cosmos (default); all four themes remain available.
- **Style:** clean, technical, diagram-first. Translate every `Visual: hand-craft` wireframe into
  real HTML/CSS/SVG components (flows, layered stacks, decision trees, comparison grids); no
  raw ASCII. Code/config slides (`.agent.md`, MCP JSON, permission flags, hooks) use readable
  syntax-highlighted monospace blocks.
- **Brand/images:** no external images, logos or screenshots (none provided); GitHub-neutral
  palette from the theme tokens.
- **Lifecycle badges:** render status labels (GA / public preview / experimental / "shipped in …;
  no separate status label") as small, consistent pill badges exactly as written in the content.
- **Accessibility:** keep text ≥ 22px on the 1920×1080 canvas, WCAG AA contrast in all themes,
  visible focus states; appendix slides visually marked as "Appendix".

## Per-assignment overrides
Boundaries avoid overlap; cross-reference other assignments instead of duplicating them.

- **R1 — CLI foundations & built-in subagents** (`cli-subagent-foundations`): what agents,
  subagents and custom agents are; why use subagents; the CLI agent loop, context window and
  compaction; built-in agent types (names, purposes, tool sets, default models); how the main
  agent decides to delegate; sync vs background execution; multi-turn agents; model,
  reasoning-effort and context-tier selection for subagents (incl. user preferences);
  inspecting/managing running agents; current terminology. Recommend demo-able scenarios.
- **R2 — Custom agents** (`cli-custom-agents`): `.agent.md` frontmatter keys supported by the
  CLI and their semantics (name, description, tools, model, mcp-servers,
  user-invocable, disable-model-invocation, and any others documented); prompt body limits;
  file locations and precedence (user, repo, org/enterprise); invocation (`/agent`,
  `--agent`, natural-language, orchestrator delegation); per-agent model and tool scoping;
  agent-level MCP servers; portability to VS Code / cloud agent (brief); design patterns
  (orchestrator + specialists, creator↔reviewer, read-only reviewers) with official examples.
- **R3 — Customization stack & MCP** (`cli-customization-mcp`): custom instructions
  (AGENTS.md, copilot-instructions.md, path-specific), skills (`SKILL.md`), plugins and
  marketplaces; MCP configuration at user, repo/workspace, agent-frontmatter and command-line
  levels; the built-in GitHub MCP server; which context and tools subagents inherit vs isolate.
  Org/enterprise MCP policy belongs to R7.
- **R4 — Permissions, hooks & guardrails** (`cli-permissions-guardrails`): tool approval model;
  allow/deny tool flags and patterns; path and URL permissions; trusted folders; allow-all /
  autopilot modes; per-agent tool restrictions; hooks (events, payloads, deny decisions) as
  policy; plan mode; review agents (code-review, rubber-duck, etc.) and creator↔reviewer loops;
  prompt-injection and safety considerations; official best practices. Org/enterprise policy
  belongs to R7.
- **R5 — `/fleet`, `/delegate` & workflows** (`cli-fleet-delegate-workflows`): `/fleet`
  (decomposition, waves/dependencies, prompting guidance, limits); `/delegate` to the cloud
  agent; `/review`, `/research` and other out-of-the-box multi-agent commands; background
  tasks; non-interactive `copilot -p` and CLI in GitHub Actions; Copilot SDK orchestration
  (brief); workflow patterns and usage/cost implications (detailed pricing belongs to R8).
- **R6 — Beyond the CLI, light** (`copilot-agents-beyond-cli`): VS Code subagents/custom
  agents/handoffs; the GitHub Copilot app (verify what it is); github.com cloud agent; Agent HQ
  with Claude and Codex (brief); agentic Copilot code review; GitHub Agentic Workflows (brief);
  sharing agent definitions across surfaces. Breadth over depth.
- **R7 — Governance appendix** (`copilot-governance-appendix`): enterprise/org policies for the
  CLI, models, agents and third-party agents; MCP policies (registry, allow/deny lists,
  managed settings); org/enterprise custom agents and skills; audit logs; content exclusion;
  network controls.
- **R8 — Plans & pricing appendix** (`copilot-plans-pricing`): plans (Free, Pro, Pro+, Business,
  Enterprise) and what each includes for agents/CLI; usage-based billing (e.g., AI credits) vs
  premium requests and transition dates; model multipliers; how subagents and `/fleet` consume
  usage; budgets and spending controls; pay-as-you-go. Azure billing details belong to R9.
- **R9 — Billing through Azure appendix** (`copilot-azure-billing`): connecting a GitHub
  enterprise/organization to an Azure subscription; how Copilot usage is metered and appears
  on the Azure invoice; prerequisites and roles; Azure Cost Management/budgets; eligibility and
  recent announcement details. Microsoft Learn primary; docs.github.com as secondary.
