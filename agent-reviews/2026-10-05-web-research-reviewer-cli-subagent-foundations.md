---
reviewer: web-research-reviewer
subject: "Copilot CLI multi-agent foundations and built-in subagents"
companion: web-researcher
date: 2026-10-05
required_mcp: WebIQ-MCP
mcp_status: verified
verdict: APPROVED
---

## Review Round 1 - 2026-10-05

**Report:** `research/2026-10-05-cli-subagent-foundations.md`  
**Binding context:** `brief.md`, including the review rubric and R1 override; caller-provided mechanical lint PASS.  
**Review method:** Full report read; independent official-source checks as of 2026-10-05; code and commands inspected, not executed. The report and binding inputs were not modified.

**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

Both required tools were available and successfully invoked. Independent Web IQ searches checked selective delegation, its v1.0.42 threshold, and missing status announcements. Web IQ browse returned meaningful content from the critical [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), including the task-management documentation. Routine reads used `web_fetch`; the official documentation source was also read where rendered tables made targeted inspection inefficient. No required-MCP blocker occurred in this round.

**Overall assessment:** Strong primary-source research with unusually useful conflict disclosure. The seven-agent catalog, major release dates, selective delegation, multi-turn history, and reference inventory are supported. Publication readiness is blocked by five bounded issues: overgeneralized model behavior, unsupported context-tier precedence and an invalid inheritance implication, an omitted plan-mode safety qualification, a demo shortcut conflict with a newer stable changelog, and unresolved lifecycle labels for presentation-facing features.

## Reference Validation

**30 of 30 cited URLs checked**, including targeted content checks rather than a full line-by-line audit of every page. Reference numbers below are the report's reference-list numbers. An additional official `github/docs` source file for the command reference was inspected; it is not counted as an additional report citation.

| Ref. | Checked source | Outcome |
|---|---|---|
| 1 | About GitHub Copilot CLI | Accessible. Confirms the general CLI/context discussion; still describes compaction at 95%, unlike the more detailed context page. |
| 2 | About custom agents | Accessible. Confirms all seven built-in names, purposes, permissions description for `task`, separate contexts, and slash-command-only `research`. |
| 3 | Context management | Accessible. Confirms 20 KiB output handling, 80% background start, 95% waiting threshold, checkpoint commands, and irreversible compaction. |
| 4 | CLI command reference | Accessible through Web IQ browse and routine fetch; official source inspected for deep sections. Confirms built-in defaults, model/effort precedence, tools, `/tasks`, `/subagents` alias, limits, communication, sidekicks, and OTel. Contains the reported internal limits conflict. |
| 5 | CLI configuration directory | Accessible. Its official source confirms `subagents.*`, inheritance fields, rubber-duck switches, and the 6/256 depth figures. |
| 6 | Rubber duck concepts | Accessible. Confirms complementary model selection, read-only critique, high-leverage invocation, and the example slash-command prompt. |
| 7 | Research concepts | Accessible. Confirms report creation without `edit`/`bash`, fixed-model behavior independent of the main session, and `/research` usage. |
| 8 | Comparing CLI features | Accessible. Confirms definition-versus-execution distinction, separate contexts, delegation through `task`, and `subagentStop` interception. |
| 9 | Steering agents | Accessible. Confirms Enter steering versus Ctrl+Enter/Ctrl+Q queued follow-up. |
| 10 | Invoking custom agents | Accessible. Confirms model-judged delegation, explicit naming, `/agent`, and the CLI invocation example. Its shorter four-agent table is not an exhaustive current catalog. |
| 11 | `/fleet` concepts | Accessible. Confirms independent subtasks, separate windows, model requests and agent mentions, and increased AI-credit interactions. Its low-cost-default wording is broader than the built-in table. |
| 12 | CLI best practices | Accessible. Confirms model-name inconsistency, BYOK inheritance wording, planning workflow, and the exact security-review demo prompt. |
| 13 | Auto model selection concepts | Accessible. Confirms Efficiency/Balance/Intelligence, plan/policy restrictions, GA availability, and paid-plan 10% discount. |
| 14 | SDK custom agents | Accessible. Confirms scoped agent definitions, inference, opt-in skills, delegation stages, and same-model-only effort inheritance wording. CLI applicability remains a disclosed inference. |
| 15 | Custom agents changelog, 2025-10-28 | Accessible. Confirms availability during CLI preview and the exact new-agentic-loop quotation. |
| 16 | Enhanced agents changelog, 2026-01-14 | Accessible. Confirms Explore, Task, Plan, and Code-review in the historical list. |
| 17 | CLI GA changelog, 2026-02-25 | Accessible. Confirms GA for Copilot subscribers and the historical Plan entry. The February 27 editor's correction is visible. |
| 18 | Cross-family second-opinion blog, 2026-04-06 | Accessible. Confirms experimental rubber duck, initial GPT-5.4 critic, coding-loop quote, and invocation through `task`. |
| 19 | Auto changelog, 2026-04-17 | Accessible. Confirms CLI Auto GA. Historical premium-request wording is appropriately supplemented by current concepts documentation. |
| 20 | Rubber duck models changelog, 2026-05-07 | Accessible. Confirms GPT-session Claude critic and Claude-session GPT-5.5 critic, still experimental at that date. |
| 21 | CLI updates changelog, 2026-06-02 | Accessible. Explicitly confirms rubber duck GA; June 3 correction concerns scheduling, not rubber duck. |
| 22 | Security-review changelog, 2026-06-10 | Accessible. Explicitly confirms experimental public preview, local-change scope, 11 categories, and complementary—not replacement—relationship to scanners. |
| 23 | Selective-delegation blog, 2026-06-12 | Accessible and independently found with Web IQ. Confirms v1.0.42+, 100% rollout, vendor-reported 23% fewer failures and 5% lower P95 wait time. |
| 24 | Dynamic workflows changelog, 2026-10-01 | Accessible. Confirms public preview and CLI experimental enablement; appropriately cross-referenced to R5. |
| 25 | Official CLI changelog, main | Accessible. Confirms stable 1.0.91 dated 2026-10-01, 1.0.85/86/87 history, model additions, and the shortcut conflict in finding F4. |
| 26 | Official CLI changelog, v1.0.75 | Accessible. Confirms 1.0.71 depth reduction, 1.0.72 always-enabled multi-turn agents, and 1.0.74 `/model plan`. |
| 27 | Official CLI README, main | Accessible but visibly stale on default model and premium-request accounting, as the report correctly notes. Experimental-setting persistence is present. |
| 28 | Official CLI Releases | Accessible. Confirms stable 1.0.91 and pre-release 1.0.92-1 steering/rubber-duck availability fixes. |
| 29 | Official configuration-directory Markdown source | Accessible. Supports the same configuration claims as reference 5; correctly counted as a separate URL, not independent corroborating evidence. |
| 30 | JonathanMace community design note | Accessible. Confirms its v1.0.17 provenance, sync/background parameter description, and idle-agent lifecycle. Not current official API authority. |

