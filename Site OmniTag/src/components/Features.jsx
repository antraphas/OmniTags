import React from 'react';
import { Shield, Brain, Sparkles, Layers, Cpu, Database, Network, Search } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      title: "Conformidade com a LGPD",
      desc: "Sanitização automática em tempo real que remove CPFs, CNPJs, e-mails, telefones e dados sensíveis antes de qualquer envio para a IA."
    },
    {
      icon: Network,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      title: "Motor em Cascata com Fallback",
      desc: "Fila de contingência com failover automático. Se uma API apresentar instabilidade, o sistema aciona o próximo modelo da lista."
    },
    {
      icon: Brain,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      title: "Aprendizado Contínuo com Feedback (🧠)",
      desc: "Quando o atendente corrige uma tag, a decisão é registrada e inserida como exemplo no prompt (Few-Shot) para calibrar os próximos atendimentos."
    },
    {
      icon: Layers,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: "Leitura de Shadow DOM no Freshdesk",
      desc: "Estratégias avançadas de leitura para interagir com os Web Components do Freshworks (fw-select, fw-tag e renderização visual)."
    },
    {
      icon: Search,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      title: "Histórico com Busca por ID do Chat",
      desc: "Extração do ID real da conversa (/conversation/ID) e campo de busca para localizar atendimentos facilmente."
    },
    {
      icon: Database,
      color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      title: "Backup & Restauração JSON",
      desc: "Permite exportar e importar configurações, chaves e aprendizado para sincronizar entre máquinas da equipe."
    }
  ];

  return (
    <section id="recursos" className="py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} /> Segurança & Engenharia
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Como a Extensão Opera nos Bastidores
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Arquitetura desenvolvida para garantir estabilidade, privacidade e precisão operacional no dia a dia do suporte.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 space-y-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${f.color}`}>
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
