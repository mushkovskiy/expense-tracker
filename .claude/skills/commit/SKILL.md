---
name: commit
description: Create a git commit following this repo's Conventional Commits conventions. Use when the user asks to commit changes, stage and commit, or write a commit message.
---

# Commit

Create a git commit for the current changes following [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

## Steps

1. Run `git status` and `git diff` (and `git diff --staged`) in parallel to see what changed.
2. Review recent history with `git log --oneline -10` to match the repo's message style.
3. Stage the relevant files if nothing is staged yet.
4. Write the message in the Conventional Commits format below and commit.

## Message format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **scope** (optional): the affected area, e.g. `api`, `web`, `auth`, `categories`
- **description**: short, imperative, lowercase, no trailing period
- Breaking changes: append `!` after the type/scope (`feat(api)!: ...`) and/or add a `BREAKING CHANGE:` footer
- Body explains *why*, not *what* — the diff already shows what changed

## Rules

- Do **not** add a `Co-Authored-By` trailer or any Claude Code attribution footer.
- Only commit when the user asks. If on the `main` branch, create a short-lived, descriptively named branch off `main` first (see GitHub Flow branching workflow).
- Keep each commit focused; split unrelated changes into separate commits when practical.
