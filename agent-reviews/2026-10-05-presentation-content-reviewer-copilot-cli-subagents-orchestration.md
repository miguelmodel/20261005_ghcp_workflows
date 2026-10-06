---
reviewer: presentation-content-reviewer
subject: "Subagents & Multi-Agent Orchestration with GitHub Copilot CLI"
companion: presentation-content-creator
date: 2026-10-05
verdict: APPROVED
overall_score: 40/50
---

## Review Round 1 — 2026-10-05

## Presentation Review Summary

The CLI-first structure, practical examples and enforcement/advisory distinction are strong. Revision is needed for billing caveats, overgeneralized model and hook behavior, introductory terminology, two demo-contract problems, security coverage, and delivery within the fixed time.

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | One idea per slide | 3/5 | Slide 34 combines two automation approaches and several additional note-only topics in one minute. |
| 2 | Audience calibration | 3/5 | MCP is never expanded; context window is used without a first-principles explanation (slides 2–5, 18–20). |
| 3 | Progressive learning flow | 4/5 | No material issues: motivation → map → foundations → specialization → controls → orchestration → decisions. |
| 4 | Research fidelity and provenance | 3/5 | Strong source coverage, but slides 18, 25, 46–48 lose important qualifications or contradict another cited report. |
| 5 | Coverage completeness | 3/5 | Required prompt-injection considerations and appendix network controls disappear (slides 23–28, 41–44). |
| 6 | Examples, code, commands and demos | 3/5 | Demo 1 navigation may invoke an excluded feature; Demo 2's referenced profile lacks its expected output/recovery contract. |
| 7 | Pacing and density | 3/5 | Timing arithmetic is correct; slides 29, 34–35 need clearer delivery priorities and hard demo cutovers. |
| 8 | Visual variety and contracts | 4/5 | No material issues: diagrams are buildable and marked hand-craft; minor map-legend ambiguity. |
| 9 | Storytelling arc | 4/5 | No material issues: the closing resolves the opening with concrete, low-risk next steps. |
| 10 | Progression and non-redundancy | 4/5 | No material issues: repeated concepts generally serve overview, application and synthesis rather than duplication. |
| | **Overall** | **34/50** | **NEEDS REWORK** |

### Scope and mechanical verification

- Read the binding brief, the entire presentation including frontmatter/outline/bodies/notes/Sources/metadata, and all nine declared research reports using their relevant evidence sections. Research and prior-review files were enumerated; no matching earlier presentation-content review exists.
- Frontmatter is valid. `topic`, `topic_slug`, exact audience wording, integer `target_duration: 60`, ordered emphasis, de-emphasis, structural preferences, `version: 1`, `created` and `revised` agree with the brief.
- All nine `source_files` exist and match the discovered `research/*.md` set and `research_allowlist.mode: all`. All slide research references are listed. No broken, outside or unlisted slide source was found.
- 49 sequential slides; 49 speaker-note markers and 49 Sources lines. Outline sections and metadata agree. Slides 1–39 are counted: 36 core slides total 45 minutes, plus slides 12, 29 and 35 at five minutes each. Slides 40–49 follow the closing and are non-counted.
- The caller's lint PASS is consistent with these checks, but does not resolve the substantive findings below.
- No banned terms are declared. No excluded editor/framework coverage, separate audience break or Q&A segment appears. Two main-deck beyond-CLI slides and one Agent HQ mention respect the focus split.
- No image-placeholder slides, missing image attribution contracts, ordinary-code hand-craft misuse, four-identical-type run, or five-slide uninterrupted dense-text run was found. Patch versions in lifecycle evidence and exact model IDs in configuration examples are functional, not gratuitous identifiers.

Research shorthand below follows the brief: R1 foundations; R2 custom agents; R3 customization/MCP; R4 permissions/guardrails; R5 fleet/delegate; R6 beyond CLI; R7 governance; R8 plans/pricing; R9 Azure billing. These are the nine dated files in the presentation's source list.

## Detailed Findings

### 1. One idea per slide — 3/5

- **F8 — 🟡 Important, slide 34:** “Headless runs and dynamic workflows” shows two headless commands, then introduces a different process-defined-in-code mechanism. Notes additionally cover Actions authentication/billing, child-failure exit behavior, credit limits and the SDK. These are not explained as one decision, yet the allocation is one minute. Make this a focused choice between ad-hoc headless runs and reusable staged workflows; select one command to explain, and explicitly mark the other technical details optional/reference-only.
- **M1 — 🟢 Minor, slides 8 and 14:** Both have seven-row catalogs; slide 8 also has five columns with repeated long lifecycle wording. The seven-agent inventory is required, so do not delete an agent merely to meet a row heuristic. Compact repeated status text into a keyed legend and prioritize the rows discussed live.
- Other slides have coherent organizing ideas. Slide 11's configuration and task management are reasonably paired as preparation for Demo 1. Metadata types broadly match their bodies.

