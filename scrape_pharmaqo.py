import urllib.request
from bs4 import BeautifulSoup
import re
import json
import time

def scrape_pharmaqo():
    urls_to_scan = [
        'https://pharmaqolabs.com/injectables/',
        'https://pharmaqolabs.com/injectables/page/2/',
        'https://pharmaqolabs.com/product-category/injectables/',
        'https://pharmaqolabs.com/product-category/injectables/page/2/'
    ]

    all_product_links = set()
    for u in urls_to_scan:
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
            html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            for a in soup.find_all('a', href=re.compile(r'/product/')):
                href = a.get('href')
                if href and not href.endswith('/product/') and not href.endswith('/injectables/'):
                    all_product_links.add(href)
        except Exception as e:
            print(f"Notice: {u} -> {e}", flush=True)

    print(f"Total unique PharmaQO product URLs to fetch: {len(all_product_links)}", flush=True)

    pharmaqo_products = []
    seen = set()

    for idx, url in enumerate(sorted(list(all_product_links)), 1):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
            html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')

            # Title
            h1 = soup.find('h1') or soup.find('h2')
            title = h1.get_text(strip=True) if h1 else ''
            if not title:
                continue

            # Image
            img_url = ''
            for img in soup.find_all('img'):
                src = img.get('src') or img.get('data-src') or ''
                if '/uploads/' in src and not any(x in src.lower() for x in ['logo', 'banner', 'icon']):
                    img_url = src
                    break

            # Product description & specifications
            # Often in WooCommerce .woocommerce-product-details__short-description, #tab-description, or specs table
            desc_div = soup.find('div', class_=re.compile(r'description|summary|entry-content', re.I))
            desc_text = ""
            if desc_div:
                desc_text = desc_div.get_text(separator=' ', strip=True)

            # Attributes table
            specs = {}
            for row in soup.find_all('tr'):
                th = row.find('th')
                td = row.find('td')
                if th and td:
                    specs[th.get_text(strip=True)] = td.get_text(strip=True)

            # Extract dosage
            dosage_m = re.search(r'(\d+(?:\.\d+)?\s*(?:mg|mcg|iu|g|ml|%))', title + ' ' + desc_text, re.I)
            dosage = dosage_m.group(1) if dosage_m else ""

            # Standardized title
            display_title = f"PharmaQO {title}" if not title.lower().startswith('pharmaqo') else title

            if display_title.lower() in seen:
                continue
            seen.add(display_title.lower())

            item_specs = {
                'Brand': 'PHARMAQO Labs',
                'Manufacturer': 'PharmaQO Laboratories',
                'Form': 'Injection (10ml Multi-Dose Vial)',
                'Packaging Type': '10ml Vial with Flip-Off Security Cap',
                'Packaging Size': '10ml x 1 Vial',
                'Strength / Potency': dosage or 'Standard Potency',
                'Quality Grade': 'Pharmaceutical Grade Pure Lyophilized / Micronized Oil Base',
                'Authentication': 'Scratch-off Holographic Code with Online Verification System',
                'Therapeutic Class': 'Injectable Anabolic & Androgenic Formulation',
                'Usage / Application': 'Lean Muscle Synthesis, Strength, Conditioning & Performance'
            }
            if specs:
                item_specs.update(specs)

            pharmaqo_products.append({
                'name': display_title,
                'category': 'PHARMAQO Labs - Injectables',
                'categorySlug': 'pharmaqo-labs-injectables',
                'dosage': dosage,
                'form': 'Injection (10ml Vial)',
                'image': img_url or 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
                'packaging': '10ml Multi-dose Vial',
                'specifications': item_specs,
                'description': desc_text[:300] if desc_text else f"{display_title} authentic injectable formulation by PharmaQO Labs.",
                'isPopular': True
            })

            print(f"[{idx}/{len(all_product_links)}] Scraped: {display_name if 'display_name' in locals() else display_title} ({dosage})", flush=True)
            time.sleep(0.2)
        except Exception as e:
            print(f"Error {url}: {e}", flush=True)

    print(f"\n==========================================", flush=True)
    print(f"Total PharmaQO products scraped: {len(pharmaqo_products)}", flush=True)
    print(f"==========================================", flush=True)

    with open('pharmaqo_scraped.json', 'w', encoding='utf-8') as f:
        json.dump(pharmaqo_products, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    scrape_pharmaqo()
