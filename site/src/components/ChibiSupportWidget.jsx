import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Wifi,
  Battery,
  Signal,
  ChevronRight,
  MessageSquare,
  Send,
  ShieldCheck
} from 'lucide-react';

export default function ChibiSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(null); // 'whatsapp' | 'slack' | null
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [time, setTime] = useState('');
  const [selectedQuickMsg, setSelectedQuickMsg] = useState('');

  const whatsappNumber = '5521972214420';
  const whatsappFormatted = '(21) 97221-4420';
  const slackUser = '@RaphaelSuarez';
  const slackUrl = 'https://ifood-global.enterprise.slack.com/team/U0640AJNDEJ';

  // Atualiza relógio do smartphone em tempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => {
      setCopied(null);
    }, 2500);
  };

  const quickMessages = [
    { label: 'Dúvida de Tags', text: 'Olá Raphael! Estou com uma dúvida sobre a categorização de tags no OmniTag.' },
    { label: 'Relatar Bug', text: 'Olá Raphael! Encontrei um comportamento inesperado/bug no OmniTag.' },
    { label: 'Nova Ideia', text: 'Olá Raphael! Pensei em uma sugestão de melhoria bem legal para a extensão.' },
    { label: 'Ajuda Geral', text: 'Olá Raphael! Pode me dar um help aqui com o OmniTag?' }
  ];

  const getWhatsappUrl = (customText) => {
    const text = customText || 'Olá Raphael! Preciso de ajuda com o OmniTag.';
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 1. BOTÃO FLUTUANTE DO CHIBI (CANTO INFERIOR DIREITO) */}
      {/* ============================================================ */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 pointer-events-none select-none">
        
        {/* Balão de Fala Animado */}
        {bubbleVisible && !isOpen && (
          <div className="pointer-events-auto relative group animate-float">
            <div
              onClick={() => setIsOpen(true)}
              className="cursor-pointer flex items-center gap-2.5 bg-gradient-to-r from-blue-900/95 via-indigo-900/95 to-purple-900/95 hover:from-blue-800 hover:to-purple-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl shadow-blue-950/80 border border-blue-400/50 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blue-300"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              
              <div className="text-xs font-semibold leading-tight">
                <span className="text-blue-200 block text-[10px] uppercase font-mono tracking-wider font-bold">Suporte Direto</span>
                <span>Precisa de ajuda? Pode me chamar! 👋</span>
              </div>

              {/* Botão sutil para fechar apenas o balão */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBubbleVisible(false);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-1"
                title="Ocultar balão"
              >
                <X size={12} />
              </button>
            </div>

            {/* Triângulo indicador do balão apontando para o chibi */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-indigo-900/95 border-r border-b border-blue-400/50 transform rotate-45"></div>
          </div>
        )}

        {/* Chibi Trigger Button */}
        <div className="pointer-events-auto relative group">
          
          {/* Anel de Pulso de Atenção */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#0b1021] border-2 ${
              isOpen ? 'border-purple-400 ring-4 ring-purple-500/30' : 'border-blue-400/90 hover:border-blue-300'
            } shadow-2xl p-1 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 active:scale-95`}
            title="Abrir contato direto com Raphael Suarez"
          >
            {/* Chibi Image */}
            <img
              src="/me.png"
              alt="Raphael Suarez Chibi"
              className="w-full h-full object-contain filter drop-shadow-md rounded-full"
            />

            {/* Online Status Badge */}
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#0b1021] rounded-full shadow-sm flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>

            {/* Notification Bubble / Help Icon */}
            {!isOpen && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-tr from-purple-600 to-pink-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border border-white/40 shadow">
                💬
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MODAL NO FORMATO DE SMARTPHONE (TELEFONE DO RAPHAEL) */}
      {/* ============================================================ */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          
          {/* Overlay Click Outside to Close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Smartphone Chassis / Frame */}
          <div className="relative z-10 w-full max-w-[390px] my-auto bg-[#0a0e1a] rounded-[50px] p-3 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] border-[6px] border-slate-800 ring-1 ring-slate-700/80 transition-all duration-300">
            
            {/* Hardware Buttons Simulated on Outer Edges */}
            <div className="hidden sm:block absolute -left-[8px] top-28 w-[4px] h-9 bg-slate-700 rounded-l-md" /> {/* Volume Up */}
            <div className="hidden sm:block absolute -left-[8px] top-40 w-[4px] h-9 bg-slate-700 rounded-l-md" /> {/* Volume Down */}
            <div className="hidden sm:block absolute -right-[8px] top-32 w-[4px] h-14 bg-slate-700 rounded-r-md" /> {/* Power */}

            {/* Botão de Fechar Externo Flutuante */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-red-600 flex items-center justify-center border border-slate-600 shadow-xl transition-all z-20"
              title="Fechar Telefone"
            >
              <X size={16} />
            </button>

            {/* Smartphone Inner Screen */}
            <div className="relative w-full rounded-[42px] overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#10182c] to-[#080d1a] border border-slate-800/90 text-slate-200 flex flex-col max-h-[85vh] sm:max-h-[720px]">
              
              {/* STATUS BAR REALISTA (Top) */}
              <div className="relative px-6 pt-3.5 pb-2 flex items-center justify-between text-xs font-semibold text-slate-300 select-none">
                {/* Clock */}
                <div className="font-mono text-[13px] tracking-tight text-white font-bold pl-1">
                  {time || '12:00'}
                </div>

                {/* Dynamic Island Notch */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 border border-white/10 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-[#0d1b2a] border border-blue-900/60"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>

                {/* System Icons */}
                <div className="flex items-center gap-1.5 pr-1 text-slate-300">
                  <Signal size={12} className="text-slate-300" />
                  <Wifi size={13} className="text-slate-300" />
                  <div className="flex items-center gap-0.5">
                    <Battery size={14} className="text-emerald-400 fill-emerald-400" />
                  </div>
                </div>
              </div>

              {/* CONTEÚDO DA TELA (Scrollável) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3 space-y-3.5">
                
                {/* Profile Contact Header Card */}
                <div className="relative rounded-3xl p-4 bg-gradient-to-br from-blue-950/40 via-purple-950/30 to-slate-900/60 border border-slate-700/60 text-center shadow-lg overflow-hidden">
                  
                  {/* Decorative Glow */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

                  {/* Chibi Avatar Display */}
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 rounded-full blur-sm opacity-70 animate-pulse" />
                    <div className="relative w-full h-full rounded-full bg-[#0b1021] border-2 border-purple-400/80 p-1 flex items-center justify-center shadow-inner overflow-hidden">
                      <img
                        src="/me.png"
                        alt="Raphael Suarez"
                        className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" title="Online" />
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                    Raphael Suarez
                  </h3>
                  
                  <p className="text-[11px] font-medium text-blue-300 mt-0.5">
                    Criador da OmniTag • Suporte Anota.AI
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Online • Pronto para ajudar</span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-left">
                    👋 <strong>Oi!</strong> Precisa de ajuda com o OmniTag, quer sugerir novas tags ou encontrou algum problema? Fale direto comigo no <strong>WhatsApp</strong> ou <strong>Slack</strong>!
                  </p>
                </div>

                {/* ======================================================= */}
                {/* 1. SEÇÃO WHATSAPP */}
                {/* ======================================================= */}
                <div className="rounded-2xl p-3.5 bg-emerald-950/25 border border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-md">
                  
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
                        <MessageCircle size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>WhatsApp Direto</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">Contato</span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                          {whatsappFormatted}
                        </div>
                      </div>
                    </div>

                    {/* Botão Copiar Número */}
                    <button
                      onClick={() => handleCopy(whatsappNumber, 'whatsapp')}
                      className="px-2 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95"
                      title="Copiar número"
                    >
                      {copied === 'whatsapp' ? (
                        <>
                          <Check size={11} className="text-emerald-300" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Mensagens Rápidas (Chips de 1 Clique) */}
                  <div className="mb-3">
                    <div className="text-[10px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                      <Sparkles size={10} className="text-emerald-400" />
                      <span>Mensagens rápidas prontas:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {quickMessages.map((msg, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSelectedQuickMsg(msg.text);
                            window.open(getWhatsappUrl(msg.text), '_blank');
                          }}
                          className="text-[10px] font-medium p-1.5 rounded-lg bg-emerald-900/30 hover:bg-emerald-800/50 border border-emerald-500/20 text-emerald-200 text-left transition-all hover:scale-[1.02] flex items-center justify-between"
                        >
                          <span className="truncate">{msg.label}</span>
                          <ChevronRight size={10} className="text-emerald-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botão Principal Abrir WhatsApp */}
                  <a
                    href={getWhatsappUrl(selectedQuickMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-98"
                  >
                    <Send size={14} />
                    <span>Iniciar Conversa no WhatsApp</span>
                    <ExternalLink size={12} className="opacity-70" />
                  </a>
                </div>

                {/* ======================================================= */}
                {/* 2. SEÇÃO SLACK (iFood Enterprise) */}
                {/* ======================================================= */}
                <div className="rounded-2xl p-3.5 bg-purple-950/25 border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-md">
                  
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-sm">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>Slack Corporativo</span>
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono font-bold">iFood</span>
                        </div>
                        <div className="text-[11px] font-mono text-purple-300 font-semibold">
                          {slackUser}
                        </div>
                      </div>
                    </div>

                    {/* Botão Copiar Slack Handle */}
                    <button
                      onClick={() => handleCopy(slackUser, 'slack')}
                      className="px-2 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95"
                      title="Copiar usuário do Slack"
                    >
                      {copied === 'slack' ? (
                        <>
                          <Check size={11} className="text-purple-300" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                    Acesso direto ao perfil no Slack Enterprise da <strong>Anota.AI / iFood</strong> para conversas internas, threads ou chamadas.
                  </p>

                  {/* Botão Principal Abrir Slack */}
                  <a
                    href={slackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 transition-all hover:scale-[1.02] active:scale-98"
                  >
                    <MessageSquare size={14} />
                    <span>Abrir Chat no Slack</span>
                    <ExternalLink size={12} className="opacity-70" />
                  </a>
                </div>

                {/* Dica de Utilidade / Footer Note */}
                <div className="text-[10px] text-center text-slate-500 py-1 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={12} className="text-blue-400" />
                  <span>Suporte direto com o desenvolvedor do OmniTag</span>
                </div>

              </div>

              {/* HOME INDICATOR BAR (Bottom) */}
              <div className="py-2.5 bg-slate-950/80 border-t border-slate-800/60 flex flex-col items-center justify-center gap-1">
                <div
                  onClick={() => setIsOpen(false)}
                  className="w-28 h-1 bg-slate-600/80 hover:bg-slate-400 rounded-full cursor-pointer transition-colors"
                  title="Fechar"
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
