---
name: docs-retrieval
description: Retrieve the minimum necessary external documentation only when repository context is insufficient. Prefer authoritative, version-relevant sources, narrow the query before loading content, and return only the facts needed for the current task.
---

# Docs Retrieval

## Purpose

Retrieve only the minimum necessary external documentation when repository context is not enough to proceed safely.

Use this skill to ground uncertain framework, library, platform, or API behavior without turning external lookup into broad research.

## Use when

Use this skill when any of the following apply:

- repository code, config, and local docs do not answer the needed question
- a framework, library, platform, or API detail is materially uncertain
- version-specific behavior matters for the current task
- guessing from memory would create avoidable implementation or review risk

## Do not use when

Do not use this skill when:

- the repository already contains enough context to proceed
- the question can be resolved by targeted repo discovery or code inspection
- the lookup would be general background reading rather than task-critical grounding
- the current task does not depend on the uncertain external behavior

## Working rules

- Use external retrieval only after repository context is shown to be insufficient.
- Narrow the question before loading any external content.
- Prefer authoritative and version-relevant sources over summaries, mirrors, or forum posts.
- Retrieve only the sections needed to answer the current question.
- Extract task-relevant facts, not broad documentation summaries.

## Source preference

Prefer sources in this order when available:

1. official product or framework documentation
2. official package or library documentation
3. official source repository documentation or code comments
4. primary maintainer guidance

Use secondary sources only when authoritative sources are unavailable or insufficient, and call that out explicitly.

## Process

1. State the exact question that repository context could not answer.
2. Identify the relevant library, framework, platform, or API and the version if known.
3. Choose the smallest authoritative source likely to answer that question.
4. Retrieve only the relevant section or sections.
5. Extract the few facts needed for the current task.
6. Note any version uncertainty, source limitations, or remaining ambiguity.
7. Return a compact fact packet and the next safe step.

## Output

Return a short fact packet containing only:

- question being answered
- source used
- version relevance or uncertainty
- key facts retrieved
- limits or remaining ambiguity
- next safe step for the current task

## Stop condition

Stop once enough authoritative information has been retrieved to unblock the current task with reasonable confidence.

Do not continue browsing once the needed facts are established.

## Efficiency notes

- Narrow first, retrieve second.
- Prefer one precise source over many overlapping sources.
- Prefer a compact fact packet over a long summary.
- Do not let external docs dominate task context.
