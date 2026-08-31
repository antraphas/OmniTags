import React from 'react';
import { Download, Sparkles, Zap, ShieldCheck, ArrowRight, CheckCircle2, Star, MessageSquare } from 'lucide-react';

export default function Hero({ onOpenAvaliacao, onOpenFeedback }) {
  const downloadUrl = "https://ar8tdiwyhdpyyh2d.public.blob.vercel-storage.com/Downloads/OmniTag%202.6.rar";

  return (
    <section className="relative pt-10 pb-16 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-purple-600/10 blur-[130px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* Internal Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-inner">
          <Sparkles size={14} className="text-blue-400" />
          <span>Fase Beta Aberta • Suporte Anota.AI</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-[1.15]">
          OmniTag — Auxiliar de Categorização <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 gradient-text">
            e Suporte com Inteligência Artificial
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
          Extensão desenvolvida para apoiar os atendentes no <strong>Freshdesk</strong>, interpretando o contexto da conversa com o restaurante ou cliente e sugerindo as tags corretas com base na taxonomia oficial da <strong>Anota.AI</strong>.
        </p>

        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 group"
          >
            <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            <span>Baixar Extensão (.rar)</span>
          </a>

          <button
            onClick={onOpenAvaliacao}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/40 text-blue-200 font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span>Avaliar OmniTag ⭐</span>
          </button>

          <button
            onClick={onOpenFeedback}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/40 text-purple-200 font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <MessageSquare size={16} className="text-pink-400" />
            <span>Feedback / Relatar Bug 💬</span>
          </button>
        </div>

        {/* Link auxiliar */}
        <div className="mb-12">
          <a
            href="#instalacao"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors"
          >
            <span>Primeira vez aqui? Veja como instalar no navegador</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Quick Highlights / KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl text-left border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Agilidade no Atendimento</span>
              <Zap size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">~2 Segundos</div>
            <div className="text-xs text-slate-400 mt-1">Classificação rápida em 1 clique</div>
          </div>

          <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl text-left border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Assertividade</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">&gt; 92%</div>
            <div className="text-xs text-slate-400 mt-1">Calibrado com aprendizado contínuo</div>
          </div>

          <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl text-left border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Taxonomia Homologada</span>
              <ShieldCheck size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-1">140+ Tags</div>
            <div className="text-xs text-slate-400 mt-1">Descrições e regras corporativas</div>
          </div>
        </div>

      </div>
    </section>
  );
}
