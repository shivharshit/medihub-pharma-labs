from bs4 import BeautifulSoup
import re
import json

def parse_infinity():
    with open('infinity_injectables.html', 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Find all Elementor columns containing products
    columns = soup.find_all('div', class_=lambda c: c and 'elementor-column' in c and 'elementor-top-column' not in c)
    print(f"Total elementor sub-columns found: {len(columns)}")

    products = []
    seen_titles = set()

    for col in columns:
        # Find heading
        h = col.find(['h2', 'h3', 'h4', 'h5', 'h6'])
        if not h:
            continue
        title = h.get_text(strip=True)
        if not title or len(title) < 2 or any(k in title.lower() for k in ['menu', 'infinity', 'navigation', 'injectable', 'footer', 'home']):
            continue

        if title.lower() in seen_titles:
            continue
        seen_titles.add(title.lower())

        # Find images in this column
        imgs = []
        for img in col.find_all('img'):
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or ''
            if src and not 'logo' in src.lower():
                imgs.append(src)

        # Find description / text
        p_tags = [p.get_text(strip=True) for p in col.find_all('p') if len(p.get_text(strip=True)) > 10]
        desc = " ".join(p_tags)

        # Full text in column
        full_text = col.get_text(separator=' | ', strip=True)

        products.append({
            'title': title,
            'images': imgs,
            'description': desc,
            'full_text': full_text
        })

    print(f"Total products parsed: {len(products)}")
    for i, p in enumerate(products, 1):
        print(f"[{i}] {p['title']} | Img count: {len(p['images'])} | Img: {p['images'][0] if p['images'] else 'None'}")
        print(f"    Text: {p['full_text'][:120]}")

    with open('infinity_parsed.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)

if __name__ == '__main__':
    parse_infinity()
