---
reviewer: web-research-reviewer
subject: "Copilot multi-agent capabilities beyond the CLI (light)"
companion: web-researcher
date: 2026-10-05
required_mcp: WebIQ-MCP
mcp_status: verified
verdict: APPROVED
---

## Review Round 1 - 2026-10-05

Report: `research/2026-10-05-copilot-agents-beyond-cli.md` (R6). The full report and binding `brief.md` were read. Review applies the breadth-over-depth override: sufficient support for 2–4 slides, not a separate implementation tutorial. Supplied mechanical lint passed; no banned terms are declared.

**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

Both required tools were available. An independent Web IQ search for VS Code 1.140, its release date, and the Copilot SDK harness returned the official release notes. Sequential Web IQ `browse` calls returned meaningful official harness and subagent documentation. Routine source checks used `web_fetch`; the official Markdown representation of the harness page was also read to inspect collapsed sections. No required-MCP failure occurred.

## Reference Validation

**35 of 44 distinct cited URLs checked.** The sample was expanded beyond approximately ten to cover the flagged lifecycle dates, portability, security guidance, all displayed quotations, and all three code samples. Reference numbers below identify the report's reference list. All checked URLs returned substantive content; none was classified as fabricated, misattributed, or unavailable. Reading a source does not independently prove every capability through execution.

| Ref. | Checked source | Outcome |
|---|---|---|
| 1 | VS Code subagents | Matches Local/SDK distinction, stateless Local calls, coordinator allow-list, nesting depth 5, model order, and researcher example. Web IQ also exposed the harness tabs and Experimental Auto notice. |
| 2 | VS Code custom agents | Matches file locations, visibility controls, handoffs, agent-scoped Preview hooks, and handoff example. |
| 3 | VS Code agent harnesses | Shared runtime and nonsynchronization warning verified with Web IQ. Official `.md` representation also confirms local unauthenticated MCP restriction, Rubber Duck, Insiders-only Preview research, Experimental Agent Host Codex, and Local-origin handoff restriction. |
| 5 | VS Code Agents window | Meaningful current instructions; no explicit GA declaration found in checked content. |
| 7 | VS Code 1.140 | Stable release September 30, 2026; SDK-powered Copilot harness and Experimental remote delegation/multi-folder sessions match. |
| 8 | VS Code 1.120 | May 13, 2026 release; Agents window explicitly Preview in Stable; CLI plugin discovery matches. |
| 9 | About Copilot app | Desktop app built on CLI; all three operating systems; current separate app policy confirmed. |
| 11 | App agent sessions | Modes, execution locations, CLI history, and public-preview sandboxes/security review confirmed. |
| 12 | App slash commands | `/fleet`, `/spawn`, `/orchestrate`, `/agent`, and review commands present; command context prerequisites are documented. |
| 13 | Copilot on GitHub.com | Single-repository/single-branch/one-PR constraints and nonextendable 59-minute maximum confirmed. |
| 14 | Agent management | Agents tab/page/panel terminology, concurrent sessions, steering, and CLI continuation confirmed. |
| 16 | Using cloud agent on GitHub | Assignment Preview note, issue-context snapshot, custom-agent continuation, and default CI approval gate match. Also documents an optional automatic-workflow setting. |
| 18 | Custom agents configuration | Ignored tool names/IDE handoffs, shared keys, MCP/metadata applicability, and cloud `agent` alias confirmed. |
| 20 | Third-party coding agents | Current public preview, Claude/Codex, local-policy exception, security validation, and Actions-minutes/AI-credits usage confirmed. |
| 21 | Copilot code review | Agentic context collection, Preview suggestion delegation, fallback, no model switching, and Lite/Balanced effort match. |
| 22 | About Agentic Workflows | Public preview, Markdown-to-lock workflow compilation, default Copilot engine, and layered security match. |
| 23 | App technical-preview changelog | May 14, 2026 technical preview and Agent Merge description match. |
| 24 | App GA changelog | June 17, 2026 GA and operating systems confirmed; older CLI-policy prerequisite differs from current docs as disclosed. |
| 25 | Cloud research/plan/code changelog | April 1, 2026 former-name wording and branch-without-PR capability confirmed. |
| 26 | Coding-agent GA changelog | September 25, 2025 GA and Actions-powered background environment confirmed. |
| 28 | Agents tab changelog | January 26, 2026 repository tab, mission-control connection, and CLI continuation match. |
| 29 | Claude/Codex launch changelog | February 4, 2026 public preview and multi-agent issue assignment confirmed. |
| 30 | Claude/Codex expansion changelog | February 26, 2026 expansion to Business/Pro confirmed. Premium-request language is historical, not a current billing recommendation. |
| 31 | Agentic code-review changelog | March 5, 2026 GA, tool calling, Actions execution, and runner setup match. |
| 32 | gh-aw technical-preview changelog | February 13, 2026 technical preview and default Copilot CLI engine confirmed. |
| 33 | gh-aw public-preview changelog | June 11, 2026 public preview, firewall, safe outputs, and threat detection confirmed. |
| 35 | Copilot SDK GA changelog | June 2, 2026 GA and programmatic runtime access confirmed. |
| 36 | Agent HQ Universe article | Vision/mission-control description and displayed quotation match. It already describes integrated coding-agent code review; see M2. |
| 37 | Pick your agent article | Both displayed quotations match after normalizing whitespace; public-preview and multiple-agent comparison descriptions corroborated by dated launch changelog. |
| 38 | Coding-agent updates article | Self-review quotation, security checks, custom agents, and cloud/CLI continuation match. Article is not proof that self-review first shipped on its publication date. |
| 40 | gh-aw engines | Copilot CLI default, SDK mode, and native `engine.agent` selection match. |
| 41 | gh-aw agent files | Native Copilot files, local/remote imports, ref pinning, and Markdown-body treatment for other engines match. |
| 42 | gh-aw inline sub-agents | Heading syntax, optional frontmatter, and parent invocation by name match. |
| 43 | gh-aw safe outputs | Displayed separation-of-privilege quotation matches. |
| 44 | Official raw `engines.md` | `engine.agent` YAML fragment matches exactly apart from the declared source comment. |

