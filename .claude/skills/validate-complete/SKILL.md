---
name: validate-complete
description: Determine and run the minimum final validation needed for the change based on actual repository structure, then produce a concise completion summary with checks run, checks skipped, residual risk, and scope reconciliation.
---

# Validate Complete

## Purpose

Determine what final validation is required for the completed change, run or confirm the minimum necessary checks, and produce an honest completion summary.

Use this skill to verify that the delivered work matches the requested scope and has enough validation to be considered complete with reasonable confidence.

## Use when

Use this skill when any of the following apply:

- implementation is finished or believed to be finished
- a non-trivial or sensitive change needs final verification
- multiple files, modules, or boundaries were touched
- the user asks whether the work is actually complete

## Do not use when

Do not use this skill when:

- planning or implementation is still in progress
- the next step is still discovery, spec creation, or risk-gating
- key parts of the change are knowingly unfinished
- required validation cannot yet be attempted

## Working rules

- Discover actual repository structure before choosing validation steps.
- Use the minimum validation that still gives reasonable confidence for the change made.
- Prefer targeted validation first; broaden only when risk or blast radius justifies it.
- Compare expected validation with actual validation performed.
- Reconcile the delivered work against the requested scope and any active execution spec.
- Record skipped checks only when there is a real reason.
- Do not claim completion if required checks failed, were skipped without justification, or sensitive changes remain insufficiently verified.
- Do not modify code while using this skill.

## What to validate

Validate only what materially matters for the current change, such as:

- affected build, package, app, service, or project entrypoints
- targeted tests for changed behavior
- contract, integration, or boundary-sensitive surfaces when relevant
- runtime or config-sensitive wiring when relevant
- repository-local conventions required for confidence in delivery

When relevant, inspect local config, runtime, or deployment wiring rather than assuming it is unaffected.

## Process

1. Identify the actual change surfaces and the validation they imply.
2. Determine the minimum final checks needed for reasonable confidence.
3. Discover the repo-local commands, scripts, test targets, or inspection paths required.
4. Run or confirm the required checks in the smallest sensible scope.
5. Record failures, skipped checks, and any residual uncertainty.
6. Reconcile the completed work against the requested scope and any active execution spec.
7. Return a completion result of `pass` or `fail`.

## Output

Return a concise completion summary containing only:

- touched files, modules, or surfaces
- expected checks
- actual checks run
- checks skipped and why
- key success or failure evidence
- residual risks or follow-up notes
- scope reconciliation result
- completion result: `pass` or `fail`

Keep the summary concise, factual, and usable as the final handoff for the task.

## Failure rules

Return `fail` when any of the following apply:

- a required check failed
- important validation was skipped without adequate justification
- sensitive changes could not be verified with reasonable confidence
- the delivered work materially exceeds or misses the requested scope
- major uncertainty remains unresolved

Do not present the task as complete when the correct result is `fail`.

## Stop condition

Stop once the required validation has been run or its absence has been clearly accounted for, and the completion result can be stated honestly.

Do not continue expanding validation once reasonable confidence has been reached, unless a failure or sensitive surface requires broader checks.

## Efficiency notes

- Validation should be proportional to risk and blast radius.
- Prefer targeted evidence over broad default command runs.
- Prefer honest incompleteness over overstated completion.
- Keep the final summary short enough to be scanned quickly.

## Repo Context

Applies to the Netpower QMS mono-repo.

**Build**: `dotnet build Netpower.Qms.Overview.sln.sln`
The solution filename ends in `.sln.sln` — this is intentional, not a typo.

**Test**: `dotnet test UnitTest/<Module>/`
Tests use SQLite in-memory databases. No SQL Server, Redis, or Elasticsearch instance is required.

**Accepted validation gaps** — do not flag their absence as failures:
- No automated end-to-end tests
- No auth token integration tests
- No Redis or Elasticsearch integration tests (mocked at unit test level by design)
- No SignalR hub automated tests

**Scope boundaries**:
- Backend-only changes do not require Angular builds — SPAs are pre-built in Docker images
- EF migrations run automatically at backend startup from `Handbook/Database/*/Upgrades/` — no manual `dotnet ef database update`
- `Handbook/Backend/Netpower.Handbook.Backend.WebCore` is the primary integration host for all business modules
