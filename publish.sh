#!/usr/bin/env bash
# One command to build, save and publish:  ./publish.sh "What changed"
set -e
cd "$(dirname "$0")"
MSG="${1:-Update site}"
python build_pages.py
quarto render
git add -A
if git diff --cached --quiet; then echo "Nothing changed."; exit 0; fi
git commit -m "$MSG"
git push
echo "Done. Watch progress in the Actions tab on GitHub."
