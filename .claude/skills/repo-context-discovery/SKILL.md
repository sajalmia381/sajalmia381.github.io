---
name: repo-context-discovery
description: Gather the minimum repository context needed before planning, reviewing, or editing. Prefer indexed, structural, or symbol-aware discovery before targeted file reads. Reuse and persist only durable findings that will improve future task execution or context efficiency.
---

# Repo Context Discovery

## Purpose

Gather only the minimum repository context needed to support safe planning, review, or implementation.

Use this skill to reduce unnecessary scanning, improve context quality, and avoid loading broad or redundant repository content.

## Use when

Use this skill when any of the following apply:

- the task is non-trivial, cross-boundary, or sensitive
- repository structure or ownership is not yet clear
- affected files, modules, or entrypoints are uncertain
- review requires adjacent impact analysis
- validation paths are unclear
- the repository is large enough that broad reading would waste context

## Do not use when

Do not use this skill when:

- the task is small and the affected file or surface is already clear
- sufficient context has already been collected for the current task
- only a quick targeted read is needed

## Working rules

- Prefer indexed, structural, symbol-aware, or memory-backed discovery when available.
- Choose the capability that is most token-efficient for the question — follow the preference order in Repo Context below. Never use file reads for a question the code graph can answer.
- When reading a symbol after finding it in the graph, read it directly by qualified name from the graph index — do not load the full containing file.
- Narrow to targeted file or symbol reads only after discovery identifies the likely surfaces.
- Avoid broad scans, repeated reads, and loading files that are unlikely to affect the task.
- Reuse already collected context before gathering more.

## What to discover

Discover only what is needed for the current task, such as:

- likely affected modules, components, or boundaries
- relevant entrypoints, interfaces, contracts, or configs
- adjacent dependencies or callers/callees
- validation entrypoints such as tests, build targets, or app/package boundaries
- repository patterns or local conventions that should be preserved

## Persistence rules

Persist or record findings only if they are durable, reusable, and likely to improve future work, such as:

- stable module boundaries
- important dependency relationships
- repository conventions
- validation entrypoints
- durable architecture notes

Keep task-local findings in the current execution context or spec unless they are clearly durable.

Do not persist temporary, task-local, speculative, or fast-changing details.

## Output

Produce a short context packet containing only:

- relevant surfaces
- likely affected boundaries or dependencies
- important local patterns to preserve
- validation entrypoints to consider
- open uncertainties that still require clarification

## Stop condition

Stop discovery once the agent can do one of the following with reasonable confidence:

- create an execution spec
- perform a focused review
- make a bounded change
- state a specific clarification need

Do not continue exploring once the next safe step is clear.

## Efficiency notes

- Discovery should reduce context load, not increase it.
- Prefer narrowing over collecting.
- Prefer durable findings over verbose summaries.
- Prefer one good context packet over many scattered notes.

## Repo Context

Applies to the Netpower QMS mono-repo.

**Code graph**: This repository's code graph is fully indexed. Use the capability that fits the question — in order of token efficiency:

1. **Symbol and concept search** (BM25 / semantic / name pattern): find definitions, interfaces, implementations, or vocabulary-bridged matches. Use first for any "what is X" or "where is Y implemented" question. Supports natural-language queries, camelCase splitting, and semantic bridging (finds "notification" when you search "alert").
2. **Code text search** (graph-augmented grep): find patterns in source text, deduplicated and ranked by structural importance. Use instead of grep for pattern discovery.
3. **Call graph tracing**: trace callers, callees, and cross-service paths for impact analysis. Use instead of grepping for usages. Supports inbound (who calls this), outbound (what does this call), and cross-service modes.
4. **Symbol source read by qualified name**: read a symbol's source directly from the graph index without loading the full file. Use after symbol search — significantly more token-efficient than file reads for single-symbol inspection.
5. **Structural graph queries** (Cypher): express multi-hop patterns (e.g., all implementors of interface X called by services in module Y). Use for complex cross-module structural analysis that search cannot express.
6. **Change detection**: given a git ref or date, automatically identify changed symbols and their downstream impact radius. Use at the start of any review or spec-scoping task to bound the affected surface.
7. **File reads**: only after graph search has identified the exact surface and the graph cannot provide sufficient detail.

**Graph freshness**: before a deep analysis session, verify the index is current — recently committed code may not be reflected if the graph has not been re-indexed since the last push.

**Test discovery**: Test targets follow `UnitTest/<Module>/` (xUnit/NUnit/MSTest). When a discovery goal includes finding validation coverage for a surface, start here.

**Module structure**: All modules follow `Netpower.<Module>.<Layer>` naming. To locate surfaces within a module:
- Interfaces and contracts → `.Domain` layer
- Implementations → `.DataLayer` (EF Core) or `.Business` (services)
- API entrypoints → `.API/Controllers/v1/`
- MediatR handlers (newer modules) → `.Application`
