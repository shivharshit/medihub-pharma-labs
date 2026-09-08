import urllib.request
from bs4 import BeautifulSoup
import re
import json
import time
import os

def scrape_evolve_biolabs():
    base_url = 'https://www.evolvebiolabs.com'
    cat_urls = [
        'https://www.evolvebiolabs.com/product/list/',
        'https://www.evolvebiolabs.com/product/list/Hormones/',
        'https://www.evolvebiolabs.com/product/list/Pro-series/',
        'https://www.evolvebiolabs.com/product/list/Mens%20Health/',
        'https://www.evolvebiolabs.com/product/list/Wellness/',
        'https://www.evolvebiolabs.com/product/list/Weight%20Loss/'
    ]

    all_links = set()
    for u in cat_urls:
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
            html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a['href']
                if href.startswith('/product/') and not '/product/list/' in href and href != '/product/list':
                    full_u = href if href.startswith('http') else base_url + href
                    all_links.add(full_u)
        except Exception as e:
            print(f"Error fetching list URL {u}: {e}")

    print(f"Total {len(all_links)} product pages to scrape from Evolve Biolabs...")

    evolve_products = []
    seen_names = set()

    for idx, url in enumerate(sorted(list(all_links)), 1):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
            html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')

            # Heading
            h1 = soup.find('h1') or soup.find('h2')
            raw_title = h1.get_text(strip=True) if h1 else ''
            
            # Look for subline or active substance
            page_text = soup.get_text(separator='\n', strip=True)
            lines = [l.strip() for l in page_text.split('\n') if l.strip()]

            # Look for category inside page text
            sub_category = "Anabolics"
            for i, line in enumerate(lines):
                if line.lower() == 'category:' and i + 1 < len(lines):
                    sub_category = lines[i+1]
                    break

            # Look for formulation line (e.g., "BOLDABOL - Boldenone Undecylenate 250MG")
            active_comp = ""
            full_title = raw_title
            for line in lines:
                if (raw_title.lower() in line.lower() and ('-' in line or '–' in line or '—' in line or 'mg' in line.lower() or 'iu' in line.lower())) and len(line) < 80:
                    cleaned_line = line.replace('', '-').replace('–', '-').replace('—', '-')
                    active_comp = cleaned_line
                    full_title = cleaned_line
                    break

            # If no complex title, compose title
            if not active_comp:
                # search for line with mg / mcg / iu
                for line in lines:
                    if any(u in line.lower() for u in ['mg', 'mcg', 'iu', 'iu/ml', 'mg/ml']) and len(line) < 60 and not 'tablets containing' in line.lower():
                        active_comp = line
                        break

            # Image
            img_url = ""
            for img in soup.find_all('img'):
                src = img.get('src', '')
                if '/media/products/' in src and not any(x in src.lower() for x in ['logo', 'banner', 'icon']):
                    img_url = src if src.startswith('http') else base_url + src
                    break

            # Description
            desc_paras = []
            # Find paragraphs or uses
            for p in soup.find_all('p'):
                p_text = p.get_text(strip=True)
                if len(p_text) > 30 and not any(k in p_text.lower() for k in ['cookie', 'copyright', 'all rights reserved', 'authentication']):
                    desc_paras.append(p_text)

            description = " ".join(desc_paras[:3]) if desc_paras else f"{full_title} high-grade formulation by Evolve Biolabs."

            # Dosage extraction
            dosage_m = re.search(r'(\d+(?:\.\d+)?\s*(?:mg|mcg|iu|g|ml|%))', full_title + ' ' + active_comp + ' ' + description, re.IGNORECASE)
            dosage = dosage_m.group(1) if dosage_m else ""

            # Form determination
            text_lower = (full_title + " " + description + " " + url).lower()
            if 'tablet' in text_lower or 'capsule' in text_lower or 'oral' in text_lower or 'tab' in text_lower:
                form = 'Tablet / Oral'
                pkg = '50 / 100 Tablets Box'
            elif 'injection' in text_lower or 'vial' in text_lower or 'ampoule' in text_lower or 'inject' in text_lower or 'hormone' in text_lower or 'pro-series' in text_lower:
                form = 'Injection (10ml Vial)'
                pkg = '10ml Multi-dose Vial (100mg - 300mg/ml)'
            else:
                form = 'Specialty Formulation'
                pkg = 'Export Standard Pack'

            # Clean name
            clean_name = full_title.replace('', '-').strip()
            if not clean_name:
                clean_name = raw_title.strip()
            
            # Prefix with Evolve Biolabs if needed
            display_name = f"Evolve Biolabs {clean_name}" if not clean_name.lower().startswith('evolve') else clean_name

            # Avoid duplicates if any
            if clean_name.lower() in seen_names:
                display_name += f" ({sub_category})"
            seen_names.add(clean_name.lower())

            specs = {
                'Brand': 'Evolve Biolabs',
                'Product Line': sub_category,
                'Form': form,
                'Packaging Type': pkg,
                'Strength': dosage or 'Standard Potency',
                'Usage / Application': 'Muscle Building, Athletic Performance & Recovery',
                'Authentication': 'Verifiable Authenticity Code on Pack',
                'Source URL': url
            }
            if active_comp:
                specs['Composition'] = active_comp

            evolve_products.append({
                'name': display_name,
                'category': 'Evolve Biolabs Anabolics',
                'categorySlug': 'evolve-biolabs-anabolics',
                'dosage': dosage,
                'form': form,
                'image': img_url or 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
                'packaging': pkg,
                'specifications': specs,
                'description': description,
                'isPopular': True
            })

            print(f"[{idx}/{len(all_links)}] Scraped: {display_name} ({dosage}) - {form}")
            time.sleep(0.2)
        except Exception as e:
            print(f"Error scraping {url}: {e}")

    print(f"\n==========================================")
    print(f"Total Evolve Biolabs products scraped: {len(evolve_products)}")
    print(f"==========================================")

    with open('evolve_scraped_products.json', 'w', encoding='utf-8') as f:
        json.dump(evolve_products, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    scrape_evolve_biolabs()
