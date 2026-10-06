---
reviewer: web-research-reviewer
subject: "Copilot plans, licensing and pricing (appendix)"
companion: web-researcher
date: 2026-10-05
required_mcp: WebIQ-MCP
mcp_status: verified
verdict: APPROVED
---

## Review Round 1 - 2026-10-05

Reviewed the complete R8 report against the binding brief, the supplied passing mechanical lint, and the relevant billing, allowance, budget, and seat passages in approved R9. The report was not modified. Prices and model names were checked against retrieved official content, not assumed from prior knowledge.

**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

Both tools were available. An independent `web` query checked the Max/Pro allowance and pricing claims. The initial plans-page `browse` request encountered a temporary server error; the single retry used the authoritative June 1 billing announcement and returned meaningful content. Subsequent sequential Web IQ reads validated the CLI reference, product pricing page, and community issue. Routine validation used `web_fetch`, including pagination of large sources.

**Summary:** The current list prices, credit allowances, token rates, legacy multipliers, and worked arithmetic check out. No fabricated sources or quotations were found. Three important corrections remain: disclose conflicting depth limits and qualify concurrency figures where they are summarized; reconcile Auto with explicit cheaper-subagent model advice; and state the conditions under which the quoted $12,600 example is actually a spending ceiling.

## Reference Validation

**38 of 38 listed cited URLs checked**, with meaningful content returned for every source. This is URL/content and claim-section validation, not an assertion that every line of every large page was examined. Source numbers below refer to R8's reference list. Three internal linked reports are excluded from the external-source denominator.

