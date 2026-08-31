import React from 'react';
import { Layers, FileCode, CheckCircle2, ShieldCheck, Sparkles, Copy, Check } from 'lucide-react';

export default function ArchitectureSection() {
  const [copiedCode, setCopiedCode] = React.useState(false);

  const tagsDataCode = `// Exemplo real de matriz em tags_data.js:
const tagsData = [
  {
    "name": "suporte-pedido",
    "description": "Utilizar nos casos onde pedidos são verificados. Ajustes na configuração dos pedidos, status ou problemas com entregas."
  },
  {
    "name": "ifoodpago-crédito",
    "description": "Utilizar nos casos de questionamentos sobre repasses relacionados ao crédito ou antecipações financeiras."
  },
  {
    "name": "redesign-kanban",
    "description": "Utilizar quando o restaurante solicitar migração, ajustes ou suporte no novo layout do Kanban de pedidos."
  }
  // ... mais de 140 tags corporativas estruturadas
];`;

  const copyCode = () => {
    navigator.clipboard.writeText(tagsDataCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="arquitetura" className="py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Arquitetura de Módulos e Arquivos Reais
            </h2>
            <p className="text-xs text-blue-400 font-medium mt-0.5">
              Estrutura desacoplada e modular em conformidade com o padrão Manifest V3
            </p>
          </div>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-4xl">
          O código do OmniTag é estruturado de forma rigorosamente desacoplada para garantir estabilidade, segurança e separação clara entre a interface do usuário, injeção no DOM do Freshdesk e orquestração de IA em nuvem:
        </p>

        {/* 4 Module Cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          
          <div className="glass-card glass-card-hover p-5 rounded-2xl border-t-2 border-t-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold font-mono text-sm">manifest.json</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Manifest V3
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configura permissões de <code>storage</code> e <code>activeTab</code>, host permissions de APIs e define os scripts injetados nos domínios <code>*.myfreshworks.com</code>.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl border-t-2 border-t-emerald-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold font-mono text-sm">tags_data.js</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Dicionário Oficial
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Armazena a matriz viva de objetos <code>{`{ name, description }`}</code> contendo todas as tags homologadas para Suporte, Gestor, Financeiro, Pagamento Online e Atendimento.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl border-t-2 border-t-purple-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold font-mono text-sm">content.js</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Motor Central
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              O coração do sistema. Injeta os widgets na tela, extrai textos, executa a censura LGPD, orquestra as IAs em cascata, faz a leitura de Shadow DOM e registra as métricas.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl border-t-2 border-t-orange-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold font-mono text-sm">popup.html / popup.js / popup.css</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Painel de Controle
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interface completa com 3 abas: <strong>Dashboard</strong> (gráficos de uso, acurácia e busca de chats), <strong>Configuração</strong> (gestão multi-chaves e provedores) e <strong>Backup</strong>.
            </p>
          </div>

        </div>

        {/* Dicionário Estrito e Blindagem de Alucinações */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                <FileCode size={16} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Dicionário Estrito e Blindagem de Alucinações</h3>
                <p className="text-xs text-slate-400">Fonte da Verdade Corporativa (tags_data.js)</p>
              </div>
            </div>

            <button
              onClick={copyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors shrink-0"
            >
              {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Para garantir que os modelos de IA <strong>nunca inventem tags ou usem sinônimos não autorizados</strong>, o sistema despacha no prompt do modelo a lista e as regras estritas vindas do arquivo <code className="text-emerald-400 font-mono">tags_data.js</code>:
          </p>

          <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
            <code>{tagsDataCode}</code>
          </pre>
        </div>

      </div>
    </section>
  );
}
