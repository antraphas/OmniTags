import React from 'react';
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

export default function App() {
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
        <Navbar />
        
        <main className="flex-grow space-y-4">
          <Hero />
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

        <Footer />
      </div>
    </div>
  );
}
