import { useState, useEffect } from 'react';
import { predictDisease, getMetadata } from '../services/api';

function Prediction() {
  const [symptoms, setSymptoms] = useState({});
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await getMetadata();
        if (response.success) {
          setAllSymptoms(response.data.symptoms);
          const initial = {};
          response.data.symptoms.forEach(s => { initial[s] = 0; });
          setSymptoms(initial);
        }
      } catch (err) {
        setError('Failed to load symptom data. Make sure the server is running.');
      }
    };
    fetchMetadata();
  }, []);

  const handleSliderChange = (symptom, value) => {
    setSymptoms(prev => ({ ...prev, [symptom]: parseInt(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const activeSymptoms = {};
    Object.entries(symptoms).forEach(([key, val]) => {
      if (val > 0) activeSymptoms[key] = val;
    });

    if (Object.keys(activeSymptoms).length === 0) {
      setError('Please set at least one symptom intensity above 0.');
      setLoading(false);
      return;
    }

    try {
      const response = await predictDisease(activeSymptoms);
      if (response.success) {
        setResult(response.data);
      } else {
        setError('Prediction failed.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction request failed. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const reset = {};
    allSymptoms.forEach(s => { reset[s] = 0; });
    setSymptoms(reset);
    setResult(null);
    setError(null);
  };

  const activeCount = Object.values(symptoms).filter(v => v > 0).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Precision Predictor</h1>
        <p className="text-gray-600 mt-2">Set symptom intensities (0-100) for accurate disease prediction</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Symptom Input ({activeCount} active)
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Reset All
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
              {allSymptoms.map(symptom => (
                <div
                  key={symptom}
                  className={`p-3 rounded-lg border transition-colors ${
                    symptoms[symptom] > 0 ? 'border-primary-300 bg-primary-50' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {symptom}
                    </label>
                    <span className={`text-xs font-bold ${
                      symptoms[symptom] > 60 ? 'text-red-600' :
                      symptoms[symptom] > 30 ? 'text-yellow-600' : 'text-gray-400'
                    }`}>
                      {symptoms[symptom]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={symptoms[symptom] || 0}
                    onChange={(e) => handleSliderChange(symptom, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3 bg-primary-600 text-white font-semibold rounded-xl shadow-md hover:bg-primary-700 disabled:opacity-50 transition-all"
            >
              {loading ? 'Analyzing...' : 'Run Precision Analysis'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          {result ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 precision-glow">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Precision Insight</h2>

              <div className="text-center p-4 bg-primary-50 rounded-xl mb-4">
                <div className="text-sm text-gray-600">Predicted Disease</div>
                <div className="text-2xl font-bold text-primary-700 mt-1">{result.prediction}</div>
                <div className="text-lg font-semibold text-primary-600 mt-1">
                  {result.confidence.toFixed(1)}% confidence
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">All Probabilities</h3>
                <div className="space-y-2">
                  {Object.entries(result.all_probabilities).map(([disease, prob]) => (
                    <div key={disease}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{disease}</span>
                        <span className="font-medium">{prob.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all"
                          style={{ width: `${prob}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Key Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {result.top_symptoms.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {s.symptom}: {s.intensity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Ensemble Reasoning</h3>
                <p className="text-xs text-gray-600">{result.reasoning}</p>
              </div>

              <div className="mt-4 text-center text-xs text-gray-400">
                Model Accuracy: {result.model_accuracy.toFixed(1)}%
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="text-6xl mb-4 opacity-30">🩺</div>
              <h3 className="text-lg font-medium text-gray-500">Awaiting Analysis</h3>
              <p className="text-sm text-gray-400 mt-2">
                Set symptom intensities and click "Run Precision Analysis" to get predictions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Prediction;
