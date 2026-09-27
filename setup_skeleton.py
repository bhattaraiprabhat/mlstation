"""Creates the MLStation folder skeleton. Run once: python setup_skeleton.py"""
from pathlib import Path

SECTIONS = {
    "ml":         ["tools", "algorithms", "evaluation"],
    "ai":         ["tools", "agentic-ai", "llms", "rag"],
    "statistics": ["probability", "inference", "regression", "bayesian"],
    "software":   ["python", "sql", "r", "git"],
    "deployment": ["tools", "scale", "maintenance", "update"],
}

def title(slug: str) -> str:
    special = {"ml": "Machine Learning", "ai": "Artificial Intelligence",
               "sql": "SQL", "llms": "LLMs", "rag": "RAG", "r": "R",
               "agentic-ai": "Agentic AI"}
    return special.get(slug, slug.replace("-", " ").title())

def write(path: Path, text: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():            # never overwrite your work
        path.write_text(text, encoding="utf-8")
        print("created", path)

root = Path(".")
for section, subs in SECTIONS.items():
    write(root / section / "index.qmd",
          f'---\ntitle: "{title(section)}"\n---\n\nComing soon.\n')
    for sub in subs:
        write(root / section / sub / "index.qmd",
              f'---\ntitle: "{title(sub)}"\n---\n\nComing soon.\n')

for folder in ["assets/css", "assets/img", "assets/js", "_includes",
               ".github/workflows"]:
    (root / folder).mkdir(parents=True, exist_ok=True)

write(root / "index.qmd", '---\ntitle: "MLStation"\n---\n\nHome page coming in Step 4.\n')
for page in ["about", "privacy", "contact"]:
    write(root / f"{page}.qmd", f'---\ntitle: "{page.title()}"\n---\n\nComing soon.\n')

write(root / ".gitignore", "/.quarto/\n_site/\n_freeze/\n.venv/\n__pycache__/\n*.ipynb_checkpoints\n.DS_Store\n")
write(root / "requirements.txt", "jupyter\nnumpy\npandas\nmatplotlib\nplotly\nscikit-learn\n")
write(root / "CNAME", "mlstation.com\n")
print("\nDone. Skeleton ready.")

