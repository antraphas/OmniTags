import React, { useState } from 'react';
import {
  Download,
  Compass,
  Terminal,
  Key,
  Layers,
  Cpu,
  Brain,
  ClipboardList,
  Menu,
  X,
  Star,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ onOpenAvaliacao, onOpenFeedback, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const downloadUrl = "https://ar8tdiwyhdpyyh2d.public.blob.vercel-storage.com/Downloads/OmniTag%202.6.rar";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070b14]/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        
        {/* Logo oficial OmniTag */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            src="/icon.png"
            alt="OmniTag Logo"
            className="w-9 h-9 rounded-xl shadow-md group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="text-lg font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
              <span>OmniTag</span>
              <span className="text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 px-1.5 py-0.2 rounded border border-blue-500/20">
                v2.6 Beta
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Suporte Anota.AI
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-300">
          <a href="#instalacao" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <Compass size={13} /> Instalação
          </a>
          <a href="#telas" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <Terminal size={13} /> Telas & Uso
          </a>
          <a href="#setup-api" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <Key size={13} /> APIs
          </a>
          <a href="#arquitetura" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <Layers size={13} /> Arquitetura
          </a>
          <a href="#seguranca-engine" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <Cpu size={13} /> LGPD
          </a>
          <a href="#metricas-rlhf" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <Brain size={13} /> Métricas
          </a>
          <a href="#sop-operacao" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <ClipboardList size={13} /> SOP
          </a>
        </nav>

        {/* Botões de Ação na Direita */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Botão Avaliação */}
          <button
            onClick={onOpenAvaliacao}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all hover:scale-105 shadow-sm"
            title="Preencher Pesquisa de Desempenho do OmniTag"
          >
            <Star size={13} className="text-yellow-400 fill-yellow-400/40" />
            <span className="hidden sm:inline">Avaliar</span>
          </button>

          {/* Botão Feedback / Bugs */}
          <button
            onClick={onOpenFeedback}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all hover:scale-105 shadow-sm"
            title="Enviar Feedback, Bugs ou Ideias"
          >
            <MessageSquare size={13} className="text-purple-400" />
            <span className="hidden sm:inline">Feedback & Bugs</span>
          </button>

          {/* Botão Download */}
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Download size={13} />
            <span>Baixar (.rar)</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070b14] border-b border-slate-800 px-6 py-4 space-y-3 max-h-[80vh] overflow-y-auto text-sm">
          
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAvaliacao();
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold"
            >
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span>Avaliar OmniTag</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFeedback();
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-bold"
            >
              <MessageSquare size={14} />
              <span>Feedback & Bugs</span>
            </button>
          </div>

          <a href="#instalacao" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-xs">
            🧭 Guia de Instalação no Navegador
          </a>
          <a href="#telas" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-xs">
            🖥️ Interface e Telas da Extensão
          </a>
          <a href="#setup-api" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-xs">
            🔑 Como Conseguir as Chaves de API
          </a>
          <a href="#arquitetura" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-xs">
            🏗️ Arquitetura de Arquivos (tags_data.js)
          </a>
          <a href="#seguranca-engine" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-xs">
            ⚙️ Motor Fallback, LGPD e Shadow DOM
          </a>
          <a href="#metricas-rlhf" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-xs">
            🧠 Métricas e Histórico de Aprendizado
          </a>
          <a href="#sop-operacao" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-xs">
            📋 SOP do Atendente (Passo a Passo Diário)
          </a>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 font-mono"
            >
              <ShieldCheck size={13} />
              <span>Área do Gestor (Admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
