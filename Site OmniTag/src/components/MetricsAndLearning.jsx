import React from 'react';
import { Brain, CheckCircle2, XCircle, Search, History, Sparkles, MessageSquare } from 'lucide-react';

export default function MetricsAndLearning() {
  const dossierCode = `// Dossiê de aprendizado injetado no prompt (Few-Shot Prompting):
APRENDIZADO - EXEMPLOS DE CORREÇÕES ANTERIORES:
- Conversa: "Cliente solicita segunda via de boleto de pagamento..."
  IA sugeriu: [suporte-pedido]
  Tags corretas confirmadas pelo atendente: [fin-segunda-via]

Use esses padrões históricos para calibrar suas sugestões no atendimento atual.`;

  const extractChatIdCode = `// Extração precisa do ID real do chat no Freshworks (content.js):
function extractChatId(url) {
  if (!url) return '';
  var convMatch = url.match(/\\/conversation\\/(\\d+)/i);
  if (convMatch) return convMatch[1]; // Ex: 1166658770879150 (ID real do Chat)
  var ticketMatch = url.match(/\\/tickets?\\/(\\d+)/i);
  if (ticketMatch) return ticketMatch[1];
  return '';
}`;

  return (
    <section id="metricas-rlhf" className="py-16 scroll-mt-24 space-y-16">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* 1. MÉTRICAS E APRENDIZADO REFORÇADO */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm border border-pink-500/30">
              <Brain size={16} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Métricas de Assertividade e Feedback Loop (🧠)
              </h2>
              <p className="text-xs text-pink-400 font-medium mt-0.5">
                Cálculo de acurácia por atendimento e calibração contínua via Few-Shot Prompting
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            A versão <strong>2.6</strong> calcula a taxa de acerto por <strong>Atendimento</strong> (em vez de por tag individual), garantindo métricas confiáveis e transparentes para a gestão:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <CheckCircle2 size={18} />
                <span>Acerto (+1 Hit)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Registrado automaticamente quando o atendente clica em qualquer uma das tags sugeridas pela IA para injetar no Freshdesk.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-red-500">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
                <XCircle size={18} />
                <span>Erro / Correção (+1 Miss)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Registrado quando <strong>nenhuma</strong> tag da IA serviu, o atendente preencheu a tag correta manualmente e clicou no <strong>🧠 (Cérebro)</strong>.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" />
              <span>Como o Aprendizado Calibra a IA nos Próximos Atendimentos:</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cada correção salva no <code>learningData</code> é injetada no início do prompt da IA como exemplo prático de decisão humana homologada:
            </p>
            <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
              <code>{dossierCode}</code>
            </pre>
          </div>
        </div>

        {/* 2. HISTÓRICO DE CHATS E BUSCA POR ID */}
        <div id="historico-chats" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-500/30">
              <Search size={16} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Histórico de Chats com Extração de ID Real e Busca Instantânea
              </h2>
              <p className="text-xs text-cyan-400 font-medium mt-0.5">
                Rastreabilidade de conversas do Freshworks (/conversation/ID)
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            O sistema extrai com precisão o identificador numérico da conversa do Freshworks (ex: <code className="text-cyan-400 font-mono">/conversation/1166658770879150</code>) e permite busca instantânea por ID ou data no modal do Dashboard:
          </p>

          <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
            <code>{extractChatIdCode}</code>
          </pre>
        </div>

      </div>
    </section>
  );
}
