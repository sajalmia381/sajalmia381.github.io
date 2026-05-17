---
name: execution-spec
description: Create a compact, implementation-ready spec for non-trivial, risky, cross-boundary, or sensitive work. Define scope, affected surfaces, smallest-sufficient approach, ordered tasks, validation, and key uncertainties before editing.
---

# Execution Spec

## Purpose

Turn a non-trivial request into a compact, implementation-ready execution spec before editing.

Use this skill to make the work bounded, ordered, and verifiable while preserving the smallest sufficient change and existing repository patterns.

## Use when

Use this skill when any of the following apply:

- the task is non-trivial, risky, cross-boundary, or sensitive
- more than one layer or concern is likely to be involved
- more than one file is likely to be involved and scope or validation is not obvious
- scope needs to be made explicit before editing
- validation is not obvious
- the work needs a clear execution order
- the change may affect contracts, schema, auth, runtime, deployment, integrations, or startup behavior

## Do not use when

Do not use this skill when:

- the task is a small, local change with obvious scope and validation
- a compact execution spec already exists and is still valid
- the main need is repository discovery
- the main need is to pressure-test a concrete, already-bounded approach
- the main need is implementation, review, or final validation

## Working rules

- Reuse existing discovery context before gathering more.
- Keep the spec compact, execution-focused, and easy to act on.
- Prefer the smallest sufficient approach that preserves existing repository patterns.
- Do not expand into a design essay or broad alternative analysis.
- Mention alternatives only when there are real competing paths that materially affect execution.
- Surface only the risks, assumptions, and questions that matter for safe implementation.
- Add rollback notes, alternatives, or deeper impact notes only when the task actually needs them.
- Do not write code while using this skill.

## Process

1. Restate the requested outcome in concrete terms.
2. Define scope and explicit out-of-scope boundaries.
3. Identify the likely affected files, modules, contracts, configs, or runtime surfaces. Use code graph search and call graph tracing to discover adjacent impact beyond the files being directly edited — structural search is more reliable than manual inspection for surfacing cross-module callers and hidden dependencies.
4. Capture local repository patterns or constraints that should be preserved.
5. Propose the smallest sufficient implementation approach.
6. Break the work into an ordered task list with validation embedded where useful.
7. Record the key assumptions, uncertainties, and open questions that could still affect execution.
8. State whether the work appears ready for implementation or whether a risk gate or clarification is still needed.

## Output

Return a concise execution spec containing only:

- goal
- in scope
- out of scope
- affected areas
- relevant repository patterns or constraints
- proposed approach
- why this is the smallest sufficient change
- ordered task list
- validation plan
- key assumptions, uncertainties, or questions
- implementation readiness: `ready to implement` or `needs risk gate or clarification`

Keep the spec compact and directly reusable by downstream implementation or gating work.

## Stop condition

Stop once the work is bounded enough to implement safely or clearly needs risk-gating or clarification.

Do not continue refining once the next safe step is clear.

## Efficiency notes

- The spec should reduce execution ambiguity, not add ceremony.
- Prefer one clear execution path over multiple speculative options.
- Prefer concrete affected surfaces over broad architectural summaries.
- Avoid repeating repository context that has already been established.
- Do not invoke a risk gate by default; use it only when the bounded approach still carries material uncertainty.
- Keep the output short enough to stay useful during implementation.
- For changes that establish a significant architectural pattern or permanent cross-cutting decision, note in the spec that an Architecture Decision Record should be created alongside or after implementation.
