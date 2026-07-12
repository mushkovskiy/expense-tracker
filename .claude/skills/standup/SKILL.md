---
name: standup
description: Generate a standup report summarizing work done yesterday, based on git commit history. Use when the user asks for a standup, daily report, "what did I do yesterday", or a summary of recent work.
model: sonnet
allowed-commands: Bash(git *) Bash(date *)
user-invocable: true
---

# Standup

Produce a detailed report of what was done **yesterday**, based on git history in the current repository.

## Steps

1. Determine the date range for "yesterday":
   - Default: the previous calendar day (00:00:00 to 23:59:59).
   - If today is Monday, treat "yesterday" as Friday through Sunday (i.e. look back to cover the weekend), since no work is expected to have happened Sat/Sun.
   - If the user specifies a different day/range, use that instead.

2. Identify the author to filter by:
   - Default to the current git identity: `git config user.email` (and `git config user.name` as a fallback for older commits).
   - If the user asks for the whole team's activity, drop the `--author` filter.

3. Collect commits in range across all branches (not just the current one), since work may have happened on feature branches:
   ```bash
   git log --all --since="<start>" --until="<end>" --author="<email>" \
     --pretty=format:"%H|%ad|%an|%s" --date=iso-strict
   ```

4. For each commit found, get the file-level detail:
   ```bash
   git show --stat --pretty=format:"" <hash>
   ```
   Use this to know which files/areas were touched and roughly how much (insertions/deletions).

5. If there are uncommitted changes (`git status`, `git diff`, `git diff --staged`) made yesterday but not yet committed, note them separately as "in progress" — check file mtimes or just surface current uncommitted state if it's substantial, but don't guess dates for it.

6. Group and synthesize the findings into a report — don't just dump raw `git log` output. Cluster commits by feature/area (e.g. by scope in Conventional Commit messages, or by directory touched), and describe *what changed and why* in plain language, not just the commit subject line.

## Report format

```markdown
# Standup — <date range>

## Summary
<1-3 sentence high-level overview of the day>

## Done
- **<Area/Scope>**: <description of the change, synthesized from commit(s) and diff>
  - <supporting detail: files touched, notable implementation points>
  (repeat per logical unit of work — not necessarily 1:1 with commits; squash related commits together)

## In progress / uncommitted
- <any local changes not yet committed, if relevant>

## Stats
- <N> commits, <N> files changed, +<insertions>/-<deletions>
```

## Rules

- Report on **actual git history**, not assumptions — always run the git commands above rather than inferring from conversation context.
- If no commits are found in the range, say so plainly and ask whether to widen the date range instead of fabricating content.
- Keep the report factual and specific — reference real file paths and commit subjects, not generic descriptions.
