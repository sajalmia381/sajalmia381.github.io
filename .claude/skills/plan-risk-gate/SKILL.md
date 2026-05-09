---
name: plan-risk-gate
description: Pressure-test a proposed implementation approach and decide whether it is safe and bounded enough to execute. Assess sensitivity, adjacent impact, rollback clarity, validation needs, and whether clarification or escalation is required before implementation.
---

# Plan Risk Gate

## Purpose

Pressure-test a proposed implementation approach before editing and decide whether the work is safe and bounded enough to execute now.

Use this skill to catch risky assumptions, hidden adjacent impact, unclear rollback, missing validation, or approval boundaries that should stop implementation until clarified.

Use this only after a concrete execution spec or similarly bounded approach already exists.

## Use when

Use this skill when any of the following apply:

- a non-trivial execution spec or proposed approach already exists
- multiple plausible implementation paths exist
- the work is sensitive, cross-boundary, or costly to undo
- adjacent impact is not yet clear
- validation or rollback is uncertain
- the change may affect contracts, schema, auth, runtime, deployment, integrations, or startup behavior

## Do not use when

Do not use this skill when:

- the task is small, local, and already well-bounded
- no concrete proposed approach exists yet
- the main need is initial repo discovery
- the main need is to create the first execution spec
- clarification alone is sufficient to resolve the remaining uncertainty without a formal gate
- the main need is PR/diff review after implementation

## Working rules

- Evaluate the proposed approach against the actual repository boundaries and runtime shape.
- Stay narrow: this is a gate, not a full design document or review workflow.
- Prefer practical risk reduction over theoretical debate.
- Focus on whether the work can proceed safely now, not on exploring every possible alternative.
- Do not write code while using this skill.

## Process

1. Restate the proposed approach and intended scope in compact form.
2. Identify the main assumptions, unknowns, and conditions required for the plan to hold.
3. Check for sensitive or cross-boundary impact. Use call graph tracing on the modified functions to produce concrete evidence of adjacent callers, callees, and cross-service paths — do not rely solely on manual assessment when graph-based impact tracing is available.
4. Pressure-test adjacent impact, rollback path, and validation sufficiency.
5. Surface the strongest reason the plan may fail or cause unintended drift.
6. Identify constraints, clarifications, or a safer adjustment when needed.
7. Decide the next safe status: `proceed`, `proceed with constraints`, `clarify`, or `escalate`.

## Output

Return a short gate summary containing only:

- proposed approach
- main risks or failure modes
- sensitive or adjacent surfaces checked
- validation and rollback concerns
- required constraints or clarifications
- final status: `proceed`, `proceed with constraints`, `clarify`, or `escalate`
- brief reason for the final status

## Escalation rules

Choose:

- `proceed` when the plan is bounded, risks are understood, and validation is sufficient
- `proceed with constraints` when the plan is acceptable only with explicit limits, checks, or sequencing
- `clarify` when unresolved uncertainty could materially change implementation or safety
- `escalate` when approval, ownership, or risk exceeds normal autonomous implementation boundaries

## Stop condition

Stop once the implementation can safely proceed, or once it is clear that clarification or escalation is required.

Do not continue debating after the gate decision is clear.

## Efficiency notes

- Keep the gate compact and decision-focused.
- Do not invent ceremony for low-risk work.
- Do not expand into full planning, full review, or broad repository rediscovery unless confidence is still too low.
- Do not repeat the execution spec; test only the assumptions and risks that still matter.
- Prefer one strong objection or constraint over many speculative concerns.

## Repo Context

Applies to the Netpower QMS mono-repo.

**Impact assessment**: Use call graph tracing on modified functions before asserting adjacent impact is clear — trace inbound callers, outbound callees, and cross-service paths. Produces concrete evidence rather than speculative coverage, and often surfaces callers in other modules not visible from the diff.

**Scope verification**: Use change detection to confirm the actual diff scope matches the intended spec boundary before gating. Catches unintended touches or scope drift that manual inspection misses.