Unchecked references: 4, 6, 10, 15, 17, 19, 27, 34, 39. Their existence/content is not represented as independently validated in this round. The report's cross-product session-discovery and automation details therefore remain outside this source sample.

## Claim Citation Coverage

Core surface descriptions, release dates, runtime relationships, architecture, portability caveats, and security guidance have adjacent primary-source citations. No material unsupported performance or pricing claim was found. The report sensibly separates parallel sessions, subagent delegation, and human-guided handoffs.

**F1 — 🟡 Important — Lifecycle evidence is not compliant for several slide/demo candidates.**

- **Location:** §3.1 status preamble (line 90), `handoffs` label (line 135), §4 Local-harness row (line 333), §5.2 slide 2, §5.3 VS Code demo, and §7 limitation 1. Also distinguish product-level GA dates from the dates/status of individual commands or customizations in the condensed table.
- **Issue:** “Stable, no preview label” is inferred from undated documentation and absence of a Preview/Experimental tag. The report then recommends demonstrating and labeling Local `runSubagent`, the coordinator `agents` key, nesting, and handoffs without feature-specific dated shipping evidence. An access date is not release evidence. The limitation admits the inference but does not satisfy the brief's lifecycle-label rule.
- **Verification evidence:** Current [subagent docs](https://code.visualstudio.com/docs/agents/run/subagents) and [custom-agent docs](https://code.visualstudio.com/docs/agent-customization/custom-agents) substantiate behavior, but the cited evidence does not date the stable shipment of those particular capabilities. Conversely, [1.140](https://code.visualstudio.com/updates/v1_140) and [1.120](https://code.visualstudio.com/updates/v1_120) provide explicit dated evidence for the Copilot harness and Preview Agents window, respectively. The brief requires dated stable-release evidence for a shipped/no-separate-status treatment and excludes undated features from labeled claims and demos.
- **Why it matters:** The suggested table and demo can transfer an unsupported Stable badge into the deck. Product GA also must not silently badge every subsequently documented command or customization GA.
- **Concrete correction:** For the small set selected for the 2–4 slides/demo, add dated official release/changelog evidence and use an explicit published GA/preview label, or a version-and-date shipping statement with **no separate status label** when the evidence supports only shipment. Do not invent a CLI version for a VS Code feature; identify the actual product/version. Remove inferred “Stable” badges. Keep features without dated evidence as clearly identified background documentation observations, outside labeled slide claims and demos. Apply this consistently to §4, §5, and §7; a prose disclaimer alone is insufficient. A larger research expansion is not required.

## Quote Verification

**20 of 20 displayed source quotations verified**, covering the complete standalone/block-quotation inventory. Markdown formatting and whitespace were normalized; wording matched. The assignment scope block and code-provenance notes are not source quotations.

| Checked source | Displayed quotations verified / total | Outcome |
|---|---:|---|
| VS Code harnesses (3) | 3/3 | Shared runtime, nonsynchronization, supported harnesses match. |
| VS Code 1.140 (7) | 1/1 | SDK/product consistency quotation matches. |
| VS Code subagents (1) | 1/1 | Stateless Local invocation matches. |
| VS Code custom agents (2) | 2/2 | Agent Host user folders and handoffs match. |
| Copilot app docs (9) | 1/1 | Desktop-app definition matches. |
| App GA changelog (24) | 1/1 | GA/operating-systems quotation matches. |
| Coding-agent GA changelog (26) | 1/1 | GA quotation matches. |
| Cloud research/plan/code changelog (25) | 1/1 | Rename and non-PR workflow quotation matches. |
| Coding-agent updates article (38) | 1/1 | Self-review quotation matches. |
| Agent HQ Universe article (36) | 1/1 | Open-ecosystem quotation matches. |
| Pick your agent article (37) | 2/2 | Availability and comparing agents match. |
| Agentic code-review changelog (31) | 1/1 | GA architecture quotation matches. |
| Agentic Workflows concept (22) | 1/1 | Markdown automation definition matches. |
| Safe outputs (43) | 1/1 | Separation-of-privilege quotation matches. |
| Custom agents configuration (18) | 2/2 | Ignored names and ignored IDE properties match. |

Inline quoted excerpts were additionally spot-checked on the sources in Reference Validation, including app policy, MCP limitations, nesting, issue context, CI defaults, cloud limits, command descriptions, and review fallback. This is not an exhaustive count/verification of every inline quotation fragment or quoted UI label. No quotation fabrication or corrected-URL misattribution was found in the checked inventory.

## Source Authority Compliance

No material issues. All 44 references are official vendor/project documentation, official release/changelog material, or an official repository file. The report does not depend on community evidence for core claims.

## Conflict & Uncertainty Disclosure

The report appropriately discloses and handles:

- App GA announcement's CLI-policy prerequisite versus current separate app-policy documentation; current docs are preferred.
- Overall cloud-agent GA versus the assignment how-to's explicit public-preview note; it does not invent an explanation for the note.
- Preview Agents window in Stable versus absence of a subsequent verified GA announcement; no GA upgrade is inferred.
- Claude's historical preview anchor versus lack of an explicit current heading label.
- Shared runtime versus differences in sessions, settings, permissions, and supported tools.

F1 remains: candidly describing an inferred lifecycle badge does not make that badge compliant.

## Source Freshness & Currency

Live official evidence supports the main researcher-flagged dates and architecture claims as of this review: VS Code 1.140 / September 30; app GA / June 17; cloud-agent GA / September 25, 2025; agentic review GA / March 5; Agents window Preview in Stable / May 13; Claude/Codex public preview / February 4 and expansion / February 26; gh-aw public preview / June 11.

Historical premium-request pricing is explicitly excluded from current recommendations. Current third-party docs use Actions minutes and AI credits. No pricing appendix expansion is needed for R6.

**M2 — 🟢 Minor — Distinguish self-review corroboration from first availability.**

- **Location:** §3.3 “Since 2026-02-26” self-review sentence.
- **Issue/evidence:** The February article describes an existing capability. The report's own [Agent HQ Universe source](https://github.blog/news-insights/company-news/welcome-home-agents/) already says GitHub added a code-review step to the coding-agent workflow.
- **Impact:** Readers may mistake February 26 for the introduction date.
- **Correction:** Say “The 2026-02-26 article confirms self-review,” or use an independently supported earlier introduction date. This does not undermine the existence of self-review and is non-blocking.

## Topic Coverage Assessment

No material coverage gaps under the R6 light override. VS Code subagents/custom agents/handoffs, the actual desktop app, cloud agent, current agent-management naming, Agent HQ/Claude/Codex, agentic review, gh-aw, and cross-surface definitions are all covered. The four-slide extraction plan is practical.

Detailed CLI agent semantics, governance, billing, and exhaustive frontmatter portability appropriately remain with R1–R5/R7/R8. Merely identifying gh-aw's supported engines is not treated as substantive coverage of excluded frameworks.

## Research Limitations Review

Limitations are specific and useful: rendering losses, undated documentation, unknown exact rename date, policy conflicts, preview uncertainty, changed billing, and assignment boundaries. No material missing limitation was found beyond the need to enforce F1 in slide/demo recommendations.

This audit is a source/syntax review, not an executed compatibility or end-to-end demo test.

## Code & CLI Validation

All **3 of 3 code blocks** were inspected by reading only:

- Handoff frontmatter matches the official example after restoring line breaks.
- Read-only researcher agent matches the official example after restoring line breaks.
- gh-aw `engine.agent` fragment matches the raw repository source.

Each has attribution inside the block and immediately afterward, with clear adaptation/verbatim provenance. The YAML/frontmatter syntax is plausible. The gh-aw block expressly identifies itself as a fragment, not a complete workflow. Imports, authentication, and error handling are not applicable to these declarative illustration fragments. No commands or code were executed.

For any actual handoff demo, a target agent named `implementation` must exist and the named model/tools must be available; do not present the source fragment as a complete demo setup. This is a preparation caveat, not a requirement to turn this light report into a tutorial. F1 must also be resolved before selecting a demo.

## Reference List Integrity

No material issues. The stated **44 sources** equal the numbered list: 8 VS Code pages, 14 GitHub Docs pages, 13 changelog entries, 3 GitHub Blog articles, 5 gh-aw documentation pages, and 1 raw repository file. Reference categories are appropriate. Body citations map to the reference list, and each reference is used in the body. No orphaned reference was found.

## Report Structure & Readability

Required title/header fields, exact topic slug, well-formed Required MCP marker, executive summary, table of contents, practical guidance, limitations, and complete references are present. The table of contents matches the main sections. Detail is substantial, but the explicit slide plan keeps the research artifact usable for a light assignment.

**M1 — 🟢 Minor — Preserve the CI gate's default qualification.**

- **Location:** §6 “Review workflow changes before approving CI.”
- **Issue/evidence:** Unlike §3.3, this bullet sounds unconditional. The checked [cloud-agent how-to](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github) says “By default” and also allows administrators to configure workflows to run without human intervention.
- **Impact:** Readers may mistake a configurable default for an invariant security control.
- **Correction:** Add “By default” and a short acknowledgment that automatic execution can be configured; retain the workflow-review advice. Governance implementation stays in R7.

## Suggested Improvements (Prioritized)

1. **Must fix F1 — 🟡 Important:** Replace inferred Stable labels with dated feature evidence and the brief-compliant label/shipment wording; remove unsupported labeled slide/demo candidates.
2. **Optional M1 — 🟢 Minor:** Qualify the CI approval advice as the default behavior.
3. **Optional M2 — 🟢 Minor:** Avoid implying the February self-review article is the introduction date.

No new frameworks, governance tutorial, pricing discussion, or runnable gh-aw workflow is requested.

## Readiness Verdict: NEEDS REWORK

**Remaining must-fix blocker: F1 — lifecycle evidence and inferred Stable labeling for Local VS Code capabilities and associated slide/demo recommendations.**

The central architecture, major launch dates, displayed quotations, reference accounting, and illustrative code are well supported. No fabricated evidence or material architecture error was found in the checked sample. M1 and M2 are non-blocking.

The report is ready for caller-managed revision. The reviewer has not changed the research report or binding context.

## Review Round 2 - 2026-10-05

The full revised report, latest prior review round, and current `brief.md` were read. Both binding lifecycle decisions were considered: dated shipment without a separate lifecycle badge, and no standalone feature GA badge merely because a capability appears in the CLI GA announcement. R6 remains a light, 2–4-slide assignment.

**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

Both tools were available. A narrow independent search had no results; a broader topic-relevant Web IQ search returned the official VS Code 1.106 release notes. Sequential Web IQ `browse` returned meaningful content from that critical cited URL, including its November 12, 2025 release date. Routine live source reading used `web_fetch`. No required-MCP failure occurred.

### Fix Verification

- **F1 — 🟡 Important — ✅ fixed.** The inferred “Stable, no preview label” badges have been removed; the phrase remains only in the retrospective limitation explaining their removal. §3.1 now supplies dated release evidence for custom agents/handoffs (1.106, 2025-11-12), parallel subagents and invocation keys (1.109, 2026-02-04), opt-in nesting (1.113, 2026-03-25), session-type handoff (1.109), and the Copilot harness (1.140, 2026-09-30). The live sources support these statements. §4 distinguishes product GA from individual command/customization status; app commands and documentation-only details no longer inherit GA. §5 limits the suggested demo to plain subagents or dated Agents-tab/CLI continuation, and treats custom-agent workers conservatively using the last verified Experimental evidence from 1.107/setting-gated evidence from 1.109. §7 discloses the unresolved later status. Actual VS Code versions are used, not invented CLI versions. No new per-feature CLI GA badge is introduced.
- **M1 — 🟢 Minor — ✅ fixed.** §3.3 and §6 explicitly describe CI approval as a configurable default, matching the live cloud-agent how-to's option to permit workflows without human intervention.
- **M2 — 🟢 Minor — ✅ fixed.** §3.3 now anchors proactive self-review in the 2025-10-28 validation changelog. The February 26 article is explicitly corroboration, not the introduction date. The newly quoted October changelog sentence matches its live source.

## Reference Validation

**11 of 50 distinct cited URLs checked live in this round**, concentrating on the six new references and F1/M1/M2. Reference numbers refer to the revised report, not Round 1's numbering.

| Ref. | Checked URL | Outcome |
|---|---|---|
| 1 | https://code.visualstudio.com/docs/agents/run/subagents | Current plain-subagent prompt, stateless behavior, researcher example, and nesting depth match. |
| 7 | https://code.visualstudio.com/updates/v1_140 | September 30, 2026 release date and SDK-powered Copilot harness confirmed. |
| 8 | https://code.visualstudio.com/updates/v1_120 | May 13, 2026 date; Agents window explicitly Preview in Stable. |
| 9 | https://code.visualstudio.com/updates/v1_106 | November 12, 2025 date; renamed custom agents, repository folder, and handoffs confirmed with Web IQ and routine reading. |
| 10 | https://code.visualstudio.com/updates/v1_107 | December 10, 2025 date; custom agents as subagents explicitly Experimental and setting-gated. |
| 11 | https://code.visualstudio.com/updates/v1_109 | February 4, 2026 date; parallel subagents, session picker/handoff, invocation keys, continued custom-agent setting gate, and optional handoff model confirmed. Relevant continuation was also read. |
| 12 | https://code.visualstudio.com/updates/v1_113 | March 25, 2026 date; opt-in nested subagents and exact setting name confirmed. |
| 20 | https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github | Workflow-management section confirms both default human approval and optional automatic execution. |
| 32 | https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/ | Dated announcement supports cloud/CLI custom agents without an explicit standalone GA/preview label. Correct target returned substantive content. |
| 33 | https://github.blog/changelog/2025-10-28-copilot-coding-agent-now-automatically-validates-code-security-and-quality/ | Dated proactive security/quality validation and self-review confirmed; new quotation matches. |
| 40 | https://github.blog/changelog/2026-10-01-github-copilot-in-vs-code-september-2026-releases/ | Explicitly covers 1.136–1.140 shipped during September; agent-created chats/sessions sentence matches. |

All checked sources returned meaningful content. No fabricated, misattributed, or unavailable source was found in this sample. Unchanged Round 1 checks remain part of the audit history, but are not represented as fresh rereads here.

## Claim Citation Coverage

No unresolved material issues. New release claims have adjacent official sources, and the revised slide recommendations follow the dated-evidence matrix. Version/date shipment statements do not become GA badges. Current operational details remain distinguishable from historical release evidence.

## Quote Verification

**3 of 21 displayed source quotations reverified live this round**, including the sole added block quotation:

| Source | Reverified quotations | Outcome |
|---|---:|---|
| VS Code 1.140 (7) | 1 | SDK/product-consistency sentence matches. |
| VS Code subagents (1) | 1 | Stateless Local-invocation sentence matches. |
| October 28 validation changelog (33) | 1 | Added proactive code-review sentence matches exactly. |

The other 18 displayed quotations are unchanged from those verified in Round 1 and were not reread at their URLs in this round. Inline excerpts supporting the added lifecycle matrix were also checked: rename/handoffs in 1.106, Experimental heading in 1.107, parallelism/setting gate/session handoff/optional model in 1.109, nesting in 1.113, and agent-created chats in the September roundup. No discrepancy was found. Counts exclude quoted UI labels and the assignment/provenance blocks.

## Source Authority Compliance

No material issues. All six added sources are official VS Code release notes or GitHub changelog entries. Primary-source support remains appropriate for this assignment.

## Conflict & Uncertainty Disclosure

No unresolved material issues. The report acknowledges the gap between historical Experimental/setting-gated custom-agent workers and today's documentation, rather than inventing a promotion date. App policy, issue-assignment preview, and Agents-window status conflicts remain disclosed.

## Source Freshness & Currency

The revision's load-bearing additions were checked against live official sources on 2026-10-05. Older releases provide historical shipment evidence, not unsupported assertions of first-ever availability or automatic GA promotion. September 2026 shipping evidence is corroborated by the October 1 roundup. Undated current documentation is explicitly distinguished from dated lifecycle evidence.

## Topic Coverage Assessment

No material gaps for R6. The report still covers all required surfaces and sharing agent definitions, with a practical four-slide extraction plan. No deeper governance, billing, framework, or implementation coverage is requested.

## Research Limitations Review

The expanded lifecycle limitations now resolve the earlier unsupported inference and identify remaining documentation-only details. No blocking omission.

**M3 — 🟢 Minor — Duplicate citations in limitation 12.** The closing validation-changelog/February-article citation pair is repeated verbatim. This is a readability defect, not an evidence or source-count problem. Remove one copy when convenient. Waived for approval.

## Code & CLI Validation

All three declarative code blocks were reread; their contents and attribution are unchanged. The researcher agent was also compared with the live subagent page. No syntax or provenance regression was found. The prior handoff-target/model preparation caveat remains applicable. No code or command was executed.

## Reference List Integrity

No material issues. The revised list contains **50 references**, matching the header: 12 VS Code pages (6 documentation, 6 release notes), 14 GitHub Docs pages, 15 changelog entries, 3 blog articles, 5 gh-aw documentation pages, and 1 repository file. The six added references are used in the body. Reference numbering and the three sample-source pointers have been updated consistently.

## Report Structure & Readability

Required headers, exact topic slug, Required MCP marker, table of contents, limitations, and reference structure remain intact. The larger evidence matrix is useful research backing; the deck should use the existing condensed extraction plan rather than reproduce the full matrix.

## Suggested Improvements (Prioritized)

No must-fix findings remain. Optional M3 duplicate-citation cleanup is waived. F1, M1, and M2 are closed.

## Readiness Verdict: APPROVED

**Remaining must-fix blockers: none.** F1 is fixed under the current binding lifecycle decisions. M1 and M2 are also fixed. The remaining **🟢 Minor** item M3 is waived.

The report is ready for caller-managed presentation synthesis within the R6 light scope. Approval does not certify an executed demo. Only this existing review file was modified; the report and binding context remain untouched.
