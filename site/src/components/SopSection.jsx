import React from 'react';
import { ClipboardList, Sparkles, Check, ArrowRight, MessageSquare } from 'lucide-react';

export default function SopSection() {
  const steps = [
    {
      num: 1,
      title: "Abra o Chat no Freshdesk",
      desc: "Acesse a conversa do cliente ou restaurante normalmente. O widget do OmniTag aparecerá injetado na lateral direita da tela.",
      badge: "Início",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    {
      num: 2,
      title: "Clique em 'Ler Conversa'",
      desc: "O Mini-Console Flutuante exibirá o tempo de resposta (~2s), o modelo ativo e as tags calculadas pela IA.",
      badge: "Inferência",
      badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
    },
    {
      num: 3,
      title: "Clique na Tag para Injetar",
      desc: "Ao clicar na pílula azul da tag sugerida, ela é imediatamente aplicada no campo oficial do CRM e o sistema registra 1 acerto.",
      badge: "+1 Acerto",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    {
      num: 4,
      title: "Errou? Ensine a IA no Cérebro (🧠)",
      desc: "Se nenhuma tag sugerida serviu, insira a tag correta manualmente no Freshdesk e clique no botão 🧠 para calibrar o modelo.",
      badge: "RLHF",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
  ];

  return (
    <section id="sop-operacao" className="py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ClipboardList size={14} /> Procedimento Operacional Padrão
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            SOP do Operador: Fluxo Diário de Atendimento
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Guia rápido de 4 etapas para qualquer atendente da equipe operar com velocidade máxima e assertividade.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {steps.map((step) => (
            <div key={step.num} className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-base border border-blue-500/30">
                    {step.num}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-white font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
