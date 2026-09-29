# MLStation · Advertising playbook

This file lives in your project for reference only. The leading underscore keeps it off the live site.

## 1. How the ad system works

- All ads are controlled by **one file**: `assets/ads/ads.json`.
- For every slot the site picks, in order: **an active paid sponsor** → **Google AdSense** (once enabled) → **your house ad**.
- Change the file, run `./publish.sh "Ads update"`, and the live site updates in a few minutes.

| Placement | Where it shows | Creative used |
|---|---|---|
| `leaderboard` | Under every article title (sponsors only) | `banner` 1456 × 180 |
| `sidebar` | Under "On this page" (desktop) | `logo` + text, or `image` |
| `in-article` | After the 2nd section of longer articles | `image` 1200 × 628 + logo + text |
| `article-end` | End of each article | `logo` + text |
| `home` | Home page, above the newsletter band | `banner`, or `logo` + text |
| `partners` | Home page sponsor logo row | `logo` |

## 2. Add a sponsor (5 minutes)

1. Save their files in `assets/ads/sponsors/` (create the folder), for example
   `acme-logo.svg`, `acme-spotlight.png` (1200 × 628), `acme-banner.png` (1456 × 180).
2. In `ads.json`, copy the `TEMPLATE-copy-me` block, paste it above it, and fill in:
   `id` (unique, no spaces), `sponsor`, `logo`, `image`, `banner`, `headline`, `text`, `cta`, `url`.
3. Choose `placements`, `sections` (`ml`, `ai`, `statistics`, `software`, `deployment`, `resources`; empty = all),
   `start`, `end` (YYYY-MM-DD) and `weight` (higher = shown more often).
4. Set `"active": true`, check the JSON is valid (`python -m json.tool assets/ads/ads.json`), then preview and publish.

The ad switches on and off by itself on the start and end dates. Every link gets `utm_source=mlstation` tags,
so the sponsor can see your clicks in their own analytics.

## 3. Where the money can come from

**Important:** never show a company's name or logo (OpenAI, Anthropic, Tesla, Boeing, Apple, Google, Samsung…)
until that company has agreed to advertise. Use of a logo without permission implies a partnership that does not
exist and can breach trademark rules.

| Route | Who decides the ads | When it works | What you do |
|---|---|---|---|
| **Direct sponsorship** | You and the sponsor | Any size, easier with traffic proof | Pitch, agree, invoice, add to `ads.json` |
| **Google AdSense** | Google's auction (you can block categories and advertisers) | After approval (Step 9) | Paste your publisher ID and slot IDs into `ads.json` |
| **Developer ad networks** (EthicalAds, Carbon Ads, BuySellAds) | The network, with tech advertisers | Usually needs steady traffic | Apply, then paste their code into a slot |
| **Affiliate links** (e.g. Amazon Associates for Apple or Samsung hardware) | You choose products | Needs real content first | Add links inside articles, disclose them |

Facts to know before applying:
- EthicalAds asks for **at least 50,000 pageviews per month** ([EthicalAds FAQ](https://www.ethicalads.io/publishers/faq/)).
- Carbon Ads reviews your URL and traffic statistics, in about **5–7 business days** ([Carbon Ads FAQ](https://www.carbonads.net/faq)).
- BuySellAds lets you create ad zones and **set your own prices**, by sponsorship or CPM ([BuySellAds Marketplace](https://www.buysellads.com/publishers/marketplace)).
- AdSense lets you **block categories, advertiser URLs and individual ads** ([AdSense blocking controls](https://support.google.com/adsense/answer/180609?hl=en)).
- Amazon Associates expects **robust original content, roughly 10 posts or more** ([Associates help](https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM)).

## 4. Getting large brands: a realistic path

1. **Build proof first (months 1–3).** Publish 15–25 strong articles. Add analytics (Step 8) so you can show
   monthly visitors, pageviews, top countries and top articles.
2. **Start with companies whose products appear in your articles.** Smaller AI tools, cloud and data platforms,
   courses and developer tools say yes far more often than household brands, and they build your sponsor list.
3. **Find the right contact.** On the company website look for "Advertise", "Sponsorships", "Partners",
   "Affiliate" or "Developer relations". On LinkedIn, search for "developer marketing", "partner marketing"
   or "brand partnerships" at that company.
4. **Pitch with your Advertise page** (`mlstation.com/advertise.html`) and one screenshot of the placement.
5. **Price simply.** Charge a flat monthly fee per package. A fair starting point:
   `monthly price = (monthly pageviews ÷ 1000) × your CPM`, where CPM is the price you choose per 1,000 views.
   Offer the first month at a discount to land early sponsors.
6. **Paperwork.** One-page agreement (dates, placements, price, payment terms, right to reject ads),
   invoice through a payment link (Stripe or PayPal), payment before the start date.
7. **Report back.** Send each sponsor impressions and clicks at the end of the month. Renewals come from reports.

### Outreach email template

> Subject: Sponsorship on MLStation: reaching ML and AI engineers
>
> Hi {Name},
>
> I run MLStation (mlstation.com), practical articles on machine learning, AI and deployment read by
> engineers and data scientists. Last month we had {X} pageviews, mostly from {countries}.
> Our articles on {topic} are a natural fit for {Product}.
>
> We offer clearly labelled placements (leaderboard, in-article spotlight, sidebar). Formats and specs:
> https://mlstation.com/advertise.html
>
> Would you be open to a one-month trial in our {AI / Deployment} section starting {date}?
>
> Best,
> {Your name}

## 5. Rules to follow

- Keep every ad labelled "Sponsored" (built in).
- Disclose affiliate links in the article ("This article contains affiliate links").
- Keep a record of each sponsor's written approval for their logo and copy.
- Do not click your own ads, especially AdSense.
