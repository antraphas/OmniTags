import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DownloadSection from './components/DownloadSection';
import InstallGuide from './components/InstallGuide';
import UiDocumentation from './components/UiDocumentation';
import ApiSetupGuide from './components/ApiSetupGuide';
import ArchitectureSection from './components/ArchitectureSection';
import EngineAndSecurity from './components/EngineAndSecurity';
import MetricsAndLearning from './components/MetricsAndLearning';
import SopSection from './components/SopSection';
import Features from './components/Features';
import Footer from './components/Footer';
import AvaliacaoModal from './components/AvaliacaoModal';
import FeedbackModal from './components/FeedbackModal';
import AdminDashboard from './components/AdminDashboard';
import ChibiSupportWidget from './components/ChibiSupportWidget';

export default function App() {
  const [avaliacaoOpen, setAvaliacaoOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState('bug');
  const [adminOpen, setAdminOpen] = useState(false);

  const handleOpenFeedback = (category = 'bug') => {
    setFeedbackCategory(category);
    setFeedbackOpen(true);
  };

  // Escuta hash na URL ou parâmetros para abrir direto (#avaliacao, #feedback, #admin, /admin, ?page=admin)
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const pageParam = (params.get('page') || '').toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (hash === '#admin' || pageParam === 'admin' || pathname.includes('/admin')) {
        setAdminOpen(true);
      } else if (hash === '#avaliacao' || pageParam === 'avaliacao' || pathname.includes('/avaliacao')) {
        setAvaliacaoOpen(true);
      } else if (hash === '#feedback' || pageParam === 'feedback' || pathname.includes('/feedback')) {
        setFeedbackOpen(true);
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    return () => window.removeEventListener('hashchange', handleUrlRoute);
  }, []);

  // Trava scroll da página de fundo quando qualquer modal principal estiver aberto
  useEffect(() => {
    if (avaliacaoOpen || feedbackOpen || adminOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [avaliacaoOpen, feedbackOpen, adminOpen]);

  const closeAllModals = () => {
    setAvaliacaoOpen(false);
    setFeedbackOpen(false);
    setAdminOpen(false);
    if (window.location.hash === '#admin' || window.location.hash === '#avaliacao' || window.location.hash === '#feedback') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-300 font-sans relative selection:bg-blue-600/30 selection:text-white">
      
      {/* Background Dot Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenAvaliacao={() => setAvaliacaoOpen(true)}
          onOpenFeedback={() => setFeedbackOpen(true)}
          onOpenAdmin={() => setAdminOpen(true)}
        />
        
        <main className="flex-grow space-y-4">
          <Hero
            onOpenAvaliacao={() => setAvaliacaoOpen(true)}
            onOpenFeedback={() => setFeedbackOpen(true)}
          />
          <DownloadSection />
          <InstallGuide />
          <UiDocumentation />
          <ApiSetupGuide />
          <ArchitectureSection />
          <EngineAndSecurity />
          <MetricsAndLearning />
          <SopSection />
          <Features />
        </main>

        <Footer
          onOpenAvaliacao={() => setAvaliacaoOpen(true)}
          onOpenFeedback={() => setFeedbackOpen(true)}
          onOpenAdmin={() => setAdminOpen(true)}
        />
      </div>

      {/* Modais Interativos */}
      <AvaliacaoModal
        isOpen={avaliacaoOpen}
        onClose={closeAllModals}
      />

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={closeAllModals}
        initialCategory={feedbackCategory}
      />

      {adminOpen && (
        <AdminDashboard
          onClose={closeAllModals}
        />
      )}

      {/* Chibi de Suporte Flutuante & Smartphone Contact Modal */}
      <ChibiSupportWidget
        onOpenFeedback={handleOpenFeedback}
      />

    </div>
  );
}
