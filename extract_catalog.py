import os
import re
import json
import urllib.request
from bs4 import BeautifulSoup
import time

def fetch_all_categories_and_products():
    base_url = 'https://www.medihubglobalexport.com/'
    req = urllib.request.Request(base_url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

    m = re.search(r'var drop_product =.*?eval\((\[.*?\])\);', html)
    if not m:
        print('Failed to extract categories from homepage')
        return

    raw_cats = eval(m.group(1))
    categories = []
    for i in range(0, len(raw_cats), 5):
        if raw_cats[i] and raw_cats[i+1]:
            categories.append({
                'name': raw_cats[i].strip(),
                'slug': raw_cats[i+1].strip(),
                'url': base_url + raw_cats[i+1].strip()
            })

    print(f"Total categories found: {len(categories)}")

    catalog = []
    total_products = 0

    for idx, cat in enumerate(categories, 1):
        print(f"[{idx}/{len(categories)}] Fetching {cat['name']} ({cat['url']})...")
        try:
            req = urllib.request.Request(cat['url'], headers={'User-Agent': 'Mozilla/5.0'})
            cat_html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(cat_html, 'html.parser')

            # Find all products in category page
            # Each product typically has an H2 with product name
            cat_products = []
            
            # Find all product H2 headers
            for h2 in soup.find_all('h2'):
                title = h2.get_text(strip=True)
                if not title or len(title) < 3:
                    continue
                if any(x in title.lower() for x in ['menu', 'navigation', 'contact us', 'about us', 'categories', 'popular products']):
                    continue
                
                # Find container for this product
                # Walk up to the main product block
                p_container = h2.find_parent('table')
                if not p_container:
                    p_container = h2.find_parent('div', class_=lambda c: c and any(k in c for k in ['box', 'prd', 'brd', 'm10', 'prod', 'wrp']))
                if not p_container:
                    p_container = h2.parent.parent

                # Image
                img_url = ""
                if p_container:
                    for img in p_container.find_all('img'):
                        src = img.get('dataimg') or img.get('src') or img.get('data-src') or ""
                        if 'imimg.com' in src and '500x500' in src:
                            img_url = src
                            break
                        elif 'imimg.com' in src and not img_url:
                            img_url = src

                # Specifications table / key-values
                specs = {}
                description = ""
                
                if p_container:
                    # Look for specification rows
                    for tr in p_container.find_all('tr'):
                        tds = tr.find_all('td')
                        if len(tds) == 2:
                            k = tds[0].get_text(strip=True).rstrip(':').strip()
                            v = tds[1].get_text(strip=True)
                            if k and v and len(k) < 40 and not any(x in k.lower() for x in ['rating', 'feedback', 'price']):
                                specs[k] = v

                    # Look for description text
                    desc_div = p_container.find('div', class_=lambda c: c and 'desc' in c) or p_container.find('p', class_=lambda c: c and 'desc' in c)
                    if desc_div:
                        description = desc_div.get_text(strip=True)
                    else:
                        # Find paragraph texts
                        ps = [p.get_text(strip=True) for p in p_container.find_all('p') if len(p.get_text(strip=True)) > 25]
                        if ps:
                            description = " ".join(ps[:2])

                # Check duplicate within this category
                if not any(p['name'].lower() == title.lower() for p in cat_products):
                    cat_products.append({
                        'name': title,
                        'image': img_url,
                        'specifications': specs,
                        'description': description
                    })

            print(f"   -> Found {len(cat_products)} products")
            total_products += len(cat_products)

            catalog.append({
                'category_name': cat['name'],
                'slug': cat['slug'],
                'url': cat['url'],
                'product_count': len(cat_products),
                'products': cat_products
            })
            time.sleep(0.3)
        except Exception as e:
            print(f"   -> Error: {e}")
            catalog.append({
                'category_name': cat['name'],
                'slug': cat['slug'],
                'url': cat['url'],
                'product_count': 0,
                'products': [],
                'error': str(e)
            })

    print(f"\n==========================================")
    print(f"Scraping Completed! Total Categories: {len(catalog)}, Total Products: {total_products}")
    print(f"==========================================")

    # Save to JSON
    with open('medihub_full_catalog.json', 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    print("Catalog saved to medihub_full_catalog.json")

if __name__ == '__main__':
    fetch_all_categories_and_products()
