from bs4 import BeautifulSoup
import re
import json

def inspect_infinity():
    with open('infinity_injectables.html', 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Look for all products
    # Let's find all images on the page
    all_imgs = soup.find_all('img')
    print(f"Total images on page: {len(all_imgs)}")
    for img in all_imgs:
        src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or ''
        alt = img.get('alt') or ''
        if any(k in src.lower() or k in alt.lower() for k in ['blend', 'deca', 'test', 'susta', 'tren', 'equipoise', 'injectable', 'uploads']):
            print(f"Product Img -> Alt: '{alt}', Src: '{src}'")

    # Look for links
    all_links = soup.find_all('a', href=True)
    product_links = set()
    for a in all_links:
        href = a['href']
        if '/product/' in href or '/injectable/' in href:
            product_links.add(href)
    print(f"\nProduct links found: {len(product_links)}")
    for l in sorted(list(product_links))[:15]:
        print("Link:", l)

if __name__ == '__main__':
    inspect_infinity()
