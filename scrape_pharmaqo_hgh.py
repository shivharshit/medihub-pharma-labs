import urllib.request
from bs4 import BeautifulSoup
import re
import json
import time

def scrape_pharmaqo_hgh():
    hgh_peptides_urls = [
        'https://pharmaqolabs.com/product/retaturtide-10mg/',
        'https://pharmaqolabs.com/product/qomatropin-hgh-100iu-kit-with-waters/',
        'https://pharmaqolabs.com/product/igf-des-1-3/',
        'https://pharmaqolabs.com/product/igf1-lr3/',
        'https://pharmaqolabs.com/product/semaglutide-5mg-multi-dose-prefilled-pen/',
        'https://pharmaqolabs.com/product/bpc-157/',
        'https://pharmaqolabs.com/product/qomatropin-cartridge-12mg-36iu/',
        'https://pharmaqolabs.com/product/mgf/',
        'https://pharmaqolabs.com/product/tb-500/',
        'https://pharmaqolabs.com/product/pharmaqo-mt-2/',
        'https://pharmaqolabs.com/product/hcg-5000/',
        'https://pharmaqolabs.com/product/tirzepatide-10mg/'
    ]

    hgh_items = []
    
    # Detailed mapping for HGH & Peptides
    peptide_meta = {
        'retaturtide': ('Retatrutide 10mg (Triple Agonist GIP/GLP-1/Glucagon)', '10mg', 'Lyophilized Peptide (Vial + Solvent)', '10mg Vial'),
        'qomatropin-hgh-100iu': ('Qomatropin Somatropin HGH 100 IU Complete Kit', '100 IU', 'Lyophilized Powder (10 Vials + 10 Sterile Waters)', '100 IU Kit (10x10IU)'),
        'igf-des': ('IGF-DES (1-3) 1mg Lyophilized Peptide', '1mg', 'Lyophilized Powder (10x0.1mg Vials)', '10 x 0.1mg Vials Box'),
        'igf1-lr3': ('IGF-1 LR3 Long-Acting Insulin-Like Growth Factor 1mg', '1mg', 'Lyophilized Powder (10x0.1mg Vials)', '10 x 0.1mg Vials Box'),
        'semaglutide': ('Semaglutide 5mg Multi-Dose Prefilled Pen Device', '5mg', 'Prefilled Multi-Dose Subcutaneous Pen', '1 Prefilled Pen (5mg/3ml)'),
        'bpc-157': ('BPC-157 Body Protection Compound Healing Peptide', '5mg', 'Lyophilized Peptide (10ml Vial)', '10ml Vial / Box'),
        'qomatropin-cartridge': ('Qomatropin HGH Cartridge 12mg (36 IU) for Pen Device', '12mg (36 IU)', 'Liquid Cartridge for Injector Pen', '1 x 12mg Cartridge'),
        'mgf': ('MGF (Mechano Growth Factor) 2mg Peptide', '2mg', 'Lyophilized Peptide Vial', '1 Vial x 2mg'),
        'tb-500': ('TB-500 (Thymosin Beta-4) 5mg Tissue Repair Peptide', '5mg', 'Lyophilized Peptide Vial', '10ml Vial / Box'),
        'mt-2': ('Melanotan II (MT-2) 10mg Peptide', '10mg', 'Lyophilized Peptide Vial', '10mg Vial / Box'),
        'hcg-5000': ('HCG 5000 IU (Human Chorionic Gonadotropin) + Water', '5000 IU', 'Lyophilized Vial + Diluent Ampoule', '5000 IU Vial + Solvent'),
        'tirzepatide': ('Tirzepatide 10mg Dual GIP / GLP-1 Receptor Agonist', '10mg', 'Lyophilized Peptide Vial', '10mg Vial / Box')
    }

    for url in hgh_peptides_urls:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
            html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')

            h1 = soup.find('h1') or soup.find('h2')
            raw_title = h1.get_text(strip=True) if h1 else ''

            img_url = ''
            for img in soup.find_all('img'):
                src = img.get('src') or img.get('data-src') or ''
                if '/uploads/' in src and not any(x in src.lower() for x in ['logo', 'banner', 'icon']):
                    img_url = src
                    break

            desc_div = soup.find('div', class_=re.compile(r'description|summary|entry-content', re.I))
            desc_text = desc_div.get_text(separator=' ', strip=True) if desc_div else ""

            # Check meta match
            matched_key = None
            for k in peptide_meta:
                if k in url.lower():
                    matched_key = k
                    break

            if matched_key:
                comp_name, dosage, form_type, pkg_type = peptide_meta[matched_key]
                display_title = f"PHARMAQO Labs {comp_name}"
            else:
                display_title = f"PHARMAQO Labs {raw_title}"
                dosage = "Standard Potency"
                form_type = "Lyophilized Peptide / Biologic"
                pkg_type = "Export Standard Pack"

            specs = {
                'Brand': 'PHARMAQO Labs',
                'Manufacturer': 'PHARMAQO Laboratories Ltd.',
                'Composition': display_title,
                'Form': form_type,
                'Strength / Dosage': dosage,
                'Packaging Type': pkg_type,
                'Packaging Size': pkg_type,
                'Quality Grade': 'High Purity >99.2% (HPLC Assayed & Tested)',
                'Storage Condition': 'Store at 2°C - 8°C (Cold-Chain Protected)',
                'Authentication': 'Verifiable Security Scratch Code with Online Verification System',
                'Therapeutic Class': 'Recombinant Peptide & Human Growth Hormone (HGH) Biologic',
                'Usage / Application': 'Fat Oxidation, Tissue Regeneration, Cellular Recovery, Metabolic Health'
            }

            hgh_items.append({
                'name': display_title,
                'category': 'PHARMAQO Labs - HGH & PEPTIDES',
                'categorySlug': 'pharmaqo-labs-hgh-peptides',
                'dosage': dosage,
                'form': 'Peptide / Lyophilized' if not 'Cartridge' in display_title and not 'Pen' in display_title else 'Injectable Pen / Cartridge',
                'image': img_url or 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
                'packaging': pkg_type,
                'specifications': specs,
                'description': desc_text[:320] if desc_text else f"{display_title} premium recombinant peptide formulation by PHARMAQO Labs with guaranteed laboratory assay purity.",
                'isPopular': True
            })
            print(f"Scraped: {display_title} | {dosage} | {form_type}")
            time.sleep(0.2)
        except Exception as e:
            print(f"Error scraping {url}: {e}")

    print(f"\n==========================================")
    print(f"Total PHARMAQO HGH & Peptides scraped: {len(hgh_items)}")
    print(f"==========================================")

    with open('pharmaqo_hgh_scraped.json', 'w', encoding='utf-8') as f:
        json.dump(hgh_items, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    scrape_pharmaqo_hgh()