### 2. Audience calibration — 3/5

- **F4 — 🟡 Important, slides 2–5 and 18–20:** “Context window” is central to the opening benefit but is never explained as the bounded material the model can consider. “MCP servers” first appears in slide 4; neither visible content nor notes expands Model Context Protocol. Slides 18–20 then assume the audience understands the connection between a server and callable tools.
- R1 §2.4 supplies a concrete context-window explanation; R3 §2.2 supplies MCP newcomer basics. Add a short definition at first use, such as a bounded working context containing instructions/messages/tool results, and MCP as the protocol connecting Copilot to external tool providers. Tie that to the later CLI/agent configuration.
- The main agent/subagent/custom-agent distinction (slide 4), the three meanings of `task`, and `/agent` versus `/agents` are otherwise well calibrated. No extensive beginner detour is needed.

### 3. Progressive learning flow — 4/5

**No material issues.**

Slides 2–3 establish value and the required seven-way map. Slides 4–7 establish delegation before the catalog; slides 13–18 move from a minimal profile to scoping and a composed specialist; slides 19–28 establish configuration and controls before parallel work. Each section has an explanatory transition. Slides 36–37 widen the lens only after the CLI story, and slides 38–39 return to decisions and next steps. Address the terminology gap in F4 within that sequence rather than adding a new introductory section.

### 4. Research fidelity and provenance — 3/5

The required minimum is `max(10, ceil(0.15 × 49)) = 10` claim checks. The following 25 checks span all sections and all nine declared reports; checks include speaker-note-only claims. “Matches” means consistent with the supplied research/brief, not independently executed or freshly web-verified.

| # | Slide(s) | Claim checked | Evidence and result |
|---|---|---|---|
| 1 | 1, 3 | CLI GA date and announcement-inclusion wording | Brief decisions; R1 §1, R5 §2.1: matches; no inappropriate standalone GA badge for announcement-only CLI features. |
| 2 | 4–5 | Definition versus execution; `task` and management tools | R1 §§2.1, 2.3; R2 §2.1: matches. |
| 3 | 6 | Instructions opt-in and memory inheritance | Brief verified facts; R3 §7, R5 §3.6: matches. |
| 4 | 7 | “parallelism tool, not a pause button” quotation | R1 §2.2 attributes the same quotation to the 2026-06-12 GitHub Blog post: matches. |
| 5 | 8–9 | Seven built-ins, rubber duck GA, security-review preview and removal of experimental gating | R1 §§1, 7.1; R4 §2.2; R5 §2.1: matches. No single uncaveated nesting/concurrency number is shown. |
| 6 | 10 | Model/effort resolution and narrowly scoped Auto rule | R1 §5.1; R2 §6.1: matches on this slide; notes appropriately identify unknown override interactions. |
| 7 | 11 | `subagents.agents`, `effortLevel`, `contextTier`, disabled agents | R1 §5.2: matches the illustrative fragment; note says synthesized. |
| 8 | 11–12 | `/tasks` Enter behavior and dated eligibility | R1 §6.1 and R5 §3.5: Enter can teleport into a subagent view; the demo's exclusion is not reliable. **F5.** |
| 9 | 13–14 | Profile shape, required description, 30,000-character body, frontmatter keys | R2 §§3.2–3.4: matches; cross-surface key gaps are disclosed. |
| 10 | 15 | Six agent-source tiers and path-derived ID precedence | R2 §4: matches the brief. |
| 11 | 17 | Tool restrictions persist into children | R2 §7.5 and dated 1.0.67/1.0.68 evidence: matches; wider-child coordinator is correctly called unverified. |
| 12 | 18, 46 | Auto applied to a `models` example and generalized to all workers | R1 §5.1 expressly leaves `models`, per-call and picker interactions unverified. **F2.** |
| 13 | 20 | MCP session → plugin → workspace → user precedence | R3 §6.2: matches; agent-level ranking is correctly left undocumented. |
| 14 | 21 | `mcpServers`, HTTP headers, `${VAR}`, stdio shape | R3 §6.3: matches adapted example; notes correctly require removing the JSONC annotation. |
| 15 | 22 | Plugin formats, repo scoping, collision rules | R3 §§1, 5: matches. |
| 16 | 24 | Deny precedence and visibility versus approval | R4 §§1, 7.6: matches; unresolved hook-allow interaction is stated in notes. |
| 17 | 25 | Hook deny aggregation, crashes, timeouts and disabling | R4 §§7.3, 7.6–7.7: aggregation/disabling match; timeout wording overstates execution. **F3.** |
| 18 | 26, 29 | Hook configuration paths, matcher and decision JSON | R4 §7.8: configuration matches; Demo 2's script location and profile preparation need precision. **F6.** |
| 19 | 27–28 | Plan-mode limitations and advisory creator/reviewer loop | R4 §§8–9: matches; stop hooks are not misrepresented as an implementer-fix gate. |
| 20 | 30–31 | Fleet waves, shared filesystem/no locking, documentation prompt | R5 §§3.3–3.7: matches; exact prompt is attributed and ownership risk is prominent. |
| 21 | 32–35 | Cloud delegation versus local remote control; headless form; workflow preview | R5 §§2.1, 3.3, 4, 6.4: matches documented forms and lifecycle dates. |
| 22 | 36–37 | App/cloud/code-review/Agent HQ/Agentic Workflows status | R6 §§1, 3: matches verified dates and light scope. |
| 23 | 41–44 | Managed permissions, MCP lists, registry bypass, content exclusion | R7 §§2.3, 5–6, 9: matches; per-client exclusions and inference caveats are preserved. |
| 24 | 45–47 | Plan prices/allowances, credit conversion, arithmetic and budget hard stops | R8 §§3, 4.1–4.3, 5.2–5.3: numbers/arithmetic match. Visible CLI-limit scope loses the required caveat. **F1.** |
| 25 | 48–49 | Azure roles, cadence, invoice IDs, budgets and unsupported quota ID | R9 §§2–5: matches. Slide 48's blanket GitHub-budget status statement conflicts with R8 §2.3 and slide 47. **F1.** |

