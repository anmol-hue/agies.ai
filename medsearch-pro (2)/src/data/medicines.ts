/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Medicine } from '../types';

export const MEDICINES_DB: Medicine[] = [
  {
    id: '1',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotic (Penicillins)',
    description: 'A broad-spectrum penicillin antibiotic used to treat a wide variety of bacterial infections, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.',
    uses: [
      'Bacterial Otitis Media (Throat & Ear Infection)',
      'Streptococcal Pharyngitis',
      'Lower Respiratory Tract Infections',
      'Dental Abscesses',
      'Urinary Tract Infection (UTI)'
    ],
    dosage: '250mg to 500mg three times daily or 500mg to 875mg twice daily, typically taken for 7 to 10 days.',
    sideEffects: [
      { name: 'Nausea', percentage: 12 },
      { name: 'Diarrhea', percentage: 15 },
      { name: 'Skin Rash (Mild)', percentage: 8 },
      { name: 'Headache', percentage: 5 }
    ],
    warnings: [
      'Do not use if allergic to penicillin or cephalosporin antibiotics.',
      'Complete the entire prescribed course even if symptoms disappear early to prevent bacterial resistance.',
      'Can reduce the effectiveness of oral contraceptives (birth control).'
    ],
    interactions: [
      {
        withMedicineId: '10', // Aspirin
        severity: 'Low',
        effect: 'Aspirin can increase blood levels of Amoxicillin by slowing renal excretion.'
      }
    ],
    riskLevel: 'Low',
    pillColor: 'amber',
    pillShape: 'capsule',
    imprint: 'AMOX 500'
  },
  {
    id: '2',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'NSAID (Pain & Inflammation Reliever)',
    description: 'A nonsteroidal anti-inflammatory drug (NSAID) used for reducing hormones that cause pain and inflammation in the body. Frequently used for fever, arthritis, menstrual cramps, toothache, and joint stiffness.',
    uses: [
      'Mild-to-moderate Pain Relief',
      'Fever Reduction',
      'Rheumatoid & Osteoarthritis Management',
      'Inflammatory Tendonitis',
      'Primary Dysmenorrhea (Menstrual Cramps)'
    ],
    dosage: '200mg to 400mg every 4 to 6 hours as needed. Maximum daily dose is 1200mg for Over-the-Counter (OTC) or up to 3200mg under strict medical supervision.',
    sideEffects: [
      { name: 'Stomach Upset or Heartburn', percentage: 22 },
      { name: 'Dizziness', percentage: 6 },
      { name: 'Mild Bloating', percentage: 9 },
      { name: 'Increased Blood Pressure', percentage: 4 }
    ],
    warnings: [
      'May increase risk of serious cardiovascular events, including myocardial infarction or stroke, especially with prolonged use.',
      'Higher risk of gastrointestinal bleeding, ulcers, and stomach perforation; always take with food or milk.',
      'Avoid during late pregnancy (third trimester) as it may harm the unborn baby.'
    ],
    interactions: [
      {
        withMedicineId: '10', // Aspirin
        severity: 'High',
        effect: 'Significantly increases the risk of serious gastrointestinal ulceration and bleeding. Can also decrease Aspirin cardiotonic anti-platelet protection.'
      },
      {
        withMedicineId: '5', // Lisinopril
        severity: 'High',
        effect: 'Reduces the antihypertensive effect of Lisinopril and increases the risk of severe renal impairment (kidney failure).'
      }
    ],
    riskLevel: 'Medium',
    pillColor: 'rose',
    pillShape: 'round',
    imprint: 'I-8'
  },
  {
    id: '3',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    category: 'Statin (Cholesterol-Lowering)',
    description: 'A prescription HMG-CoA reductase inhibitor (statin) designed to lower cholesterol and triglycerides in the blood, reducing the risk of stroke, heart attack, and cardiovascular disease.',
    uses: [
      'Hypercholesterolemia (High Cholesterol)',
      'Cardiovascular Prevention',
      'Triglyceride Reduction',
      'Slowing Atherosclerosis Progress'
    ],
    dosage: '10mg to 80mg once daily at any time of the day, with or without food. Typically adjusted based on lipid panel tests.',
    sideEffects: [
      { name: 'Myalgia (Muscle Pain)', percentage: 10 },
      { name: 'Joint Pain (Arthralgia)', percentage: 6 },
      { name: 'Diarrhea', percentage: 7 },
      { name: 'Nasopharyngitis', percentage: 8 }
    ],
    warnings: [
      'Contact your clinician immediately if experiencing unexplained muscle tenderness, localized weakness, or spasms accompanied by a fever.',
      'Monitor liver enzyme levels through routine blood panels.',
      'Strictly avoid grapefruit juice and excessive alcohol consumption during therapy.'
    ],
    interactions: [],
    riskLevel: 'Low',
    pillColor: 'blue',
    pillShape: 'oval',
    imprint: 'PD 157'
  },
  {
    id: '4',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    category: 'Biguanide (Anti-Diabetic)',
    description: 'First-line prescription medication for the treatment of type 2 diabetes. Works primarily by improving insulin sensitivity, reducing hepatic glucose production, and decreasing intestinal glucose absorption.',
    uses: [
      'Type 2 Diabetes Mellitus Management',
      'Prediabetes Intervention (Off-label)',
      'Polycystic Ovary Syndrome (PCOS)'
    ],
    dosage: 'Normally started at 500mg twice daily or 850mg once daily taken with meals. Gradually titrated up to a maximum recommended dose of 2500mg per day.',
    sideEffects: [
      { name: 'Abdominal Cramping & Gas', percentage: 26 },
      { name: 'Diarrhea', percentage: 28 },
      { name: 'Metallic Taste in Mouth', percentage: 9 },
      { name: 'Vitamin B12 Deficiency', percentage: 7 }
    ],
    warnings: [
      'Rare but extremely serious danger of Lactic Acidosis, highly exacerbated by kidney disease, dehydration, or heavy alcohol use.',
      'Do not take preceding any medical imaging scans utilizing iodine contrast dye.'
    ],
    interactions: [],
    riskLevel: 'Medium',
    pillColor: 'emerald',
    pillShape: 'oval',
    imprint: 'M 500'
  },
  {
    id: '5',
    name: 'Lisinopril',
    genericName: 'Lisinopril Dihydrate',
    category: 'ACE Inhibitor (Antihistaminic & Antihypertensive)',
    description: 'An Angiotensin-Converting Enzyme (ACE) inhibitor widely prescribed to treat hypertension (high blood pressure) and heart failure, and utilized to improve survival rates post-myocardial infarction.',
    uses: [
      'Essential Hypertension',
      'Congestive Heart Failure Adjuvant Therapy',
      'Diabetic Nephropathy Protection',
      'Post-Myocardial Infarction Survival'
    ],
    dosage: 'Starting dose for hypertension is typically 10mg once daily. Maintenance dose ranges between 20mg to 40mg taken at the same time each morning.',
    sideEffects: [
      { name: 'Dry Cough (Constant)', percentage: 14 },
      { name: 'Dizziness or Lightheadedness', percentage: 9 },
      { name: 'Hyperkalemia (High Potassium)', percentage: 4 },
      { name: 'Fatigue', percentage: 5 }
    ],
    warnings: [
      'Can cause Angioedema (life-threatening airway swelling) - seek emergency room help immediately if face/tongue swells.',
      'Black Box Warning: Do not use during pregnancy as ACE inhibitors can cause fetal death or severe injuries.',
      'Avoid high-potassium foods and potassium-containing salt substitutes.'
    ],
    interactions: [
      {
        withMedicineId: '2', // Ibuprofen
        severity: 'High',
        effect: 'NSAIDs (like Ibuprofen and Aspirin) block renal prostaglandins, cancelling Lisinopril benefits and putting the kidneys under acute hypertensive damage.'
      },
      {
        withMedicineId: '10', // Aspirin
        severity: 'Moderate',
        effect: 'Aspirin at high analgesic doses can reduce Lisinoprils systemic vasodilatory actions.'
      }
    ],
    riskLevel: 'High',
    pillColor: 'violet',
    pillShape: 'round',
    imprint: 'LUPIN 10'
  },
  {
    id: '6',
    name: 'Albuterol',
    genericName: 'Albuterol Sulfate (Salbutamol)',
    category: 'Beta-2 Agonist (Bronchodilator)',
    description: 'A rapid-acting bronchodilator (quick-relief rescue inhaler) which relaxes smooth muscles in the pulmonary airways, helpful to relieve and prevent bronchospasm in respiratory patients.',
    uses: [
      'Acute Bronchospasm Relief',
      'Asthma Exacerbation Control',
      'Exercise-Induced Bronchoconstriction Prevention',
      'COPD Airway Expansion'
    ],
    dosage: 'Inhalation: 2 puffs every 4 to 6 hours as needed to abort acute asthmatic symptoms. For prevention, use 15-20 minutes before exercising.',
    sideEffects: [
      { name: 'Tachycardia (Rapid Heartbeat)', percentage: 11 },
      { name: 'Tremors (Shaking Hands)', percentage: 18 },
      { name: 'Nervousness or Agitation', percentage: 15 },
      { name: 'Hypokalemia', percentage: 2 }
    ],
    warnings: [
      'Should be used strictly as a rescue inhaler. Over-reliance (using more than 2 days per week) indicates poor disease control; seek anti-inflammatory maintenance.',
      'Use caution in patients with coronary heart disease, irregular heart rhythms, or severe hyperthyroidism.'
    ],
    interactions: [],
    riskLevel: 'Medium',
    pillColor: 'sky',
    pillShape: 'capsule',
    imprint: 'ALB INH'
  },
  {
    id: '7',
    name: 'Omeprazole',
    genericName: 'Omeprazole Magnesium',
    category: 'Proton Pump Inhibitor (PPI)',
    description: 'An oral proton pump inhibitor (PPI) designed to lower gastric acid secretion inside the stomach. Used for healing acid damage to the food pipe, reducing acid reflux, and treating ulcers.',
    uses: [
      'Gastroesophageal Reflux Disease (GERD)',
      'Erosive Esophagitis Healing',
      'Duodenal or Gastric Ulcers',
      'Zollinger-Ellison Syndrome'
    ],
    dosage: '20mg to 40mg taken once daily, strictly 30 to 60 minutes before the first meal of the day. Standard course is 4 to 8 weeks.',
    sideEffects: [
      { name: 'Flatus or Abdominal Pain', percentage: 5 },
      { name: 'Headache', percentage: 7 },
      { name: 'Constipation', percentage: 3 },
      { name: 'Oral Dryness', percentage: 2 }
    ],
    warnings: [
      'Long-term use (more than 1 year) may lead to low magnesium levels, osteoporosis-related hip/wrist bone fractures, and impaired Vitamin B12 absorption.',
      'Increases risk of Clostridioides difficile-associated severe diarrhea.'
    ],
    interactions: [],
    riskLevel: 'Low',
    pillColor: 'indigo',
    pillShape: 'capsule',
    imprint: 'OMEP 20'
  },
  {
    id: '8',
    name: 'Gabapentin',
    genericName: 'Gabapentin',
    category: 'Anticonvulsant & Neuropathic Agent',
    description: 'An amino-acid analogue anticonvulsant medication used key-wise to control specific forms of seizures and to treat chronic neuropathic nerve pain syndromes.',
    uses: [
      'Postherpetic Neuralgia (Shingles Pain)',
      'Diabetic Peripheral Neuropathy Pain',
      'Partial Onset Epilepsy Adjunct',
      'Restless Legs Syndrome (RLS)'
    ],
    dosage: 'Usually initiated at 300mg once on day 1, twice on day 2, and thrice on day 3. Maintained typically between 900mg to 1800mg per day in divided doses.',
    sideEffects: [
      { name: 'Drowsiness & Somnolence', percentage: 21 },
      { name: 'Dizziness', percentage: 17 },
      { name: 'Peripheral Edema (Swelling)', percentage: 8 },
      { name: 'Ataxia (Loss of Balance)', percentage: 9 }
    ],
    warnings: [
      'May trigger severe central nervous system depression with profound breathing difficulties, especially when paired with opioid painkillers or alcohol.',
      'Do not discontinue abruptly, as sudden withdrawal can trigger acute epilepsy or state rebound.'
    ],
    interactions: [],
    riskLevel: 'High',
    pillColor: 'yellow',
    pillShape: 'capsule',
    imprint: 'G ABA 300'
  },
  {
    id: '9',
    name: 'Cetirizine',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Antihistamine (Second-Generation)',
    description: 'An oral second-generation antihistamine used to relieve seasonal and perennial allergic rhinitis, conjunctivitis, and chronic hives. Causes significantly less sedation than first-generation counterparts.',
    uses: [
      'Allergic Rhinitis (Runny Nose/Sneezing)',
      'Ocular Itching & Watering (Allergy Eyes)',
      'Chronic Idiopathic Urticaria (Hives)'
    ],
    dosage: '5mg to 10mg taken once daily, with or without food. Advised not to exceed 10mg per day.',
    sideEffects: [
      { name: 'Drowsiness (Mild)', percentage: 11 },
      { name: 'Xerostomia (Dry Mouth)', percentage: 6 },
      { name: 'Fatigue', percentage: 4 },
      { name: 'Pharyngitis', percentage: 3 }
    ],
    warnings: [
      'Be cautious operating machinery until you know how it affects your alertness.',
      'Avoid concurrent consumption of alcohol or central nervous system sedatives.'
    ],
    interactions: [],
    riskLevel: 'Low',
    pillColor: 'teal',
    pillShape: 'round',
    imprint: 'C 10'
  },
  {
    id: '10',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid (ASA)',
    category: 'Salicylate / Platelet Aggregation Inhibitor',
    description: 'A therapeutic antiplatelet agent, nonsteroidal anti-inflammatory, and analgesic. Used low-dose to prevent cardiovascular clot formation and high-dose to relieve paint/fever.',
    uses: [
      'Myocardial Infarction Prevention (81mg)',
      'Ischemic Stroke Prevention',
      'Acute Rheumatoid Inflammation (325mg+)',
      'Mild Joint or Structural Pain Relief'
    ],
    dosage: 'Cardioprotectant (low dose): 81mg once daily. Analgesic/Fever reducer: 325mg to 650mg every 4 hours, up to a maximum of 4000mg/day.',
    sideEffects: [
      { name: 'Dyspepsia (Stomach Burn)', percentage: 18 },
      { name: 'Easy Bruising', percentage: 12 },
      { name: 'Increased Bleeding Time', percentage: 14 },
      { name: 'Tinnitus (Ringing in Ears)', percentage: 5 }
    ],
    warnings: [
      'Never administer to children or adolescents recovering from viral infections (chickenpox, flu) due to the fatal risk of Reye Syndrome.',
      'Contraindicated in patients with bleeding disorders (haemophilia) or active peptic ulcers.',
      'Stop using 7-10 days before any planned surgical procedures.'
    ],
    interactions: [
      {
        withMedicineId: '2', // Ibuprofen
        severity: 'High',
        effect: 'Ibuprofen blocks Aspirins antiplatelet action, raising cardiac risk when taken concurrently. Both together multiply the risk of severe stomach bleeding.'
      },
      {
        withMedicineId: '5', // Lisinopril
        severity: 'Moderate',
        effect: 'Can reduce Lisinoprils serum drops and increase blood chemical metrics representing kidney risk.'
      }
    ],
    riskLevel: 'Medium',
    pillColor: 'slate',
    pillShape: 'round',
    imprint: 'BAYER 81'
  }
];
