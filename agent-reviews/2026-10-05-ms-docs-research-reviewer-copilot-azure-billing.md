---
reviewer: ms-docs-research-reviewer
subject: "GitHub Copilot billing through Azure"
companion: ms-docs-researcher
date: 2026-10-05
required_mcp: microsoft-learn
mcp_status: verified
verdict: APPROVED
---

## Review Round 1 - 2026-10-05

**Report:** `research/2026-10-05-copilot-azure-billing.md`  
**Binding context:** Complete `brief.md`, including Scope decisions, Review rubric, and R9 override; caller's mechanical lint and open-point list.  
**Method:** Read the complete report; independently searched live Microsoft Learn; fetched relevant Learn documents in full through the required MCP; retrieved official GitHub and Azure pricing sources. Supplementary HTML metadata checks confirmed the reported dated sources. Read code only; no commands, deployments, or authentication flows were executed. The report and binding context were not modified.

**Required MCP gate:** Passed. Documentation search and full-document fetch capabilities were available. Independent search for GitHub AI Credits/Azure pre-purchase billing returned relevant official evidence; the full-document fetch of [GitHub AI Credits pre-purchase guidance](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan) returned substantive prerequisites, scope, term, benefit precedence, and cancellation content.

## Reference Validation

**Checked 29 of 29 cited URLs**, covering references 1–29. The complete inventory contains **30 distinct listed URLs**; reference 30 is explicitly an unreachable, non-evidentiary consultation link and was not independently fetched this round. This exceeds the approximately ten-reference spot-check target because the report has numerous financial, permission, and quotation claims.

All 29 checked URLs returned meaningful content. Learn documentation and Q&A content were retrieved using full-document MCP fetch. Official GitHub and Azure pricing content was retrieved using `web_fetch`. Supplemental Learn HTML requests followed locale redirects and were used only to inspect date metadata, not as substitutes for required MCP validation.

