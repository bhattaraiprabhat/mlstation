"""Register ml/visualization as a topic: site map, navbar, landing pages.
Run once from the project root:  python add_visualization_topic.py
Safe to re-run."""
from pathlib import Path
import subprocess, sys

SLUG, TITLE, ICON = "visualization", "Visualization", "pie-chart"
DESC = "Charts that explain: choosing, designing and animating visuals for data and models."

# 1) build_pages.py site map (after Feature Engineering)
bp = Path("build_pages.py"); s = bp.read_text(encoding="utf-8")
anchor = '("feature-engineering", "Feature Engineering", "sliders", "Turning raw data into signals a model can learn from."),'
entry = f'\n               ("{SLUG}", "{TITLE}", "{ICON}", "{DESC}"),'
if f'("{SLUG}",' not in s:
    assert anchor in s, "Feature Engineering line not found in build_pages.py"
    s = s.replace(anchor, anchor + entry); bp.write_text(s, encoding="utf-8")
    print("build_pages.py: added")

# 2) _quarto.yml navbar (under ML > Foundations)
qy = Path("_quarto.yml"); y = qy.read_text(encoding="utf-8")
nav_anchor = "            href: ml/feature-engineering/index.qmd\n"
nav = (f'          - text: "{TITLE}"\n            icon: {ICON}\n'
       f"            href: ml/{SLUG}/index.qmd\n")
if f"ml/{SLUG}/index.qmd" not in y:
    assert nav_anchor in y, "Feature Engineering menu item not found in _quarto.yml"
    y = y.replace(nav_anchor, nav_anchor + nav); qy.write_text(y, encoding="utf-8")
    print("_quarto.yml: added")

# 3) folder + landing pages
Path("ml", SLUG).mkdir(parents=True, exist_ok=True)
subprocess.run([sys.executable, "build_pages.py"], check=True)
