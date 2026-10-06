---
reviewer: web-research-reviewer
subject: "/fleet, /delegate and Copilot CLI multi-agent workflows"
companion: web-researcher
date: 2026-10-05
required_mcp: WebIQ-MCP
mcp_status: verified
verdict: APPROVED
---

## Review Round 1 - 2026-10-05

Report: `research/2026-10-05-cli-fleet-delegate-workflows.md` (R5). Binding context: full `brief.md`, including scope decisions, review rubric, and R5 override; supplied mechanical lint passed. The full report was read. No report or binding input was modified.

**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

Independent Web IQ searches checked fleet/concurrency evidence, security-review status, and remote-session semantics. The first browse request encountered a temporary server error; the single retry, using the critical CLI command-reference URL, returned meaningful documentation. Subsequent Web IQ calls were sequential. Routine source reading used `web_fetch`. Checks reflect official pages retrieved on 2026-10-05, not assumed product knowledge.

## Reference Validation

**26 of 36 cited URLs checked**, with additional authoritative sources investigated for disputed details. Reference numbers below match the report. All 26 returned substantive content; no checked source is classified as fabricated, misattributed, or persistently unavailable. The failed fleet browse request did not make that citation unverifiable: independent search and routine fetch returned its content.

| Ref. | Checked cited source | Outcome |
|---|---|---|
| 1 | [Fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet) | Confirms decomposition, separate context, low-cost-model wording, possible extra credits, and fleet/autopilot distinction. |
| 2 | [Fleet how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/speed-up-task-completion) | Confirms plan approval, `/tasks`, three prompt inputs, scoped-write example, and ACP incompatibility. |
| 3 | [SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode) | Confirms RPC, experimental binding, SQL schema, lifecycle events, and explicitly provisional internals. Does not establish the example's fleet-completion assumption. |
| 5 | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Web IQ browse succeeded. Targeted fetch ranges confirm limits, models, sibling messaging, instructions, flags, and plan-mode caveats. Remote flag interpretation needs correction. |
| 6 | [Delegating tasks](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca) | Confirms `/delegate`, `&`, remote execution, draft PR, and asking to checkpoint unstaged changes. |
| 7 | [Programmatic CLI how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically) | Confirms stdin behavior, least-privilege advice, `/review` example, and transcript export. |
| 9 | [Research concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/research) | Confirms cited reports, assumptions, model restriction, storage, and sharing. |
| 10 | [Autopilot concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot) | Confirms five-continuation wording, limited-permission denial, sandbox advice, and example command. |
| 11 | [Dynamic workflows concept](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows) | Confirms public preview, code-defined orchestration, legacy-plan exclusion, permissions, and approximate limits. |
| 12 | [Dynamic workflows how-to](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-dynamic-workflows) | Confirms experimental prerequisite, script example, trusted-extension opt-in, and monitoring/resume controls. |
| 13 | [Programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference) | Confirms scoped flags, JSONL, workflow incompatibilities, and sensitive-transcript warning. |
| 14 | [Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions) | Confirms policy, `copilot-requests: write`, checkout v6, exact workflow, approval denial, and fork-trigger warning. |
| 16 | [Multiple sessions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions) | Confirms local-process lifetime, Sessions-tab cloud visibility, and local steering. |
| 17 | [CLI best practices](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices) | Confirms planning, BYOK inheritance, GitHub sign-in for delegation, and source-specific model names. |
| 18 | [Session limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) | Confirms preview, minimum 30, soft overshoot, non-interactive termination, and cumulative-session wording that conflicts with ref. 5. |
| 19 | [SDK custom agents](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/custom-agents) | Confirms `customAgents`, configuration fields, delegation, and permission-handler shape. |
| 21 | [Cloud-agent access](https://docs.github.com/en/copilot/concepts/enterprise/cloud-agent-access) | Confirms Business/Enterprise disabled by default and Pro/Pro+/Max enabled by default. |
| 24 | [SDK quickstart](https://docs.github.com/en/copilot/get-started/sdk-quickstart) | Confirms installation/authentication prerequisites and ordinary `session.idle` subscriptions; does not document completion of a fleet RPC. |
| 25 | [Fleet engineering guidance](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) | Confirms waves, no locking, overwrite warning, prompts, and historical no-direct-communication statement. |
| 26 | [Selective delegation](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/) | Confirms 23% tool-failure reduction, 5% P95 reduction, no quality regression, and version 1.0.42+. These are vendor-reported A/B results, not fleet benchmarks. |
| 27 | [Dynamic-workflows announcement](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/) | Confirms public preview and experimental CLI enablement. Its broad all-plans wording is narrower in current concept documentation. |
| 28 | [CLI GA announcement](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) | Confirms CLI GA date and plan/autopilot/review/cloud-delegation capabilities. |
| 31 | [SDK GA announcement](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/) | Confirms GA date and six languages. Does not make every generated RPC binding GA. |
| 32 | [Rubber duck and scheduling announcement](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) | Confirms rubber duck GA and June 3 correction identifying scheduling as experimental. |
| 33 | [Pinned CLI changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) | Confirms v0.0.411 on February 17, subsequent fleet validation, and February 25 research command. Appropriate historical evidence, not current-runtime evidence. |
| 34 | [Main CLI changelog](https://github.com/github/copilot-cli/blob/main/changelog.md) | Confirms recent background-task warning. Supplemental raw reading restores version headings: that warning is in v1.0.88, September 22; latest displayed release is v1.0.91, October 1. |

Not spot-checked: refs. 4, 8, 15, 20, 22, 23, 29, 30, 35, 36. They are not thereby classified as unavailable. Third-party references do not carry the release-date conclusion.

Additional verification sources:

- [Security-review announcement, 2026-06-10](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/): explicit experimental/public-preview status and enablement instruction.
- [Remote steering documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely): `--remote` enables remote control of a locally running CLI session.
- [Raw main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md): version/date context stripped by the GitHub page reader.

## Claim Citation Coverage

Coverage is strong: substantive architecture, concurrency, permissions, billing, statistics, and commands generally have nearby primary citations. Fleet concurrency is accurately transcribed: Free/Education 2; Pro/Pro+ 4; Max 8; Business 16; Enterprise/usage-based billing 32; default depth 6; maximum depth 256. The shared-filesystem/no-locking warning is directly supported.

### F3 — 🟡 Important — Remote-control flag is conflated with cloud-task resumption

- **Location:** §4.4, lines 289–296, especially “`--remote` with `--resume <TASK-ID>` resumes a remote task locally.”
- **Issue:** This attributes cloud-resumption semantics to a flag whose documented purpose is enabling remote access to the current CLI session.
- **Verification evidence:** Ref. 5 describes `--remote` as enabling remote access from GitHub.com/GitHub Mobile; `--connect` connects to a remote session and conflicts with `--resume`. The additional remote-steering how-to explicitly describes access to a locally running CLI process, whose machine must remain online. Ref. 16 separately describes resuming cloud sessions through the Sessions tab.
- **Why it matters:** The presentation's central distinction is where agents run. This guidance blurs cloud delegation, connection to a remote session, and remote steering of local work, and can enable remote control unnecessarily.
- **Concrete correction:** Remove the unsupported composition as a cloud-resumption recipe. Describe `--remote` only as remote steering enablement, keep the documented Sessions-tab route for cloud work, and retain any task-ID command only with evidence for that exact resumption behavior. Do not imply `--remote` moves work to the cloud or is required to resume delegated work.

## Quote Verification

**15 of 15 explicit prose block quotations verified** against their cited sources. This denominator inventories quoted prose blockquotes, excluding assignment/provenance notes and fenced samples. Inline excerpts were additionally spot-checked, including model-default, permissions, overwrite, and continuation wording; this is not a claim to have counted every short quoted table cell.

| Checked source | Quotations and locations | Outcome |
|---|---|---|
| Ref. 27 | Dynamic workflow versus fleet, line 91 (1) | Exact text present. |
| Ref. 1 | Fleet definition, line 102; independent LLM interactions, line 622 (2) | Text present; code-formatting normalization is harmless. |
| Ref. 25 | Shared filesystem/communication, line 107; linear-work overhead, line 244 (2) | Exact text present. Communication is historical wording, not proof of current universal behavior. |
| Ref. 5 | Requests rejected at concurrency limit, line 219; plan-mode safety net, line 330 (2) | Exact text present. |
| Ref. 26 | Parallelism tool, not a pause button, line 249 (1) | Exact text present. |
| Ref. 6 | Cloud execution, line 260; asking to checkpoint changes, line 274 (2) | Exact excerpt/full text present. |
| Ref. 9 | Research produces reports, not modifications, line 370 (1) | Exact text present. |
| Ref. 14 | Unapproved headless actions denied, line 426; broad workflow access warning, line 469 (2) | Exact text present. |
| Ref. 3 | Experimental binding/version pinning, line 542 (1) | Exact text present. |
| Ref. 18 | Soft-limit overshoot, line 634 (1) | Exact text present. |

No missing quotation required fabrication or corrected-attribution classification.

## Source Authority Compliance

Core conclusions rely on GitHub Docs, official announcements, and the official repository. Third-party articles are clearly labeled and confined to the timing disagreement. Preferring the dated official changelog over “landed April 1” is correct.

The generated-note character of the SDK fleet page is candidly identified. Its SQL coordination schema is appropriately labeled conceptual and not a stable extension contract.

## Conflict & Uncertainty Disclosure

§11 substantively records model inheritance, sibling messaging, continuation defaults, response/session limits, broad versus scoped approvals, model naming, SDK assumptions, and delegation gaps. These are genuine conflicts, not fabricated sources. Following official least-privilege how-tos rather than expanding permissions to satisfy a contradictory reference sentence is reasonable.

### F4 — 🟡 Important — Cost-control caveat is detached from actionable guidance

- **Location:** Executive Summary cost bullet; §6.1 credit-cap row; §8 “Caps and controls”; §9 Demo 1; §10 “Cap spend”; contrasted with §11 conflict 5.
- **Issue:** The report recognizes that interactive `/limits` might reset per message, but presents session limits as practical spend controls without a nearby warning that cumulative-session semantics are unresolved. The demo encourages setting 100 credits before a multi-step autopilot/fleet run.
- **Verification evidence:** Ref. 5 says both `/limits set` and `--max-ai-credits` are soft per-response limits that reset per user message. Ref. 18 says the interactive limit depletes across the entire session. The sources genuinely disagree. Workflow credit limits are also explicitly approximate, not hard ceilings.
- **Why it matters:** A practitioner extracting the summary, demo, or best-practices bullets could mistake a response allowance for an aggregate session budget. This matters particularly with autonomous continuations and parallel calls.
- **Concrete correction:** Add the scope conflict beside the recommendations and interactive demo command, and link to §11. Describe these as preview soft controls with unconfirmed interactive aggregation; do not promise an overall session spend cap. Keep the documented non-interactive task-duration behavior separately attributed. State that account/organization budgets are separate controls and need their own verification under R8.

The unresolved subagent model default and autopilot continuation default do not themselves block publication: the report identifies them and recommends explicit settings. `/delegate` support inside `-p` is not claimed as verified; keeping that limitation is appropriate.

## Source Freshness & Currency

Dynamic workflows' October 1 public-preview release is verified. CLI GA February 25 and SDK/rubber-duck GA June 2 are verified. The report correctly distinguishes the GA SDK from its experimental fleet RPC.

### F1 — 🟡 Important — Available preview evidence for `/security-review` was missed

- **Location:** §2.1 status row, §5.3, §7 pattern A, and §11 “Weak or provisional evidence.”
- **Issue:** The report says no introduction date or preview/GA status was found, while recommending the command alongside normal review.
- **Verification evidence:** Independent Web IQ search found the official [June 10 announcement](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/), and live fetch returned meaningful content. It explicitly calls the command an “experimental feature in public preview” and instructs users to enable experimental mode. A follow-up official search did not establish a later CLI GA announcement.
- **Why it matters:** The brief requires source-dated feature status. Readers need the experimental prerequisite before using the suggested workflow. Product-level CLI GA does not establish GA of every command.
- **Concrete correction:** Add the announcement to the references and update `/security-review` to “experimental/public preview — announced 2026-06-10; no later GA transition verified as of 2026-10-05.” Add the enablement caveat wherever it is recommended. Replace the “no source gave” limitation with the actual dated evidence and any remaining current-runtime uncertainty. Reconcile source/category counts after adding the citation. Do not infer GA solely from the absence of a preview notice on another page.

🟢 Minor M4: §3.7 and §11 can now date the background-task warning to v1.0.88, 2026-09-22, using the raw main changelog. The report's earlier reader limitation is believable, but an easily available alternate official representation resolves it.

## Topic Coverage Assessment

R5 coverage is comprehensive: decomposition and dependency waves, prompting, plan/concurrency limits, monitoring, filesystem risks, local/cloud comparison, out-of-the-box commands, background sessions/worktrees, headless execution, Actions, a bounded SDK discussion, workflow patterns, usage implications, and demo fallbacks.

The CLI remains central. GitHub app/cloud/Agentic Workflows mentions serve required comparisons rather than replacing the CLI focus. Pricing and governance details are largely cross-referenced to their assigned appendices. No material scope violation was found. The three proposed demos are options for the caller to select, not a requirement to spend their combined time in the 60-minute deck.

## Research Limitations Review

The limitations section is unusually useful and not performative. It distinguishes unavailable introduction dates, source disagreements, conceptual internals, synthesized code, and intentional exclusions.

Apply F1 to remove the obsolete security-review gap, F2 to turn the SDK assumption into an appropriate example boundary, and F4 to surface the cost caveat where readers act on it. Acknowledging an executable example's uncertainty does not supply its missing completion/error handling.

Delegation prerequisites are appropriately qualified as assembled evidence rather than a comprehensive formal checklist. It is acceptable to leave unconfirmed `-p /delegate` support out of the demonstration.

## Code & CLI Validation

**Reading-only audit; no code, CLI command, or workflow was executed.** All ten fenced sample blocks have visible source/provenance inside and immediately after them.

The eight verbatim blocks are traceable: SQL schema (ref. 3), fleet CLI commands (2), two blog prompts (25; whitespace normalized), delegation inputs (6), autopilot command (10), headless review (7), Actions workflow (14), and dynamic-workflow script (12). Shell/YAML/SQL syntax is plausible. Official prompt templates are recognizable templates, not falsely reported execution results.

The synthesized Actions fleet variant uses documented flags and permissions, includes shell failure handling, is manual-triggered, and warns that the exact combination needs rehearsal. Its `write` approval is broad, not an enforcement of the prompt's `docs/` boundary. Actual multi-agent dispatch and permission sufficiency remain untested. The transcript-sensitivity warning and lack-of-push note are present.

### F2 — 🟡 Important — Synthesized SDK example has no verified, bounded completion path

- **Location:** §6.5 TypeScript block, lines 545–591, especially the `finished` promise and `await finished`.
- **Issue:** The only completion condition is the first `session.idle` event. There is no timeout, no asynchronous session-error rejection, and no handling that converts worker failure into overall failure. The outer `try/catch` cannot catch an event the code never turns into a rejection. Installation/authentication instructions and actual compatible pinned SDK/runtime versions are also absent beside an experimental API.
- **Verification evidence:** Ref. 3 documents `result.started` and worker lifecycle events, but not “first idle means all fleet work completed.” Ref. 24 documents idle subscriptions for ordinary messages and gives Node.js, installation, authentication, and runner prerequisites. The report itself identifies the fleet completion assumption as undocumented. **⚠️ unverifiable:** whether that event denotes complete fleet termination for the runtime being presented.
- **Why it matters:** The code can wait indefinitely if the assumed event never arrives, or report success without establishing that all intended work completed. An explicitly labeled synthesis is still unsuitable as an executable practitioner example without a defensible completion boundary.
- **Concrete correction:** Either replace the wrapper with the official minimal fleet-start excerpt, explicitly labeled as a non-standalone API fragment that proves start only, or document the supported completion contract and add a bounded wait, session-error handling, listener cleanup, worker-failure policy, setup/authentication prerequisites, and compatible version pins. Do not present a timeout or first idle as proof of successful completion. Keep any unverified lifecycle semantics labeled as such.

🟢 Minor M3: For the Actions synthesis, prefer restricted/redacted transcript retention over unconditionally copying the whole transcript into `$GITHUB_STEP_SUMMARY`; make prompt-only file boundaries explicit. The existing warning keeps this non-blocking.

## Reference List Integrity

The 36 numbered references match the header: 24 Docs pages + 2 blog articles + 6 changelog announcements + 2 repository URLs + 2 third-party articles. All numbered references are used in the body/status/limitations material; all body source URLs have matching entries. Categories and code provenance index are coherent. Supplemental reviewer sources are not counted as report references.

The MCP marker and topic slug are well formed. Adding the security-review source requires synchronized header/category/index updates under F1.

## Report Structure & Readability

The report is organized, practically useful, and suitable as a research input rather than a slide script. The Table of Contents corresponds to the twelve main sections.

🟢 Minor M1: Executive Summary says delegation “commits your unstaged changes,” whereas the verified body/source says Copilot **asks** to checkpoint them. It also states increased credit use more categorically than the source's “may.” Preserve the approval and uncertainty qualifiers in the summary.

🟢 Minor M2: Add an inline pointer to §11 immediately after the April blog's no-direct-communication quote in §3.1. The quotation is accurate, but current sibling-messaging documentation means it should not be lifted into a universal present-tense architecture claim. Likewise, distinguish the dynamic-workflows announcement's broad availability wording from the current Docs legacy-billing exception.

## Suggested Improvements (Prioritized)

**Must fix before publication:**

1. **F1 — 🟡 Important:** Incorporate the June 10 `/security-review` experimental/public-preview announcement, prerequisite, and source-count updates.
2. **F3 — 🟡 Important:** Separate remote steering from connecting to or resuming cloud work; remove unsupported `--remote --resume` semantics.
3. **F2 — 🟡 Important:** Replace the unverified executable SDK wrapper with an explicitly partial official example, or supply supported lifecycle semantics and bounded/error-aware handling with setup and version context.
4. **F4 — 🟡 Important:** Put the interactive cost-limit scope conflict beside the summary, recommendations, and demo; avoid implying a verified aggregate budget.

**Nice to have:** M1 summary qualifiers; M2 inline conflict pointers; M3 safer transcript retention and file-boundary language; M4 raw-changelog version/date. These do not independently block approval and need not expand R5 into R4/R8.

## Readiness Verdict: NEEDS REWORK

Remaining must-fix blockers: **F1** (`/security-review` status/prerequisite), **F2** (SDK completion/setup boundary), **F3** (remote-control versus cloud-resumption semantics), and **F4** (cost-limit scope caveat at point of use).

The core fleet research, historical release timing, concurrency table, exact block quotations, and most programmatic guidance are well supported. No fabricated evidence was identified. The report is ready for caller-managed revision, not publication. Minor items M1–M4 are non-blocking; no further topic expansion or code execution is required to address this review.

## Review Round 2 - 2026-10-05

The full revised R5 report, latest binding brief, and Round 1 findings were read. The supplied mechanical lint passes. The new lifecycle-label decision is binding for this round. First-review date and Round 1 content are preserved; the metadata verdict remains `NEEDS REWORK`. No research report or binding input was changed.

**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

Fresh independent Web IQ search returned the June 10 security-review announcement and July 14 app corroboration. Web IQ browse returned meaningful content from the critical SDK fleet-mode page on the first attempt. Further independent searches and routine official-page fetches checked the revisions; Web IQ calls were sequential.

### Fix Verification

| Prior must-fix item | Status | Verification |
|---|---|---|
| 1 / F1 — Security-review status and enablement | ✅ fixed | §2.1, §5.3, pattern A, and §11 now identify experimental/public-preview status, June 10 evidence, experimental enablement, and no verified later CLI GA transition. Both new announcement references are present and counts reconcile. The separate issue of inferred status labels for other commands is F5 below. |
| 2 / F2 — SDK completion/setup boundary | ✅ fixed | §6.5 removes the synthesized executable wrapper and unbounded idle promise. The two official excerpts are explicitly non-standalone fragments; `result.started` establishes start only. Setup context is supplied, and the absent fleet-completion contract remains explicitly unverifiable rather than a success assertion. This implements the acceptable fragment alternative in Round 1. |
| 3 / F3 — Remote steering versus cloud resumption | ✅ fixed | §4.4 now directs cloud-task tracking to printed links and the Sessions tab, with dated `/resume` evidence. `--remote` is expressly local-session steering requiring an online machine. §11 quarantines the ambiguous remote-task sentence rather than turning it into a `/delegate` recipe. |
| 4 / F4 — Cost-limit caveat at point of use | ✅ fixed | The summary, status table, failure modes, automation flag table, Actions notes, §8, Demo 1, and §10 now put the preview/soft-limit and response-versus-session caveats beside the recommendations. Separate account/organization budgets remain R8's responsibility. |

**Good-faith reconsideration of F3 evidence:** Fresh targeted reading confirms that the reference really contains “You can use `--remote` with `--resume <TASK-ID>` to resume a remote task locally.” It is authentic source text, not invented wording. The original problem was presenting it as a cloud-delegation resumption recipe despite the separate local-steering definition. The revision acknowledges both passages and removes that operational inference; F3 is closed.

Prior minor items: **M1 ✅ fixed** in the summary; **M2 ✅ fixed** with the inline sibling-communication caveat and explicit dynamic-workflow availability distinction; **M3 ✅ fixed** by removing transcript publication and explaining prompt-only file boundaries; **M4 ✅ fixed** using dated raw-changelog evidence.

## Reference Validation

**17 of 39 cited URLs freshly checked in Round 2.** Numbers refer to the revised reference list, not Round 1 numbering. All returned substantive official content; no checked citation is classified as fabricated, misattributed, or persistently unavailable.

| Ref. | Source | Outcome |
|---|---|---|
| 3 | [SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode) | Web IQ browse confirms experimental binding, start RPC, both TypeScript excerpts, and lifecycle-event names; no whole-fleet completion contract is documented here. |
| 5 | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Targeted ranges confirm response-limit wording, concurrency limits, sibling messaging, plan-mode caveat, and authentic ambiguous remote-task sentence. |
| 6 | [Delegation how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca) | Confirms asking to checkpoint changes, cloud execution, draft PR, and printed links. |
| 11 | [Dynamic workflows](https://docs.github.com/en/copilot/concepts/agents/dynamic-workflows) | Confirms preview, legacy annual-billing exclusion, and approximate credit limits. |
| 14 | [Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions) | Confirms official YAML, permissions, headless denial, and workflow-access warning. |
| 16 | [Multiple sessions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions) | Confirms Sessions-tab cloud tracking/resumption and local-process lifetime. |
| 18 | [AI-credit limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) | Confirms preview, minimum 30, soft overshoot, cumulative-interactive wording, and task-duration non-interactive wording. |
| 25 | [Remote steering](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely) | Confirms local running-session steering, online-machine prerequisite, and distinction from syncing. |
| 26 | [Fleet blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) | Confirms waves, shared filesystem, no locking, prompts, and historical communication wording. |
| 28 | [October 1 workflows announcement](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/) | Confirms public preview and broad all-plans announcement; current Docs exception is now disclosed. |
| 29 | [CLI GA announcement](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) | Explicitly announces the CLI product GA and describes feature highlights; does not supply separate GA announcements for every highlighted command. |
| 30 | [January 21 CLI announcement](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/) | Confirms plan/review availability and `/resume` for local/cloud sessions, without a separate GA declaration for those commands. |
| 33 | [Rubber duck/scheduling announcement](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) | Explicit rubber-duck GA and corrected experimental scheduling status remain supported. |
| 34 | [June 10 security-review announcement](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/) | Confirms experimental/public-preview status and experimental-mode prerequisite. |
| 35 | [July 14 app security review](https://github.blog/changelog/2026-07-14-security-reviews-now-available-in-the-github-copilot-app/) | Confirms app public preview; correctly used only as corroboration, not proof of a later CLI status transition. |
| 36 | [Pinned CLI changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) | Confirms fleet/autopilot all-user availability in v0.0.411, February 17, and research command in v0.0.417, February 25. |
| 37 | [Raw main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) | Confirms background-wait warning in v1.0.88, September 22; parent-recovery exit behavior in v1.0.87, September 21; latest displayed release v1.0.91, October 1. |

Other citations were not freshly re-fetched in this round; Round 1 checks are historical evidence, not silently counted as fresh validation.

## Claim Citation Coverage

No new material citation gaps in the four revised areas. Architecture, limits, remote/local distinctions, and cost uncertainty are sourced. The remote-task wording dispute is now appropriately contextualized. The remaining lifecycle-label problem is documented as F5 below.

## Quote Verification

**12 of 16 explicit prose block quotations freshly verified in Round 2.** The denominator follows Round 1's convention: quoted prose blockquotes, excluding provenance notes and fenced samples. The added security-review quotation is included.

| Checked source | Block quotations checked | Outcome |
|---|---|---|
| Ref. 28 | Workflow versus fleet, line 101 (1) | Exact text present. |
| Ref. 26 | Filesystem/communication, line 117; linear-work overhead, line 256 (2) | Exact text present; the historical communication caveat is now adjacent. |
| Ref. 5 | Concurrency rejection, line 231; plan safety net, line 339 (2) | Exact text present. |
| Ref. 6 | Cloud execution, line 272; checkpoint approval, line 286 (2) | Exact excerpt/full text present. |
| Ref. 34 | Security-review preview, line 373 (1) | Exact text present, with slash-command formatting normalized. |
| Ref. 14 | Headless denial, line 442; workflow access warning, line 485 (2) | Exact text present. |
| Ref. 3 | Experimental binding/version pinning, line 562 (1) | Exact text present. |
| Ref. 18 | Soft-limit overshoot, line 647 (1) | Exact text present. |

Four unchanged block quotations were verified in Round 1 but not freshly re-fetched: fleet definition, independent LLM interactions, selective-delegation maxim, and research-not-modifications. The additional inline remote-task quotation in §11 was found at its cited reference after targeted pagination; no misattribution finding remains.

## Source Authority Compliance

No material issues. Added references are official and used for the precise revised claims. The third-party release-timing disagreement remains corroboration only. The SDK fragment remains transparently provisional.

## Conflict & Uncertainty Disclosure

F3 and F4 are closed. The report now distinguishes cloud delegation, local remote control, and syncing; it also discloses announcement-versus-current-Docs availability wording. Model-default and continuation-default disagreements remain candidly documented. No demand is made to invent a definitive runtime answer.

## Source Freshness & Currency

Dates and current-source caveats in the revised areas are supported. The new lifecycle decision, however, is not implemented in the status matrix.

### F5 — 🟡 Important — Lifecycle labels conflict with the new binding decision

- **Location:** §2.1, line 54 and rows at lines 59–65; the undated `--fleet` row at line 60, §9 Demo 2's optional headless step, and the unresolved introduction-date note in §11.
- **Issue:** The report explicitly defines “GA” as a working inference from product GA plus no preview notice, then uses “GA (no preview notice)” for `/fleet` and `/research` and similar inferred labels for other commands. The revised brief explicitly forbids that policy. It requires dated stable-release features lacking their own explicit label to be presented as “shipped in CLI <version> (<date>); no separate status label.” It also excludes features without dated evidence from labeled claims and demos. The report acknowledges no verified introduction date for `--fleet` but still recommends it in a demo.
- **Verification evidence:** The full current brief contains the new lifecycle decision. Fresh ref. 36 establishes v0.0.411 (2026-02-17) for fleet/autopilot availability and v0.0.417 (2026-02-25) for `/research`, not separate feature GA announcements. Fresh ref. 29 explicitly announces product GA while describing command highlights; fresh ref. 30 describes available features without separately declaring their GA. Ref. 33 demonstrates the contrasting case of an explicit rubber-duck GA announcement. The report's own definition admits that its inferred badges are not per-command announcements.
- **Why it matters:** This status matrix is the presentation's source of lifecycle badges. Keeping an inference disclaimer does not satisfy the caller's explicit prohibition on inferred GA labels and can propagate unsupported GA claims into the deck.
- **Concrete correction:** Delete the working-inference definition. Replace inferred GA badges with the required shipped/version/date/no-separate-status wording, using verified versions—for example, `/fleet`: “shipped in CLI v0.0.411 (2026-02-17); no separate status label,” and `/research`: “shipped in CLI v0.0.417 (2026-02-25); no separate status label.” Audit the remaining command rows under the same rule; retain GA only where explicit feature/product evidence supports it. For undated demo surfaces such as `--fleet`, either add dated official release evidence or remove them from demo recommendations and place them in the research-only limitations material. Do not manufacture dates or preview labels.

F5 is a genuine newly binding constraint issue, not a new stylistic preference or expansion of R5. The four original technical blockers remain closed.

## Topic Coverage Assessment

Coverage remains strong and CLI-first. The SDK discussion is now appropriately brief and bounded. The remote-control comparison corrects an important beginner misconception without expanding into R6 internals. No additional subtopic is required.

## Research Limitations Review

The revised limitations accurately retain unverified SDK completion, exact Actions combination, delegation prerequisites, and `-p /delegate` support. The authentic ambiguous remote reference is correctly recorded. Apply F5 so undated/status-unconfirmed surfaces are separated from publication/demo claims, rather than merely disclosed after those claims.

## Code & CLI Validation

Reading-only validation; nothing was executed. All ten fenced blocks retain inside-and-after source/provenance attribution. The TypeScript block contains two documented excerpts and is expressly a fragment, not a complete runnable program or fleet-success harness. F2 is closed.

The Actions synthesis no longer exports the transcript to a run summary. It publishes changed paths, explains broad write approval versus prompt-only boundaries, and identifies the final check as after-the-fact rather than preventive authorization. Parent recovery versus worker failure is correctly sourced. The exact combined workflow remains untested and appropriately labeled; no new must-fix technical finding is raised.

## Reference List Integrity

The revised count reconciles: **25 Docs + 2 blog articles + 8 changelog announcements + 2 repository files + 2 third-party articles = 39** numbered sources. The old rendered main-changelog URL is replaced, not double-counted. Added remote/security sources are cited in the body; source/provenance index numbers are updated. No orphan reference or unlisted substantive source was identified. The topic slug and Required MCP marker remain well formed.

## Report Structure & Readability

The twelve-section organization and Table of Contents remain accurate. Prior M1–M4 are closed. One residual **🟢 Minor** qualification issue is waived: §8 still heads its first bullet “Fleet uses more credits,” although its immediately following source quotation and corrected summary say “may.” Aligning the heading would improve consistency, but it does not independently block approval.

## Suggested Improvements (Prioritized)

1. **Must fix — F5, 🟡 Important:** Implement the binding shipped/version/date lifecycle policy in the status matrix and ensure undated features are not recommended in demos. This is the sole remaining blocker.
2. **Optional, waived — 🟢 Minor:** Change the §8 credit-use bullet heading to preserve the already sourced “may” qualifier.

Do not reopen F1–F4 or expand into additional SDK harness, pricing, or governance research.

## Readiness Verdict: NEEDS REWORK

**Sole remaining must-fix blocker: F5 — lifecycle labels and undated demo recommendations conflict with the current binding brief.**

F1–F4 are **✅ fixed**. No fabricated evidence or new material technical defect was identified. The report is ready for caller-managed revision focused on F5; the remaining minor qualifier is waived and would not prevent approval.

## Review Round 3 - 2026-10-05

The full Round 3 report, current binding brief, and latest prior review round were read. The supplied mechanical lint passes. The original review date and all prior rounds are preserved. The metadata verdict remains `NEEDS REWORK`; `required_mcp: WebIQ-MCP` and `mcp_status: verified` remain unchanged. No report or binding input was modified.

**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

A fresh independent Web IQ search investigated the newly cited security-review release history. Web IQ browse successfully returned meaningful content from the critical February 25 CLI GA announcement on the first attempt. Routine official-page fetches then checked lifecycle evidence, revised examples, permissions, and source conflicts. Web IQ calls were sequential.

### Fix Verification

| Finding | Status | Round 3 evidence and disposition |
|---|---|---|
| F1 — Security-review status/enablement | ✅ fixed | Public preview remains dated to the June 10 announcement. Fresh raw-changelog reading confirms introduction in v1.0.51 (May 20) and availability without `--experimental` in v1.0.64 (June 23). The report appropriately supersedes the earlier experimental-mode prerequisite while not inventing a GA transition. This correction to the prior review's historical prerequisite is accepted. |
| F2 — SDK completion/setup boundary | ✅ fixed | The executable idle-wait wrapper remains removed. §6.5 retains documented, expressly non-standalone excerpts and states that start/worker events do not prove whole-fleet completion. Fresh SDK fleet documentation supports that boundary. |
| F3 — Cloud resumption versus local remote steering | ✅ fixed | §4.4 still separates cloud links/Sessions/`/resume` from local remote control, and §11 preserves the ambiguous reference sentence without recommending it as a cloud recipe. Fresh remote-steering documentation confirms the online local-machine prerequisite. |
| F4 — Cost-limit caveat at point of use | ✅ fixed | Response-versus-session, preview, soft-limit, and budget-separation caveats remain beside recommendations and demos. Added v1.0.66 history is attributed and does not falsely resolve the current Docs conflict. |
| F5 — Binding lifecycle labels | ⚠️ partially fixed | `/fleet`, `/research`, and many other rows now use dated shipped/no-separate-status wording. Undated `--fleet`, subagent teleport, and `/pr auto` have been removed from demos, and the Actions synthesis uses the dated blog's slash-command form. However, §2.1 still treats merely being named in the product GA announcement as an explicit command GA label, and badges plan mode, autopilot, background delegation, `/review`, and `/resume` GA. Those labels are repeated in §9 and the §11 labeling method. This remaining inference violates the same binding rule identified in Round 2. |

Prior M1–M4 remain closed. The residual “Fleet uses more credits” heading flagged and waived in Round 2 is now corrected to “Fleet may use more credits.”

## Reference Validation

**12 of 39 cited URLs freshly checked in Round 3.** Reference numbers match the current report. All returned substantive content. No checked URL is classified as fabricated, misattributed, or persistently unavailable.

| Ref. | Source checked | Outcome |
|---|---|---|
| 3 | [SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode) | Confirms experimental binding, official fragments, SQL coordination caveat, and worker-event names; no whole-fleet completion contract is supplied. |
| 5 | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Confirms built-in model table, sibling messaging, concurrency table, and depth 6/max 256 wording against which the report now records conflicting release history. |
| 14 | [Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions) | Confirms official workflow, scoped approval, headless denial, and environment-access warning. |
| 18 | [AI-credit limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) | Confirms public preview, minimum 30, soft overshoot, and session/task-duration wording. |
| 25 | [Remote steering](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely) | Confirms local running-session control, online machine, and distinction from syncing. |
| 26 | [Fleet blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) | Confirms waves, no locking, quoted prompts, and `copilot -p "/fleet <YOUR TASK>" --no-ask-user`. |
| 29 | [CLI GA announcement](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) | Web IQ browse confirms explicit product GA and named feature highlights. It does not explicitly label each highlighted command GA; it also discusses experimental alt-screen functionality. |
| 32 | [SDK GA announcement](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/) | Explicit SDK GA and six language bindings are supported. |
| 33 | [Rubber duck/scheduling announcement](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) | Explicit rubber-duck GA and experimental scheduling correction are supported. |
| 34 | [Security-review announcement](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/) | Supports dated experimental/public-preview announcement and historical prerequisite; later raw release notes supersede that prerequisite. |
| 36 | [Pinned CLI changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) | Confirms plan v0.0.387, review v0.0.388, resume v0.0.386, `&` v0.0.384, fleet availability v0.0.411, and research v0.0.417 with the report's dates. |
| 37 | [Raw main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) | Targeted ranges confirm security-review v1.0.51/v1.0.64; model change v1.0.56; nesting-depth change v1.0.71; continuation default v1.0.40; session/response controls v1.0.66; and multiple-session wording v1.0.79. These are source statements, not executed-runtime verification. |

Other references were not freshly re-fetched this round. Prior validation is not counted as fresh checking. Selected new release-history claims were checked; this table does not assert that every historical changelog entry was independently audited.

## Claim Citation Coverage

The revisions preserve strong primary-source coverage. New depth, review-model, continuation, and security-review history is attributed and conflicts are disclosed. The remaining blocker is lifecycle-label interpretation, not missing evidence that the commands exist.

## Quote Verification

**8 of 16 explicit prose block quotations freshly verified in Round 3.** The inventory convention is unchanged: quoted prose blockquotes, excluding provenance notes and fenced samples.

| Checked source | Quotations checked | Outcome |
|---|---|---|
| Ref. 26 | Shared filesystem/communication, line 147; linear-work overhead, line 286 (2) | Exact text present; historical communication qualifier remains adjacent. |
| Ref. 5 | Concurrency rejection, line 261 (1) | Exact text present. |
| Ref. 34 | Security-review preview, line 416 (1) | Exact text present with slash-command formatting normalized. |
| Ref. 14 | Headless denial, line 485; workflow-access warning, line 528 (2) | Exact text present. |
| Ref. 3 | Experimental RPC/version pinning, line 607 (1) | Exact text present. |
| Ref. 18 | Soft overshoot, line 692 (1) | Exact text present. |

The other eight unchanged block quotations were checked in earlier rounds, not freshly re-fetched here. Additional new inline changelog excerpts concerning security-review enablement, nesting depth, code-review model, continuation default, and session limits were found in the cited release entries. No fabrication or corrected-attribution finding is raised.

## Source Authority Compliance

No material source-authority issue. The stronger dated raw-release evidence appropriately corrects the old security-review enablement statement. Explicit GA evidence remains sufficient for the CLI product, SDK product, and rubber-duck feature, but source authority alone does not make every included feature explicitly GA.

## Conflict & Uncertainty Disclosure

F1–F4 remain closed. Newly disclosed depth 6/256 versus 4/128 and fixed-review-model versus session-model conflicts are genuine and appropriately attributed near affected claims. Keeping them unresolved rather than selecting an unsupported runtime answer is acceptable. The report also preserves the `/limits` and sibling-messaging caveats.

## Source Freshness & Currency

The security-review chronology is materially improved: release introduction and experimental-gate removal are now distinguished from announcement date and preview status. Those corrections are accepted.

### F5 — 🟡 Important — Remaining inferred GA badges

- **Location:** §2.1 policy, especially line 61 and table lines 73–77; §9 Demo 1 steps 2/4 and Demo 3; §11 “Lifecycle labelling method (Round 3).”
- **Remaining issue:** The revised policy adds “or a feature named in the 2026-02-25 Copilot CLI GA announcement” as a route to a GA badge. The brief supplies no such exception. The five command/mode rows still lack an explicit feature GA declaration and must use the required shipped/version/date/no-separate-status wording.
- **Verification evidence:** Fresh Web IQ browse of ref. 29 explicitly declares **GitHub Copilot CLI** generally available and says its list contains “highlights” making the CLI ready for GA. Plan mode, autopilot, delegation, `/review`, and `/resume` are described, not individually declared generally available. The same article includes explicitly experimental alt-screen functionality, demonstrating that inclusion in a GA-product announcement is not itself a universal lifecycle declaration. Ref. 36 independently supplies dated command availability. The binding brief prohibits inferred feature GA badges.
- **Good-faith reconsideration:** The researcher's evidence convincingly establishes that these capabilities were present and showcased at product GA. It supports the explanatory note “featured in the CLI GA announcement.” It does not satisfy the caller's stricter requirement for an explicit feature lifecycle label; the remaining finding is therefore not dropped. No separate GA research is required when dated shipped wording is already available.
- **Why it matters:** The unsupported exception is repeated in the demo script and can propagate the same prohibited badges into the presentation. A source-attribution qualifier beside “GA” does not remove the badge.
- **Concrete correction:** Keep GA for the explicitly announced CLI product, SDK, and rubber duck. Replace the five inferred command/mode badges, including their demo repetitions, with:
  - Plan mode: shipped in CLI v0.0.387 (2026-01-20); no separate status label.
  - Autopilot: shipped/available to all users in CLI v0.0.411 (2026-02-17); no separate status label.
  - Background delegation: `&` shipped in CLI v0.0.384 (2026-01-16), equivalent to `/delegate`; no separate status label. Retain `/delegate`'s separately cited announcement date as history.
  - `/review`: shipped in CLI v0.0.388 (2026-01-20); no separate status label.
  - `/resume`: shipped in CLI v0.0.386 (2026-01-19); no separate status label.
  
  Delete the named-in-product-announcement exception from §2.1 and §11. The February 25 feature-highlight note may remain as context without a feature GA badge.

This is the unresolved portion of the existing F5, not a new must-fix finding or scope expansion. Its undated-demo portion is fixed.

## Topic Coverage Assessment

No new coverage gaps. CLI orchestration remains central; the undated material is transparently segregated from demos. The dated slash-command headless route preserves the required non-interactive coverage.

## Research Limitations Review

Limitations now candidly include the newly discovered release-versus-reference disagreements and the superseded experimental-mode prerequisite. These are useful for slide extraction. Apply the remaining F5 label correction; no additional SDK harness, pricing, or governance expansion is requested.

## Code & CLI Validation

Reading-only audit; no code, command, or workflow was executed. All ten sample blocks retain visible inside-and-after source/provenance attribution.

The Actions synthesis now uses the official dated blog's `/fleet`-inside-`-p` form, while preserving scoped approvals, soft-limit caveats, manual trigger, transcript omission, and after-the-fact path checks. Its exact runtime combination remains untested and labeled. The SDK fragment remains expressly non-standalone and does not claim fleet success. F2 remains fixed; no new must-fix code finding is raised.

## Reference List Integrity

The 39-source inventory remains coherent: 25 Docs + 2 blog articles + 8 changelog announcements + 2 repository files + 2 third-party corroboration sources. Body citations and provenance index reconcile, including the changed Actions source set (14, 26, 18). No orphan reference was identified. Header slug, MCP marker, and twelve-section Table of Contents are intact.

## Report Structure & Readability

No material readability issue beyond the lifecycle badges identified in F5. All prior minor corrections, including the Round 2 residual credit-use heading, are fixed. No minor item is being used to withhold approval.

## Suggested Improvements (Prioritized)

**Only must fix:** Finish F5 by removing the five inferred command/mode GA badges and their demo/limitations repetitions. Use already verified shipped/version/date wording; keep product-GA feature inclusion as an optional historical note, not a status label.

The undated-demo corrections and F1–F4 should not be reopened. No new must-fix issue is added in this final-cycle review.

## Readiness Verdict: NEEDS REWORK

**Sole remaining blocker: F5 — partially fixed; five command/mode GA badges still rely on inclusion in a product GA announcement rather than the explicit lifecycle evidence required by the binding brief.**

F1–F4 remain **✅ fixed**. The undated demo exclusions, headless workflow substitution, security-review chronology, and additional conflict disclosures are accepted. The report is ready for caller-managed revision of the remaining labels. This is Review Round 3; subsequent routing and workflow completion belong to the caller.

## Review Round 4 - 2026-10-05

Authorized manual extra round. The full revised report, latest binding brief, and Round 3 review were read. The new brief decision expressly permits the label “included in the Copilot CLI GA announcement (2026-02-25)” while prohibiting a standalone feature GA badge. The supplied mechanical lint passes. Only the metadata verdict and this appended round are changed; prior rounds and the first-review date are preserved. The research report and binding inputs remain untouched.

**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

Fresh independent Web IQ search confirmed the named features in the February 25 CLI GA announcement. Web IQ browse returned meaningful content from that critical cited URL on the first attempt. Routine official-source fetches checked supporting release dates, explicit GA announcements, and the earlier technical fixes. Web IQ calls were sequential.

### Fix Verification

| Finding | Status | Verification |
|---|---|---|
| F1 — Security-review status/enablement | ✅ fixed | Public-preview announcement, historical experimental requirement, and v1.0.64 removal of that gate remain distinguished in §2.1, §5.3, and §11. Fresh June 10 announcement and June 23 release-note reads support the retained qualification; no unsupported GA transition is claimed. |
| F2 — SDK completion/setup boundary | ✅ fixed | §6.5 retains official non-standalone excerpts, setup context, and an explicit absence of a documented whole-fleet completion contract. The removed idle-wait wrapper has not returned. Fresh fleet SDK documentation confirms the excerpt and experimental binding. |
| F3 — Cloud resumption versus local remote steering | ✅ fixed | §4.4 still uses cloud-task links/Sessions/`/resume`, distinguishes local `--remote` steering, and quarantines the ambiguous combined-flag sentence. Fresh remote-steering documentation confirms the online local-process prerequisite. |
| F4 — Cost-limit caveat at point of use | ✅ fixed | The summary, automation table, Actions notes, §8, Demo 1, and §10 retain public-preview/soft-limit, response-versus-session, and separate-budget caveats. Fresh how-to and command-reference reads still support the disclosed conflict. |
| F5 — Binding lifecycle labels | ✅ fixed | §2.1 policy/table, Demo 1, Demo 3, and §11 now use the expressly authorized “included in the Copilot CLI GA announcement (2026-02-25)” wording plus dated availability for plan mode, autopilot, background delegation, `/review`, and `/resume`. None receives a standalone GA badge. Standalone GA is confined to the explicitly announced CLI, rubber duck, and SDK. Undated `--fleet`, teleport, and `/pr auto` demo exclusions remain intact. |

F5 is closed on both evidence and the latest binding decision—not merely waived. Fresh announcement content confirms the five named capabilities; fresh pinned release notes confirm the associated shipped dates. M1–M4 and the later credit-heading qualifier remain fixed.

## Reference Validation

**12 of 39 cited URLs freshly checked in Round 4.** Numbers match the current reference list. All checked URLs returned substantive content. No checked source is fabricated, misattributed, or persistently unavailable.

| Ref. | Checked source | Outcome |
|---|---|---|
| 3 | [SDK fleet mode](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/fleet-mode) | Confirms experimental RPC, official fragments, worker events, and provisional coordination contract. |
| 5 | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Targeted reading confirms concurrency/depth/model tables, sibling communication, and per-response credit-limit wording. |
| 14 | [Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions) | Confirms official YAML, permissions, scoped approval, headless denial, and access warning. |
| 18 | [AI-credit limits](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) | Confirms preview, minimum 30, soft overshoot, and cumulative-session/task-duration wording. |
| 25 | [Remote steering](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely) | Confirms local running-session control, online-machine prerequisite, and distinction from syncing. |
| 26 | [Fleet blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) | Confirms waves, file-locking warning, prompts, and dated headless slash-command form. |
| 29 | [CLI GA announcement](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) | Independent Web IQ search and browse confirm explicit CLI product GA and inclusion of plan, autopilot, background delegation, `/review`, and `/resume`. The revised inclusion labels are accurate. |
| 32 | [SDK GA announcement](https://github.blog/changelog/2026-06-02-copilot-sdk-is-now-generally-available/) | Explicit SDK GA and six languages are supported. |
| 33 | [Rubber duck/scheduling announcement](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) | Explicit rubber-duck GA and experimental scheduling correction are supported. |
| 34 | [Security-review announcement](https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/) | Confirms dated public-preview announcement and historical experimental gate. |
| 36 | [Pinned CLI changelog](https://raw.githubusercontent.com/github/copilot-cli/v1.0.11/changelog.md) | Confirms plan v0.0.387/January 20, review v0.0.388/January 20, resume v0.0.386/January 19, `&` v0.0.384/January 16, fleet/all-user availability v0.0.411/February 17, and research v0.0.417/February 25. |
| 37 | [Raw main changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) | Fresh targeted reading confirms v1.0.64/June 23 makes security review available without `--experimental`, supporting the report's corrected prerequisite. |

Other citations were not freshly re-fetched in this round; earlier checks remain recorded in their own rounds and are not included in the fresh count.

## Claim Citation Coverage

No material issues. Revised inclusion labels are directly supported and no longer imply separate feature GA declarations. Earlier architecture, automation, local/cloud, and cost recommendations retain citations and qualifications.

## Quote Verification

**8 of 16 explicit prose block quotations freshly verified in Round 4.** As in earlier rounds, this denominator excludes provenance notes and fenced samples.

| Checked source | Block quotations checked | Outcome |
|---|---|---|
| Ref. 26 | Shared filesystem/communication, line 148; linear-work overhead, line 287 (2) | Exact text present; historical communication caveat is retained. |
| Ref. 5 | Concurrency rejection, line 262 (1) | Exact text present. |
| Ref. 34 | Security-review preview, line 417 (1) | Exact text present with command formatting normalized. |
| Ref. 14 | Headless denial, line 486; workflow-access warning, line 529 (2) | Exact text present. |
| Ref. 3 | Experimental RPC/version pinning, line 608 (1) | Exact text present. |
| Ref. 18 | Soft overshoot, line 693 (1) | Exact text present. |

The other eight unchanged block quotations were verified in prior rounds, not freshly re-fetched here. Additional inline inclusion/date statements central to F5 were checked against refs. 29 and 36. No quotation fabrication or corrected-attribution issue was found.

## Source Authority Compliance

No material issues. Primary documentation, announcements, and official release notes support core conclusions. Third-party references remain explicitly corroborative. Product GA, feature GA, announcement inclusion, and shipped-without-status evidence are now correctly separated.

## Conflict & Uncertainty Disclosure

No material issues. Model inheritance, sibling communication, autopilot continuation defaults, interactive credit scope, depth limits, and review-model conflicts remain disclosed rather than falsely resolved. Approval does not establish an executed-runtime answer to those disagreements.

## Source Freshness & Currency

The current lifecycle wording complies with both binding decisions. CLI GA February 25 and rubber-duck/SDK GA June 2 are freshly supported. Security-review preview status is distinguished from gate removal. Undated functionality remains research-only and excluded from the relevant demos.

## Topic Coverage Assessment

No material issues. R5 remains comprehensive and CLI-first, with appropriate workflow patterns, local/cloud contrasts, monitoring, headless use, Actions, brief SDK coverage, cost implications, and fallback-aware demos. No scope expansion is needed.

## Research Limitations Review

The limitations remain substantive and useful: they identify source conflicts, documentation-only internals, SDK completion uncertainty, untested synthesis, delegation gaps, and intentional exclusions. §11 now records the correct inclusion-label method without reinstating inferred feature GA badges.

## Code & CLI Validation

Reading-only validation; no code, command, or workflow was executed. All ten fenced blocks retain inside-and-after source/provenance attribution. The TypeScript example remains a non-standalone start/events fragment. The Actions example remains labeled synthesis, uses the dated slash-command headless route, avoids publishing the transcript, and discloses broad write approval and after-the-fact checks. Rehearsal remains necessary before a live demo; no example is represented as runtime-tested.

## Reference List Integrity

The inventory reconciles: **25 Docs + 2 blog articles + 8 changelog announcements + 2 repository files + 2 third-party sources = 39**. No body-source omission or orphan reference was identified. Source categories and provenance index are consistent. Required MCP marker, topic slug, and header remain well formed.

## Report Structure & Readability

No material issues. The twelve-section Table of Contents remains accurate. Lifecycle labels are consistent across the matrix, demos, and limitations. Prior minor items are resolved; no remaining minor finding needs to withhold or qualify approval.

## Suggested Improvements (Prioritized)

**Must-fix findings: none.** Preserve the documented conflict qualifiers, lifecycle wording, and non-standalone/synthesized-example labels when extracting slides. Rehearse selected demos and record their CLI/SDK versions as already recommended.

All prior minor items are fixed. Any remaining non-blocking editorial polish is waived and is not a publication gate.

## Readiness Verdict: APPROVED

**F1–F5: ✅ fixed. Remaining must-fix blockers: none.**

The R5 report is publication-ready as a research input for the caller's presentation workflow, with its stated limitations and source conflicts preserved. No unresolved 🔴 Critical or 🟡 Important finding remains. Prior minor items are resolved; any residual non-blocking polish is waived. The research report was not modified by this reviewer.
