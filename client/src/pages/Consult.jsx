import { useState } from 'react';
import { getSpecialist } from '../services/api';

const SPECIALIST_DATA = {
  'Bronchial Asthma': { specialist: 'Pulmonologist', department: 'Pulmonology', icon: '🫁' },
  'Dengue': { specialist: 'Infectious Disease Specialist', department: 'Infectious Diseases', icon: '🦟' },
  'Infective Endocarditis': { specialist: 'Cardiologist', department: 'Cardiology', icon: '❤️' },
  'Ischaemic Heart Disease': { specialist: 'Cardiologist', department: 'Cardiology', icon: '🫀' },
  'Malaria': { specialist: 'Infectious Disease Specialist', department: 'Infectious Diseases', icon: '🔬' },
  'Meningitis': { specialist: 'Neurologist', department: 'Neurology', icon: '🧠' },
  'Myxoedema': { specialist: 'Endocrinologist', department: 'Endocrinology', icon: '🦋' },
  'Pneumonia': { specialist: 'Pulmonologist', department: 'Pulmonology', icon: '🫁' },
  'Rickets': { specialist: 'Orthopedic Surgeon / Pediatrician', department: 'Orthopedics', icon: '🦴' },
};

function Consult() {
  const [selectedDisease, setSelectedDisease] = useState(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Consultation</h1>
        <p className="text-gray-600 mt-2">Find the right specialist for your condition</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {Object.entries(SPECIALIST_DATA).map(([disease, info]) => (
          <button
            key={disease}
            onClick={() => setSelectedDisease(disease)}
            className={`p-4 rounded-xl border text-left transition-all card-hover ${
              selectedDisease === disease
                ? 'border-primary-400 bg-primary-50 shadow-md'
                : 'border-gray-100 bg-white hover:border-primary-200'
            }`}
          >
            <div className="text-2xl mb-2">{info.icon}</div>
            <h3 className="font-semibold text-gray-800 text-sm">{disease}</h3>
            <p className="text-xs text-gray-500 mt-1">{info.specialist}</p>
          </button>
        ))}
      </div>

      {selectedDisease && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-start gap-6">
            <div className="text-5xl">
              {SPECIALIST_DATA[selectedDisease].icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{selectedDisease}</h2>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 rounded-xl">
                  <div className="text-sm text-gray-500">Recommended Specialist</div>
                  <div className="text-lg font-bold text-primary-700 mt-1">
                    {SPECIALIST_DATA[selectedDisease].specialist}
                  </div>
                </div>
                <div className="p-4 bg-primary-50 rounded-xl">
                  <div className="text-sm text-gray-500">Department</div>
                  <div className="text-lg font-bold text-primary-700 mt-1">
                    {SPECIALIST_DATA[selectedDisease].department}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-yellow-800">Important Notice</span>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  This is an AI-generated recommendation. Always consult a qualified healthcare 
                  professional for accurate diagnosis and treatment. Do not self-medicate based 
                  solely on this prediction.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">What to Expect</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    Initial consultation and medical history review
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    Diagnostic tests as recommended by the specialist
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    Personalized treatment plan
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    Follow-up schedule and monitoring
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Consult;
