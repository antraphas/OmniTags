import React, { useState } from 'react';
import { Download, Compass, Terminal, Key, Layers, Cpu, Brain, ClipboardList, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const downloadUrl = "https://ar8tdiwyhdpyyh2d.public.blob.vercel-storage.com/Downloads/OmniTag%202.6.rar";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        
        {/* Logo oficial OmniTag */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            src="/icon.png"
            alt="OmniTag Logo"
            className="w-9 h-9 rounded-xl shadow-md group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="text-lg font-bold text-white tracking-tight leading-none">
              OmniTag
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Suporte Anota.AI
            </p>
          </div>
        </a>

        {/* Desktop Nav - Limpo e sem repetições */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a href="#instalacao" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Compass size={14} /> Instalação
          </a>
          <a href="#telas" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Terminal size={14} /> Telas & Uso
          </a>
          <a href="#setup-api" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Key size={14} /> Setup de APIs
          </a>
          <a href="#arquitetura" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Layers size={14} /> Arquitetura
          </a>
          <a href="#seguranca-engine" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Cpu size={14} /> Motor & LGPD
          </a>
          <a href="#metricas-rlhf" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Brain size={14} /> Métricas
          </a>
          <a href="#sop-operacao" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <ClipboardList size={14} /> SOP Atendente
          </a>
        </nav>

        {/* Botão de Download na direita */}
        <div className="flex items-center gap-3">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Download size={14} /> Baixar (.rar)
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070b14] border-b border-slate-800 px-6 py-4 space-y-3 max-h-[80vh] overflow-y-auto text-sm">
          <a href="#instalacao" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">
            🧭 Guia de Instalação no Navegador
          </a>
          <a href="#telas" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">
            🖥️ Interface e Telas da Extensão
          </a>
          <a href="#setup-api" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">
            🔑 Como Conseguir as Chaves de API
          </a>
          <a href="#arquitetura" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">
            🏗️ Arquitetura de Arquivos (tags_data.js)
          </a>
          <a href="#seguranca-engine" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">
            ⚙️ Motor Fallback, LGPD e Shadow DOM
          </a>
          <a href="#metricas-rlhf" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">
            🧠 Métricas e Histórico de Aprendizado
          </a>
          <a href="#sop-operacao" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">
            📋 SOP do Atendente (Passo a Passo Diário)
          </a>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm mt-4"
          >
            Baixar OmniTag (.rar)
          </a>
        </div>
      )}
    </header>
  );
}
