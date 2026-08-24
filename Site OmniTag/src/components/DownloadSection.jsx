import React from 'react';
import { Download, FileArchive, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function DownloadSection() {
  const downloadUrl = "https://ar8tdiwyhdpyyh2d.public.blob.vercel-storage.com/Downloads/OmniTag%202.6.rar";

  return (
    <section id="download" className="py-12 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="relative rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 p-8 sm:p-10 overflow-hidden shadow-2xl shadow-blue-950/40 text-center">
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-mono font-semibold mb-3">
              <FileArchive size={14} /> Pacote da Extensão
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Download do Arquivo da Extensão
            </h2>

            <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              Baixe o arquivo compactado para instalar no seu navegador de trabalho (Google Chrome, Opera GX, Brave, Edge ou Firefox).
            </p>

            {/* Download Button */}
            <div className="flex justify-center mb-6">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 group"
              >
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                <span>Baixar OmniTag (.rar)</span>
              </a>
            </div>

            {/* Package details */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Versão: <strong>2.6 (24/08/2026)</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-blue-400" />
                <span>Padrão Manifest V3</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-400" />
                <span>140+ Tags Homologadas</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
