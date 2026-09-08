from bs4 import BeautifulSoup
import re
import json

def process_infinity_injectables():
    with open('infinity_injectables.html', 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Detailed specifications for all Infinity Pharma Injectables
    infinity_catalog = [
        {
            "name": "Infinity Pharma I.P. BLEND 1 (150mg/ml)",
            "comp": "Testosterone Propionate 50mg, Trenbolone Acetate 50mg, Drostanolone Propionate 50mg",
            "dosage": "150mg/ml",
            "potency": "150 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/6.1-qmcr4vji9wcvzog0lmbme8vh434hxiedl5sp3cw324.webp",
            "desc": "I.P. BLEND 1 is presented in a 10ml multi-dose vial containing Testosterone Propionate (50mg), Trenbolone Acetate (50mg), and Drostanolone Propionate (50mg) per ml. A fast-acting cut and definition stack by Infinity Pharma."
        },
        {
            "name": "Infinity Pharma I.P. BLEND 2 (400mg/ml)",
            "comp": "Testosterone Enanthate 200mg, Trenbolone Enanthate 100mg, Drostanolone Enanthate 100mg",
            "dosage": "400mg/ml",
            "potency": "400 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/5.1-qmcrc9ju00h19bpmgbb1hvqx84pdfuqexqf3wnxo58.webp",
            "desc": "I.P. BLEND 2 is a long-acting high-potency formula containing Testosterone Enanthate (200mg), Trenbolone Enanthate (100mg), and Drostanolone Enanthate (100mg) per ml for lean mass, vascularity and sustained strength."
        },
        {
            "name": "Infinity Pharma I.P. BLEND 3 (650mg/ml)",
            "comp": "Testosterone Enanthate 250mg, Boldenone Undecylenate 200mg, Nandrolone Decanoate 200mg",
            "dosage": "650mg/ml",
            "potency": "650 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/17.1-qmcrvrp9t96861dpk8tcqgk8yykk5r5wm9qted0l18.webp",
            "desc": "I.P. BLEND 3 is an ultra-potent bulking blend containing Testosterone Enanthate (250mg), Boldenone Undecylenate (200mg), and Nandrolone Decanoate (200mg) per ml, engineered for explosive mass gains and joint recovery."
        },
        {
            "name": "Infinity Pharma I.P. BLEND 4 (300mg/ml)",
            "comp": "Testosterone Propionate 100mg, Trenbolone Acetate 100mg, Drostanolone Propionate 100mg",
            "dosage": "300mg/ml",
            "potency": "300 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/19.1-qmcrxgss5hhv4owynh83qj57l07f22wgio5dlchzss.webp",
            "desc": "I.P. BLEND 4 is a maximum-strength cutting blend with equal ratios of Test Propionate (100mg), Tren Acetate (100mg), and Masteron Propionate (100mg) per ml for competition dryness, hardening, and density."
        },
        {
            "name": "Infinity Pharma I.P. BLEND 5 (600mg/ml)",
            "comp": "Testosterone Enanthate 250mg, Boldenone Undecylenate 250mg, Trenbolone Enanthate 100mg",
            "dosage": "600mg/ml",
            "potency": "600 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/1.1-qmcrzalhfvzxpe9dz9nzl2jh5z740w5o3ptd6psfp8.webp",
            "desc": "I.P. BLEND 5 delivers a 600mg/ml powerhouse combination of Testosterone Enanthate (250mg), Boldenone Undecylenate (250mg), and Trenbolone Enanthate (100mg) for rapid size, power, and athletic endurance."
        },
        {
            "name": "Infinity Pharma I.P. BLEND 6 (500mg/ml)",
            "comp": "Testosterone Propionate 125mg, Testosterone Phenylpropionate 125mg, Trenbolone Acetate 125mg, Drostanolone Propionate 125mg",
            "dosage": "500mg/ml",
            "potency": "500 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/12.1-qmcs10mtyycuznr9x0hd5mvwdepc4wzyc8veuz8gak.webp",
            "desc": "I.P. BLEND 6 is a quadri-compound short/medium ester blend providing 500mg/ml of Test Prop, Test Phenylprop, Tren Acetate, and Drostanolone Propionate for championship conditioning."
        },
        {
            "name": "Infinity Pharma I.P. BLEND 7 (500mg/ml)",
            "comp": "Testosterone Cypionate 200mg, Boldenone Undecylenate 200mg, Trenbolone Hexahydrobenzylcarbonate 100mg",
            "dosage": "500mg/ml",
            "potency": "500 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/9.1-qmcs3gzntdptb06xl2oao0l87mlu8gqq0e71yzlg1o.webp",
            "desc": "I.P. BLEND 7 combines premium Testosterone Cypionate (200mg), Boldenone Undecylenate (200mg), and genuine Parabolan Trenbolone Hex (100mg) per ml for supreme lean muscle hardness."
        },
        {
            "name": "Infinity Pharma I.P. BLEND 8 (450mg/ml Super Sustanon)",
            "comp": "Testosterone Acetate 50mg, Test Propionate 50mg, Test Phenylpropionate 50mg, Test Cypionate 100mg, Test Enanthate 100mg, Test Decanoate 100mg",
            "dosage": "450mg/ml",
            "potency": "450 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/15.1-qmcs4c0c2ww9y4xvjy2zgarftccyah5v4nq2t4bgcc.webp",
            "desc": "I.P. BLEND 8 is an ultra-spectrum 6-ester testosterone matrix providing 450mg/ml for instant release, sustained absorption, and continuous hormonal optimization."
        },
        {
            "name": "Infinity Pharma DECA 300 (Nandrolone Decanoate 300mg/ml)",
            "comp": "Nandrolone Decanoate 300mg",
            "dosage": "300mg/ml",
            "potency": "300 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/7.1-qmcs613uf57wwsh4n6hqgdcefdzt6swf124n03sv3w.webp",
            "desc": "DECA 300 contains pharmaceutical-grade Nandrolone Decanoate 300mg/ml in 10ml multi-dose vial. Highly anabolic formulation for joint lubrication, nitrogen retention, and solid muscle density."
        },
        {
            "name": "Infinity Pharma EQUIPOISE (Boldenone Undecylenate 300mg/ml)",
            "comp": "Boldenone Undecylenate 300mg",
            "dosage": "300mg/ml",
            "potency": "300 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/8.1-qmcs7fv4o75ebqfeesfl70jai71mqghx81cux1plrw.webp",
            "desc": "EQUIPOISE provides Boldenone Undecylenate 300mg/ml in 10ml vial. Promotes steady, high-quality lean mass gains, increased red blood cell count (erythropoiesis), and elevated stamina."
        },
        {
            "name": "Infinity Pharma TEST DEPOT (Testosterone Enanthate 250mg/ml)",
            "comp": "Testosterone Enanthate 250mg",
            "dosage": "250mg/ml",
            "potency": "250 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/14.1-qmcsaabjd51nh8aksipx8soj970n1gsny4gs87hoxo.webp",
            "desc": "TEST DEPOT contains Testosterone Enanthate 250mg/ml. The gold standard cornerstone for all mass-building and hormone replacement protocols worldwide."
        },
        {
            "name": "Infinity Pharma CYPIONEX (Testosterone Cypionate 250mg/ml)",
            "comp": "Testosterone Cypionate 250mg",
            "dosage": "250mg/ml",
            "potency": "250 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/13.1-qmcsbfofpum9o2mi30liai8te5csg5curt65cdsdbw.webp",
            "desc": "CYPIONEX contains Testosterone Cypionate 250mg/ml in 10ml multi-dose vial. Long-acting ester ensuring sustained physiological testosterone levels with smooth release."
        },
        {
            "name": "Infinity Pharma TEST PROP (Testosterone Propionate 100mg/ml)",
            "comp": "Testosterone Propionate 100mg",
            "dosage": "100mg/ml",
            "potency": "100 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/2.1-qmctbvv4qkijvpoh8rsozb4ao1p6xm2547vzanqs1o.webp",
            "desc": "TEST PROP contains Testosterone Propionate 100mg/ml. Fast-acting testosterone ester ideal for rapid strength, cutting cycles, and minimal water retention."
        },
        {
            "name": "Infinity Pharma SUSTA 400 (Testosterone Compound 400mg/ml)",
            "comp": "Testosterone Propionate 50mg, Test Phenylpropionate 50mg, Test Isocaproate 100mg, Test Enanthate 100mg, Test Decanoate 100mg",
            "dosage": "400mg/ml",
            "potency": "400 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/10.1-qmctcwiu53wqgi78apn56jv9u2oi9t3o99bx0g8fb0.webp",
            "desc": "SUSTA 400 is an enhanced multi-ester Sustanon blend offering 400mg/ml in a 10ml multi-dose vial for maximum potency, prolonged bioavailability, and dramatic strength surges."
        },
        {
            "name": "Infinity Pharma TREN - E 250 (Trenbolone Enanthate 250mg/ml)",
            "comp": "Trenbolone Enanthate 250mg",
            "dosage": "250mg/ml",
            "potency": "250 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/3.1-qmctg375aw9psxknp37mmqxib2zacvqxd0x5k7ie7w.webp",
            "desc": "TREN - E 250 contains Trenbolone Enanthate 250mg/ml in 10ml vial. Provides extraordinary anabolic power, massive muscle hardening, fat burning, and strength gains with zero aromatization."
        },
        {
            "name": "Infinity Pharma TREN 100 (Trenbolone Acetate 100mg/ml)",
            "comp": "Trenbolone Acetate 100mg",
            "dosage": "100mg/ml",
            "potency": "100 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/4.1-qmctgnvlh920wcqmcc5f5lpndk5d2810rv9u4anqf0.webp",
            "desc": "TREN 100 contains Trenbolone Acetate 100mg/ml. Fast-acting acetate ester revered for dramatic body recomposition, extreme vascularity, and raw power."
        },
        {
            "name": "Infinity Pharma STANABOL (Stanozolol AQ Water Suspension 50mg/ml)",
            "comp": "Stanozolol AQ 50mg",
            "dosage": "50mg/ml",
            "potency": "50 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/18.1-qmctpma8lfbdilqb1pigeucr4q09eekyc71dq7dp4s.webp",
            "desc": "STANABOL is an aqueous microcrystalline Stanozolol suspension (50mg/ml) for instant peak blood levels, muscle dryness, SHBG reduction, and explosive speed."
        },
        {
            "name": "Infinity Pharma MASTEBOLIN (Drostanolone Propionate 100mg/ml)",
            "comp": "Drostanolone Propionate 100mg",
            "dosage": "100mg/ml",
            "potency": "100 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/16.1-qmctk8nhhjyb2xjkgdtb577srcincr88xkncv7csqk.webp",
            "desc": "MASTEBOLIN provides Masteron Drostanolone Propionate 100mg/ml in 10ml vial. Renowned anti-estrogenic hardening agent for chiseled physique density and contest readiness."
        },
        {
            "name": "Infinity Pharma PRIMO DEPOT (Methenolone Enanthate 100mg/ml)",
            "comp": "Methenolone Enanthate 100mg",
            "dosage": "100mg/ml",
            "potency": "100 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/11.1-qmctlc4pglgcmjy81uvn1x95pj42c1kz301r0tq9h8.webp",
            "desc": "PRIMO DEPOT contains Methenolone Enanthate (Primobolan Depot) 100mg/ml. One of the cleanest, safest, high-grade anabolic agents producing pure lean tissue with zero water retention."
        },
        {
            "name": "Infinity Pharma PARABOL (Trenbolone Hexahydrobenzylcarbonate 100mg/ml)",
            "comp": "Trenbolone Hexahydrobenzylcarbonate 100mg",
            "dosage": "100mg/ml",
            "potency": "100 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/20.1-qmctmjda6z3jgm7f1dkh8mcd196y64cmky233jy5j0.webp",
            "desc": "PARABOL contains authentic Trenbolone Hex (Parabolan) 100mg/ml in 10ml vial. A legendary long-acting trenbolone ester internationally accepted for quality mass and immense strength."
        },
        {
            "name": "Infinity Pharma CUT PRO MAX (500mg/ml Contest Formula)",
            "comp": "Testosterone Propionate 125mg, Test Phenylpropionate 125mg, Trenbolone Acetate 125mg, Drostanolone Propionate 125mg",
            "dosage": "500mg/ml",
            "potency": "500 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/2-qzlvapvmpfq3wkf2ja7dxu3vuqvykknid4kwrn9zlo.webp",
            "desc": "CUT PRO MAX is an elite competition blend formulated in a 10ml multi-dose vial delivering 500mg/ml of Test Prop, Test Phenylprop, Tren Acetate, and Masteron Prop for ultimate stage conditioning."
        },
        {
            "name": "Infinity Pharma POWER PRO MAX (640mg/ml Powerhouse Matrix)",
            "comp": "Testosterone Enanthate 250mg, Boldenone Undecylenate 250mg, Trenbolone Hex 75mg, Methasterone 20mg, Ibutamoren MK-677 25mg, Turinabol 20mg",
            "dosage": "640mg/ml",
            "potency": "640 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/1731425228752-qx0e5z2ebzpaebx3rau5vsgqybwxqvew6b87t7sqd8.webp",
            "desc": "POWER PRO MAX is a 6-compound advanced matrix (640mg/ml) combining Test Enanthate, Boldenone, Parabolan, Superdrol, MK-677, and Turinabol for massive lean gains, power, and muscle fullness."
        },
        {
            "name": "Infinity Pharma BULK PRO MAX (875mg/ml Ultra Anabolic Formula)",
            "comp": "Testosterone Enanthate 250mg, Trenbolone Enanthate 200mg, Drostanolone Propionate 100mg, Nandrolone Decanoate 100mg, Test Phenylpropionate 50mg, Test Decanoate 100mg, NPP 75mg",
            "dosage": "875mg/ml",
            "potency": "875 mg/ml",
            "img": "https://infinity-pharmaceuticals.com/wp-content/uploads/elementor/thumbs/1731425228774-qx0e6acgm04q9ngpxfpoppma2ydcb8no7v21kjc0ak.webp",
            "desc": "BULK PRO MAX is an ultra-concentrated 875mg/ml super-formula engineered for rapid lean bulking, combining 7 synergistic anabolic compounds in a single 10ml multi-dose vial."
        }
    ]

    print(f"Prepared {len(infinity_catalog)} Infinity Pharma Injectables.")

    # Load existing products & categories
    with open('src/data/categories.json', 'r', encoding='utf-8') as f:
        categories = json.load(f)

    with open('src/data/products.json', 'r', encoding='utf-8') as f:
        products = json.load(f)

    formatted_infinity_products = []
    base_id = len(products) + 1

    for idx, item in enumerate(infinity_catalog, 1):
        specs = {
            'Brand': 'Infinity Pharmaceuticals',
            'Manufacturer': 'Infinity Pharma Laboratories',
            'Composition': item['comp'],
            'Form': 'Injection (10ml Multi-Dose Vial)',
            'Strength / Dosage': item['dosage'],
            'Potency': item['potency'],
            'Packaging Type': '10ml Multi-Dose Vial with Tamper-Proof Flip-Off Seal',
            'Packaging Size': '10ml x 1 Vial',
            'Quality Grade': 'USP / BP Grade High Purity Micronized Raw Material',
            'Authentication': 'Scratch-off Security Code with Online Verification',
            'Therapeutic Class': 'Anabolic Injectable Formulation & Athletic Performance',
            'Usage / Application': 'Muscle Hypertrophy, Strength, Conditioning & Recovery'
        }

        formatted_infinity_products.append({
            'id': f'infinity-{base_id + idx}',
            'name': item['name'],
            'category': 'Infinity Pharma - Injectables',
            'categorySlug': 'infinity-pharma-injectables',
            'dosage': item['dosage'],
            'form': 'Injection (10ml Vial)',
            'image': item['img'],
            'packaging': '10ml Multi-dose Vial',
            'specifications': specs,
            'description': item['desc'],
            'isPopular': True
        })

    # Create Infinity Pharma category
    infinity_cat = {
        'id': 'infinity-pharma-injectables',
        'name': 'Infinity Pharma - Injectables',
        'slug': 'infinity-pharma-injectables',
        'count': len(formatted_infinity_products),
        'icon': 'Syringe',
        'featured': True
    }

    # Filter out any old infinity entries and add at top
    clean_cats = [c for c in categories if c['name'] != 'Infinity Pharma - Injectables']
    # Insert right at top alongside Evolve Biolabs
    updated_categories = [infinity_cat] + clean_cats

    clean_prods = [p for p in products if p.get('category') != 'Infinity Pharma - Injectables']
    updated_products = formatted_infinity_products + clean_prods

    with open('src/data/categories.json', 'w', encoding='utf-8') as f:
        json.dump(updated_categories, f, indent=2, ensure_ascii=False)

    with open('src/data/products.json', 'w', encoding='utf-8') as f:
        json.dump(updated_products, f, indent=2, ensure_ascii=False)

    print(f"Successfully integrated Infinity Pharma - Injectables:")
    print(f" - Total Categories: {len(updated_categories)}")
    print(f" - Total Products: {len(updated_products)} (including {len(formatted_infinity_products)} Infinity Pharma products)")

if __name__ == '__main__':
    process_infinity_injectables()