**F1 — 🔴 Critical, slides 47–48: billing caveat and lifecycle contradiction.**

- Slide 47 visibly gives `/limits` or `--max-ai-credits` the scope “One CLI session or run.” The per-response versus per-session conflict appears only in notes. The brief explicitly requires conflicting `/limits` scope to remain out of visible text or carry an explicit caveat; the notes do not satisfy that rule, particularly in a non-presented reference appendix.
- Slide 48 notes say “no official source states GA or preview for … GitHub budgets …; don't badge them GA.” R8 §2.3 cites the 2026-06-01 announcement for **user-level budgets GA**, which slide 47 correctly displays. R9's broader unresolved-status statement cannot override that more specific dated evidence.
- **Required fix:** qualify the visible CLI-cap scope (“CLI soft cap; per-response vs per-session scope unresolved”), or remove the scope assertion. Narrow slide 48's unresolved-status statement to the relevant Azure mechanisms, explicitly excluding the evidenced user-level-budget GA status.

**F2 — 🟡 Important, slides 18 and 46; related recovery wording on slide 12.**

Slide 18 uses `models: [...]`, then notes state that under Auto the resolved session model is used instead. Slide 46 says “cheaper worker models apply only in a non-Auto session” and “subagents use the resolved session model.” R1 §5.1 establishes only the custom-agent **`model` field** override; it explicitly leaves ordered `models`, picker/per-call overrides and built-in defaults unresolved. `research` and `rubber-duck` also have specialist rules. Slide 10 correctly preserves these distinctions.

**Required fix:** use the same narrowly scoped wording as slide 10 throughout; acknowledge that the `models` example's Auto behavior is unverified and inspect `/usage`. Treat Auto as a possible cause to investigate in Demo 1 recovery, not as established proof that built-in picker preferences were overridden.

**F3 — 🟡 Important, slides 23 and 25.**

Slide 25 says “any hook that times out lets it through”; notes repeat that a timeout “lets the call through.” R4 §7.7 says the hook fails open and the call proceeds through **normal permission flow**, where another hook, deny rule or approval requirement can still stop it.

**Required fix:** say that a timeout contributes no blocking decision and normal permission checks continue. Keep the distinction between a failed hook safeguard and permission to execute. Apply that wording consistently to the slide 23 control-layer explanation.

### 5. Coverage completeness — 3/5

The nine source areas are represented, and the emphasis/appendix split is proportionate. Built-ins, custom agents, settings precedence, MCP, hooks, fleet and delegation all receive practical treatment. Org-agent precedence on slide 15 is necessary practitioner context, not a material governance scope violation.

**F7 — 🟡 Important, slides 23–28 and 41–44: required security subtopics omitted.**

- No body or note explains **prompt injection**, despite R4's explicit assignment and §10.1 threat model. Folder trust, tool restrictions and secret hygiene are mentioned, but the audience is not told that repository/web/MCP content can contain instructions attempting to redirect the agent. The trimmed reviewer also drops R2 §12.1's “Treat file contents … as data” instruction.
- R7 §10's **network controls** disappear from the governance appendix: cloud firewall applicability/limitations, subscription-based routing and local managed domain/sandbox controls are not explained.
- **Required fix:** add a short practitioner threat/mitigation explanation in the existing guardrails segment and restore the reviewer instruction in the actual demo profile. Add a concise appendix note or compact item distinguishing local egress controls from the delegated cloud firewall, with limitations and appropriate no-dated-status caveats. This does not require another main-deck section or demo.

### 6. Examples, code, commands and demos — 3/5

