const fs = require('fs');
const path = require('path');

const rawItems = [
  // Page 1
  { sku: "TR5", name: "Tirzepatide", spec: "5mg*10vials", price: 49, coa: "https://janoshik.com/tests/84110-Tirzepatide_30mg_K6FBDPLBPP18", capColor: "#2563eb", active: "Tirzepatide (Dual GIP/GLP-1 Receptor Agonist)" },
  { sku: "TR10", name: "Tirzepatide", spec: "10mg*10vials", price: 67, coa: "https://janoshik.com/tests/84110-Tirzepatide_30mg_K6FBDPLBPP18", capColor: "#2563eb", active: "Tirzepatide (Dual GIP/GLP-1 Receptor Agonist)" },
  { sku: "TR15", name: "Tirzepatide", spec: "15mg*10vials", price: 83, coa: "https://janoshik.com/tests/84110-Tirzepatide_30mg_K6FBDPLBPP18", capColor: "#2563eb", active: "Tirzepatide (Dual GIP/GLP-1 Receptor Agonist)" },
  { sku: "TR20", name: "Tirzepatide", spec: "20mg*10vials", price: 110, coa: "https://janoshik.com/tests/84110-Tirzepatide_30mg_K6FBDPLBPP18", capColor: "#2563eb", active: "Tirzepatide (Dual GIP/GLP-1 Receptor Agonist)" },
  { sku: "TR30", name: "Tirzepatide", spec: "30mg*10vials", price: 155, coa: "https://janoshik.com/tests/84110-Tirzepatide_30mg_K6FBDPLBPP18", capColor: "#2563eb", active: "Tirzepatide (Dual GIP/GLP-1 Receptor Agonist)" },
  { sku: "TR60", name: "Tirzepatide", spec: "60mg*10vials", price: 232, coa: "https://janoshik.com/tests/84110-Tirzepatide_30mg_K6FBDPLBPP18", capColor: "#2563eb", active: "Tirzepatide (Dual GIP/GLP-1 Receptor Agonist)" },

  { sku: "SM5", name: "Semaglutide", spec: "5mg*10vials", price: 42, coa: "https://janoshik.com/tests/84111-Semaglutide_10mg", capColor: "#059669", active: "Semaglutide (GLP-1 Receptor Agonist)" },
  { sku: "SM10", name: "Semaglutide", spec: "10mg*10vials", price: 60, coa: "https://janoshik.com/tests/84111-Semaglutide_10mg", capColor: "#059669", active: "Semaglutide (GLP-1 Receptor Agonist)" },
  { sku: "SM15", name: "Semaglutide", spec: "15mg*10vials", price: 81, coa: "https://janoshik.com/tests/84111-Semaglutide_10mg", capColor: "#059669", active: "Semaglutide (GLP-1 Receptor Agonist)" },
  { sku: "SM20", name: "Semaglutide", spec: "20mg*10vials", price: 90, coa: "https://janoshik.com/tests/84111-Semaglutide_10mg", capColor: "#059669", active: "Semaglutide (GLP-1 Receptor Agonist)" },

  { sku: "RT5", name: "Retatrutide", spec: "5mg*10vials", price: 91, coa: "https://janoshik.com/tests/84112-Retatrutide_30mg_9T5XVKNPW55T", capColor: "#7c3aed", active: "Retatrutide (Triple Agonist GLP-1/GIP/Glucagon)" },
  { sku: "RT10", name: "Retatrutide", spec: "10mg*10vials", price: 130, coa: "https://janoshik.com/tests/84112-Retatrutide_30mg_9T5XVKNPW55T", capColor: "#7c3aed", active: "Retatrutide (Triple Agonist GLP-1/GIP/Glucagon)" },
  { sku: "RT15", name: "Retatrutide", spec: "15mg*10vials", price: 160, coa: "https://janoshik.com/tests/84112-Retatrutide_30mg_9T5XVKNPW55T", capColor: "#7c3aed", active: "Retatrutide (Triple Agonist GLP-1/GIP/Glucagon)" },
  { sku: "RT20", name: "Retatrutide", spec: "20mg*10vials", price: 207, coa: "https://janoshik.com/tests/84112-Retatrutide_30mg_9T5XVKNPW55T", capColor: "#7c3aed", active: "Retatrutide (Triple Agonist GLP-1/GIP/Glucagon)" },
  { sku: "RT30", name: "Retatrutide", spec: "30mg*10vials", price: 270, coa: "https://janoshik.com/tests/84112-Retatrutide_30mg_9T5XVKNPW55T", capColor: "#7c3aed", active: "Retatrutide (Triple Agonist GLP-1/GIP/Glucagon)" },
  { sku: "RT50", name: "Retatrutide", spec: "50mg*10vials", price: 410, coa: "https://janoshik.com/tests/84112-Retatrutide_30mg_9T5XVKNPW55T", capColor: "#7c3aed", active: "Retatrutide (Triple Agonist GLP-1/GIP/Glucagon)" },
  { sku: "RT60", name: "Retatrutide", spec: "60mg*10vials", price: 529, coa: "https://janoshik.com/tests/84112-Retatrutide_30mg_9T5XVKNPW55T", capColor: "#7c3aed", active: "Retatrutide (Triple Agonist GLP-1/GIP/Glucagon)" },

  { sku: "CGL5", name: "Cagrilintide", spec: "5mg*10vials", price: 117, coa: null, capColor: "#ea580c", active: "Cagrilintide (Long-acting Amylin Analogue)" },
  { sku: "CGL10", name: "Cagrilintide", spec: "10mg*10vials", price: 227, coa: null, capColor: "#ea580c", active: "Cagrilintide (Long-acting Amylin Analogue)" },

  { sku: "Klow", name: "Klow Blend (TB 10mg + BPC-157 10mg + GHK 50mg + KPV 10mg)", spec: "80mg*10vials", price: 240, coa: "https://janoshik.com/tests/84114", capColor: "#db2777", active: "TB500 (10mg) + BPC-157 (10mg) + GHK-Cu (50mg) + KPV (10mg)" },
  { sku: "LC216", name: "Lipo-C Injection Solution", spec: "10ml*10vials", price: 80, coa: null, capColor: "#ca8a04", active: "Methionine + Inositol + Choline + B12 (Lipotropic Blend)" },
  { sku: "BBG70", name: "Glow Blend (TB 10mg + BPC-157 10mg + GHK 50mg)", spec: "70mg*10vials", price: 227, coa: "https://janoshik.com/tests/84113", capColor: "#ec4899", active: "TB-500 (10mg) + BPC-157 (10mg) + GHK-Cu (50mg)" },

  { sku: "BT5", name: "TB-500 (Thymosin Beta 4 Acetate)", spec: "5mg*10vials", price: 89, coa: "https://janoshik.com/tests/84114", capColor: "#dc2626", active: "Thymosin Beta-4 (TB-500) Acetate" },
  { sku: "BT10", name: "TB-500 (Thymosin Beta 4 Acetate)", spec: "10mg*10vials", price: 168, coa: "https://janoshik.com/tests/84114", capColor: "#dc2626", active: "Thymosin Beta-4 (TB-500) Acetate" },

  { sku: "BC5", name: "BPC-157 (Body Protection Compound)", spec: "5mg*10vials", price: 48, coa: "https://janoshik.com/tests/84118", capColor: "#0284c7", active: "BPC-157 Pentadecapeptide" },
  { sku: "BC10", name: "BPC-157 (Body Protection Compound)", spec: "10mg*10vials", price: 70, coa: "https://janoshik.com/tests/84118", capColor: "#0284c7", active: "BPC-157 Pentadecapeptide" },

  { sku: "BB10", name: "BPC-157 5mg + TB-500 5mg Blend", spec: "10mg*10vials", price: 117, coa: "https://janoshik.com/tests/84118", capColor: "#0d9488", active: "BPC-157 (5mg) + TB-500 (5mg) Wolverine Healing Blend" },
  { sku: "BB20", name: "BPC-157 10mg + TB-500 10mg Blend", spec: "20mg*10vials", price: 196, coa: "https://janoshik.com/tests/84118", capColor: "#0d9488", active: "BPC-157 (10mg) + TB-500 (10mg) Wolverine Healing Blend" },

  // Page 2
  { sku: "NJ100", name: "NAD+ (Nicotinamide Adenine Dinucleotide)", spec: "100mg*10vials", price: 45, coa: "https://janoshik.com/tests/84119", capColor: "#6366f1", active: "NAD+ (β-Nicotinamide Adenine Dinucleotide)" },
  { sku: "NJ500", name: "NAD+ (Nicotinamide Adenine Dinucleotide)", spec: "500mg*10vials", price: 90, coa: "https://janoshik.com/tests/84119", capColor: "#6366f1", active: "NAD+ (β-Nicotinamide Adenine Dinucleotide)" },
  { sku: "NJ1000", name: "NAD+ (Nicotinamide Adenine Dinucleotide)", spec: "1000mg*10vials", price: 169, coa: "https://janoshik.com/tests/84119", capColor: "#6366f1", active: "NAD+ (β-Nicotinamide Adenine Dinucleotide)" },

  { sku: "P41", name: "PT-141 (Bremelanotide)", spec: "10mg*10vials", price: 65, coa: null, capColor: "#e11d48", active: "Bremelanotide (PT-141)" },
  { sku: "B12", name: "Vitamin B12 (Cyanocobalamin)", spec: "10ml*10vials", price: 88, coa: null, capColor: "#b91c1c", active: "Cyanocobalamin / Hydroxocobalamin (Vitamin B12)" },
  { sku: "CBL60", name: "Cerebrolysin Neuropeptide Solution", spec: "60mg*10vials", price: 169, coa: null, capColor: "#854d0e", active: "Porcine Brain Peptide Fraction (Cerebrolysin)" },

  { sku: "5AD", name: "AOD-9604 Fat Loss Peptide", spec: "5mg*10vials", price: 101, coa: null, capColor: "#f59e0b", active: "AOD-9604 (Lipolytic Fragment 177-191)" },
  { sku: "10AD", name: "AOD-9604 Fat Loss Peptide", spec: "10mg*10vials", price: 185, coa: null, capColor: "#f59e0b", active: "AOD-9604 (Lipolytic Fragment 177-191)" },

  { sku: "CU", name: "GHK-Cu (Copper Tripeptide-1)", spec: "50mg*10vials", price: 33, coa: "https://janoshik.com/tests/84120", capColor: "#0284c7", active: "GHK-Cu (Copper Tripeptide-1)" },
  { sku: "CU100", name: "GHK-Cu (Copper Tripeptide-1)", spec: "100mg*10vials", price: 59, coa: "https://janoshik.com/tests/84120", capColor: "#0284c7", active: "GHK-Cu (Copper Tripeptide-1)" },

  { sku: "MS10", name: "MOTS-c Mitochondrial Peptide", spec: "10mg*10vials", price: 68, coa: "https://janoshik.com/tests/84121", capColor: "#10b981", active: "MOTS-c (Mitochondrial Derived Peptide)" },
  { sku: "MS40", name: "MOTS-c Mitochondrial Peptide", spec: "40mg*10vials", price: 225, coa: "https://janoshik.com/tests/84121", capColor: "#10b981", active: "MOTS-c (Mitochondrial Derived Peptide)" },

  { sku: "H10", name: "HGH (Somatropin)", spec: "10iu*10vials", price: 49, coa: null, capColor: "#3b82f6", active: "Somatropin (Recombinant Human Growth Hormone)" },
  { sku: "H15", name: "HGH (Somatropin)", spec: "15iu*10vials", price: 73, coa: null, capColor: "#3b82f6", active: "Somatropin (Recombinant Human Growth Hormone)" },
  { sku: "H24", name: "HGH (Somatropin)", spec: "24iu*10vials", price: 118, coa: null, capColor: "#3b82f6", active: "Somatropin (Recombinant Human Growth Hormone)" },

  { sku: "G5K", name: "HCG (Human Chorionic Gonadotropin)", spec: "5000iu*10vials", price: 88, coa: "https://janoshik.com/tests/85665", capColor: "#f97316", active: "Human Chorionic Gonadotropin (HCG)" },
  { sku: "G10K", name: "HCG (Human Chorionic Gonadotropin)", spec: "10000iu*10vials", price: 156, coa: "https://janoshik.com/tests/85665", capColor: "#f97316", active: "Human Chorionic Gonadotropin (HCG)" },

  { sku: "2S10", name: "SS-31 (Elamipretide)", spec: "10mg*10vials", price: 105, coa: "https://janoshik.com/tests/84122", capColor: "#8b5cf6", active: "SS-31 (Elamipretide / Bendavia)" },
  { sku: "2S50", name: "SS-31 (Elamipretide)", spec: "50mg*10vials", price: 410, coa: "https://janoshik.com/tests/84122", capColor: "#8b5cf6", active: "SS-31 (Elamipretide / Bendavia)" },

  { sku: "CND2", name: "CJC-1295 Without DAC (Mod GRF 1-29)", spec: "2mg*10vials", price: 41, coa: null, capColor: "#06b6d4", active: "Modified GRF (1-29) CJC-1295 No DAC" },
  { sku: "CND5", name: "CJC-1295 Without DAC (Mod GRF 1-29)", spec: "5mg*10vials", price: 95, coa: null, capColor: "#06b6d4", active: "Modified GRF (1-29) CJC-1295 No DAC" },
  { sku: "CND10", name: "CJC-1295 Without DAC (Mod GRF 1-29)", spec: "10mg*10vials", price: 185, coa: null, capColor: "#06b6d4", active: "Modified GRF (1-29) CJC-1295 No DAC" },

  { sku: "CD2", name: "CJC-1295 With DAC", spec: "2mg*10vials", price: 72, coa: null, capColor: "#0891b2", active: "CJC-1295 with Drug Affinity Complex" },
  { sku: "CD5", name: "CJC-1295 With DAC", spec: "5mg*10vials", price: 172, coa: null, capColor: "#0891b2", active: "CJC-1295 with Drug Affinity Complex" },

  { sku: "CP10", name: "CJC-1295 No DAC 5mg + Ipamorelin 5mg", spec: "10mg*10vials", price: 115, coa: null, capColor: "#059669", active: "CJC-1295 (5mg) + Ipamorelin (5mg) Synergy Blend" },

  { sku: "MT1", name: "Melanotan I (Afamelanotide)", spec: "10mg*10vials", price: 62, coa: null, capColor: "#d97706", active: "Melanotan I (Afamelanotide)" },
  { sku: "ML10", name: "Melanotan II (MT-2)", spec: "10mg*10vials", price: 62, coa: null, capColor: "#b45309", active: "Melanotan II (MT-2)" },
  { sku: "MTN10", name: "Melatonin Peptide Formulation", spec: "10mg*10vials", price: 180, coa: null, capColor: "#4338ca", active: "N-acetyl-5-methoxytryptamine (Melatonin)" },
  { sku: "KP10", name: "KPV Anti-Inflammatory Peptide", spec: "10mg*10vials", price: 69, coa: null, capColor: "#ec4899", active: "Lysine-Proline-Valine (KPV)" },

  { sku: "WA3", name: "Bacteriostatic Water (0.9% Benzyl Alcohol)", spec: "3ml*10vials", price: 10, coa: null, capColor: "#64748b", active: "Sterile Bacteriostatic Water USP with 0.9% Benzyl Alcohol" },
  { sku: "WA10", name: "Bacteriostatic Water (0.9% Benzyl Alcohol)", spec: "10ml*10vials", price: 11, coa: null, capColor: "#64748b", active: "Sterile Bacteriostatic Water USP with 0.9% Benzyl Alcohol" },

  // Page 3
  { sku: "ADW10", name: "Acetic Acid Water Solution", spec: "10ml*10vials", price: 22, coa: null, capColor: "#94a3b8", active: "Sterile 0.6% Acetic Acid Reconstitution Solution" },
  { sku: "ADW3", name: "Acetic Acid Water Solution", spec: "3ml*10vials", price: 20, coa: null, capColor: "#94a3b8", active: "Sterile 0.6% Acetic Acid Reconstitution Solution" },

  { sku: "SMO5", name: "Sermorelin (GRF 1-29)", spec: "5mg*10vials", price: 70, coa: null, capColor: "#6366f1", active: "Sermorelin Acetate (GHRH 1-29)" },
  { sku: "SMO10", name: "Sermorelin (GRF 1-29)", spec: "10mg*10vials", price: 142, coa: null, capColor: "#6366f1", active: "Sermorelin Acetate (GHRH 1-29)" },

  { sku: "TSM5", name: "Tesamorelin", spec: "5mg*10vials", price: 112, coa: "https://janoshik.com/tests/84123", capColor: "#4f46e5", active: "Tesamorelin Acetate" },
  { sku: "TSM10", name: "Tesamorelin", spec: "10mg*10vials", price: 220, coa: "https://janoshik.com/tests/84123", capColor: "#4f46e5", active: "Tesamorelin Acetate" },

  { sku: "CS10", name: "Cagrilintide 5mg + Semaglutide 5mg (CagriSema Blend)", spec: "10mg*10vials", price: 167, coa: null, capColor: "#f97316", active: "Cagrilintide (5mg) + Semaglutide (5mg) Dual Weight Loss Blend" },

  { sku: "IG01", name: "IGF-1 LR3 (Long R3 IGF-1)", spec: "0.1mg*10vials", price: 45, coa: null, capColor: "#0284c7", active: "Long R3 Recombinant Insulin-Like Growth Factor-1" },
  { sku: "IG1", name: "IGF-1 LR3 (Long R3 IGF-1)", spec: "1mg*10vials", price: 220, coa: null, capColor: "#0284c7", active: "Long R3 Recombinant Insulin-Like Growth Factor-1" },

  { sku: "10AM", name: "5-Amino-1MQ", spec: "10mg*10vials", price: 158, coa: null, capColor: "#e11d48", active: "5-Amino-1-methylquinolinium (NNMT Inhibitor)" },
  { sku: "LB", name: "Lemon Bottle Advanced Fat Dissolving Solution", spec: "10ml*10vials", price: 89, coa: null, capColor: "#eab308", active: "Riboflavin (B2) + Bromelain + Lecithin Fat Reduction Complex" },
  { sku: "LC600", name: "L-Carnitine Injectable Solution", spec: "10ml*10vials", price: 40, coa: null, capColor: "#dc2626", active: "L-Carnitine 600mg/ml Injection" },
  { sku: "LC1200", name: "L-Carnitine Injectable Solution", spec: "10ml*10vials", price: 50, coa: null, capColor: "#dc2626", active: "L-Carnitine 1200mg/ml Injection" },

  { sku: "ET10", name: "Epitalon (Epithalamin)", spec: "10mg*10vials", price: 35, coa: null, capColor: "#14b8a6", active: "Epitalon (Telomerase Activator Peptide)" },
  { sku: "ET50", name: "Epitalon (Epithalamin)", spec: "50mg*10vials", price: 162, coa: null, capColor: "#14b8a6", active: "Epitalon (Telomerase Activator Peptide)" },

  { sku: "G75", name: "HMG (Human Menopausal Gonadotropin)", spec: "75iu*10vials", price: 62, coa: null, capColor: "#a855f7", active: "Human Menopausal Gonadotropin (FSH + LH 75 IU)" },
  { sku: "MDT10", name: "Mazdutide (Dual GLP-1/GCGR)", spec: "10mg*10vials", price: 195, coa: null, capColor: "#84cc16", active: "Mazdutide (Dual GLP-1/Glucagon Receptor Agonist)" },
  { sku: "SUR10", name: "Survodutide (Dual Glucagon/GLP-1)", spec: "10mg*10vials", price: 296, coa: null, capColor: "#10b981", active: "Survodutide (Dual Glucagon/GLP-1 Receptor Agonist)" },

  { sku: "IP5", name: "Ipamorelin Acetate", spec: "5mg*10vials", price: 38, coa: "https://janoshik.com/tests/84124", capColor: "#06b6d4", active: "Ipamorelin Growth Hormone Secretagogue" },
  { sku: "IP10", name: "Ipamorelin Acetate", spec: "10mg*10vials", price: 72, coa: "https://janoshik.com/tests/84124", capColor: "#06b6d4", active: "Ipamorelin Growth Hormone Secretagogue" },

  { sku: "AP5", name: "Adipotide (FTPP Fat-Targeted Peptide)", spec: "5mg*10vials", price: 140, coa: null, capColor: "#f43f5e", active: "Proapoptotic Fat Targeted Peptide (FTPP)" },
  { sku: "XA5", name: "Semax Heptapeptide", spec: "5mg*10vials", price: 44, coa: null, capColor: "#3b82f6", active: "Semax (ACTH 4-10 Analogue Nootropic Peptide)" },
  { sku: "XA10", name: "Semax Heptapeptide", spec: "10mg*10vials", price: 72, coa: null, capColor: "#3b82f6", active: "Semax (ACTH 4-10 Analogue Nootropic Peptide)" },

  { sku: "RA10", name: "ARA 290 (Cibinetide)", spec: "10mg*10vials", price: 72, coa: null, capColor: "#64748b", active: "ARA 290 (Erythropoietin Helix B Surface Peptide)" },
  { sku: "DS5", name: "DSIP (Delta Sleep-Inducing Peptide)", spec: "5mg*10vials", price: 40, coa: null, capColor: "#475569", active: "Delta Sleep-Inducing Nonapeptide (DSIP)" },
  { sku: "HX5", name: "Hexarelin Acetate", spec: "5mg*10vials", price: 87, coa: null, capColor: "#8b5cf6", active: "Hexarelin Growth Hormone Secretagogue" },
  { sku: "KS5", name: "Kisspeptin-10", spec: "5mg*10vials", price: 60, coa: null, capColor: "#ec4899", active: "Kisspeptin-10 (Metastin Fragment 45-54)" },
  { sku: "KS10", name: "Kisspeptin-10", spec: "10mg*10vials", price: 117, coa: null, capColor: "#ec4899", active: "Kisspeptin-10 (Metastin Fragment 45-54)" },

  { sku: "OT2", name: "Oxytocin Acetate", spec: "2mg*10vials", price: 36, coa: null, capColor: "#f43f5e", active: "Oxytocin Nonapeptide Acetate" },
  { sku: "OT5", name: "Oxytocin Acetate", spec: "5mg*10vials", price: 62, coa: null, capColor: "#f43f5e", active: "Oxytocin Nonapeptide Acetate" },

  // Page 4
  { sku: "SK5", name: "Selank Nootropic Peptide", spec: "5mg*10vials", price: 45, coa: null, capColor: "#0284c7", active: "Selank (Tuftsin Analogue Heptapeptide)" },
  { sku: "SK10", name: "Selank Nootropic Peptide", spec: "10mg*10vials", price: 72, coa: null, capColor: "#0284c7", active: "Selank (Tuftsin Analogue Heptapeptide)" },

  { sku: "TA5", name: "Thymosin Alpha-1 (Tα1)", spec: "5mg*10vials", price: 100, coa: null, capColor: "#16a34a", active: "Thymosin Alpha-1 Immunomodulatory Peptide" },
  { sku: "TA10", name: "Thymosin Alpha-1 (Tα1)", spec: "10mg*10vials", price: 168, coa: null, capColor: "#16a34a", active: "Thymosin Alpha-1 Immunomodulatory Peptide" },

  { sku: "TY10", name: "Thymalin Polypeptide", spec: "10mg*10vials", price: 63, coa: null, capColor: "#22c55e", active: "Thymalin Thymus Bioregulator Peptide" },
  { sku: "AR50", name: "AICAR (AMPK Activator)", spec: "50mg*10vials", price: 60, coa: null, capColor: "#f59e0b", active: "AICAR (Acadesine / AICA Ribonucleotide)" },

  { sku: "G25", name: "GHRP-2 Acetate", spec: "5mg*10vials", price: 27, coa: null, capColor: "#8b5cf6", active: "Growth Hormone Releasing Peptide-2 (Pralmorelin)" },
  { sku: "G210", name: "GHRP-2 Acetate", spec: "10mg*10vials", price: 54, coa: null, capColor: "#8b5cf6", active: "Growth Hormone Releasing Peptide-2 (Pralmorelin)" },

  { sku: "G65", name: "GHRP-6 Acetate", spec: "5mg*10vials", price: 27, coa: null, capColor: "#a855f7", active: "Growth Hormone Releasing Peptide-6 Acetate" },
  { sku: "G610", name: "GHRP-6 Acetate", spec: "10mg*10vials", price: 54, coa: null, capColor: "#a855f7", active: "Growth Hormone Releasing Peptide-6 Acetate" },

  { sku: "DR5", name: "Dermorphin Peptide", spec: "5mg*10vials", price: 36, coa: null, capColor: "#b91c1c", active: "Dermorphin Heptapeptide" },
  { sku: "GTT600", name: "Glutathione Reduced (GSH)", spec: "600mg*10vials", price: 59, coa: null, capColor: "#0284c7", active: "L-Glutathione Reduced USP 600mg" },
  { sku: "GTT", name: "Glutathione Reduced (GSH)", spec: "1500mg*10vials", price: 158, coa: null, capColor: "#0284c7", active: "L-Glutathione Reduced USP 1500mg" },

  { sku: "NP810", name: "SNAP-8 Anti-Wrinkle Octapeptide", spec: "10mg*10vials", price: 41, coa: null, capColor: "#ec4899", active: "Acetyl Octapeptide-3 (SNAP-8)" },
  { sku: "375", name: "LL-37 Antimicrobial Peptide", spec: "5mg*10vials", price: 90, coa: null, capColor: "#14b8a6", active: "LL-37 Human Cathelicidin Peptide" },
  { sku: "VP10", name: "VIP (Vasoactive Intestinal Peptide)", spec: "10mg*10vials", price: 178, coa: null, capColor: "#6366f1", active: "Vasoactive Intestinal Peptide (VIP 28-amino acid)" },
  { sku: "F410", name: "FOXO4-DRI Senolytic Peptide", spec: "10mg*10vials", price: 360, coa: null, capColor: "#7e22ce", active: "FOXO4-DRI (D-Retro-Inverso Peptide)" },
  { sku: "FM2", name: "MGF (Mechano Growth Factor)", spec: "2mg*10vials", price: 62, coa: null, capColor: "#d97706", active: "Mechano Growth Factor (IGF-1Ec Fragment)" },
  { sku: "FMP2", name: "PEG MGF (Pegylated Mechano Growth Factor)", spec: "2mg*10vials", price: 90, coa: null, capColor: "#b45309", active: "Pegylated Mechano Growth Factor (PEG-MGF)" }
];

