# AI Config Design — 2026-05-09

## Goal

Add AI coding tool configuration files so Cursor, Gemini CLI, and GitHub Copilot/Codex agents all have the same project context as Claude Code.

## Files

| File | Tool | Format |
|---|---|---|
| `.cursorrules` | Cursor | Terse imperative rules |
| `GEMINI.md` | Gemini CLI | Structured narrative (mirrors CLAUDE.md) |
| `AGENTS.md` | GitHub Copilot / OpenAI Codex | Structured narrative (mirrors CLAUDE.md) |

## Content source

All content is derived from the existing `CLAUDE.md`. No new information is introduced. The difference is format only:

- `.cursorrules` — short imperative rules optimised for inline completion context
- `GEMINI.md` / `AGENTS.md` — full structured context docs (commands, architecture, data flow, aliases, formatting)

## Scope

- Create three files listed above
- Do not modify `CLAUDE.md`
- No application code changes
