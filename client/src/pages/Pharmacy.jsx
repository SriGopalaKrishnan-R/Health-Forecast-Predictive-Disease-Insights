import { useState } from 'react';

const MEDICINE_DATA = {
  'Bronchial Asthma': {
    medications: [
      { name: 'Salbutamol Inhaler', type: 'Bronchodilator', dosage: '2 puffs as needed', otc: true },
      { name: 'Montelukast', type: 'Leukotriene Modifier', dosage: '10mg once daily', otc: false },
      { name: 'Budesonide Inhaler', type: 'Corticosteroid', dosage: '200mcg twice daily', otc: false }
    ],
    warning: 'Do not exceed recommended inhaler doses. Seek emergency care if symptoms worsen rapidly.',
    lifestyle: ['Avoid allergens and smoke', 'Use peak flow meter regularly', 'Keep rescue inhaler accessible']
  },
  'Dengue': {
    medications: [
      { name: 'Paracetamol', type: 'Antipyretic', dosage: '500mg every 6 hours', otc: true },
      { name: 'ORS (Oral Rehydration Salt)', type: 'Hydration', dosage: 'As needed', otc: true }
    ],
    warning: 'AVOID aspirin and ibuprofen (risk of bleeding). Monitor platelet count. Seek hospital care if bleeding occurs.',
    lifestyle: ['Stay hydrated with fluids', 'Complete bed rest', 'Monitor for warning signs (abdominal pain, persistent vomiting)']
  },
  'Infective Endocarditis': {
    medications: [
      { name: 'Penicillin G', type: 'Antibiotic', dosage: 'IV as prescribed', otc: false },
      { name: 'Gentamicin', type: 'Aminoglycoside', dosage: 'As prescribed by cardiologist', otc: false }
    ],
    warning: 'Requires IV antibiotics for 4-6 weeks. Self-medication is dangerous. Immediate hospitalization recommended.',
    lifestyle: ['Strict adherence to antibiotic schedule', 'Regular blood cultures', 'Dental hygiene maintenance']
  },
  'Ischaemic Heart Disease': {
    medications: [
      { name: 'Aspirin', type: 'Antiplatelet', dosage: '75-150mg once daily', otc: true },
      { name: 'Atorvastatin', type: 'Statin', dosage: '20-40mg once daily', otc: false },
      { name: 'Nitroglycerin', type: 'Vasodilator', dosage: 'Sublingual as needed for chest pain', otc: false }
    ],
    warning: 'Call emergency services immediately for acute chest pain. Do not delay hospital visit.',
    lifestyle: ['Low-fat, low-sodium diet', 'Regular moderate exercise', 'Stress management', 'Quit smoking']
  },
  'Malaria': {
    medications: [
      { name: 'Chloroquine', type: 'Antimalarial', dosage: 'As prescribed by physician', otc: false },
      { name: 'Artemisinin-based Combination Therapy', type: 'Antimalarial', dosage: '3-day course', otc: false },
      { name: 'Paracetamol', type: 'Antipyretic', dosage: '500mg every 6 hours for fever', otc: true }
    ],
    warning: 'Complete the full course of antimalarials. Drug resistance is a concern—follow doctor guidance.',
    lifestyle: ['Use mosquito nets', 'Apply insect repellent', 'Eliminate standing water sources']
  },
  'Meningitis': {
    medications: [
      { name: 'Ceftriaxone', type: 'Antibiotic', dosage: 'IV as prescribed', otc: false },
      { name: 'Dexamethasone', type: 'Corticosteroid', dosage: 'Before/with first antibiotic dose', otc: false }
    ],
    warning: 'MEDICAL EMERGENCY. Requires immediate hospitalization and IV antibiotics. Do not self-medicate.',
    lifestyle: ['Immediate medical attention required', 'Vaccination for prevention', 'Contact tracing for close contacts']
  },
  'Myxoedema': {
    medications: [
      { name: 'Levothyroxine', type: 'Thyroid Hormone', dosage: '25-200mcg daily (titrated)', otc: false }
    ],
    warning: 'Lifelong medication required. Regular thyroid function tests needed. Do not stop abruptly.',
    lifestyle: ['Take medication on empty stomach', 'Regular thyroid function tests', 'Maintain balanced iodine intake']
  },
  'Pneumonia': {
    medications: [
      { name: 'Amoxicillin', type: 'Antibiotic', dosage: '500mg three times daily for 5-7 days', otc: false },
      { name: 'Azithromycin', type: 'Macrolide Antibiotic', dosage: '500mg day 1, then 250mg for 4 days', otc: false },
      { name: 'Paracetamol', type: 'Antipyretic', dosage: '500mg every 6 hours for fever', otc: true }
    ],
    warning: 'Complete the full antibiotic course. Seek emergency care for severe breathlessness or high fever.',
    lifestyle: ['Rest and adequate fluid intake', 'Breathing exercises', 'Annual flu vaccination']
  },
  'Rickets': {
    medications: [
      { name: 'Vitamin D3 (Cholecalciferol)', type: 'Vitamin Supplement', dosage: '1000-5000 IU daily', otc: true },
      { name: 'Calcium Carbonate', type: 'Mineral Supplement', dosage: '500-1000mg daily', otc: true }
    ],
    warning: 'Ensure adequate sunlight exposure. Regular follow-up for bone density monitoring.',
    lifestyle: ['15-30 minutes of sunlight daily', 'Calcium-rich diet (milk, cheese, leafy greens)', 'Regular bone density scans']
  }
};

function Pharmacy() {
  const [selectedDisease, setSelectedDisease] = useState(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medicine Engine</h1>
        <p className="text-gray-600 mt-2">OTC recommendations and medication guidance</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Condition</label>
        <select
          value={selectedDisease || ''}
          onChange={(e) => setSelectedDisease(e.target.value || null)}
          className="w-full md:w-96 p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Choose a disease...</option>
          {Object.keys(MEDICINE_DATA).map(disease => (
            <option key={disease} value={disease}>{disease}</option>
          ))}
        </select>
      </div>

      {selectedDisease && (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-red-800">Safety Warning</span>
            </div>
            <p className="text-sm text-red-700">{MEDICINE_DATA[selectedDisease].warning}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Medications for {selectedDisease}
            </h2>
            <div className="space-y-3">
              {MEDICINE_DATA[selectedDisease].medications.map((med, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{med.name}</h3>
                      {med.otc ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">OTC</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">Prescription</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{med.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary-700">{med.dosage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Lifestyle Recommendations</h3>
            <ul className="space-y-2">
              {MEDICINE_DATA[selectedDisease].lifestyle.map((tip, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              <strong>Disclaimer:</strong> Consult a doctor before taking any medication if symptoms persist 
              beyond 48 hours. This information is for educational purposes only and does not replace 
              professional medical advice.
            </p>
          </div>
        </div>
      )}

      {!selectedDisease && (
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(MEDICINE_DATA).map(([disease, data]) => (
            <button
              key={disease}
              onClick={() => setSelectedDisease(disease)}
              className="p-4 bg-white rounded-xl border border-gray-100 text-left card-hover hover:border-primary-200"
            >
              <h3 className="font-semibold text-gray-800 text-sm">{disease}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {data.medications.length} medication{data.medications.length > 1 ? 's' : ''} • 
                {data.medications.filter(m => m.otc).length} OTC
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Pharmacy;
