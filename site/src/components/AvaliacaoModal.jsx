import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  Mail,
  Clock,
  Layout,
  Terminal,
  Zap,
  Target,
  Brain,
  TrendingUp,
  HeartHandshake,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

export default function AvaliacaoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tempo_uso: '1 a 2 semanas',
    nota_usabilidade: 5,
    posicionamento_tags: 'Sim, perfeitos',
    utilidade_console: 'Sim, gosto da transparência de tempo',
    velocidade_ia: 5,
    precisao_ia: 4,
    aprendizado_cerebro: 'Sim, ela aprende rápido',
    impacto_tempo: 'Reduziu muito o tempo',
    nps: 10,
    comentarios_adicionais: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Trava o scroll da página por trás e permite fechar com ESC
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.email.trim()) {
      setErrorMsg('Por favor, preencha seu Nome e E-mail.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/avaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar avaliação');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Erro ao enviar:', err);
      setErrorMsg(err.message || 'Ocorreu um erro ao salvar no banco de dados. Verifique a conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl my-8 bg-[#0b101d] border border-slate-700/80 rounded-3xl shadow-2xl shadow-blue-950/50 overflow-hidden text-slate-200">
        
        {/* Top Gradient Banner */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-20"
          title="Fechar"
        >
          <X size={20} />
        </button>

        {submitted ? (
          /* Success Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 size={42} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Avaliação Enviada com Sucesso! 🚀
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Muito obrigado, <strong>{formData.nome}</strong>! Suas respostas foram salvas diretamente no nosso banco de dados e serão usadas para aprimorar o OmniTag.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
              >
                Voltar ao Site
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold mb-2">
                <Sparkles size={13} /> Pesquisa de Desempenho • Beta
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Avaliação do OmniTag
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Suas notas e percepções são cruciais para medirmos a eficácia da IA e calibrarmos os modelos na operação.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* SEÇÃO 1: IDENTIFICAÇÃO */}
            <div className="space-y-4 pt-2 border-t border-slate-800/80">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-blue-400">
                <User size={16} /> 1. Identificação do Usuário
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Seu Nome Completo <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={e => handleChange('nome', e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Seu E-mail Corporativo <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="Ex: joao.silva@anota.ai"
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" /> Há quanto tempo você está usando o OmniTag?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Menos de 1 semana', '1 a 2 semanas', 'Mais de 2 semanas'].map(option => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleChange('tempo_uso', option)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all text-left flex items-center justify-between ${
                        formData.tempo_uso === option
                          ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                          : 'bg-[#121829] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{option}</span>
                      {formData.tempo_uso === option && <CheckCircle2 size={14} className="text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: USABILIDADE & INTERFACE */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-indigo-400">
                <Layout size={16} /> 2. Usabilidade e Interface (UX/UI)
              </h3>

              {/* Nota Usabilidade */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Quão intuitiva e fácil de usar é a interface do OmniTag no CRM? (1 a 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      type="button"
                      key={rating}
                      onClick={() => handleChange('nota_usabilidade', rating)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-bold flex flex-col items-center gap-1 transition-all ${
                        formData.nota_usabilidade >= rating
                          ? 'bg-indigo-600/25 border-indigo-500 text-indigo-300'
                          : 'bg-[#121829] border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <Star size={16} className={formData.nota_usabilidade >= rating ? 'fill-indigo-400 text-indigo-400' : ''} />
                      <span>{rating}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
                  <span>1 - Muito confusa</span>
                  <span>5 - Extremamente fácil</span>
                </div>
              </div>

              {/* Posicionamento das Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  As pílulas de tags (botões azuis) e o botão do Cérebro (🧠) estão bem posicionados na tela?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Sim, perfeitos',
                    'Ok, mas poderiam melhorar',
                    'Não, me atrapalham'
                  ].map(option => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleChange('posicionamento_tags', option)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                        formData.posicionamento_tags === option
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                          : 'bg-[#121829] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mini-Console */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Terminal size={13} className="text-slate-400" /> O "Mini-Console" flutuante (que mostra o tempo de resposta da IA) é útil?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Sim, gosto da transparência de tempo',
                    'Não ligo muito para ele',
                    'Acho confuso'
                  ].map(option => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleChange('utilidade_console', option)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                        formData.utilidade_console === option
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                          : 'bg-[#121829] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: PERFORMANCE E ACURÁCIA DA IA */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-purple-400">
                <Brain size={16} /> 3. Performance e Inteligência Artificial
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Velocidade da IA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Zap size={13} className="text-yellow-400" /> Velocidade de Resposta da IA (1 a 5)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => handleChange('velocidade_ia', v)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                          formData.velocidade_ia >= v
                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                            : 'bg-[#121829] border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1 - Muito lenta</span>
                    <span>5 - Quase instantânea</span>
                  </div>
                </div>

                {/* Precisão da IA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Target size={13} className="text-emerald-400" /> Precisão / Acurácia das Tags (1 a 5)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => handleChange('precisao_ia', p)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                          formData.precisao_ia >= p
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-[#121829] border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1 - Erra quase sempre</span>
                    <span>5 - Acerta quase 100%</span>
                  </div>
                </div>
              </div>

              {/* Botão de Aprendizado */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Sobre o recurso de Aprendizado (Botão 🧠): Sentiu que a IA parou de repetir erros após você corrigi-la?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Sim, ela aprende rápido',
                    'Não percebi diferença',
                    'Não estou usando esse botão'
                  ].map(option => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleChange('aprendizado_cerebro', option)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                        formData.aprendizado_cerebro === option
                          ? 'bg-purple-600/20 border-purple-500 text-white font-semibold'
                          : 'bg-[#121829] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: IMPACTO NA OPERAÇÃO & NPS */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-emerald-400">
                <TrendingUp size={16} /> 4. Impacto Operacional e Recomendação
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  O OmniTag reduziu o seu esforço braçal (tempo) na hora de fechar um ticket?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Reduziu muito o tempo',
                    'Reduziu um pouco',
                    'Não mudou nada',
                    'Aumentou meu tempo'
                  ].map(option => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => handleChange('impacto_tempo', option)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-center ${
                        formData.impacto_tempo === option
                          ? 'bg-emerald-600/20 border-emerald-500 text-white font-semibold'
                          : 'bg-[#121829] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* NPS Score */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>(NPS) De 0 a 10, o quanto você recomendaria o OmniTag para o restante da empresa?</span>
                  <span className="text-blue-400 font-mono font-bold text-sm bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                    Nota: {formData.nps}
                  </span>
                </label>
                <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => {
                    let colorClass = 'hover:border-slate-600 text-slate-400 bg-[#121829]';
                    if (formData.nps === val) {
                      if (val <= 6) colorClass = 'bg-red-500/25 border-red-500 text-red-300 font-bold';
                      else if (val <= 8) colorClass = 'bg-yellow-500/25 border-yellow-500 text-yellow-300 font-bold';
                      else colorClass = 'bg-emerald-500/25 border-emerald-500 text-emerald-300 font-bold';
                    }
                    return (
                      <button
                        type="button"
                        key={val}
                        onClick={() => handleChange('nps', val)}
                        className={`py-2 rounded-lg border text-xs sm:text-sm font-semibold transition-all ${colorClass}`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
                  <span>0 - Jamais recomendaria</span>
                  <span>10 - Com certeza absoluta!</span>
                </div>
              </div>

              {/* Comentários Livres */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-slate-400" /> Observações ou Comentários Adicionais (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={formData.comentarios_adicionais}
                  onChange={e => handleChange('comentarios_adicionais', e.target.value)}
                  placeholder="Conte-nos o que mais chamou sua atenção ou o que você acha que precisa de carinho..."
                  className="w-full bg-[#121829] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Salvando no Banco...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Enviar Avaliação</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
