"""
Create a new MLStation article from the template.

    python new_article.py statistics/hypothesis-testing "Understanding p-values"

- The folder must be an existing topic folder (see build_pages.py).
- The file name is created from the title (understanding-p-values.qmd).
- The article starts as a draft: visible in `quarto preview`, hidden from the live site
  until you set  draft: false.
"""
import re
import sys
import subprocess
from datetime import date
from pathlib import Path

CATEGORY = {"ml": "ML", "ai": "AI", "statistics": "Statistics",
            "software": "Software", "deployment": "Deployment", "resources": "Resources"}

if len(sys.argv) != 3:
    sys.exit('Usage: python new_article.py <section/topic> "Article title"')

folder, title = Path(sys.argv[1].strip("/")), sys.argv[2].strip()
if not (folder / "index.qmd").exists():
    sys.exit(f"Topic folder '{folder}' not found. Check build_pages.py for valid folders.")

slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
target = folder / f"{slug}.qmd"
if target.exists():
    sys.exit(f"{target} already exists.")

section = folder.parts[0]
topic = folder.parts[-1].replace("-", " ").title()
text = (Path("_templates/article.qmd").read_text(encoding="utf-8")
        .replace("{{TITLE}}", title.replace('"', "'"))
        .replace("{{DATE}}", date.today().isoformat())
        .replace("{{CATEGORY}}", f"{CATEGORY.get(section, section.title())}, {topic}"))
# remove the template's own header comments
text = re.sub(r"# =+\n(#.*\n)*# =+\n", "", text, count=1)
target.write_text(text, encoding="utf-8")
print(f"Created {target}")

# refresh landing pages so the topic now lists its articles
subprocess.run([sys.executable, "build_pages.py"], check=False)
