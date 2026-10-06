---
reviewer: web-research-reviewer
subject: Copilot CLI customization stack and MCP configuration
companion: web-researcher
date: 2026-10-05
required_mcp: WebIQ-MCP
mcp_status: verified
verdict: APPROVED
---

## Review Round 1 - 2026-10-05

**Report:** `research/2026-10-05-cli-customization-mcp.md`  
**Binding context:** `brief.md`, including the R3 override; supplied mechanical lint PASS.  
**Review scope:** Accuracy, current primary-source support, CLI-first teaching suitability, examples, and artifact integrity. The full report was read. No report or binding input was modified; no code or CLI commands were executed.

**Required MCP verification:** Both Web IQ tools were available and successfully invoked. Independent `web` discovery queried official documentation for `include-custom-instructions` and `general-purpose`. `browse` returned substantial command-reference content, not a shell/error page. A second `browse` recovered the actual dotnet/runtime configuration when routine reading returned only file metadata. Routine reading used `web_fetch`, including pagination of the published reference pages.

**Summary:** The report is well sourced and substantially current. Its instruction-inheritance, instruction-merging, skill-loading, plugin-collision, and layered MCP findings are supported by published official sources. Four localized must-fix issues remain: overstated GitHub MCP defaults/additive flag behavior, conflation of session-agent selection with subagent delegation, an unqualified read-only MCP example, and an unsupported messaging scope.

## Reference Validation

**27 cited URLs checked out of 32 reference-list URLs.** Checks were expanded beyond the usual approximately-ten-source sample to cover the numerous quotations, code examples, disputed inheritance rules, and configuration claims. Schema identifiers, illustrative service endpoints, and URLs inside examples are not additional research references.

All 27 checked sources returned meaningful relevant content through at least one reader. No checked source was classified as fabricated, misattributed, or unavailable after both readers. Counts below use the report's reference numbers.

