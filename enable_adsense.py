"""
Turn Google AdSense on for MLStation in two stages.

Stage 1: connect the site (after you sign up for AdSense and get your publisher ID)
    python enable_adsense.py ca-pub-1234567890123456

    - writes ads.txt at the site root
    - adds the AdSense verification meta tag to every page
    - saves the publisher ID in assets/ads/ads.json (ads stay OFF)

Stage 2: show ads (after AdSense approves the site and you create ad units)
    python enable_adsense.py --slots sidebar=1111111111 in-article=2222222222 article-end=3333333333 home=4444444444

    - saves the ad unit IDs and switches AdSense ON
    - paid sponsors still come first; AdSense fills the rest; house ads are the fallback

Switch AdSense off again at any time:
    python enable_adsense.py --off
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ADS = ROOT / "assets/ads/ads.json"
HEAD = ROOT / "_includes/head.html"
QUARTO = ROOT / "_quarto.yml"
PLACEMENTS = {"leaderboard", "sidebar", "in-article", "article-end", "home"}


def load():
    return json.loads(ADS.read_text(encoding="utf-8"))


def save(cfg):
    ADS.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def connect(pub):
    if not re.fullmatch(r"ca-pub-\d{16}", pub):
        sys.exit("Publisher ID must look like ca-pub-1234567890123456 (16 digits). Copy it from AdSense > Account > Account information.")
    digits = pub.replace("ca-", "")

    (ROOT / "ads.txt").write_text(f"google.com, {digits}, DIRECT, f08c47fec0942fa0\n", encoding="utf-8")

    head = HEAD.read_text(encoding="utf-8")
    head = re.sub(r'\n?<meta name="google-adsense-account"[^>]*>', "", head)
    HEAD.write_text(head.rstrip() + f'\n<meta name="google-adsense-account" content="{pub}">\n', encoding="utf-8")

    y = QUARTO.read_text(encoding="utf-8")
    if "- ads.txt" not in y:
        y = y.replace("  resources:\n", "  resources:\n    - ads.txt\n", 1)
        QUARTO.write_text(y, encoding="utf-8")

    cfg = load()
    cfg.setdefault("adsense", {})["client"] = pub
    cfg["adsense"].setdefault("enabled", False)
    cfg["adsense"].setdefault("slots", {p: "" for p in PLACEMENTS})
    save(cfg)
    print(f"Connected {pub}.")
    print("Created ads.txt, added the verification tag, saved the ID. Ads are still OFF.")
    print('Next: ./publish.sh "Connect AdSense", then click Verify in AdSense.')


def set_slots(pairs):
    cfg = load()
    ads = cfg.setdefault("adsense", {})
    if not re.fullmatch(r"ca-pub-\d{16}", ads.get("client", "")):
        sys.exit("Run stage 1 first:  python enable_adsense.py ca-pub-XXXXXXXXXXXXXXXX")
    slots = ads.setdefault("slots", {})
    for pair in pairs:
        if "=" not in pair:
            sys.exit(f"'{pair}' should look like sidebar=1234567890")
        name, value = pair.split("=", 1)
        if name not in PLACEMENTS:
            sys.exit(f"Unknown placement '{name}'. Use: {', '.join(sorted(PLACEMENTS))}")
        if not re.fullmatch(r"\d{6,}", value):
            sys.exit(f"Ad unit ID for {name} should be digits only (data-ad-slot in the AdSense code).")
        slots[name] = value
    ads["enabled"] = True
    save(cfg)
    print("AdSense is ON for:", ", ".join(k for k, v in slots.items() if v))
    print('Next: ./publish.sh "Enable AdSense"')


def off():
    cfg = load()
    cfg.setdefault("adsense", {})["enabled"] = False
    save(cfg)
    print('AdSense is OFF. Run ./publish.sh "Pause AdSense" to update the live site.')


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    if args[0] == "--off":
        off()
    elif args[0] == "--slots":
        set_slots(args[1:])
    else:
        connect(args[0])
