import React, { useState } from 'react';
import { Terminal, Maximize2, Sparkles, Check, Database, Sliders, BarChart3 } from 'lucide-react';
import LightboxModal from './LightboxModal';

export default function UiGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const screens = [
    {
      title: "1. O Widget no Freshdesk (Visão do Atendente)",
      tag: "Injetado no CRM",
      desc: "Console flutuante com status da inferência, tempo de resposta e botões de injeção em 1 clique.",
      src: "/Interface/Interface%20em%20funcionamento.fw.png",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      vertical: true
    },
    {
      title: "2. Dashboard de Gestão e Métricas",
      tag: "Métricas em Tempo Real",
      desc: "Assertividade por atendimento, histórico de chats pesquisável e distribuição de tokens por provedor.",
      src: "/Interface/tela1.png",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      vertical: false
    },
    {
      title: "3. Visão Geral de Provedores & Toggles",
      tag: "Alta Disponibilidade",
      desc: "Interruptores liga/desliga para controle granular da fila de contingência da IA.",
      src: "/Interface/tela2.png",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      vertical: false
    },
    {
      title: "4. Configuração Google Gemini (Multi-Keys)",
      tag: "Provedor Padrão",
      desc: "Múltiplas chaves API com rotação automática e modelos gemini-2.5-flash, gemini-3.5-flash e 3.1-flash-lite.",
      src: "/Interface/tela3.png",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      vertical: false
    },
    {
      title: "5. Configuração Groq Cloud LPU",
      tag: "Velocidade Extrema",
      desc: "Processamento ultra-rápido com latência sub-segundo em modelos Llama 3.3 70B e Llama 3.1 8B.",
      src: "/Interface/tela4.png",
      badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      vertical: false
    },
    {
      title: "6. Configuração OpenRouter Hub",
      tag: "Modelos Gratuitos :free",
      desc: "Acesso a dezenas de modelos open-source gratuitos sem custo de infraestrutura.",
      src: "/Interface/tela5.png",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      vertical: false
    },
    {
      title: "7. Toqan (iFood AI Platform)",
      tag: "Base URL Corporativa",
      desc: "Integração com endpoint corporativo dedicado e polling assíncrono.",
      src: "/Interface/tela6.png",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      vertical: false
    },
    {
      title: "8. Central de Backup JSON",
      tag: "Portabilidade Total",
      desc: "Exportação e importação de todo o aprendizado humano e configurações para sincronizar com o time.",
      src: "/Interface/tela7.png",
      badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      vertical: false
    },
    {
      title: "9. Auditoria de Aprendizado Humano (RLHF)",
      tag: "Feedback Loop",
      desc: "Gabarito comparativo com sugestão da IA em vermelho contra a correção humana confirmada em verde.",
      src: "/Interface/tela8.png",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      vertical: false
    }
  ];

  return (
    <section id="telas" className="py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Terminal size={14} /> Galeria da Interface
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Visão Geral de Todas as Telas
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Clique em qualquer captura de tela para expandir em tela cheia e tamanho original.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screens.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage({ src: item.src, title: item.title })}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                    {item.tag}
                  </span>
                  <div className="text-slate-500 group-hover:text-blue-400 flex items-center gap-1 text-[11px] font-semibold transition-colors">
                    <Maximize2 size={13} />
                    <span>Ampliar</span>
                  </div>
                </div>

                <h3 className="text-white font-bold text-sm mb-1.5 group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              {/* Thumbnail Container */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 aspect-video flex items-center justify-center">
                <img
                  src={item.src}
                  alt={item.title}
                  className={`w-full h-full ${item.vertical ? 'object-contain max-h-[160px]' : 'object-cover'} group-hover:scale-105 transition-transform duration-300`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors flex items-center justify-center"></div>
              </div>
            </div>
          ))}
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