No checked report citation was fabricated, misattributed, or inaccessible. Reachability does not resolve contradictory documentation or establish a feature's GA status.

## Claim Citation Coverage

Most substantive claims have adjacent citations, including statistics, defaults, architecture, memory permissions, and security-review scope. Three interpretations exceed what the cited material establishes.

### F1 — 🟡 Important — Universal Auto inheritance conflicts with documented specialist behavior

- **Location:** Executive Summary, model-selection bullet; §5.1 “When the session uses Auto, the session model always wins”; §9 model-selection advice and pitfalls.
- **Issue:** The report converts the command reference's qualification of the custom-agent `model` field into an unconditional rule for all subagents. Elsewhere the report correctly says `research` always uses a fixed model and rubber duck deliberately selects a complementary model. It does not explain how those specialist rules interact with the blanket Auto claim or a required authored-model policy.
- **Verification evidence:** The [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#custom-agent-frontmatter-fields) says inheritance happens “regardless of this field,” in the `model` field description. The [research page](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research) says its fixed model is used regardless of the model selected for the main session. The [rubber-duck page](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck) describes automatic contrasting-model selection. The same command reference also documents `modelPolicy: "required"` locks.
- **Why it matters:** Model selection is a core R1 learning objective. A beginner could infer that Auto eliminates the different-model critic or changes the research model, or misunderstand a required-model dispatch failure.
- **Concrete correction:** Limit the Auto statement to the documented custom-agent model-field rule. Explicitly separate research's fixed-model behavior and rubber duck's complementary-model behavior. Mark Auto's interaction with these special paths and required policies as unresolved unless a primary source establishes it. Remove “always”/“any per-agent model” generalizations from the summary and practical advice. No runtime assertion should be invented to reconcile the sources.

### F2 — 🟡 Important — Context-tier precedence is not established by the cited model/effort rule

- **Location:** Executive Summary precedence bullet; §5.1 resolution table, particularly priorities 2–3.
- **Issue:** The summary assigns model, reasoning effort, and context tier the same fixed four-layer chain. The exact official quotation specifies **model and effort**, not context tier; the listed agent-definition fields do not include a context-tier field. Additionally, priority 2 says “any of them” can be `"inherit"` after listing `modelPolicy`, which permits only `"preferred"` or `"required"`.
- **Verification evidence:** The [command reference's frontmatter section](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#custom-agent-frontmatter-fields) documents model/effort precedence and lists `model`, `models`, `modelPolicy`, and `reasoningEffort`. The [configuration reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) restricts `"inherit"` to `model`, `effortLevel`, and `contextTier`, while specifying the two policy values. The [v1.0.85 changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) establishes honoring explicit context-tier preferences, not the whole claimed precedence chain.
- **Why it matters:** This is load-bearing configuration guidance, not an incidental terminology issue. It implies both an undocumented definition layer for context tier and an invalid policy value.
- **Concrete correction:** Present the verified model/effort chain separately. Describe only the documented context-tier controls and inheritance, labeling any unresolved ordering as ⚠️ unverifiable rather than “fixed precedence.” State precisely that `model`, `effortLevel`, and `contextTier` support `"inherit"`; `modelPolicy` does not. Keep the SDK effort rule identified as SDK evidence, not a confirmed CLI experiment.

### F3 — 🟡 Important — Plan-mode inheritance needs the source's safety qualification

- **Location:** §2.5 “Plan-mode protections” row and the following delegated-subtasks quotation.
- **Issue:** The table and quotation convey enforced project-mutation protection without the adjacent official qualification that it is not an airtight lockdown. The quotation itself is authentic; the missing qualification is the problem.
- **Verification evidence:** [Command reference — Plan mode](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#plan-mode) explicitly distinguishes clear direct mutations from shell commands whose effects cannot be determined and external/MCP calls that are allowed through. It says plan mode is a safety net, not a guarantee that nothing on disk can change.
- **Why it matters:** Audience members new to agents must not equate inherited planning restrictions with comprehensive isolation or a sandbox. Deferring detailed permissions to R4 does not justify dropping the qualification on an R1 security assertion.
- **Concrete correction:** Add a short qualification immediately alongside the table/quote: helpers inherit plan-mode restrictions on recognized direct mutations, but unknown-effect shell operations and external/MCP tools can still have effects; this is not an absolute no-write guarantee. Cross-reference R4 for the detailed boundary.

## Quote Verification

**23 of 23 standalone quoted block passages verified against their cited sources.** This inventory excludes scope notes, source/provenance annotations, and configuration string literals. Inline prose excerpts were spot-checked as part of claim validation; the two demo prompts explicitly described as verbatim were also matched.

Whitespace and Markdown emphasis were normalized for comparison. No missing quotation required a corrective-URL search; the delegation quotations were additionally located through independent Web IQ search.

| Report line | Quotation identifier | Source ref. | Outcome |
|---|---|---|---|
| 46 | Subagent execution definition | 8 | Matched. |
| 49 | Main agent and built-in assistance | 2 | Matched. |
| 61 | Custom agents available as tools/new loop | 15 | Matched. |
| 68 | Keeping main context focused | 8 | Matched. |
| 80 | Independent LLM interactions and costs | 11 | Matched. |
| 83 | Parallelism, not a pause button | 23 | Matched; independently searched. |
| 90 | Assess/plan/implement/test/iterate loop | 18 | Matched. |
| 95 | Entire `invoke_agent` invocation | 4 | Matched in official source. |
| 119 | 80% background compaction | 3 | Matched. |
| 147 | Root-only memory storage/voting | 4 | Matched in official source. |
| 150 | Delegated planning restrictions | 4 | Matched; contextual omission is F3, not invented text. |
| 178 | Different-model rubber duck | 6 | Matched. |
| 181 | Research only through slash command | 2 | Matched. |
| 202 | Model judges whether to delegate | 10 | Matched. |
| 209 | Focused work versus delegation | 23 | Matched; independently searched. |
| 240 | Background execution/results excerpt | 30 | Matched as an excerpt; correctly attributed to community evidence. |
| 247 | Always-enabled multi-turn agents | 26 | Matched under 1.0.72. |
| 285 | Model/effort precedence | 4 | Matched; extending it to context tier is F2. |
| 300 | Auto inheritance for the `model` field | 4 | Matched; universal interpretation is F1. |
| 305 | Different-model effort default | 14 | Matched. |
| 321 | Three fields support `"inherit"` | 5/29 | Matched. |
| 404 | Nested task tree/teleport steering | 4 | Matched. |
| 433 | Depth versus whole-tree concurrency | 4 | Matched. |

The `/rubber-duck What edge cases are missing?` prompt matches reference 6. The full local-change `/security-review` prompt matches reference 12. The agent-communication tool-call excerpts also match the command-reference examples.

## Source Authority Compliance

The reference mix is appropriate: **29 official URLs and one clearly identified community URL**. Core catalog, release, security-review, and model-setting claims use official material. Vendor A/B-test results are identified as vendor-reported, not independent performance guarantees.

The community note is visibly version-bound to 1.0.17. Official evidence independently supports sync/background operation, background promotion, notifications, and follow-up tools; the exact `task.mode` schema remains community-only. Do not promote that schema or idle-state persistence into a current, supported API contract. The report already discloses this limitation adequately; no additional must-fix finding is raised for it.

Official documentation source files are primary evidence, but a rendered page and its source file are not independent corroboration.

## Conflict & Uncertainty Disclosure

The reported limits conflict is real and well handled:

- Dedicated limits/configuration sections: depth default 6, maximum 256; concurrency plan-based, maximum 32.
- Environment-variable table: depth default 4, range 1–128; concurrency default 32, range 1–256.
- Dated 1.0.71 changelog: reduction from 6 to 4, adjustable maximum 128.

The report appropriately avoids a definitive runtime depth number. Current undated documentation cannot automatically be dismissed as older than a July changelog; the report acknowledges a possible later undocumented change. No rework is demanded merely because official sources disagree.

The `gpt-5.6-luna` versus `gpt-6-luna` conflict is also present in official material. Likewise, best practices and `/fleet` still mention Claude Opus 5/Sonnet 5 while the command reference lists other IDs. The report's point-in-time labeling and picker check are sensible; do not “correct” the built-in table to a guessed supported ID.

Remaining material gaps are F1–F3 and F4 below: the model special cases, context-tier inference, plan-mode boundary, and newer shortcut evidence need equally explicit treatment. Unknown research override behavior and undocumented sibling-communication enablement are already candidly identified.

## Source Freshness & Currency

The principal dates and versions are supported:

- CLI GA: **2026-02-25**.
- Built-in historical Explore/Task/Code-review/Plan announcement: **2026-01-14**.
- Selective delegation: **v1.0.42+**, described in the **2026-06-12** post.
- Rubber duck: experimental **2026-04-06**, **GA 2026-06-02**, every model family/low-cost tier **v1.0.87, 2026-09-21**.
- Security review: **experimental public preview, 2026-06-10**; no checked source establishes GA.
- Multi-turn always enabled: **v1.0.72, 2026-07-20**.
- Instruction opt-in: **v1.0.86, 2026-09-17**.
- Latest stable supported by checked release/changelog pages: **1.0.91, 2026-10-01**; the cited **1.0.92-1** behavior is correctly treated as pre-release.

The current seven-agent lists do not include Plan. The historical GA post already mentions both plan mode and a Plan agent, so absence from today's list is not evidence of a dated migration or formal deprecation. The report correctly says no removal notice was found; that qualification should travel with any slide shorthand.

### F5 — 🟡 Important — Core presentation-facing lifecycle labels remain unresolved

- **Location:** §3 catalog; §7.1 status table; §11 item 6.
- **Issue:** The report openly leaves GA/preview status unknown for `general-purpose`, `research`, `/subagents`, and sidekicks. That is preferable to inventing labels, but it does not complete the brief's requirement to label presentation features by lifecycle and source date. `/subagents` is central to the proposed demonstrations.
- **Verification evidence:** The checked current concept/reference pages document these features without individual lifecycle labels. Targeted official-blog searches did not locate a definitive feature-specific announcement resolving the report's gap. The report itself explicitly identifies the missing labels. CLI product GA is not sufficient evidence that every subsequently documented feature is individually GA.
- **Why it matters:** The caller needs to know which claims can enter a presentation that requires GA/preview labels. “Shipped,” “documented,” or a retrieval date cannot silently become a feature-specific GA announcement.
- **Concrete correction:** Add a presentation-use status decision for each unresolved item: obtain dated primary lifecycle evidence, or explicitly mark lifecycle status ⚠️ unverifiable and place that item on a hold/omission list for labeled feature claims and demos. Keep sidekicks as an excluded optional mention if unresolved. This does not require fabricating labels or broadening R1 into other assignments; the caller owns any exception to the brief.

## Topic Coverage Assessment

R1 coverage is strong: vocabulary, motivations/trade-offs, agent loop, context/compaction, all seven names and defaults, delegation judgment, sync/background operation, multi-turn control, models/effort/context settings, task inspection, limits, observability, terminology, and practical scenarios are present.

Cross-references generally honor the assignment split. R2/R3 configuration and R4/R5 workflow details are included only as orientation or practical prerequisites. Scope exclusions are explicit; no substantive banned-term or editor/framework scope violation was found.

The three demo suggestions total about **21 minutes**. They should be alternatives or building blocks, not implicitly an R1 allocation inside the entire 60-minute multi-assignment session. This is a non-blocking planning improvement, not a demand for additional research.

## Research Limitations Review

The limitations section is substantive and useful, not performative. It identifies conflicting limits, model-name mismatches, community-only API details, missing lifecycle evidence, unknown research override behavior, SDK/CLI effort differences, unavailable enablement details, and lack of hands-on tests.

Update it to include the unresolved context-tier ordering and Auto/specialist interactions in F1–F2 and the shortcut discrepancy in F4. A limitation should also change the corresponding summary or demo guidance; a distant caveat does not repair an unconditional statement.

No hands-on execution is required by this review. A researcher may qualify or remove unverified runtime assertions rather than claim a test was performed.

## Code & CLI Validation

**10 fenced blocks inspected by reading:** one diagram, one tool-call excerpt, one JSONC fragment, two model-control examples, two OTel shell examples, and three demo scripts. No code or commands were executed.

The examples have visible source comments inside and provenance/source attribution after the blocks. Bash and PowerShell OTel setup use documented variables and capture only metadata by default. The JSONC example is structurally plausible; the current configuration page explicitly supports JSONC, so comment removal is not required for Copilot's parser. Placeholder agent IDs and task descriptions are clearly illustrative rather than claimed runnable integrations. Model availability is correctly deferred to the demo account's picker.

### F4 — 🟡 Important — Demo keyboard notation conflicts with newer stable behavior

- **Location:** §6.1 shortcut table; Demo A navigation annotation; Demo B `B` annotation and fallback.
- **Issue:** The report reproduces uppercase `K`, `J`, `X`, `R`, and `B` from the documentation and directs presenters to press `B`. A newer stable changelog explicitly limits these task-letter shortcuts to unmodified lowercase letters. The conflict is not disclosed, despite the report otherwise reconciling documentation/changelog differences.
- **Verification evidence:** The current [command-reference shortcut table](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#tasks-dialog-shortcuts) prints uppercase keycaps. The [v1.0.85 changelog, 2026-09-16](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) says modified chords and capital X no longer trigger `/tasks` shortcuts, and “only unmodified a, f, x, r, b, j and k respond.” The report targets later stable 1.0.91.
- **Why it matters:** An audience following literal capital-letter/Shift input can fail to navigate, kill, remove, or background a task during the demonstration.
- **Concrete correction:** Use `j`, `k`, `x`, `r`, and `b` as the literal typed keys and explicitly say **no Shift/modifier**. Note that official reference keycaps are uppercase labels but the newer stable changelog specifies unmodified lowercase input. Update Demo B's background-promotion instructions and retain Ctrl+X then lowercase `b` as the alternative. Treat this as documentation/changelog reconciliation, not a claimed executed test.

The model-control examples are otherwise supported at the flag/name level. F2 concerns their surrounding interpretation, not an obvious syntax defect in the actual JSONC fragment.

## Reference List Integrity

Counts reconcile exactly: **14 official Docs + 10 Blog/Changelog + 5 official repository URLs + 1 community URL = 30**.

All body citation URLs are represented in the reference list, and all listed sources have a body use, including the source-file access note. Categories correctly distinguish the community repository from official GitHub repositories. Reference 29 is appropriately identified as the source of reference 5.

The topic slug matches the filename. The report's required-MCP marker is well formed and names at least `web` and `browse`. No mechanical-lint conflict was found.

## Report Structure & Readability

The summary, numbered sections, catalog, scenarios, limitations, and reference list are easy to navigate. The Table of Contents corresponds to the section organization. Summary model statements need F1–F2 corrections to accurately reflect the more qualified body.

### M1 — 🟢 Minor — Separate a short presenter extraction from the research depth

- **Location:** §§5–8 and the demo timing labels.
- **Issue/evidence:** The report's extensive tables and three approximately 21-minute demos are useful research but too much to assume as the foundations segment of the caller's 60-minute presentation.
- **Why it matters:** Without an explicit suggested minimum, assembly can crowd out the other assignments.
- **Concrete improvement:** Offer a brief recommended subset—main/subagent distinction, catalog, selective delegation, model preferences, and one demo—and label the other scenarios optional. No new artifact is needed.

### M2 — 🟢 Minor — Avoid implying a documented Plan-agent replacement event

- **Location:** Executive Summary and §7.2 “Plan built-in agent → plan mode” shorthand.
- **Issue/evidence:** Historical reference 17 mentions both features simultaneously; today's lists omit Plan, but no removal notice was located.
- **Why it matters:** A slide could accidentally turn an observed documentation difference into a formal rename/deprecation claim.
- **Concrete improvement:** Prefer “Plan is no longer listed; use documented plan mode” and carry the “no removal notice found” qualification into any extracted slide wording.

## Suggested Improvements (Prioritized)

**Must fix before approval:**

1. **F1 — 🟡 Important:** Scope Auto inheritance and explicitly separate fixed-model/complementary-model special cases and unresolved policy interactions.
2. **F2 — 🟡 Important:** Separate verified model/effort precedence from unverified context-tier ordering; restrict `"inherit"` to its documented fields.
3. **F3 — 🟡 Important:** Restore the plan-mode safety qualification alongside the inherited-protection claim.
4. **F4 — 🟡 Important:** Reconcile task-shortcut notation with v1.0.85 lowercase-only stable behavior and update demo instructions.
5. **F5 — 🟡 Important:** Resolve lifecycle labels with dated primary evidence or explicitly hold unresolved items out of presentation-ready labeled claims/demos.

**Nice to have:** M1 presenter subset and M2 more careful Plan shorthand. Neither minor item independently blocks approval. Preserve the existing transparent limits/model conflicts and the community-only schema disclaimer.

## Readiness Verdict: NEEDS REWORK

**Remaining must-fix blockers:** F1 universal Auto rule; F2 context-tier precedence and inheritance-value overreach; F3 missing plan-mode safety boundary; F4 shortcut/demo conflict with newer stable evidence; F5 unresolved lifecycle-label publication requirement.

No fabricated evidence, broken cited URL, or material scope violation was found. The report is a strong research foundation but is not yet publication-ready under the binding brief. It is **ready for caller-managed revision**; the caller retains routing, round limits, exception decisions, and workflow completion.

## Review Round 2 - 2026-10-05

**Report:** Revised `research/2026-10-05-cli-subagent-foundations.md`; full revised report read.  
**Binding context:** Latest `brief.md`, including the new lifecycle-label decision; caller-provided mechanical lint PASS.  
**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

Both required tools were available and successfully invoked afresh. Independent Web IQ search investigated the new v1.0.64 security-review availability claim; browse returned meaningful content from the critical [research-agent documentation](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research), including its fixed-model rule. Official changelogs and documentation were independently fetched for the corrections. No commands or demo code were executed. Only this existing review file was modified: its metadata verdict and this appended round.

### Fix Verification

| Prior must-fix finding | Status | Verification and disposition |
|---|---|---|
| F1 — 🟡 Important — Universal Auto inheritance | ✅ fixed | Executive Summary, §§5.1/5.4, example comments, and §9 now scope the rule to a custom agent's `model` field. Research's fixed model and rubber duck's complementary model are separate. Other Auto overrides, specialist interactions, and required-policy behavior are explicitly unresolved. Current command-reference source, research documentation, and rubber-duck documentation support this treatment. |
| F2 — 🟡 Important — Context-tier ordering and `"inherit"` | ✅ fixed | §§5.1–5.2 distinguish the documented model/effort chain from context-tier controls without claiming a shared ranked order or a frontmatter context-tier field. `"inherit"` is restricted to `model`, `effortLevel`, and `contextTier`; `modelPolicy` is `preferred`/`required`. Summary, code comments, advice, and limitations agree. The current configuration source matches these enums. |
| F3 — 🟡 Important — Plan-mode safety boundary | ✅ fixed | §2.5 now places the safety-net qualification directly beside the inherited-protection quotation and narrows the table to recognized direct mutations. Unknown-effect shell operations and external/MCP tools are expressly distinguished from complete isolation. §9 repeats the boundary. The new quotation matches the official plan-mode section. |
| F4 — 🟡 Important — Task shortcut/demo conflict | ✅ fixed | §§4.3/6.1/6.2, Demos A/B, pitfalls, and limitations specify unmodified lowercase `j k x r b`, identify uppercase documentation keycaps, and cite the v1.0.85 change. The Ctrl+X then lowercase `b` alternative is clearly outside the dialog. The live official changelog confirms the correction. |
| F5 — 🟡 Important — Lifecycle-label publication requirement | ✅ fixed | §7.1 supplies dated evidence and non-GA wording for research, subagent preferences, task inspection, and follow-ups; features lacking dated evidence (`general-purpose`, sidekicks) remain held out of labeled claims and demos. The newly binding caller decision authorizes the report's proposed dated “shipped/available; no separate status label” treatment. Its residual “caller decision” notes are resolved by that decision and do not require another report edit. The new official historical sources were checked, including the research introduction and security-review ungating. |

The two previous nice-to-have findings were also addressed: **M1 — ✅ fixed** by §8.0's minimal presenter extraction and optional demo designation; **M2 — ✅ fixed** by explicitly distinguishing Plan's absence from a rename, migration, or formal deprecation. No prior must-fix item remains open.

## Reference Validation

**14 of 32 cited URLs checked in this round**, prioritizing all five fixes and both new historical sources. Reference numbers are from the revised report. Rendered reference/configuration URLs were reachable; their official Markdown source counterparts were used for targeted deep-section validation. The additional command-reference source URL is supplemental, not a 33rd report reference.

| Ref. | Checked source | Outcome this round |
|---|---|---|
| 2 | About custom agents | Accessible; seven names, separate context windows, `task` permission inheritance, and slash-command-only research supported. |
| 3 | Context management | Accessible; context inspection and 80%/95% compaction explanation supported. |
| 4 | CLI command reference | Reachable; official source confirms model/effort precedence, scoped Auto wording, required-model locks, memory restriction, communication examples, limits, and plan-mode caveat. |
| 5 | CLI configuration directory | Reachable; claims checked against its cited official source, reference 29. |
| 6 | Rubber duck concepts | Accessible; contrasting-model critic, read-only behavior, availability condition, and example prompt supported. |
| 7 | Research concepts | Meaningful Web IQ browse response; fixed model independent of main-session selection and report-only workflow supported. |
| 16 | Enhanced-agents changelog, 2026-01-14 | Accessible; historical Plan entry and dated `/compact`/`/context` announcement supported. |
| 17 | CLI GA announcement, 2026-02-25 | Accessible; names Explore, Task, Code Review, custom agents, plan mode, `/review`, and auto-compaction as included capabilities. Also confirms Plan and plan mode were mentioned together. |
| 22 | Security-review announcement, 2026-06-10 | Accessible; explicit experimental public preview and local-change scope supported. |
| 25 | Official CLI changelog, main | Accessible; stable 1.0.91 dated 2026-10-01, v1.0.85 lowercase-only task letters, and v1.0.79 navigation/steering entry supported. |
| 26 | Official CLI changelog, v1.0.75 | Accessible; v1.0.71 limits/plan-mode caveat, v1.0.72 multi-turn enablement, and v1.0.74 timeline/model-plan entries supported. |
| 29 | Official configuration Markdown source | Accessible; supported inheritance values, required-policy lock, rubber-duck exclusion from `disabledSubagents`, and limits supported. |
| 30 | Official CLI changelog, v1.0.67 — new | Accessible; v1.0.64 dated 2026-06-23 explicitly removes security-review's experimental flag and mentions complementary rubber-duck configuration in `/subagents`. v1.0.66 idle-agent entries also matched. |
| 31 | Official compare patch — new | Accessible; context contains v0.0.417 dated 2026-02-25 adding `/research`; next patch adds the v0.0.418 GA entry. This is authentic historical evidence, not a feature-specific research GA announcement. |

No checked citation was inaccessible, fabricated, or misattributed. The other 18 URLs were not re-fetched this round; their Round 1 audit remains historical evidence, not a claim of fresh Round 2 access.

## Claim Citation Coverage

No unresolved material issues. F1–F3 are corrected where readers encounter the claims, not merely in a distant limitation. The new historical release assertions have adjacent official citations. The report no longer generalizes Auto across all launch paths or extends model/effort precedence to context tier.

The catalog preserves source-specific model IDs rather than guessing a reconciliation. Documentation-grounded assertions and untested runtime interpretations remain distinguishable.

## Quote Verification

**12 of 24 standalone quoted block passages re-verified in this round**, including the newly added plan-mode caveat. The total was enumerated from the revised report. Scope notes, provenance annotations, and configuration literals are excluded from this count. Unchecked block quotations were read in the revised report but are not represented as newly source-verified here.

| Revised report line | Passage | Checked source | Outcome |
|---|---|---|---|
| 60 | Main agent and built-in assistance | Ref. 2 | Matched. |
| 130 | 80% background compaction | Ref. 3 | Matched. |
| 158 | Root-only memory storage/voting | Ref. 4, official source | Matched. |
| 161 | Delegated plan-mode protections | Ref. 4, official source | Matched; qualification now adjacent. |
| 172 | Safety net, not a guarantee — new | Ref. 4, official source | Matched as an excerpt. |
| 207 | Different-model critic | Ref. 6 | Matched. |
| 210 | Research slash-command-only invocation | Ref. 2 | Matched. |
| 276 | Always-enabled multi-turn subagents | Ref. 26 | Matched under v1.0.72. |
| 315 | Model/effort precedence | Ref. 4, official source | Matched and correctly scoped. |
| 336 | Auto rule for the `model` field | Ref. 4, official source | Matched; no longer generalized. |
| 368 | Three `"inherit"` fields | Ref. 29 | Matched. |
| 502 | Depth versus concurrency | Ref. 4, official source | Matched. |

Additional inline historical excerpts were matched: `/research` introduction in reference 31; security-review ungating and complementary-model strategy in reference 30; lowercase-only task letters in reference 25. No checked quotation was absent from its source, so no misattribution/fabrication classification or corrective-URL search was needed.

## Source Authority Compliance

No material issues. The revised inventory is **31 official URLs plus one clearly identified community source**. Both added sources are official `github/copilot-cli` historical artifacts. The community `task.mode` schema and persistence description remain version-bound corroboration, not a current supported API contract.

The compare patch's unchanged context is adequate evidence for the v0.0.417 entry. It should not be interpreted as a separate declaration that research is GA.

## Conflict & Uncertainty Disclosure

No unresolved material issues. Auto/specialist/policy interactions, context-tier ordering, SDK-versus-CLI effort inheritance, limits, and model-ID conflicts are explicitly disclosed without invented runtime reconciliation.

The task-key discrepancy now affects the actual demo instructions. Plan mode is explicitly not a sandbox or comprehensive no-write guarantee. Removing an experimental gate is correctly distinguished from promotion to GA.

## Source Freshness & Currency

The new historical checks substantiate:

- `/research`: **v0.0.417, 2026-02-25**, immediately before the v0.0.418 product-GA entry.
- `/subagents` complementary rubber-duck configuration: documented in **v1.0.64, 2026-06-23**; the report correctly says “since at least,” not a proven original introduction date.
- `/security-review`: explicit **public preview, 2026-06-10**; **no `--experimental` required from v1.0.64, 2026-06-23**. No checked evidence upgrades it to GA.
- Multi-turn follow-ups: **always enabled in v1.0.72, 2026-07-20**.
- Task navigation/steering: **v1.0.79, 2026-08-10**; lowercase task-letter input: **v1.0.85, 2026-09-16**.

The live main changelog still begins with **stable 1.0.91, 2026-10-01**. No new contradiction affecting the fixes was found.

**Lifecycle-policy disposition:** The latest brief decision now governs presentation extraction. Dated shipped capabilities may be shown using release/date evidence and “no separate status label,” never a newly inferred GA badge. The caller expressly resolves the report's pending wording for `/research`, `/subagents`, `/tasks`, `/context`, and follow-ups. No report rewrite merely to restate that authorization is required. Preserve the hold on `general-purpose` and sidekicks, and the exclusion of pre-release-only steering behavior.

## Topic Coverage Assessment

No material gaps relative to R1. The revision retains foundations, the catalog, delegation mechanics, model/effort/context controls, running-agent management, and practical demonstrations without broadening into the other assignments.

§8.0 now provides a useful minimum presenter extraction and recommends Demo C's core path; Demos A/B and optional inspection steps are building blocks rather than a fixed 21-minute R1 allocation. Under the new caller policy, their dated non-GA tooling steps may be used with the accepted shipped-status wording.

## Research Limitations Review

The expanded limitations are candid and actionable. They now include Auto interaction gaps, context-tier ordering, and shortcut-source disagreement. No hands-on execution is implied.

### M3 — 🟢 Minor — Overbroad lifecycle sentence in the limitations

- **Location:** §11 item 6, after the list of newly located dated evidence.
- **Issue:** “None of these has a feature-specific GA/preview label” follows a list that includes `/security-review`. That feature does have an explicit public-preview label, correctly given in the summary and catalog.
- **Verification evidence:** Reference 22 explicitly calls it experimental public preview on 2026-06-10; reference 30 later removes the gate without declaring GA.
- **Why it matters:** The limitations sentence could confuse an extracted status note, but it does not undermine the clear presentation decision elsewhere.
- **Concrete correction:** Distinguish the other items lacking individual labels from security review, whose preview label remains known while GA is unannounced.
- **Disposition:** Waived as non-blocking clarity polish. The presentation must retain the already-correct public-preview treatment.

## Code & CLI Validation

**All 10 fenced blocks inspected by reading; none executed.** Source/provenance attribution remains visible inside and immediately after the examples. Model examples use the narrowed Auto statement; task demos use lowercase letters without modifiers and distinguish the main-prompt chord from dialog keys.

Demo C no longer recommends enabling experimental mode for a missing security-review command on a current version. It instead points to the documented v1.0.64 availability threshold. Undated-lifecycle agents and pre-release-only behavior are not demonstrated.

The original JSONC comment-removal advice is conservative, not invalid syntax. No new must-fix technical defect was found.

## Reference List Integrity

Counts reconcile: **14 Docs + 10 Blog/Changelog + 7 official repository sources + 1 community source = 32**. The seven official repository entries are six `github/copilot-cli` URLs and one `github/docs` URL. Both additions appear in the body and the list; no orphaned citation or reference was identified.

The topic slug and required-MCP marker remain valid. The caller's mechanical lint is PASS. No binding verified-fact conflict or scope violation was found.

## Report Structure & Readability

The summary now reflects the qualified body. Status decisions and the recommended presenter subset improve extraction for a 60-minute technical session. Previous minor findings M1/M2 are addressed.

Remaining M3 is minor and waived. Residual “caller decision” labels are workflow history resolved by the newly binding brief, not an outstanding research blocker.

## Suggested Improvements (Prioritized)

**Must fix:** None. F1–F5 are closed.

**Optional:** Tighten §11 item 6 as described in M3. When assembling slides, apply the caller-approved shipped-release/date/no-separate-label wording to the report's formerly pending lifecycle items; keep the existing undated-feature holds and the documented uncertainty boundaries.

No new stylistic preference or scope expansion is imposed.

## Readiness Verdict: APPROVED

**Remaining must-fix blockers:** None. Every prior 🟡 Important finding is ✅ fixed, including F5 under the latest binding lifecycle decision.

The report is ready for caller-managed presentation assembly with the accepted non-GA shipped-status wording and the existing feature holds preserved. Any remaining 🟢 Minor item, specifically M3, is waived and does not withhold approval. Approval does not claim the demos were executed or resolve runtime behavior that the report explicitly labels uncertain.
