---
name: create-pr
description: Create a GitHub pull request for the current branch via the gh CLI, optionally given a PR title and/or branch name. Use when the user asks to open, create, or submit a pull request.
argument-hint: [pr-title] [branch-name]
allowed-commands: Bash(git *) Bash(gh *)
---

# Create Pull Request

Open a GitHub pull request for the current work, following this repo's [PR conventions](../../../CLAUDE.md) and [GitHub Flow branching workflow](../../../CLAUDE.md).

## Arguments

- `$0` (optional): PR title. If omitted, derive one from the diff and commit log per the title rules below.
- `$1` (optional): branch name to push/open the PR from. If omitted, use the current branch (or create one if still on `main`).

## Steps

1. Run in parallel to understand current state:
   - `git status`
   - `git diff` and `git diff --staged`
   - `git branch --show-current`
   - `git log --oneline -10`
2. Determine the branch:
   - If `$1` was given and it differs from the current branch, create/switch to it (`git checkout -b $1` off `main`, or `git checkout $1` if it already exists).
   - If no branch was given and the current branch is `main`, create a short-lived, descriptively named branch off `main` first — do not open a PR from `main`.
3. Check whether the branch tracks a remote and is up to date (`git status` / `git rev-list @{u}..`), so you know if a push is needed.
4. Read the full set of changes on the branch: `git log --oneline main...HEAD` and `git diff main...HEAD` (substitute the actual base branch if not `main`). Do not rely only on the latest commit.
5. Push the branch if needed: `git push -u origin <branch>`.
6. Draft the PR:
   - **Title**: use `$0` verbatim if provided; otherwise follow Conventional Commits format (`<type>[optional scope]: <description>`), under 70 characters, picking the type/scope that best represents the overall branch change.
   - **Body**: synthesize from the entire diff and commit log, not just the last commit — structure as:
     - **Summary**: short bulleted list explaining *why* the change was made
     - **Test plan**: checklist of manual steps / tests to verify
7. Create the PR with a heredoc body to preserve formatting:
   ```bash
   gh pr create --title "$0" --body "$(cat <<'EOF'
   ## Summary
   - ...

   ## Test plan
   - [ ] ...
   EOF
   )"
   ```
8. Report the PR URL back to the user.

## Rules

- Never force-push or rewrite history to make a branch ready for a PR — ask the user first if the branch history looks like it needs cleanup.
- Do not copy the last commit message into the PR description; it must reflect the full branch diff.
- Confirm with the user before pushing if the branch has no upstream yet or diverges from its upstream.