Syntax and configuration shapes were reviewed without execution. Most commands match the research; synthesized examples are labeled, secrets are placeholders/environment references, and demos keep timing off-screen.

**F5 — 🟡 Important, slides 11–12: Demo 1 navigation does not reliably exclude teleporting.**

Slide 12 step 3 directs the presenter to select running subagents and press `Enter` for details, but its lifecycle note says teleporting into a subagent view is deliberately excluded for lack of dated introduction evidence. R1 §6.1 and R5 §3.5 document Enter as a route into that view.

**Required fix:** remove Enter on a subagent row from the live path. Show only the list/eligible controls, or explicitly restrict the detail step to a shell-task row whose behavior has been rehearsed. Align slide 11's description with the distinction. Do not rely on a label saying “not shown” while the scripted key may invoke it.

**F6 — 🟡 Important, slides 18 and 29: demo profile and recovery contract mismatch.**

- Setup specifies the reviewer “from slide 18.” That shortened prompt asks for a Markdown table, but defines neither the `Critical/High` severity field consumed by the coordinating loop nor the promised `unverified against library docs` fallback.
- Those instructions exist in the **full R2 §12.1 profile**, not in the slide 18 artifact. Expected loop/recovery behavior therefore is not supplied by the setup as written.
- Slide 29 setup calls the executable `scripts/pre-tool-policy.sh`, while slide 26's `cwd` and later recovery use `.github/hooks/scripts/pre-tool-policy.sh`.
- **Required fix:** identify the exact full R2 §12.1/§12.2 profiles as the demo files, or include their severity/output, no-MCP recovery, scope and stop instructions in the demo preparation notes. Explicitly distinguish slide 18 as a display excerpt. Use the resolved hook-script path consistently and state the Bash/PowerShell rehearsal environment.

### 7. Pacing and density — 3/5

The allocation passes: 45 core minutes / 36 core slides = **1.25 minutes per core slide**, plus three five-minute demos. Sections have reasonable relative weight, visual interruptions are frequent, and the opening/closing are purposeful.

**F8 — 🟡 Important, slides 29, 34–35: delivery budget is not yet operationally protected.**

- Demo 2's steps sum to about **4:45** before transition, approvals or recovery; its two-minute implementation/test/review slot may also include a second implementation/review cycle. There is no recorded/pre-completed fallback for that central work.
- Demo 3's steps sum to about **4:50** before transition. It has a recording fallback for sequential execution and a pre-delegated PR, but no clear cutover if planning, fleet completion or `/review` simply takes longer than its allocation.
- Slide 34 has too many potentially presented technical threads for one minute (see dimension 1).
- **Required fix:** retain all three five-minute slots and the 60-minute total. Add elapsed-time cutoffs, pre-completed/recorded outputs for long-running paths, a point at which to skip retries, and an explicit wrap/transition reserve. For slide 34 distinguish the short live explanation from optional note-only depth. These changes need not increase slide count.

### 8. Visual variety and contracts — 4/5

**No material issues.** Tables, comparisons, code, diagrams, a quotation, demos and a decision tree provide variety. Conceptual ASCII layouts carry `Visual: hand-craft`; ordinary code does not. The fleet shared-filesystem risk and creator/reviewer enforcement distinction are visually explicit (slides 28, 30).

**M2 — 🟢 Minor, slide 3:** The two arrowed “WHO DECIDES” / “WHERE IT RUNS” labels look like spatial axes, but the seven mechanisms below are arranged in agenda order rather than positioned on those axes. Present them as two comparison questions/legend labels, or explicitly state that placement is not an axis mapping. Retain the required seven-way map.

### 9. Storytelling arc — 4/5

**No material issues.**

The opening establishes isolation/specialization/parallelism and their coordination cost. The middle makes those benefits actionable through specialists and controls. Slides 38–39 synthesize context, tool boundaries and external merge gates, then specify an achievable first week. This is a coherent beginning-middle-end, not a feature tour ending abruptly at the appendix.

### 10. Progression and non-redundancy — 4/5

**No material issues.** No fully redundant/delete candidate or significant merge candidate was found after comparing concept clusters:

- Slides 4–6: vocabulary, runtime loop, inheritance.
- Slides 8–9: catalog, then reviewer selection criteria; slide 33 later adds operational commands, autopilot behavior and research use.
- Slides 10–11, 14, 18: resolution order, user settings, authored keys, composed example.
- Slides 17, 23–26, 28: tool availability, control taxonomy, permissions, hook semantics/configuration, advisory review.
- Slides 30–32, 35: mechanism, prompting, location choice, demonstration.
- Slides 38–39: higher-abstraction decision synthesis and call to action.

Repeated warnings about instructions, shared filesystems and advisory review are meaningful callbacks. Do not remove them merely to reduce word repetition.

## Issues Summary

