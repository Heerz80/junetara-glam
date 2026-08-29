@echo off
REM ============================================================
REM  Junetara Glam - one-command GitHub + Vercel deploy (Windows)
REM  Double-click this file, or run:  deploy.bat
REM ============================================================
title Junetara Glam - deploy helper
echo.
echo   Junetara Glam - deploy helper
echo   ----------------------------------
git --version >nul 2>&1 || (echo [X] git not found - install from https://git-scm.com/downloads & pause & exit /b 1)

if not exist .git git init
git branch -M main
git add .
git commit -m "feat: Junetara Glam - integrated beauty ecosystem (web MVP)"

echo.
echo   STEP 1/2 - create an EMPTY repo on GitHub (name is pre-filled):
echo              https://github.com/new?name=junetara-glam
echo              (no README, no .gitignore - leave it empty)
echo.
set /p U="  STEP 2/2 - your GitHub username: "
if "%U%"=="" (echo [X] Username required. & pause & exit /b 1)

git remote remove origin >nul 2>&1
git remote add origin https://github.com/%U%/junetara-glam.git
echo · Pushing to https://github.com/%U%/junetara-glam ...
git push -u origin main

echo.
echo   [OK] Code is live on GitHub!
echo   Now connect Vercel (auto-deploys on every push):
echo      - https://vercel.com/new  (import the repo, click Deploy)
echo      - or: npm i -g vercel ^&^& vercel --prod
echo.
pause
