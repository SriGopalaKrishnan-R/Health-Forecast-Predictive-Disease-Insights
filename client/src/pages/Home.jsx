import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      title: 'Precision Predictor',
      description: 'Ensemble ML engine combining Random Forest, SVM, and XGBoost for high-accuracy disease detection.',
      icon: '🎯',
      link: '/predict'
    },
    {
      title: 'Health Dashboard',
      description: 'Visualize disease probabilities and symptom correlations with interactive charts.',
      icon: '📊',
      link: '/dashboard'
    },
    {
      title: 'Doctor Consultation',
      description: 'Get matched with the right specialist based on your predicted condition.',
      icon: '👨‍⚕️',
      link: '/consult'
    },
    {
      title: 'Medicine Engine',
      description: 'OTC recommendations with safety warnings and dosage information.',
      icon: '💊',
      link: '/pharmacy'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Precision Disease Detection
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Powered by Weighted Voting Ensemble (RF + SVM + XGBoost)
        </p>
        <p className="text-lg text-primary-600 font-medium mb-8">
          9 Diseases • 65 Symptoms • Clinical-Grade Accuracy
        </p>
        <Link
          to="/predict"
          className="inline-block px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:bg-primary-700 transition-colors no-underline text-lg"
        >
          Start Diagnosis
        </Link>
      </section>

      <section className="grid md:grid-cols-2 gap-6 pb-16">
        {features.map((feature, idx) => (
          <Link
            key={idx}
            to={feature.link}
            className="block p-6 bg-white rounded-2xl border border-gray-100 shadow-sm card-hover no-underline"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </section>

      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ensemble Architecture</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-primary-50 rounded-xl">
            <div className="text-3xl font-bold text-primary-700">RF</div>
            <div className="text-sm text-gray-600 mt-1">Random Forest</div>
            <div className="text-xs text-primary-600 mt-2">Weight: 2x • Non-linear feature selection</div>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-xl">
            <div className="text-3xl font-bold text-primary-700">SVM</div>
            <div className="text-sm text-gray-600 mt-1">Support Vector Machine</div>
            <div className="text-xs text-primary-600 mt-2">Weight: 1x • High-dimensional accuracy</div>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-xl">
            <div className="text-3xl font-bold text-primary-700">XGB</div>
            <div className="text-sm text-gray-600 mt-1">Gradient Boosting</div>
            <div className="text-xs text-primary-600 mt-2">Weight: 3x • Precision optimization</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
