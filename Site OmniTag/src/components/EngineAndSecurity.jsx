import React from 'react';
import { Cpu, Shield, Layers, Code, Zap, CheckCircle2, Lock } from 'lucide-react';

export default function EngineAndSecurity() {
  const fallbackCode = `// Exemplo de execução em cascata com Timeout de segurança (content.js):
async function fetchWithTimeout(resource, options) {
  var controller = new AbortController();
  var id = setTimeout(() => controller.abort(), 30000); // 30s máx de tolerância
  options.signal = controller.signal;
  try {
    var response = await fetch(resource, options);
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err; // Salta automaticamente para a próxima chave ou provedor da fila
  }
}`;

  const lgpdCode = `// Sanitização de dados em tempo real antes de enviar à IA (content.js):
function censorText(text) {
  text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g, '[EMAIL]');
  text = text.replace(/\\b\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}\\b/g, '[CPF]');
  text = text.replace(/\\b\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}\\b/g, '[CNPJ]');
  text = text.replace(/\\b(?:\\+?55\\s?)?(?:\\(?\\d{2}\\)?[\\s-]?)?\\d{4,5}[-\\s]?\\d{4}\\b/g, '[TELEFONE]');
  return text;
}`;

  return (
    <section id="seguranca-engine" className="py-16 scroll-mt-24 space-y-16">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* 1. MOTOR EM CASCATA */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
              <Cpu size={16} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Motor em Cascata de Alta Disponibilidade (Fallback Engine)
              </h2>
              <p className="text-xs text-indigo-400 font-medium mt-0.5">
                Tolerância a falhas, rotação de chaves e failover automático entre provedores
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            O OmniTag v2.6 implementa uma fila de tolerância a falhas com rotação inteligente de chaves e failover automático entre provedores. Caso uma API atinja limite de requisições ou sofra instabilidade, o sistema aciona o próximo modelo instantaneamente:
          </p>

          <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
            <code>{fallbackCode}</code>
          </pre>
        </div>

        {/* 2. PRIVACIDADE E CONFORMIDADE LGPD */}
        <div id="lgpd" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
              <Shield size={16} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Privacidade e Minificação de Dados (LGPD)
              </h2>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                Nenhum dado pessoal sensível do cliente trafega para as APIs externas
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Antes de qualquer requisição sair do navegador do atendente, o histórico de conversa passa por um pipeline de limpeza profunda que detecta e mascara dados sensíveis via Regex:
          </p>

          <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
            <code>{lgpdCode}</code>
          </pre>
        </div>

        {/* 3. SHADOW DOM E ENGENHARIA DE LEITURA FRESHDESK */}
        <div id="shadow-dom" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-sm border border-yellow-500/30">
              <Layers size={16} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Engenharia de Leitura do Freshdesk (Shadow DOM)
              </h2>
              <p className="text-xs text-yellow-400 font-medium mt-0.5">
                4 estratégias em cascata para leitura de web-components isolados
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            O Freshdesk moderno encapsula seus componentes em <em>Shadow Roots</em> isolados (<code className="text-blue-400 font-mono">fw-select</code>, <code className="text-blue-400 font-mono">fw-tag</code>, <code className="text-blue-400 font-mono">fw-input</code>). O OmniTag utiliza 4 estratégias de extração em cascata para garantir leitura 100% infalível:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            
            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-blue-500">
              <span className="inline-block px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold mb-2">
                Estratégia 1
              </span>
              <h3 className="text-white font-bold text-sm mb-1.5">Leitura Direta da Propriedade .value</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acessa o elemento <code>fw-select</code> de tags e extrai as tags ativas diretamente do array de objetos ou strings do web component oficial.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold mb-2">
                Estratégia 2
              </span>
              <h3 className="text-white font-bold text-sm mb-1.5">Varredura Recursiva em Shadow Roots (deepQueryAll)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Percorre recursivamente toda a árvore DOM e sub-árvores Shadow DOM procurando por elementos isolados <code>fw-tag</code>.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-purple-500">
              <span className="inline-block px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono text-xs font-bold mb-2">
                Estratégia 3
              </span>
              <h3 className="text-white font-bold text-sm mb-1.5">Seletores Legacy Freshdesk / Ember</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Garante compatibilidade com versões clássicas e tickets antigos (<code>.tag-item</code>, <code>.ember-power-select-multiple-option</code>).
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border-l-4 border-l-orange-500">
              <span className="inline-block px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-xs font-bold mb-2">
                Estratégia 4
              </span>
              <h3 className="text-white font-bold text-sm mb-1.5">Casamento Visual de Texto (Modo Deus)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lê o <code>innerText</code> renderizado na tela e cruza com a lista estrita de tags oficiais do sistema, eliminando opções ocultas.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
