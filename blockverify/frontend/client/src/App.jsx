// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Dashboard from './pages/Dashboard';
import ContactPage from './pages/ContactPage';
import CodePage from './pages/CodePage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Features />
                <HowItWorks />
              </>
            } />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/code" element={<CodePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;