| Ref. | Checked source | Outcome |
|---|---|---|
| 1 | [Adding MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) | Verified user/workspace formats, nearest-directory and `.mcp.json` precedence, folder trust, prompt-mode opt-in, transport names, environment guidance, and management examples. |
| 2 | [Customization overview](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/overview) | Verified the component overview and subagent-context quotation. Its simplified description should not override the more specific session-agent distinction. |
| 3 | [Adding custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) | Verified discovery, combination without general precedence, relative imports, `applyTo`, and session refresh guidance. |
| 4 | [Adding skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) | Verified on-demand injection, the SKILL.md example, invocation, security warning, and instructions-versus-skills quotation. |
| 5 | [Finding/installing plugins](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing) | Verified default marketplaces, installation commands, and marketplace addition example. |
| 6 | [Creating plugins](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating) | Verified both JSON examples and the documented direct-local-install cache/reinstallation guidance. |
| 8 | [About plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins) | Verified bundle definition, formats, components, and declarative CLI/cloud-agent enablement. |
| 9 | [Comparing customization features](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features) | Verified definitions, delegation/skill tool triggers, read-only built-in tool example, and decision-table excerpts. |
| 10 | [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference) | Verified first-found agents/skills, last-wins MCP, session override, portable-format layout, literal remote config values, and plugin-agent MCP scoping. |
| 11 | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Web IQ browse plus paginated published-page reading verified inheritance, configuration, priority, memory, skills, and communication sections. Defaults/flag interpretation and messaging need correction; see I1/I4. |
| 12 | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) | Verified JSONC settings, repository-supported keys and directional merging, repository-only plugins, and opt-in built-in MCP settings. |
| 13 | [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration) | Verified explicit MCP tool filtering, cloud-agent secret syntax/processing order, and the retired `infer` wording. |
| 14 | [About CLI custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) | Verified built-in capabilities and default custom-agent access to available tools. |
| 15 | [Creating/using CLI custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) | Verified instruction opt-in, the selected-agent exception, tool restrictions, and restart guidance. |
| 17 | [SDK custom agents](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents) | Verified SDK tool inheritance and opt-in skills. Correctly treated as SDK evidence, not proof of CLI skill inheritance. |
| 18 | [About MCP](https://docs.github.com/en/copilot/concepts/context/mcp) | Verified local/remote CLI support, built-in GitHub server, and Registry public preview. |
| 19 | [About skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) | Verified open-standard and task-relevant loading descriptions. |
| 21 | [CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices) | Verified adapted TypeScript instruction text, concise-instructions quotation, and provider-inheritance quotation. |
| 22 | [Tool search](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/tool-search) | Verified 10–20K-token and roughly-30-tool excerpts, supported-model qualification, deferral settings, and named-agent-tool behavior. |
| 23 | [CLI GA announcement](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) | Verified February 25 GA and extensibility with MCP, plugins, skills, agents, and hooks. |
| 26 | [Agent Plugins GA announcement](https://github.blog/changelog/2026-08-12-agent-plugins-1-0-in-vs-code-copilot-cli-and-the-copilot-app/) | Verified August 12 GA support, portable format, and continued legacy support. |
| 27 | [MCP architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture.md) | Verified dated protocol documentation, client-per-server architecture, primitives, and both transport excerpts. |
| 28 | [copilot-cli README](https://github.com/github/copilot-cli) | Verified the narrow built-in GitHub MCP claim. Other visibly older README guidance was not used to establish current versions, models, or billing. |
| 29 | [copilot-cli changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) | Verified release content; the raw representation preserved version/date headings. Confirmed 1.0.85/86/87/89/90 and latest listed 1.0.91 dated October 1. |
| 30 | [github-mcp-server README](https://github.com/github/github-mcp-server/blob/main/README.md) | Verified standalone defaults and toolset/context-size guidance. Standalone-server defaults must remain separate from the CLI subset. |
| 31 | [GitHub MCP installation in CLI](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md) | Verified built-in/read-only wording, flags/example commands, replacement naming, and restart guidance. Its “additional” wording needs reconciliation with the command reference; see I1. |
| 32 | [dotnet/runtime settings sample](https://github.com/dotnet/runtime/blob/main/.github/copilot/settings.json) | Routine reader returned metadata only; Web IQ browse returned the actual JSON, matching the report's sample. |

Not individually checked: references **7, 16, 20, 24, and 25**. Related implementation claims were corroborated through the checked plugin/command references and current how-to pages. This is not a claim that every line of every cited page was audited.

## Claim Citation Coverage

Most substantive claims have appropriately placed primary citations. In particular, the published command reference confirms:

- Main/session and `general-purpose` repository instructions; no such instructions for built-in `explore`, `task`, and `code-review`.
- Custom subagent opt-in through `include-custom-instructions: true`, the extra-directory exclusion, and overriding `--no-custom-instructions`.
- MCP priority: session flag → plugins → trusted workspace → user configuration.
- Skill discovery and first-found behavior; default custom-agent tool access; root-only memory writes.

### I1 — 🟡 Important: unsupported certainty about GitHub MCP defaults and additive flags

**Location:** §6.6, lines 619–648; especially “lists the default tools” and the flag-effects table.

**Issue:** The report turns the command reference's list of tools the server “provides” into an exact default-enabled list, including `label_write`. The cited table does not identify that list as the default subset. The report also states that `--add-github-mcp-toolset` and `--add-github-mcp-tool` add on top of the default subset.

**Verification evidence:** The published [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#built-in-mcp-servers) says the server “provides the following tools.” Its command-line options describe both add flags as enabling tools/toolsets “instead of the default CLI subset.” The [official installation guide](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md) instead uses “additional toolset” wording and says read-only tools are enabled by default. §11 acknowledges the `label_write` uncertainty, but does not acknowledge the additive-versus-replacement wording conflict.

**Why it matters:** Practitioners should not infer either an exact safe default inventory or preservation of default capabilities when launching a toolset demo. A limitation at the end does not qualify the stronger instructional table where it is used.

**Concrete correction:** Relabel the inventory as tools listed by the reference, not a verified default-enabled subset. Put the default/read-only uncertainty next to that inventory. Explicitly disclose the conflicting flag wording and avoid asserting additive or replacement semantics as settled unless supported by version-specific evidence. Preserve the documented flag names and recommend inspecting the rehearsed session's tool inventory.

### I4 — 🟡 Important: `all` is incorrectly attributed to scoped messaging

**Location:** §10, “Agent coordination tools,” line 954.

**Issue:** The sentence groups `siblings`, `children`, and `all` as scope values for both `list_agents` and `write_agent` messaging.

**Verification evidence:** The published [Agent communication reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#agent-communication) lists `siblings`, `children`, and `all` for listing, but only `siblings` and `children` for scoped messaging. It also limits scoped messaging to a subagent with shared sibling communication enabled.

**Why it matters:** This gives the presentation an unsupported command/API value, violating the brief's exact-command requirement.

**Concrete correction:** Distinguish the two tools: `list_agents` supports `all`; `write_agent` scope is `siblings` or `children`. State its context prerequisite briefly, or leave messaging details entirely to R1/R5. Do not add a `write_agent(scope="all", ...)` example.

## Quote Verification

**80 source-attributed prose quotation occurrences checked out of 80**, including repeated excerpts: **18 standalone block quotations and 62 inline excerpts**. Configuration strings, example prompts, titles, scare quotes, and the quoted `Retired` status label are excluded from the prose-quotation count. The status label was checked separately.

All checked passages were found at their attributed sources. Short excerpts omit terminal punctuation or end before the next clause; the task-agent excerpt visibly marks an omission. No distinctive quotation required classification as fabricated or misattributed. Authentic wording is not proof that the report's interpretation is correct—particularly for I1.

| Checked quotation source | Occurrences | Outcome |
|---|---:|---|
| Comparing CLI features | 8 | Found feature definitions, subagent definition, and four decision-table excerpts. |
| Customization overview | 1 | Found separate-context wording; see I2 for its overgeneralization. |
| MCP architecture | 2 | Both transport excerpts found. |
| About MCP | 2 | CLI availability and Registry preview excerpts found. |
| CLI GA announcement | 3 | Extensibility heading fragment, GA wording, and built-in-server sentence found. |
| Agent Plugins GA announcement | 2 | Open-standard definition and legacy migration excerpt found. |
| Adding custom instructions | 4 | Discovery, merge, refresh, and absolute-path excerpts found. |
| CLI best practices | 2 | Concise instructions and provider inheritance found. |
| About skills | 1 | Open-standard excerpt found. |
| Adding skills | 2 | Security warning and instructions-versus-skills recommendation found. |
| About plugins | 5 | Bundle, three benefits, and format recommendation found. |
| CLI plugin reference | 4 | Literal remote values, collision rule, built-in rule, and agent-MCP scoping found. |
| Creating plugins | 1 | Cache quotation found. |
| Finding/installing plugins | 1 | Default marketplace quotation found. |
| CLI configuration directory | 3 | Repository-only activation, supported-key warning, and built-in enablement excerpt found. |
| Adding MCP servers | 7 | Trust, two recommended uses, legacy SSE, two immediate-availability excerpts, and PATH guidance found. |
| GitHub MCP CLI installation guide | 2 | Both occurrences of default read-only wording found. |
| copilot-cli README | 1 | Built-in server excerpt found. |
| github-mcp-server README | 1 | Tool-choice/context-size recommendation found. |
| About CLI custom agents | 5 | Explore access, general-purpose/task capabilities, and two all-tools excerpts found. |
| SDK custom agents | 3 | Skills noninheritance, opt-in skills, and tool inheritance found. |
| Creating/using CLI custom agents | 2 | Focus rationale and selected-agent exception found. |
| copilot-cli changelog | 1 | Server/tool filter fix found in 1.0.89. |
| Custom agents configuration | 1 | Cloud-agent processing order found; retired status also checked separately. |
| CLI command reference | 14 | Priority, flag, redaction, permission, output, schema, inheritance, memory, and limitation excerpts found. |
| Tool search | 2 | Token-cost and tool-count excerpts found. |

Code-block provenance was reviewed separately below.

## Source Authority Compliance

No material authority violations. Core claims use GitHub's published docs, official repositories/changelogs, or the MCP project's documentation. The dotnet/runtime file is appropriately identified as a public configuration example, not product-authority evidence.

**Reading the GitHub Docs repository is acceptable primary-source research here.** It is an official source, and the report discloses potential publication lag. Crucially, this audit found the major source-derived claims on the published command/configuration pages too, including instruction inheritance, MCP priority, instruction imports, tool fields, memory, repository-scoped plugins, and the disputed built-in-server/tool tables. There is no basis to reject those claims merely because the researcher originally read Markdown source.

**M1 — 🟢 Minor: improve source-representation traceability.** Location: §11 “Long reference pages read from source.” The two actual github/docs file paths/commit identifiers are absent. This makes the source snapshot harder to reproduce, although the relevant published claims now corroborate it. Add the source-file links and preferably a commit/permalink in the research-method note; distinguish representations of an existing article from additional logical sources when maintaining counts.

## Conflict & Uncertainty Disclosure

The limitations section is unusually useful: it identifies imports, discovery scope, built-in MCP inventory, required tool fields, skill-name conventions, subagent limits, and cross-surface `infer` differences. It appropriately declines to resolve CLI agent-MCP precedence or CLI skill inheritance from cloud-agent/SDK evidence.

For the researcher-flagged extra built-ins, the published command reference really does list `playwright`, `fetch`, and `time`, while the configuration page describes enabling built-ins disabled by default. The report's conservative rehearsal guidance is acceptable; it does not assert that those three are universally active.

The default-tools/read-only conflict is acknowledged but not sufficiently qualified at the point of use; **I1 remains must-fix**. The additive/replacement flag wording must be added to that discussion. No requirement is imposed to experimentally resolve undocumented behavior during this read-only audit.

## Source Freshness & Currency

Live official-source checks support the principal currency claims as of **2026-10-05**:

- CLI GA: **2026-02-25**.
- Agent Plugins 1.0 support GA: **2026-08-12**.
- Resource command changes: **1.0.85, 2026-09-16**.
- Instruction opt-in: **1.0.86, 2026-09-17**.
- Built-in GitHub MCP noninteractive visibility: **1.0.87, 2026-09-21**.
- Claude rules and slash-containing MCP tool filters: **1.0.89, 2026-09-28**.
- `--mcp-github-auth`: **1.0.90, 2026-09-30**, supported here by changelog evidence rather than a documented full setup.
- Latest release listed in the checked changelog: **1.0.91, 2026-10-01**.

The GA/experimental/public-preview table provides a useful dated baseline. “Shipped” identifies release availability rather than inventing a separate preview status. Current experimental labels for registry search/resource discovery are appropriate. The report correctly cautions against using an older repository landing-page snapshot to supersede dated release entries.

## Topic Coverage Assessment

R3's expected instructions, skills, plugins/marketplaces, user/workspace/session/agent MCP, built-in GitHub MCP, and inheritance/isolation coverage is substantial and appropriately practical. Governance, permission depth, and frontmatter depth are mostly cross-referenced rather than duplicated. No material scope violation or banned-term violation was found.

### I2 — 🟡 Important: custom profile selection is conflated with subagent execution

**Location:** §1's custom-agent building-block definition; especially §8.1's Custom agent row, lines 803–808, which combines `/agent` and `--agent` with a separate window and returned result.

**Issue:** The decision table describes a custom agent as necessarily running as a subagent even when selected as the session agent. That conflates adopting a custom profile in the main/session context with delegating work into a separate context.

**Verification evidence:** The published [command reference's instruction table](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#repository-custom-instructions-for-subagents) explicitly identifies a custom agent selected using `--agent` as a session agent. The [creation how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli#applying-your-repositorys-custom-instructions-to-a-custom-agent) distinguishes selected agents, including `/agent`, from custom agents running as subagents. The report itself quotes this correctly in §7.1.

**Why it matters:** This audience is new to orchestration. Incorrectly teaching that profile selection creates isolation obscures both context behavior and why instruction opt-in applies only to delegated execution.

**Concrete correction:** Define custom agents as reusable specialist profiles that can be selected for the session or dispatched as subagents. Split or qualify the decision-table invocation/context cells: session selection uses session context; delegation through the task mechanism creates a separate subagent context and returns results. Keep §7.1's accurate distinction consistent with the summary and practical table.

## Research Limitations Review

The section candidly distinguishes uncertainty, official-document conflicts, intentional scope exclusions, and untested demo predictions. It is not performative. In particular, the SDK skill rule is not silently transferred to CLI agents, and missing agent-level MCP priority is not filled in from the cloud-agent order.

Update it for **I1** and retain its caveats in the body where claims are presented. The `--additional-mcp-config` wrapper assumption remains explicitly labeled; it should not be promoted to a verified schema solely because the normal persistent config uses that envelope.

## Code & CLI Validation

All fenced blocks have visible provenance inside and immediately after the block. The instruction/skill YAML, plugin manifests, adapted marketplace structure, dotnet/runtime settings, management commands, GitHub MCP flags, and POSIX migration command were checked by reading. The official SKILL.md example and dotnet/runtime JSON match their sources. No execution or end-to-end integration validation was performed.

### I3 — 🟡 Important: the “read-only reviewer” grants unrestricted catalog MCP tools

**Location:** §8.3, lines 850–881; `tools: ["view", "grep", "glob", "api-catalog/*"]` and the catalog server's `tools: ["*"]`.

**Issue:** The example restricts built-in tools to reads/searches, but enables every catalog MCP tool. Neither the example nor its cited evidence establishes that the illustrative catalog exposes only read operations or that its token cannot write. Calling the whole reviewer read-only is therefore stronger than the configuration demonstrates.

**Verification evidence:** The published [tool-filter reference](https://docs.github.com/en/copilot/reference/custom-agents-configuration#tools) says `server/*` enables all tools from that server. The [SDK scoping section](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents#scoping-tools-per-agent) recommends explicit lists for least privilege. The server is an illustrative `example.com` endpoint, not a checked read-only server implementation.

**Why it matters:** Read-only local filesystem tools do not establish read-only access to external systems. This is a material safety property in an otherwise useful beginner composition example.

**Concrete correction:** Either explicitly constrain the server/credential to read operations and state that prerequisite, or select only its documented read tools. If retaining a wildcard as a schematic shortcut, label the example “read-only local tools; MCP access depends on the catalog” rather than claiming the agent is fully read-only. No expansion into R4's full approval model is necessary.

**M2 — 🟢 Minor: make copy/rehearsal prerequisites unambiguous.** Locations: opening code note, §§5.2, 6.7, 8.3. Some JSONC examples contain both `Source` and `File` comment lines, despite the opening instruction to delete “that line.” The synthesized service examples also use illustrative endpoints/tool names; §6.7 needs Bash for `set -euo pipefail` and a separately supplied valid config plus Copilot authentication. These are visibly templates and predictions, not evidence of executed demos, but novices would benefit from an explicit label. Say to remove **all** comments for strict JSON, identify templates as non-runnable until substitutions/setup are completed, and add a short rehearsal prerequisite checklist.

## Reference List Integrity

The header and numbered reference list agree: **32 logical sources = 22 GitHub Docs articles + 4 GitHub Changelog posts + 1 MCP documentation source + 4 GitHub repository sources + 1 public code sample**.

Every substantive body citation has a corresponding reference-list entry; no orphaned numbered reference was found. The standards/documentation, official repository, and public code-sample categories are suitable. Schema URLs and illustrative endpoints are not evidence citations and do not need to inflate the reference count.

The report's exact `Required MCP` marker is well formed and names at least `web` and `browse`. Its additional `news` entry does not substitute for either required tool; this audit independently verified the required pair.

## Report Structure & Readability

The required report headers, topic slug, numbered sections, limitations, and references are present. The Table of Contents matches the section headings. The prose is technical and generally neutral; no mechanical lint contradiction was found.

The report is suitable as research backing for a 60-minute presentation rather than material to reproduce wholesale in the deck. The decision table, inheritance matrix, and demo checks are strong condensation aids once **I2/I3** are corrected. No additional presentation deliverable or slide editing is requested.

## Suggested Improvements (Prioritized)

### Must fix before publication

1. **I1 — 🟡 Important:** Remove the unverified exact default-tool designation and qualify the additive-versus-replacement GitHub MCP flag conflict at the point of use.
2. **I2 — 🟡 Important:** Separate session-agent profile selection from isolated subagent delegation in the summary and decision table.
3. **I3 — 🟡 Important:** Make the catalog reviewer genuinely read-only, explicitly conditional on read-only server/credential behavior, or accurately relabel its scope.
4. **I4 — 🟡 Important:** Remove `all` from the claimed `write_agent` messaging scopes and state the context prerequisite or cross-reference it.

### Non-blocking improvements

- **M1 — 🟢 Minor:** Add exact github/docs source-file snapshot links.
- **M2 — 🟢 Minor:** Clarify strict-JSON comment removal and template/demo prerequisites.

These minor items do not independently prevent approval. Avoid expanding R3 into full R1/R2/R4/R7 coverage to address the findings.

## Readiness Verdict: NEEDS REWORK

**Remaining must-fix blockers: I1, I2, I3, and I4**, all **🟡 Important**:

- Unverified GitHub MCP default inventory and insufficiently disclosed flag semantics.
- Session-agent versus subagent execution conflation.
- Unsupported fully read-only claim for the catalog MCP reviewer.
- Unsupported `write_agent` scope value.

No **🔴 Critical** fabricated-evidence or material scope finding was identified. The primary research is credible and largely current, but these instructional/configuration issues prevent publication readiness. The report is **ready for caller-managed revision**; routing, rehearsal, and workflow completion remain with the caller.

## Review Round 2 - 2026-10-05

**Report:** `research/2026-10-05-cli-customization-mcp.md`, revised in place.  
**Context:** The full revised report, latest prior round, current read-only brief/R3 override, and supplied advisory lint result were read. The original review date and Round 1 record are preserved. Only the metadata verdict and this appended round were changed.

**Required MCP:** verified for this invocation. Both tools were available. An independent Web IQ `web` query searched the official command reference for `write_agent`, `siblings`, and `children`; `browse` successfully returned the cited Creating and using custom agents article, including meaningful instruction-opt-in and selected-agent content. No retry or alternate-URL fallback was needed. Published command-reference sections were independently reread with paginated `web_fetch`; approval does not rely on the report's reference to the prior review.

### Fix Verification

| Prior finding | Status | Revised location and verification evidence | Resolution |
|---|---|---|---|
| **I1 — 🟡 Important:** GitHub MCP default inventory and additive flags | **✅ fixed** | §1 takeaway 3, §6.6, §8.4, and §11. The inventory now quotes what the command reference says the server “provides,” explicitly denies that it is a verified default-enabled list, and places the read-only/`label_write` caveat immediately beside it. The flag table quotes official descriptions and separately exposes the additive/replacement wording conflict. Fresh published command-reference and official installation-guide reads confirm both wordings. | Unsupported certainty was removed. The report gives version-specific rehearsal checks rather than claiming to resolve conflicting documentation. No runtime experiment was required to fix this finding. |
| **I2 — 🟡 Important:** Session selection versus delegation | **✅ fixed** | §1, §2.1, §8.1, and §11. The summary distinguishes selected specialist profiles from delegated execution; the practical table now has separate session-agent and subagent rows with different context/instruction behavior. Web IQ browse of the creation how-to and fresh reading of the command reference's session/instruction table support the distinction. | Profile selection no longer incorrectly implies a separate context window. Inference and prompt-requested-agent ambiguity is disclosed without weakening the explicit `/agent`/`--agent` distinction. |
| **I3 — 🟡 Important:** Fully read-only catalog reviewer | **✅ fixed** | §8.2 layout and §8.3. Both wildcard grants were replaced by explicit illustrative catalog tools at agent and server levels. The title says read-only **local** tools; credentials and server read semantics are explicit conditions for end-to-end read-only behavior. The example is labeled a non-runnable template until real values are supplied. Fresh command-field, tool-filter, SDK least-privilege, and changelog reads support the syntax/provenance. | The safety claim is now limited to what the configuration establishes. No invented catalog implementation or unverified read-only tool contract is asserted. |
| **I4 — 🟡 Important:** Unsupported messaging scope | **✅ fixed** | §10. Listing permits `siblings`, `children`, or `all`; messaging permits only `siblings` or `children`. The parent-session/shared-sibling prerequisite and top-level explicit `agent_id` alternative are included. Fresh published Agent communication tables confirm these values and prerequisites. | The unsupported `write_agent` scope attribution is removed. |

Prior nice-to-have items:

- **M1 — 🟢 Minor: ⚠️ partially fixed.** §11 and reference entries 11/12 now identify both actual github/docs Markdown URLs and explain that they are representations of existing articles. No immutable commit permalink was captured, and that omission is expressly disclosed. The remaining snapshot-pinning improvement is waived.
- **M2 — 🟢 Minor: ✅ fixed.** The opening note says to remove **all** annotation comments from strict JSON. §6.7 identifies Bash, authentication, config-file, endpoint, and token prerequisites; §8.3 identifies illustrative tools/credentials; §8.4 adds a rehearsal checklist.

## Reference Validation

**13 cited URLs freshly checked out of 34 distinct research citation URLs in the revised report.** These correspond to **11 of 32 logical reference-list sources**, plus the two newly identified Markdown representations of references 11/12. The denominator excludes schema URLs and illustrative/example service endpoints. This round's checks concentrate on the prior blockers and the revised evidence; Round 1's broader validation remains recorded above.

All checked URLs returned meaningful relevant content. No source was classified as fabricated, misattributed, or unavailable after both readers.

| Report reference / representation | Reader and outcome |
|---|---|
| **3 — Adding custom instructions** | `web_fetch`: confirmed merging without general precedence, discovery, imports, and refresh guidance. |
| **4 — Adding skills** | `web_fetch`: confirmed on-demand injection, the SKILL.md example, pre-approval warning, and instructions-versus-skills recommendation. |
| **10 — CLI plugin reference** | Paginated `web_fetch`: confirmed collision rules and plugin-agent MCP scoping/example. |
| **11 — Published CLI command reference** | Independent Web IQ search plus paginated `web_fetch`: confirmed MCP tool list/priority, quoted flag wording, server tool filters, session versus subagent instructions, and communication scopes. |
| **11 — github/docs Markdown representation** | `web_fetch`: returned the authentic command-reference source with matching title and frontmatter; the path is valid, not an invented source URL. |
| **12 — Published CLI configuration directory** | Paginated `web_fetch`: confirmed supported repository keys, directional merges, and repository-scoped plugin activation. |
| **12 — github/docs Markdown representation** | `web_fetch`: returned the authentic configuration-directory source with matching title/frontmatter and directory content. |
| **13 — Custom agents configuration** | `web_fetch`: confirmed explicit `server/tool` filtering and the meaning of `server/*`. |
| **15 — Creating and using CLI custom agents** | Web IQ `browse`: returned the actual article; confirmed repository-instruction opt-in, selected-agent exception, and restart guidance. |
| **17 — SDK custom agents** | Paginated `web_fetch`: confirmed explicit tool lists and the least-privilege quotation used by the revised example. SDK evidence remains labeled as SDK evidence. |
| **22 — Tool search** | `web_fetch`: confirmed both numerical excerpts and supported-model/deferral qualifications. |
| **29 — copilot-cli changelog** | `web_fetch` of the cited GitHub file and its raw representation: confirmed version/date headings, instruction opt-in, slash-containing filter fix, and latest listed 1.0.91. The raw changelog retrieval is a supplementary representation, not another report citation. |
| **31 — GitHub MCP CLI installation guide** | `web_fetch`: confirmed read-only-default wording, “additional toolset” comments, actual flag commands, and replacement-server naming. |

## Claim Citation Coverage

No unresolved material citation gap. The changes resolving I1–I4 retain primary-source links at the point of use. The added reviewer-template caveats distinguish documented filtering behavior from assumed catalog capabilities.

The revised §11 reference to what Round 1 found is methodological history, not a replacement for primary evidence: the report also links the official pages, and this round independently reconfirmed the disputed flag and communication text.

## Quote Verification

**11 of 18 standalone quoted passages freshly verified in this round**, with the total enumerated from the revised report. All 18 are retained from the prior version; the other seven were not freshly reread against their sources in this focused round. Round 1's broader prose-quotation inventory is historical and is not represented as a newly completed full quotation audit.

| Freshly checked standalone-quotation source | Verified / present in report | Outcome |
|---|---:|---|
| Adding custom instructions | 1 / 1 | Instruction-combination quotation found. |
| Adding skills | 2 / 2 | Security warning and instructions-versus-skills quotation found. |
| CLI plugin reference | 2 / 2 | Collision and plugin-agent MCP-scoping quotations found. |
| CLI command reference | 2 / 3 | Priority and custom-subagent instruction excerpts found; root-memory quotation not freshly checked. |
| CLI configuration directory | 2 / 2 | Repository-only activation and supported-key warning found. |
| Creating and using custom agents | 1 / 1 | Selected-agent instruction exception found through Web IQ browse. |
| GitHub MCP CLI installation guide | 1 / 1 | Built-in/read-only-default quotation found. |

**Changed inline excerpts were also checked separately:** the §2.1/§8.1 session-selection and delegation fragments; §6.6's server-“provides” introduction, five complete flag descriptions, “instead of” versus “additional” wording; §8.3's explicit-tools and SDK least-privilege excerpts; and §10's messaging prerequisite. They were found in the respective published command reference, creation how-to, installation guide, or SDK page. The visibly marked shortened excerpt “runs … as a subagent” is an excerpt, not a fabricated sentence. Tool-search numerical excerpts were reconfirmed as well.

No quotation mismatch, misattribution, or fabricated quotation was found in this round.

## Source Authority Compliance

No material issues. Core revisions rely on current published GitHub documentation and official GitHub repositories. The two github/docs source representations are now explicitly linked and remain acceptable primary sources. Published-page verification supports the load-bearing changes, so no source-repository publication-lag blocker remains.

M1's missing immutable snapshot is a non-blocking reproducibility improvement, not evidence of misattribution.

## Conflict & Uncertainty Disclosure

I1 is resolved through accurate uncertainty disclosure rather than an unsupported claim about implementation. The conflicting default inventory and add-flag interpretations are now visible in the Executive Summary, §6.6, rehearsal guidance, and limitations.

The new inference/prompt-requested-agent limitation is appropriate: it keeps the explicit selection/delegation distinction clear while acknowledging confusing official wording. Existing CLI skill inheritance, user/path-specific instruction inheritance, agent-MCP priority, and cloud-secret portability gaps remain candidly labeled. No new must-fix conflict issue.

## Source Freshness & Currency

Fresh official retrievals support the retained currency baseline as of **2026-10-05**. The checked changelog still lists **1.0.91 dated 2026-10-01**; **1.0.86 dated 2026-09-17** contains the instruction opt-in; **1.0.89 dated 2026-09-28** contains the slash-containing MCP tool-filter fix.

No stale or superseded replacement guidance was introduced. Existing dated GA/experimental/public-preview labeling remains suitable for the report's scope. The report does not claim the reviewer ran a particular CLI binary or proved runtime behavior.

## Topic Coverage Assessment

No material coverage or scope defect. The session/subagent split and conditional catalog example improve the beginner-facing composition guidance without expanding R3 into R1/R2/R4/R7. The full customization and MCP stack remains covered.

## Research Limitations Review

No material issues. The revisions add the exact source-representation URLs, disclose the absence of a commit permalink, and document inferred-agent ambiguity. They keep unsettled flag behavior and input-envelope assumptions separate from verified syntax.

Approval does not mean those documented unknowns have been experimentally resolved. The presentation should retain the qualifiers and follow the existing rehearsal checklist.

## Code & CLI Validation

Read-only inspection confirms the revised YAML template has explicit agent and server tool lists with consistent names, a clearly illustrative endpoint, a required read-only token, and visible source/provenance attribution.

The Bash session-MCP template now identifies setup/authentication requirements and retains error handling. Strict-JSON comment removal is corrected. The unchanged official skill/plugin snippets retain their provenance. No code or command was executed, and no end-to-end catalog/tool behavior is certified.

I3 and M2 are resolved; no new must-fix technical defect was found.

## Reference List Integrity

**The advisory lint notice is a false positive for this report, not a reference-count failure.** The actual header states **32 sources**, and the complete numbered reference list runs continuously from **1 to 32**. The category arithmetic is unchanged: **22 + 4 + 1 + 4 + 1 = 32**.

The phrase “representations of references 11 and 12” identifies numbered entries, not a claim to have 11 total citations. Entries 11/12 now include alternate source URLs for the same logical articles, yielding 34 distinct citation URLs but still 32 logical reference sources; the report explicitly explains that distinction.

No missing body-reference pairing or orphaned logical entry was found. Both new Markdown URLs appear in the method note and the corresponding reference entries. Header topic slug and `Required MCP` marker remain correct.

## Report Structure & Readability

No material issues. The Table of Contents still matches the sections. The revised session/delegation table, adjacent MCP warnings, and checklist improve publication usability. Review Round 1 is preserved as the historical record; the frontmatter now reflects this round's verdict.

## Suggested Improvements (Prioritized)

**Must-fix list: none.** I1–I4 are all **✅ fixed**.

**Remaining nice-to-have:** M1's **🟢 Minor** immutable source-snapshot/permalink improvement is **waived**. M2 is **✅ fixed**. No new style preference or scope expansion is imposed.

Carry the documented uncertainty notes into presentation synthesis, and perform caller-managed rehearsal before using live MCP toolset demonstrations. These are existing operational caveats, not unresolved research-review blockers.

## Readiness Verdict: APPROVED

There are **no remaining 🔴 Critical or 🟡 Important findings**. All four prior must-fix findings are resolved. The only remaining **🟢 Minor** item, M1's immutable snapshot pinning, is waived.

The report is ready for caller-managed presentation synthesis. Approval covers research publication readiness with its stated limitations, not a guarantee that illustrative templates or unresolved runtime behaviors have been tested. Routing, rehearsal, and workflow completion remain with the caller.
