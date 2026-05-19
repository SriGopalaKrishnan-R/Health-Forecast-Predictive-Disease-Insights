const Doctor = require('../models/Doctor');

const SPECIALIST_MAP = {
  'Bronchial Asthma': { specialist: 'Pulmonologist', department: 'Pulmonology' },
  'Dengue': { specialist: 'Infectious Disease Specialist', department: 'Infectious Diseases' },
  'Infective Endocarditis': { specialist: 'Cardiologist', department: 'Cardiology' },
  'Ischaemic Heart Disease': { specialist: 'Cardiologist', department: 'Cardiology' },
  'Malaria': { specialist: 'Infectious Disease Specialist', department: 'Infectious Diseases' },
  'Meningitis': { specialist: 'Neurologist', department: 'Neurology' },
  'Myxoedema': { specialist: 'Endocrinologist', department: 'Endocrinology' },
  'Pneumonia': { specialist: 'Pulmonologist', department: 'Pulmonology' },
  'Rickets': { specialist: 'Orthopedic Surgeon / Pediatrician', department: 'Orthopedics' },
};

const MEDICINE_MAP = {
  'Bronchial Asthma': {
    medications: [
      { name: 'Salbutamol Inhaler', type: 'Bronchodilator', dosage: '2 puffs as needed' },
      { name: 'Montelukast', type: 'Leukotriene Modifier', dosage: '10mg once daily' },
      { name: 'Budesonide Inhaler', type: 'Corticosteroid', dosage: '200mcg twice daily' }
    ],
    warning: 'Do not exceed recommended inhaler doses. Seek emergency care if symptoms worsen rapidly.'
  },
  'Dengue': {
    medications: [
      { name: 'Paracetamol', type: 'Antipyretic', dosage: '500mg every 6 hours' },
      { name: 'ORS (Oral Rehydration Salt)', type: 'Hydration', dosage: 'As needed' }
    ],
    warning: 'AVOID aspirin and ibuprofen (risk of bleeding). Monitor platelet count. Seek hospital care if bleeding occurs.'
  },
  'Infective Endocarditis': {
    medications: [
      { name: 'Penicillin G', type: 'Antibiotic', dosage: 'IV as prescribed' },
      { name: 'Gentamicin', type: 'Aminoglycoside', dosage: 'As prescribed by cardiologist' }
    ],
    warning: 'Requires IV antibiotics for 4-6 weeks. Self-medication is dangerous. Immediate hospitalization recommended.'
  },
  'Ischaemic Heart Disease': {
    medications: [
      { name: 'Aspirin', type: 'Antiplatelet', dosage: '75-150mg once daily' },
      { name: 'Atorvastatin', type: 'Statin', dosage: '20-40mg once daily' },
      { name: 'Nitroglycerin', type: 'Vasodilator', dosage: 'Sublingual as needed for chest pain' }
    ],
    warning: 'Call emergency services immediately for acute chest pain. Do not delay hospital visit.'
  },
  'Malaria': {
    medications: [
      { name: 'Chloroquine', type: 'Antimalarial', dosage: 'As prescribed by physician' },
      { name: 'Artemisinin-based Combination Therapy (ACT)', type: 'Antimalarial', dosage: '3-day course' },
      { name: 'Paracetamol', type: 'Antipyretic', dosage: '500mg every 6 hours for fever' }
    ],
    warning: 'Complete the full course of antimalarials. Drug resistance is a concern—follow doctor guidance.'
  },
  'Meningitis': {
    medications: [
      { name: 'Ceftriaxone', type: 'Antibiotic', dosage: 'IV as prescribed' },
      { name: 'Dexamethasone', type: 'Corticosteroid', dosage: 'Before/with first antibiotic dose' }
    ],
    warning: 'MEDICAL EMERGENCY. Requires immediate hospitalization and IV antibiotics. Do not self-medicate.'
  },
  'Myxoedema': {
    medications: [
      { name: 'Levothyroxine', type: 'Thyroid Hormone', dosage: '25-200mcg daily (titrated)' }
    ],
    warning: 'Lifelong medication required. Regular thyroid function tests needed. Do not stop abruptly.'
  },
  'Pneumonia': {
    medications: [
      { name: 'Amoxicillin', type: 'Antibiotic', dosage: '500mg three times daily for 5-7 days' },
      { name: 'Azithromycin', type: 'Macrolide Antibiotic', dosage: '500mg day 1, then 250mg for 4 days' },
      { name: 'Paracetamol', type: 'Antipyretic', dosage: '500mg every 6 hours for fever' }
    ],
    warning: 'Complete the full antibiotic course. Seek emergency care for severe breathlessness or high fever.'
  },
  'Rickets': {
    medications: [
      { name: 'Vitamin D3 (Cholecalciferol)', type: 'Vitamin Supplement', dosage: '1000-5000 IU daily' },
      { name: 'Calcium Carbonate', type: 'Mineral Supplement', dosage: '500-1000mg daily' }
    ],
    warning: 'Ensure adequate sunlight exposure. Regular follow-up for bone density monitoring.'
  }
};

const getSpecialist = (req, res) => {
  const { disease } = req.query;

  if (!disease) {
    return res.json({ success: true, data: SPECIALIST_MAP });
  }

  const specialist = SPECIALIST_MAP[disease];
  if (!specialist) {
    return res.status(404).json({ error: `No specialist mapping found for: ${disease}` });
  }

  res.json({ success: true, data: { disease, ...specialist } });
};

const getMedicine = (req, res) => {
  const { disease } = req.query;

  if (!disease) {
    return res.json({ success: true, data: MEDICINE_MAP });
  }

  const medicine = MEDICINE_MAP[disease];
  if (!medicine) {
    return res.status(404).json({ error: `No medicine data found for: ${disease}` });
  }

  res.json({ success: true, data: { disease, ...medicine } });
};

const getDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;
    const filter = specialization ? { specialization } : {};
    const doctors = await Doctor.find(filter);
    res.json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

module.exports = { getSpecialist, getMedicine, getDoctors };
