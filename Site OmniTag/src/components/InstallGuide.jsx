import React, { useState } from 'react';
import { Compass, Check, Copy, Laptop, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function InstallGuide() {
  const [activeTab, setActiveTab] = useState('chrome');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const browsers = [
    {
      id: 'chrome',
      name: 'Google Chrome',
      icon: 'fa-brands fa-chrome',
      color: 'from-blue-500 to-emerald-500',
      url: 'chrome://extensions/'
    },
    {
      id: 'opera',
      name: 'Opera / Opera GX',
      icon: 'fa-brands fa-opera',
      color: 'from-red-500 to-rose-600',
      url: 'opera://extensions'
    },
    {
      id: 'brave',
      name: 'Brave Browser',
      icon: 'fa-brands fa-brave',
      color: 'from-orange-500 to-amber-600',
      url: 'brave://extensions/'
    },
    {
      id: 'edge',
      name: 'Microsoft Edge',
      icon: 'fa-brands fa-edge',
      color: 'from-blue-600 to-cyan-500',
      url: 'edge://extensions/'
    },
    {
      id: 'firefox',
      name: 'Mozilla Firefox',
      icon: 'fa-brands fa-firefox',
      color: 'from-amber-500 to-purple-600',
      url: 'about:debugging#/runtime/this-firefox'
    }
  ];

  return (
    <section id="instalacao" className="py-16 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass size={14} /> Guia de Instalação Passo a Passo
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Como Instalar no seu Navegador
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            A instalação leva menos de 60 segundos e não requer permissões de administrador no Windows.
          </p>
        </div>

        {/* Browser Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {browsers.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveTab(b.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === b.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'glass-card hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className={`${b.icon} text-base`}></i>
              <span>{b.name}</span>
            </button>
          ))}
        </div>

        {/* Instructions Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800">
          
          {/* Chromium Browsers (Chrome, Opera, Brave, Edge) */}
          {activeTab !== 'firefox' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs sm:text-sm text-slate-300">
                  <span className="text-slate-400">Atalho direto para a aba de extensões: </span>
                  <code className="text-blue-400 font-mono font-bold ml-1 bg-slate-950 px-2 py-1 rounded">
                    {browsers.find(b => b.id === activeTab)?.url}
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard(browsers.find(b => b.id === activeTab)?.url || '')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors shrink-0"
                >
                  {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedUrl ? 'Copiado!' : 'Copiar URL'}</span>
                </button>
              </div>

              {/* 4 Steps Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Step 1 */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm mb-3">
                      1
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1.5">Descompacte o Arquivo</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Baixe o arquivo <code className="text-blue-300">OmniTag 2.6.rar</code> e extraia a pasta no seu computador (ex: Documentos).
                    </p>
                  </div>
                  <div className="mt-4 text-[10px] text-slate-500 font-mono">Formato: Pasta com manifest.json</div>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-sm mb-3">
                      2
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1.5">Abra a aba de Extensões</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Abra o navegador e acesse a página de extensões colando a URL na barra de endereços.
                    </p>
                  </div>
                  <div className="mt-4 text-[10px] text-slate-500 font-mono">Ex: chrome://extensions/</div>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-sm mb-3">
                      3
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1.5">Ative o Modo Desenvolvedor</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      No canto superior direito da página de extensões, ligue a chave <strong>"Modo do Desenvolvedor"</strong> (Developer mode).
                    </p>
                  </div>
                  <div className="mt-4 text-[10px] text-slate-500 font-mono">Habilita instalação local</div>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm mb-3">
                      4
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1.5">Carregar sem Compactação</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Clique no botão <strong>"Carregar sem compactação"</strong> (Load unpacked) e selecione a pasta extraída da extensão!
                    </p>
                  </div>
                  <div className="mt-4 text-[10px] text-emerald-400 font-mono">✅ Pronto para uso imediato!</div>
                </div>

              </div>

            </div>
          )}

          {/* Firefox Instructions */}
          {activeTab === 'firefox' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs sm:text-sm text-slate-300">
                  <span className="text-slate-400">Atalho de depuração no Firefox: </span>
                  <code className="text-amber-400 font-mono font-bold ml-1 bg-slate-950 px-2 py-1 rounded">
                    about:debugging#/runtime/this-firefox
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard('about:debugging#/runtime/this-firefox')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors shrink-0"
                >
                  {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedUrl ? 'Copiado!' : 'Copiar URL'}</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm mb-3">1</div>
                  <h3 className="text-white font-bold text-sm mb-1.5">Acesse o Debugging</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Cole <code className="text-amber-300">about:debugging#/runtime/this-firefox</code> na barra de endereços do Firefox.</p>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm mb-3">2</div>
                  <h3 className="text-white font-bold text-sm mb-1.5">Carregar Extensão Temporária</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Clique no botão azul <strong>"Carregar extensão temporária..."</strong> (Load Temporary Add-on).</p>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm mb-3">3</div>
                  <h3 className="text-white font-bold text-sm mb-1.5">Selecione o manifest.json</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Navegue até a pasta descompactada e selecione o arquivo <code className="text-emerald-300">manifest.json</code>.</p>
                </div>
              </div>

            </div>
          )}

          {/* Post-Install Tip */}
          <div className="mt-8 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3.5">
            <Sparkles size={18} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-0.5">Dica de Produtividade:</strong>
              Após carregar a extensão, clique no ícone do quebra-cabeça 🧩 na barra superior do navegador e clique no botão de <strong>Fixar (Pin)</strong> para manter o OmniTag sempre acessível.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
