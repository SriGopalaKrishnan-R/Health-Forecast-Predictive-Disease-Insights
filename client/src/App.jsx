import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Dashboard from './pages/Dashboard';
import Consult from './pages/Consult';
import Pharmacy from './pages/Pharmacy';

function App() {
  return (
    <div className="min-h-screen bg-medical-white">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/consult" element={<Consult />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
