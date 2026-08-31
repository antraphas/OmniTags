import React, { useState } from 'react';
import { Terminal, Maximize2, Sparkles, Sliders, Database, BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react';
import LightboxModal from './LightboxModal';

export default function UiDocumentation() {
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (src, title) => {
    setSelectedImage({ src, title });
  };

  return (
    <section id="telas" className="py-16 scroll-mt-24 space-y-16">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Terminal size={14} /> Guia Visual da Interface & Usabilidade
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Explicação Completa de Todas as Telas e Módulos
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Do widget em tempo real no Freshdesk ao painel administrativo de gestão e auditoria. <em>(Clique em qualquer imagem para expandir em tamanho original)</em>.
          </p>
        </div>

        {/* 1. O WIDGET DE OPERAÇÃO NO FRESHDESK */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-t-4 border-t-blue-500 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-comments text-blue-400"></i>
              <span>1. O Widget de Operação (A Visão do Atendente)</span>
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
              Injetado no CRM
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A interface primária do OmniTag não obriga o atendente a sair da tela de atendimento. Ela é injetada de forma não-intrusiva na barra lateral direita do Freshdesk / Freshchat.
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
            
            {/* Imagem do Widget */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div
                onClick={() => openLightbox("/Interface/Interface%20em%20funcionamento.fw.png", "Widget OmniTags em Funcionamento no Freshdesk")}
                className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2 cursor-zoom-in group max-w-[260px] w-full shadow-2xl"
              >
                <div className="absolute top-3 right-3 bg-slate-900/90 text-blue-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-700 flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Maximize2 size={11} /> Expandir
                </div>
                <img
                  src="/Interface/Interface%20em%20funcionamento.fw.png"
                  alt="Widget OmniTags em Funcionamento no Freshdesk"
                  className="max-h-[380px] w-auto mx-auto object-contain rounded-xl group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-[10px] text-slate-500 text-center mt-2 italic">
                Figura 1: Widget em funcionamento no Freshdesk.
              </div>
            </div>

            {/* Explicações do Widget */}
            <div className="md:col-span-7 space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">🔘 Botão "Ler Conversa":</strong>
                Gatilho principal. Com um único clique, extrai o texto do chat, aplica censura LGPD e despacha a requisição para a IA.
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">📟 Mini-Console Flutuante (Terminal):</strong>
                Exibe em tempo real os logs de conexão, provedor/modelo acionado e cronômetro de latência (ex: <code>⏱ 1.4s</code>).
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">🏷️ Pílulas de Sugestão (Badges):</strong>
                Botões azuis com as tags sugeridas. Basta clicar para que a tag seja imediatamente injetada no campo de tags do ticket.
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">🧠 Botão do Cérebro (Salvar Aprendizado):</strong>
                Utilizado quando o atendente precisa corrigir a IA, ensinando o sistema com o exemplo correto para os próximos chats.
              </div>
            </div>

          </div>
        </div>

        {/* 2. DASHBOARD ADMINISTRATIVO */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-t-4 border-t-emerald-500 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-emerald-400"></i>
              <span>2. O Dashboard Administrativo (Visão Gerencial & Métricas)</span>
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Métricas Consolidadas
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Acessado ao clicar no ícone da extensão no navegador, o painel principal entrega métricas consolidadas em tempo real sobre assertividade, histórico e consumo de tokens.
          </p>

          <div
            onClick={() => openLightbox("/Interface/tela1.png", "Dashboard Principal do OmniTag")}
            className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2 cursor-zoom-in group shadow-2xl"
          >
            <div className="absolute top-4 right-4 bg-slate-900/90 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-700 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Maximize2 size={12} /> Clique para expandir
            </div>
            <img
              src="/Interface/tela1.png"
              alt="Dashboard Principal do OmniTag"
              className="w-full h-auto rounded-xl group-hover:scale-[1.01] transition-transform"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs text-slate-300 pt-2">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <strong className="text-emerald-400 block mb-1">📊 Taxa de Assertividade:</strong>
              Mede a acurácia por atendimento (Acertos ao clicar vs Erros corrigidos com o botão 🧠).
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <strong className="text-blue-400 block mb-1">📋 Histórico de Chats:</strong>
              Armazena os links e IDs reais dos chats com busca instantânea no modal.
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <strong className="text-purple-400 block mb-1">📈 Gráfico de Tokens:</strong>
              Visualização comparativa da carga suportada por cada provedor (Gemini, Groq, etc.).
            </div>
          </div>
        </div>

        {/* 3. GESTÃO DE PROVEDORES */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-t-4 border-t-indigo-500 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders size={20} className="text-indigo-400" />
              <span>3. Gestão da Cascata: Telas de Configuração de Provedores</span>
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Alta Disponibilidade
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A aba de <strong>Configuração</strong> permite ligar ou desligar provedores através de interruptores (toggles), cadastrar múltiplas chaves e definir a lista prioritária de modelos:
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Gemini */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                <i className="fa-brands fa-google text-blue-400"></i> 3.1 Google Gemini
              </h4>
              <div
                onClick={() => openLightbox("/Interface/tela3.png", "Configuração do Provedor Google Gemini")}
                className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-1 cursor-zoom-in group shadow-lg"
              >
                <img src="/Interface/tela3.png" alt="Configuração Gemini" className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Gestão de múltiplas chaves de API, seleção de chave principal e modelos <code>gemini-2.5-flash</code>, <code>gemini-3.5-flash</code> e <code>gemini-3.1-flash-lite</code>.</p>
            </div>

            {/* Groq */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                <i className="fa-solid fa-bolt text-orange-400"></i> 3.2 Groq (LPU)
              </h4>
              <div
                onClick={() => openLightbox("/Interface/tela4.png", "Configuração do Provedor Groq Cloud LPU")}
                className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-1 cursor-zoom-in group shadow-lg"
              >
                <img src="/Interface/tela4.png" alt="Configuração Groq" className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Configuração de chaves Groq de ultra-baixa latência com modelos open-source Llama 3.3 70B e 3.1 8B.</p>
            </div>

            {/* OpenRouter */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                <i className="fa-solid fa-network-wired text-cyan-400"></i> 3.3 OpenRouter
              </h4>
              <div
                onClick={() => openLightbox("/Interface/tela5.png", "Configuração do Provedor OpenRouter Hub")}
                className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-1 cursor-zoom-in group shadow-lg"
              >
                <img src="/Interface/tela5.png" alt="Configuração OpenRouter" className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Hub agregador flexível com suporte a dezenas de modelos <code>:free</code> e open-source simultâneos.</p>
            </div>

            {/* Toqan */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                <i className="fa-solid fa-building-lock text-emerald-400"></i> 3.4 Toqan (iFood AI Platform)
              </h4>
              <div
                onClick={() => openLightbox("/Interface/tela6.png", "Configuração do Provedor Toqan iFood AI")}
                className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-1 cursor-zoom-in group shadow-lg"
              >
                <img src="/Interface/tela6.png" alt="Configuração Toqan" className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Suporte a ambientes internos corporativos com campo de Base URL customizada e polling assíncrono.</p>
            </div>

          </div>

          {/* Visão Geral dos Toggles */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-white font-bold text-xs mb-2">Visão Geral dos Interruptores Liga/Desliga (Toggles)</h4>
            <div
              onClick={() => openLightbox("/Interface/tela2.png", "Visão Geral dos Toggles de Configuração")}
              className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-1 cursor-zoom-in group shadow-lg"
            >
              <img src="/Interface/tela2.png" alt="Visão Geral dos Toggles de Configuração" className="w-full h-auto rounded-lg group-hover:scale-[1.01] transition-transform" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Permite ativar ou silenciar provedores inteiros com 1 clique, garantindo controle total da rotação de tráfego.</p>
          </div>
        </div>

        {/* 4. BACKUP E AUDITORIA DE APRENDIZADO */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-t-4 border-t-purple-500 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Database size={20} className="text-purple-400" />
              <span>4. O Cérebro: Backup e Histórico de Aprendizado</span>
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Memória Humana
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A aba de <strong>Backup</strong> preserva o capital intelectual gerado pela equipe. Toda vez que um atendente corrige a IA e clica no 🧠, o exemplo fica registrado na auditoria e pode ser exportado em JSON:
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-white font-bold text-xs">Exportação e Importação de Backup</h4>
              <div
                onClick={() => openLightbox("/Interface/tela7.png", "Exportação e Importação de Backup JSON")}
                className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-1 cursor-zoom-in group shadow-lg"
              >
                <img src="/Interface/tela7.png" alt="Backup e Restauração" className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Permite exportar todas as memórias, chaves e métricas em um arquivo JSON leve para compartilhamento com novas máquinas.</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-white font-bold text-xs">Log de Auditoria de Erros e Correções</h4>
              <div
                onClick={() => openLightbox("/Interface/tela8.png", "Log de Auditoria e Histórico de Correções RLHF")}
                className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-1 cursor-zoom-in group shadow-lg"
              >
                <img src="/Interface/tela8.png" alt="Histórico de Correções e RLHF" className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400">Contraste visual de tags erradas sugeridas pela IA (vermelho) contra a correção humana homologada (verde).</p>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={!!selectedImage}
        imageSrc={selectedImage?.src || ''}
        imageAlt={selectedImage?.title || ''}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
}
