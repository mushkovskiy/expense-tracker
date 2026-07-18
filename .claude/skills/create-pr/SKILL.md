---
name: create-pr
description: Create a Pull Request on GitHub with a given title and branch.
model: sonnet
allowed-tools: Bash(git *), Bash(gh *), "Bash(bash C:/Users/mid/Desktop/development/claude/expence-tracker/.claude/skills/*)"
user-invocable: true
argument-hint: [title] [base-branch]
---

# Create PR Skill

Create a Pull Request on GitHub, following the project's conventions.

## Arguments

- $0 - PR title
- $1 - target branch

## Preparation

1. Check that the branch is ready:
   !`bash ${CLAUDE_SKILL_DIR}/scripts/validate.sh`


## Task

Using the data above — fill in the template
from @template.md.
See an example of a good PR: @examples/good-pr.md

## Creating the PR

Create the PR with the command:
gh pr create \
 --title "$0 or a generated title" \
 --body "filled-in template" \
 --base "${ARGUMENTS:-main}"

## Rules

- Title follows conventional commits
- If the branch is not pushed:
  git push --set-upstream origin HEAD