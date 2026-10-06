# Research Report: GitHub Copilot billing through Azure

**Date:** 2026-10-05
**Researcher:** Copilot MS Docs Researcher Agent
**Topic slug:** copilot-azure-billing
**Sources consulted:** 17 Microsoft Learn pages (16 documentation pages and 1 Microsoft Q&A community thread, all fetched in full; 4 documentation pages added in revision round 2), 0 official Microsoft GitHub repositories, 15 other official sources (13 docs.github.com pages, 1 github.blog post, 1 azure.microsoft.com pricing page), 3 code samples in this report; 1 additional official link was unreachable
**Required MCP:** verified - microsoft-learn; tools used: microsoft_docs_search, microsoft_docs_fetch, microsoft_code_sample_search

> **Assignment:** R9 (appendix) for the deck "Subagents & Multi-Agent Orchestration with GitHub Copilot CLI". Plan details, prices, model multipliers and how subagents or `/fleet` consume usage are owned by **R8** (`copilot-plans-pricing`). Org and enterprise policy governance is owned by **R7**. This report covers only the Azure billing channel and how it fits with GitHub's own billing.

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overview and Key Concepts](#2-overview-and-key-concepts)
3. [Getting Started: Connecting an Azure Subscription](#3-getting-started-connecting-an-azure-subscription)
4. [How Copilot Usage Is Metered and Appears on the Azure Invoice](#4-how-copilot-usage-is-metered-and-appears-on-the-azure-invoice)
5. [Cost Controls: GitHub Budgets vs Azure Cost Management Budgets](#5-cost-controls-github-budgets-vs-azure-cost-management-budgets)
6. [Advanced Topics: Commitments, Pre-Purchase Plans and Credits](#6-advanced-topics-commitments-pre-purchase-plans-and-credits)
7. [Pricing, Limits, Quotas, Currency and Regional Notes](#7-pricing-limits-quotas-currency-and-regional-notes)
8. [Recent Announcements and Timeline](#8-recent-announcements-and-timeline)
9. [Relationship to GitHub's Own Billing (Cross-Reference to R8)](#9-relationship-to-githubs-own-billing-cross-reference-to-r8)
10. [Research Limitations](#10-research-limitations)
11. [Complete Reference List](#11-complete-reference-list)

---

## 1. Executive Summary

**What it is.** An organization or enterprise account on GitHub can connect an Azure subscription as its payment method for metered GitHub usage. When connected, Copilot charges are invoiced by Azure rather than by GitHub ([GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing); [Billing through Azure subscriptions](https://docs.github.com/en/billing/reference/azure-billing)).

> "You can connect an Azure subscription to your organization or enterprise account and pay for Copilot through Azure."
> - Source: [GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing)

**Why it matters for this deck.** Since **June 1, 2026**, Copilot Business and Copilot Enterprise are billed in **GitHub AI Credits** (1 AI credit = $0.01 USD), and Copilot CLI usage consumes AI credits. In an Azure-connected enterprise, AI credit usage beyond the pooled included credits appears on the Azure invoice, next to per-seat license charges. That means heavy multi-agent CLI workflows can raise the Azure bill ([GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/), published 2026-04-27; [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing); [GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing)).

**Key takeaways**

| # | Takeaway | Source |
|---|---|---|
| 1 | Azure billing is available only to **organization and enterprise accounts**, not personal accounts. As a result, the personal plans (Pro, Pro+, and so on) can't be paid through Azure. | [Supported payment methods](https://docs.github.com/en/billing/reference/supported-payment-methods) |
| 2 | Setup takes three roles: a **GitHub org or enterprise owner**, an Azure user with **Owner** on the subscription, and someone who can grant **Microsoft Entra tenant-wide admin consent** for GitHub's Subscription Permission Validation (SPV) app. One person can hold all three, but often it takes two or more. | [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub); [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions) |
| 3 | Several Azure offer types are **unsupported**, including the `PayAsYouGo_2014-09-01` quota ID (which includes MS-AZR-0003P), Free Trial, MSDN, Azure Pass, DreamSpark and Azure for Students. Check the subscription's `quotaId` before you connect. | [Supported payment methods](https://docs.github.com/en/billing/reference/supported-payment-methods); [Subscriptions - Get](https://learn.microsoft.com/rest/api/resources/subscriptions/get) |
| 4 | Copilot usage is sent to Azure **daily** and billed per **calendar month**. Charges appear on the Azure invoice **at the start of the next month**. AI credit overage above the pool is included. **Seat wording differs between sources.** GitHub's Azure billing page says "active seats", while the Copilot licenses page and the Azure pricing page say *assigned* seats counted at the end of the cycle. This report doesn't establish that inactive assigned users are free, so don't present seat charges as activity-based. | [GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing); [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses); [Azure pricing: GitHub Enterprise](https://azure.microsoft.com/en-us/pricing/details/githubenterprise/) |
| 5 | **Azure budgets only send notifications. They don't stop usage.** To hard-stop spending, use GitHub's own budget controls: user-level budgets, and "Stop usage when budget limit is reached" on enterprise, organization and cost center budgets. | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets); [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) |
| 6 | GitHub states that GitHub products on the Azure invoice are **MACC-eligible**. Azure also sells **GitHub Pre-Purchase**, **GitHub AI Credits Pre-Purchase** and **Microsoft Agent Pre-Purchase** plans (one-year term, non-cancellable) that can discount Azure-billed GitHub usage. | [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription); [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase); [GitHub AI Credits pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan) |
| 7 | To use several subscriptions within one enterprise, create **cost centers**. Each cost center can carry its own Azure ID. | [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription); [Using cost centers](https://docs.github.com/en/billing/how-tos/products/use-cost-centers) |

---

## 2. Overview and Key Concepts

### 2.1 What "billing through Azure" means

When you connect an Azure subscription, Azure becomes the payment channel for metered GitHub products. GitHub still handles plans, included usage, policies and budgets. Azure does the invoicing, and it brings Azure's commitment, discount and cost-reporting tools with it ([Billing through Azure subscriptions](https://docs.github.com/en/billing/reference/azure-billing)).

> "When you do, charges for GitHub products (such as Copilot, GitHub Actions, or Codespaces) are billed through Azure instead of directly through GitHub."
> - Source: [Billing through Azure subscriptions](https://docs.github.com/en/billing/reference/azure-billing)

> "When you pay through Azure, your organization’s standard Azure payment methods apply. You will not be billed separately by GitHub for the connected products."
> - Source: [Billing through Azure subscriptions](https://docs.github.com/en/billing/reference/azure-billing)

### 2.2 Supported account types

| Account type | Can pay through Azure? | Notes | Source |
|---|---|---|---|
| Personal account (Copilot Free, Pro, Pro+, Max, Student) | **No** | "Azure Subscription ID – Not available for personal accounts" | [Supported payment methods](https://docs.github.com/en/billing/reference/supported-payment-methods); [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses) |
| Organization account (Copilot Business) | **Yes** | Connected at the organization level | [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub) |
| Enterprise account (Copilot Business and/or Copilot Enterprise) | **Yes** | Connected at the enterprise level. Cost centers can map to additional subscriptions. | [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub); [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription) |
| GitHub Enterprise Cloud bought through a Microsoft Enterprise Agreement | **Required** for Copilot | Connecting an Azure subscription is the only way to use Copilot | [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions) |
| Copilot "standalone" accounts | Yes (historically through Azure) | These accounts "can now also pay by credit card" | [Supported payment methods](https://docs.github.com/en/billing/reference/supported-payment-methods) |

> "If you use GitHub Enterprise Cloud through a Microsoft Enterprise Agreement, connecting an Azure subscription is the only way to use GitHub Advanced Security, GitHub Codespaces, or GitHub Copilot, or to use GitHub Actions, Git Large File Storage (LFS), or GitHub Packages beyond your plan's included amounts."
> - Source: [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions)

> "If you currently pay for your GitHub Enterprise licenses through a volume, subscription, or prepaid agreement, you will continue to be billed in this way until your agreement expires or you are invited to transition. At renewal, you have the option to switch to the metered billing model."
> - Source: [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub)

### 2.3 Usage-based billing primer (context only; details in R8)

Copilot Business and Copilot Enterprise are billed in GitHub AI Credits. Every interaction's input, output and cached tokens are priced per model and converted to credits at **1 AI credit = $0.01 USD**. Each license includes a monthly allotment (**1,900** credits per user for Copilot Business and **3,900** for Copilot Enterprise). The allotments are pooled at the billing-entity level and reset at **00:00:00 UTC on the first day of each calendar month**, with no carry-over ([Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)).

> "Copilot features that use AI models consume AI credits. This includes Copilot Chat, Copilot CLI, Copilot cloud agent, Copilot Spaces, Spark, and third-party coding agents."
> - Source: [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)

Code completions and next edit suggestions are **not** billed in AI credits. GitHub recommends **Copilot CLI 1.0.48** or later so that usage-based billing information displays correctly ([Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)).

### 2.4 Terminology

| Term | Meaning | Source |
|---|---|---|
| **GitHub AI Credits** | Billing unit for Copilot Business and Copilot Enterprise usage. 1 credit = $0.01 USD. | [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) |
| **Copilot Credit** (different product) | A unit for Microsoft Copilot Studio, Dynamics 365 first-party agents and Copilot, used in the Microsoft Agent prepurchase plan. **Not the same as GitHub AI Credits.** | [Microsoft Agent prepurchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/agent-pre-purchase) |
| **SPV app** | GitHub's Subscription Permission Validation app. It is installed in the Entra tenant to list subscriptions and requires tenant-wide admin consent. | [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions) |
| **Cost center** | A GitHub enterprise construct for allocating metered spend. It can be linked to its own Azure subscription. | [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription); [Using cost centers](https://docs.github.com/en/billing/how-tos/products/use-cost-centers) |
| **GCU / GHAICCU / ACU** | Commit units for the GitHub Pre-Purchase, GitHub AI Credits Pre-Purchase and Microsoft Agent prepurchase plans | [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase); [GitHub AI Credits pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan); [Microsoft Agent prepurchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/agent-pre-purchase) |
| **MACC** | Microsoft Azure Consumption Commitment, a contractual Azure spend commitment | [Track your MACC](https://learn.microsoft.com/azure/cost-management-billing/benefits/macc/track-consumption-commitment) |

### 2.5 Availability status (GA/preview) of the principal capabilities

The brief requires every feature to carry a GA or preview label with a source date. A label below is **evidence-backed** only when an official source states the status explicitly. **"No preview notice" is not treated as GA.** Where no official source states the status, the row is marked **UNRESOLVED**: those capabilities must not carry a GA label on slides until an official status statement is found.

**How status was checked (2026-10-05).** Every principal page cited below was read in full for preview or availability wording. Microsoft Learn was also searched for status announcements, with queries such as "What's new in Cost Management GitHub Pre-Purchase Plan generally available" and "GitHub metered billing through Azure subscription generally available announcement". Neither search returned a GA, general-availability or preview statement for any GitHub-billing capability.

**Date conventions.** *Published* is a publication date shown on the source. *`ms.date`* is the Learn article date from page metadata. *Retrieved* means the source shows no date, so the 2026-10-05 retrieval date is given instead. A retrieval date is not a publication date.

| Capability | GA/preview label | Evidence for the label | Source and date |
|---|---|---|---|
| Copilot code review in **Azure DevOps** (separate product path billed to Azure) | **Preview** ("limited preview") | Explicit statement: "This feature is in limited **preview**." | [Get started with Copilot code review for pull requests](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops), `ms.date` 2026-09-29 |
| Connecting an Azure subscription to a GitHub org or enterprise (metered billing via Azure) | **UNRESOLVED** | Documented as a current procedure, with no GA or preview statement | [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub), retrieved 2026-10-05 |
| Copilot usage-based billing (GitHub AI Credits) | **UNRESOLVED** as a GA/preview label. **In effect since 2026-06-01** is evidence-backed. | The announcement gives the transition date for "all GitHub Copilot plans", but the sources use neither "GA" nor "preview" | [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/), published 2026-04-27; [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing), retrieved 2026-10-05 |
| GitHub budget controls for usage-based billing (user-level, cost center, organization and enterprise budgets; "Stop usage when budget limit is reached") | **UNRESOLVED** | Documented as current, with no GA or preview statement | [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets), retrieved 2026-10-05 |
| Cost centers with Azure IDs | **UNRESOLVED** | Documented as current, with no GA or preview statement | [Using cost centers](https://docs.github.com/en/billing/how-tos/products/use-cost-centers); [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription), both retrieved 2026-10-05 |
| GitHub Pre-Purchase Plan (Azure Reservations) | **UNRESOLVED** | Purchasable procedure documented, with no GA or preview statement | [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase), `ms.date` 2026-07-17 |
| GitHub AI Credits Pre-Purchase Plan (Azure Reservations) | **UNRESOLVED** | Purchasable procedure documented, with no GA or preview statement | [GitHub AI Credits pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan), `ms.date` 2026-07-17 |
| Microsoft Agent prepurchase plan (covers GitHub among other services) | **UNRESOLVED** | Purchasable procedure documented, with no GA or preview statement | [Microsoft Agent prepurchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/agent-pre-purchase), `ms.date` not captured; retrieved 2026-10-05 |
| Azure Cost Management budgets (alerting) | **UNRESOLVED** | The tutorial documents current behavior, with no GA or preview statement | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets), retrieved 2026-10-05 |

**Slide guidance.** Only the Azure DevOps row has an evidence-backed label (**Preview**). For every UNRESOLVED row, either leave out the GA/preview badge and add the footnote "Status not stated in official documentation as of 2026-10-05", or get an official status source before publishing. This gap is also recorded in section 10.

---

## 3. Getting Started: Connecting an Azure Subscription

### 3.1 Prerequisites and required roles

| Plane | Required role or permission | Source |
|---|---|---|
| GitHub | "You must be an owner of the GitHub organization or enterprise account you want to connect to Azure." | [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub) |
| Azure subscription | "To select an Azure subscription, you must have owner permissions to the subscription." | [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub) |
| Microsoft Entra ID | You must be able to provide tenant-wide admin consent for the SPV app, or work with a Microsoft Entra Global Administrator to configure an admin consent workflow | [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub); [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions) |
| Microsoft Entra ID (detail) | Learn lists these roles for granting tenant-wide admin consent: **Privileged Role Administrator** (any permission, any API), **Cloud Application Administrator**, **AI Administrator** or **Application Administrator** (any permission except Microsoft Graph app roles), or a custom role with permission to grant permissions to applications | [Grant tenant-wide admin consent to an application](https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent) |
| Input data | The Azure **subscription ID**. Tenant ID may also be needed if the default tenant lacks permissions. | [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub); [Get subscription and tenant IDs in the Azure portal](https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id) |

> "GitHub installs a Subscription Permission Validation app (SPV app) on the Azure tenant, which it uses to get a list of available subscriptions from active directory. Installing the SPV app requires tenant-wide admin consent."
> - Source: [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions)

GitHub notes that if your tenant's user consent settings cover the relevant users, those users might not need admin consent to install the SPV app ([Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions)). Microsoft warns that tenant-wide consent is a sensitive operation and that the requested permissions should be reviewed first ([Grant tenant-wide admin consent to an application](https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent)).

> "Granting admin consent on behalf of an organization is a sensitive operation, potentially allowing the application's publisher access to significant portions of your organization's data, or the permission to do highly privileged operations."
> - Source: [Grant tenant-wide admin consent to an application](https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent)

GitHub also advises that connecting may require "coordination between two different people", because permissions are needed on both GitHub and the Azure billing side ([Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub)).

### 3.2 Eligibility: unsupported Azure subscription types

GitHub publishes a list of Azure subscription types that **cannot** be used as a payment method. It does not publish a list of supported types ([Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods)).

| Quota ID | Offer number(s) |
|---|---|
| `FreeTrial_2014-09-01` | MS-AZR-0044P |
| `AzureForStudents_2018-01-01` | MS-AZR-0170P |
| `DreamSpark_2015-02-01` | MS-AZR-0144P |
| `AzurePass_2014-09-01` | MS-AZR-0120P, MS-AZR-0122P–MS-AZR-0125P, MS-AZR-0128P–MS-AZR-0130P |
| `PayAsYouGo_2014-09-01` | MS-AZR-0001P, MS-AZR-0002P, MS-AZR-0003P, MS-AZR-0006P, MS-AZR-0008P, MS-AZR-0010P, MS-AZR-0011P, MS-AZR-0018P, MS-AZR-0019P, MS-AZR-0030P, MS-AZR-0044P, MS-AZR-0046P, MS-AZR-0048P, MS-AZR-0050P |
| `MSDN_2014-09-01` | MS-AZR-0029P, MS-AZR-0059P, MS-AZR-0062P, MS-AZR-0063P |

*Table reproduced from [Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods), retrieved 2026-10-05.*

A subscription's quota ID is returned in `subscriptionPolicies.quotaId` by the Azure Resource Manager **Subscriptions - Get** API (API version `2022-12-01`) ([Subscriptions - Get](https://learn.microsoft.com/rest/api/resources/subscriptions/get)). The preflight script in 3.4 uses this field.

Other eligibility notes:

- **Enterprise Managed User (EMU) trials.** You can use metered products up to the included limits. To go beyond them, you must link an Azure subscription ([Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)).

> "If you don't use Enterprise Managed Users in your trial of GitHub Enterprise Cloud, connecting an Azure subscription will immediately end your trial and begin paid usage."
> - Source: [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)

- **Prepaid usage.** "Prepaid usage is not currently available for usage-based billing through Azure." ([Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods); [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions))
- **Mixed payment methods.** Accounts that have both volume licenses and metered billing can use more than one payment method. For example, a managed account can pay volume licenses by invoice and metered usage through an Azure Subscription ID ([Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods)).

### 3.3 Step-by-step: connect the subscription (GitHub UI)

The following steps are condensed from [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub). The docs describe only this UI flow; no REST or CLI equivalent was found in the fetched documentation.

1. Go to your organization or enterprise on GitHub.com.
2. Open **Billing & Licensing**. For an organization, it's under "Access" in the settings sidebar. For an enterprise, it's a tab at the top of the page.
3. Select **Payment information**.
4. At the bottom of the page, next to "Metered billing via Azure", select **Add Azure Subscription**.
5. Sign in to your Microsoft account.
6. Review the "Permissions requested" prompt and select **Accept**. If you see a message saying admin approval is needed instead, see 3.5.
7. Under "Select a subscription", choose the Azure Subscription ID. Confirm **By clicking "Connect", you are confirming that you want to be billed for metered services via the selected Azure subscription**, then select **Connect**.

To edit or disconnect the subscription, use the edit (pencil) or delete (trash) icon next to the subscription ID on the same "Payment information" page ([Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub)).

> "If you disconnect your Azure subscription from your account, your usage can no longer exceed the amounts included with your plan."
> - Source: [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub)

### 3.4 Preflight: check the subscription's quota ID (Azure CLI)

The script below reads the subscription's `quotaId` and compares it with GitHub's list of unsupported types before anyone starts the GitHub flow. It uses `az rest` because the quota ID is exposed by the Subscriptions - Get REST API. Microsoft's guidance is to use `az rest` only when no native Azure CLI command is available ([Use the Azure REST API with Azure CLI](https://learn.microsoft.com/cli/azure/use-azure-cli-rest-command?view=azure-cli-latest)). Python isn't used here: the connection itself is UI-only, and the official billing docs provide no Python guidance for this task.

**Before you run it: environment and authorization**

| Requirement | Detail | Source |
|---|---|---|
| Shell | A **Bash** environment: the Bash experience in Azure Cloud Shell, or a local Bash shell. The script uses Bash syntax (`set -euo pipefail`, `[[ ]]`, `case`). In Windows PowerShell or cmd, run it in Cloud Shell, or adapt the quoting and line continuations (the `az rest` page shows a PowerShell variant that uses backtick continuations). | [Use the Azure REST API with Azure CLI](https://learn.microsoft.com/cli/azure/use-azure-cli-rest-command?view=azure-cli-latest) |
| Azure CLI | Installed locally, or use Azure Cloud Shell instead of a local install. If running locally, sign in with `az login`; the script does this itself if no session exists. `az rest` authenticates with the signed-in credential. | [Use the Azure REST API with Azure CLI](https://learn.microsoft.com/cli/azure/use-azure-cli-rest-command?view=azure-cli-latest) |
| Tenant and subscription | Sign in to the Microsoft Entra tenant that contains the subscription. If the subscription doesn't appear in `az account list`, switch directories or tenants first. | [Get subscription and tenant IDs in the Azure portal](https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id) |
| Azure authorization | Read access to the subscription (`Microsoft.Resources/subscriptions/read`). For example, **Reader** grants `*/read`, and **Cost Management Contributor** includes `Microsoft.Resources/subscriptions/read`. The Azure user who will connect GitHub must be a subscription **Owner** anyway (section 3.1), and Owner grants `*`. | [Azure built-in roles for General](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/general); [Azure built-in roles for Management and governance](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/management-and-governance); [Azure built-in roles for Privileged](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/privileged) |
| Input | The subscription ID, passed as the first argument (`./check-quota.sh <subscription-id>`) | [Get subscription and tenant IDs in the Azure portal](https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id) |

The script only reads data. It creates and changes nothing, and it doesn't touch GitHub. A pass result means only that the quota ID is not on GitHub's published unsupported list; it does not guarantee that GitHub will accept the subscription.

```bash
#!/usr/bin/env bash
# Source: https://learn.microsoft.com/rest/api/resources/subscriptions/get (subscriptionPolicies.quotaId, api-version 2022-12-01)
# Source: https://learn.microsoft.com/cli/azure/use-azure-cli-rest-command?view=azure-cli-latest (az rest GET usage)
# Source: https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id (az account list)
# Source: https://docs.github.com/en/billing/reference/supported-payment-methods (unsupported quota IDs, retrieved 2026-10-05)
# Provenance: synthesized
# Purpose: verify an Azure subscription is not on GitHub's unsupported list before connecting it for Copilot billing.
set -euo pipefail

SUBSCRIPTION_ID="${1:?Usage: $0 <azure-subscription-id>}"

# Sign in only if there is no active Azure CLI session.
if ! az account show > /dev/null 2>&1; then
  az login
fi

# Show subscriptions visible to the signed-in user (name, ID, tenant).
az account list --output table

# Subscriptions - Get returns subscriptionPolicies.quotaId.
QUOTA_ID="$(az rest --method get \
  --url "https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}?api-version=2022-12-01" \
  --query "subscriptionPolicies.quotaId" --output tsv)"

if [[ -z "${QUOTA_ID}" ]]; then
  echo "ERROR: could not read quotaId for subscription ${SUBSCRIPTION_ID}." >&2
  exit 2
fi

echo "Subscription ${SUBSCRIPTION_ID} has quotaId: ${QUOTA_ID}"

case "${QUOTA_ID}" in
  FreeTrial_2014-09-01|AzureForStudents_2018-01-01|DreamSpark_2015-02-01|AzurePass_2014-09-01|PayAsYouGo_2014-09-01|MSDN_2014-09-01)
    echo "BLOCKED: GitHub lists quotaId ${QUOTA_ID} as an unsupported Azure subscription type for GitHub billing." >&2
    exit 1
    ;;
  *)
    echo "OK: quotaId ${QUOTA_ID} is not on GitHub's published unsupported list (list retrieved 2026-10-05)."
    ;;
esac
```

> - Source: [Subscriptions - Get](https://learn.microsoft.com/rest/api/resources/subscriptions/get); [Use the Azure REST API with Azure CLI](https://learn.microsoft.com/cli/azure/use-azure-cli-rest-command?view=azure-cli-latest); [Get subscription and tenant IDs in the Azure portal](https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id); [Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods) | Provenance: synthesized

### 3.5 Troubleshooting the connection

| Symptom | Meaning and fix | Source |
|---|---|---|
| "Need admin approval": *"GitHub Inc needs permission to access resources in your organization that only an admin can grant. Please ask an admin to grant permission to this app before you can use it."* | The signed-in Azure user can't install the SPV app. Sign in with an account that can grant tenant-wide admin consent, or configure the admin consent workflow. | [Troubleshooting Azure subscription connection problems](https://docs.github.com/en/billing/how-tos/troubleshooting/azure-sub-connection); [Grant tenant-wide admin consent to an application](https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent) |
| Banner says the Azure ID is missing | "If you see this banner, it means your Azure payment method information is missing." Reconnect the subscription as soon as possible to avoid service interruption. | [Troubleshooting Azure subscription connection problems](https://docs.github.com/en/billing/how-tos/troubleshooting/azure-sub-connection) |
| Subscription reported as "unsupported" | The quota ID is on GitHub's unsupported list (see 3.2 and 3.4). | [Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods) |
| Expected subscription not listed | The default tenant may lack permissions. You may need to specify a different tenant ID. | [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub) |

### 3.6 Switching mid-cycle

If you enable Azure billing partway through a GitHub billing cycle, usage before the switch is charged by GitHub on the next GitHub bill. Usage after the switch is charged by Azure from the date metered billing is enabled ([Billing through Azure subscriptions](https://docs.github.com/en/billing/reference/azure-billing)). GitHub's worked example: if you connect on **June 16** with Copilot Business, usage from June 16 onward is billed through Azure and charged on **July 1**. Earlier charges stay on GitHub's usual billing date ([Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions)).

> "If you link your GitHub account to Azure, any usage-based costs starting from that point will be billed through Azure and charged on the 1st of each month. However, any remaining GitHub charges, for example, charges for your GitHub plan, will still be billed on your usual billing date."
> - Source: [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions)

### 3.7 Multiple Azure subscriptions per enterprise (cost centers)

"There’s no limit to the number of enterprises or cost centers you can connect to a single Azure subscription." To split one enterprise's charges across several subscriptions, create cost centers and connect each one to a different subscription. Usage from a cost center with no connected subscription (or one that is invalid or deleted) is charged to the enterprise's subscription ([Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)).

> "If your account is billed to Azure, you have the option to add an Azure ID. Your credentials will be verified against Azure to ensure the Azure IDs associated to your account are available."
> - Source: [Using cost centers to allocate costs to business units](https://docs.github.com/en/billing/how-tos/products/use-cost-centers)

Allocation rules matter for Copilot. License charges follow the **user** (direct assignment takes priority), then the organization billed for the license. AI credit charges follow the **user who triggered the usage**, then the organization that granted the user's Copilot license. Cost centers apply only to metered usage, not to volume or subscription billing ([Cost center allocation for different products](https://docs.github.com/en/billing/reference/cost-center-allocation)). An enterprise can create up to **1,000** cost centers ([Using cost centers to allocate costs to business units](https://docs.github.com/en/billing/how-tos/products/use-cost-centers)).

---

## 4. How Copilot Usage Is Metered and Appears on the Azure Invoice

### 4.1 What is metered and when

| Aspect | Behavior | Source |
|---|---|---|
| Copilot license metric | "Copilot license usage is measured as the **number of active seats**." **Caution:** other official pages describe billing for *assigned* seats at the end of each monthly cycle (see the next quote and section 10). Don't infer that inactive assigned users aren't billed. | [GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing); [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses) |
| AI credit overage | "If your enterprise exceeds its included pool of AI credits, the cost of any additional usage is included." | [GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing) |
| Transmission cadence | "Usage data is sent daily to Azure." | [GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing) |
| Billing period | Calendar month, from 00:00:00 UTC on the 1st to 23:59:59 UTC on the last day. This applies to all payments made with an Azure subscription ID. | [Billing cycles](https://docs.github.com/en/billing/concepts/billing-cycles) |
| Invoice timing | "Charges for the calendar month appear on your Azure invoice at the start of the next month." | [GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing) |
| Billing date | "Accounts using an Azure subscription ID can access their specific billing date in the Azure commerce portal." | [Billing cycles](https://docs.github.com/en/billing/concepts/billing-cycles) |
| Seat changes | Added seats are billed immediately, prorated. Removing a user revokes access immediately but the full cycle is still billed. | [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses); [Billing cycles](https://docs.github.com/en/billing/concepts/billing-cycles) |
| Code review side-cost | Copilot code review also consumes **GitHub Actions minutes**, billed at standard Actions rates. Actions minutes are a separate Azure-billed usage metric. | [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/); [Billing through Azure subscriptions](https://docs.github.com/en/billing/reference/azure-billing) |

Microsoft's Azure pricing page for GitHub describes the same model from the Azure side ([Azure pricing: GitHub Enterprise](https://azure.microsoft.com/en-us/pricing/details/githubenterprise/)):

> "Billed users are calculated at the end of each billing cycle, based on the number of GitHub Copilot seats that are assigned. Monthly AI credits are provided per user based on the subscription level and pooled at the enterprise level, and admins can set usage limits for individual users. If a user hits the limit, further GitHub Copilot usage is blocked even if there are remaining pooled AI credits. Additionally, capabilities that run on GitHub Actions will be billed per the standard rate."
> - Source: [Azure pricing: GitHub Enterprise](https://azure.microsoft.com/en-us/pricing/details/githubenterprise/)

### 4.2 Why this matters for Copilot CLI and multi-agent workflows

Copilot CLI usage consumes AI credits ([Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)). In an Azure-connected org or enterprise, the cost of usage beyond the included pool is included in what flows to Azure ([GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing)). Putting those two documented facts together: CLI sessions that fan out to subagents or `/fleet` draw down the shared pool first, and anything beyond the pool shows up as Azure-billed overage, unless GitHub budgets or the paid-usage policy block it (see section 5). How much each subagent pattern consumes is covered in **R8**.

### 4.3 How GitHub charges are presented on the Azure invoice

> "After you connect your Azure subscription, usage for GitHub's products are included on your Azure invoice, summarized by product family. Azure usage is separated by **SKU** and either **enterprise ID** or **cost center ID**. The format used is `enterprise:sku` or `costcenter:sku`."
> - Source: [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)

> "Azure currently shows internal IDs, which may make it difficult to identify the corresponding enterprise or cost center."
> - Source: [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)

GitHub's invoice example lists product-family lines such as `GH ENTERPRISE` and `GH ADVANCED SECURITY` ([Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)). The fetched sources don't show the exact product-family label or Cost Management meter names for **GitHub.com Copilot** charges (see section 10).

**Practitioner tip (synthesized, not an official procedure).** Because internal IDs appear on the invoice, record each enterprise's and cost center's internal ID when you connect it. In Azure Cost Management, group cost analysis by meter category, meter subcategory or product to find the labels your tenant actually uses before you build filters. This tip follows from the invoice behavior quoted above.

### 4.4 Related but distinct: Copilot code review in Azure DevOps (preview)

Azure DevOps has its own GitHub Copilot code review feature for Azure Repos, which is in "limited **preview**" (Learn `ms.date` 2026-09-29). It is billed to the Azure subscription linked to the **Azure DevOps organization**, not through a GitHub.com connection. It uses the same unit (1 GitHub AI credit = $0.01 USD), and it is the only official source found that names a GitHub meter in Cost Management: **Meter category `GitHub`**, **Meter subcategory `GitHub Copilot for AzDO`**, with tags `_organizationname_` and `_projectname_`. Charges take **48 hours** to appear ([Get started with Copilot code review for pull requests](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops)).

> "Charges go to the Azure subscription linked to your Azure DevOps organization and appear as a separate meter in Azure Cost Management."
> - Source: [Get started with Copilot code review for pull requests](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops)

Don't assume the AzDO meter names apply to GitHub.com Copilot Business or Enterprise charges. The official sources don't establish that.

---

## 5. Cost Controls: GitHub Budgets vs Azure Cost Management Budgets

### 5.1 Where enforcement happens

Azure Cost Management budgets **only notify**. GitHub's budget controls are what can **block** Copilot usage. Use both: GitHub for enforcement, Azure for finance visibility and alerting.

> "Notifications are triggered when the budget thresholds are exceeded. Resources aren't affected, and your consumption isn't stopped."
> - Source: [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets)

| GitHub control | Caps | Active when | Hard stop? |
|---|---|---|---|
| Universal user-level budget | Each user's total AI credit consumption | Always (pool + metered) | Always |
| Cost center user-level budget | Each member's total consumption; overrides universal | Always (pool + metered) | Always |
| Individual user-level budget | One user's total consumption; overrides universal and cost center user-level budgets | Always (pool + metered) | Always |
| Cost center budget | A team's metered charges after the pool is exhausted | Metered phase only | Only if "Stop usage when budget limit is reached" is enabled |
| Organization budget | An organization's metered charges after the pool is exhausted | Metered phase only | Only if "Stop usage when budget limit is reached" is enabled |
| Enterprise budget | Total enterprise metered charges after the pool is exhausted, **excluding** cost centers with cost center exclusion enabled | Metered phase only | Only if "Stop usage when budget limit is reached" is enabled |

*Table condensed from [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets).*

> "\"Stop usage when budget limit is reached\" applies to enterprise spending limits, cost center budgets, and organization budgets only, and is off by default. Without it, charges continue to accrue past the limit. Always enable it when creating a budget."
> - Source: [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)

> "Additional usage is **enabled by default** for organizations and enterprises. If you want to prevent any spending beyond your included AI credits, an administrator must explicitly disable the **AI credits paid usage** policy in your enterprise's or organization's AI Controls settings."
> - Source: [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)

> "The enterprise budget is not a total monthly budget. It only caps metered charges after the pool is exhausted. Your total maximum bill is your license fees plus the enterprise budget."
> - Source: [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)

GitHub's worked example: 400 Copilot Business licenses at $19 USD gives $7,600 USD in license fees. Add a $5,000 USD enterprise budget and the maximum bill is **$12,600 USD**, not $5,000 USD ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)). Owners and billing managers can set these budgets ([GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses)).

**The $12,600 USD ceiling only holds if all of these conditions are true.** Each one comes from GitHub's documentation:

1. **"Stop usage when budget limit is reached" is enabled on the enterprise budget.** It is off by default. Without it, "charges continue to accrue past the limit", so the enterprise budget is not a ceiling at all ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)).
2. **No cost center has cost center exclusion enabled.** Excluded cost centers are outside the enterprise cap and add charges on top of the example total. They are limited only by their own cost center budget, and that budget stops usage only if its own stop-usage setting is enabled ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets#cost-center-exclusion)).
3. **The license base stays at 400 seats for the cycle.** Seats added mid-cycle are billed immediately on a prorated basis, which raises the license component ([GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses)).

> "When exclusion is enabled for a cost center, that team's metered charges are not counted against the enterprise budget and will not be blocked when the enterprise budget is reached. Their spending is capped only by their own cost center budget."
> - Source: [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets#cost-center-exclusion)

**Scope of the example.** It covers only Copilot license fees and Copilot AI-credit metered charges. Other GitHub products billed through the same Azure subscription are outside it. That includes the GitHub Actions minutes consumed by Copilot code review, GitHub Enterprise and GitHub Advanced Security, as well as taxes. An Azure Cost Management budget can't stand in for a missing GitHub stop-usage setting, because Azure budgets only notify ([Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets)). When all three conditions hold, $12,600 USD is the most these Copilot items can add to the Azure invoice for the cycle in GitHub's example.

### 5.2 Azure Cost Management budgets: facts that matter

| Fact | Detail | Source |
|---|---|---|
| Effect | Notify only. Resources and consumption aren't affected. | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| Latency | Cost and usage data typically arrives within 8–24 hours. Budgets are evaluated every 24 hours, and emails normally go out within an hour of evaluation. | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| New subscriptions | Up to 48 hours before all Cost Management features are usable | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| Roles (budget authoring) | **Owner**: create, modify or delete subscription budgets. **Contributor** and **Cost Management Contributor**: create, modify or delete their own budgets, and change the amount on others' budgets. **Reader** and **Cost Management Reader**: view. These roles cover **budget** authoring (for example in the portal). They don't automatically cover ARM/Bicep **deployment**, which is a separate permission (see 5.3). | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| Alerts | At least one threshold is required. Up to five thresholds and five email addresses per budget. Actual or Forecasted. Thresholds range from 0.01% to 1000%. | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| Automation | Action groups are supported at subscription and resource group scopes | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| Currency | MCA billing account scope is evaluated in USD. Billing profile, invoice section and customer scopes use the billing currency. Multi-currency budget evaluation isn't supported. | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| First-party filter caveat | Filtering a budget to `Publisher Type: Azure` and `Charge Type: Usage` restricts it to first-party Azure consumption. Whether GitHub charges match those values isn't documented, so check before filtering. | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |

### 5.3 Code: subscription-scoped Azure budget for the GitHub-billing subscription

**Design option (synthesized, not an official recommendation).** No official source documents the meter category for GitHub.com Copilot charges. A whole-subscription budget with no filter gives clean GitHub-only alerting when the subscription linked to GitHub is used **only** for GitHub billing. GitHub supports this pattern: any number of enterprises or cost centers can share one subscription, and cost centers can point at separate subscriptions ([Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)).

The Bicep template below is the official "No filter" template ([Quickstart: Create a budget with Bicep](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep)). Save it as `main.bicep`.

```bicep
// Source: https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep ("No filter")
// Provenance: verbatim (template body unchanged; only these two comment lines added)
targetScope = 'subscription'

@description('Name of the Budget. It should be unique within a resource group.')
param budgetName string = 'MyBudget'

@description('The total amount of cost or usage to track with the budget')
param amount int = 1000

@description('The time covered by a budget. Tracking of the amount will be reset based on the time grain.')
@allowed([
  'Monthly'
  'Quarterly'
  'Annually'
])
param timeGrain string = 'Monthly'

@description('The start date must be first of the month in YYYY-MM-DD format. Future start date should not be more than three months. Past start date should be selected within the timegrain preiod.')
param startDate string

@description('The end date for the budget in YYYY-MM-DD format. If not provided, we default this to 10 years from the start date.')
param endDate string

@description('Threshold value associated with a notification. Notification is sent when the cost exceeded the threshold. It is always percent and has to be between 0.01 and 1000.')
param firstThreshold int = 90

@description('Threshold value associated with a notification. Notification is sent when the cost exceeded the threshold. It is always percent and has to be between 0.01 and 1000.')
param secondThreshold int = 110

@description('The list of email addresses to send the budget notification to when the threshold is exceeded.')
param contactEmails array

resource budget 'Microsoft.Consumption/budgets@2023-11-01' = {
  name: budgetName
  properties: {
    timePeriod: {
      startDate: startDate
      endDate: endDate
    }
    timeGrain: timeGrain
    amount: amount
    category: 'Cost'
    notifications: {
      NotificationForExceededBudget1: {
        enabled: true
        operator: 'GreaterThan'
        threshold: firstThreshold
        contactEmails: contactEmails
      }
      NotificationForExceededBudget2: {
        enabled: true
        operator: 'GreaterThan'
        threshold: secondThreshold
        contactEmails: contactEmails
      }
    }
  }
}

output name string = budget.name
output resourceId string = budget.id
```

> - Source: [Quickstart: Create a budget with Bicep](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep) | Provenance: verbatim

Deploy it at subscription scope. The official CLI snippet assigns the email array with a space before `=`, which fails as a Bash assignment. This version passes the array inline using the Bash JSON-array syntax documented for Bicep deployments.

**Before you deploy: environment and authorization**

| Requirement | Detail | Source |
|---|---|---|
| Shell | **Bash**: Azure Cloud Shell, or a local Bash shell. Azure CLI samples for Bicep are written for `bash`. In cmd or PowerShell, pass arrays as `exampleArray="['value1','value2']"` and adapt the line continuations. | [Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#prerequisites) |
| Azure CLI version | **2.20.0 or later** to deploy Bicep files. Run `az version` to check. | [Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#prerequisites) |
| Template file | `main.bicep` (the template above) saved **locally** in the current directory. The Azure CLI doesn't deploy remote Bicep files. | [Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#prerequisites); [Quickstart: Create a budget with Bicep](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep) |
| Sign-in and context | `az login` to the tenant that owns the subscription, then `az account set` to the subscription **linked to GitHub**. The script does both. | [Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#prerequisites) |
| New subscription | Cost Management features can take up to 48 hours to become available on a new subscription | [Quickstart: Create a budget with Bicep](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep) |
| **Authorization: two separate permissions at subscription scope** | (1) **Budget write**: one of the budget-authoring roles in 5.2. (2) **ARM deployment**: "write access on the resources you're deploying and access to all operations on the `Microsoft.Resources/deployments` resource type". Both are required for this script. | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets); [Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#required-permissions) |
| Roles that satisfy both | **Owner** (`*`) and **Contributor** (`*`, whose NotActions don't exclude deployments or budgets) | [Azure built-in roles for Privileged](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/privileged) |
| Role that is **not** enough | **Cost Management Contributor alone isn't sufficient for this deployment path.** Its actions include `Microsoft.Consumption/*` and `Microsoft.CostManagement/*` (enough to author budgets) but not `Microsoft.Resources/deployments/*`. | [Azure built-in roles for Management and governance](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/management-and-governance) |

> "To deploy a Bicep file or Azure Resource Manager (ARM) template, you need write access on the resources you're deploying and access to all operations on the `Microsoft.Resources/deployments` resource type."
> - Source: [Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#required-permissions)

```bash
#!/usr/bin/env bash
# Source: https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep (az deployment sub create; az consumption budget list)
# Source: https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli (prerequisites, required permissions, Bash inline array syntax)
# Provenance: adapted - official deployment command retained; array passed with the documented Bash JSON-array form;
#             added strict mode, sign-in, subscription selection, local-file check, failure guidance and example values.
# Requires: Bash, Azure CLI 2.20.0+, local main.bicep, budget-write AND Microsoft.Resources/deployments/* at subscription scope.
set -euo pipefail

SUBSCRIPTION_ID="${1:?Usage: $0 <azure-subscription-id-linked-to-github>}"

# The Azure CLI deploys local Bicep files only.
if [[ ! -f main.bicep ]]; then
  echo "ERROR: main.bicep not found in $(pwd). Save the 'No filter' template from the budget quickstart as main.bicep." >&2
  exit 1
fi

az login
az account set --subscription "${SUBSCRIPTION_ID}"

# startDate must be the first day of a month (YYYY-MM-DD); amount is in the budget scope's evaluation currency.
if ! az deployment sub create \
  --name githubBillingBudget \
  --location centralus \
  --template-file main.bicep \
  --parameters budgetName=github-billing-monthly amount=5000 \
               startDate=2026-10-01 endDate=2027-09-30 \
               contactEmails='["finops@contoso.com", "github-admins@contoso.com"]'; then
  echo "ERROR: deployment failed. If the error is an authorization failure, the signed-in identity lacks budget write" >&2
  echo "       and/or Microsoft.Resources/deployments/* on this subscription (Cost Management Contributor alone is not enough)." >&2
  echo "       Ask a subscription administrator for the appropriate access, or create the budget in the Azure portal instead." >&2
  exit 1
fi

# Confirm the budget exists in the selected subscription.
az consumption budget list --output table
```

> - Source: [Quickstart: Create a budget with Bicep](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep); [Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli) | Provenance: adapted

**If the deployment fails with an authorization error.** The script doesn't assign or elevate any role, and you shouldn't grant broad roles just to get it working. Choose one of these:

- **Portal path, for budget-only roles.** Create the budget under **Subscriptions** > *subscription* > **Budgets** > **Add**. The budgets tutorial lists Cost Management Contributor as able to create budgets, and this path doesn't need ARM deployment permission ([Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets)).
- **Ask for deployment access.** Request it from a subscription administrator through your normal access process, following least privilege. The deployment needs `Microsoft.Resources/deployments/*` in addition to budget write ([Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#required-permissions)).
- **Have someone else run it.** An identity that already holds Owner or Contributor on the subscription can run the script ([Azure built-in roles for Privileged](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/privileged)).

The same quickstart provides an Az PowerShell equivalent (`New-AzSubscriptionDeployment`) and a "Two or more filters" template with a `MeterCategory` dimension filter, for teams that have confirmed their GitHub meter category in cost analysis ([Quickstart: Create a budget with Bicep](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep)).

### 5.4 Pitfalls checklist

1. **Unsupported offer.** `PayAsYouGo_2014-09-01` (including MS-AZR-0003P) is unsupported. Run the preflight in 3.4 ([Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods)).
2. **Consent blocker.** Plan for the Entra admin who will consent to the SPV app ([Troubleshooting Azure subscription connection problems](https://docs.github.com/en/billing/how-tos/troubleshooting/azure-sub-connection)).
3. **Azure budgets don't stop spend.** Enforce limits in GitHub ([Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets); [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)).
4. **Paid usage is on by default**, and "Stop usage when budget limit is reached" is **off** by default ([Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing); [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)).
5. **Users licensed by multiple organizations.** GitHub picks one organization at random each cycle to bill the seat, so organization-budget enforcement becomes unpredictable ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)).
6. **Non-EMU trial.** Connecting Azure ends the trial immediately ([Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)).
7. **Disconnecting Azure** caps usage at the plan's included amounts ([Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub)).
8. **Name confusion.** "Copilot Credit" (Copilot Studio) is not "GitHub AI Credits" ([Microsoft Agent prepurchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/agent-pre-purchase); [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)).
9. **Excluded cost centers bypass the enterprise cap.** Their charges are bounded only by their own cost center budget and its stop-usage setting ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets#cost-center-exclusion)).
10. **Budget role ≠ deployment permission.** Cost Management Contributor can author budgets but can't run `az deployment sub create`, because it lacks `Microsoft.Resources/deployments/*` ([Azure built-in roles for Management and governance](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/management-and-governance); [Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli#required-permissions)).

---

## 6. Advanced Topics: Commitments, Pre-Purchase Plans and Credits

### 6.1 MACC eligibility

GitHub documents that GitHub products billed on the Azure invoice count toward a Microsoft Azure Consumption Commitment ([Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)).

> "The GitHub products on your Azure invoice are also MACC-eligible."
> - Source: [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)

Microsoft Learn's MACC article adds context but doesn't list GitHub by name. MACC tracking in the Azure portal is available only to **direct** MCA and **direct** EA customers. Viewing the balance requires **Enterprise Administrator** (EA) or **Owner, Contributor or Reader** on the billing account (MCA) ([Track your MACC](https://learn.microsoft.com/azure/cost-management-billing/benefits/macc/track-consumption-commitment)).

> "If your organization receives Azure credits from Microsoft, consumption or purchases that those credits cover don't contribute to your MACC."
> - Source: [Track your MACC](https://learn.microsoft.com/azure/cost-management-billing/benefits/macc/track-consumption-commitment)

**Implication (derived from the two sources above).** To count Copilot spend toward a MACC, connect GitHub to a subscription under the billing account that holds the commitment, and keep in mind that credit-funded consumption doesn't decrement MACC. Learn doesn't state this GitHub-specific procedure explicitly (see section 10).

### 6.2 Azure pre-purchase plans that cover GitHub usage

Azure Reservations offers three pre-purchase ("P3") plans that pay down Azure-billed GitHub usage. All three share these properties: commit units are bought at discounted tiers in your purchasing currency and pay down qualifying costs in **USD**; the term is **one year**; auto-renew is **on by default**; plans **can't be split or merged**; and **cancellations and exchanges aren't supported** ([GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase); [GitHub AI Credits pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan); [Microsoft Agent prepurchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/agent-pre-purchase)).

| Plan (Azure portal name) | Commit unit | Covers | Applied in overlap | Learn `ms.date` |
|---|---|---|---|---|
| **GitHub AI Credits Pre-Purchase Plan** | GitHub AI Credits CUs (GHAICCUs) | GitHub AI Credits usage | 1st | 2026-07-17 |
| **GitHub Pre-Purchase Plan** | GitHub CUs (GCUs) | All GitHub services, including GitHub Enterprise, GitHub Copilot, GitHub Advanced Security, Actions, Codespaces, Packages, LFS and "any GitHub AI Overage Units" | 2nd | 2026-07-17 |
| **Microsoft Agent Prepurchase Plan** | Agent CUs (ACUs) | Broader AI workloads, including Copilot Credit, Microsoft Foundry and GitHub | 3rd | Not captured |

*Precedence order from [GitHub AI Credits pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan) and [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase).*

> "The GitHub Pre-Purchase plan covers usage across all products under the GitHub services umbrella, including GitHub Enterprise, GitHub Copilot, GitHub Advanced Security, and GitHub Actions, Codespaces, Packages, Large File Storage and any GitHub AI Overage Units among others."
> - Source: [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase)

**Scope alignment is critical.** The plan's scope (single resource group, single subscription, shared, or management group) must include the subscription linked to GitHub. Otherwise the plan won't apply. If multiple GitHub accounts are linked to different subscriptions, Learn suggests **Shared** or **Management group** scope ([GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase)).

> "Cancel and exchange operations aren't supported for **GitHub Pre-Purchase Plans**. All purchases are final."
> - Source: [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase)

**Purchase roles.** You need the **Owner** or **Reservation Purchaser** role on the Azure subscription. On EA, the **Reserved Instances** policy must be enabled by an EA administrator. CSP customers purchase through, or with permission from, their partner. Purchase path: Azure portal > **Reservations** > **Purchase reservations** > select the plan ([GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase); [GitHub AI Credits pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan)).

**Discount figures are illustrative only.** Learn's examples use "hypothetical prices and quantities". For example, a GitHub AI Credits Tier 1 (20,000 CU) plan at a hypothetical $19,000 gives about 5% savings. A GitHub Pre-Purchase Tier 2 (120,000 CUs) at $112,800 gives about 6%, and Tier 3 (500,000 GCUs) at $425,000 gives 15%. Pre-purchase discounts **don't combine** with other discounts. Check the Azure portal for actual tiers and prices ([GitHub AI Credits pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan); [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase)).

**Reconciling "no prepaid usage".** GitHub says "Prepaid usage is not currently available for usage-based billing through Azure" ([Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods)). The Azure pre-purchase plans are Azure Reservations commit units that are applied automatically to qualifying GitHub usage billed through Azure, during the plan term and within the plan scope ([GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase)). That makes them an Azure-side commitment discount, not GitHub-side prepaid usage. *This distinction is an interpretation. Neither source cross-references the other (see section 10).*

### 6.3 Azure credits (for example, Microsoft for Startups)

Microsoft for Startups guidance (Learn `ms.date` 2026-05-27) says GitHub usage can be paid from sponsored Azure credits only after the subscription is connected to GitHub. For Copilot, it says to "Confirm your GitHub billing model supports metered billing through Azure, then connect the Azure subscription." ([Best Ways to Use Startup Credits](https://learn.microsoft.com/startups/benefits/azure-credits/use-azure-credits))

> "GitHub usage is not covered by startup credits out-of-the-box. You must connect your Azure subscription as a payment method in GitHub before you can apply credits to eligible usage-based GitHub services"
> - Source: [Best Ways to Use Startup Credits](https://learn.microsoft.com/startups/benefits/azure-credits/use-azure-credits)

Credit-funded consumption doesn't contribute to MACC ([Track your MACC](https://learn.microsoft.com/azure/cost-management-billing/benefits/macc/track-consumption-commitment)).

---

## 7. Pricing, Limits, Quotas, Currency and Regional Notes

Prices below are GitHub list prices as published. **R8 owns the authoritative plan and pricing detail.** The Azure pricing page for GitHub rendered prices as `$-` placeholders when fetched, so Azure-specific displayed prices couldn't be captured ([Azure pricing: GitHub Enterprise](https://azure.microsoft.com/en-us/pricing/details/githubenterprise/)).

| Item | Value | Effective date / context | Source |
|---|---|---|---|
| Copilot Business | $19 USD per user per month, including $19 in monthly AI Credits (1,900 credits) | Unchanged under usage-based billing from 2026-06-01 | [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/); [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) |
| Copilot Enterprise | $39 USD per user per month, including $39 in monthly AI Credits (3,900 credits) | Unchanged under usage-based billing from 2026-06-01 | Same as above |
| AI credit unit price | 1 AI credit = $0.01 USD; GitHub budgets are set in USD | Current as retrieved 2026-10-05 | [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) |
| Promotional included usage (existing customers) | Business: $30 in monthly AI Credits; Enterprise: $70 in monthly AI Credits | June, July and August 2026 (now ended as of 2026-10-05) | [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) |
| Enterprises / cost centers per Azure subscription | No limit | Current | [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription) |
| Cost centers per enterprise | Up to 1,000 | Current | [Using cost centers](https://docs.github.com/en/billing/how-tos/products/use-cost-centers) |
| Azure budget alerts | At least 1, up to 5 thresholds and 5 emails per budget | Current | [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| Pre-purchase plan term | 1 year, auto-renew default, non-cancellable | Learn `ms.date` 2026-07-17 | [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase) |

**Currency notes**

- Copilot usage units are USD-denominated: AI credits are $0.01 USD each, and GitHub budgets are set in USD ([Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)).
- Pre-purchase commit units are bought "in your purchasing currency" and "pay down qualifying costs in US dollars (USD)" ([GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase)).
- Azure budget evaluation currency depends on scope: USD at MCA billing-account scope, billing currency at billing profile, invoice section or customer scope. Multi-currency scopes aren't supported ([Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets)).
- No official source fetched explains how USD-denominated GitHub charges are converted on non-USD Azure invoices (see section 10).

**Regional and cloud notes**

- The Microsoft Agent prepurchase plan states: "Service availability varies by cloud and region." ([Microsoft Agent prepurchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/agent-pre-purchase))
- Azure budgets in sovereign clouds such as China 21V are always evaluated in the billing currency ([Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets)). No fetched source documents whether GitHub billing through Azure supports sovereign-cloud subscriptions.

---

## 8. Recent Announcements and Timeline

| Date | Event | Source |
|---|---|---|
| 2025-12-01 | Self-serve, metered GitHub Enterprise Cloud accounts **paying by credit card** moved to a 1st-of-month billing date. This doesn't apply to Azure; Azure-billed accounts find their billing date in the Azure commerce portal. | [Billing cycles](https://docs.github.com/en/billing/concepts/billing-cycles) |
| 2026-04-27 | GitHub announces that all Copilot plans move to usage-based billing (blog by Mario Rodriguez, CPO) | [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) |
| Early May 2026 | "Preview bill" experience on the Billing Overview page | Same as above |
| 2026-06-01 | Usage-based billing takes effect. Premium request units (PRUs) are replaced by GitHub AI Credits, fallback to lower-cost models ends, and base plan prices are unchanged. | Same as above |
| June–August 2026 | Promotional included usage for existing Business ($30) and Enterprise ($70) customers | Same as above |
| 2026-07-17 | Learn pages for the GitHub Pre-Purchase Plan and GitHub AI Credits Pre-Purchase Plan last updated (`ms.date`) | [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase); [GitHub AI Credits pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan) |
| 2026-09-29 | Learn page for Azure DevOps Copilot code review (limited preview, Azure-billed, `GitHub` meter category) last updated | [Get started with Copilot code review for pull requests](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops) |

> "Today, we are announcing that all GitHub Copilot plans will transition to usage-based billing on **June 1, 2026**."
> - Source: [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) (published 2026-04-27)

The same post says that, as temporary reliability measures, GitHub "paused self-serve Copilot Business plan purchases" and changed the individual plans. It also says that under the new model, "usage will instead be governed by available credits and admin budget controls" ([GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/)). The current status of that pause wasn't verified for this report; it belongs to R8.

---

## 9. Relationship to GitHub's Own Billing (Cross-Reference to R8)

| Concern | Owned by GitHub (configure on GitHub.com) | Owned by Azure (configure in the Azure portal) | Source |
|---|---|---|---|
| Plans, seats, included AI credits, model pricing | Yes | No | [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) |
| Paid-usage policy, user, cost center, organization and enterprise budgets (enforcement) | Yes | No | [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets) |
| Cost centers and their Azure IDs | Yes | No (Azure IDs are verified against Azure) | [Using cost centers](https://docs.github.com/en/billing/how-tos/products/use-cost-centers) |
| Payment channel and invoice | Selects the Azure subscription | Invoices monthly, using standard Azure payment methods | [Billing through Azure subscriptions](https://docs.github.com/en/billing/reference/azure-billing) |
| Cost visibility and alerting | Usage pages and reports | Cost Management cost analysis and budgets (notify-only) | [Cost center allocation](https://docs.github.com/en/billing/reference/cost-center-allocation); [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| Commitments and discounts | Not available ("Prepaid usage is not currently available" through Azure) | MACC eligibility; GitHub, GitHub AI Credits and Microsoft Agent pre-purchase plans | [Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods); [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription); [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase) |

**Hand-off to R8:** plan matrix (Free, Pro, Pro+, Max, Business, Enterprise), model rates and multipliers, how subagents, `/fleet` and code review consume AI credits, and annual-plan transition rules.

---

## 10. Research Limitations

**Documentation gaps**

1. **GitHub.com Copilot meter names in Cost Management aren't documented.** The only official meter naming found is for the separate Azure DevOps path (`GitHub` / `GitHub Copilot for AzDO`) ([Get started with Copilot code review for pull requests](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops)). GitHub's invoice example shows only the `GH ENTERPRISE` and `GH ADVANCED SECURITY` product families ([Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)). The product-family label for Copilot wasn't found.
2. **MACC eligibility rests on GitHub's documentation.** Learn's MACC article doesn't name GitHub ([Track your MACC](https://learn.microsoft.com/azure/cost-management-billing/benefits/macc/track-consumption-commitment)). The eligibility statement comes from [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription). No official source explains how to make sure GitHub charges land under the MACC billing account. The guidance in 6.1 is derived.
3. **No list of supported Azure offers.** GitHub publishes only the unsupported list ([Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods)). EA support is implied by [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions), but no positive list exists for MCA or CSP offers.
4. **Minimum Entra role for the SPV app.** The SPV app's client ID and requested permissions aren't published in the fetched docs, so the minimum sufficient Entra role can't be determined. Privileged Role Administrator is the documented superset ([Grant tenant-wide admin consent to an application](https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent)).
5. **Currency conversion and sovereign clouds.** No fetched source covers FX conversion of USD-denominated GitHub charges on non-USD Azure invoices, or Azure billing for GitHub in sovereign clouds.
6. **Data latency in Cost Management.** Latency for GitHub.com charges isn't documented. The Azure general figure is 8–24 hours ([Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets)), and the Azure DevOps Copilot code review path is 48 hours.
7. **No API or CLI for connecting.** The fetched docs describe only the GitHub UI flow for connecting a subscription ([Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub)).
8. **GA/preview status is unresolved for most capabilities (relevant to the brief's labeling rule).** No official source states GA or preview for these capabilities:
   - Azure subscription connection
   - Copilot usage-based billing (as a GA/preview label; its 2026-06-01 effective date is documented)
   - GitHub budget controls
   - Cost centers with Azure IDs
   - The three pre-purchase plans
   - Azure Cost Management budgets

   The only evidence-backed label is **Preview** for Azure DevOps Copilot code review. The Learn searches run on 2026-10-05 to find status announcements returned none. These rows are marked **UNRESOLVED** in section 2.5 and must not be labeled GA on slides without a new official status source ([Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub); [GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase); [Get started with Copilot code review for pull requests](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops)).

**Inconsistencies and conflicts (with resolution)**

1. **MS-AZR-0003P support.** A Microsoft Q&A answer dated 2026-08-03 says MS-AZR-0003P "is supported" and that Sponsorship offers are unsupported ([Microsoft Q&A thread](https://learn.microsoft.com/answers/a/12897076)). That answer is from a **volunteer moderator** in a tag marked "Not monitored" by Microsoft. GitHub's table lists MS-AZR-0003P under `PayAsYouGo_2014-09-01` as unsupported and doesn't list Sponsorship ([Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods)). In the same thread, the asker's follow-up reports that a newly created subscription still showed `PayAsYouGo_2014-09-01` and was rejected, which is consistent with GitHub's table. **Resolution:** GitHub docs are treated as authoritative. Microsoft for Startups guidance also indicates that sponsored subscriptions can pay GitHub usage ([Best Ways to Use Startup Credits](https://learn.microsoft.com/startups/benefits/azure-credits/use-azure-credits)).
2. **UI path wording.** The Microsoft for Startups page describes "Billing and Payments" > "Add payment method" > "Azure subscription" ([Best Ways to Use Startup Credits](https://learn.microsoft.com/startups/benefits/azure-credits/use-azure-credits)). GitHub's current docs describe "Billing & Licensing" > "Payment information" > "Add Azure Subscription" ([Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub)). **Resolution:** follow GitHub, which owns the UI.
3. **Mapping granularity.** The Learn pre-purchase pages say "Each GitHub organization is linked to a specific Azure subscription" ([GitHub Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase)). GitHub supports enterprise-level connections and cost-center-level subscriptions ([Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)). **Resolution:** use GitHub's model, and make sure the pre-purchase scope covers every linked subscription.
4. **Seat metric wording.** "Active seats" ([GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing); [Billing through Azure subscriptions](https://docs.github.com/en/billing/reference/azure-billing)) versus "number of assigned seats at the end of each monthly billing cycle" ([GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses); [Azure pricing: GitHub Enterprise](https://azure.microsoft.com/en-us/pricing/details/githubenterprise/)). Unresolved. Quote the source you rely on.
5. **Policy name.** "AI credits paid usage" ([Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing)) versus "AI credit paid usage" ([Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)). Verify the UI label before putting it on a slide.
6. **"No prepaid usage through Azure" versus Azure pre-purchase plans.** The reconciliation in 6.2 is an interpretation. The sources don't cross-reference each other.

**Stale or unreachable sources**

- The FAQ discussion linked from the 2026-04-27 blog ([github.com/orgs/community/discussions/192948](https://github.com/orgs/community/discussions/192948)) returned "You can’t perform that action at this time." when fetched without sign-in, so it wasn't used.
- The Azure pricing page rendered prices as `$-`, so no Azure-displayed prices were captured ([Azure pricing: GitHub Enterprise](https://azure.microsoft.com/en-us/pricing/details/githubenterprise/)).
- Learn `ms.date` values were captured for 4 pages (shown in the reference list). docs.github.com pages don't show a date in fetched content and are treated as current as of 2026-10-05.
- The Bicep CLI deployment page was originally used only through a code-sample search result. In revision round 2 it was **fetched in full**, and it now also supports the deployment prerequisites and permission requirements in 5.3.

**Scope boundaries and intentional exclusions**

- Plan matrix, model rates and multipliers, and subagent or `/fleet` consumption belong to **R8**. Policy governance (AI Controls, model and agent policies) belongs to **R7**.
- Microsoft 365 Copilot and Copilot Studio "Copilot Credits" billing is excluded, except to tell it apart from GitHub AI Credits.
- Azure DevOps Copilot code review is included only as a related but distinct Azure-billed path.
- Python is not applicable: connecting is a GitHub UI task, and the official GitHub billing docs give no Python guidance. Azure CLI and Bicep are used instead.

---

## 11. Complete Reference List

### Microsoft Learn Documentation (12, all fetched in full)

1. [Optimize GitHub costs with a Pre-Purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-pre-purchase) (`ms.date` 2026-07-17)
2. [Optimize GitHub AI Credits costs with a pre-purchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/github-ai-credits-pre-purchase-plan) (`ms.date` 2026-07-17)
3. [Optimize Microsoft Foundry, Microsoft Copilot Studio, Microsoft Fabric, and GitHub costs with Microsoft Agent prepurchase plan](https://learn.microsoft.com/azure/cost-management-billing/reservations/agent-pre-purchase) (date not captured)
4. [Track your Microsoft Azure Consumption Commitment (MACC)](https://learn.microsoft.com/azure/cost-management-billing/benefits/macc/track-consumption-commitment) (date not captured)
5. [Tutorial: Create and manage budgets](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) (date not captured)
6. [Quickstart: Create a budget with Bicep](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-create-budget-bicep) (date not captured)
7. [Grant tenant-wide admin consent to an application](https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent) (date not captured)
8. [Get subscription and tenant IDs in the Azure portal](https://learn.microsoft.com/azure/azure-portal/get-subscription-tenant-id) (date not captured)
9. [Subscriptions - Get (Resource Management REST API, version 2022-12-01)](https://learn.microsoft.com/rest/api/resources/subscriptions/get)
10. [Use the Azure REST API with Azure CLI](https://learn.microsoft.com/cli/azure/use-azure-cli-rest-command?view=azure-cli-latest) (date not captured)
11. [Best Ways to Use Startup Credits](https://learn.microsoft.com/startups/benefits/azure-credits/use-azure-credits) (`ms.date` 2026-05-27; updated 2026-06-11)
12. [Get started with Copilot code review for pull requests (Azure DevOps Services)](https://learn.microsoft.com/azure/devops/repos/git/copilot-code-reviews?view=azure-devops) (`ms.date` 2026-09-29; limited preview)

### Microsoft Q&A, Community (1, non-authoritative, fetched in full)

13. [I cannot connect our GitHub Enterprise instance with our Azure Subscription for metered used (ie. Copilot)](https://learn.microsoft.com/answers/a/12897076) (2026-08-03; volunteer-moderator answer; tag "Not monitored"; used only to document a conflict)

### Official GitHub Documentation, docs.github.com (13, secondary official source)

14. [GitHub Copilot billing through Azure](https://docs.github.com/en/copilot/reference/copilot-billing/azure-billing) (seed URL; validated)
15. [Billing through Azure subscriptions](https://docs.github.com/en/billing/reference/azure-billing)
16. [Connecting an Azure subscription](https://docs.github.com/en/billing/how-tos/set-up-payment/connect-azure-sub)
17. [Azure subscription payments](https://docs.github.com/en/billing/concepts/azure-subscriptions)
18. [Azure subscription reference](https://docs.github.com/en/billing/reference/azure-subscription)
19. [Troubleshooting Azure subscription connection problems](https://docs.github.com/en/billing/how-tos/troubleshooting/azure-sub-connection)
20. [Supported payment methods for GitHub](https://docs.github.com/en/billing/reference/supported-payment-methods)
21. [Usage-based billing for organizations and enterprises](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/billing) (requested as `/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises`; redirected)
22. [Budgets for usage-based billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/organizations-and-enterprises/budgets)
23. [GitHub Copilot licenses](https://docs.github.com/en/billing/concepts/product-billing/github-copilot-licenses)
24. [Cost center allocation for different products](https://docs.github.com/en/billing/reference/cost-center-allocation)
25. [Using cost centers to allocate costs to business units](https://docs.github.com/en/billing/how-tos/products/use-cost-centers)
26. [Billing cycles](https://docs.github.com/en/billing/concepts/billing-cycles)

### GitHub Blog (1, secondary official source)

27. [GitHub Copilot is moving to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) (Mario Rodriguez; published 2026-04-27, modified 2026-04-27; seed URL, validated)

### Other Official Microsoft Properties (1)

28. [Azure pricing: GitHub Enterprise](https://azure.microsoft.com/en-us/pricing/details/githubenterprise/) (discovered through Learn content; prices rendered as `$-` when fetched)

### Microsoft Learn Documentation, added in revision round 2 (4, all fetched in full)

29. [Deploy Bicep files with the Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli) (date not captured). Supports prerequisites (Azure CLI 2.20.0+, local file, Bash), required permissions (`Microsoft.Resources/deployments/*`) and Bash inline array syntax. In round 1 this page was used only through code-sample search; it is now fetched in full.
30. [Azure built-in roles for Management and governance](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/management-and-governance) (date not captured). Cost Management Contributor actions.
31. [Azure built-in roles for Privileged](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/privileged) (date not captured). Owner and Contributor actions and NotActions.
32. [Azure built-in roles for General](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/general) (date not captured). Reader `*/read`.

### Code Samples

No separate code-sample-only pages remain. Every code source is listed above and was fetched in full. Code samples in this report and where they come from:

- Preflight quota-ID check (Bash + Azure CLI), **synthesized** from references 8, 9, 10 and 20. Prerequisites are drawn from references 8, 10, 30, 31 and 32.
- Subscription budget template (`main.bicep`), **verbatim** from reference 6.
- Budget deployment script (Bash + Azure CLI), **adapted** from references 6 and 29. The authorization guidance draws on references 5, 29, 30 and 31.

### Official Microsoft GitHub Repositories

None used.

### Consulted but Unreachable (1, not cited for any claim)

33. [GitHub Community discussion 192948: FAQ linked from the usage-based billing blog post](https://github.com/orgs/community/discussions/192948)

**Count check:** 16 Learn documentation (12 original + 4 added in round 2) + 1 Microsoft Q&A = **17 learn.microsoft.com pages**. 13 docs.github.com + 1 github.blog + 1 azure.microsoft.com = **15 other official sources**. **32 cited sources** in total, plus **1 unreachable** link listed for transparency.

