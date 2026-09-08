import json

def process_roger_pharma():
    roger_products_list = [
        # --- INJECTABLES (Pages 5-11) ---
        {
            "name": "Roger Pharma ACEBOLONE-100™ (Trenbolone Acetate 100mg/ml)",
            "comp": "Trenbolone Acetate USP 100mg/ml",
            "dosage": "100mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "ACEBOLONE-100™ contains Trenbolone Acetate USP 100mg/ml in a 10ml multi-dose vial. Engineered with German technology for maximum anabolic potency, rapid conditioning, and zero aromatization."
        },
        {
            "name": "Roger Pharma CYPIOSTERONE-250™ (Testosterone Cypionate 250mg/ml)",
            "comp": "Testosterone Cypionate USP 250mg/ml",
            "dosage": "250mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "CYPIOSTERONE-250™ delivers pharmaceutical-grade Testosterone Cypionate USP 250mg/ml for long-lasting physiological testosterone elevation, strength, and mass development."
        },
        {
            "name": "Roger Pharma DECADROLONE-250™ (Nandrolone Decanoate 250mg/ml)",
            "comp": "Nandrolone Decanoate USP 250mg/ml",
            "dosage": "250mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "DECADROLONE-250™ contains pure Nandrolone Decanoate USP 250mg/ml in 10ml vial. Classical bulking anabolic promoting nitrogen retention, protein synthesis, and joint comfort."
        },
        {
            "name": "Roger Pharma DECADROLONE-400™ (Nandrolone Blend 400mg/ml)",
            "comp": "Nandrolone Decanoate & Phenylpropionate Blend 400mg/ml",
            "dosage": "400mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "DECADROLONE-400™ is an ultra-concentrated 400mg/ml dual-ester Nandrolone blend engineered for sustained anabolic release and rapid muscular fullness."
        },
        {
            "name": "Roger Pharma ENANBOLONE-200™ (Trenbolone Enanthate 200mg/ml)",
            "comp": "Trenbolone Enanthate 200mg/ml",
            "dosage": "200mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "ENANBOLONE-200™ provides long-acting Trenbolone Enanthate 200mg/ml in a 10ml vial. Promotes extreme muscle hardness, vascularity, and continuous anabolic saturation."
        },
        {
            "name": "Roger Pharma ENANESTERONE-250™ (Testosterone Enanthate 250mg/ml)",
            "comp": "Testosterone Enanthate USP 250mg/ml",
            "dosage": "250mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "ENANESTERONE-250™ contains high-purity Testosterone Enanthate USP 250mg/ml. The gold-standard hormonal foundation for athletic performance and recovery."
        },
        {
            "name": "Roger Pharma ENANOLONE-100™ (Methenolone Enanthate 100mg/ml)",
            "comp": "Methenolone Enanthate (Primobolan Depot) 100mg/ml",
            "dosage": "100mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "ENANOLONE-100™ delivers genuine Methenolone Enanthate 100mg/ml in 10ml vial. Premium clean anabolic producing high-quality lean muscle tissue without water retention."
        },
        {
            "name": "Roger Pharma GIGANTIC BLEND-500™ (Bulking Blend 500mg/ml)",
            "comp": "Testosterone Enanthate 250mg, Boldenone Undecylenate 150mg, Trenbolone Enanthate 100mg",
            "dosage": "500mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "GIGANTIC BLEND-500™ is a massive 500mg/ml synergistic mass formulation combining Test Enanthate, Equipoise, and Tren Enanthate in a single high-concentration vial."
        },
        {
            "name": "Roger Pharma HELIOS PLUS+™ (Metabolic Injectable Blend)",
            "comp": "Clenbuterol HCl & Yohimbine HCl Specialized Subcutaneous Blend",
            "dosage": "Specialized Blend",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "HELIOS PLUS+™ is a specialized spot-reduction and localized adipose-targeting injectable blend formulated with precision European pharmaceutical excipients."
        },
        {
            "name": "Roger Pharma HEXABOLONE-76.5™ (Trenbolone Hexahydrobenzylcarbonate 76.5mg/ml)",
            "comp": "Trenbolone Hexahydrobenzylcarbonate (Parabolan) 76.5mg/ml",
            "dosage": "76.5mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "HEXABOLONE-76.5™ contains authentic Parabolan (Trenbolone Hex) 76.5mg/ml. Renowned internationally for providing lean, dense, rock-hard muscle tissue with zero aromatization."
        },
        {
            "name": "Roger Pharma MAXBOLONE-200™ (Test/Deca/Tren Synergistic Blend 200mg/ml)",
            "comp": "Testosterone Propionate, Trenbolone Acetate, Drostanolone Propionate Blend 200mg/ml",
            "dosage": "200mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "MAXBOLONE-200™ is a rapid-action competition conditioning injectable matrix (200mg/ml) for muscle density, vascularity, and peak performance."
        },
        {
            "name": "Roger Pharma MAXESTERONE-250™ (Testosterone Blend 250mg/ml)",
            "comp": "Multi-Ester Testosterone Compound 250mg/ml",
            "dosage": "250mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "MAXESTERONE-250™ is a balanced 4-ester testosterone blend (250mg/ml) providing instant release coupled with continuous androgenic support over 21 days."
        },
        {
            "name": "Roger Pharma MAXESTERONE-400™ (High-Dose Testosterone Blend 400mg/ml)",
            "comp": "Multi-Ester Testosterone Compound 400mg/ml",
            "dosage": "400mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "MAXESTERONE-400™ is a heavy-duty 400mg/ml testosterone blend engineered for high-level athletes requiring elevated androgenic saturation with fewer injection volumes."
        },
        {
            "name": "Roger Pharma MUSCLE BUILDER-400™ (Lean Gaining Blend 400mg/ml)",
            "comp": "Testosterone Cypionate 200mg, Boldenone Undecylenate 200mg",
            "dosage": "400mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "MUSCLE BUILDER-400™ combines Testosterone Cypionate and Boldenone Undecylenate (400mg/ml) for continuous nitrogen retention and solid, vascular muscle building."
        },
        {
            "name": "Roger Pharma PHENPRODROLONE-100™ (Nandrolone Phenylpropionate 100mg/ml)",
            "comp": "Nandrolone Phenylpropionate BP 100mg/ml",
            "dosage": "100mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "PHENPRODROLONE-100™ contains fast-acting Nandrolone Phenylpropionate BP 100mg/ml in 10ml vial. Ideal for quick clearance and reduced water retention."
        },
        {
            "name": "Roger Pharma PROPENOLONE-100™ (Drostanolone Propionate 100mg/ml)",
            "comp": "Drostanolone Propionate (Masteron) 100mg/ml",
            "dosage": "100mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "PROPENOLONE-100™ contains Drostanolone Propionate 100mg/ml. Anti-estrogenic physique hardener creating sharp, dry muscle separation."
        },
        {
            "name": "Roger Pharma PROPESTERONE-100™ (Testosterone Propionate 100mg/ml)",
            "comp": "Testosterone Propionate USP 100mg/ml",
            "dosage": "100mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "PROPESTERONE-100™ is pure fast-acting Testosterone Propionate USP 100mg/ml in 10ml vial. Fast onset of strength, aggression, and anabolic recovery."
        },
        {
            "name": "Roger Pharma STANOIL-50™ (Stanozolol Oil Base 50mg/ml)",
            "comp": "Stanozolol Injection USP (Oil Base) 50mg/ml",
            "dosage": "50mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "STANOIL-50™ is a pain-free, smooth oil-based Stanozolol formulation (50mg/ml) delivering sustained bioavailability and zero water retention."
        },
        {
            "name": "Roger Pharma SUPERCUTMIX-200™ (Supercutmix Blend 200mg/ml)",
            "comp": "Testosterone Propionate 75mg, Trenbolone Acetate 75mg, Drostanolone Propionate 50mg",
            "dosage": "200mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "SUPERCUTMIX-200™ is an elite 200mg/ml triple cutting compound engineered for competition readiness, vascular fullness, and fat oxidation."
        },
        {
            "name": "Roger Pharma SUSPEBOLONE-50™ (Trenbolone Suspension 50mg/ml)",
            "comp": "Trenbolone Base Aqueous Water Suspension 50mg/ml",
            "dosage": "50mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "SUSPEBOLONE-50™ is an instantaneous-release unesterified Trenbolone Base Water Suspension (50mg/ml) for supreme pre-workout power and hardness."
        },
        {
            "name": "Roger Pharma SUSPENZOLOL-100™ (Stanozolol Suspension 100mg/ml)",
            "comp": "Stanozolol Aqueous Suspension Injection USP 100mg/ml",
            "dosage": "100mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "SUSPENZOLOL-100™ is an aqueous micro-crystalline Winstrol suspension (100mg/ml) producing rapid muscle dryness, SHBG reduction, and athletic velocity."
        },
        {
            "name": "Roger Pharma SUSPESTERONE-100™ (Testosterone Suspension 100mg/ml)",
            "comp": "Testosterone Base Aqueous Suspension Injection 100mg/ml",
            "dosage": "100mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "SUSPESTERONE-100™ delivers 100mg/ml unesterified Testosterone Base in sterile aqueous suspension for immediate anabolic uptake."
        },
        {
            "name": "Roger Pharma TRIM FORGE-400™ (Cutting Blend Injection 400mg/ml)",
            "comp": "Testosterone Propionate 150mg, Trenbolone Acetate 125mg, Drostanolone Propionate 125mg",
            "dosage": "400mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "TRIM FORGE-400™ is an ultra-dosed 400mg/ml cutting powerhouse formulated to strip stubborn body fat while defending lean muscle tissue."
        },
        {
            "name": "Roger Pharma UNDECYLENONE-250™ (Boldenone Undecylenate 250mg/ml)",
            "comp": "Boldenone Undecylenate Injection 250mg/ml",
            "dosage": "250mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "UNDECYLENONE-250™ provides Boldenone Undecylenate (Equipoise) 250mg/ml in 10ml vial. Stimulates appetite, vascularity, and endurance."
        },
        {
            "name": "Roger Pharma UNDECYLENONE-400™ (Boldenone Undecylenate 400mg/ml)",
            "comp": "Boldenone Undecylenate Injection 400mg/ml",
            "dosage": "400mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "UNDECYLENONE-400™ is a high-concentration 400mg/ml Equipoise formulation offering maximum boldenone saturation in smaller injection volumes."
        },
        {
            "name": "Roger Pharma LIPO-CARDIAC HELP-200™ (Proprietary Cardiovascular Protection)",
            "comp": "Proprietary Cardiovascular & Lipid Support Injectable Blend 200mg/ml",
            "dosage": "200mg/ml",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "LIPO-CARDIAC HELP-200™ is a protective cardiovascular and lipid-modulating injectable formula designed for athletic wellness."
        },
        {
            "name": "Roger Pharma RECONSTITUTER™ (Bacteriostatic Water for Injection)",
            "comp": "Sterile Bacteriostatic Water 0.9% Benzyl Alcohol",
            "dosage": "10ml Vial",
            "form": "Injection (10ml Vial)",
            "pkg": "10ml Multi-Dose Vial",
            "section": "Injectables",
            "desc": "RECONSTITUTER™ is multi-dose sterile bacteriostatic water for the safe reconstitution of lyophilized peptides and hormone powders."
        },

        # --- TABLETS (Pages 14-16) ---
        {
            "name": "Roger Pharma ANAVOLONE-10 (Oxandrolone 10mg Tablets)",
            "comp": "Oxandrolone USP 10mg",
            "dosage": "10mg",
            "form": "Tablet / Oral",
            "pkg": "100 Tablets Bottle / Box",
            "section": "Tablets",
            "desc": "ANAVOLONE-10 contains Oxandrolone USP 10mg per tablet. Mild, safe, highly anabolic oral steroid for lean muscle retention and fat burning."
        },
        {
            "name": "Roger Pharma ANDROLONE-50 (Oxymetholone 50mg Tablets)",
            "comp": "Oxymetholone USP 50mg",
            "dosage": "50mg",
            "form": "Tablet / Oral",
            "pkg": "100 Tablets Bottle / Box",
            "section": "Tablets",
            "desc": "ANDROLONE-50 delivers Oxymetholone USP 50mg (Anadrol). Heavy-duty oral compound for massive weight gain, strength surges, and red blood cell production."
        },
        {
            "name": "Roger Pharma ARIMIZOLE-1 (Anastrozole 1mg Tablets)",
            "comp": "Anastrozole USP 1mg",
            "dosage": "1mg",
            "form": "Tablet / Oral",
            "pkg": "30 Tablets Box",
            "section": "Tablets",
            "desc": "ARIMIZOLE-1 contains Anastrozole USP 1mg. Selective non-steroidal aromatase inhibitor (AI) for estrogen management and prevention of gynecomastia."
        },
        {
            "name": "Roger Pharma CLENCUT-40 (Clenbuterol HCl 40mcg Tablets)",
            "comp": "Clenbuterol Hydrochloride USP 40mcg",
            "dosage": "40mcg",
            "form": "Tablet / Oral",
            "pkg": "100 Tablets Box",
            "section": "Tablets",
            "desc": "CLENCUT-40 provides Clenbuterol HCl 40mcg. Beta-2 sympathomimetic bronchodilator and powerful thermogenic fat burner for metabolic acceleration."
        },
        {
            "name": "Roger Pharma CLOMITRATE-50 (Clomiphene Citrate 50mg Tablets)",
            "comp": "Clomiphene Citrate USP 50mg",
            "dosage": "50mg",
            "form": "Tablet / Oral",
            "pkg": "50 Tablets Box",
            "section": "Tablets",
            "desc": "CLOMITRATE-50 contains Clomiphene Citrate USP 50mg (Clomid). Selective estrogen receptor modulator (SERM) essential for Post Cycle Therapy and HPTA recovery."
        },
        {
            "name": "Roger Pharma CYTODIUM-25 (Liothyronine Sodium T3 25mcg Tablets)",
            "comp": "Liothyronine Sodium (T3) USP 25mcg",
            "dosage": "25mcg",
            "form": "Tablet / Oral",
            "pkg": "100 Tablets Box",
            "section": "Tablets",
            "desc": "CYTODIUM-25 contains synthetic thyroid hormone Liothyronine Sodium (T3) 25mcg. Dramatically accelerates basal metabolic rate and cellular lipolysis."
        },
        {
            "name": "Roger Pharma DIANANONE-10 (Methandienone 10mg Tablets)",
            "comp": "Methandienone USP 10mg (Dianabol)",
            "dosage": "10mg",
            "form": "Tablet / Oral",
            "pkg": "100 Tablets Box",
            "section": "Tablets",
            "desc": "DIANANONE-10 provides pure Methandienone USP 10mg. Fast-acting oral steroid producing explosive muscle mass and glycogen supercompensation."
        },
        {
            "name": "Roger Pharma HALOSTERONE-10 (Fluoxymesterone 10mg Tablets)",
            "comp": "Fluoxymesterone USP 10mg (Halotestin)",
            "dosage": "10mg",
            "form": "Tablet / Oral",
            "pkg": "50 Tablets Box",
            "section": "Tablets",
            "desc": "HALOSTERONE-10 contains Fluoxymesterone USP 10mg (Halotestin). Extremely potent androgen delivering incredible strength gains and aggression without weight gain."
        },
        {
            "name": "Roger Pharma MESTEROBOL-25 (Mesterolone 25mg Tablets)",
            "comp": "Mesterolone USP 25mg (Proviron)",
            "dosage": "25mg",
            "form": "Tablet / Oral",
            "pkg": "50 Tablets Box",
            "section": "Tablets",
            "desc": "MESTEROBOL-25 provides Mesterolone USP 25mg (Proviron). Unbinds free testosterone, acts as an anti-aromatase, and enhances muscle hardness."
        },
        {
            "name": "Roger Pharma NOLVATRATE-20 (Tamoxifen Citrate 20mg Tablets)",
            "comp": "Tamoxifen Citrate USP 20mg",
            "dosage": "20mg",
            "form": "Tablet / Oral",
            "pkg": "50 Tablets Box",
            "section": "Tablets",
            "desc": "NOLVATRATE-20 contains Tamoxifen Citrate USP 20mg (Nolvadex). Proven SERM blocking estrogen receptors in breast tissue and stimulating LH/FSH."
        },
        {
            "name": "Roger Pharma STANO-10 (Stanozolol 10mg Tablets)",
            "comp": "Stanozolol USP 10mg (Winstrol)",
            "dosage": "10mg",
            "form": "Tablet / Oral",
            "pkg": "100 Tablets Box",
            "section": "Tablets",
            "desc": "STANO-10 delivers Stanozolol USP 10mg per tablet. Oral cutting formulation for muscle density, water depletion, and athletic agility."
        },
        {
            "name": "Roger Pharma TURINASTERONE-10 (Turinabol 10mg Tablets)",
            "comp": "4-Chlorodehydromethyltestosterone USP 10mg",
            "dosage": "10mg",
            "form": "Tablet / Oral",
            "pkg": "100 Tablets Box",
            "section": "Tablets",
            "desc": "TURINASTERONE-10 contains Turinabol 10mg per tablet. Produces quality, dry, steady muscle gains with zero estrogenic side effects."
        },

        # --- PCT CAPSULES (Page 19) ---
        {
            "name": "Roger Pharma ENCLOMIFIX™ (Enclomiphene Citrate 12.5mg)",
            "comp": "Enclomiphene Citrate 12.5mg",
            "dosage": "12.5mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "PCT",
            "desc": "ENCLOMIFIX™ provides purified Enclomiphene Citrate 12.5mg capsules. Superior next-generation testosterone and fertility producer for post-cycle restoration."
        },
        {
            "name": "Roger Pharma ORGAN CARE™ (Vital Organ Complex)",
            "comp": "Complete Vital Organ Support Complex (Liver, Kidney, Heart Protection)",
            "dosage": "Advanced Complex",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "PCT",
            "desc": "ORGAN CARE™ is an advanced full-spectrum dietary supplement protecting hepatic function, lipid profiles, renal health, and blood pressure."
        },
        {
            "name": "Roger Pharma PRIME YOHIMBINE™ (Yohimbine HCl 5mg)",
            "comp": "Yohimbine HCl 5mg",
            "dosage": "5mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "PCT",
            "desc": "PRIME YOHIMBINE™ delivers pharmaceutical-grade Yohimbine HCl 5mg. Alpha-2 adrenergic receptor antagonist targeting stubborn abdominal and lower body fat."
        },

        # --- SARMS CAPSULES (Pages 22-25) ---
        {
            "name": "Roger Pharma ACABOLYN™ (AC-262536 SARM)",
            "comp": "AC-262536 SARM 10mg",
            "dosage": "10mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "ACABOLYN™ contains AC-262536, an advanced muscle gain booster SARM providing anabolic benefits with minimal androgenic prostate impact."
        },
        {
            "name": "Roger Pharma ANAPRIL-4™ (S-4 Andarine SARM)",
            "comp": "S-4 Andarine SARM 25mg",
            "dosage": "25mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "ANAPRIL-4™ provides S-4 Andarine 25mg. Premier selective androgen receptor modulator for extreme muscle vascularity, hardness, and strength."
        },
        {
            "name": "Roger Pharma CARDAMIDE-501516™ (GW-501516 Cardarine)",
            "comp": "GW-501516 Cardarine 10mg",
            "dosage": "10mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "CARDAMIDE-501516™ delivers GW-501516 Cardarine 10mg. PPARδ receptor agonist that dramatically enhances aerobic endurance, stamina, and lipid oxidation."
        },
        {
            "name": "Roger Pharma LIGAMIN-4033™ (LGD-4033 Ligandrol)",
            "comp": "LGD-4033 Ligandrol 10mg",
            "dosage": "10mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "LIGAMIN-4033™ contains pure LGD-4033 Ligandrol 10mg. Highly potent non-steroidal SARM producing significant lean muscle tissue accumulation and bone density."
        },
        {
            "name": "Roger Pharma META BULK™ (Super SARM Bulk Gain Blend)",
            "comp": "LGD-4033, RAD-140, MK-677 Synergistic Bulk SARM Blend",
            "dosage": "Super SARM Blend",
            "form": "Capsule",
            "pkg": "30 Capsules Bottle",
            "section": "SARMS",
            "desc": "META BULK™ is a multi-compound SARM power blend formulated specifically for accelerated off-season size, mass, and strength amplification."
        },
        {
            "name": "Roger Pharma META CUT™ (Super SARM Fat Cut Blend)",
            "comp": "Cardarine, Stenabolic, Andarine S-4 Fat Cut SARM Blend",
            "dosage": "Super SARM Blend",
            "form": "Capsule",
            "pkg": "30 Capsules Bottle",
            "section": "SARMS",
            "desc": "META CUT™ combines synergistic metabolic SARMs and PPAR agonists for aggressive lipid burning, vascular definition, and muscle preservation."
        },
        {
            "name": "Roger Pharma META LEAN™ (Super SARM Lean Gain Blend)",
            "comp": "Ostarine, Cardarine, LGD-4033 Lean Gain SARM Blend",
            "dosage": "Super SARM Blend",
            "form": "Capsule",
            "pkg": "30 Capsules Bottle",
            "section": "SARMS",
            "desc": "META LEAN™ is an advanced body recomposition matrix designed to build lean, dry muscle while simultaneous stripping excess subcutaneous fat."
        },
        {
            "name": "Roger Pharma MORENGER-677™ (MK-677 Ibutamoren)",
            "comp": "MK-677 Ibutamoren Nutrobal 15mg",
            "dosage": "15mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "MORENGER-677™ delivers MK-677 Ibutamoren 15mg. Oral growth hormone secretagogue stimulating natural GH and IGF-1 secretion, deep sleep, and recovery."
        },
        {
            "name": "Roger Pharma OSTOSIL-2866™ (MK-2866 Ostarine)",
            "comp": "MK-2866 Ostarine (Enobosarm) 10mg",
            "dosage": "10mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "OSTOSIL-2866™ contains MK-2866 Ostarine 10mg. The most versatile SARM for joint healing, lean muscle retention in deficits, and steady gains."
        },
        {
            "name": "Roger Pharma SARMANONE-23™ (S-23 Advanced Strength SARM)",
            "comp": "S-23 SARM 10mg",
            "dosage": "10mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "SARMANONE-23™ contains S-23 SARM 10mg. High-affinity androgen receptor binder producing dry, grainy muscle conditioning and immense power."
        },
        {
            "name": "Roger Pharma STENAFIL-9009™ (SR-9009 Stenabolic)",
            "comp": "SR-9009 Stenabolic 10mg",
            "dosage": "10mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "STENAFIL-9009™ delivers Rev-ErbA agonist SR-9009 Stenabolic 10mg. Enhances mitochondrial count in skeletal muscle, endurance, and fat oxidation."
        },
        {
            "name": "Roger Pharma TESTOXIN-140™ (RAD-140 Testolone)",
            "comp": "RAD-140 Testolone 10mg",
            "dosage": "10mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "TESTOXIN-140™ contains RAD-140 Testolone 10mg. Extremely potent SARM providing genuine testosterone-like anabolic power, strength, and lean mass."
        },
        {
            "name": "Roger Pharma YUKOSTATIN-11™ (YK-11 Myostatin Inhibitor)",
            "comp": "YK-11 Myostatin Inhibitor SARM 5mg",
            "dosage": "5mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "SARMS",
            "desc": "YUKOSTATIN-11™ contains YK-11 (5mg). Unique steroidal SARM and follistatin up-regulator that suppresses myostatin to unlock genetic muscle limits."
        },

        # --- ORAL PEPTIDES (Page 28) ---
        {
            "name": "Roger Pharma 5-AMINO-1MQ (Metabolic Peptide 50mg)",
            "comp": "5-Amino-1MQ (NNMT Inhibitor) 50mg",
            "dosage": "50mg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "Oral Peptides",
            "desc": "5-AMINO-1MQ is a breakthrough small molecule NNMT inhibitor that enhances cellular energy metabolism, stimulates NAD+ synthesis, and prevents fat cell accumulation."
        },
        {
            "name": "Roger Pharma BPC-157 ORAL (Anti-Inflammatory Peptide 500mcg)",
            "comp": "Body Protection Compound-157 (BPC-157 Arginate) 500mcg",
            "dosage": "500mcg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "Oral Peptides",
            "desc": "BPC-157 ORAL provides stable gastric-resistant BPC-157 500mcg capsules. Promotes gastrointestinal integrity, tendon/ligament repair, and systemic anti-inflammatory action."
        },
        {
            "name": "Roger Pharma SLU-PP-332 (Exercise Mimetic Peptide 250mcg)",
            "comp": "SLU-PP-332 (ERR Alpha Agonist) 250mcg",
            "dosage": "250mcg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "Oral Peptides",
            "desc": "SLU-PP-332 is a revolutionary ERRα agonist exercise mimetic peptide promoting mitochondrial biogenesis and targeted adipose tissue utilization."
        },
        {
            "name": "Roger Pharma TESOFENSINE (Dopamine/Noradrenaline/Serotonin Reuptake Inhibitor 250mcg)",
            "comp": "Tesofensine Peptide Compound 250mcg",
            "dosage": "250mcg",
            "form": "Capsule",
            "pkg": "60 Capsules Bottle",
            "section": "Oral Peptides",
            "desc": "TESOFENSINE is an ultra-effective appetite suppression and metabolic output peptide promoting significant satiety and sustained caloric deficit."
        },

        # --- INJECTABLE PEPTIDES (Pages 31-37) ---
        {
            "name": "Roger Pharma ADIPOLYZE 177-191AA™ (HGH Fragment 5mg)",
            "comp": "Human Growth Hormone Fragment 177-191AA 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "ADIPOLYZE 177-191AA™ contains pure HGH Fragment 177-191 (5mg x 5 vials). Highly specific fat burning peptide that incinerates adipose tissue with zero impact on blood sugar."
        },
        {
            "name": "Roger Pharma EPOCHY™ (Epitalon Longevity Peptide 5mg)",
            "comp": "Epitalon (Epithalamin Tetra-peptide) 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "EPOCHY™ contains Epitalon 5mg x 5 vials. Promotes telomerase activation, telomere elongation, circadian rhythm restoration, and cellular rejuvenation."
        },
        {
            "name": "Roger Pharma FOLLIVOL 344™ (Follistatin 344 Myostatin Inhibitor 1mg)",
            "comp": "Recombinant Follistatin 344 1mg/vial",
            "dosage": "1mg",
            "form": "Peptide / Lyophilized",
            "pkg": "1mg/vial x 2 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "FOLLIVOL 344™ contains pure Follistatin 344 (1mg x 2 vials). Directly binds and suppresses myostatin, unlocking accelerated muscle hypertrophy and density."
        },
        {
            "name": "Roger Pharma GONADOROL™ (HCG 5000 IU)",
            "comp": "Human Chorionic Gonadotropin (HCG) 5000 IU/vial",
            "dosage": "5000 IU",
            "form": "Peptide / Lyophilized",
            "pkg": "5000 IU/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "GONADOROL™ provides pharmaceutical HCG 5000 IU x 5 vials. Mimics luteinizing hormone (LH) to restore testicular function, endogenous testosterone, and fertility."
        },
        {
            "name": "Roger Pharma INSULYX-DS™ (IGF-1 DES 1-3 1mg)",
            "comp": "Insulin-Like Growth Factor-1 DES (1-3) 1mg/vial",
            "dosage": "1mg",
            "form": "Peptide / Lyophilized",
            "pkg": "1mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "INSULYX-DS™ delivers fast-acting IGF-1 DES (1-3) 1mg x 5 vials for targeted localized muscle hyperplasia and rapid protein uptake."
        },
        {
            "name": "Roger Pharma INSULYX™ (IGF-1 Long R3 125mcg)",
            "comp": "Insulin-Like Growth Factor-1 Long R3 125mcg/vial",
            "dosage": "125mcg",
            "form": "Peptide / Lyophilized",
            "pkg": "125mcg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "INSULYX™ contains long-acting IGF-1 Long R3 125mcg x 5 vials. Extended half-life growth factor stimulating satellite cell proliferation and muscle synthesis."
        },
        {
            "name": "Roger Pharma IPAMORIN™ (Ipamorelin 2mg)",
            "comp": "Growth Hormone Releasing Pentapeptide (Ipamorelin) 2mg/vial",
            "dosage": "2mg",
            "form": "Peptide / Lyophilized",
            "pkg": "2mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "IPAMORIN™ contains selective GH secretagogue Ipamorelin 2mg x 5 vials. Clean growth hormone pulse with zero cortisol, prolactin, or appetite spikes."
        },
        {
            "name": "Roger Pharma MECHATOSIN™ (Mechano Growth Factor MGF 2mg)",
            "comp": "Mechano Growth Factor (IGF-1 EC) 2mg/vial",
            "dosage": "2mg",
            "form": "Peptide / Lyophilized",
            "pkg": "2mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "MECHATOSIN™ provides Mechano Growth Factor (MGF) 2mg x 5 vials for rapid repair of exercised muscle fibers and accelerated hypertrophy."
        },
        {
            "name": "Roger Pharma LIBIDRIN™ (Bremelanotide PT-141 10mg)",
            "comp": "Bremelanotide (PT-141) 10mg/vial",
            "dosage": "10mg",
            "form": "Peptide / Lyophilized",
            "pkg": "10mg/vial x 2 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "LIBIDRIN™ contains Bremelanotide PT-141 10mg x 2 vials. Centrally acting melanocortin receptor agonist for profound libido enhancement and sexual vitality in men and women."
        },
        {
            "name": "Roger Pharma MORPHIX-DAC™ (CJC-1295 With DAC 2mg)",
            "comp": "CJC-1295 With DAC (Drug Affinity Complex) 2mg/vial",
            "dosage": "2mg",
            "form": "Peptide / Lyophilized",
            "pkg": "2mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "MORPHIX-DAC™ contains CJC-1295 with DAC 2mg x 5 vials. Long-acting GHRH maintaining continuous baseline elevation of growth hormone and IGF-1."
        },
        {
            "name": "Roger Pharma MORPHIX-GRF™ (MOD GRF 1-29 CJC Without DAC 2mg)",
            "comp": "MOD GRF 1-29 (CJC-1295 Without DAC) 2mg/vial",
            "dosage": "2mg",
            "form": "Peptide / Lyophilized",
            "pkg": "2mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "MORPHIX-GRF™ delivers MOD GRF 1-29 (2mg x 5 vials). Pulsatile growth hormone releasing factor ideal for stacking with Ipamorelin or GHRP."
        },
        {
            "name": "Roger Pharma MOTSOXY™ (MOTS-c Mitochondrial Peptide 10mg)",
            "comp": "Mitochondrial Peptide (MOTS-c) 10mg/vial",
            "dosage": "10mg",
            "form": "Peptide / Lyophilized",
            "pkg": "10mg/vial x 2 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "MOTSOXY™ contains mitochondrial-derived peptide MOTS-c 10mg x 2 vials. Regulates metabolic homeostasis, enhances insulin sensitivity, and elevates ATP energy output."
        },
        {
            "name": "Roger Pharma NICOVIUM+™ (NAD+ Nicotinamide Adenine Dinucleotide 100mg)",
            "comp": "Nicotinamide Adenine Dinucleotide (NAD+) 100mg/vial",
            "dosage": "100mg",
            "form": "Peptide / Lyophilized",
            "pkg": "100mg/vial x 2 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "NICOVIUM+™ provides coenzyme NAD+ 100mg x 2 vials. Critical coenzyme for cellular respiration, DNA repair, sirtuin activation, and anti-aging energy."
        },
        {
            "name": "Roger Pharma OMNITROPIN 191AA™ (Human Growth Hormone 12 IU)",
            "comp": "Recombinant Human Growth Hormone 191AA 12 IU/vial",
            "dosage": "12 IU (4mg)",
            "form": "Peptide / Lyophilized",
            "pkg": "12 IU/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "OMNITROPIN 191AA™ delivers pure authentic 191-amino acid Somatropin HGH (12 IU x 5 vials) for fat loss, lean tissue synthesis, deep sleep, and skin renewal."
        },
        {
            "name": "Roger Pharma PENTAVOL 157™ (BPC-157 5mg)",
            "comp": "Body Protection Compound 157 (BPC-157) 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "PENTAVOL 157™ contains clinical-grade BPC-157 5mg x 5 vials. Renowned tissue, tendon, muscle, gut, and ligament restorative peptide."
        },
        {
            "name": "Roger Pharma PEPTORIN 2™ (GHRP-2 5mg)",
            "comp": "Growth Hormone Releasing Peptide-2 (GHRP-2) 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "PEPTORIN 2™ provides GHRP-2 (5mg x 5 vials). Potent growth hormone secretagogue stimulating natural pituitary GH pulses and muscle recovery."
        },
        {
            "name": "Roger Pharma PEPTORIN 6™ (GHRP-6 5mg)",
            "comp": "Growth Hormone Releasing Peptide-6 (GHRP-6) 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "PEPTORIN 6™ delivers GHRP-6 (5mg x 5 vials). Highly effective GH secretagogue and ghrelin mimetic that enhances appetite, mass gain, and deep sleep."
        },
        {
            "name": "Roger Pharma PROAPTOX™ (Adipotide Fat Targeted Proapoptotic Peptide 5mg)",
            "comp": "Fat Targeted Proapoptotic Peptide (Adipotide) 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 2 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "PROAPTOX™ contains experimental peptidomimetic Adipotide 5mg x 2 vials. Selectively targets and disrupts blood supply to white adipose tissue for extreme fat loss."
        },
        {
            "name": "Roger Pharma RETADRELINE™ (Retatrutide 6mg)",
            "comp": "Retatrutide Triple Agonist (GLP-1 / GIP / Glucagon) 6mg/vial",
            "dosage": "6mg",
            "form": "Peptide / Lyophilized",
            "pkg": "6mg/vial x 2 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "RETADRELINE™ provides next-generation Retatrutide 6mg x 2 vials. Triple receptor agonist delivering groundbreaking metabolic rate increases and weight reduction."
        },
        {
            "name": "Roger Pharma REVOSTRATE™ (GHK-Cu Copper Peptide 10mg)",
            "comp": "GHK (Glycyl-L-Histidyl-L-Lysine) Copper Peptide 10mg/vial",
            "dosage": "10mg",
            "form": "Peptide / Lyophilized",
            "pkg": "10mg/vial x 2 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "REVOSTRATE™ contains GHK-Cu Copper Peptide 10mg x 2 vials. Stimulates collagen synthesis, skin remodeling, tissue healing, and antioxidant defense."
        },
        {
            "name": "Roger Pharma SOMNITRIX™ (Delta Sleep-Inducing Peptide DSIP 5mg)",
            "comp": "Delta Sleep-Inducing Peptide (DSIP) 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 2 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "SOMNITRIX™ provides DSIP 5mg x 2 vials. Neuropeptide promoting deep restorative delta wave sleep, stress mitigation, and hormone balance."
        },
        {
            "name": "Roger Pharma TESATROPE™ (Tesamorelin 5mg)",
            "comp": "Tesamorelin Growth Hormone Releasing Factor 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "TESATROPE™ contains Tesamorelin 5mg x 5 vials. Clinically proven GHRH analogue targeting stubborn visceral abdominal fat and boosting natural GH."
        },
        {
            "name": "Roger Pharma THYMORIX 500™ (Thymosin Beta-4 / TB-500 5mg)",
            "comp": "Thymosin β-4 (43AA TB-500) 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "THYMORIX 500™ delivers Thymosin Beta-4 (5mg x 5 vials). Powerful actin-regulating tissue repair peptide for accelerated muscle, tendon, and ligament recovery."
        },
        {
            "name": "Roger Pharma TIRZEVAC™ (Tirzepatide 5mg)",
            "comp": "Tirzepatide Dual GIP / GLP-1 Receptor Agonist 5mg/vial",
            "dosage": "5mg",
            "form": "Peptide / Lyophilized",
            "pkg": "5mg/vial x 5 Vials Box (HeatSafe™)",
            "section": "Peptides",
            "desc": "TIRZEVAC™ contains Tirzepatide 5mg x 5 vials. Dual GIP and GLP-1 receptor agonist providing unprecedented appetite suppression and metabolic control."
        },
        {
            "name": "Roger Pharma PURE PEPTIDE WATER™ (Bacteriostatic Water USP)",
            "comp": "Bacteriostatic Water for Injection USP (0.9% Benzyl Alcohol)",
            "dosage": "2ml x 10 Ampoules",
            "form": "Peptide Diluent",
            "pkg": "2ml x 10 Ampoules Box",
            "section": "Peptides",
            "desc": "PURE PEPTIDE WATER™ contains sterile bacteriostatic water in convenient 2ml ampoules (10 ampoules box) designed specifically for reconstituting Roger Pharma peptides."
        }
    ]

    print(f"Prepared {len(roger_products_list)} Roger Pharma products from PDF catalog.")

    # Load existing products & categories
    with open('src/data/categories.json', 'r', encoding='utf-8') as f:
        categories = json.load(f)

    with open('src/data/products.json', 'r', encoding='utf-8') as f:
        products = json.load(f)

    formatted_roger_products = []
    base_id = len(products) + 1

    # Image placeholders or high-grade mockups
    # Roger Pharma branding image
    roger_default_img = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"

    for idx, item in enumerate(roger_products_list, 1):
        specs = {
            'Brand': 'Roger Pharma Co.',
            'Manufacturer': 'Roger Pharma Laboratories (Designed & Developed in Romania)',
            'Engineering': 'Engineered Using German Pharmaceutical Technology',
            'Composition': item['comp'],
            'Form': item['form'],
            'Strength / Dosage': item['dosage'],
            'Packaging Type': item['pkg'],
            'Packaging Line': f"HeatSafe™ Packaging with TrustKey™ Verification",
            'Product Section': item['section'],
            'Quality Standard': 'European Pharmaceutical Standard (USP / BP Grade)',
            'Authentication': 'TrustKey™ Security Verification on www.rogerpharma.com',
            'Usage / Application': 'Athletic Hypertrophy, Metabolic Optimization, Anti-Aging & Recovery'
        }

        formatted_roger_products.append({
            'id': f'roger-{base_id + idx}',
            'name': item['name'],
            'category': 'Roger Pharma',
            'categorySlug': 'roger-pharma',
            'dosage': item['dosage'],
            'form': item['form'],
            'image': roger_default_img,
            'packaging': item['pkg'],
            'specifications': specs,
            'description': item['desc'],
            'isPopular': True
        })

    # Create Roger Pharma Category
    roger_cat = {
        'id': 'roger-pharma',
        'name': 'Roger Pharma',
        'slug': 'roger-pharma',
        'count': len(formatted_roger_products),
        'icon': 'Sparkles',
        'featured': True
    }

    # Add Roger Pharma category at position #1
    clean_cats = [c for c in categories if c['name'] != 'Roger Pharma']
    updated_categories = [roger_cat] + clean_cats

    clean_prods = [p for p in products if p.get('category') != 'Roger Pharma']
    updated_products = formatted_roger_products + clean_prods

    with open('src/data/categories.json', 'w', encoding='utf-8') as f:
        json.dump(updated_categories, f, indent=2, ensure_ascii=False)

    with open('src/data/products.json', 'w', encoding='utf-8') as f:
        json.dump(updated_products, f, indent=2, ensure_ascii=False)

    print(f"Successfully integrated Roger Pharma:")
    print(f" - Total Categories: {len(updated_categories)}")
    print(f" - Total Products: {len(updated_products)} (including {len(formatted_roger_products)} Roger Pharma products)")

if __name__ == '__main__':
    process_roger_pharma()
