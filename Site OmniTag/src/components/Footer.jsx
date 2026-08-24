import React from 'react';
import { Download } from 'lucide-react';

export default function Footer() {
  const downloadUrl = "https://ar8tdiwyhdpyyh2d.public.blob.vercel-storage.com/Downloads/OmniTag%202.6.rar";

  return (
    <footer className="border-t border-slate-800/80 bg-[#050811] pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          
          {/* Logo & Info */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <img
              src="/icon.png"
              alt="OmniTag Logo"
              className="w-10 h-10 rounded-xl shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">OmniTag</span>
                <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                  v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Documentação e Guia de Uso Interno • Suporte Anota.AI</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a href="#instalacao" className="text-slate-400 hover:text-white transition-colors">
              Instalação
            </a>
            <span className="text-slate-700">•</span>
            <a href="#setup-api" className="text-slate-400 hover:text-white transition-colors">
              Setup de APIs
            </a>
            <span className="text-slate-700">•</span>
            <a href="#sop-operacao" className="text-slate-400 hover:text-white transition-colors">
              SOP do Atendente
            </a>
            <span className="text-slate-700">•</span>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold transition-all"
            >
              <Download size={13} />
              <span>Baixar (.rar)</span>
            </a>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 OmniTag • Uso interno exclusivo do Suporte Anota.AI.</p>
          
          <div className="flex items-center gap-2">
            <span>Desenvolvido por</span>
            <a
              href="https://www.raphaelsuarez.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-link font-mono font-bold text-sm"
            >
              &lt;Raphael Suarez/&gt;
            </a>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Assistente de Experiência Júnior
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