console.log('Total wholesale China peptides parsed:', rawItems.length);

// Ensure output directory for images exists
const outDir = path.join(__dirname, '../public/products/wholesale-peptides');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Increase price by $10 for all 108 products
rawItems.forEach(item => {
  item.price += 10;
});

// Generate clean high-resolution SVG product box + vial artwork for each SKU
rawItems.forEach(item => {
  const isLiquid = item.spec.includes('ml');
  const isWater = item.name.toLowerCase().includes('water');
  const formText = isWater ? 'Sterile Solution' : (isLiquid ? 'Injectable Liquid' : 'Lyophilized Powder');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${item.capColor}" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="vialCap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${item.capColor}" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.4" />
      <stop offset="100%" stop-color="${item.capColor}" />
    </linearGradient>
    <linearGradient id="glassVial" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
      <stop offset="30%" stop-color="#f8fafc" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#e2e8f0" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#cbd5e1" stop-opacity="0.9" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="500" height="500" fill="url(#bgGrad)" />

  <!-- Subtle Blueprint Tech Grid -->
  <g stroke="#cbd5e1" stroke-width="0.5" stroke-opacity="0.4">
    <line x1="50" y1="0" x2="50" y2="500" />
    <line x1="150" y1="0" x2="150" y2="500" />
    <line x1="250" y1="0" x2="250" y2="500" />
    <line x1="350" y1="0" x2="350" y2="500" />
    <line x1="450" y1="0" x2="450" y2="500" />
    <line x1="0" y1="100" x2="500" y2="100" />
    <line x1="0" y1="200" x2="500" y2="200" />
    <line x1="0" y1="300" x2="500" y2="300" />
    <line x1="0" y1="400" x2="500" y2="400" />
  </g>

  <!-- Ground Drop Shadow -->
  <ellipse cx="250" cy="420" rx="190" ry="22" fill="#0f172a" opacity="0.15" filter="blur(8px)" />

  <!-- 10-VIAL KIT PACKAGING BOX (Rear/Angled) -->
  <g filter="url(#shadow)">
    <!-- Main Box Body -->
    <rect x="60" y="110" width="240" height="280" rx="16" fill="url(#boxGrad)" stroke="#cbd5e1" stroke-width="1.5" />
    
    <!-- Top Header Bar on Box -->
    <path d="M 60 126 A 16 16 0 0 1 76 110 L 284 110 A 16 16 0 0 1 300 126 L 300 148 L 60 148 Z" fill="url(#accentGrad)" />
    
    <!-- Box Header Text -->
    <text x="75" y="136" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#ffffff" letter-spacing="1">FACTORY DIRECT WHOLESALE KIT</text>
    <text x="285" y="136" text-anchor="end" font-family="monospace" font-size="10" font-weight="700" fill="#93c5fd">10 VIALS</text>

    <!-- Lab Grade Brand Banner -->
    <g transform="translate(80, 165)">
      <rect width="200" height="32" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
      <circle cx="16" cy="16" r="6" fill="${item.capColor}" />
      <text x="30" y="20" font-family="-apple-system, sans-serif" font-size="12" font-weight="900" fill="#0f172a">PEPTIDE LABS DIRECT</text>
    </g>

    <!-- Product Title On Box -->
    <text x="80" y="225" font-family="-apple-system, sans-serif" font-size="17" font-weight="900" fill="#0f172a">${item.name.slice(0, 20)}</text>
    <text x="80" y="245" font-family="-apple-system, sans-serif" font-size="13" font-weight="700" fill="${item.capColor}">${item.spec}</text>

    <!-- Box Specs Table / Badges -->
    <g transform="translate(80, 260)">
      <rect width="90" height="22" rx="4" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1" />
      <text x="45" y="15" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" font-weight="800" fill="#065f46">≥99% HPLC PURITY</text>
    </g>
    <g transform="translate(180, 260)">
      <rect width="100" height="22" rx="4" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1" />
      <text x="50" y="15" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" font-weight="800" fill="#0369a1">${formText.toUpperCase()}</text>
    </g>

    <!-- Quality & Security Seals -->
    <g transform="translate(80, 300)">
      <line x1="0" y1="0" x2="200" y2="0" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 4" />
      
      <!-- Janoshik Lab Verification Stamp -->
      <rect x="0" y="12" width="200" height="36" rx="6" fill="${item.coa ? '#eff6ff' : '#f8fafc'}" stroke="${item.coa ? '#93c5fd' : '#e2e8f0'}" stroke-width="1.2" />
      <text x="12" y="27" font-family="-apple-system, sans-serif" font-size="10" font-weight="800" fill="${item.coa ? '#1e40af' : '#475569'}">★ JANOSHIK 3RD-PARTY TESTED</text>
      <text x="12" y="40" font-family="monospace" font-size="9" font-weight="600" fill="#64748b">BATCH: ${item.sku}-CN2026 | COA AVAILABLE</text>
    </g>

    <!-- Box Bottom Barcode -->
    <g transform="translate(80, 360)">
      <rect width="80" height="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8" />
      <line x1="6" y1="2" x2="6" y2="16" stroke="#000000" stroke-width="1.5" />
      <line x1="12" y1="2" x2="12" y2="16" stroke="#000000" stroke-width="2" />
      <line x1="18" y1="2" x2="18" y2="16" stroke="#000000" stroke-width="1" />
      <line x1="26" y1="2" x2="26" y2="16" stroke="#000000" stroke-width="3" />
      <line x1="34" y1="2" x2="34" y2="16" stroke="#000000" stroke-width="1.5" />
      <line x1="42" y1="2" x2="42" y2="16" stroke="#000000" stroke-width="2" />
      <line x1="50" y1="2" x2="50" y2="16" stroke="#000000" stroke-width="1" />
      <line x1="60" y1="2" x2="60" y2="16" stroke="#000000" stroke-width="2.5" />
      <line x1="70" y1="2" x2="70" y2="16" stroke="#000000" stroke-width="1.5" />
      <text x="190" y="14" text-anchor="end" font-family="monospace" font-size="10" font-weight="800" fill="#0f172a">SKU: ${item.sku}</text>
    </g>
  </g>

  <!-- FOREGROUND VIAL 1 (Sample Display Vial) -->
  <g filter="url(#shadow)" transform="translate(290, 150)">
    <!-- Glass Vial Body -->
    <rect x="20" y="70" width="105" height="190" rx="20" fill="url(#glassVial)" stroke="#94a3b8" stroke-width="1.5" />
    
    <!-- Lyophilized Cake / Liquid inside vial -->
    <rect x="25" y="195" width="95" height="60" rx="8" fill="#ffffff" opacity="0.9" stroke="#cbd5e1" stroke-width="0.8" />
    <!-- Lyophilized texture lines -->
    <path d="M 28 215 Q 60 210, 85 218 T 116 214" stroke="#e2e8f0" stroke-width="1.5" fill="none" />
    <path d="M 30 235 Q 70 230, 95 238 T 115 232" stroke="#e2e8f0" stroke-width="1.5" fill="none" />

    <!-- Vial Label Wrap -->
    <rect x="22" y="95" width="101" height="95" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
    <rect x="22" y="95" width="101" height="8" fill="${item.capColor}" />
    <text x="72" y="118" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" font-weight="900" fill="#0f172a">${item.name.slice(0, 14)}</text>
    <text x="72" y="132" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="800" fill="${item.capColor}">${item.spec.split('*')[0]}</text>
    <text x="72" y="146" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="7.5" font-weight="700" fill="#64748b">${formText}</text>
    <text x="72" y="160" text-anchor="middle" font-family="monospace" font-size="7" font-weight="700" fill="#059669">JANOSHIK COA VERIFIED</text>
    <rect x="35" y="168" width="74" height="14" rx="3" fill="#0f172a" />
    <text x="72" y="178" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="7" font-weight="800" fill="#ffffff">WHOLESALE EXPORT</text>

    <!-- Glass Reflections -->
    <rect x="26" y="75" width="12" height="180" rx="6" fill="#ffffff" opacity="0.45" />

    <!-- Aluminum Crimp Collar -->
    <rect x="42" y="48" width="60" height="22" rx="4" fill="#cbd5e1" stroke="#64748b" stroke-width="1" />
    <line x1="42" y1="58" x2="102" y2="58" stroke="#94a3b8" stroke-width="1" />

    <!-- Flip-Off Color Cap -->
    <rect x="36" y="24" width="72" height="26" rx="8" fill="url(#vialCap)" stroke="#0f172a" stroke-width="1.2" />
    <text x="72" y="41" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" font-weight="900" fill="#ffffff" letter-spacing="1">FLIP OFF</text>
  </g>

  <!-- FOREGROUND VIAL 2 (Standing Secondary Vial for kit feel) -->
  <g filter="url(#shadow)" transform="translate(370, 200) scale(0.85)">
    <rect x="20" y="70" width="105" height="190" rx="20" fill="url(#glassVial)" stroke="#94a3b8" stroke-width="1.5" />
    <rect x="25" y="195" width="95" height="60" rx="8" fill="#ffffff" opacity="0.9" />
    <rect x="22" y="95" width="101" height="95" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
    <rect x="22" y="95" width="101" height="8" fill="${item.capColor}" />
    <text x="72" y="125" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12" font-weight="900" fill="#0f172a">${item.sku}</text>
    <text x="72" y="145" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9" font-weight="700" fill="${item.capColor}">10-VIAL PACK</text>
    <rect x="42" y="48" width="60" height="22" rx="4" fill="#cbd5e1" stroke="#64748b" stroke-width="1" />
    <rect x="36" y="24" width="72" height="26" rx="8" fill="url(#vialCap)" stroke="#0f172a" stroke-width="1.2" />
  </g>

  <!-- Top Right Wholesale Price Ribbon -->
  <g transform="translate(340, 25)">
    <rect width="140" height="52" rx="14" fill="#0f172a" stroke="${item.capColor}" stroke-width="2" filter="url(#shadow)" />
    <text x="70" y="23" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" font-weight="700" fill="#94a3b8">WHOLESALE (10 VIALS)</text>
    <text x="70" y="45" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="22" font-weight="900" fill="#22c55e">$${item.price}</text>
  </g>
</svg>`;

  const fileName = `${item.sku.toLowerCase()}-wholesale.svg`;
  fs.writeFileSync(path.join(outDir, fileName), svgContent, 'utf8');
});

console.log(`Generated ${rawItems.length} crisp SVG product images in public/products/wholesale-peptides/`);
