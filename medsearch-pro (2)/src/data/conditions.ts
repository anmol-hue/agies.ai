/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HealthCondition } from '../types';

export const CONDITIONS_DB: HealthCondition[] = [
  {
    id: 'c1',
    name: 'Hypertension',
    description: 'A chronic medical condition where the force of the blood flowing against your artery walls is consistently too high. Often called the "silent killer" because it typically has no outward symptoms but can damage organs over time.',
    symptoms: [
      'Dizziness',
      'Headache (Occasional back-of-head)',
      'Shortness of Breath (Mild)',
      'Fatigue',
      'Blurry Vision'
    ],
    commonMedications: ['5', '10'], // Lisinopril, Aspirin (low dose for prevention)
    lifestyleTips: [
      'Adopt a low-sodium diet (under 1,500 mg per day) focusing on potassium-rich foods (DASH diet).',
      'Engage in 150 minutes of moderate-intensity aerobic exercise per week.',
      'Maintain a healthy weight and limit alcoholic beverages.',
      'Monitor blood pressure daily at the same times (morning and evening).'
    ],
    severity: 'Moderate',
    warningSigns: [
      'Severe headache accompanied by confusion',
      'Chest pain or pressure',
      'Difficulty speaking or one-sided body weakness',
      'Blood pressure readings exceeding 180/120 mmHg (Hypertensive Crisis)'
    ]
  },
  {
    id: 'c2',
    name: 'Type 2 Diabetes',
    description: 'A complex chronic metabolic disorder characterized by high blood glucose levels resulting from insulin resistance, where cells do not respond properly to insulin, and relative insulin deficiency.',
    symptoms: [
      'Frequent Urination (Polyuria)',
      'Excessive Thirst (Polydipsia)',
      'Fatigue',
      'Blurry Vision',
      'Unexplained Weight Loss',
      'Slow Healing Cuts/Bruises'
    ],
    commonMedications: ['4'], // Metformin
    lifestyleTips: [
      'Focus on complex high-fiber carbohydrates and eliminate refined sugars and sodas.',
      'Perform regular strength-resistance training to improve cell-level insulin sensitivity.',
      'Check feet daily for minor cuts or blisters to prevent neuropathic foot ulcers.',
      'Monitor blood glucose levels before meals and before sleeping.'
    ],
    severity: 'Severe',
    warningSigns: [
      'Extreme confusion or deep breathing (possible Diabetic Ketoacidosis)',
      'Fruity-smelling breath',
      'Loss of consciousness or profound dehydration',
      'Blood sugar readings staying over 250 mg/dL'
    ]
  },
  {
    id: 'c3',
    name: 'Asthma & Bronchospasm',
    description: 'A inflammatory disease of the airways of the lungs characterized by variable and recurring symptoms, reversible airflow obstruction, and easily triggered bronchospasms.',
    symptoms: [
      'Cough',
      'Wheezing (High-pitched whistling sound)',
      'Shortness of Breath',
      'Chest Tightness'
    ],
    commonMedications: ['6'], // Albuterol
    lifestyleTips: [
      'Identify and strictly avoid triggers such as dust mites, pollen, pet dander, mold, tobacco smoke, and extreme cold.',
      'Always carry your rescue inhaler (Albuterol) with you at all times.',
      'Learn how to use a peak flow meter to monitor bronchial capacity.',
      'Take long-term inhaled steroid controller medications daily if prescribed.'
    ],
    severity: 'Severe',
    warningSigns: [
      'Rescue inhaler provides zero relief after 2 separate uses during an attack',
      'Inability to speak in full sentences due to breathlessness',
      'Chest and ribs retracting heavily with breathing breaths',
      'Lips, tongue, or fingernails turning blue or gray'
    ]
  },
  {
    id: 'c4',
    name: 'Gastroesophageal Reflux Disease (GERD)',
    description: 'A digestive disorder occurring when stomach acid or stomach content repeatedly flows back into the esophagus, irritating the lining and causing heartburn and tissue irritation.',
    symptoms: [
      'Heartburn (Burning chest feeling)',
      'Acid Reflux (Regurgitation of food/sour liquid)',
      'Cough (Dry, chronic)',
      'Throat Clearing/Hoarseness',
      'Difficulty Swallowing'
    ],
    commonMedications: ['7'], // Omeprazole
    lifestyleTips: [
      'Avoid trigger foods including caffeine, chocolate, spicy dishes, garlic, onions, mint, and tomato-based products.',
      'Do not lie down within 3 hours after eating a meal.',
      'Elevate the head of your bed by 6 inches using block risers.',
      'Eat smaller, more frequent meals rather than large heavy dinners.'
    ],
    severity: 'Mild',
    warningSigns: [
      'Difficulty swallowing (dysphagia) or feeling like food is permanently stuck',
      'Vomiting blood or passing coffee-ground stools',
      'Unexplained significant weight loss',
      'Severe, constant chest pain radiating to shoulder or jaw'
    ]
  },
  {
    id: 'c5',
    name: 'Allergic Rhinitis & Sinus Congestion',
    description: 'An allergic response that triggers immune inflammation of the nasal lining, usually caused by pollen, dust, mold, or flakes of skin from certain animals.',
    symptoms: [
      'Sneezing',
      'Runny Nose',
      'Stuffy Nose/Congestion',
      'Itchy/Watery Eyes',
      'Itchy Throat'
    ],
    commonMedications: ['9'], // Cetirizine
    lifestyleTips: [
      'Keep windows closed during high-pollen seasons and use high-efficiency air filters.',
      'Wash bedding weekly in very hot water to neutralize domestic dust mites.',
      'Use saline nasal rinses daily to wash away accumulated allergens.',
      'Shower and change clothes after returning from prolonged outdoor trips.'
    ],
    severity: 'Mild',
    warningSigns: [
      'High fever or severe facial pain radiating behind eyes (may indicate secondary bacterial sinusitis)',
      'Difficulty breathing, swollen lips, or severe hives (can escalate to anaphylaxis)'
    ]
  },
  {
    id: 'c6',
    name: 'Osteoarthritis & Joint Inflammation',
    description: 'A degenerative joint disease ("wear and tear" arthritis) where the protective cartilage that cushions the ends of bones wears down over time, resulting in direct friction.',
    symptoms: [
      'Joint Pain',
      'Joint Stiffness (Particularly in mornings)',
      'Swelling or Tenderness in Hands/Knees',
      'Loss of Flexibility',
      'Grating Sensation when moving'
    ],
    commonMedications: ['2', '10'], // Ibuprofen, Aspirin
    lifestyleTips: [
      'Perform regular low-impact exercises such as swimming, cycling, or water aerobics to keep joints lubricated and supporting muscles strong.',
      'Apply moist heat to soothe stiff joints or cold packs to reduce acute swelling and inflammation.',
      'Maintain an optimal body weight to minimize load-bearing pressure on hips and knees.',
      'Use joint supportive wear (braces, shock-absorbing walking shoes) during high exertion.'
    ],
    severity: 'Moderate',
    warningSigns: [
      'Joint becomes hot, red, and swollen with high fever (suggests septic joint infection - emergency)',
      'Complete inability to bear weight or move the joint at all'
    ]
  },
  {
    id: 'c7',
    name: 'Chronic Neuropathic Pain',
    description: 'A difficult, chronic pain state caused by progressive damage, dysfunction, or injury to nerve fibers, causing hypersensitivity and phantom sensory firing.',
    symptoms: [
      'Numbness or Tingling',
      'Burning or Shooting pain sensations',
      'Pinprick sensations ("pins and needles")',
      'Extreme sensitivity to light touch (allodynia)'
    ],
    commonMedications: ['8'], // Gabapentin
    lifestyleTips: [
      'Carefully manage diabetic blood sugar levels to prevent further sensory neuropathic progression.',
      'Participate in professional physical therapy to improve localized nerve resilience.',
      'Avoid sitting or leaning in positions that compress major neural pathways for long periods.',
      'Engage in gentle sensory-integration techniques or warm baths.'
    ],
    severity: 'Severe',
    warningSigns: [
      'Sudden loss of bowel or bladder control (saddle anesthesia - possible cauda equina syndrome, requires surgery)',
      'Progressively rapid muscle weakness, loss of reflexes, or inability to lift foot'
    ]
  }
];

export const ALL_SYMPTOMS = Array.from(
  new Set(CONDITIONS_DB.flatMap((c) => c.symptoms))
).sort();
