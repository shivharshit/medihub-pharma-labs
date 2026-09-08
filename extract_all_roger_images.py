import pypdfium2 as pdfium
from PIL import Image
import os
import json
import re

def extract_and_link_roger_images():
    pdf_path = r'C:\Users\harsh\.gemini\antigravity\brain\27f9e7c7-c49f-48a5-85bc-4b07150d35e4\.user_uploaded\media_1788773650542.pdf'
    out_dir = 'public/products/roger'
    os.makedirs(out_dir, exist_ok=True)

    pdf = pdfium.PdfDocument(pdf_path)
    print(f"Loaded PDF with {len(pdf)} pages.")

    # Definition of pages and their products [Top-Left, Top-Right, Bottom-Left, Bottom-Right]
    page_mappings = [
        # Injectables
        (4, ["acebolone-100", "cypiosterone-250", "decadrolone-250", "decadrolone-400"]), # Page 5
        (5, ["enanbolone-200", "enanesterone-250", "enanolone-100", "gigantic-blend-500"]), # Page 6
        (6, ["helios-plus", "hexabolone-76-5", "maxbolone-200", "maxesterone-250"]), # Page 7
        (7, ["maxesterone-400", "muscle-builder-400", "phenprodrolone-100", "propenolone-100"]), # Page 8
        (8, ["propesterone-100", "stanoil-50", "supercutmix-200", "suspebolone-50"]), # Page 9
        (9, ["suspenzolol-100", "suspesterone-100", "trim-forge-400", "undecylenone-250"]), # Page 10
        (10, ["undecylenone-400", "lipo-cardiac-help-200", "reconstituter", None]), # Page 11

        # Tablets
        (13, ["anavolone-10", "androlone-50", "arimizole-1", "clencut-40"]), # Page 14
        (14, ["clomitrate-50", "cytodium-25", "diananone-10", "halosterone-10"]), # Page 15
        (15, ["mesterobol-25", "nolvatrate-20", "stano-10", "turinasterone-10"]), # Page 16

        # PCT
        (18, ["enclomifix", "organ-care", "prime-yohimbine", None]), # Page 19

        # SARMS
        (21, ["acabolyn", "anapril-4", "cardamide-501516", "ligamin-4033"]), # Page 22
        (22, ["meta-bulk", "meta-cut", "meta-lean", "morenger-677"]), # Page 23
        (23, ["ostosil-2866", "sarmanone-23", "stenafil-9009", "testoxin-140"]), # Page 24
        (24, ["yukostatin-11", None, None, None]), # Page 25

        # Oral Peptides
        (27, ["5-amino-1mq", "bpc-157-oral", "slu-pp-332", "tesofensine"]), # Page 28

        # Injectable Peptides
        (30, ["adipolyze-177-191aa", "epochy", "follivol-344", "gonadorol"]), # Page 31
        (31, ["insulyx-ds", "insulyx", "ipamorin", "mechatosin"]), # Page 32
        (32, ["libidrin", "morphix-dac", "morphix-grf", "motsoxy"]), # Page 33
        (33, ["nicovium-plus", "omnitropin-191aa", "pentavol-157", "peptorin-2"]), # Page 34
        (34, ["peptorin-6", "proaptox", "retadreline", "revostrate"]), # Page 35
        (35, ["somnitrix", "tesatrope", "thymorix-500", "tirzevac"]), # Page 36
        (36, ["pure-peptide-water", None, None, None]) # Page 37
    ]

    image_map = {}

    for page_idx, slots in page_mappings:
        page = pdf[page_idx]
        img = page.render(scale=2.5).to_pil()
        W, H = img.size

        # Default margin coordinates
        margin_top = int(H * 0.08)
        margin_bottom = int(H * 0.94)
        margin_left = int(W * 0.05)
        margin_right = int(W * 0.95)
        mid_x = W // 2
        mid_y = H // 2

        # 4 Quadrants: TL, TR, BL, BR
        quadrants = [
            (margin_left, margin_top, mid_x - 15, mid_y - 20),
            (mid_x + 15, margin_top, margin_right, mid_y - 20),
            (margin_left, mid_y + 15, mid_x - 15, margin_bottom),
            (mid_x + 15, mid_y + 15, margin_right, margin_bottom)
        ]

        # Special handling for single-item centered pages (like page 25 or 37)
        if slots[1] is None and slots[2] is None and slots[3] is None and slots[0] is not None:
            # Single item centered
            crop_box = (int(W * 0.15), int(H * 0.10), int(W * 0.85), int(H * 0.90))
            item_name = slots[0]
            cropped = img.crop(crop_box)
            file_path = f"{out_dir}/{item_name}.png"
            cropped.save(file_path, "PNG", optimize=True)
            image_map[item_name] = f"/products/roger/{item_name}.png"
            print(f"Extracted [Single Centered]: {item_name} -> {file_path}")
            continue

        for i, item_name in enumerate(slots):
            if not item_name:
                continue
            box = quadrants[i]
            cropped = img.crop(box)
            file_path = f"{out_dir}/{item_name}.png"
            cropped.save(file_path, "PNG", optimize=True)
            image_map[item_name] = f"/products/roger/{item_name}.png"
            print(f"Extracted [P{page_idx+1} Q{i+1}]: {item_name} -> {file_path}")

    print(f"\nTotal extracted Roger Pharma images: {len(image_map)}")

    # Update products.json with the exact matched image
    with open('src/data/products.json', 'r', encoding='utf-8') as f:
        products = json.load(f)

    updated_count = 0
    for p in products:
        if p.get('category') == 'Roger Pharma':
            p_name_lower = p['name'].lower()
            # Match with extracted image
            matched_img = None
            for key, img_path in image_map.items():
                clean_k = key.replace('-', ' ')
                if clean_k in p_name_lower or key in p_name_lower:
                    matched_img = img_path
                    break
            
            if matched_img:
                p['image'] = matched_img
                updated_count += 1
            else:
                # Fallback check partial matches
                for key, img_path in image_map.items():
                    k_parts = [part for part in key.split('-') if len(part) > 2]
                    if any(part in p_name_lower for part in k_parts):
                        p['image'] = img_path
                        updated_count += 1
                        break

    with open('src/data/products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    print(f"Linked {updated_count} Roger Pharma products with their exact cropped PDF catalog images!")

if __name__ == '__main__':
    extract_and_link_roger_images()
