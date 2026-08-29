#!/usr/bin/env bash
# ============================================================
#  Junetara Glam — one-command GitHub + Vercel deploy
#  Run:  bash deploy.sh        (macOS / Linux / Git Bash on Windows)
# ============================================================
set -e
cd "$(dirname "$0")"

REPO="junetara-glam"
BRANCH="main"

echo ""
echo "  🌼  Junetara Glam — deploy helper"
echo "  ----------------------------------"

command -v git >/dev/null 2>&1 || { echo "❌ git not found → install from https://git-scm.com/downloads, then re-run."; exit 1; }

# ---- 1. local repo ----
[ -d .git ] || git init
git branch -M "$BRANCH"
git add .
if git diff --cached --quiet; then
  echo "· Local repo up to date — nothing new to commit."
else
  git commit -m "feat: Junetara Glam — integrated beauty ecosystem (web MVP)"
  echo "· Committed project files."
fi

# ---- 2. GitHub ----
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  echo "· GitHub CLI detected — creating '$REPO' and pushing…"
  gh repo create "$REPO" --public --source=. --remote=origin --push 2>/dev/null || {
    echo "· Repo already exists — pushing instead…"
    GH_USER=$(gh api user --jq .login)
    git remote add origin "https://github.com/$GH_USER/$REPO.git" 2>/dev/null || git remote set-url origin "https://github.com/$GH_USER/$REPO.git"
    git push -u origin "$BRANCH"
  }
else
  echo ""
  echo "  STEP 1/2 — create an EMPTY repo on GitHub (name is pre-filled):"
  echo "             👉  https://github.com/new?name=$REPO"
  echo "             (no README, no .gitignore — leave it empty)"
  echo ""
  read -rp "  STEP 2/2 — your GitHub username: " GH_USER
  [ -n "$GH_USER" ] || { echo "❌ Username required."; exit 1; }
  git remote add origin "https://github.com/$GH_USER/$REPO.git" 2>/dev/null || git remote set-url origin "https://github.com/$GH_USER/$REPO.git"
  echo "· Pushing to https://github.com/$GH_USER/$REPO …"
  git push -u origin "$BRANCH"
fi

echo ""
echo "  ✅  Code is live on GitHub!"
echo ""
echo "  Now connect Vercel (auto-deploys on every push):"
echo "     → https://vercel.com/new   — import the repo, click Deploy"
echo "     → or:  npm i -g vercel && vercel --prod"
echo ""
