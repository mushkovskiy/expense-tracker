---
name: commit
description: Create a git commit following this repo's Conventional Commits conventions. Use when the user asks to commit changes, stage and commit, or write a commit message.
allowed-commands: Bash(git *)
---

# Commit

Create a git commit for the current changes following [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

## Execution context

```!
git status
git branch --show-current
git log --oneline -10
```

## Steps

1. Review the current repository status and branch from the execution context.
2. Inspect the changes:
   - Run `git diff` for unstaged changes.
   - Run `git diff --staged` for staged changes.
3. Determine which files belong in this commit. If nothing is staged, stage only the relevant files; do not use `git add .`.
4. If the current branch is `main`, create a short-lived, descriptively named branch off `main` before committing, following this repository's GitHub Flow branching workflow.
5. Write a Conventional Commits message that matches the repository's recent style.
6. Create the commit.
7. Verify the result with `git log --oneline -1`.

## Message format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **scope** (optional): the affected area, for example `api`, `web`, `auth`, or `categories`
- **description**: short, imperative, lowercase, with no trailing period
- **breaking changes**: append `!` after the type or scope, for example `feat(api)!: ...`, and/or add a `BREAKING CHANGE:` footer
- **body**: explain *why*, not *what*; the diff already shows what changed

## Rules

- Only create a commit when the user explicitly asks.
- Do not add a `Co-Authored-By` trailer or any Claude Code attribution footer.
- Keep each commit focused; split unrelated changes into separate commits when practical.
- Do not amend, force-push, or rewrite history unless the user explicitly asks.
- If the working tree contains unrelated changes, ask the user which files should be included rather than staging them automatically.