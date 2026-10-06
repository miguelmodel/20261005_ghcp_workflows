---
reviewer: web-research-reviewer
subject: "Custom agents in the GitHub Copilot CLI"
companion: web-researcher
date: 2026-10-05
required_mcp: WebIQ-MCP
mcp_status: verified
verdict: APPROVED
---

## Review Round 1 - 2026-10-05

Reviewed the full R2 report against the read-only brief, R2 assignment override, and supplied passing mechanical lint result. No verified-facts list or banned terms were declared. The report was not modified.

**Required MCP verification:** Both Web IQ tools were available and invoked successfully. An independent `web` query investigated the current CLI frontmatter specification; further queries investigated inheritance of tool restrictions. `browse` returned meaningful official CLI command-reference content, including its title and command documentation. Routine source checks used `web_fetch`, including paginated sections of large references. Verification date: 2026-10-05. No CLI commands or example code were executed.

**Summary:** The source base and most configuration details are sound. The researcher accurately identifies several real documentation conflicts rather than inventing a resolution. One load-bearing orchestration claim remains insufficiently supported: the tool-restricted coordinator is presented as able to delegate editing and shell work without reconciling the documented inheritance of tool restrictions. This is an uncertainty/technical-validity finding, not a finding of fabricated evidence or a proven runtime failure.

## Reference Validation

**20 distinct cited URLs checked out of 27 references**, counting fragment variants and the resolved best-practices redirect as the same source. All 20 returned substantive content. The remaining seven references were not independently fetched; their accessibility and detailed contents are not certified by this review.