| # | Severity | Slide(s) | Issue | Evidence | Required Fix |
|---|---|---|---|---|---|
| F1 | 🔴 Critical | 47–48 | Billing scope caveat is hidden; budget status contradicts evidenced GA | Brief requires visible `/limits` caveat; R8 §§2.3, 5.3; slide 48 blanket status denial | Qualify/remove visible scope; narrow unresolved-status statement to Azure mechanisms and preserve user-level-budget GA. |
| F2 | 🟡 Important | 18, 46; 12 recovery | Auto rule generalized beyond verified `model` field behavior | R1 §5.1 explicitly leaves `models`, picker/per-call and built-in effects unknown | Use scoped wording; disclose unresolved interactions and verify actual models via `/usage`. |
| F3 | 🟡 Important | 23, 25 | Timeout is described as permitting execution | R4 §7.7 says normal permission flow continues | Replace “lets it through” with loss of hook denial followed by normal permission checks. |
| F4 | 🟡 Important | 2–5, 18–20 | Central newcomer terms lack definitions | MCP never expanded; context window used without explaining its contents/bounds | Briefly define at first use and connect external servers to callable tools. |
| F5 | 🟡 Important | 11–12 | Enter may invoke the lifecycle-excluded teleport action | R1 §6.1 / R5 §3.5 versus Demo 1's explicit exclusion | Remove subagent Enter step or constrain details to a rehearsed shell-task row. |
| F6 | 🟡 Important | 18, 29 | Demo profile omits severity/recovery contract; script path ambiguous | Display excerpt versus full R2 §12.1; slide 26's `cwd` | Name/use full profiles; align severity/fallback/scope/stop rules, script path and shell prerequisites. |
| F7 | 🟡 Important | 23–28, 41–44 | Prompt-injection and network-control coverage omitted | Binding R4/R7 assignments; R4 §10.1 and R7 §10 | Add concise sourced threat/mitigation content and appendix local/cloud network distinction. |
| F8 | 🟡 Important | 29, 34–35 | Demo cutovers and one-minute automation priorities insufficient | Steps use nearly all five minutes; central work lacks explicit time-expiry fallback | Add hard cutoffs, saved outputs and transition reserve; focus slide 34's live explanation. |
| M1 | 🟢 Minor | 8, 14 | Seven-row catalogs and repeated lifecycle text are scan-heavy | Seven agents × five columns; seven key-group rows | Nice-to-have: keyed status legend and live-row priorities; retain required coverage. |
| M2 | 🟢 Minor | 3 | Apparent map axes do not encode item placement | Arrowed dimensions above agenda-ordered cards | Nice-to-have: question-style legend or explicit non-spatial placement note. |

## Suggested Improvements (Prioritized)

1. **Correct high-stakes claims first:** F1–F3. Preserve the well-scoped explanations already present on slide 10 and the deny/hook caveat on slide 24.
2. **Make demo setup self-consistent and lifecycle-safe:** F5–F6. Distinguish slide excerpts from the exact prepared files; remove the ambiguous Enter navigation.
3. **Close the first-principles and security gaps without adding a section:** F4 and F7. Use existing foundations/guardrails notes and the non-counted appendix.
4. **Protect the exact delivery budget:** F8. Rehearse against timed cutovers, not an assumption that all model calls finish on schedule.
5. **Optional polish:** M1–M2. Compact status presentation and clarify the map legend; no deletion of required catalog/map items is requested.

## Verdict: NEEDS REWORK

The presentation is structurally sound and well sourced, but **F1–F8 are unresolved blockers**:

- **F1:** visible CLI-limit scope lacks the binding caveat; slide 48 contradicts the evidenced user-level-budget GA status.
- **F2:** Auto behavior is overstated beyond the verified custom-agent `model` field.
- **F3:** hook timeout wording incorrectly implies execution rather than continuation through permission checks.
- **F4:** MCP and context-window basics are missing for the declared newcomer audience.
- **F5:** Demo 1's Enter step may invoke the explicitly excluded teleport feature.
- **F6:** Demo 2 references an incomplete reviewer contract and ambiguous script setup.
- **F7:** required prompt-injection and appendix network-control coverage is absent.
- **F8:** delivery needs hard demo cutovers and focused automation-slide priorities to preserve 60 minutes.

M1–M2 are nice-to-have and do not block approval. No research/content/brief/status/slide files were modified.

---

## Review Round 2 — 2026-10-05

## Presentation Review Summary