| Ref. | Cited source | Outcome |
|---|---|---|
| 1 | [Individual billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) | Validated prices, base/flex totals, credit conversion, reset, Auto discount, and quoted agentic-cost text. |
| 2 | [Organization/enterprise billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) | Validated pooling, allowances, reset, paid-usage default, and CLI 1.0.48 recommendation. |
| 3 | [Budgets](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) | Validated precedence, hard-stop checkbox default, cost-center arithmetic, and license-fees-plus-metered-budget example. The ceiling needs explicit conditions; see F3. |
| 4 | [Plans](https://docs.github.com/en/copilot/get-started/plans) | Validated monthly prices, allowances, all-plan CLI access, Free/Student model restrictions, relevant agent rows, and the Spark Pro+/Max inconsistency. |
| 5 | [Licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses) | Validated assigned-seat wording, monthly prices, deduplication, and Enterprise pricing caveat. |
| 6 | [Models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) | All seven selected rate rows, long-context example, promotional end date, and code-review double metering validated. |
| 7 | [Legacy multipliers](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/model-multipliers-for-annual-plans) | All five cited multiplier examples and legacy-only applicability validated. |
| 8 | [Legacy transition](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/what-changed-with-billing) | Validated annual-plan continuation, downgrade, refund, and conversion options. |
| 9 | [Billing reference index](https://docs.github.com/en/copilot/reference/copilot-billing) | Authentic index; expressly identified as a seed/index, not substantive pricing evidence. |
| 10 | [Seat assignment](https://docs.github.com/en/copilot/reference/copilot-billing/seat-assignment) | Validated seat definition, automatic personal-plan cancellation/refund, and multi-org treatment. |
| 11 | [License changes](https://docs.github.com/en/copilot/reference/copilot-billing/license-changes) | Validated proration, revocation, end-of-cycle removal, and upfront card/PayPal payments. |
| 12 | [Billing cycle](https://docs.github.com/en/copilot/reference/copilot-billing/billing-cycle) | Validated UTC and assigned-seat measurement. |
| 13 | [/fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet) | Exact cost quotation and low-cost-default wording found. The source says usage *may* increase. |
| 14 | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Auth, `/usage`, response-limit wording, subagent table, Auto inheritance, and settings JSON validated. Depth conflicts with source 37; see F1. |
| 15 | [Session-limit how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) | Validated preview, soft cap, 30-credit minimum, commands, and whole-session wording. |
| 16 | [Usage optimization](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage) | Validated cheaper-subagent advice, Auto discount, caching, and budgets-versus-session-limits caveat. Advice needs compatibility qualification; see F2. |
| 17 | [Usage monitoring](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-ai-usage) | Relevant individual/team dashboard and usage-report passages validated. |
| 18 | [Budget-controls tutorial](https://docs.github.com/en/copilot/tutorials/budgets/getting-started-with-budget-controls) | Validated setup sequence, above-seat-value guidance, and always-enable-stop warning. |
| 19 | [Budget setup](https://docs.github.com/en/billing/how-tos/set-up-budgets) | Validated budget types, 75/90/100% alerts, 90/100% included-usage alerts, and quoted non-stop warning. |
| 20 | [CLI in Actions concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions) | Validated organization/personal/PAT billing attribution and bypass of user-level budgets for org-billed runs. |
| 21 | [CLI in Actions how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions) | Workflow, checkout v6, permissions, install/auth, and tool-allow pattern validated. |
| 22 | [Sandbox billing](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes) | All three meter prices, preview notice, expired $10 entitlement, and separate-budget requirement validated. |
| 23 | [Product pricing](https://github.com/features/copilot/plans) | `web_fetch` returned only a title; Web IQ returned substantive pricing/allowance content. Dollar values and 4.6x/13.3x wording validated. |
| 24 | [April billing announcement](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) | Transition, unchanged prices, annual exception, expired $30/$70 promotion, and quotations validated. |
| 25 | [May flex/Max announcement](https://github.blog/news-insights/company-news/github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/) | Base/flex dollar amounts, June 1 effective date, and variability validated. |
| 26 | [CLI GA announcement](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) | GA date, administrator enablement, and listed paid plans validated; the page also has an “all subscribers” editorial correction. |
| 27 | [April individual-plan changes](https://github.blog/changelog/2026-04-20-changes-to-github-copilot-plans-for-individuals/) | Sign-up pause, tighter limits, and Opus removal validated. |
| 28 | [June billing release](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/) | Web IQ validated live transition, user-level-budget GA, Max upgrade availability, and code-review Actions charges. |
| 29 | [Sign-ups reopening](https://github.blog/changelog/2026-06-17-copilot-individual-plan-sign-ups-are-reopening/) | Gradual reopening and immediate continuation/upgrade behavior validated. |
| 30 | [Cost-center per-user budgets](https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers/) | Date, precedence, and API-only-at-release qualification validated. |
| 31 | [CLI/SDK session limits](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) | Public preview, CLI 1.0.66+, SDK 1.0.5+, soft behavior, and exact quote validated. |
| 32 | [Cost-center pools](https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps/) | API launch, automatic cap, and block/overage choice validated. |
| 33 | [Actions token support](https://github.blog/changelog/2026-07-02-copilot-cli-no-longer-needs-a-personal-access-token-in-github-actions/) | Policy default, token permission, org attribution, and cost controls validated. |
| 34 | [Pool UI](https://github.blog/changelog/2026-07-20-ai-credit-pools-for-cost-centers-in-the-billing-ui/) | Dated UI availability validated. |
| 35 | [Token usage reports](https://github.blog/changelog/2026-08-11-per-model-token-breakdown-in-the-usage-report/) | Date, token categories, and audiences validated. |
| 36 | [August policies/billing announcement](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/) | September reopening, October upfront payments, and September 28 Balanced default validated. |
| 37 | [Official CLI changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) | Relevant 1.0.66, 1.0.67, 1.0.71, and 1.0.85 entries read. Conflicting 4/128 depth evidence found; see F1. |
| 38 | [Community issue #4940](https://github.com/github/copilot-cli/issues/4940) | `web_fetch` returned an error shell; Web IQ returned the issue. September 22 date, Free/BYOK/runtime 1.0.81, cap 2, and triage status validated. Not official confirmation. |

No checked citation is classified as fabricated, misattributed, or still unavailable after the relevant readers.

## Claim Citation Coverage

Substantive pricing, usage, licensing, and security-sensitive Actions claims have nearby primary-source citations. Examples have visible provenance. Azure details are appropriately delegated to R9 rather than expanded into a competing appendix.

**Numerical audit:** Every substantive price, allowance, rate, multiplier, cap, version, percentage, date, and worked quantity appearing in R8 was checked against the relevant source or independently recalculated. The material exceptions concern conflicting limit evidence and the conditions of a financial ceiling, not invented arithmetic.

| Numerical group | Verified result |
|---|---|
| Credit unit and monthly plans | $0.01/credit; Free/Student $0; Pro $10; Pro+ $39; Max $100; Business $19/seat; Enterprise $39/seat. |
| Individual allowances | Pro 1,000 + 500 = 1,500; Pro+ 3,900 + 3,100 = 7,000; Max 10,000 + 10,000 = 20,000. Flex remains variable. |
| Team allowances and examples | 1,900/3,900; 100 × 1,900 = 190,000; 10 × 1,900 + 5 × 3,900 = 38,500. |
| Product-page values | $15/$70/$200; 7,000/1,500 ≈ 4.67; 20,000/1,500 ≈ 13.33. “Over 4.6x” and “Over 13.3x” match. |
| Selected model rates | All input, cached-input, cache-write, and output cells in §4.1 match the live table. GPT-5.5's >272K $10/$45 example and December 31 Gemini promotion date match. |
| Worked turns and fleet | $0.018/1.8 credits; $0.060/6; $0.120/12; $0.300/30. Four agents × ten turns × twelve credits = 480/$4.80, 32% of 1,500; corresponding GPT-5 mini total = 72. Hypothetical token counts are explicitly synthesized. |
| Legacy multipliers | Opus 4.8: 27; GPT-5.5: 57; Sonnet 4.6: 9; GPT-5 mini: 0.33; code review: 13. Legacy annual plans only. |
| Operational figures | Auto discount 10%; Free completions 2,000; 30-credit minimum; 75/90/100% budget and 90/100% included-usage alerts; UTC calendar-month reset. |
| Limits and versions | Documented concurrency 2/4/4/8/16/32 plus separate usage-based row 32 confirmed. Depth 6/256 conflicts with dated 4/128 evidence. CLI/SDK release requirements and the 1.0.67 minimum change confirmed. Sample values 200, 50, 16, and 10 are illustrative settings, not published prices. |
| Other billing | Sandbox $0.000024/second, $0.000003/GiB-second, $0.005/GiB-month; $10 preview entitlement through July. June–August $30/$70 team promotion is historical. |
| Claimed maximum bill | 400 × $19 = $7,600; $7,600 + $5,000 = $12,600. Arithmetic passes; unconditional-ceiling interpretation does not. See F3. |

## Quote Verification

**19 of 19 attributed standalone block quotations verified against their cited sources**, normalizing Markdown emphasis and code formatting. Inline source fragments were additionally spot-checked; they are not represented as an exhaustive inline-quotation census. No displayed quote required a corrected source URL.

| Source | Block quotations checked | Outcome |
|---|---:|---|
| Ref. 28, June billing release | 1 | “As of June 1…” present. |
| Ref. 24, April announcement | 2 | PRU replacement and annual-plan exception present. |
| Ref. 4, plans | 1 | “All plans include…” present. |
| Ref. 1, individual billing | 3 | Free/Student allowance, agentic features, and 10% Auto discount present. |
| Ref. 7, legacy multipliers | 1 | No new-model/new-feature access statement present. |
| Ref. 13, fleet | 1 | Complete independent-calls/cost-increase passage present. |
| Ref. 14, CLI reference | 1 | Session-tree concurrency/rejection passage present. |
| Ref. 16, optimization | 2 | Cheaper-subagent and soft-limit-versus-budget passages present. |
| Ref. 19, budget setup | 1 | Alert-only warning present. |
| Ref. 2, team billing | 1 | Enabled-by-default paid-usage note present. |
| Ref. 3, budgets | 1 | Hard-stop scope/default passage present. The quote starts mid-sentence; the report supplies its subject immediately before it. |
| Ref. 18, budget tutorial | 1 | Above-per-license-value sentence present. |
| Ref. 31, session-limit release | 1 | Whole-session/subagents/compaction passage present. |
| Ref. 15, session-limit how-to | 1 | Soft overshoot passage present. |
| Ref. 36, upfront billing | 1 | October 1 card/PayPal sentence present. |

## Source Authority Compliance

Core claims rely on official documentation, GitHub's product page, dated announcements, and the official CLI changelog. Issue #4940 is correctly labeled community-filed, unconfirmed corroboration; hosting in an official repository is not treated as GitHub endorsement. No unsupported dependence on third-party pricing guides was found.

## Conflict & Uncertainty Disclosure

The report handles several real conflicts well: session versus response limits, the separate usage-based concurrency row, default subagent-model wording, Spark availability, and annual-pricing inference. However, these qualifications do not consistently survive into the summary and practical advice.

### F1 — 🟡 Important: conflicting depth limits omitted; numeric defaults need nearby qualifications

- **Location:** §1 takeaway 4; §3.1 concurrency column; §4.2 paragraph after the limits table; §7.3 clamping paragraph; §9 conflict list.
- **Issue:** §4.2 states default depth **6**, maximum **256**, and §7.3 repeats the **256** clamp without acknowledging contrary dated release evidence. The summary/table also present plan concurrency as actual current defaults even though the body expressly says the separate “Usage-based billing | 32” row makes applicability unresolved.
- **Verification evidence:** The [live command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#subagent-limits) lists **6/256** and both concurrency schemes. The [official changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md), **CLI 1.0.71, 2026-07-16**, says the default nesting depth was lowered **from 6 to 4**, with adjustable depth **up to 128**. Both sources are authentic; this audit does not establish which values the current runtime enforces.
- **Why it matters:** Nesting and concurrency affect runaway delegation, demo reproducibility, and spend estimates. A copied appendix table must not hide unresolved applicability behind a distant limitations section.
- **Concrete correction:** Record the **6/256 versus 4/128** conflict alongside the other limitations; attribute each figure to its source/version and do not assert either as a verified current runtime limit without reconciling evidence. Add a short qualification to takeaway 4 and the plan-table concurrency header/footnote: these are **documented plan rows, with current usage-based applicability unresolved**. Leave hypothetical four-agent arithmetic intact, but identify four as the example's assumption rather than a guaranteed Pro runtime cap.

### F2 — 🟡 Important: Auto and explicit cheaper-subagent model advice are presented as compatible without qualification

- **Location:** §1 takeaway 5; §4.2 final recommendation; §7.5 item 1.
- **Issue:** The practical advice combines stronger planning, cheaper explicitly selected workers, and Auto's 10% discount. It does not tell readers that the cited reference says Auto can defeat the authored subagent `model` selection. §4.2 quotes the exception, then still recommends setting subagent models explicitly “for cost purposes” without limiting that remedy.
- **Verification evidence:** In the [CLI reference's custom-agent `model` row](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#custom-agent-frontmatter-fields), an Auto session makes subagents inherit the resolved session model **regardless of this field**. The [optimization tutorial](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage) recommends cheaper workers and separately confirms the 10% discount.
- **Why it matters:** A practitioner can believe a worker is using a cheaper configured model when the session instead supplies a more expensive model. The error concerns usable cost guidance, not the verified 10% number.
- **Concrete correction:** Present these as qualified strategies: explicit cheaper-worker configuration in a compatible non-Auto setup, versus Auto routing with its documented inheritance behavior and discount. Put the caveat next to the summary/best-practice recommendation and advise inspecting actual model/usage reporting. Do not promise that a custom-agent `model` field controls worker cost under Auto.

## Source Freshness & Currency

Official documentation retrieved on 2026-10-05 supports the current price/allowance table and all selected token prices. Historical prices/promotions are identified as historical, and the variable flex allowance is date-qualified. Annual multipliers are clearly segregated as legacy.

CLI 1.0.66/1.0.67 and 1.0.85 attribution was checked against actual changelog headings. The omitted 1.0.71 depth change is the substantive currency/conflict gap captured in F1.

October 1 upfront seat payment is supported by the August announcement and current license-change documentation. The report preserves the card/PayPal qualifier. The licenses page's end-of-cycle measurement wording should not be read as negating upfront collection for those payment methods.

## Topic Coverage Assessment

R8 appropriately covers plan inclusion, licensing, AI-credit transition, per-model charging, multi-agent amplification, pay-as-you-go, budgets, session controls, and Actions attribution. Adding Max and Student is appropriate current completeness, not scope drift beyond the brief's older named-plan list.

Azure remains cross-reference-only. R9's **1,900/3,900**, **$0.01**, UTC reset, assigned-seat caution, and Azure-versus-GitHub budget distinction are consistent with R8. R8 has dated user-level-budget GA evidence that R9 did not establish; that is additional evidence, not grounds to badge every budget type GA.

The main appendix plan table is useful for the audience. The selected token-rate example is clearly an illustration, not a fixed “cost per subagent” guarantee.

## Research Limitations Review

Generally candid and substantive: unknown Free/Student quantities, annual-plan inference, variable flex, negotiated enterprise prices, unavailable runtime confirmation, local review versus hosted-review billing, and Azure ownership are disclosed.

F1 requires adding the depth-limit conflict. F2 requires carrying the existing Auto exception into actionable advice. No new Azure investigation or editor/framework coverage is required.

## Code & CLI Validation

**Four of four examples inspected by reading only; no commands or workflows executed.**

- §7.1: Commands match the session-limit how-to; 200 exceeds the documented minimum. Attribution inside and immediately after the fence is present.
- §7.2: Bash syntax, failure handling, CLI update, and fine-grained-PAT/login alternatives are coherent. The source supports the allow-tool pattern and flag. The report correctly does not invent a limit-reached exit code. It assumes an installed CLI and a Git repository containing `HEAD`.
- §7.3: The JSON payload matches the official reference's example, with the attribution comment clearly excluded from the settings file. The **16/10** example remains within either published range; only the explanatory **256** ceiling needs F1's uncertainty treatment.
- §7.4: Workflow matches the current official example, with the identified addition of a 50-credit cap. Checkout **v6**, fetch depth **2**, `contents: read`, `copilot-requests: write`, npm installation, and built-in token attribution are sourced. The report appropriately notes direct-run risks and GitHub's Agentic Workflows recommendation.

All fences have visible provenance inside and immediately after them. No imports are relevant to these CLI/config/workflow examples; no unresolved runnable placeholder was found.

## Reference List Integrity

The numbered external list contains **38 entries**, matching the header's **22 + 1 + 2 + 11 + 2** category totals. Four code samples and three linked internal cross-references are separately indexed, not double-counted as external sources.

Body evidence links are represented in the reference list. The billing-settings URL is a destination, not an omitted evidence source. No orphaned evidence reference was identified; the billing index is expressly discussed as a seed in the access notes. Community authorship of issue #4940 is sufficiently visible.

## Report Structure & Readability

Required date, researcher, slug, source-count, and MCP fields are present. The MCP marker has the required syntax and names `web` and `browse`; the additional researcher-reported `news` tool does not invalidate that marker. The ten-item Table of Contents matches the report sections. Scope/exclusion notes do not violate the brief.

### F3 — 🟡 Important: the $12,600 “maximum bill” example lacks the conditions that make it a ceiling

- **Location:** §3.3 “Maximum bill” bullet; related §7.6 enterprise-budget pitfall.
- **Issue:** The report quotes **$7,600 licenses + $5,000 enterprise budget = $12,600 maximum bill** without a local enforcement qualifier. Elsewhere it correctly says the stop checkbox is off by default and cost centers can be excluded from the enterprise budget. As written, the isolated example can imply that setting a $5,000 budget always caps charges.
- **Verification evidence:** The [budgets page](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) contains the arithmetic, but also explicitly says charges continue without a cap when **Stop usage when budget limit is reached** is off. Its **Cost center exclusion** section says excluded metered charges neither count against nor stop at the enterprise budget. The [setup tutorial](https://docs.github.com/en/copilot/tutorials/budgets/getting-started-with-budget-controls) repeats that spending limits are otherwise alerts only.
- **Why it matters:** This is high-stakes financial guidance likely to be copied into an appendix slide. Correct arithmetic is not sufficient to establish a hard maximum.
- **Concrete correction:** Keep the number but state immediately that **$12,600 is the illustrative Copilot license-plus-metered ceiling only with hard-stop enforcement enabled, fixed stated seat fees, and no additional excluded cost-center overage**. Otherwise call it license fees plus the budget amount, not a guaranteed maximum. Maintain the separate sandbox-budget warning; do not imply that the example caps other GitHub products.

**M1 — 🟢 Minor:** §1 takeaway 4's heading says subagents and `/fleet` “cost more,” while the exact official quote says they **may** consume more credits. Soften the heading to “can increase usage.” The body already gives the correct qualification, so this is non-blocking.

## Suggested Improvements (Prioritized)

1. **F1 — 🟡 Important:** Expose the depth-source conflict and qualify concurrency wherever the table/summary could be reused independently.
2. **F2 — 🟡 Important:** Correct the Auto-versus-explicit-worker-model cost recommendation.
3. **F3 — 🟡 Important:** Add the hard-stop and excluded-cost-center assumptions to the $12,600 example.
4. **M1 — 🟢 Minor:** Replace the categorical fleet-cost heading with conditional wording.

No additional research-report restructuring, Azure expansion, new demos, or unrelated stylistic changes are requested.

## Readiness Verdict: NEEDS REWORK

**Remaining must-fix blockers:**

- **F1 — 🟡 Important:** Undisclosed conflicting depth limits and insufficiently qualified plan-concurrency summaries.
- **F2 — 🟡 Important:** Cost advice does not reconcile Auto inheritance with explicitly cheaper subagent models.
- **F3 — 🟡 Important:** Financial ceiling example omits hard-stop and excluded-cost-center conditions.

No critical fabricated-evidence or wrong-price finding remains. The current list prices, allowances, selected rates, legacy multipliers, and illustrative arithmetic are independently supported. M1 is non-blocking and waived as an approval blocker.

The report is ready for caller-managed revision. Re-review should verify these three bounded corrections without expanding R8's scope.

## Review Round 2 - 2026-10-05

Re-read the complete revised report and Round 1, retaining the original brief and passing mechanical lint as binding context. Checked the revised financial-ceiling discussion against approved R9 §5.1. Only this review file was modified; the first-review date and Round 1 record are preserved.

**Required MCP:** verified - WebIQ-MCP; tools used: web, browse

Both required tools were available. A new independent `web` query investigated the CLI reference's Auto/model-inheritance claim. `browse` returned meaningful content from the critical organization/enterprise budgets URL, including enforcement defaults and cost-center exclusion. Web IQ calls were sequential; no retry was needed this round. The precise Auto and limit passages were additionally checked through paginated `web_fetch`.

### Fix Verification

| Prior finding | Status | Verification and disposition |
|---|---|---|
| **F1 — 🟡 Important: conflicting depth limits and unqualified concurrency** | **✅ fixed** | §1 takeaway 4, §3.1's concurrency header and source note, §4.2, §7.3, and §9 now identify documented rows rather than guaranteed current runtime caps. The depth table attributes **6/256** to the command reference and **4/128** to **CLI 1.0.71, 2026-07-16**; both were independently re-read. The reference's own environment-variable rows also confirm **4, range 1–128**, and **32, range 1–256**. These additional discrepancies are disclosed, not treated as proven effective settings. §4.3 explicitly assumes four parallel workers. Demo-machine confirmation is recommended without claiming it has occurred. No must-fix remains. |
| **F2 — 🟡 Important: Auto versus explicit cheaper-worker model advice** | **✅ fixed** | §1 takeaway 5, §4.2, §5.3, and §7.5 now separate non-Auto explicit-worker configuration from Auto's resolved session model and **10%** discount. The live CLI `model` row still states the Auto exception “regardless of this field.” The revision warns against assuming the configured worker model ran, recommends `/usage`/AI usage reporting, and identifies other override interactions as undocumented. The earlier combined recipe is removed. |
| **F3 — 🟡 Important: conditions for the $12,600 ceiling** | **✅ fixed** | §3.3 immediately conditions the ceiling on **Stop usage** being enabled, no excluded cost centers, and the stated fixed seat fees. It explains the off-by-default setting, excluded overage, seat additions, and separate Actions/sandbox meters. §7.6 repeats the enforcement conditions. Web IQ independently confirmed the budget/exclusion passages; current license-change docs confirm proration. This matches R9 §5.1. Arithmetic remains **400 × $19 = $7,600; + $5,000 = $12,600**. |
| **M1 — 🟢 Minor: categorical fleet-cost wording** | **✅ fixed** | The summary now says “can increase usage,” and §4.2 says parallel work “can cost more,” matching the official source's conditional wording. |

## Reference Validation

**14 of 38 cited external URLs rechecked in Round 2.** All returned meaningful content. Round 1's wider **38/38** audit remains recorded above; it is not represented as a second complete fetch of the source list. Rechecks prioritized every prior blocker and the current pricing/rate tables.

| R8 reference | Source rechecked | Outcome this round |
|---|---|---|
| 1 | [Individual billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) | Prices, base/flex allowances, $0.01 conversion, reset, discount, and quotes match. |
| 2 | [Organization/enterprise billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) | 1,900/3,900 allowances, pooling, reset, and default paid usage match. |
| 3 | [Budgets](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) | Web IQ validated conditional hard stops, exclusion, and the quoted arithmetic; F3 correction supported. |
| 4 | [Plans](https://docs.github.com/en/copilot/get-started/plans) | All monthly prices and individual base/flex totals match; all-plan CLI statement present. |
| 6 | [Models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) | Every cell in the report's seven selected rate rows, long-context example, and promotional end date matches. |
| 7 | [Legacy multipliers](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/model-multipliers-for-annual-plans) | All five examples and legacy-only qualification match. |
| 11 | [License changes](https://docs.github.com/en/copilot/reference/copilot-billing/license-changes) | Prorated additions and upfront card/PayPal payments support the revised ceiling assumptions. |
| 13 | [/fleet](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet) | Exact cost quotation and conditional wording match; M1 resolved. |
| 14 | [CLI reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Auto `model` exception, subagent limits, environment-variable ranges, and settings JSON match the attributed descriptions. |
| 15 | [Session-limit how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) | Public preview, soft overshoot, minimum 30, commands, and whole-session wording match. |
| 16 | [Optimization](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage) | Cheaper-worker advice, 10% discount, caching, and budget-versus-session-limit caveat match. |
| 22 | [Sandbox billing](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes) | Three meter prices, expired $10 entitlement, and separate budget scope match. |
| 36 | [August billing announcement](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/) | October 1 card/PayPal change, proration, and September 28 review default match. |
| 37 | [Official CLI changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) | 1.0.71 heading/date, 4/128 depth passage, and `/chronicle cost-tips` improvement entries validated. |

No new fabrication, misattribution, or load-bearing unavailable-source finding.

## Claim Citation Coverage

All three corrections have visible evidence and appropriately scoped explanations. The existing price, allowance, token-rate, legacy-multiplier, and sandbox-price figures remain supported by fresh official reads. Recalculation confirms the unchanged per-turn costs, **480 credits/$4.80**, **72 credits**, **38,500** cost-center example, and conditional **$12,600** illustration.

The newly quoted environment-variable ranges and dated 1.0.71 depth change are accurate source descriptions, not claims of confirmed runtime behavior. No material citation gap introduced.

## Quote Verification

**13 of the report's 19 standalone block quotations reverified this round**, with Markdown emphasis/code formatting normalized. All matched their cited pages:

| Checked source | Count | Outcome |
|---|---:|---|
| Individual billing | 3 | Free/Student allowance, agentic-feature cost, and Auto discount passages present. |
| Organization/enterprise billing | 1 | Paid-usage default passage present. |
| Budgets | 1 | Hard-stop scope/default excerpt present. |
| Plans | 1 | All-plan CLI/app sentence present. |
| Legacy multipliers | 1 | No-new-models/features statement present. |
| Fleet | 1 | Independent-calls/cost-increase passage present. |
| CLI reference | 1 | Session-tree concurrency and rejection passage present. |
| Optimization | 2 | Cheaper workers and session-limits-versus-budgets passages present. |
| Session-limit how-to | 1 | Soft overshoot passage present. |
| August billing announcement | 1 | October 1 card/PayPal sentence present. |

The remaining six unchanged block quotations retain Round 1's verification; they were not freshly fetched in Round 2. Separately checked the revision's inline depth-change quote, Auto inheritance excerpt, ceiling arithmetic, and exclusion wording: all found in the claimed sources. No quotation correction needed.

## Source Authority Compliance

No material issues. Core evidence remains primary. The Free/BYOK issue remains explicitly unconfirmed community corroboration; internal R1/R2 references supplement rather than replace the critical official evidence.

## Conflict & Uncertainty Disclosure

F1 and F2 are resolved through accurate disclosure, not by inventing a resolution to conflicting documentation. The summary and table now carry their own qualifications. Session-versus-response limits and Auto's undocumented override interactions remain candidly identified. No new must-fix.

## Source Freshness & Currency

Fresh 2026-10-05 reads support the current prices, credit allowances, selected rates, and the corrected interpretation of spending limits. Variable flex and expired promotions remain date-qualified; legacy annual multipliers remain segregated. The newly added 1.0.71 evidence addresses the earlier currency gap.

## Topic Coverage Assessment

No material issues. CLI-first pricing and licensing coverage stays in the appendix scope. Azure ownership remains R9's. The revised enforcement example now aligns with R9 §5.1, including cost-center exclusion, fixed seats, and other-meter exclusions.

## Research Limitations Review

No material issues. The depth/concurrency uncertainty and Auto exception are now explicit where needed, with concrete verification steps. The `/chronicle cost-tips` note correctly treats dated improvement evidence as proof of existence by 1.0.71, not proof that this was its introduction or a standalone GA declaration.

## Code & CLI Validation

**Four of four examples re-inspected by reading only; nothing executed.** Attribution and provenance remain inside and immediately after each fence. The **16/10** JSON example is valid within either documented range, and its surrounding explanation now marks the depth ceiling unresolved. Session limits remain soft/public preview; the scripted example does not invent an exit-code guarantee. No new code defect.

## Reference List Integrity

The external list still contains **38** entries and matches **22 + 1 + 2 + 11 + 2**. Four internal linked reports now match the updated header and index; R2 is the added cross-reference. Four code samples remain separately counted. No missing body citation or orphaned external reference identified.

**M2 — 🟢 Minor, waived:** Reference 37's annotation still names 1.0.66, 1.0.67, and 1.0.85 but omits the now load-bearing **1.0.71 (2026-07-16)** entry. The body supplies the correct version, date, quotation, and URL, all freshly verified, so traceability is intact. Optional correction: add 1.0.71 to that reference annotation for easier navigation. This is bibliographic polish, not a blocker.

## Report Structure & Readability

No material issues. Required header fields and MCP marker remain well formed; the Table of Contents matches the sections. The revised summary, table note, examples, practical advice, and limitations are consistent on the three fixed issues. Supplied mechanical lint passes.

## Suggested Improvements (Prioritized)

No required revisions.

- Optional **M2 — 🟢 Minor:** Add 1.0.71 and its date to reference 37's annotation.
- When preparing slides/demos, preserve the report's unresolved-limit and Auto caveats and its conditional financial ceiling. Do not turn a documented row into a runtime guarantee.

## Readiness Verdict: APPROVED

**Remaining must-fix findings: none.** F1, F2, and F3 are **✅ fixed**; M1 is also **✅ fixed**. No unresolved **🔴 Critical** or **🟡 Important** issue remains. The remaining **M2 — 🟢 Minor** bibliographic item is expressly waived.

The revised R8 report is ready for caller-managed use in the pricing/licensing appendix, with its stated uncertainties and financial conditions retained.
