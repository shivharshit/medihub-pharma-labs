import json

def process_3rd_degree():
    third_degree_catalog = [
        {
            "name": "3rd Degree BOLDEHYD (DHB Dihydroboldenone 100mg/ml)",
            "comp": "1-Testosterone / Dihydroboldenone (DHB) 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/GrXMpESDDg1665720684.jpeg",
            "desc": "BOLDEHYD is an injectable 1-Testosterone / Dihydroboldenone (DHB) 100mg/ml formulation in a 10ml multi-dose vial. Known for incredible muscle hardness, vascularity, and high anabolic-to-androgenic ratio."
        },
        {
            "name": "3rd Degree EQUIPRO IR (Boldenone Propionate 100mg/ml)",
            "comp": "Boldenone Propionate 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/8UhZMAArkS1651039474.jpg",
            "desc": "EQUIPRO IR contains fast-acting Boldenone Propionate 100mg/ml for rapid onset of nitrogen retention, appetite stimulation, and dense quality muscle tissue."
        },
        {
            "name": "3rd Degree DECAPHYL 100 (Nandrolone Phenylpropionate 100mg/ml)",
            "comp": "Nandrolone Phenylpropionate (NPP) 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/deayP74DtU1631522063.jpg",
            "desc": "DECAPHYL 100 contains fast-clearing Nandrolone Phenylpropionate (NPP) 100mg/ml in 10ml vial. Promotes joint support, protein synthesis, and lean muscle mass with reduced water retention."
        },
        {
            "name": "3rd Degree DECA-D250 (Nandrolone Decanoate 250mg/ml)",
            "comp": "Nandrolone Decanoate 250mg",
            "dosage": "250mg/ml",
            "img": "https://3rd-degree.com/files/products/kFWklDGD131635401438.jpeg",
            "desc": "DECA-D250 contains premium pharmaceutical Nandrolone Decanoate 250mg/ml in 10ml multi-dose vial. Time-tested foundation for off-season bulking, strength gains, and connective tissue recovery."
        },
        {
            "name": "3rd Degree BOLD-E250 (Boldenone Undecylenate 250mg/ml)",
            "comp": "Boldenone Undecylenate (Equipoise) 250mg",
            "dosage": "250mg/ml",
            "img": "https://3rd-degree.com/files/products/7VWZ6nivCV1635401357.jpeg",
            "desc": "BOLD-E250 contains Boldenone Undecylenate 250mg/ml. Provides continuous, steady muscle development, enhanced vascularity, and heightened red blood cell production."
        },
        {
            "name": "3rd Degree CYPIONE-T250 (Testosterone Cypionate 250mg/ml)",
            "comp": "Testosterone Cypionate 250mg",
            "dosage": "250mg/ml",
            "img": "https://3rd-degree.com/files/products/OCY4ZpXywN1635401279.jpeg",
            "desc": "CYPIONE-T250 delivers high-grade Testosterone Cypionate 250mg/ml in 10ml vial. Long-acting ester providing sustained hormone balance, libido, strength, and overall vitality."
        },
        {
            "name": "3rd Degree ENANTHA-T250 (Testosterone Enanthate 250mg/ml)",
            "comp": "Testosterone Enanthate 250mg",
            "dosage": "250mg/ml",
            "img": "https://3rd-degree.com/files/products/SrQUIgeCKD1635401175.jpeg",
            "desc": "ENANTHA-T250 is pharmaceutical-grade Testosterone Enanthate 250mg/ml in 10ml multi-dose vial. The cornerstone anabolic formulation worldwide for muscle growth and performance."
        },
        {
            "name": "3rd Degree MASTERON-E100 (Drostanolone Propionate 100mg/ml)",
            "comp": "Drostanolone Propionate (Masteron) 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/gbF15x0F0c1635401078.jpeg",
            "desc": "MASTERON-E100 contains Drostanolone Propionate 100mg/ml in 10ml vial. Potent anti-estrogenic physique hardener creating dry, chiseled definition and vascularity."
        },
        {
            "name": "3rd Degree PRIMOBOLAN-E100 (Methenolone Enanthate 100mg/ml)",
            "comp": "Methenolone Enanthate (Primobolan Depot) 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/3HyQEOG5Kz1635400962.jpeg",
            "desc": "PRIMOBOLAN-E100 provides Methenolone Enanthate 100mg/ml. Renowned as one of the cleanest and safest anabolic compounds for lean muscle preservation and dry gains."
        },
        {
            "name": "3rd Degree PROPIONE-T100 (Testosterone Propionate 100mg/ml)",
            "comp": "Testosterone Propionate 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/o0iiKGv4Y31635400864.jpeg",
            "desc": "PROPIONE-T100 contains short-acting Testosterone Propionate 100mg/ml in 10ml vial for rapid peak concentrations, minimal water retention, and explosive power output."
        },
        {
            "name": "3rd Degree WINSTROL 100 (Stanozolol Injectable 100mg/ml)",
            "comp": "Stanozolol (Winstrol) 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/3AIiuiUbAU1635401514.jpeg",
            "desc": "WINSTROL 100 is an injectable Stanozolol formulation (100mg/ml) engineered for supreme muscular density, athletic speed, strength, and dramatic SHBG lowering."
        },
        {
            "name": "3rd Degree SUSTANON-T250 (Testosterone Complex 250mg/ml)",
            "comp": "Testosterone Propionate 30mg, Phenylpropionate 60mg, Isocaproate 60mg, Decanoate 100mg",
            "dosage": "250mg/ml",
            "img": "https://3rd-degree.com/files/products/ps9t7OoH5A1635400771.jpeg",
            "desc": "SUSTANON-T250 is a multi-ester testosterone blend (250mg/ml) delivering immediate hormonal elevation coupled with long-lasting physiological support."
        },
        {
            "name": "3rd Degree TRENBOL-A100 (Trenbolone Acetate 100mg/ml)",
            "comp": "Trenbolone Acetate 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/a5NCDlvFRK1635400679.jpeg",
            "desc": "TRENBOL-A100 is pure fast-acting Trenbolone Acetate 100mg/ml in 10ml vial. Unsurpassed in its ability to simultaneously incinerate body fat and build rock-solid muscle mass."
        },
        {
            "name": "3rd Degree TRENBOL-E200 (Trenbolone Enanthate 200mg/ml)",
            "comp": "Trenbolone Enanthate 200mg",
            "dosage": "200mg/ml",
            "img": "https://3rd-degree.com/files/products/uNz9uP9rMO1635400426.jpeg",
            "desc": "TRENBOL-E200 contains long-acting Trenbolone Enanthate 200mg/ml in 10ml vial. High-potency mass and strength powerhouse requiring fewer weekly injections."
        },
        {
            "name": "3rd Degree TRENBOL-S100 (Trenbolone Suspension 100mg/ml)",
            "comp": "Trenbolone Base Aqueous Water Suspension 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/4HhPDIK8Jy1631529589.jpg",
            "desc": "TRENBOL-S100 is an unesterified Trenbolone Base Water Suspension (100mg/ml) providing instantaneous peak blood serum concentration for extreme pre-workout aggression and hardness."
        },
        {
            "name": "3rd Degree TESTRO-S100 (Testosterone Suspension 100mg/ml)",
            "comp": "Testosterone Base Aqueous Water Suspension 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/EA6mG7dRPG1635401861.jpeg",
            "desc": "TESTRO-S100 is a micro-crystalline pure Testosterone Base Water Suspension (100mg/ml) designed for immediate anabolic uptake with zero ester delay."
        },
        {
            "name": "3rd Degree METATREN 100 (Trenbolone Hexahydrobenzylcarbonate 100mg/ml)",
            "comp": "Trenbolone Hexahydrobenzylcarbonate (Parabolan) 100mg",
            "dosage": "100mg/ml",
            "img": "https://3rd-degree.com/files/products/wOGyFKFIXC1631522162.jpg",
            "desc": "METATREN 100 contains authentic Parabolan (Trenbolone Hex) 100mg/ml in 10ml vial. The legendary French formulation revered for lean mass density and zero water retention."
        },
        {
            "name": "3rd Degree MEGATREN 3D (Mega Trenbolone Complex 150mg/ml)",
            "comp": "Trenbolone Acetate 50mg, Trenbolone Hex 50mg, Trenbolone Enanthate 50mg (Tri-Tren)",
            "dosage": "150mg/ml",
            "img": "https://3rd-degree.com/files/products/SxhNtE326p1631522229.jpg",
            "desc": "MEGATREN 3D is a 3-dimensional multi-ester Trenbolone blend (150mg/ml) combining short, medium, and long esters for continuous 24/7 plasma saturation and immense power."
        },
        {
            "name": "3rd Degree MEGATON-600 (Advanced Bulking Blend 600mg/ml)",
            "comp": "Testosterone Enanthate 250mg, Nandrolone Decanoate 200mg, Trenbolone Enanthate 150mg",
            "dosage": "600mg/ml",
            "img": "https://3rd-degree.com/files/products/T7Y9Y0RryW1633503450.jpeg",
            "desc": "MEGATON-600 is a high-concentration 600mg/ml bulking powerhouse fusing Test Enanthate, Deca Durabolin, and Tren Enanthate in a single vial for elite mass building."
        },
        {
            "name": "3rd Degree BLADE (Advanced Cutting Blend 225mg/ml)",
            "comp": "Testosterone Propionate 75mg, Trenbolone Acetate 75mg, Drostanolone Propionate 75mg",
            "dosage": "225mg/ml",
            "img": "https://3rd-degree.com/files/products/Nr6ZsVVdHs1633503055.jpeg",
            "desc": "BLADE is an elite 225mg/ml fast-acting competition cutting stack of Test Propionate, Tren Acetate, and Masteron Propionate in balanced proportions for razor-sharp conditioning."
        },
        {
            "name": "3rd Degree INFERNO (Cutting & Fat Loss Blend 300mg/ml)",
            "comp": "Testosterone Propionate 100mg, Trenbolone Acetate 100mg, Drostanolone Propionate 100mg",
            "dosage": "300mg/ml",
            "img": "https://3rd-degree.com/files/products/6dF1TS2Bxz1633503362.jpeg",
            "desc": "INFERNO is a maximum-strength 300mg/ml shredding stack providing equal 100mg ratios of Test Prop, Tren Ace, and Masteron for hardcore contest preparation."
        },
        {
            "name": "3rd Degree BULK-BOMBA (Complete Bulking Blend 500mg/ml)",
            "comp": "Testosterone Cypionate 200mg, Boldenone Undecylenate 200mg, Nandrolone Decanoate 100mg",
            "dosage": "500mg/ml",
            "img": "https://3rd-degree.com/files/products/wHwEFs4mdB1633503283.jpeg",
            "desc": "BULK-BOMBA is a 500mg/ml complete mass compound merging Test Cypionate, Equipoise, and Deca Durabolin in ethyl oleate carrier oil for pain-free administration and rapid growth."
        },
        {
            "name": "3rd Degree RHINO TWT (Triple Suspension Pre-Workout Blend 150mg/ml)",
            "comp": "Testosterone Base 50mg, Trenbolone Base 50mg, Stanozolol Base 50mg (Aqueous Suspension)",
            "dosage": "150mg/ml",
            "img": "https://3rd-degree.com/files/products/oLfWkQbUDn1631529413.jpg",
            "desc": "RHINO TWT is a legendary aqueous pre-workout tri-suspension blend (150mg/ml) delivering unesterified Test, Tren, and Winstrol for immediate raw strength surges."
        },
        {
            "name": "3rd Degree KONG-700 (Pro Bulking Monster Blend 700mg/ml)",
            "comp": "Testosterone Enanthate 300mg, Boldenone Undecylenate 250mg, Trenbolone Enanthate 150mg",
            "dosage": "700mg/ml",
            "img": "https://3rd-degree.com/files/products/z08x9n44zH1633017866.jpeg",
            "desc": "KONG-700 is an ultra-potent 700mg/ml heavy-duty mass blend combining high-dose Test Enanthate, Boldenone, and Tren Enanthate for unprecedented muscle hypertrophy."
        }
    ]

    print(f"Prepared {len(third_degree_catalog)} 3rd Degree Injectables.")

    # Load existing products & categories
    with open('src/data/categories.json', 'r', encoding='utf-8') as f:
        categories = json.load(f)

    with open('src/data/products.json', 'r', encoding='utf-8') as f:
        products = json.load(f)

    formatted_3rd_products = []
    base_id = len(products) + 1

    for idx, item in enumerate(third_degree_catalog, 1):
        specs = {
            'Brand': '3rd Degree Pharmaceuticals',
            'Manufacturer': '3rd Degree Labs',
            'Composition': item['comp'],
            'Carrier Oil': 'Ethyl Oleate / High Purity Grapeseed Oil',
            'Form': 'Injection (10ml Multi-Dose Vial)',
            'Strength / Dosage': item['dosage'],
            'Packaging Type': '10ml Multi-Dose Vial with Color-Coded Flip-Off Cap',
            'Packaging Size': '10ml x 1 Vial',
            'Quality Grade': 'Pharmaceutical Grade Pure Compound (USP/BP Compliant)',
            'Authentication': 'Scratch Verification Code on Box (www.3rd-degree.com)',
            'Therapeutic Class': 'Injectable Anabolic-Androgenic Compound / Performance Matrix',
            'Usage / Application': 'Muscle Hypertrophy, Contest Conditioning, Extreme Strength & Density'
        }

        formatted_3rd_products.append({
            'id': f'3rd-deg-{base_id + idx}',
            'name': item['name'],
            'category': '3rd Degree - Injectable',
            'categorySlug': '3rd-degree-injectable',
            'dosage': item['dosage'],
            'form': 'Injection (10ml Vial)',
            'image': item['img'],
            'packaging': '10ml Multi-dose Vial',
            'specifications': specs,
            'description': item['desc'],
            'isPopular': True
        })

    # Create 3rd Degree category
    third_deg_cat = {
        'id': '3rd-degree-injectable',
        'name': '3rd Degree - Injectable',
        'slug': '3rd-degree-injectable',
        'count': len(formatted_3rd_products),
        'icon': 'Flame',
        'featured': True
    }

    # Add 3rd Degree category at position #1
    clean_cats = [c for c in categories if c['name'] != '3rd Degree - Injectable']
    updated_categories = [third_deg_cat] + clean_cats

    clean_prods = [p for p in products if p.get('category') != '3rd Degree - Injectable']
    updated_products = formatted_3rd_products + clean_prods

    with open('src/data/categories.json', 'w', encoding='utf-8') as f:
        json.dump(updated_categories, f, indent=2, ensure_ascii=False)

    with open('src/data/products.json', 'w', encoding='utf-8') as f:
        json.dump(updated_products, f, indent=2, ensure_ascii=False)

    print(f"Successfully updated catalog:")
    print(f" - Total Categories: {len(updated_categories)}")
    print(f" - Total Products: {len(updated_products)} (including {len(formatted_3rd_products)} 3rd Degree products)")

if __name__ == '__main__':
    process_3rd_degree()