**Version 2 resolves all eight prior must-fix findings.** The presentation now supplies the missing newcomer definitions, preserves research uncertainty, distinguishes failed hook safeguards from execution permission, and specifies lifecycle-safe, time-boxed demos. No new Critical or Important defect was found.

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | One idea per slide | 4/5 | No material issues: slide 34 now teaches one automation choice with one command. Catalog density is mitigated. |
| 2 | Audience calibration | 4/5 | No material issues: context window and MCP are defined before substantive use (slides 2, 4). |
| 3 | Progressive learning flow | 4/5 | No material issues: the required map and CLI-first progression remain intact (slides 2–39). |
| 4 | Research fidelity and provenance | 4/5 | No material issues: billing, Auto and hook qualifications now match the applicable evidence (slides 18, 25, 46–48). |
| 5 | Coverage completeness | 4/5 | No material issues: prompt-injection and appendix network coverage are restored (slides 23, 44). |
| 6 | Examples, code, commands and demos | 4/5 | No material issues: exact full demo profiles, shell/path prerequisites and safe task navigation are specified. |
| 7 | Pacing and density | 4/5 | No material issues: 45 core minutes plus three five-minute demos; cutovers, saved outputs and transition reserves are explicit. |
| 8 | Visual variety and contracts | 4/5 | No material issues: the map legend is clarified and conceptual visuals retain hand-craft metadata. |
| 9 | Storytelling arc | 4/5 | No material issues: clear stakes, practical application and an actionable closing (slides 2, 38–39). |
| 10 | Progression and non-redundancy | 4/5 | No material issues: repeated concepts remain meaningful builds and callbacks, not deletion candidates. |
| | **Overall** | **40/50** | **APPROVED** |

### Edit Verification

Verification is against the revised artifact and cited research, not just the creator's handoff summary. All Round 1 must-fixes are accounted for:

| Finding | Status | Verified edit and evidence |
|---|---|---|
| **F1 — Billing caveat/status contradiction** | **✅ fixed** | Slide 47 visibly says “per-response vs per-session scope unresolved in the docs.” Slide 48 limits its unresolved status statement to Azure mechanisms, explicitly preserves user-level budgets **GA (2026-06-01)**, and adds R8 to Sources. Slide 49's status is similarly scoped. Consistent with the brief and R8 §§2.3, 5.3. |
| **F2 — Overgeneralized Auto behavior** | **✅ fixed** | Slide 18 notes restrict the documented override to `model` and mark ordered `models` behavior undocumented. Slide 46's visible row and notes preserve that scope, unknown override interactions and specialist exceptions. Slide 12 treats Auto as a possible cause, not proof, and checks `/usage`. Matches R1 §5.1. |
| **F3 — Hook timeout implies execution** | **✅ fixed** | Slides 23 and 25 now say a timed-out hook adds no decision and normal permission checks still apply. Slide 25 notes explicitly retain deny rules, another hook's deny and approval checks. Slide 41 uses the same distinction for policy hooks. Matches R4 §7.7. |
| **F4 — Missing newcomer definitions** | **✅ fixed** | Slide 2 defines context window visibly and in notes. Slide 4 adds a Model Context Protocol server row and explains external tools, local/remote transports and namespacing, with R3 added to Sources. Slides 18 and 20 connect these definitions to configuration. Matches R1 §2.4 and R3 §2.2. |
| **F5 — Enter may invoke excluded teleport** | **✅ fixed** | Slide 11 distinguishes task details from the undated subagent view. Demo 1 says “Don't press `Enter` on a subagent row”; demos 2 and 3 also specify list-only navigation. The undated capability is mentioned with a caveat but is no longer scripted for demonstration. Matches R1 §6.1 / R5 §3.5 and the brief's demo eligibility rule. |
| **F6 — Incomplete demo profile/path contract** | **✅ fixed** | Slide 18 is explicitly a display excerpt and now retains severity, data-not-instructions and no-MCP fallback lines. Slide 29 names the full R2 §12.1 reviewer and §12.2 implementer as the actual demo files, including scope/output/stop rules. `.github/hooks/scripts/pre-tool-policy.sh`, `cwd`, executable setup, `jq` and Bash prerequisites agree with R4 §7.8. |
| **F7 — Missing security coverage** | **✅ fixed** | Slide 23 defines prompt injection and notes identify repo/web/MCP channels, mitigations and inference boundaries. Slide 18/full demo profile restores the data-not-instructions instruction. Slide 44 adds network coverage distinguishing delegated cloud work from local subagents, routing, managed domain/sandbox controls and limitations. Matches R4 §10.1 and R7 §10. |
| **F8 — Unprotected pacing/automation overload** | **✅ fixed** | Slide 34 is now an “ad-hoc or reusable?” decision, one command, and an explicitly reference-only remainder. Demo 2 has a 3:00 hard cutoff with a pre-run summary/recording, no waiting for a second live review, a shortened hook demonstration and a transition reserve. Demo 3 has timed plan/fleet/review stages, a 2:40 fleet cutover, a completed alternate session, pre-delegated PR and 30-second wrap reserve. Demo 1 is also time-boxed. The counted 60-minute total is unchanged. |

