import React from 'react';
import { Key, ExternalLink, Sparkles, CheckCircle2, Shield, Zap } from 'lucide-react';

export default function ApiSetupGuide() {
  return (
    <section id="setup-api" className="py-16 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Key size={14} /> Guia de Chaves de API
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Como Conseguir suas Chaves de IA Gratuitas
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            O OmniTag precisa de pelo menos uma chave de API para funcionar. Obtenha em menos de 2 minutos sem custo.
          </p>
        </div>

        {/* 3 Provider Setup Cards */}
        <div className="space-y-6">
          
          {/* 1. Google Gemini */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-t-4 border-t-blue-500">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl">
                  <i className="fa-brands fa-google"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">1. Google Gemini (Padrão Recomendado)</h3>
                  <p className="text-xs text-slate-400">Janela de 1M+ tokens, alta velocidade e limite gratuito generoso</p>
                </div>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all hover:scale-105"
              >
                <span>Acessar Google AI Studio</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="grid sm:grid-cols-4 gap-3 text-xs text-slate-300 mb-4">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-blue-400 block mb-1">Passo 1:</strong>
                Acesse o Google AI Studio com sua conta Google.
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-blue-400 block mb-1">Passo 2:</strong>
                Clique no botão azul <strong>"Create API key"</strong>.
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-blue-400 block mb-1">Passo 3:</strong>
                Copie a chave gerada (<code className="text-blue-300">AIzaSy...</code>).
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-blue-400 block mb-1">Passo 4:</strong>
                Cole na aba de <strong>Configuração</strong> do OmniTag e salve.
              </div>
            </div>

            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
              <span className="text-white font-semibold">Modelos disponíveis:</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-blue-300 text-[11px]">gemini-2.5-flash</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-blue-300 text-[11px]">gemini-3.5-flash</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-blue-300 text-[11px]">gemini-3.1-flash-lite</span>
            </div>
          </div>

          {/* 2. Groq Cloud */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-t-4 border-t-orange-500">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xl">
                  <i className="fa-solid fa-bolt-lightning"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">2. Groq Cloud (Processamento LPU)</h3>
                  <p className="text-xs text-slate-400">Velocidade extrema de resposta (&lt; 1 segundo) com modelos Llama</p>
                </div>
              </div>

              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-orange-300 text-xs font-bold transition-all hover:scale-105"
              >
                <span>Acessar Console Groq</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="grid sm:grid-cols-4 gap-3 text-xs text-slate-300 mb-4">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Passo 1:</strong>
                Crie sua conta no Console do Groq.
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Passo 2:</strong>
                Vá até a aba <strong>API Keys</strong> e crie uma nova chave.
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Passo 3:</strong>
                Copie a chave gerada (<code className="text-orange-300">gsk_...</code>).
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-orange-400 block mb-1">Passo 4:</strong>
                Cole no campo Groq do OmniTag e clique em salvar.
              </div>
            </div>

            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
              <span className="text-white font-semibold">Modelos disponíveis:</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-orange-300 text-[11px]">llama-3.3-70b-versatile</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-orange-300 text-[11px]">llama-3.1-8b-instant</span>
            </div>
          </div>

          {/* 3. OpenRouter */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-t-4 border-t-cyan-500">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl">
                  <i className="fa-solid fa-network-wired"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">3. OpenRouter (Modelos Gratuitos)</h3>
                  <p className="text-xs text-slate-400">Hub agregador flexível com dezenas de modelos :free</p>
                </div>
              </div>

              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all hover:scale-105"
              >
                <span>Acessar OpenRouter Keys</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-300 mb-4">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-cyan-400 block mb-1">Passo 1:</strong>
                Crie sua conta no OpenRouter.ai.
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-cyan-400 block mb-1">Passo 2:</strong>
                Na aba Keys, gere uma chave que começa com <code className="text-cyan-300">sk-or-v1-...</code>.
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-cyan-400 block mb-1">Passo 3:</strong>
                Cole no OmniTag e ative os modelos gratuitos <code>:free</code>.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
