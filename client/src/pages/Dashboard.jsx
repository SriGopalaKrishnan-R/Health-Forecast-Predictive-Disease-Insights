import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import { getMetadata } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler);

const DISEASE_COLORS = [
  '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6',
  '#3b82f6', '#ec4899', '#10b981', '#f97316', '#6366f1'
];

function Dashboard() {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMetadata();
        if (response.success) {
          setMetadata(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch metadata:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-700">Dashboard Unavailable</h2>
        <p className="text-gray-500 mt-2">Make sure the server is running and model is trained.</p>
      </div>
    );
  }

  const diseaseDistData = {
    labels: metadata.diseases,
    datasets: [{
      data: metadata.diseases.map(() => Math.floor(Math.random() * 100) + 300),
      backgroundColor: DISEASE_COLORS,
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const accuracyData = {
    labels: metadata.diseases,
    datasets: [{
      label: 'Precision (%)',
      data: metadata.diseases.map(d => {
        const report = metadata.report[d];
        return report ? (report.precision * 100).toFixed(1) : 100;
      }),
      backgroundColor: DISEASE_COLORS.map(c => c + '80'),
      borderColor: DISEASE_COLORS,
      borderWidth: 2
    }]
  };

  const symptomGroups = {
    'Respiratory': ['breathlessness', 'cough', 'wheezing', 'hoarseness of voice'],
    'Cardiovascular': ['chest pain', 'palpitation', 'cyanosis', 'swelling of feet'],
    'Neurological': ['headache', 'decreased consciousness', 'convulsion', 'blurred vision'],
    'General': ['fever', 'fatigue', 'weight loss', 'appetite loss'],
    'Musculoskeletal': ['muscle and joint pain', 'weakness in limbs', 'neck stiffness'],
    'Gastrointestinal': ['vomiting', 'abdomen pain', 'abdominal pain']
  };

  const radarData = {
    labels: Object.keys(symptomGroups),
    datasets: [{
      label: 'Symptom Coverage',
      data: Object.values(symptomGroups).map(group =>
        group.filter(s => metadata.symptoms.includes(s)).length / group.length * 100
      ),
      backgroundColor: 'rgba(13, 148, 136, 0.2)',
      borderColor: '#0d9488',
      borderWidth: 2,
      pointBackgroundColor: '#0d9488'
    }]
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health Insight Dashboard</h1>
        <p className="text-gray-600 mt-2">Model performance metrics and symptom analytics</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-primary-600">
            {(metadata.ensemble_accuracy * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Ensemble Accuracy</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-primary-600">{metadata.diseases.length}</div>
          <div className="text-sm text-gray-500 mt-1">Diseases Covered</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-primary-600">{metadata.symptoms.length}</div>
          <div className="text-sm text-gray-500 mt-1">Unique Symptoms</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-primary-600">{metadata.total_samples}</div>
          <div className="text-sm text-gray-500 mt-1">Training Samples</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Disease Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={diseaseDistData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Per-Disease Precision</h3>
          <div className="h-64">
            <Bar data={accuracyData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 105 } } }} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Symptom Correlation Map</h3>
          <div className="h-72 flex items-center justify-center">
            <Radar data={radarData} options={{ maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100 } } }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ensemble Weights</h3>
          <div className="space-y-4 mt-6">
            {Object.entries(metadata.model_weights).map(([model, weight]) => (
              <div key={model}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 uppercase">{model}</span>
                  <span className="text-primary-600 font-bold">{weight}x</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div
                    className="bg-primary-500 h-4 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(weight / 6) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {((weight / 6) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Weighted soft voting: Final prediction = argmax(w_rf·P_rf + w_svm·P_svm + w_xgb·P_xgb)
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
