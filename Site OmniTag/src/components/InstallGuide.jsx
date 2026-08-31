import React, { useState } from 'react';
import { Compass, Check, Copy, Sparkles, ArrowRight } from 'lucide-react';

export default function InstallGuide() {
  const [activeTab, setActiveTab] = useState('opera');
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
      url: 'chrome://extensions/',
      menuPath: 'Menu (⋮) > Extensões > Gerenciar extensões',
      tip: 'Após carregar, clique no ícone do quebra-cabeça 🧩 na barra superior do Chrome e clique no alfinete para fixar o OmniTag.',
      steps: [
        {
          num: 1,
          title: 'Descompacte o Arquivo',
          desc: 'Baixe o arquivo OmniTag 2.6.rar e extraia a pasta no seu computador (ex: Documentos).',
          sub: 'Formato: Pasta com manifest.json'
        },
        {
          num: 2,
          title: 'Abra a aba de Extensões',
          desc: 'Acesse chrome://extensions/ na barra de endereços ou clique no Menu ⋮ > Extensões > Gerenciar extensões.',
          sub: 'Atalho: chrome://extensions/'
        },
        {
          num: 3,
          title: 'Ative o Modo do desenvolvedor',
          desc: 'No canto superior direito da página, ligue o botão "Modo do desenvolvedor" (Developer mode).',
          sub: 'Habilita instalação local'
        },
        {
          num: 4,
          title: 'Carregar sem compactação',
          desc: 'Clique no botão "Carregar sem compactação" (Load unpacked) no topo esquerdo e selecione a pasta extraída!',
          sub: '✅ Pronto no Google Chrome!'
        }
      ]
    },
    {
      id: 'opera',
      name: 'Opera / Opera GX',
      icon: 'fa-brands fa-opera',
      url: 'opera://extensions',
      menuPath: 'Menu Opera / Opera GX (logo no topo esquerdo) > Extensões > Extensões (Ctrl + Shift + E)',
      tip: 'No Opera GX, você pode acessar a extensão pelo ícone de cubo 📦 na barra superior ou lateral e fixar o OmniTag.',
      steps: [
        {
          num: 1,
          title: 'Descompacte o Arquivo',
          desc: 'Baixe o arquivo OmniTag 2.6.rar e extraia a pasta em um local acessível no seu computador.',
          sub: 'Formato: Pasta com manifest.json'
        },
        {
          num: 2,
          title: 'Abra o Gerenciador do Opera',
          desc: 'Digite opera://extensions na barra de navegação ou pressione o atalho Ctrl + Shift + E.',
          sub: 'Atalho: opera://extensions'
        },
        {
          num: 3,
          title: 'Ative o Modo de desenvolvedor',
          desc: 'No canto superior direito da página de extensões, ligue o interruptor "Modo de desenvolvedor".',
          sub: 'Exibe os botões de carga'
        },
        {
          num: 4,
          title: 'Carregar extensão descompactada',
          desc: 'Clique no botão "Carregar extensão descompactada" no topo e selecione a pasta da extensão!',
          sub: '✅ Pronto no Opera / Opera GX!'
        }
      ]
    },
    {
      id: 'brave',
      name: 'Brave Browser',
      icon: 'fa-brands fa-brave',
      url: 'brave://extensions/',
      menuPath: 'Menu Brave (☰ no topo direito) > Extensões',
      tip: 'O Brave é 100% compatível com a base Chromium. Clique no ícone de quebra-cabeça 🧩 e fixe a extensão para agilizar.',
      steps: [
        {
          num: 1,
          title: 'Descompacte o Arquivo',
          desc: 'Extraia o arquivo OmniTag 2.6.rar para uma pasta no seu computador.',
          sub: 'Formato: Pasta com manifest.json'
        },
        {
          num: 2,
          title: 'Acesse as Extensões do Brave',
          desc: 'Digite brave://extensions/ na barra de endereços do Brave ou acesse pelo menu ☰.',
          sub: 'Atalho: brave://extensions/'
        },
        {
          num: 3,
          title: 'Ative o Modo do desenvolvedor',
          desc: 'No canto superior direito da tela, ative a chave "Modo do desenvolvedor".',
          sub: 'Desbloqueia carga manual'
        },
        {
          num: 4,
          title: 'Carregar sem compactação',
          desc: 'Clique no botão "Carregar sem compactação" no topo esquerdo e selecione a pasta da extensão!',
          sub: '✅ Pronto no Brave Browser!'
        }
      ]
    },
    {
      id: 'edge',
      name: 'Microsoft Edge',
      icon: 'fa-brands fa-edge',
      url: 'edge://extensions/',
      menuPath: 'Menu Edge (...) > Extensões > Gerenciar extensões',
      tip: 'Clique no ícone de quebra-cabeça 🧩 na barra do Edge e clique no ícone de olho/alfinete para exibir o OmniTag permanentemente.',
      steps: [
        {
          num: 1,
          title: 'Descompacte o Arquivo',
          desc: 'Baixe o arquivo OmniTag 2.6.rar e faça a extração da pasta no seu computador.',
          sub: 'Formato: Pasta com manifest.json'
        },
        {
          num: 2,
          title: 'Abra a aba do Edge',
          desc: 'Digite edge://extensions/ na barra de pesquisa ou vá em Menu (...) > Extensões > Gerenciar extensões.',
          sub: 'Atalho: edge://extensions/'
        },
        {
          num: 3,
          title: 'Ative o Modo de desenvolvedor',
          desc: 'Na barra lateral esquerda (ou topo da página), ligue a chave "Modo de desenvolvedor".',
          sub: 'Habilita botões de instalação'
        },
        {
          num: 4,
          title: 'Carregar descompactada',
          desc: 'Clique no botão "Carregar descompactada" (Load unpacked) no topo e selecione a pasta extraída!',
          sub: '✅ Pronto no Microsoft Edge!'
        }
      ]
    },
    {
      id: 'firefox',
      name: 'Mozilla Firefox',
      icon: 'fa-brands fa-firefox',
      url: 'about:debugging#/runtime/this-firefox',
      menuPath: 'Menu (☰) > Mais ferramentas > Depuração de extensões',
      tip: 'No Firefox, a extensão é carregada instantaneamente em modo temporário para uso nas abas de atendimento.',
      steps: [
        {
          num: 1,
          title: 'Descompacte o Arquivo',
          desc: 'Baixe o arquivo OmniTag 2.6.rar e extraia os arquivos em uma pasta no seu computador.',
          sub: 'Formato: Pasta com manifest.json'
        },
        {
          num: 2,
          title: 'Abra a Depuração do Firefox',
          desc: 'Digite about:debugging#/runtime/this-firefox na barra de navegação do Firefox.',
          sub: 'Atalho: about:debugging'
        },
        {
          num: 3,
          title: 'Carregar extensão temporária...',
          desc: 'Na seção "Este Firefox", clique no botão azul "Carregar extensão temporária..." (Load Temporary Add-on).',
          sub: 'Abre a janela de seleção'
        },
        {
          num: 4,
          title: 'Selecione o manifest.json',
          desc: 'Navegue até a pasta extraída e selecione o arquivo manifest.json para ativar!',
          sub: '✅ Pronto no Mozilla Firefox!'
        }
      ]
    }
  ];

  const currentBrowser = browsers.find((b) => b.id === activeTab) || browsers[0];

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
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
          
          {/* Top URL / Menu shortcut */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs sm:text-sm text-slate-300">
              <span className="text-slate-400">Atalho no {currentBrowser.name}: </span>
              <code className="text-blue-400 font-mono font-bold ml-1 bg-slate-950 px-2 py-1 rounded">
                {currentBrowser.url}
              </code>
              <span className="text-slate-500 block sm:inline sm:ml-2 text-[11px]">
                ({currentBrowser.menuPath})
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(currentBrowser.url)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors shrink-0 self-start sm:self-auto"
            >
              {copiedUrl ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedUrl ? 'Copiado!' : 'Copiar Atalho'}</span>
            </button>
          </div>

          {/* 4 Steps Grid (Específico para cada navegador) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentBrowser.steps.map((step) => (
              <div
                key={step.num}
                className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm mb-3">
                    {step.num}
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
                <div className={`mt-4 text-[10px] font-mono ${step.num === 4 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  {step.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Browser Specific Tip */}
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3.5">
            <Sparkles size={18} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-0.5">Dica para {currentBrowser.name}:</strong>
              {currentBrowser.tip}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
