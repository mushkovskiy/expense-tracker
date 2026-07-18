#!/usr/bin/env bash
set -euo pipefail

PROTECTED_BRANCHES=("main")

current_branch="$(git branch --show-current)"

if [ -z "$current_branch" ]; then
  echo "Cannot determine current branch (are you in a detached HEAD state?)." >&2
  exit 1
fi

for protected in "${PROTECTED_BRANCHES[@]}"; do
  if [ "$current_branch" = "$protected" ]; then
    echo "You are on '$current_branch' — pull requests cannot be created from this branch. Create a feature branch off '$protected' first." >&2
    exit 1
  fi
done

has_diff=false
for base in "${PROTECTED_BRANCHES[@]}"; do
  if git rev-parse --verify --quiet "$base" >/dev/null; then
    if [ -n "$(git diff "$base"...HEAD)" ]; then
      has_diff=true
      break
    fi
  fi
done

if [ "$has_diff" = false ]; then
  echo "Branch '$current_branch' has no differences from main/develop — there is nothing to open a pull request for." >&2
  exit 1
fi

echo "Branch '$current_branch' is valid for a pull request."