**Prior Minor items:** M1's keyed status legend and live-row priorities are applied on slides 8 and 14. The required seven-row inventories remain; residual compactness is waived as nice-to-have. M2 is **✅ fixed**: slide 3 now uses comparison questions and expressly says the cards are in talk order, not plotted on axes.

### Scope and mechanical recheck

- Re-read the brief and the entire version 2 presentation, including outline, bodies, notes, Sources and metadata. Reopened all nine declared research files at relevant evidence sections and read the prior review. Enumerated the research set and matching review path.
- Frontmatter remains valid: exact audience and integer duration match the brief; `version: 2`, `created: 2026-10-05` and `revised: 2026-10-05` are coherent. Topic/slug, emphasis, de-emphasis and structural preferences remain aligned.
- All nine declared source files exist and match the discovered research set and mode-all allowlist. All slide sources are listed; the added R3 citation on slide 4 and R8 citation on slide 48 close the changed claims' provenance.
- Confirmed 49 slides, 49 speaker-note markers and 49 Sources lines. Numbering, outline sections and metadata agree. Timing remains 45 core minutes plus three five-minute demos; slides 40–49 remain non-counted after slide 39.
- The caller's lint PASS and timing checks are consistent with the content review. No banned-term, material scope, excluded editor/framework, separate audience-break or Q&A-segment violation was found.
- No image-placeholder contract applies. Conceptual diagrams retain `Visual: hand-craft`; ordinary code is not mislabeled. No four-same-type or five-dense-text uninterrupted run was introduced.

## Detailed Findings

### 1. One idea per slide — 4/5

**No material issues.** Slide 34 now compares one-off and repeatable automation rather than presenting multiple independent technical threads. Slides 8 and 14 remain reference catalogs, with a compact status legend and explicit live priorities; this meets the requested inventory without demanding that every row be explained in detail. Residual catalog compactness is the waived M1 polish item, not a split/delete requirement.

### 2. Audience calibration — 4/5

**No material issues.** Slides 2 and 4 supply the two missing foundational definitions. Slides 4–6 explain definition versus execution, the tool loop and inheritance before the configuration examples. Notes retain depth without requiring beginners to memorize model IDs or default limits. The MCP refresher on slide 20 is short and connects directly to the layers being configured.

### 3. Progressive learning flow — 4/5

**No material issues.** The required seven-way map remains on slide 3. Foundations lead into built-ins, custom specialists, configuration, controls and then parallel/delegated workflows. The security addition is placed in the existing control taxonomy, not a new detour. Beyond-CLI material remains late and light; the appendix follows the close.

### 4. Research fidelity and provenance — 4/5

**No material issues.** The minimum remains ten spot-checks for 49 slides. The following sixteen checks cover all nine research areas and include revised visible content and note-only claims. These are checks against supplied approved research, not execution or a new live-web audit.

| # | Slide(s) | Claim checked | Research evidence / result |
|---|---|---|---|
| 1 | 2 | Context window contents and compaction rationale | R1 §2.4: consistent with the bounded working-context explanation. |
| 2 | 4, 20 | MCP server/tool relationship and local/remote transports | R3 §2.2: matches; added provenance on slide 4 is present. |
| 3 | 8–10 | Built-in status labels and model/effort resolution | Brief verified facts; R1 §§3, 5.1: preserved; no new standalone GA badge for announcement-only features. |
| 4 | 11–12 | `/tasks` Enter behavior and lowercase controls | R1 §6.1 / R5 §3.5: accurate caveat; no subagent Enter action in the demo. |
| 5 | 18, 46 | Auto overrides only the verified `model` field; other effects unresolved | R1 §5.1: now matches throughout; `models` behavior is no longer asserted. |
| 6 | 18, 29 | Reviewer severity, scope, fallback and stop contract | R2 §§12.1–12.2: full profiles are explicitly the demo prerequisites; excerpt is disclosed. |
| 7 | 20 | MCP session/plugin/workspace/user precedence | R3 §6.2: matches the brief; agent-level ranking remains unclaimed. |
| 8 | 23 | Prompt-injection channels and mitigations | R4 §§4.5, 10.1: supported; automation mapping is labeled inference rather than product guarantee. |
| 9 | 24–25, 41 | Deny evaluation, hook aggregation and timeout fallback | R4 §§7.6–7.7: matches; failed hook safeguard is distinct from permission to execute. |
| 10 | 26, 29 | Hook JSON, matcher, resolved script path and prerequisites | R4 §7.8: matches the adapted example and Bash prerequisite. |
| 11 | 30–31 | Fleet dependency waves and shared filesystem risk | R5 §3: preserved; no locking guarantee invented and no uncaveated current concurrency number shown. |
| 12 | 34 | Headless fleet form versus process-defined workflow | R5 §§2.1, 6.2, 6.4: documented form retained; dynamic workflow remains public preview. |
| 13 | 36–37 | App/cloud/code review/Agent HQ/Agentic Workflows lifecycle | R6 §1: matches the brief's dates and limited breadth. |
| 14 | 44 | Cloud firewall scope, subscription routing and local egress controls | R7 §10: added coverage matches, including MCP/setup-process and proxy limitations. |
| 15 | 45–47 | Plan prices/allowances, credit arithmetic, Auto discount and budget scopes | R8 §§1, 4.1–4.3, 5.3: figures match; CLI scope uncertainty is now visible. |
| 16 | 48–49 | Azure roles/eligibility/cadence/alert-only budgets; user-budget GA exception | R9 §1 and R8 §1/§2.3: Azure claims remain supported and the lifecycle contradiction is removed. |