| Report reference | Checked source | Outcome |
|---|---|---|
| 1 | [Cross-surface custom-agent configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration) | Frontmatter, retired `infer`, tool aliases/filtering, prompt limit, MCP example and cloud processing order confirmed. |
| 2 | [Create/use CLI custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) | Wizard, restart guidance, invocation methods, path-derived IDs and repository-instruction opt-in confirmed. |
| 3 | [About CLI custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) | Profile format, `readme-creator` example and current built-in agent names confirmed. |
| 4 | [Invoke custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents) | User/repository/org/enterprise chain, discretionary delegation and CLI command example confirmed. |
| 5 | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | CLI frontmatter, six-tier load order, ID deduplication, model/effort precedence, instruction inheritance, MCP schema, messaging, limits and sidekick example confirmed in relevant sections. Additional source-internal limits conflict noted below. |
| 6 | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) | `subagents.agents` fields, agent-name wording, disabled agents and depth/concurrency settings confirmed. |
| 7 | [Customization comparison](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features) | Specialist/read-only patterns and active CLI `infer` wording confirmed. |
| 8 | [Add CLI MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) | Context7 HTTP URL, header name and server configuration shape confirmed. This does not independently certify the third-party service's current tool catalog. |
| 9 | [CLI best practices](https://docs.github.com/copilot/how-tos/copilot-cli/cli-best-practices) | Redirect resolved to the `/en/` page; Codex second-opinion guidance confirmed. |
| 11 | [Organization custom agents](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents) | Public-preview banner and root `/agents` in `.github` or `.github-private` confirmed. |
| 13 | [SDK custom agents](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents) | Definition fields, delegation flow, read-only/editor examples, skills opt-in and `defaultAgent.excludedTools` semantics confirmed. |
| 15 | [VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents) | Locations, model array, visibility/invocation keys, deprecated `infer` and Local-only preview hooks confirmed. |
| 16 | [VS Code subagents](https://code.visualstudio.com/docs/agents/run/subagents) | Local coordinator/worker example and review caution confirmed; its tool-overriding behavior is surface-specific. |
| 17 | [CLI custom-agent introduction](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/) | October 2025 introduction, user-agent location and agentic-loop quotation confirmed. |
| 19 | [CLI GA announcement](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) | GA announcement explicitly includes custom agents among CLI capabilities. |
| 20 | [SDK GA announcement](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/) | SDK general availability confirmed. |
| 21 | [GitHub custom-agent workflow article](https://github.blog/ai-and-ml/github-copilot/from-one-off-prompts-to-workflows-how-to-use-custom-agents-in-github-copilot-cli/) | Repository-sharing wording and problematic external-program `tools` examples confirmed; the report appropriately warns against copying these tool lists. |
| 22 | [CLI main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) | Latest entry 1.0.91 dated 2026-10-01; relevant 1.0.81, 1.0.83, 1.0.85–1.0.89 entries confirmed. |
| 23 | [CLI v1.0.76 changelog snapshot](https://raw.githubusercontent.com/github/copilot-cli/v1.0.76/changelog.md) | Relative-link fix, shell-alias fix, depth reduction and 1.0.67/1.0.68 restriction-inheritance wording confirmed. |
| 26 | [Awesome Copilot repository](https://github.com/github/awesome-copilot) | Community provenance, inspection warning and plugin installation guidance confirmed. |

No checked source was fabricated, misattributed or inaccessible. The blocker below concerns what the evidence establishes, not whether the cited URLs exist.

## Claim Citation Coverage

Substantive claims generally have appropriately placed citations. In particular, the six-tier load order, path-based deduplication, wildcard behavior, CLI camelCase model fields, required-policy behavior, instruction opt-in and agent MCP schema are supported by current first-party references.

### F1 — 🟡 Important: Restricted-parent orchestration capability is not established

- **Location:** §11.3 first bullet; §12.2 coordinator profile and design notes; §12.4 demo 5; corresponding limitations in §15.
- **Issue:** The report says a coordinator can omit editing and shell tools while its children receive those tools. Its `change-coordinator` allow-list contains only delegation and read tools, yet the described workflow requires its `implementer` child to edit files and run tests. This capability is **⚠️ unverifiable** from the cited CLI sources and is not reconciled with the report's own §7.5 account of inherited restrictions.
- **Verification evidence:** The official [v1.0.76 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.76/changelog.md) says “Subagent sessions keep parent tool restrictions” in 1.0.67 and “Custom agents keep their tool filters in nested subagents” in 1.0.68. The checked CLI reference documents agent allow-lists and dispatch, but does not explain an exception establishing this particular narrow-parent/wider-child design. The [SDK reference](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents#agent-exclusive-tools) does establish a distinct main-agent-only exclusion mechanism, `defaultAgent.excludedTools`, while explicitly distinguishing session-wide restrictions. It does not establish that a selected CLI custom agent's frontmatter behaves identically. The VS Code Local example likewise cannot prove CLI inheritance semantics.
- **Why it matters:** This is the central creator↔reviewer live-demo pattern for an audience new to orchestration. A syntactically valid profile is not sufficient evidence that children can obtain capabilities absent from their parent. Teaching either unsupported privilege expansion or an inadvertently nonfunctional workflow would undermine the lesson.
- **Concrete correction:** Distinguish session-wide permissions/tool filters, selected-agent frontmatter filters, and the SDK's main-agent-only exclusions. Either supply current authoritative evidence resolving the selected CLI coordinator case, or label the narrow-parent/wider-child design as an unresolved runtime hypothesis and remove it from the “demo-ready” path. A conservative alternative is a normal session with sufficient tools available for implementation, prompt-guided coordination, and explicitly restricted specialist reviewers; make clear that the coordinator's “never edit” rule is then behavioral rather than an enforced tool boundary. Update §11.3, §12.2, §12.4 and §15 consistently. This auditor did not execute the workflow and is not asserting that it necessarily fails.

## Quote Verification

**19 of 19 standalone prose blockquotations verified** against their attributed sources. This count excludes blockquoted source/provenance notes, the spelling-conflict admonition, code literals and short inline quoted fragments. Important inline excerpts and release-note fragments were additionally spot-checked; they are not presented as an exhaustive quotation-mark census.

| Checked quotation source | Number | Outcome |
|---|---:|---|
| CLI create/use guide | 1 | Subagent/context-window quotation in §2.1 matches. |
| CLI invocation guide | 2 | Model-discretion quotation in §2.1 and precedence quotation in §4.2 match. |
| October 2025 CLI changelog | 1 | Agents-as-tools/agentic-loop quotation in §2.1 matches. |
| CLI command reference | 6 | ID derivation (§3.1), wildcard access (§3.2), load order and name dedupe (§4), model/effort precedence (§6.1), and instruction inheritance (§9) match. |
| Cross-surface reference | 4 | Prompt limit (§3.4), unknown tools (§7.1), Agents secrets (§8.3), and ignored cloud handoff keys (§10) match. |
| SDK custom-agent guide | 3 | Least privilege (§11.1), researcher/editor pattern (§11.2), and description/routing caution (§11.3) match. |
| VS Code subagent guide | 1 | Independent-context review caution in §11.2 matches. |
| Awesome Copilot README | 1 | Third-party customization inspection warning in §11.4 matches. |

Formatting differences from rendering Markdown/code spans do not change the quoted wording. No quotation needed a corrected source URL.

## Source Authority Compliance

Core configuration claims rely on GitHub Docs and official release notes. VS Code evidence is mostly kept to portability and explicitly marked conceptual examples. The report correctly recognizes that GitHub hosting does not make Awesome Copilot submissions first-party-authored technical specifications.

**M1 — 🟢 Minor: Clarify the header's provenance summary.** The header says “No third-party sources are cited” and describes all six repository entries under an official-repository umbrella, whereas §§11 and 16 correctly label references 26–27 community material. The checked README explicitly describes third-party developers. This matters for accurate source-authority signaling, not for the core claims. Replace the blanket statement with “No third-party blogs; two GitHub-hosted community references are clearly labeled and are not used as the CLI specification.” Non-blocking.

## Conflict & Uncertainty Disclosure

The researcher handles the requested conflicts responsibly:

- `infer` is active in the CLI reference/comparison and SDK guide, retired in the cross-surface table, and deprecated in VS Code. These descriptions genuinely coexist.
- `models`/`modelPolicy`/`reasoningEffort` versus release-note `model` arrays/`model-policy`/`reasoning-effort` is a real documentation discrepancy. Preferring the CLI reference is reasonable when not represented as runtime-tested acceptance of both spellings.
- `user-invocable`, `disable-model-invocation`, `target` and `metadata` are not independently confirmed as CLI runtime behavior merely because a cross-surface table includes them. The report usually preserves that distinction.
- The org setup page currently carries its preview banner. CLI GA does not by itself resolve remote-agent rollout status.
- Sidekicks are documented but their release/status evidence remains unverified. Do not promote “status unverified” into a GA/preview slide fact.

F1 is the material missing conflict disclosure.

**M2 — 🟢 Minor: Avoid blanket unknown-key portability assurance.** In §10, “without fear” and “Each product ignores what it doesn't use” are broader than the checked sources, which explicitly guarantee ignored unknown tool names and certain cloud handoff properties, not every unknown frontmatter key on every surface. The paragraph does acknowledge inference, so this is non-blocking. Replace the assurance with a qualified, surface-tested portability checklist.

## Source Freshness & Currency

Live first-party checks corroborate the September 2026 additions and October 1 changelog currency:

- 1.0.83, 2026-09-04: ordered model selection and required policy, using the release note's alternative spellings.
- 1.0.86, 2026-09-17: `include-custom-instructions: true`.
- 1.0.88, 2026-09-22: selected-agent reasoning effort fix.
- 1.0.89, 2026-09-28: slash-containing MCP tool filter fix.

The CLI/SDK GA and org-preview treatment is appropriately sourced, rather than deduced solely from absence of a preview label. Undated documentation should remain labeled by retrieval date, not an invented publication date.

**M3 — 🟢 Minor: Expand the existing nesting-depth conflict note.** §15.4 already discloses depth 6/max 256 versus the July release's 4/max 128, and R1 owns this topic. Live reading also found a contradiction *inside the same current CLI reference*: its `COPILOT_SUBAGENT_MAX_DEPTH` environment-variable row says default 4/range 1–128, while its “Subagent limits” section says 6/256; the configuration-directory settings table also says 6/256. This matters because calling the reference “more recent” does not establish runtime truth. Add the source-internal discrepancy, avoid implying a verified chronology, and keep the installed-version resolution with R1. Non-blocking for R2 because this is already disclosed as unresolved and is not a numeric demo prerequisite.

## Topic Coverage Assessment

R2 coverage is comprehensive: file anatomy, supported/documented fields, prompt ceiling caveat, locations/precedence, all principal invocation paths, models/effort, tool scoping, agent MCP servers, repository instructions, portability and design patterns.

The CLI-first focus is preserved. Org/enterprise discussion is limited largely to locations/status and refers governance to R7. MCP, permissions, built-in-agent mechanics and `/fleet` are appropriately cross-referenced to their owners. Official building blocks are clearly distinguished from synthesized patterns and community catalog material.

The Executive Summary accurately reflects the verified body, subject to F1 in the practical orchestration guidance. No material missing assignment subtopic.

## Research Limitations Review

The limitations are unusually candid and useful: cross-surface gaps, spellings, `infer`, depth, remote-agent status, prompt ceiling, secrets resolution, tool aliases, MCP names/order and unexecuted examples are all identified.

The statement that examples have not run is acceptable for a research report; ordinary examples do not need execution to pass this audit. However, it does not resolve F1's specific conflict between a promised capability and existing restriction-inheritance evidence. Add that dependency explicitly and avoid treating the coordinator walkthrough as established functionality pending its resolution.

## Code & CLI Validation

Read all **10 fenced code/command examples** without executing them.

- YAML/frontmatter, JSONC and shell syntax appear well formed on inspection.
- All examples include visible in-block source comments; synthesized/adapted examples are labeled rather than passed off as vendor code.
- The five fences labeled verbatim were checked against their corresponding concept/how-to/reference sources, including the command pair, README profile, repository-aware reviewer, cloud MCP profile and sidekick.
- The cloud MCP profile's placeholders are explicitly the source's placeholders and the section is marked cloud-flavored, not a runnable CLI setup.
- The security reviewer uses documented CLI fields, remote MCP schema and environment expansion. Its fallback for failed library-documentation lookup is explicit. Its actual model resolution and third-party MCP runtime behavior remain untested, as disclosed.
- The coordinator and implementer have bounded prompt loops, but the capability inheritance needed to connect them remains F1.
- §12.3 explicitly acknowledges broad automatic tool approval and separates availability from permission; detailed permission policy remains R4's responsibility. Presenters should use a disposable trusted demo repository.

**M4 — 🟢 Minor: Separate attribution after the implementer block.** In §12.2 the implementer and coordinator blocks share the source/provenance note placed after the second block. Attribution inside both is clear, but the implementer lacks its own immediately following note. Add one after that block for strict contract consistency and easier excerpt reuse. Non-blocking.

## Reference List Integrity

The **27-entry** list matches the header count and breakdown: 14 GitHub Docs, 2 VS Code pages, 4 GitHub Changelog posts, 1 GitHub Blog article and 6 repository references. Every numbered reference is used in the body; body source citations map to the list after normalizing fragments. No orphaned numbered references were found.

Context7's endpoint is an example configuration value, not an omitted research citation; its configuration shape is attributed to the official MCP how-to. Reference categories are usable, although the repository heading/header should better reflect community provenance as noted in M1.

The report's `Topic slug` and `**Required MCP:** verified - WebIQ-MCP; tools used: web, browse, news` marker are well formed and name the required `web` and `browse` tools. This audit independently verifies its own required tool usage, not the researcher's complete execution history.

## Report Structure & Readability

Clear numbered sections, navigable contents and well-labeled tables. No material structural issue. The length is appropriate as background research rather than a verbatim 60-minute script. Demo timings should be selected by the presentation orchestrator, not interpreted as a requirement to use all five demonstrations.

The supplied lint PASS is consistent with the absence of declared banned terms. No binding verified-fact conflict or substantive out-of-scope framework/editor discussion was found.

## Suggested Improvements (Prioritized)

1. **Must fix — F1, 🟡 Important:** Resolve or explicitly demote the restrictive-coordinator/wider-child capability claim and remove the unresolved version from the demo-ready workflow. Keep the CLI, SDK and VS Code mechanisms distinct.
2. **Optional — M1, 🟢 Minor:** Reconcile header provenance with the two community references.
3. **Optional — M2, 🟢 Minor:** Qualify unknown-frontmatter portability assurances.
4. **Optional — M3, 🟢 Minor:** Record the source-internal depth contradiction for R1.
5. **Optional — M4, 🟢 Minor:** Add an immediate source/provenance note after the implementer block.

No additional hands-on execution is demanded by this review. F1 can be addressed through authoritative evidence or a candid reclassification and conservative, clearly qualified replacement.

## Readiness Verdict: NEEDS REWORK

**Remaining must-fix blocker: F1 — 🟡 Important**, the unestablished CLI tool-restricted coordinator → edit/shell-capable child pattern and its demo-ready presentation.

No 🔴 Critical findings. M1–M4 are non-blocking and do not independently prevent approval. The rest of the report is well sourced and suitable for caller-managed presentation planning. The report is ready for **caller-managed revision** focused on F1; no research report or binding input was changed.

## Review Round 2 - 2026-10-05

Re-read the complete revised report, the binding brief, and the prior review. The supplied mechanical lint result remains PASS. This round changes only the review's metadata verdict and appends this assessment; Round 1, the research report, and binding inputs remain unchanged.

**Required MCP verification:** `web` and `browse` were available and successfully invoked anew. Independent `web` search found issue #4320's immediate-parent MCP-tool reproduction. `browse` returned meaningful first-party content from the CLI custom-agent concept page, including the built-in task agent's inherited tool/permission description. It also successfully retrieved both newly cited issues after routine fetching returned non-content GitHub messages. No MCP retry or alternate-server substitution was needed.

### Fix Verification

| Prior finding | Status | Verification |
|---|---|---|
| **F1 — 🟡 Important** | **✅ fixed** | §7.5 distinguishes session-wide restrictions, custom-agent frontmatter filters, and SDK default-agent-only exclusions. §§1, 11.3 and 15 explicitly classify narrow-parent/wider-child CLI orchestration as unresolved. §§12.2–12.4 use the default main session for the demonstrated creator↔reviewer flow and distinguish its behavioral no-edit rule from an enforced tool boundary. The optional `change-coordinator` now lists the child tools, is prominently unverified, and is explicitly excluded from the demo path. Official changelog and SDK evidence were rechecked; the two new issue reports are accurately identified as corroboration rather than specifications. This satisfies the conservative-replacement/reclassification option offered in Round 1; it does not establish the original narrow-parent design. |
| **M1 — 🟢 Minor** | **✅ fixed** | Header and repository category now distinguish four official changelogs, two user-filed issue reports, and two GitHub-hosted community references. “No third-party blogs” replaces the inaccurate blanket statement. |
| **M2 — 🟢 Minor** | **⚠️ partially fixed** | §10 checklist item 4 now expressly limits the documented guarantees, requires testing mixed frontmatter on each supported surface, and permits surface-specific copies. However, the opening paragraph still says the cross-surface reference resolves differences by “ignoring unknown keys and unknown tool names.” That sentence remains broader than the checked source. The substantive checklist correction removes the unsafe blanket recommendation; this small residual inconsistency is waived below. |
| **M3 — 🟢 Minor** | **✅ fixed** | §15.4 tables both the source-internal CLI contradiction and configuration-directory values, no longer asserts an established recency ordering, and leaves installed-version resolution to R1. Current reference sections were checked again. |
| **M4 — 🟢 Minor** | **✅ fixed** | The implementer block in §12.2 now has its own immediately following source/provenance note. The newly added coordinating prompt also has in-block and immediately following attribution. |

## Reference Validation

**12 distinct cited URLs checked out of 29 references in this round.** Multiple sections of the CLI reference count once. All 12 produced substantive evidence through at least one reader; no checked source remains inaccessible or misattributed. These are fresh Round 2 checks, not a recount of Round 1's 20-source sample.

| Current report reference | Checked source | Outcome |
|---|---|---|
| 1 | [Cross-surface configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration) | Unknown-tool and explicit cloud-handoff compatibility guarantees confirmed; no universal unknown-key guarantee found. |
| 2 | [Create/use CLI custom agents](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli) | Explicit named-agent invocation and instruction opt-in support the replacement workflow's building blocks. |
| 3 | [About CLI custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents) | Web IQ browse confirmed task-agent parent-tool/permission wording, agent profiles and default/main-session delegation. |
| 5 | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Frontmatter, dispatch, load order, instruction inheritance and limits/sidekick sections checked; source-internal depth conflict persists. |
| 6 | [CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) | `subagents.agents` semantics and depth 6/max 256 settings table confirmed. |
| 8 | [Add CLI MCP servers](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) | Context7 HTTP example, header name and configuration shape confirmed. |
| 13 | [SDK custom agents](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents) | Main-agent-only exclusions and their distinction from globally applied filters confirmed. |
| 22 | [CLI main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) | Latest entry remains 1.0.91, 2026-10-01; September instruction/effort/filter updates remain present. |
| 23 | [CLI v1.0.76 changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.76/changelog.md) | 1.0.67/1.0.68 inheritance statements confirmed again. |
| 26 | [Issue #2563](https://github.com/github/copilot-cli/issues/2563) | Routine fetch returned a non-content GitHub message; browse retrieved the report and closing comment. The cited harness-enforcement wording and April 7 closure are authentic. |
| 27 | [Issue #4320](https://github.com/github/copilot-cli/issues/4320) | Routine fetch returned a non-content GitHub message; browse retrieved the detailed 1.0.73/1.0.74 controls and immediate-parent reproduction. The returned copy is crawled 2026-08-19 and shown open, consistent with the report's qualification—not proof of current October runtime behavior. |
| 28 | [Awesome Copilot README](https://github.com/github/awesome-copilot) | Community provenance and inspection warning confirmed. |

## Claim Citation Coverage

**F1 is closed.** The corrected report no longer treats a restricted selected-agent parent as proven to dispatch wider children. The default-session replacement is synthesized from documented invocation and specialist-scoping capabilities, not presented as an official end-to-end profile.

Primary sources carry the configuration claims. The issue evidence supplements, rather than replaces, official restriction-inheritance release notes. No new material citation defect.

## Quote Verification

**15 of the report's 19 standalone prose blockquotations reverified this round**, using the same counting convention as Round 1: exclude attribution-only blockquotes, the spelling admonition, code literals and short inline fragments.

| Checked source | Quotations reverified | Outcome |
|---|---:|---|
| CLI command reference | 6 | ID derivation, wildcard tools, load priority, name dedupe, model/effort precedence and repository-instruction inheritance match. |
| Cross-surface configuration | 4 | Prompt ceiling, ignored unknown tools, Agents secrets and cloud handoff compatibility match. |
| SDK custom agents | 3 | Least privilege, researcher/editor pattern and description-routing caution match. |
| CLI create/use guide | 1 | Separate subagent-context quotation matches. |
| Awesome Copilot README | 1 | Third-party customization inspection warning matches. |

The remaining four standalone quotations are unchanged and were verified in Round 1; they were not freshly checked here. Additionally, both new inline issue quotations were verified: #2563's harness-enforcement explanation and #4320's “observed rule depends on the leaf's immediate parent” sentence. Their attribution and corroboration labels are accurate.

## Source Authority Compliance

No material issues. The revised header and references properly distinguish project release notes, user-filed reports and community content. The issue closer's comment is attributed to the account that triaged/closed the issue without unsupported claims about that person's authority.

## Conflict & Uncertainty Disclosure

The central tool-inheritance uncertainty is now explicitly disclosed, including the difference between SDK default-agent exclusions and CLI `.agent.md` settings. The optional coordinator is separated from the demonstration rather than asserted to be verified.

Previously disclosed `infer`, spelling, cross-surface keys and release-status ambiguities remain visible. **M2's residual opening sentence is the only remaining prior minor issue**, and does not override the accurate, qualified portability checklist.

## Source Freshness & Currency

The October 1 changelog and current official reference sections were refreshed. The report accurately bounds #4320 to a retrieved August copy and versions 1.0.73/1.0.74; it does not claim that this reproduction certifies 1.0.91.

The expanded limits-conflict table correctly avoids declaring either numeric pair the verified installed-version truth. No newly detected currency blocker.

## Topic Coverage Assessment

R2's CLI configuration, locations, invocation, tool/model/MCP scoping, portability and pattern coverage remains comprehensive. The replacement orchestration guidance is better suited to novices because it does not imply undocumented privilege expansion.

Neighboring assignment boundaries and appendix routing remain appropriate. No new material coverage gap.

## Research Limitations Review

§15 now specifically identifies narrow-parent/wider-child uncertainty, limits issue-report authority, and records both unexecuted examples and the optional variant's exclusion from the demo path. These qualifications are adequate for research publication.

Approval does not certify live-demo execution, third-party MCP availability or disputed runtime behavior. Rehearsal on the presenter's installed version remains an explicitly stated downstream prerequisite, not an unresolved research blocker.

## Code & CLI Validation

Read all **11 fenced examples** without execution. The added coordinating prompt, revised coordinator list and revised launch guidance are syntactically plausible on inspection and carry clear provenance.

The main-session demo does not launch `change-coordinator`. The optional profile no longer claims an enforced no-edit boundary; its larger tool list and behavioral restriction are candidly explained. Agent-scoped MCP inheritance remains qualified, with the reviewer's documented fallback for unavailable library-doc tools.

No unresolved material syntax, provenance or technical-validity defect.

## Reference List Integrity

The **29-entry** list matches the header: 14 GitHub Docs, 2 VS Code pages, 4 GitHub Changelog posts, 1 GitHub Blog article and 8 repository items. Both added issues are cited in the body. The community references are renumbered consistently to 28–29, with no orphaned references found.

Topic slug and required MCP marker remain well formed. The latest review-round MCP status is verified independently.

## Report Structure & Readability

No material issues. The expanded restriction-mechanism table and default-session prompt clarify the lesson without changing the CLI-first scope. Synthesized patterns, official building blocks and optional unverified variants remain distinguishable.

## Suggested Improvements (Prioritized)

1. **Optional — M2, 🟢 Minor:** Align §10's opening sentence with its corrected checklist. Suggested wording: “The reference explicitly ignores unknown tool names and certain cloud-agent handoff properties; other mixed frontmatter requires surface-specific verification.” This avoids confusing readers before they reach the caveat.
2. Preserve the existing rehearsal requirement and do not promote the optional coordinator, unresolved depth values or unverified CLI cross-surface keys into verified slide/demo claims.

No must-fix changes remain. The residual M2 item is waived rather than used to require another revision round.

## Readiness Verdict: APPROVED

**Remaining must-fix blockers: none.** F1 is **✅ fixed** through the conservative replacement and explicit reclassification accepted in Round 1. M1, M3 and M4 are **✅ fixed**; M2 is **⚠️ partially fixed**, remains **🟢 Minor**, and is **waived**.

The report is publication-ready as research input for caller-managed presentation development, subject to its stated limitations and demo rehearsal. No report or binding input was modified.
