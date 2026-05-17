---
name: review-findings-first
description: Review a PR, diff, branch, or changed files with a findings-first approach focused on regressions, risky drift, missing validation, adjacent impact, and unintended architecture or contract changes.
---

# Review Findings First

## Purpose

Review a concrete change and surface the most important findings first.

Use this skill to identify regressions, risky drift, missing validation, adjacent impact, and unintended changes to architecture, contracts, runtime behavior, or repository patterns.

## Use when

Use this skill when any of the following apply:

- the user asks for a review
- a PR, diff, branch, or changed files need assessment
- a completed or in-progress change needs a findings-first quality check
- the change may have adjacent impact that should be called out before merge or handoff

## Do not use when

Do not use this skill when:

- no concrete change, diff, or touched surface exists yet
- the main need is planning, discovery, or risk-gating before implementation
- the main need is final validation execution rather than review
- the user wants implementation instead of review

## Working rules

- Review against the actual repository architecture, conventions, contracts, and risk profile.
- Prioritize findings that materially affect correctness, safety, compatibility, maintainability, or release confidence.
- Keep summaries secondary to findings.
- Prefer concrete evidence over vague concern.
- Call out missing validation or verification gaps when they materially affect confidence.
- Do not modify code while using this skill.

## What to look for

Focus only on issues that matter for the current change, such as:

- regressions or broken behavior
- risky architectural drift or pattern inconsistency
- unintended contract, schema, or compatibility changes
- auth, permission, secret-handling, or security-sensitive mistakes
- runtime, startup, configuration, deployment, or integration risks
- missing or insufficient validation for the type of change made
- unnecessary scope expansion or unclear change boundaries
- adjacent surfaces likely affected but not accounted for

## Process

1. Identify the concrete review surface: PR, diff, branch, or changed files. When a git ref is available, use change detection first — automatically scope affected symbols and their downstream impact before reading diff output. This is more complete and more token-efficient than manual diff parsing.
2. Understand the intended change briefly enough to review it correctly.
3. Check the change against local repository patterns, contracts, and adjacent impact.
4. Identify the highest-value findings first.
5. Check whether validation is adequate for the risk and blast radius of the change.
6. State any review limits, unverified areas, or assumptions that affect confidence.
7. Return findings-first output, or explicitly say no material findings were found.

## Output

Return a concise review result containing only:

- findings ordered by importance, with severity labels when useful
- file references or concrete evidence when available
- missing validation or verification gaps
- open questions or assumptions that affect review confidence
- review coverage limits or unverified areas
- brief overall assessment only after findings

If no material findings are present, say so explicitly and still mention any residual risks, testing gaps, or review limits.

## Severity guidance

Use severity labels only when they improve clarity. Prefer simple, practical levels such as:

- high
- medium
- low

Do not inflate severity. Focus on impact and likelihood, not wording.

## Stop condition

Stop once the review has surfaced the material findings, or once it is clear that no material findings were found within the reviewed scope.

Do not expand into full redesign suggestions, speculative refactors, or unrelated cleanup.

## Efficiency notes

- Findings should be specific, not exhaustive.
- Prefer a few strong findings over many weak comments.
- Review only the touched or plausibly affected surfaces unless the change clearly requires broader inspection.
- Keep the output short enough to scan quickly and act on immediately.

## Repo Context

Applies to the Netpower QMS mono-repo. Check these for every C# change in addition to the generic criteria above.

**Coding rule violations (each is a runtime or correctness bug, not a style issue):**
- Missing `DependencyMicrosoftRegistrar : BaseDependencyRegistrar` on a new project → runtime DI failure
- `Version` attribute on `<PackageReference>` in a `.csproj` → build conflict with `Directory.Packages.props`
- `HttpContext.User.Claims` read directly in a controller → SLO session validation bypassed, security regression
- `IConfiguration` injected into a service → tenant isolation broken, wrong config served
- Long-lived shared `DbContext` in a Hangfire job or background service → thread-safety bug
- Concrete DataLayer class injected instead of its interface → Redis cache decorator silently bypassed
- Cross-schema Dapper query without explicit schema qualification → ambiguous or incorrect results

**Layering violations:**
- Business layer referencing concrete DataLayer classes directly (must go through domain interfaces)
- API controllers containing business logic (must delegate to services or MediatR handlers)

**Multi-tenancy:**
- Flag any pattern that risks cross-tenant data access: shared static state, hardcoded connection strings, missing tenant ID scoping in queries or filters

**Review workflow**: Start with change detection (git ref → changed symbols → impact radius) before reading diff output. Use call graph tracing on high-impact changes to verify adjacent surfaces not visible in the diff. Manual diff reading follows automated scope analysis — not the other way around.