| Report reference | Checked source | Outcome |
|---|---|---|
| 1 | [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase) | Valid; Copilot coverage, scope alignment, one-year term, illustrative discounts, precedence, and final purchases confirmed. |
| 2 | [GitHub AI Credits pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan) | Valid; AI credit coverage, GHAICCUs, purchase roles, renewal, and precedence confirmed. |
| 3 | [Microsoft Agent prepurchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/agent-pre-purchase) | Valid; GitHub appears in coverage; term, roles, regional caveat, and non-cancellation confirmed. |
| 4 | [Track MACC](https://learn.microsoft.com/azure/cost-management-billing/benefits/macc/track-consumption-commitment) | Valid; direct agreement/role conditions and treatment of Microsoft-provided credits confirmed; does not name GitHub. |
| 5 | [Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) | Valid; notify-only behavior, latency, roles, limits, currency, and filter caveat confirmed. |
| 6 | [Budget with Bicep](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep) | Valid; no-filter Bicep body matches; source deployment snippet has the Bash assignment defect identified by the researcher. |
| 7 | [Grant tenant-wide consent](https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent) | Valid; listed roles, Graph application-permission exception, custom-role qualification, and warning confirmed. |
| 8 | [Subscription and tenant IDs](https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id) | Valid; portal procedure and `az account list` tip confirmed. |
| 9 | [Subscriptions - Get](https://learn.microsoft.com/rest/api/resources/subscriptions/get) | Valid; API version `2022-12-01`, GET shape, and `subscriptionPolicies.quotaId` confirmed. |
| 10 | [Azure CLI REST guidance](https://learn.microsoft.com/cli/azure/use-azure-cli-rest-command?view=azure-cli-latest) | Valid; GET usage and logged-in credential authentication confirmed. |
| 11 | [Startup credits](https://learn.microsoft.com/startups/benefits/azure-credits/use-azure-credits) | Valid; eligible GitHub usage requires connection; Copilot billing-model qualification confirmed. UI wording differs as reported. |
| 12 | [Azure DevOps Copilot code review](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops) | Valid; limited preview, separate billing path, meter names/tags, and 48-hour delay confirmed. |
| 13 | [Microsoft Q&A conflict](https://learn.microsoft.com/answers/a/12897076) | Authentic community content; volunteer-moderator attribution and unmonitored tag confirmed. Not authoritative technical evidence. |
| 14 | [Copilot Azure billing](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing) | Valid; account types, active-seat wording, AI-credit overage, daily transmission, and invoice timing confirmed. |
| 15 | [Azure billing reference](https://docs.github.com/en/billing/reference/azure-billing) | Valid; payment channel, calendar periods, daily measurement, and mid-cycle split confirmed. |
| 16 | [Connect Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub) | Valid; GitHub owner, subscription owner, consent, UI steps, and disconnect behavior confirmed. |
| 17 | [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions) | Valid; SPV, conditional user-consent exception, EA requirement, and June 16 example confirmed. |
| 18 | [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription) | Valid; enterprise/cost-center mapping, fallback, internal IDs, SKU format, MACC, and trial warning confirmed. |
| 19 | [Connection troubleshooting](https://docs.github.com/en/billing/how-tos/troubleshooting/azure-sub-connection) | Valid; admin-approval and missing-payment-information symptoms confirmed. |
| 20 | [Supported payment methods](https://docs.github.com/en/billing/reference/supported-payment-methods) | Valid; personal-account exclusion and entire reproduced unsupported-quota table confirmed, including MS-AZR-0003P. |
| 21 | [Organization/enterprise usage billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) | Valid; credit conversion, 1,900/3,900 allotments, pooling/reset, CLI usage/version, and paid-usage default confirmed. |
| 22 | [Usage-based billing budgets](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) | Valid; budget types/defaults confirmed. Full page also documents cost-center exclusion, material to finding I1. |
| 23 | [Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses) | Valid; assigned-seat wording, plan account types, added-seat proration, and budget managers confirmed. |
| 24 | [Cost-center allocation](https://docs.github.com/en/billing/reference/cost-center-allocation) | Valid; direct-user priority and license/AI-credit allocation confirmed. |
| 25 | [Using cost centers](https://docs.github.com/en/billing/how-tos/products/use-cost-centers) | Valid; Azure ID validation, supported resources, and 1,000-center limit confirmed. |
| 26 | [Billing cycles](https://docs.github.com/en/billing/concepts/billing-cycles) | Valid; UTC periods, Azure-specific billing-date lookup, seat removal, and credit-card migration distinction confirmed. |
| 27 | [Usage-based billing announcement](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) | Valid; June 1, 2026 transition, unchanged Business/Enterprise prices, June–August promotion, and annual-personal-plan exception confirmed. Publication metadata: April 27, 2026. |
| 28 | [Azure GitHub pricing](https://azure.microsoft.com/en-us/pricing/details/githubenterprise/) | Valid narrative, including the report's seat/pool quotation. Numeric prices still render as `$-`; actual Azure price values remain unavailable. |
| 29 | [Bicep CLI parameters](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#parameters) | Valid; Bash JSON-array syntax confirmed by full fetch and independent code-sample search. Additional deployment prerequisites support I2. |

No fabricated or misattributed checked sources were found. The inaccessible community FAQ is peripheral and appropriately excluded from evidentiary claims.

## Claim Citation Coverage

Substantive billing, connection, eligibility, consent, invoice, cost-management, credit, and pre-purchase claims generally have immediate official citations. Derived CLI-overage and MACC guidance is visibly identified as synthesis rather than a quoted official procedure.

The R9 source hierarchy is appropriate: Learn anchors Azure cost management, consent roles, ARM APIs, startup credits, and reservation benefits; official GitHub documentation supplies GitHub-owned UI and acceptance/enforcement details. The brief expressly permits this secondary official source class. A raw source-count majority is not the test for primary-source suitability.

The cap example needs source conditions carried into the report's interpretation (I1). The pre-purchase timing wording merits a non-blocking clarification (M2).

## Quote Verification

**Verified 26 of 26 standalone source-attributed quotation blocks.** This denominator counts quotation blocks beginning with quoted source text, not the assignment note, code-provenance blocks, UI-label quotation marks, or repeated inline fragments. Source-attributed inline excerpts were also screened against the retrieved pages, including the four metering/cadence excerpts in section 4.1, troubleshooting messages, and the Q&A conflict.

| Quotation source (report reference) | Blocks checked | Report locations | Outcome |
|---|---:|---|---|
| Copilot Azure billing (14) | 1 | Executive Summary | Wording found at cited URL. |
| Azure billing reference (15) | 2 | 2.1 | Both passages found. |
| Azure subscription payments (17) | 3 | 2.2, 3.1, 3.6 | EA, SPV, and timing passages found. |
| Connect Azure subscription (16) | 2 | 2.2, 3.3 | Agreement and disconnect passages found. |
| Organization/enterprise billing (21) | 2 | 2.3, 5.1 | Feature list and default paid-usage passages found. |
| Tenant-wide consent (7) | 1 | 3.1 | Exact warning sentence found. |
| Azure subscription reference (18) | 4 | 3.2, 4.3 twice, 6.1 | Trial, invoice, internal-ID, and MACC passages found. |
| Using cost centers (25) | 1 | 3.7 | Azure ID verification passage found. |
| Azure pricing (28) | 1 | 4.1 | Entire quoted narrative found despite non-rendered numeric prices. |
| Azure DevOps code review (12) | 1 | 4.4 | Separate Azure-meter sentence found. |
| Azure budget tutorial (5) | 1 | 5.1 | Notify-only passage found. |
| GitHub budgets (22) | 2 | 5.1 | Both excerpts found; maximum-bill excerpt needs contextual conditions (I1), not quote correction. |
| MACC tracking (4) | 1 | 6.1 | Microsoft-provided credit exclusion sentence found. |
| GitHub Pre-Purchase plan (1) | 2 | 6.2 | Coverage and final-purchase passages found. |
| Startup credits (11) | 1 | 6.3 | Faithful excerpt found; it ends before the source's following clause. |
| Usage-based billing blog (27) | 1 | 8 | June 1 announcement sentence found. |

Immediate source attribution is present. Emphasis and quotation-delimiter normalization do not change meaning. No quotation required a corrected official URL or fabrication search.

## Source Officialness

No material issues. Microsoft Learn, Azure's Microsoft-owned pricing property, official GitHub documentation, and GitHub's corporate blog are appropriate.

The Q&A answer is authentic but is community-authored, not an official Microsoft support determination. The report explicitly labels it non-authoritative and uses it only to document a conflict. Its rejection in favor of GitHub's own acceptance table is justified. The unmonitored tag and volunteer status were independently verified.

## Technical Accuracy

### Independently verified load-bearing claims

- **Eligibility and connection:** GitHub's current docs still require GitHub ownership, subscription owner permissions, and an appropriate consent path. They exclude personal Azure payment and list the reproduced unsupported quota IDs. The preflight reads the documented ARM field and does not claim that an unlisted quota ID guarantees acceptance.
- **Billing channel and cadence:** Current GitHub sources confirm daily transmission, calendar-month periods, license charges plus AI-credit overage, invoice mapping, and the mid-cycle payment-channel split.
- **Azure budgets:** Learn confirms notifications do not stop consumption, along with the report's alert timing, scope currency, and budget role distinctions.
- **Consent roles:** Learn confirms Privileged Role Administrator as the broad documented option and the Graph application-permission limitation on the other named roles. The report correctly does not assert an undocumented SPV minimum role.
- **Pre-purchase benefits:** Learn confirms one-year terms, automatic renewal by default, final purchases, discounted CUs, scope alignment, and AI Credits → GitHub → Agent benefit precedence for overlapping GitHub usage.

### I1 — 🟡 Important: Qualify the maximum-bill example and enterprise-cap scope

**Location:** Section 5.1, especially the quotation at lines 325–326 and the report's application of the $12,600 example at line 328; enterprise-budget row in the comparison table.

**Issue:** The report turns the official baseline example into an unqualified maximum for Azure-billed Copilot items. It does not state, beside that maximum, that the relevant stop-usage option must be enabled and that cost centers excluded from the enterprise budget remain outside its cap.

**Official verification:** The same [GitHub budget page](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets#cost-center-exclusion) states that excluded cost-center charges do not count against the enterprise budget and are not blocked when it is reached; their spending is capped only by their own cost-center budget. Its hard-stop comparison and important notice say the stop-usage option is off by default. [Learn's budget tutorial](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) confirms that Azure's budget cannot supply missing enforcement.

**Why it matters:** An audience could mistake license fees plus the enterprise budget for an unconditional Copilot spending ceiling on the Azure invoice, even when excluded centers continue spending.

**Concrete correction:** State the assumptions immediately beside the worked example: fixed 400-seat license base, applicable stop-usage enforcement enabled, and no cost centers excluded from the enterprise cap. Add a short sentence that excluded centers can incur additional charges governed by their own controls. Keep other Azure-billed products and taxes outside the example. Do not expand this into R8's full budget tutorial.

## Source Freshness & Currency

The June 1, 2026 usage-based billing date is supported by the live April 27 announcement and corroborated by current GitHub billing documentation. Business/Enterprise credit quantities and conversion agree with the report. The June–August promotion is correctly historical as of October 5. Annual individual subscriptions have a transition exception in the blog, appropriately deferred to R8 rather than used to invalidate the Azure organizational claim.

Supplemental official HTML metadata confirmed:

- GitHub Pre-Purchase and GitHub AI Credits pre-purchase: `ms.date` **2026-07-17**.
- Startup credits: `ms.date` **2026-05-27**, `updated_at` **2026-06-11**.
- Azure DevOps code review: `ms.date` **2026-09-29**, with limited-preview wording in the full document.
- GitHub announcement: published and modified **2026-04-27**.

The current GitHub sources reproduce the reported policy-name variants and active/assigned-seat wording. These are documentation inconsistencies, not invented evidence. No current-state claim relies on the unverified historical self-serve purchase pause.

### I3 — 🟡 Important: Finish the binding availability-status labeling

**Location:** Section 2.5, particularly the connection, usage-based billing, pre-purchase, and cost-center rows; related presentation handoff.

**Issue:** “No preview label on page” and an effective date describe source observations, but do not provide the GA/preview labels required by the brief. The Azure DevOps row does provide an evidence-backed preview label; the other principal capability rows do not.

**Official verification:** The checked [connection documentation](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub), [pre-purchase documentation](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase), and [cost-center reference](https://docs.github.com/en/billing/reference/azure-subscription) establish supported procedures but do not explicitly establish GA in their text. By contrast, the [Azure DevOps page](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops) explicitly establishes limited preview. An independent Learn search did not establish the missing GA labels.

**Why it matters:** Slide authors cannot safely convert absence of a preview warning into the brief's required evidence-backed availability label.

**Concrete correction:** Add a dated official release/status source and explicit GA/preview label for each principal capability where available. If official evidence cannot establish a state, explicitly mark that state **⚠️ unverifiable**, record the gap in Research Limitations, and identify it as unresolved for GA/preview-labeled slides. Do not manufacture a GA assertion from silence. A retrieval date can be used where the source does not expose a publication date, but distinguish the two.

## Topic Coverage Assessment

R9's central requirements are well covered: linking accounts, eligibility, roles and consent, usage and invoice presentation, Azure Cost Management/budgets, and recent billing announcements. MACC, credit-funded usage, and pre-purchase commitments add relevant appendix depth.

Research Limitations responsibly records the unavailable GitHub.com meter names, unresolved currency conversion, sovereign-cloud support, SPV minimum role, UI and source conflicts, and unrendered Azure prices. These are bounded evidence gaps, not reasons to invent specifics or demand unsupported deployments. GitHub's secondary official MACC statement is sufficient evidence for the narrowly attributed eligibility claim; the derived billing-account guidance is clearly labeled.

R8 and R7 handoffs are explicit. Azure DevOps is clearly separated from GitHub.com and does not supply a false meter name for the latter. Keep that comparison ancillary in the eventual appendix.

## Code & CLI Validation

**Reviewed all three samples by reading only.**

- **Synthesized quota preflight:** Source/provenance is visible, the documented REST API version and field are used, the six quota IDs match GitHub, authentication uses Azure CLI login rather than embedded credentials, and strict mode plus explicit empty-result/blocked-offer errors provide reasonable failure handling. Its success text is correctly limited to “not on the published unsupported list.”
- **Verbatim Bicep budget:** The template body matches Learn's no-filter sample, including API version `2023-11-01`. Added source comments are disclosed. Required parameters are supplied by the adjacent deployment script. The sample creates an alerting budget, not a spending stop.
- **Adapted deployment script:** Subscription deployment command shape and Bash array syntax match official evidence. The researcher correctly fixes, rather than copies, the source's malformed Bash email-array assignment. Login, subscription selection, strict mode, and post-deployment listing are present.

### I2 — 🟡 Important: Specify deployment permissions and runtime prerequisites

**Location:** Sections 3.4 and 5.3; section 5.2 budget-role table is the adjacent permission context.

**Issue:** The executable examples omit an explicit runtime/setup prerequisite block, and the Bicep deployment does not distinguish budget-authoring permission from ARM deployment permission. The existing role table can lead a Cost Management Contributor to assume that budget permission alone is enough for `az deployment sub create`.

**Official verification:** [Deploy Bicep files with Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#prerequisites) requires Azure CLI **2.20.0 or later**, a local Bicep file, and write permission for deployed resources plus access to all operations on `Microsoft.Resources/deployments`. It also identifies Bash as the sample shell. The [Cost Management Contributor definition](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/management-and-governance#cost-management-contributor), independently fetched through Learn, has Consumption/CostManagement permissions but no `Microsoft.Resources/deployments/*`. The [budget quickstart](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep) separately lists budget permissions.

**Why it matters:** A legitimate budget administrator can still fail the supplied deployment with authorization errors; a new practitioner is not told what local tooling/environment the scripts assume.

**Concrete correction:** Add a concise prerequisite note: Bash/Cloud Shell or a suitable local Bash environment; installed Azure CLI; CLI 2.20.0+ for the Bicep deployment; saved `main.bicep`; correct tenant/subscription; and both budget-write and subscription-deployment permissions. State explicitly that Cost Management Contributor alone is insufficient for this ARM deployment path. Point to the official deployment guidance and provide a brief authorization-failure remedy without automatically assigning broader privileges. The existing authentication and fail-fast behavior can remain unchanged.

## Reference List Integrity

**Mechanical lint notice is a false positive.** The report does not state eight total sources. Its numbered URL inventory is:

- 12 Learn documentation pages.
- 1 non-authoritative Microsoft Q&A community page.
- 1 additional Learn code-sample page.
- 13 official GitHub documentation pages.
- 1 GitHub blog post.
- 1 Microsoft Azure pricing page.
- 1 separately listed unreachable consultation link.

Thus **14 Learn-hosted pages + 15 other official sources = 29 cited sources**, plus **one non-evidentiary URL**, exactly as the report's count check states. The three following sample-description bullets are provenance records, not extra source URLs. Zero official Microsoft GitHub repositories is accurate.

Body citations map to listed references; no evidentiary reference is orphaned. Reference 30 is intentionally linked in Research Limitations and explicitly not used for a factual claim. Categories correctly distinguish community material, GitHub official sources, and the additional code-sample page.

## Report Structure & Completeness

Title, date, researcher, matching Topic slug, source inventory, and the required MCP header are present. The MCP marker names documentation search, full-document fetch, and code-sample search through their tool names. Table of Contents and section anchors agree with the body. No unresolved command placeholders or obvious invalid command shapes were found.

Executive Summary accurately reflects the body overall. The report is publication-ready in organization and sourcing, but the cap conditions, executable-example prerequisites, and availability labeling require the narrow corrections above.

## Consistency & Contradictions

The report's handling of the flagged conflicts is largely sound:

- **MS-AZR-0003P:** Current GitHub table excludes it; the Q&A's contrary recommendation is community advice and its follow-up corroborates rejection. Do not change the report to follow the moderator.
- **MACC:** GitHub is the clearly attributed source of GitHub eligibility; Learn supplies commitment/credit conditions. No misattribution.
- **Org versus enterprise/cost center:** The report appropriately uses GitHub's richer mapping model and aligns Azure reservation scope to the actual linked subscriptions.
- **Policy names:** Singular/plural variants exist on the live cited pages; retaining an explicit UI-verification caveat is appropriate.
- **Pricing rendering:** Only numeric Azure prices are unavailable; the Azure pricing narrative and its quotation were independently renderable and verified.
- **Currency/sovereign/SPV role:** The report does not replace documentation gaps with unjustified claims.

### M1 — 🟢 Minor: Put the seat-wording caution beside the summary

**Location:** Executive Summary takeaway 4 and section 4.1.

**Issue/evidence:** “Active seats” accurately quotes [GitHub Azure billing](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing), while [Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses) and [Azure pricing](https://azure.microsoft.com/en-us/pricing/details/githubenterprise/) describe assigned seats. The conflict is disclosed only later.

**Why/correction:** To prevent “active” being presented as activity-based seat charging, add a nearby caution that the sources differ and the report does not establish that inactive assigned users are free. This is non-blocking because the conflicting assigned-seat evidence and limitation are already included.

### M2 — 🟢 Minor: Remove unnecessary “already billed” timing from the interpretation

**Location:** Section 6.2, “Reconciling ‘no prepaid usage’.”

**Issue/evidence:** The interpretation calls the benefits discounts applied to usage “that Azure has already billed.” [Learn](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase) instead describes automatic CU application to eligible usage during the plan term and scope; it does not establish a retroactive invoice-redemption sequence.

**Why/correction:** Replace that phrase with “qualifying usage billed through Azure during the plan term and within its scope.” Keep the distinction from GitHub-side prepaid usage explicitly labeled as an interpretation. This is non-blocking wording because the report already states the actual term/scope model and discloses that the reconciliation is not explicitly documented.

## Suggested Improvements (Prioritized)

1. **I1 — 🟡 Important:** Add enforcement/exclusion assumptions immediately beside the maximum-bill example and qualify enterprise-budget coverage.
2. **I2 — 🟡 Important:** Add runtime prerequisites and the ARM deployment permission distinction, especially for Cost Management Contributor.
3. **I3 — 🟡 Important:** Complete dated availability labeling, or explicitly mark unsupported status determinations as unresolved rather than equating “no preview label” with GA.
4. **M1 — 🟢 Minor:** Surface the active/assigned-seat caution nearer the summary.
5. **M2 — 🟢 Minor:** Use timing-neutral, scope/term-correct wording for the pre-purchase interpretation.

Do not revise accurate counts to satisfy the heuristic lint notice. Do not add undocumented meter names, FX rules, sovereign availability, or a guessed minimum Entra role.

## Readiness Verdict: NEEDS REWORK

The report is strongly sourced, current against the checked official sources, and technically sound in its principal Azure billing model. No fabricated evidence or verified critical technical error was found.

**Remaining must-fix blockers:**

- **I1 — 🟡 Important:** Maximum-bill/enterprise-cap guidance lacks immediate enforcement and excluded-cost-center conditions.
- **I2 — 🟡 Important:** Executable examples lack explicit runtime setup and deployment-specific authorization prerequisites.
- **I3 — 🟡 Important:** Availability table does not yet satisfy the binding evidence-backed GA/preview labeling requirement or explicitly identify unsupported status determinations as unresolved.

M1 and M2 are non-blocking suggestions and do not independently withhold approval. The report is ready for **caller-managed revision**, followed by re-review of these three must-fix items. This review does not alter routing, round limits, or workflow completion.

## Review Round 2 - 2026-10-05

**Report:** `research/2026-10-05-copilot-azure-billing.md`, revised in place. Read the complete updated report, the prior round, and the binding brief. The first-review date remains pinned. Only this review's metadata verdict and the appended round were changed; the report and other project artifacts were not modified.

**Required MCP gate:** Passed again. Microsoft Learn documentation search and full-document fetch were available. An independent search for Bicep subscription-deployment/budget permissions returned official guidance; a full fetch of [Deploy Bicep files with Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli) returned meaningful prerequisites, required permissions, scope commands, and parameter syntax. Further independent status search and full-document checks informed I3. No code, deployments, or authentication flows were executed.

### Fix Verification

| Prior item | Status | Verification against revision and official evidence |
|---|---|---|
| I1 — maximum-bill qualification | ✅ fixed | Section 5.1, lines 351–363, now places three explicit conditions beside the $12,600 example: enterprise stop-usage enabled, no excluded cost centers, and a fixed 400-seat base. It excludes other products, Actions minutes, and taxes. The enterprise-budget table row also excludes opted-out cost centers. The newly added exclusion quotation matches the live GitHub budget page; its default/enforcement discussion and Copilot license proration support the conditions. |
| I2 — executable-example prerequisites | ✅ fixed | Section 3.4 now specifies Bash/Cloud Shell, CLI installation/sign-in, tenant/subscription context, read permission, and input. Section 5.3 specifies CLI 2.20.0+, a local file, budget-write plus deployment permissions, and the insufficiency of Cost Management Contributor alone. Live Learn deployment guidance and all three role pages support the additions. The script checks the local template and provides authorization-failure guidance; portal and least-privilege alternatives do not elevate roles automatically. |
| I3 — availability labeling/evidence gaps | ✅ fixed | Section 2.5 has one evidence-backed limited-preview row and **eight explicitly UNRESOLVED rows**, with cited sources, date conventions, search methodology, and slide cautions. Section 10 records the same gap. This satisfies Round 1's expressly allowed correction when an official GA/preview state cannot be established: disclose it as unresolved rather than infer GA. The report's UNRESOLVED designation corresponds to **⚠️ unverifiable** for the availability label, not for the documented billing capability itself. Fresh source checks and independent Learn search did not establish the missing explicit labels. |
| M1 — active/assigned-seat caution | ✅ fixed | Executive Summary takeaway 4 and section 4.1 now warn against treating assigned-but-inactive users as free. Live Copilot Azure-billing and license pages still use the differing terms. |
| M2 — pre-purchase timing wording | ✅ fixed | Section 6.2 now describes automatic application to qualifying Azure-billed usage during the plan term and within scope, without “already billed” timing. It preserves the interpretation caveat. The live Learn pre-purchase document supports the term/scope description. |

Closing I3 does **not** establish GA for the eight rows or waive the brief's eventual slide-labeling requirement. It closes the research defect through the alternative accepted in Round 1. The caller retains responsibility for using the disclosed uncertainty in presentation routing and publication decisions; an unsupported GA badge must not be introduced downstream.

## Reference Validation

**Freshly checked 17 of 32 cited URLs in this round**, emphasizing every previous must-fix, the three newly listed role URLs, the promoted Bicep page, and the status-table sources. The full inventory has **33 URLs**, including reference 33's separately disclosed unreachable, non-evidentiary community FAQ. That link was not re-fetched. Across the two rounds, all 32 current evidentiary URLs have been checked at least once; this is not a claim that all 32 were re-fetched in Round 2.

| Current reference | Freshly checked source | Outcome |
|---|---|---|
| 1 | [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase) | Valid; automatic benefits within term/scope, final purchases, and GitHub coverage support M2. No explicit GA/preview label found. |
| 2 | [GitHub AI Credits pre-purchase](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan) | Valid; coverage and precedence retained. No explicit GA/preview label found. |
| 3 | [Microsoft Agent prepurchase](https://learn.microsoft.com/azure/cost-management-billing/reservations/agent-pre-purchase) | Valid; broader coverage and cloud/region caveat retained. No explicit GA/preview label found. |
| 5 | [Azure budgets tutorial](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) | Valid; notify-only behavior, budget roles, and portal creation support I1/I2. No explicit GA/preview label found. |
| 6 | [Budget with Bicep](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep) | Valid; no-filter template still matches and local-file/deployment context confirmed. |
| 12 | [Azure DevOps Copilot code review](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops) | Valid; explicit limited preview, separate meter, and 48-hour reporting retained. |
| 14 | [Copilot Azure billing](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing) | Valid; active-seat wording and daily/calendar-month invoicing retained. |
| 16 | [Connect Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub) | Valid; connection procedure and roles retained. No explicit GA/preview label found. |
| 21 | [Organization/enterprise billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) | Valid; AI-credit amounts, conversion, CLI inclusion, and paid-usage default retained. No explicit GA/preview label found. |
| 22 | [GitHub budgets](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) | Valid; exclusion and stop-usage conditions confirm I1's correction. No explicit GA/preview label found. |
| 23 | [Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses) | Valid; assigned-seat wording and added-seat proration confirm M1/I1. |
| 25 | [Using cost centers](https://docs.github.com/en/billing/how-tos/products/use-cost-centers) | Valid; Azure ID validation and 1,000-center limit retained. No explicit GA/preview label found. |
| 27 | [Usage-based billing announcement](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) | Valid; June 1 transition and June–August promotion retained. “Preview bill” is not an explicit availability label for the billing model itself. |
| 29 | [Deploy Bicep with Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli) | Valid; CLI minimum, local file, Bash arrays, and deployment permission wording confirm I2. |
| 30 | [Management/governance roles](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/management-and-governance) | Valid; Cost Management Contributor includes subscription read and budget authoring, but not deployments operations. |
| 31 | [Privileged roles](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/privileged) | Valid; Owner and Contributor actions/NotActions support the stated deployment examples. |
| 32 | [General roles](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/general) | Valid; Reader grants control-plane `*/read`. |

All fresh checks returned meaningful content. Learn URLs were fetched through the required full-document MCP tool; GitHub URLs through official-site fetches. No new source attribution or authenticity issue.

## Claim Citation Coverage

No material issues. New prerequisites, role comparisons, cap conditions, and pre-purchase wording have visible official citations. The status table distinguishes documented functionality/effective dates from unavailable explicit GA/preview labels. The original Learn-primary/GitHub-secondary division remains appropriate for R9.

## Quote Verification

**Freshly verified 15 of the current 28 standalone quotation blocks**, using the same block-count convention as Round 1. The remaining 13 blocks are unchanged passages already verified in Round 1; they were screened in the complete revised report but not freshly source-fetched this round. Both newly introduced blocks were independently verified.

| Checked quotation source | Blocks freshly checked | Outcome |
|---|---:|---|
| GitHub Pre-Purchase plan (1) | 2 | Coverage and final-purchase excerpts match. |
| Azure budgets tutorial (5) | 1 | Notify-only excerpt matches. |
| Azure DevOps code review (12) | 1 | Separate Azure-meter excerpt matches. |
| Copilot Azure billing (14) | 1 | Account-connection excerpt matches. |
| Connection procedure (16) | 2 | Agreement and disconnect excerpts match. |
| Organization/enterprise billing (21) | 2 | AI-feature and paid-usage-default excerpts match. |
| GitHub budgets (22) | 3 | Stop-usage, baseline maximum-bill, and **new cost-center exclusion** excerpts match; the maximum now has nearby conditions. |
| Using cost centers (25) | 1 | Azure ID verification excerpt matches. |
| Usage-based billing blog (27) | 1 | June 1 transition excerpt matches. |
| Bicep CLI deployment (29) | 1 | **New deployment-permissions** excerpt matches, including the resource type. |

No missing, fabricated, or misattributed checked quotation. The inline limited-preview statement in section 2.5 also matches Learn.

## Source Officialness

No material issues. Newly listed role and deployment pages are official Microsoft Learn documentation. GitHub sources remain properly labeled secondary official sources. The community Q&A and unreachable FAQ retain their non-authoritative/non-evidentiary treatment.

## Technical Accuracy

No unresolved material issues. Fresh official evidence confirms the revised enterprise-cap conditions, the separation of budget-write and deployment permissions, Reader/Owner/Contributor permissions, and automatic pre-purchase application within term/scope.

The report does not claim that unresolved availability labels negate the currently documented procedures. It also does not claim that absent preview wording proves GA. I1 and I2 are closed on official evidence, not researcher self-certification.

## Source Freshness & Currency

No new material freshness issues. The live announcement and current billing page still support the June 1, 2026 Business/Enterprise billing transition and current 1,900/3,900 credit quantities. The promotional allotments remain correctly historical as of October 5.

The revised date convention separates publication dates, Learn `ms.date`, and retrieval dates. Availability status for eight principal rows remains **⚠️ unverifiable** as an explicit GA/preview label and is candidly disclosed. The Azure DevOps limited-preview label was freshly verified. Searches cannot prove that no status announcement exists anywhere; this round's conclusion is limited to the checked sources and independent search.

## Topic Coverage Assessment

No material issues. R9's connection, billing, eligibility, roles, invoice, Azure budgets, and announcement scope remains covered. Added operational safeguards address the existing findings rather than expand the assignment into R7/R8. Meter names, FX, sovereign support, and SPV minimum-role gaps remain transparent.

## Code & CLI Validation

Reviewed all three samples by reading only. The quota preflight and verbatim Bicep body remain valid against prior/current evidence. The adapted deployment script now has a local-template check, explicit prerequisites, fail-fast handling, and useful authorization guidance. Its `if ! ...; then` deployment wrapper and Bash array quoting are well formed.

No secrets, automatic privilege assignment, undocumented command shapes, or unsafe deployment changes were introduced. Visible official source and synthesized/verbatim/adapted provenance remain present.

## Reference List Integrity

**Counts are consistent; the lint notice remains a false positive.**

- 12 original Learn documentation entries plus 4 entries in the revision documentation category = **16 documentation pages**.
- Add 1 Microsoft Q&A page = **17 Learn-hosted pages**.
- 13 GitHub documentation pages + 1 GitHub blog + 1 Azure pricing page = **15 other official sources**.
- **17 + 15 = 32 cited URLs**, plus reference **33**, the unreachable consultation link.
- **3 code samples** and **0 official Microsoft GitHub repositories**, as stated.

The four revision-category entries are not four net-new URLs: the Bicep page was already listed as a code-sample-only source in Round 1 and is now promoted to full documentation; the three role pages are net-new sources. This explains the increase from 29 to 32. The header/category note and reference 29 disclose the promotion sufficiently. The three sample-description bullets are provenance records, not additional reference URLs.

The new sources are cited in the body. No new orphan citation or reference was found.

## Report Structure & Completeness

No material issues. Required headers, matching topic slug, MCP marker, Table of Contents, and limitations remain intact. The availability table explicitly reports eight unresolved determinations and one supported preview determination. Example prerequisites and cap qualifications are located beside the relevant guidance.

## Consistency & Contradictions

No new material contradiction. The active/assigned-seat caution is now visible in the summary and metering table. The pre-purchase interpretation no longer introduces unsupported invoice timing. Enterprise exclusion is consistently reflected in the comparison table, worked example, and pitfalls checklist.

Previously disclosed policy-name, offer/Q&A, mapping, pricing-rendering, currency, and sovereign-cloud conflicts remain bounded rather than silently “resolved” by inference.

## Suggested Improvements (Prioritized)

No remaining report must-fix or minor findings. I1–I3 and M1–M2 are closed.

For downstream use, preserve the source/status dates, cap assumptions, seat caution, and eight unresolved GA/preview determinations. Research approval is not authorization to add unsupported availability badges or to treat the illustrative Copilot ceiling as an entire Azure-invoice ceiling.

## Readiness Verdict: APPROVED

**Remaining must-fix blockers: None.**

All three prior must-fix findings are **✅ fixed**. Both prior **🟢 Minor** suggestions are also **✅ fixed**; any remaining non-blocking polish is waived. No new genuine material defect was found.

Approval applies to the research report with its explicitly disclosed evidence limitations. The eight unresolved GA/preview labels remain unresolved—not implicitly GA—and must be handled under the caller's binding presentation rubric and workflow. The reviewer does not change routing, user gates, round limits, or presentation publication decisions.