Known documentation conflicts are deliberately not “resolved” by choosing a convenient number: nesting/concurrency applicability, interactive credit-cap scope, certain Auto interactions and cross-surface key behavior remain caveated.

### 5. Coverage completeness — 4/5

**No material issues.** Prompt-injection coverage is restored on slide 23 and in the reviewer, and network controls are restored in slide 44's visible bullet and appendix notes. The nine source areas retain proportionate treatment. Two beyond-CLI slides and one brief Agent HQ mention respect de-emphasis; pricing and enterprise detail remain non-counted reference material.

### 6. Examples, code, commands and demos — 4/5

**No material issues.** The display-versus-prepared-file distinction is now explicit. Demo 2's full profile supplies the severity levels and fallback the coordinator consumes; hook paths and Bash/`jq` setup are consistent. All three demos keep visible content to title/badge/subtitle and place prerequisites, steps, expected results, recovery, timing and transition in notes. Teleport navigation and other expressly undated features remain outside the scripted demo paths. Examples were reviewed statically, not run.

### 7. Pacing and density — 4/5

**No material issues.** Core pacing remains **45 / 36 = 1.25 minutes per core slide**. Elapsed-time stages, saved outputs and transition reserves now protect the three five-minute demo slots. Slide 34 has a one-minute live explanation and explicitly separates reference depth. These changes satisfy the prior content-level timing finding; actual model latency and fixture behavior still require the specified rehearsal, not another content revision.

### 8. Visual variety and contracts — 4/5

**No material issues.** The map now distinguishes agenda order from comparison dimensions. Diagrams, tables, code, comparisons, a quotation, demos and the final decision tree remain varied. Hand-craft contracts and stable conceptual layouts are intact (slides 2–3, 5, 10, 15, 17, 20, 23, 28, 30, 37–38, 48).

### 9. Storytelling arc — 4/5

**No material issues.** Slide 2 establishes benefits and costs; the middle converts them into configured, constrained workflows. Slides 38–39 resolve that value proposition with a pattern choice and first-week actions. The appendix is clearly reference material rather than an alternative ending.

### 10. Progression and non-redundancy — 4/5

**No material issues.** The prior concept-cluster analysis still holds. The new definition/refresher and threat/mitigation passages have distinct teaching roles; they are not fully redundant slides. Built-in catalog → reviewer comparison → workflow command summary and tool boundary → permission/hook controls → external merge gate remain meaningful progression. No delete or material merge candidate was found.

## Issues Summary

**Unresolved Critical findings: 0. Unresolved Important findings: 0. New must-fix findings: 0.**

| # | Severity | Slide(s) | Issue | Evidence | Required Fix |
|---|---|---|---|---|---|
| F1–F8 | Resolved | As verified above | All prior must-fixes closed | Revised text, demo paths and cited research checked individually in Edit Verification | None. |
| M1 | 🟢 Minor — mitigated/waived | 8, 14 | Required catalogs remain compact | Keyed lifecycle legend and live-row priorities are present; seven-row inventory is intentional | None required. Nice-to-have: check rendered legibility during rehearsal. |
| M2 | Resolved | 3 | Prior axis ambiguity closed | “Cards are in talk order, not plotted on an axis” and question-style legend | None. |

## Suggested Improvements (Prioritized)

1. **Delivery preparation, not a content gate:** rehearse the exact prepared profiles, Bash hook and demo fixtures; prepare the recordings/completed sessions already specified in notes.
2. **Follow the written cutovers:** move to saved outputs rather than waiting for a second review, fleet completion or a new cloud PR.
3. **Nice-to-have, waived M1:** check catalog and code-excerpt legibility at presentation size. Do not remove required agents or extend the counted duration merely for row-count polish.

No additional must-fix content revision is requested.

## Verdict: APPROVED

**Version 2 is approved at 40/50.** All prior Critical/Important findings F1–F8 are verified fixed; frontmatter and source contracts are valid; exact duration, lifecycle rules, scope and required structure remain satisfied. Research Fidelity and Progression/Non-Redundancy both score 4/5.

**Blockers: none.** Residual M1 catalog compactness is waived as nice-to-have; M2 is fixed. This approves presentation content, not unexecuted live-demo behavior or rendered slides. Only this review file was modified.
