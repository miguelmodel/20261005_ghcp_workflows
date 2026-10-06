# Research Report: Copilot plans, licensing and pricing (appendix)

**Date:** 2026-10-05
**Researcher:** Copilot Web Researcher Agent
**Topic slug:** copilot-plans-pricing
**Sources consulted:** 38 web sources: 22 GitHub Docs pages (docs.github.com), 1 github.com product page, 2 GitHub Blog posts, 11 GitHub Changelog posts, and 2 items from the official `github/copilot-cli` repository (1 changelog file and 1 community-filed issue, labeled as a community report). 0 third-party sources are cited. There are 4 code samples (1 verbatim, 3 adapted). 4 internal project reports are cross-referenced but not counted as sources.
**Required MCP:** verified - WebIQ-MCP; tools used: web, browse, news

> **Assignment:** R8 (appendix) of the brief "Subagents & Multi-Agent Orchestration with GitHub Copilot CLI". The audience is practitioners who are new to multi-agent systems in GitHub Copilot. Every fact here was re-verified on 2026-10-05 against official sources. Prior model knowledge was **not** used for prices, allowances or dates, because billing changed in 2026.
> **Boundaries (cross-reference only):** Billing through Azure → R9 ([`research/2026-10-05-copilot-azure-billing.md`](./2026-10-05-copilot-azure-billing.md), approved). Org and enterprise policies (CLI policy, model policy, third-party-agent policy) → R7. `/fleet` mechanics → R5 ([`research/2026-10-05-cli-fleet-delegate-workflows.md`](./2026-10-05-cli-fleet-delegate-workflows.md)). Subagent model defaults → R1 ([`research/2026-10-05-cli-subagent-foundations.md`](./2026-10-05-cli-subagent-foundations.md)). The custom-agent `model` field and how Auto overrides it → R2 ([`research/2026-10-05-cli-custom-agents.md`](./2026-10-05-cli-custom-agents.md)). JetBrains and other editors are excluded.
> **Lifecycle-label convention (from the brief):** Features carry a label only when an official source states **GA** or **preview**, with that source's date. A feature with dated release evidence but no status label is written as "shipped in CLI <version> (<date>); no separate status label" or "in effect since <date>; no GA/preview label", and is **never** shown with a GA badge. Undated GitHub Docs pages are cited with the retrieval date (2026-10-05). A retrieval date is not a publication date.

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overview and Key Concepts](#2-overview-and-key-concepts)
3. [Plan Comparison (Appendix Table)](#3-plan-comparison-appendix-table)
4. [How CLI Subagents, /fleet and Other Agents Consume AI Credits](#4-how-cli-subagents-fleet-and-other-agents-consume-ai-credits)
5. [Cost Controls: Budgets, Spending Limits, Session Limits and Usage Reports](#5-cost-controls-budgets-spending-limits-session-limits-and-usage-reports)
6. [Licenses and Seats for Organizations and Enterprises](#6-licenses-and-seats-for-organizations-and-enterprises)
7. [Configuration, Best Practices, and Pitfalls](#7-configuration-best-practices-and-pitfalls)
8. [Billing Through Azure (Cross-Reference to R9)](#8-billing-through-azure-cross-reference-to-r9)
9. [Research Limitations](#9-research-limitations)
10. [Complete Reference List](#10-complete-reference-list)

---

## 1. Executive Summary

**The answer in one paragraph.** On **June 1, 2026**, every GitHub Copilot plan moved from **premium requests** to **usage-based billing in GitHub AI Credits**. The only exception is legacy annual Pro and Pro+ subscriptions. An AI credit is worth **$0.01 USD**. The cost of an interaction depends on the model and the number of input, output and cached tokens it uses. Plan prices didn't change: Pro is $10, Pro+ is $39, Business is $19 per seat and Enterprise is $39 per seat, all per month. A new **Copilot Max** plan costs $100 per month. Every plan includes Copilot CLI. Copilot CLI usage, including every subagent that `/fleet` starts, draws down AI credits. That makes model choice, parallelism and budget controls the main cost levers for multi-agent work ([GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/), 2026-04-27; [Updates to GitHub Copilot billing and plans](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/), 2026-06-01; [Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans), retrieved 2026-10-05).

> "As of June 1, all Copilot plans bill based on GitHub AI Credits consumed."
> - Source: [Updates to GitHub Copilot billing and plans](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/) (GitHub Changelog, 2026-06-01)

**Key takeaways**

| # | Takeaway | Source (date) |
|---|---|---|
| 1 | **1 AI credit = $0.01 USD.** Usage is priced per model per 1M tokens (input, cached input, cache write where applicable, and output), then converted to credits. Code completions and next edit suggestions are **not** billed in AI credits. | [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing); [Models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) (retrieved 2026-10-05) |
| 2 | **Monthly allowances.** Pro gets 1,500 credits (1,000 base + 500 flex). Pro+ gets 7,000 (3,900 + 3,100). Max gets 20,000 (10,000 + 10,000). Business gets 1,900 per user and Enterprise gets 3,900 per user, pooled across the billing entity. Free and Student get an unnumbered allowance with auto model selection only. | [Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans); [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) (retrieved 2026-10-05) |
| 3 | **Allowances reset** at 00:00:00 UTC on the 1st of each calendar month, with no carry-over. Additional usage is billed at $0.01 per credit through a budget. For organizations and enterprises, paid additional usage is **enabled by default**. | [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) (retrieved 2026-10-05) |
| 4 | **Subagents and `/fleet` can increase usage.** Each subagent can call the model independently, so `/fleet` "may therefore cause more GitHub AI Credits to be consumed". The CLI reference documents per-plan concurrency rows: **2** for Free/Education, **4** for Pro/Pro+, **8** for Max, **16** for Business and **32** for Enterprise. It also has a separate "Usage-based billing" row of **32**, so which row applies under usage-based billing today is **unresolved** (see §4.2 and §9). Nesting-depth limits also conflict between sources: 6/256 versus 4/128. | [/fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) (retrieved 2026-10-05); [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) (1.0.71, 2026-07-16) |
| 5 | **Two different model-cost strategies.** One is cheaper models set explicitly for subagents, which GitHub recommends. That works only in a **non-Auto** session. Under **Auto**, subagents use the resolved session model "regardless of" a custom agent's `model` field. The other is **Auto**, which gives paid plans a **10% discount** on model costs in Copilot CLI but no per-worker model control. Use `/usage` to check which models actually ran (§4.2). | [Optimizing your AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) (retrieved 2026-10-05) |
| 6 | **Per-task CLI cap (public preview).** In interactive sessions, use `/limits set max-ai-credits N`. In `-p` runs, use `--max-ai-credits N`. The cap is soft, the minimum is 30 credits, and it requires CLI 1.0.66 or later. It doesn't replace budgets. | [Set AI credit session limits](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) (2026-07-01); [Setting an AI credit session limit](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) |
| 7 | **Org and enterprise hard stops.** User-level budgets (**GA** 2026-06-01) always hard-stop. Enterprise, organization and cost-center budgets only stop usage if **"Stop usage when budget limit is reached"** is enabled, and that setting is **off by default**. | [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets); [Updates to billing and plans](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/) |
| 8 | **CLI in GitHub Actions with `GITHUB_TOKEN`** bills an org-owned repository's usage **to the organization**, and user-level budgets are **not** considered. Control this spend with cost centers and `--max-ai-credits`. | [About using Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions); [CLI no longer needs a PAT in Actions](https://github.blog/changelog/2026-07-02-copilot-cli-no-longer-needs-a-personal-access-token-in-github-actions/) (2026-07-02) |
| 9 | **Seats.** Business and Enterprise are billed per **assigned** seat per monthly cycle. Since **2026-10-01**, existing Business and Enterprise customers who pay by credit card or PayPal are charged **upfront** for seats. | [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses); [Upcoming changes to Copilot policies and billing](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/) (2026-08-28) |

---

## 2. Overview and Key Concepts

### 2.1 What changed in 2026 (timeline)

| Date | Change | Source |
|---|---|---|
| 2026-02-25 | Copilot CLI becomes **generally available** "for all Copilot subscribers". For Business and Enterprise, "an administrator must enable Copilot CLI from the Policies page". | [GitHub Copilot CLI is now generally available](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| 2026-04-20 | New sign-ups are paused for Student, Pro and Pro+, usage limits get tighter, and Opus models are removed from Pro. | [Changes to GitHub Copilot plans for individuals](https://github.blog/changelog/2026-04-20-changes-to-github-copilot-plans-for-individuals/) |
| 2026-04-27 | GitHub announces usage-based billing for June 1, 2026. Self-serve Copilot Business purchases have already been paused ("last week"). | [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) |
| 2026-05-12 | GitHub announces a **flex allotment** for Pro and Pro+ and a new **Max** plan, effective June 1. | [Individual plans: flex allotments and a new Max plan](https://github.blog/news-insights/company-news/github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/) |
| 2026-06-01 | Usage-based billing goes live for all plans. User-level budgets become **GA**. Max opens as an upgrade for existing Student, Pro and Pro+ users. Copilot code review starts consuming Actions minutes. | [Updates to GitHub Copilot billing and plans](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/) |
| 2026-06 to 2026-08 | Existing Business and Enterprise customers receive promotional included usage of $30 and $70 per user per month "for June, July, and August". | [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) |
| 2026-06-17 | Individual sign-ups start reopening "gradually". The pay-as-you-go continuation flow is effective immediately. | [Copilot individual plan sign-ups are reopening](https://github.blog/changelog/2026-06-17-copilot-individual-plan-sign-ups-are-reopening/) |
| 2026-06-30 | CLI 1.0.66 changes how session limits apply and adds subagent concurrency and depth settings for usage-based billing users. Cost center user-level budgets ship, initially through the REST API only. | [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md); [Per-user AI credit budgets for cost centers](https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers/) |
| 2026-07-01 | AI credit **session limits** enter **public preview** in the CLI (1.0.66+) and the SDK (1.0.5+). | [Set AI credit session limits](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) |
| 2026-07-02 | Cost centers get AI credit pools (REST API). The CLI can run in Actions with `GITHUB_TOKEN`, billed to the organization. | [Cost centers now support AI credit pools](https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps/); [CLI no longer needs a PAT in Actions](https://github.blog/changelog/2026-07-02-copilot-cli-no-longer-needs-a-personal-access-token-in-github-actions/) |
| 2026-07-16 | CLI 1.0.71 lowers the default subagent nesting depth from 6 to 4. Usage-based billing users can set `subagents.maxDepth` "up to 128". This conflicts with the 6/256 values that the command reference still lists (§4.2). | [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| 2026-07-20 | AI credit pools for cost centers become available in the billing UI. | [AI credit pools in the billing UI](https://github.blog/changelog/2026-07-20-ai-credit-pools-for-cost-centers-in-the-billing-ui/) |
| 2026-08-11 | The AI usage report adds a per-model token breakdown. | [Per-model token breakdown in the usage report](https://github.blog/changelog/2026-08-11-per-model-token-breakdown-in-the-usage-report/) |
| 2026-09-01 / 2026-10-01 | Business and Enterprise sign-ups reopen for card and PayPal payers on September 1. Upfront seat charges apply to existing card and PayPal customers from October 1. | [Upcoming changes to Copilot policies and billing](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/) |
| 2026-09-16 | CLI 1.0.85 changelog entry: "/usage shows per-model AI Credit consumption in usage breakdowns". | [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |

> "Starting June 1, premium request units (PRUs) will be replaced by GitHub AI Credits."
> - Source: [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) (Mario Rodriguez, GitHub Blog, 2026-04-27)

### 2.2 Terminology (current versus renamed)

| Term | Meaning | Source |
|---|---|---|
| **GitHub AI Credits** (AIC) | The current billing unit for every plan. The token cost for the model used is converted at 1 AI credit = $0.01 USD. | [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) |
| **Base credits** / **flex allotment** | For paid individual plans, included usage has two parts. Base credits match the price 1:1 and "never change". The flex allotment is "variable additional usage on top of your base" and "will vary over time". | [Individual plans: flex allotments and Max](https://github.blog/news-insights/company-news/github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/) (2026-05-12) |
| **Pool** | For Business and Enterprise, each user's included credits are "pooled at the billing entity level". | [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) |
| **Additional usage** (pay-as-you-go, overage) | Usage beyond the included credits, charged at $0.01 per credit against a budget set in USD. | Same as above; [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) |
| **User-level budget (ULB)**, cost center budget, organization budget, enterprise spending limit | The budget controls for organizations and enterprises (see §5.2) | [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) |
| **AI credit pool** / **included usage control** (cost centers) | Caps how much of the shared included pool a cost center can draw. The changelog calls it an "AI credit pool" and the docs call it "Included usage controls". | [Cost centers now support AI credit pools](https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps/); [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) |
| **Premium requests / PRUs** (legacy, renamed) | The pre-June-2026 unit. It now applies only to legacy annual Pro and Pro+ subscribers. Existing premium request budgets "have been automatically converted to AI credit budgets". | [What changed with Copilot billing (legacy)](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/what-changed-with-billing); [Setting up budgets](https://docs.github.com/en/billing/how-tos/set-up-budgets) |
| **Model multipliers** (legacy) | Apply only to legacy annual plans: "Model multipliers are a concept specific to the legacy premium request-based billing system, and **do not apply** to GitHub's new usage-based billing model." | [Model multipliers for annual plans (legacy)](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/model-multipliers-for-annual-plans) |

### 2.3 Lifecycle status of the billing features covered here

| Capability | Status label (per the brief's rule) | Evidence and date |
|---|---|---|
| Usage-based billing in AI credits | **In effect since 2026-06-01; no GA/preview label** | [Changelog 2026-06-01](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/) ("now live for all users") |
| Copilot Max plan | **Available since 2026-06-01** as an upgrade. Sign-ups reopening gradually from 2026-06-17. No GA/preview label. | [Changelog 2026-06-01](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/); [Changelog 2026-06-17](https://github.blog/changelog/2026-06-17-copilot-individual-plan-sign-ups-are-reopening/) |
| User-level budgets (orgs and enterprises) | **GA** (2026-06-01) | [Changelog 2026-06-01](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/): "now generally available" |
| Cost center user-level budgets | **Shipped 2026-06-30 (REST API only at that date); no GA/preview label** | [Changelog 2026-06-30](https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers/) |
| AI credit pools (included usage controls) for cost centers | **Shipped 2026-07-02 (API) and 2026-07-20 (UI); no GA/preview label** | [Changelog 2026-07-02](https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps/); [Changelog 2026-07-20](https://github.blog/changelog/2026-07-20-ai-credit-pools-for-cost-centers-in-the-billing-ui/) |
| CLI AI credit session limits (`/limits`, `--max-ai-credits`) | **Public preview** (2026-07-01; CLI 1.0.66+) | [Changelog 2026-07-01](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/); [docs note](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) |
| CLI `subagents.maxConcurrency` / `subagents.maxDepth` overrides | **Shipped in CLI 1.0.66 (2026-06-30); no separate status label.** CLI 1.0.71 (2026-07-16) changed the depth default and maximum to 4/128, which conflicts with the reference's 6/256 (§4.2). | [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| CLI `/usage` per-model AI credit display | **Shipped in CLI 1.0.85 (2026-09-16); no separate status label** | [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| CLI in Actions with `GITHUB_TOKEN`, billed to the organization | **Shipped 2026-07-02; no GA/preview label** | [Changelog 2026-07-02](https://github.blog/changelog/2026-07-02-copilot-cli-no-longer-needs-a-personal-access-token-in-github-actions/) |
| Third-party agents (Claude, Codex) | **Public preview** (plans table, retrieved 2026-10-05) | [Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans) |
| Cloud sandboxes (`copilot --cloud`) billing | **Public preview** (retrieved 2026-10-05) | [Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes) |
| Copilot CLI itself | **GA** (2026-02-25) | [CLI GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |

---

## 3. Plan Comparison (Appendix Table)

### 3.1 Prices, allowances and agent features

All prices are in USD. GitHub doesn't currently publish **any annual price**. Annual Pro and Pro+ subscriptions exist only as legacy plans (see §3.4).

| Plan | Price | Included AI credits / month | When included credits run out | Copilot CLI | Cloud agent | Third-party agents (public preview) | Model access | CLI max concurrent subagents (documented plan row; current applicability unresolved; see note below) |
|---|---|---|---|---|---|---|---|---|
| **Copilot Free** | $0 | "An allowance" (no number published). 2,000 code completions per month. | Upgrade to Pro (additional-usage purchase is described for paid plans) | ✓ | ✗ | ✗ | Auto model selection only | 2 ("Free / Education") |
| **Copilot Student** | $0 (verified students) | "An allowance" (no number published). Unlimited completions. | Upgrade (Max opened to Student subscribers on 2026-06-01) | ✓ | ✓ | ✗ ("Excludes third-party agents") | Auto model selection only | 2 (assuming "Education" means Student; see §9) |
| **Copilot Pro** | $10 / month (free for verified teachers and maintainers of popular open source projects) | **1,500** = 1,000 base + 500 flex | Additional usage at $0.01 per credit through a budget. It "may be capped". | ✓ | ✓ | ✓ | "A selection of models" | 4 |
| **Copilot Pro+** | $39 / month | **7,000** = 3,900 base + 3,100 flex | Same as Pro | ✓ | ✓ | ✓ | "Access to premium models" | 4 |
| **Copilot Max** | $100 / month | **20,000** = 10,000 base + 10,000 flex | Same as Pro, with "higher spending limits" | ✓ | ✓ | ✓ | "Priority access to premium models" | 8 |
| **Copilot Business** | $19 per granted seat / month | **1,900 per user**, pooled | Additional usage at $0.01 per credit, **enabled by default** | ✓ (admin policy) | ✓ | ✓ | "Access to premium models" | 16 |
| **Copilot Enterprise** | $39 per granted seat / month (GitHub Enterprise Cloud) | **3,900 per user**, pooled | Same as Business | ✓ (admin policy) | ✓ | ✓ | "Priority access to premium models" | 32 |

Sources and dates for the table:
- **Prices, allowances, agents and models:** [Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans) and [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing). Both are undated and were retrieved 2026-10-05. The individual allowances took effect on 2026-06-01 ([blog, 2026-05-12](https://github.blog/news-insights/company-news/github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/)).
- **Business and Enterprise pool:** [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing), retrieved 2026-10-05.
- **Overage behavior:** the same pages, plus the [2026-06-01 changelog](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/) ("higher spending limits" for Max).
- **Admin CLI policy:** the [CLI GA changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), 2026-02-25. Policy details are in R7.
- **Concurrency:** [CLI command reference: Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), retrieved 2026-10-05. These numbers are the reference's **documented plan rows**, not verified runtime limits. The same table also lists "Usage-based billing | 32", and since 2026-06-01 every plan except legacy annual plans uses usage-based billing. So it's unresolved whether a given account gets its plan row or 32. A community-filed issue reports 2 on Copilot Free ([#4940](https://github.com/github/copilot-cli/issues/4940)). Check `Maximum concurrent agent limit` messages on the demo machine (§4.2, §9).

> "All plans include Copilot CLI and Copilot app."
> - Source: [Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans) (GitHub Docs, retrieved 2026-10-05)

> "Copilot Free and Copilot Student both have an allowance of AI credits and access to models through auto model selection only. Copilot Free includes 2000 code completions per month and Copilot Student includes unlimited code completions."
> - Source: [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) (GitHub Docs, retrieved 2026-10-05)

**Corroboration from GitHub's product page.** github.com describes the same individual plans in dollar terms: Pro is "1,500 monthly AI credits ($15 value)". The total included value is $15 for Pro, $70 for Pro+ and $200 for Max. Pro+ is "Over 4.6x" and Max is "Over 13.3x" the included credits of Pro. These figures match the docs (7,000 / 1,500 ≈ 4.67 and 20,000 / 1,500 ≈ 13.3) ([GitHub Copilot · Plans & pricing](https://github.com/features/copilot/plans), read via WebIQ browse on 2026-10-05).

**Other plan facts that matter for this deck:**
- Copilot is "not currently available for GitHub Enterprise Server" ([Plans](https://docs.github.com/en/copilot/get-started/plans)).
- Copilot Free plans "are only available to individual developers who don't have access to Copilot through an organization or enterprise" ([Plans](https://docs.github.com/en/copilot/get-started/plans)).
- With GitHub Enterprise Cloud, "an enterprise owner chooses the plan for each organization in the enterprise" ([Plans](https://docs.github.com/en/copilot/get-started/plans)).
- The licenses page lists Business as "$19 USD per user per month (billed monthly)". For enterprises, it says to choose Copilot Business or Copilot Enterprise and that "Both are billed monthly, pricing varies." ([GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses)).
- MCP and agent mode are included in every plan. On Free, Copilot code review is limited to the "Review selection" option in the editor, and the other plans include Copilot code review ([Plans](https://docs.github.com/en/copilot/get-started/plans)).

### 3.2 Model access per plan (don't hard-code on slides)

The plans page shows per-model availability. For example, **Pro** includes Claude Haiku 4.5, GPT-5.6 Terra, GPT-6 Luna, Grok 4.5–4.7, Kimi K3 and MAI-Code-1.1-Flash. Pro does **not** include Claude Opus 4.8, GPT-6 Astra, GPT-6 Sol or GPT-6.1 Sol, which are available on Pro+ and Max. Business and Enterprise include GPT-6 Astra, GPT-6 Sol and GPT-6.1 Sol ([Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans), retrieved 2026-10-05). Removing Opus from Pro dates back to 2026-04-20 ("Opus models are no longer available on Copilot Pro") ([Changes to plans for individuals](https://github.blog/changelog/2026-04-20-changes-to-github-copilot-plans-for-individuals/)). The lineup changes often, so the slides should link to the page rather than list models.

> "Users on legacy annual Copilot plans will not receive access to new models and features."
> - Source: [Model multipliers for annual plans (legacy)](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/model-multipliers-for-annual-plans) (GitHub Docs, retrieved 2026-10-05)

### 3.3 Business and Enterprise allowance examples (official arithmetic)

- **Pool:** "an enterprise with 100 Copilot Business users gets a shared pool of 190,000 AI credits rather than 100 individual buckets" ([Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)).
- **Mid-cycle changes:** "Adding licenses mid-cycle increases the pool immediately. Removing licenses mid-cycle doesn't shrink the pool: the decrease is reflected at the start of the next billing cycle." (same source)
- **Mixed cost center:** a cost center with 10 Business and 5 Enterprise licenses has a cap of **38,500** credits (10 × 1,900 + 5 × 3,900) ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)).
- **Maximum bill (conditional):** GitHub's example reads: "400 Copilot Business licenses at $19 USD per month means $7,600 USD in license fees. A $5,000 USD enterprise budget means your maximum bill is $12,600 USD, not $5,000 USD." (same source). Treat **$12,600** as the Copilot license-plus-metered ceiling **only if all of these hold**, consistent with [R9 §5.1](./2026-10-05-copilot-azure-billing.md):
  1. **"Stop usage when budget limit is reached" is enabled** on the enterprise budget. It's off by default, and without it "charges continue to accrue past the limit" ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)).
  2. **No cost center has cost center exclusion enabled.** An excluded cost center's metered charges "are not counted against the enterprise budget and will not be blocked when the enterprise budget is reached". They add to the total, capped only by that cost center's own budget, and only if its own stop-usage setting is on (same source).
  3. **Seat fees stay at the stated 400 seats** for the cycle. Seats added mid-cycle are prorated and billed on top ([Making changes to your GitHub Copilot license](https://docs.github.com/en/copilot/reference/copilot-billing/license-changes)).

  If any condition fails, $12,600 is just license fees plus the budget amount, not a guaranteed maximum. The example covers only Copilot seats and AI-credit overage. It doesn't cap other GitHub products or Copilot-related meters such as Actions minutes for code review or cloud sandboxes, which have their own budgets (§4.4).
- **Expired promotion:** the April announcement gave existing Business and Enterprise customers $30 and $70 per user "for June, July, and August". Current docs list only 1,900 and 3,900 ([blog, 2026-04-27](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/); [Plans](https://docs.github.com/en/copilot/get-started/plans)).

### 3.4 Annual plans, premium requests and multipliers (legacy only)

Subscribers on monthly Pro and Pro+ plans moved automatically on June 1, 2026. Subscribers on **annual** Pro and Pro+ plans can stay on premium-request billing until the plan ends, then they are downgraded to Copilot Free. They can also cancel for a prorated refund, or switch to a monthly plan with prorated credits ([What changed with Copilot billing (legacy)](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/what-changed-with-billing)). Those legacy plans keep model multipliers, which rose on June 1. Examples include Claude Opus 4.8 at **27**, GPT-5.5 at **57**, Claude Sonnet 4.6 at **9**, GPT-5 mini at **0.33**, and Copilot code review at **13** ([Model multipliers for annual plans (legacy)](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/model-multipliers-for-annual-plans); [blog, 2026-04-27](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/)). **Model multipliers don't apply to anyone on usage-based billing.** Don't show them as current pricing.

> "Users on annual Pro or Pro+ plans will remain on their existing plan with premium request-based pricing until their plan expires."
> - Source: [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) (GitHub Blog, 2026-04-27)

---

## 4. How CLI Subagents, /fleet and Other Agents Consume AI Credits

### 4.1 What is billed, and how it's calculated

Every Copilot feature that calls an AI model consumes AI credits: "Copilot Chat, Copilot CLI, Copilot cloud agent, Copilot Spaces, Spark, and third-party coding agents". Code completions and next edit suggestions don't ([Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)). Each interaction's input, output and cached tokens are priced per model, then converted at $0.01 per credit ([Models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)).

> "Agentic features: Features like agent mode and Copilot cloud agent can involve multiple model calls within a single task. A complex agentic session working across a large codebase will consume significantly more usage than a quick question in chat."
> - Source: [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) (GitHub Docs, retrieved 2026-10-05)

**Selected per-token rates** (USD per 1M tokens, from [Models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing), retrieved 2026-10-05):

| Model | Category | Input | Cached input | Cache write | Output |
|---|---|---:|---:|---:|---:|
| GPT-5 mini | Lightweight | $0.25 | $0.025 | n/a | $2.00 |
| GPT-6 Luna (≤ 272K) | Lightweight | $0.10 | $0.01 | $0.125 | $0.50 |
| Claude Haiku 4.5 | Versatile | $1.00 | $0.10 | $1.25 | $5.00 |
| Claude Sonnet 5 | Versatile | $2.00 | $0.20 | $2.50 | $10.00 |
| GPT-5.5 (≤ 272K) | Powerful | $5.00 | $0.50 | n/a | $30.00 |
| Claude Opus 5 | Powerful | $5.00 | $0.50 | $6.25 | $25.00 |
| GPT-6 Astra (≤ 272K) | Powerful | $10.00 | $1.00 | $12.50 | $50.00 |

Some models have a **Long context** tier that is priced higher above an input-token threshold. For example, GPT-5.5 costs $10.00 input and $45.00 output above 272K. Gemini 3.7 Flash and 3.8 Flash have promotional pricing "through December 31, 2026" (same source).

### 4.2 Subagents and `/fleet`: why parallel work can cost more

The `/fleet` docs state the mechanism directly:

> "Each subagent can interact with the LLM independently of the main agent, so splitting work up into smaller tasks that are run by subagents may result in more LLM interactions than if the work was handled by the main agent. Using `/fleet` in a prompt may therefore cause more GitHub AI Credits to be consumed."
> - Source: [Running tasks in parallel with the /fleet command](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet) (GitHub Docs, retrieved 2026-10-05)

The plan sets **how many** subagents can run at once. It doesn't set the price per token.

> "**Concurrency** counts how many subagents are running simultaneously across the entire session tree. When the limit is reached, new subagent requests are rejected until an active agent completes."
> - Source: [GitHub Copilot CLI command reference — Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) (GitHub Docs, retrieved 2026-10-05)

| Plan (as named in the CLI reference) | Max concurrent subagents (documented row) |
|---|---|
| Free / Education | 2 |
| Pro / Pro+ | 4 |
| Max | 8 |
| Business | 16 |
| Enterprise | 32 |
| Usage-based billing | 32 |

Source: [CLI command reference — Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), retrieved 2026-10-05. The rows above are **documented plan rows, and which one applies under usage-based billing is unresolved**. The concurrency cap is 32. "Usage-based billing users can override these limits with the `subagents.maxConcurrency` and `subagents.maxDepth` settings", and "These settings are ignored for plans that don't use usage-based billing" (same source). The override shipped in CLI **1.0.66 (2026-06-30)**: "Configure subagent concurrency and depth limits in /settings (usage-based billing users)" ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). Since June 1, almost every plan is on usage-based billing, so it's unclear which default an individual user actually gets. A **community-filed** issue on Copilot Free with BYOK models reports a fixed cap of 2 and the override being ignored ([github/copilot-cli#4940](https://github.com/github/copilot-cli/issues/4940), community report, 2026-09-22). This is unresolved (see §9). Check it on the demo machine.

**Nesting depth: sources conflict.** Neither figure has been confirmed against the current runtime, so check depth on the demo machine. Don't put a single depth number on a slide as definitive.

| Source (date) | Default depth | Maximum depth |
|---|---|---|
| CLI command reference, Subagent limits section (retrieved 2026-10-05) | 6 | 256 |
| Official CLI changelog, 1.0.71 (2026-07-16) | 4 (lowered from 6) | 128 |

The 1.0.71 entry reads: "Lower the default maximum sub-agent nesting depth from 6 to 4 to curb runaway recursive sub-agent delegation. Usage-based billing users can still adjust `subagents.maxDepth` (up to 128)." ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)). The approved R1 report found the same split inside the command reference. Its environment-variable table gives `COPILOT_SUBAGENT_MAX_DEPTH` a default of 4 (range 1–128) and `COPILOT_SUBAGENT_MAX_CONCURRENT` a default of 32 (range 1–256) ([R1 §6.3](./2026-10-05-cli-subagent-foundations.md)).

**Which model subagents use** drives cost more than concurrency does:
- The `/fleet` page says "By default, subagents use a low-cost AI model" ([/fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)).
- The CLI reference says a custom agent without `model` "inherits the outer agent's model". When the session model is `Auto`, "subagents always inherit the resolved session model regardless of this field" ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)).
- R1 and R5 own the default-model conflict.

**Cheaper worker models and Auto are two different cost strategies, not one combined recipe:**
- **Explicit cheaper workers.** This only works in a non-Auto session, meaning you picked a specific session model. In that setup, a custom agent's `model` (or `models`) field can put workers on a cheaper model than the orchestrator. Under Auto, the reference says the authored `model` field doesn't control the subagent's model. The resolved session model is used instead, and it can be more expensive than the model you configured ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [R1](./2026-10-05-cli-subagent-foundations.md); [R2](./2026-10-05-cli-custom-agents.md)).
- **Auto routing.** You accept the server-selected model, with the 10% discount on paid plans, and subagents inherit that resolved model. You don't get per-worker model control.
- R1 notes that how Auto interacts with `/subagents` overrides, per-call model requests and `modelPolicy: "required"` is undocumented.
- Whichever strategy you use, check which models actually ran, and what each cost, with `/usage` or the AI usage report (§5.3–5.4). Don't assume a custom agent's `model` field set worker cost.

> "Run subagents on cheaper models. Subagents run in their own session and don't inherit the main agent's conversation history."
> - Source: [Optimizing your AI usage to maximize efficiency and reduce cost](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage) (GitHub Docs, retrieved 2026-10-05)

> "If you are on a paid Copilot plan, you qualify for a 10% discount on model costs while using auto model selection in Copilot Chat, Copilot CLI, GitHub Copilot app, or Copilot cloud agent."
> - Source: [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) (GitHub Docs, retrieved 2026-10-05)

### 4.3 Worked example (synthesized arithmetic, for slides)

The table below applies the published rates (§4.1) to one hypothetical subagent turn of **40,000 uncached input tokens and 4,000 output tokens**. It ignores caching, cache writes, long-context tiers and the Auto discount. In real sessions, later turns re-send context that is billed at cached-input rates ("typically billed at 10% of the normal input price") ([Optimizing your AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)). **Provenance: synthesized from [Models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing). These are illustrative numbers, not GitHub figures.**

| Model | Input cost | Output cost | Cost per turn | AI credits per turn |
|---|---:|---:|---:|---:|
| GPT-5 mini | 40,000 × $0.25/1M = $0.010 | 4,000 × $2.00/1M = $0.008 | $0.018 | 1.8 |
| Claude Haiku 4.5 | $0.040 | $0.020 | $0.060 | 6 |
| Claude Sonnet 5 | $0.080 | $0.040 | $0.120 | 12 |
| Claude Opus 5 | $0.200 | $0.100 | $0.300 | 30 |

**Fleet illustration (synthesized).** This example **assumes** 4 subagents run in parallel. Four is the documented Pro/Pro+ row, but it isn't a guaranteed runtime cap (§4.2). Each subagent runs 10 such turns. On Claude Sonnet 5, that is 4 × 10 × 12 = **480 credits ($4.80)**, before counting the orchestrator's own turns. That's about a third of Pro's 1,500 monthly credits. The same work on GPT-5 mini would be **72 credits**. One large Opus 5 turn (30 credits) already equals the 30-credit **minimum** CLI session limit (§5.3).

### 4.4 Other agent surfaces that bill differently

| Surface | What it consumes | Source (date) |
|---|---|---|
| **Copilot code review** (on GitHub) | AI credits **and** GitHub Actions minutes. "Each code review is billed in two ways". The model is chosen automatically and isn't disclosed. The default review effort changed from Lite to **Balanced** on 2026-09-28. | [Models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing); [Changelog 2026-06-01](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/); [Changelog 2026-08-28](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/) |
| **Copilot CLI in GitHub Actions** with `GITHUB_TOKEN` | AI credits. In an **org-owned** repository, usage is metered to the organization (requires the "Allow use of Copilot CLI billed to the organization" policy). In a personal repository, it's billed to the owner's seat. With a PAT, it's billed to the PAT owner's seat. | [About using Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions) |
| **Cloud sandboxes** (`copilot --cloud`), **public preview** | Separate meters: compute at $0.000024 per second, memory at $0.000003 per GiB-second, and snapshot storage at $0.005 per GiB-month. "Local sandboxing is included in the standard GitHub Copilot seat at no additional cost." Not part of "Bundled AI credits" budgets. The $10 monthly preview entitlement ran "through the end of July 2026". | [Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes) (retrieved 2026-10-05) |
| **Cloud agent and third-party coding agents** (for example, via `/delegate`) | AI credits | [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) |

---

## 5. Cost Controls: Budgets, Spending Limits, Session Limits and Usage Reports

### 5.1 Individual plans (Free, Student, Pro, Pro+, Max)

- **When included credits run out,** you can (a) upgrade, paying only the price difference, with earlier usage counting against the new allowance; (b) set a budget for **additional usage**, which "may be capped"; or (c) wait for the monthly reset ([Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing)).
- **Limits on additional usage.** "For individual plans, we may limit your total additional AI Credits based on your usage patterns, billing history, and verification status for your user account." ([Changelog 2026-06-01](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/))
- **Pay-as-you-go continuation.** Since 2026-06-17, "If you've exhausted your included credits and hit your additional spending limit, you can pay for the additional usage you've already consumed, giving you continued access without switching plans." ([Changelog 2026-06-17](https://github.blog/changelog/2026-06-17-copilot-individual-plan-sign-ups-are-reopening/))
- **Personal budgets.** Choose a **Bundled AI credits budget** or an AI-credit SKU budget. Alerts fire at 75%, 90% and 100%. Select **Stop usage when budget limit is reached** to actually stop spend. Included-usage alerts are available at 90% and 100% ([Setting up budgets](https://docs.github.com/en/billing/how-tos/set-up-budgets)).
- **Mobile restriction.** Additional AI credits can't be bought if you subscribed through GitHub Mobile on iOS or Android ([Models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)).
- **No fallback.** When credits or a budget run out, there is no automatic fallback to a cheaper model. "Fallback experiences will no longer be available." ([blog, 2026-04-27](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/))

> "If you do not select **Stop usage when budget limit is reached**, you will be notified by email if you exceed your budget, but usage **will not** be stopped."
> - Source: [Setting up budgets to control spending on metered products](https://docs.github.com/en/billing/how-tos/set-up-budgets) (GitHub Docs, retrieved 2026-10-05)

### 5.2 Organizations and enterprises (Business, Enterprise)

**Defaults to change on day one:**

> "Additional usage is **enabled by default** for organizations and enterprises. If you want to prevent any spending beyond your included AI credits, an administrator must explicitly disable the **AI credits paid usage** policy in your enterprise's or organization's AI Controls settings."
> - Source: [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) (GitHub Docs, retrieved 2026-10-05)

The **Stop usage when budget limit is reached** setting:

> "applies to enterprise spending limits, cost center budgets, and organization budgets only, and is off by default. Without it, charges continue to accrue past the limit. Always enable it when creating a budget. User-level budgets always enforce a hard stop and do not have this setting."
> - Source: [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) (GitHub Docs, retrieved 2026-10-05)

**The controls** (adapted from the docs' comparison table, [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)):

| Control | What it caps | When it's active | Hard stop? |
|---|---|---|---|
| Universal user-level budget | Each user's total AI credit consumption | Always (pool and metered) | Always |
| Cost center user-level budget | Each member's total consumption. Overrides the universal budget. | Always | Always |
| Individual user-level budget (can expire) | One user's total consumption. Overrides both of the above. | Always | Always |
| Cost center included usage control (AI credit pool) | How much of the shared **pool** a cost center can draw, capped at what its own licenses fund | Pool phase | You choose: block, or continue as paid overage |
| Cost center budget | A team's metered charges after the pool is exhausted | Metered phase only | Only if "Stop usage when budget limit is reached" is enabled |
| Organization budget | An organization's metered charges after the pool is exhausted | Metered phase only | Only if "Stop usage when budget limit is reached" is enabled |
| Enterprise budget (spending limit) | Total metered charges after the pool is exhausted | Metered phase only | Only if "Stop usage when budget limit is reached" is enabled |

**Evaluation order for each request:**
1. The user-level budget is checked first, using the most specific one that applies.
2. The shared pool is checked next. If it's empty, the request is metered at $0.01 per credit.
3. For metered usage, only one of these budgets is checked. It's the cost center budget if the user is in a cost center. Otherwise, it's the organization budget if the user's license is billed to an organization that has a budget. Otherwise, it's the enterprise spending limit. If that budget is exhausted, the "Stop usage when budget limit is reached" setting decides whether the request is blocked or the charges keep accruing.

By default, cost center usage also counts against the enterprise budget, unless the cost center is excluded.

When user-level budgets and spending limits are out of step, the docs apply a "lowest remaining headroom wins" rule: whichever budget has the least capacity left blocks the user first. Raising a cost center or enterprise budget doesn't unblock a user who has hit their user-level budget ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)). When a member hits a budget, Copilot features that consume AI credits are blocked, but code completions keep working. The member can ask an administrator for more budget ([same source](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets); [Monitoring your GitHub AI Credits usage](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-ai-usage)).

**GitHub's recommended setup** ([Getting started with budget controls](https://docs.github.com/en/copilot/tutorials/budgets/getting-started-with-budget-controls)):
1. Set a universal user-level budget.
2. Add individual overrides for power users. These can have expiration dates.
3. Set an enterprise spending limit.
4. Enable "Stop usage when budget limit is reached" on every spending limit.
5. Monitor at least monthly.

> "Set the universal ULB above the per-license value ($19 USD for Copilot Business, $39 USD for Copilot Enterprise)."
> - Source: [Getting started with budget controls](https://docs.github.com/en/copilot/tutorials/budgets/getting-started-with-budget-controls) (GitHub Docs, retrieved 2026-10-05)

### 5.3 CLI-level controls for multi-agent sessions

| Control | What it does | Status (date) | Source |
|---|---|---|---|
| `/limits set max-ai-credits N` and `/limits unset` | Sets a soft AI-credit cap in an interactive session. When the cap is hit, you are prompted to raise it and continue. The minimum is 30. | **Public preview** (2026-07-01). CLI 1.0.66+; the 30-credit minimum arrived in 1.0.67. | [Set session limit how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit); [Changelog 2026-07-01](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) |
| `copilot -p "YOUR PROMPT" --max-ai-credits N` | Sets a soft cap for one non-interactive run. "the run ends when the limit is reached". | **Public preview** (2026-07-01) | Same as above |
| `/usage` | "Display session usage metrics and statistics, including per-model token totals." For token-based-billing accounts, each model row shows its AI credits (for example, `1 AIC`). | Per-model AI credits shipped in CLI 1.0.85 (2026-09-16); no separate status label | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference); [copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md) |
| `subagents.maxConcurrency` / `subagents.maxDepth` | Raise or lower the subagent limits. "applies to usage-based billing users". | Shipped in CLI 1.0.66 (2026-06-30); no separate status label | [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| Model per subagent or custom agent (cheaper models) **or** Auto (10% discount) | Lowers the cost per token. Under Auto, a custom agent's `model` field doesn't control the subagent's model (§4.2). Pick one strategy and check the result with `/usage`. | See R1 and R2 for the mechanics | [Optimizing your AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage); [CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |

What session limits count, per the changelog:

> "Set a limit before you start work or kick off jobs, and Copilot tracks AI credit usage across the entire session, including model calls, subagents, and background work like compaction."
> - Source: [Set AI credit session limits in Copilot CLI and SDK](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) (GitHub Changelog, 2026-07-01)

> "These session limits are **soft limits**. If a response is in progress when the limit is reached, that response completes before the session stops, so actual usage may slightly exceed the configured number."
> - Source: [Setting an AI credit session limit in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) (GitHub Docs, retrieved 2026-10-05)

**Unresolved: does the interactive limit cover the whole session or each response?** The sources disagree:
- **Whole session:** the how-to says the interactive limit "applies for the entire session". The 2026-07-01 changelog says "across the entire session". The CLI 1.0.66 changelog says "Session limits now apply across the current conversation, reset on /clear" ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)).
- **Each response:** the command reference describes `/limits set max-ai-credits` as "a soft maximum for AI Credits allowed per response", where response limits "reset for each user message" ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). CLI 1.0.66 also lists "Add experimental response limits controls to CLI settings".

The dated changelogs and the how-to all point to session-wide behavior, but the reference wording hasn't been reconciled. R5 records the same conflict. Present `/limits` as a soft, public-preview guardrail, and confirm its behavior with `/usage` before the demo.

> "Session limits are soft limits that help you control how many AI credits any single task consumes, but they don't replace user-level budgets or spending limits, which govern your overall monthly consumption."
> - Source: [Optimizing your AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage) (GitHub Docs, retrieved 2026-10-05)

### 5.4 Usage reports and dashboards

- **Individuals:** the **AI usage** page under `https://github.com/settings/billing` shows included credits used, additional usage, a per-model chart, and credits and cost per model. You can also download a usage report ([Monitoring your GitHub AI Credits usage](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-ai-usage)).
- **Business and Enterprise users:** the Copilot settings **Usage this cycle** card shows credits used, or used out of your budget when a user-level budget applies (same source).
- **Admins:** "For a complete view of all licensed users regardless of activity, use the **AI usage** or **Licensing** pages" ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)). Since 2026-08-11, the downloadable AI usage report shows input, output, cache-read and cache-write tokens per model, for Business and Enterprise admins and for individual-plan users ([Changelog 2026-08-11](https://github.blog/changelog/2026-08-11-per-model-token-breakdown-in-the-usage-report/)).
- **Code review Actions minutes:** filter the billing usage report by `workflow_path` `dynamic/agents/copilot-pull-request-reviewer` ([Models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)).
- **Client versions:** use Copilot CLI **1.0.48** or later. Older versions "may display incorrect model pricing, inaccurate usage information, or outdated billing terminology" ([Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing)).

Organization-level Copilot usage-metrics APIs belong to R7.

---

## 6. Licenses and Seats for Organizations and Enterprises

- **What a seat is.** "A **Copilot seat** is a license to use Copilot, assigned to a unique user account through a Copilot Business or a Copilot Enterprise plan." Organization owners assign seats in organization settings or through the REST API. "If all assigned seats are removed, the organization's Copilot plan is canceled." ([GitHub Copilot seat assignment](https://docs.github.com/en/copilot/reference/copilot-billing/seat-assignment))
- **What gets billed.** "Organizations and enterprises are billed for the number of assigned seats at the end of each monthly billing cycle." A user with seats in several organizations in the same enterprise is billed once. If a user has both a Business and an Enterprise seat, only the Enterprise seat is billed ([GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses)). The billing cycle uses UTC ([Billing cycle](https://docs.github.com/en/copilot/reference/copilot-billing/billing-cycle)).
- **Adding and removing seats.** Added seats are prorated and take effect immediately, and "Included AI credits may also be prorated". Removed seats stop billing at the end of the cycle, with no refunds. Revoked seats lose access immediately ([Making changes to your GitHub Copilot license](https://docs.github.com/en/copilot/reference/copilot-billing/license-changes)).
- **Personal plans.** If a Pro, Pro+ or Max user is assigned a Business or Enterprise seat, the personal plan is cancelled automatically with a prorated refund ([Seat assignment](https://docs.github.com/en/copilot/reference/copilot-billing/seat-assignment)).
- **Budgets and multiple organizations.** If a user gets licenses from more than one organization, "GitHub picks one organization at random each billing cycle to bill the seat", which makes organization budgets unpredictable. Use one licensing organization, or cost centers with direct user assignment ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)).
- **Card and PayPal payers since 2026-10-01.** New Business and Enterprise seat assignments "will require payment for each seat before users gain Copilot access". Existing card and PayPal customers incur an upfront seat charge at the start of the next billing cycle from **October 1, 2026**. Prices aren't changing ([Upcoming changes to Copilot policies and billing](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/), 2026-08-28).
- **Automation without a seat.** "Enterprises that issue licenses through a dedicated organization and do their work in other organizations do not need Copilot licensing enabled in the working organization, only the policy" (for CLI-in-Actions billing) ([About using Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions)).

> "This will apply to existing Copilot Business and Copilot Enterprise customers with a credit card or paypal payment method starting October 1, 2026."
> - Source: [Upcoming changes to GitHub Copilot policies and billing](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/) (GitHub Changelog, 2026-08-28)

---

## 7. Configuration, Best Practices, and Pitfalls

### 7.1 Cap a multi-agent CLI session (interactive)

```text
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit
# (adapted; this attribution line is not a prompt — type only the three commands below at the Copilot prompt)
/limits set max-ai-credits 200
/usage
/limits unset
```
> - Source: [Setting an AI credit session limit in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit); [CLI command reference (`/usage`)](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: adapted

Values must be at least 30. Session limits are a public preview feature and need CLI 1.0.66 or later. The scope caveat in §5.3 applies.

### 7.2 Cap a scripted (non-interactive) run

```bash
#!/usr/bin/env bash
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit
#         https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions (adapted)
# Auth: run `copilot login` once, or export COPILOT_GITHUB_TOKEN (fine-grained PAT with "Copilot Requests").
set -euo pipefail

copilot update   # session limits require Copilot CLI 1.0.66 or later (public preview)

if ! copilot -p "Use git show HEAD to summarize the changes in this commit" -s \
     --allow-tool='shell(git show:*)' \
     --max-ai-credits 50; then
  echo "Copilot run failed or was stopped; check output and AI usage before retrying." >&2
  exit 1
fi
```
> - Source: [Setting an AI credit session limit](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit); [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions); [CLI command reference (auth tokens)](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: adapted

The docs don't state the exit code when the limit is reached. The `if` branch handles any non-zero exit.

### 7.3 Subagent limit overrides (usage-based billing users only)

```jsonc
// Source: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference (verbatim JSON; this comment line is attribution — omit it in ~/.copilot/settings.json)
{
    "subagents": {
        "maxConcurrency": 16,
        "maxDepth": 10
    }
}
```
> - Source: [GitHub Copilot CLI command reference — Subagent limits](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Provenance: verbatim

The reference says values are clamped to a maximum of 32 for concurrency and 256 for depth. The CLI 1.0.71 changelog (2026-07-16) says `subagents.maxDepth` goes "up to 128" and that the default depth is 4. The depth ceiling is therefore **unresolved** (§4.2, §9); the example's `maxDepth: 10` is within either range. Plans that don't use usage-based billing ignore these settings. Raising concurrency raises **peak** spend rate, not price per token.

### 7.4 CLI in GitHub Actions billed to the organization, with a per-run cap

```yaml
# Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions (adapted: added --max-ai-credits)
# Requires the org policy "Allow use of Copilot CLI billed to the organization".
# User-level budgets do NOT apply to org-billed usage; use cost-center budgets plus a session limit.
name: Copilot CLI example
on: [push]

permissions:
  contents: read
  copilot-requests: write

jobs:
  copilot:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 2
      - name: Install Copilot CLI
        run: npm install -g @github/copilot
      - name: Run Copilot
        run: copilot -p "Use git show HEAD to summarize the changes in this commit" -s --allow-tool='shell(git show:*)' --max-ai-credits 50
        env:
          GITHUB_TOKEN: ${{ github.token }}
```
> - Source: [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions); [CLI no longer needs a PAT in Actions](https://github.blog/changelog/2026-07-02-copilot-cli-no-longer-needs-a-personal-access-token-in-github-actions/) | Provenance: adapted

The changelog lists session limits as one of the ways to control org-billed spend ("Set a session limit to configure a maximum amount of AI credits that will be used by a workflow") ([Changelog 2026-07-02](https://github.blog/changelog/2026-07-02-copilot-cli-no-longer-needs-a-personal-access-token-in-github-actions/)). For security, the docs recommend GitHub Agentic Workflows over calling `copilot` directly in workflow steps (R4 and R5).

### 7.5 Best practices for multi-agent cost

1. **Choose a model strategy per session.** GitHub's tutorial recommends planning with a strong reasoning model and then running subagents on cheaper models ([Optimizing your AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)). Per-worker models only apply when you pick a specific (non-Auto) session model. Auto gives the 10% discount on paid plans, but under Auto subagents use the resolved session model "regardless of" a custom agent's `model` field ([CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)). Check the models and AI credits that were actually used with `/usage` before you rely on either strategy.
2. **Protect the cache.** Switching models, reasoning effort, context size, or tools and MCP servers in the middle of a session invalidates the cache, so the whole context is billed again as fresh input. Set them before you start (same source).
3. **Use `/fleet` only for work that parallelizes.** The docs say sequential tasks may get no benefit, but still incur extra subagent calls ([/fleet concept](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet)).
4. **Add deterministic checks.** Tests, linters and scans reduce retries, which GitHub calls "one of the biggest drivers of token waste" ([Optimizing your AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)).
5. **For teams:** set a universal user-level budget above the per-seat value, add expiring overrides for `/fleet` power users, set an enterprise spending limit with **Stop usage** enabled, and decide on the **AI credits paid usage** policy ([Getting started with budget controls](https://docs.github.com/en/copilot/tutorials/budgets/getting-started-with-budget-controls)).
6. **Upgrade before buying overage.** If you regularly approach your limit, "a higher plan may be more economical than paying for additional usage" ([Optimizing your AI usage](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage)).

### 7.6 Pitfalls to call out on slides

| Pitfall | Why it bites | Source |
|---|---|---|
| Spending limits without **Stop usage** | They are alerts only, and charges keep accruing | [Getting started with budget controls](https://docs.github.com/en/copilot/tutorials/budgets/getting-started-with-budget-controls) |
| Paid usage left at its default | Overage is enabled by default for organizations and enterprises | [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) |
| Treating the enterprise budget as the total bill | License fees + enterprise budget is a ceiling only with "Stop usage when budget limit is reached" enabled (off by default), no excluded cost centers, and a fixed seat count. Otherwise metered charges keep accruing (§3.3). | [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) |
| CLI in Actions with `GITHUB_TOKEN` | User-level budgets aren't considered | [About using Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions) |
| Expecting a free fallback model | None exists under usage-based billing | [blog, 2026-04-27](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/); [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) |
| Session limit seen as a hard cap | It's soft, and a response in flight can overshoot | [Set session limit how-to](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit) |
| Cloud sandbox spend missing from AI-credit budgets | Cloud sandboxes aren't in "Bundled AI credits" budgets, so use product or SKU budgets | [Billing for cloud and local sandboxes](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes) |
| Old CLI versions | May show wrong pricing or usage (use 1.0.48 or later) | [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) |
| Using legacy multipliers or "premium requests" on slides | These apply only to legacy annual plans | [Model multipliers (legacy)](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/model-multipliers-for-annual-plans) |

---

## 8. Billing Through Azure (Cross-Reference to R9)

R9 covers this in depth ([`research/2026-10-05-copilot-azure-billing.md`](./2026-10-05-copilot-azure-billing.md), approved). Only the points that interact with this report are summarized here, and they come from R9 rather than being re-verified:
- Azure billing is available to **organization and enterprise accounts only**, so personal plans can't be paid through Azure.
- Azure Cost Management budgets **only notify**. To hard-stop spend, use GitHub's own controls: user-level budgets, and "Stop usage when budget limit is reached" on enterprise, organization and cost center budgets. That GitHub-side behavior was independently verified for this report in §5.2.
- R9 notes that GitHub's Azure billing page says "active seats", while the licenses page says **assigned** seats. This report confirms the licenses-page wording ([GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses)).

The allowance figures in R9 (1,900 and 3,900 credits per user, 1 credit = $0.01, reset at 00:00 UTC on the 1st) match this report.

---

## 9. Research Limitations

**Conflicts and how they were handled**
1. **`/limits` scope (session versus response).**
   - The how-to, the 2026-07-01 changelog and the CLI 1.0.66 changelog say it covers the whole session.
   - The command reference calls it "a soft maximum for AI Credits allowed per response" and says response limits "reset for each user message".
   - This is unresolved. It is presented as a soft public-preview guardrail with a verification step (§5.3), consistent with R5.
2. **Default subagent concurrency under usage-based billing.**
   - The reference lists plan-based defaults and a separate "Usage-based billing | 32" row, but every current plan except legacy annual plans is on usage-based billing.
   - The approved R1 report also found an environment-variable row in the same reference that gives `COPILOT_SUBAGENT_MAX_CONCURRENT` a default of 32 (range 1–256) ([R1](./2026-10-05-cli-subagent-foundations.md)).
   - A community-filed issue (Copilot Free, BYOK models, CLI runtime 1.0.81) reports a fixed cap of 2 and the override being ignored ([#4940](https://github.com/github/copilot-cli/issues/4940)). That issue is unconfirmed by GitHub.
   - "Free / Education" is assumed to cover Copilot Student. That is an inference, not a documented mapping.
   - The summary (§1), plan table (§3.1) and worked example (§4.3) therefore present these as **documented rows with unresolved current applicability**, not verified runtime caps.
3. **Subagent nesting depth (6/256 versus 4/128).**
   - The reference's Subagent limits section lists a default of 6 and a maximum of 256.
   - The official CLI changelog for 1.0.71 (2026-07-16) says the default was lowered "from 6 to 4" and that `subagents.maxDepth` can be set "up to 128" ([copilot-cli changelog](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md)).
   - Per R1, the reference's own environment-variable row gives `COPILOT_SUBAGENT_MAX_DEPTH` a default of 4 (range 1–128).
   - Both sources are official. This report doesn't establish which values the current runtime enforces. The 6/256 values may be stale.
   - Each figure is attributed to its source (§4.2, §7.3). Don't present a single depth number as definitive, and verify it on the demo machine.
4. **Default subagent model and Auto.**
   - The `/fleet` page says subagents use "a low-cost AI model". The reference says subagents inherit the outer or session model. R1 and R5 own this conflict.
   - For cost advice, the reference's Auto rule is load-bearing. Under Auto, subagents inherit the resolved session model "regardless of" a custom agent's `model` field.
   - This report therefore separates "explicit cheaper workers" (non-Auto sessions) from "Auto with a 10% discount" (§1, §4.2, §5.3, §7.5) rather than recommending both together.
   - Per R1, Auto's interaction with `/subagents` overrides, per-call requests and `modelPolicy: "required"` is undocumented.
5. **Inconsistencies in the plans page.**
   - GitHub Spark (public preview) is marked ✓ for Pro+ but ✗ for Max, even though Max "includes everything in Copilot Pro+".
   - The docs describe Max as having "Priority access to premium models", while the product page says "Early access to frontier models".
   - The Claude Opus 4.8 (fast mode) row is named "(preview)" but has "GA" in the release-status column of the pricing table.
   - The CLI GA post (2026-02-25) lists the CLI for "Pro, Pro+, Business, and Enterprise", while the current plans page says "All plans include Copilot CLI". The current page is treated as authoritative.
6. **Wording about personal-plan upgrades differs** but appears equivalent. One page says "only the price difference" and another says "full price of the new plan, minus the amount you already paid".

**Evidence gaps**
- **Free and Student allowances** are described only as "an allowance". No credit numbers are published. It's also not documented whether Free and Student can buy additional usage. The April blog says additional usage is for paid plans, and the licenses page tells Free users to upgrade.
- **Flex allotments are variable by design** ("Flex allotments may change over time"). The 500, 3,100 and 10,000 figures are as of retrieval on 2026-10-05.
- **Annual pricing.** No current official page offers an annual price, and the legacy pages say annual plans revert to Free at expiration. No single sentence says "annual plans are discontinued for new buyers", so that is stated as an inference.
- **End of the promotional usage.** The end of the June to August Business and Enterprise promotion comes from the April announcement wording. No separate end-of-promotion notice was found.
- **Cloud agent compute metering.** It wasn't verified whether cloud agent sessions also consume Actions minutes or cloud sandbox meters after the unified Copilot experience (no earlier than 2026-09-28). Only AI-credit billing is documented in the sources read. See R6.
- **CLI `/review` and Actions minutes.** The documented AI credits plus Actions minutes charge is for **Copilot code review** on GitHub. No source says the CLI's local `/review` consumes Actions minutes. That is treated as AI credits only, which is an inference.
- **Enterprise pricing.** The licenses page says enterprise pricing "varies". The $39 list price is from the plans page. Negotiated or volume pricing isn't covered.
- **Lifecycle labels.** Most billing constructs have dated release evidence but no GA or preview label (§2.3). Only user-level budgets (**GA**), session limits (**public preview**), third-party agents (**public preview**) and cloud sandboxes (**public preview**) have explicit labels.
- **`/chronicle cost-tips`** is documented in the optimization tutorial. The CLI changelog for 1.0.71 (2026-07-16) lists improvements to it ("Add local and cloud cost profiles to /chronicle cost-tips"), so it existed by that release. The release that introduced it wasn't identified, and it has no separate status label. Present it as "available in CLI 1.0.71 (2026-07-16); no separate status label" if it's used at all.
- **Version attribution.** The `/usage` per-model AI credit entry is attributed to CLI 1.0.85 (2026-09-16) based on the changelog section heading it appears under.
- **Policy name.** The docs use both "AI credits paid usage" and "AI credit paid usage". Both are quoted as written.

**Access notes**
- The **CLI command reference** is very large, so it was read in its relevant sections only: commands, Subagent limits, the `/limits` and `/usage` rows, and auth tokens. An earlier WebIQ browse capture of the full page couldn't be searched by section.
- **Plans for GitHub Copilot** was read in full, apart from parts of the very long per-model availability tables.
- **github.com/features/copilot/plans** returned only the page title through `web_fetch`, so it was read through WebIQ `browse`. Only the individual-plans tab rendered.
- A first WebIQ `browse` of `docs.github.com/en/copilot/get-started/plans` returned NotFound, so the same page was read through `web_fetch` and the docs article API.
- `web_fetch` failed with a transport error on the session-limit how-to, so that page was read through WebIQ `browse`.
- `web_fetch` on GitHub issue #4940 returned an error page, so it was read through WebIQ `browse`.
- Both seed URLs were validated: the 2026-04-27 blog post, and [GitHub Copilot billing (reference index)](https://docs.github.com/en/copilot/reference/copilot-billing), which is an index page that links to the seat, license-change, billing-cycle, models-and-pricing and legacy pages cited here.

**Scope boundaries.** Azure billing → R9. Org and enterprise policies (CLI enablement, models, third-party agents, MCP) and usage-metrics APIs → R7. `/fleet` mechanics → R5. Subagent model defaults → R1. JetBrains and other editors are excluded. The minimum-version table on the billing pages also lists IDEs and plugins. Third-party pricing guides and news coverage turned up in searches. They were not cited, because every load-bearing fact has a primary source.

---

## 10. Complete Reference List

### Documentation and Articles — GitHub Docs (22)

1. [Usage-based billing for individuals](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing). Read via WebIQ browse. Requested as `/copilot/concepts/billing/usage-based-billing-for-individuals` and redirected. Retrieved 2026-10-05.
2. [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing). Retrieved 2026-10-05.
3. [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets). Retrieved 2026-10-05.
4. [Plans for GitHub Copilot](https://docs.github.com/en/copilot/get-started/plans). Retrieved 2026-10-05.
5. [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses). Retrieved 2026-10-05.
6. [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing). Retrieved 2026-10-05.
7. [Model multipliers for annual plans on request-based billing (legacy)](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/model-multipliers-for-annual-plans). Retrieved 2026-10-05.
8. [What changed with Copilot billing (legacy)](https://docs.github.com/en/copilot/reference/copilot-billing/request-based-billing-legacy/what-changed-with-billing). Retrieved 2026-10-05.
9. [GitHub Copilot billing (reference index)](https://docs.github.com/en/copilot/reference/copilot-billing). Seed URL, validated 2026-10-05.
10. [GitHub Copilot seat assignment](https://docs.github.com/en/copilot/reference/copilot-billing/seat-assignment). Retrieved 2026-10-05.
11. [Making changes to your GitHub Copilot license](https://docs.github.com/en/copilot/reference/copilot-billing/license-changes). Retrieved 2026-10-05.
12. [GitHub Copilot billing cycle](https://docs.github.com/en/copilot/reference/copilot-billing/billing-cycle). Retrieved 2026-10-05.
13. [Running tasks in parallel with the /fleet command](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet). Retrieved 2026-10-05.
14. [GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference). Relevant sections read; also captured via WebIQ browse. Retrieved 2026-10-05.
15. [Setting an AI credit session limit in GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit). Read via WebIQ browse. Retrieved 2026-10-05.
16. [Optimizing your AI usage to maximize efficiency and reduce cost](https://docs.github.com/en/copilot/tutorials/optimize-ai-usage). Retrieved 2026-10-05.
17. [Monitoring your GitHub AI Credits usage](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-ai-usage). Retrieved 2026-10-05.
18. [Getting started with budget controls](https://docs.github.com/en/copilot/tutorials/budgets/getting-started-with-budget-controls). Retrieved 2026-10-05.
19. [Setting up budgets to control spending on metered products](https://docs.github.com/en/billing/how-tos/set-up-budgets). Retrieved 2026-10-05.
20. [About using Copilot CLI in GitHub Actions](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/copilot-cli-in-github-actions). Retrieved 2026-10-05.
21. [Using Copilot CLI in GitHub Actions with GITHUB_TOKEN](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions). Retrieved 2026-10-05.
22. [Billing for cloud and local sandboxes for GitHub Copilot](https://docs.github.com/en/billing/concepts/product-billing/cloud-and-local-sandboxes). Retrieved 2026-10-05.

### Documentation and Articles — github.com product page (1)

23. [GitHub Copilot · Plans & pricing](https://github.com/features/copilot/plans). Read via WebIQ browse; individual-plans tab only. Retrieved 2026-10-05.

### Primary Announcements — GitHub Blog (2)

24. [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/). Mario Rodriguez, published 2026-04-27. Seed URL, validated.
25. [GitHub Copilot individual plans: Introducing flex allotments in Pro and Pro+, and a new Max plan](https://github.blog/news-insights/company-news/github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/). Joe Binder, published 2026-05-12.

### Primary Announcements — GitHub Changelog (11)

26. [GitHub Copilot CLI is now generally available](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), 2026-02-25
27. [Changes to GitHub Copilot plans for individuals](https://github.blog/changelog/2026-04-20-changes-to-github-copilot-plans-for-individuals/), 2026-04-20
28. [Updates to GitHub Copilot billing and plans](https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/), 2026-06-01
29. [Copilot individual plan sign-ups are reopening](https://github.blog/changelog/2026-06-17-copilot-individual-plan-sign-ups-are-reopening/), 2026-06-17
30. [Per-user AI credit budgets available for cost centers](https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers/), 2026-06-30
31. [Set AI credit session limits in Copilot CLI and SDK](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/), 2026-07-01
32. [Cost centers now support AI credit pools](https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps/), 2026-07-02
33. [Copilot CLI no longer needs a personal access token in GitHub Actions](https://github.blog/changelog/2026-07-02-copilot-cli-no-longer-needs-a-personal-access-token-in-github-actions/), 2026-07-02
34. [AI credit pools for cost centers in the billing UI](https://github.blog/changelog/2026-07-20-ai-credit-pools-for-cost-centers-in-the-billing-ui/), 2026-07-20
35. [Per-model token breakdown in the usage report](https://github.blog/changelog/2026-08-11-per-model-token-breakdown-in-the-usage-report/), 2026-08-11
36. [Upcoming changes to GitHub Copilot policies and billing](https://github.blog/changelog/2026-08-28-upcoming-changes-to-github-copilot-policies-and-billing/), 2026-08-28

### GitHub Repositories (2)

37. [github/copilot-cli changelog (main, raw)](https://raw.githubusercontent.com/github/copilot-cli/main/changelog.md). Entries for 1.0.66 and 1.0.67 (2026-06-30) and 1.0.85 (2026-09-16). Retrieved 2026-10-05.
38. [github/copilot-cli issue #4940: "Allow subagents.maxConcurrency for BYOK / non usage-based accounts (currently hard-capped at 2)"](https://github.com/github/copilot-cli/issues/4940). **Community-filed report**, opened 2026-09-22, status triage. Corroboration of a limitation only. Read via WebIQ browse.

### Code Samples (provenance index; these are not additional sources)

- §7.1 interactive `/limits` and `/usage`: adapted from sources 15 and 14.
- §7.2 scripted `copilot -p "PROMPT" --max-ai-credits 50`: adapted from sources 15, 21 and 14.
- §7.3 `subagents` settings JSON: verbatim from source 14.
- §7.4 GitHub Actions workflow with `--max-ai-credits`: adapted from sources 21 and 33.

### Internal project cross-references (not counted as sources)

- R9: [`research/2026-10-05-copilot-azure-billing.md`](./2026-10-05-copilot-azure-billing.md). Billing through Azure (approved).
- R5: [`research/2026-10-05-cli-fleet-delegate-workflows.md`](./2026-10-05-cli-fleet-delegate-workflows.md). `/fleet` mechanics and the `/limits` conflict.
- R1: [`research/2026-10-05-cli-subagent-foundations.md`](./2026-10-05-cli-subagent-foundations.md). Subagent model defaults, Auto inheritance scope, and the environment-variable depth and concurrency rows (§6.3).
- R2: [`research/2026-10-05-cli-custom-agents.md`](./2026-10-05-cli-custom-agents.md). Custom-agent `model` field and how Auto overrides it.
