import React, { useState } from 'react';
import {
  Bug,
  Brain,
  Palette,
  Lightbulb,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  Mail,
  Link,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  HelpCircle
} from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    categoria: 'bug', // 'bug' | 'erro_ia' | 'interface' | 'ideia'
    // Bug fields
    bug_tipo: 'Demorou muito (Timeout)',
    bug_descricao: '',
    bug_link_ticket: '',
    // Erro IA fields
    ia_erro_interpretacao: '',
    ia_tag_correta: '',
    ia_clicou_cerebro: 'Sim',
    // UI fields
    ui_problema: '',
    ui_sugestao_melhoria: '',
    // Ideia fields
    ideia_sugestao: '',
    ideia_beneficio: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

    // Validação específica por categoria
    if (formData.categoria === 'bug' && !formData.bug_descricao.trim()) {
      setErrorMsg('Por favor, descreva o que aconteceu no campo de detalhes do bug.');
      return;
    }
    if (formData.categoria === 'erro_ia' && (!formData.ia_erro_interpretacao.trim() || !formData.ia_tag_correta.trim())) {
      setErrorMsg('Por favor, preencha o que a IA interpretou e qual tag ela deveria ter sugerido.');
      return;
    }
    if (formData.categoria === 'interface' && !formData.ui_problema.trim()) {
      setErrorMsg('Por favor, conte o que está te incomodando na interface visual.');
      return;
    }
    if (formData.categoria === 'ideia' && !formData.ideia_sugestao.trim()) {
      setErrorMsg('Por favor, descreva a sua ideia ou sugestão de nova funcionalidade.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar relato');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Erro ao salvar feedback:', err);
      setErrorMsg(err.message || 'Ocorreu um erro ao salvar no banco de dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 'bug',
      title: 'Relatar um Bug / Problema Técnico',
      desc: 'Extensão não abriu, demorou, travou ou erro ao clicar.',
      icon: Bug,
      color: 'text-red-400',
      borderColor: 'border-red-500/30',
      activeBg: 'bg-red-500/15 border-red-500'
    },
    {
      id: 'erro_ia',
      title: 'Erro de Lógica / Sugestão da IA',
      desc: 'IA sugeriu tag sem sentido ou não entendeu o contexto.',
      icon: Brain,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      activeBg: 'bg-purple-500/15 border-purple-500'
    },
    {
      id: 'interface',
      title: 'Feedback de Interface / Usabilidade',
      desc: 'Cores, botões, posição do widget ou mini-console.',
      icon: Palette,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      activeBg: 'bg-blue-500/15 border-blue-500'
    },
    {
      id: 'ideia',
      title: 'Sugerir Nova Ideia ou Recurso',
      desc: 'Nova funcionalidade para deixar o trabalho mais rápido.',
      icon: Lightbulb,
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/30',
      activeBg: 'bg-yellow-500/15 border-yellow-500'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl my-8 bg-[#0b101d] border border-slate-700/80 rounded-3xl shadow-2xl shadow-purple-950/50 overflow-hidden text-slate-200">
        
        {/* Top Gradient Banner */}
        <div className="h-2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />

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
                Relato Registrado com Sucesso! 🎯
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Obrigado pelo relato, <strong>{formData.nome}</strong>! Nossa engenharia já recebeu as informações no banco de dados e irá avaliar as correções/melhorias.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-mono font-semibold mb-2">
                <Sparkles size={13} /> Central de Melhorias & Bugs
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Feedback & Report de Problemas
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Escolha abaixo o que deseja reportar. O formulário se ajusta automaticamente para coletar exatamente o que precisamos!
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
                <User size={16} /> 1. Seus Dados
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Seu Nome Completo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={e => handleChange('nome', e.target.value)}
                    placeholder="Ex: Ana Beatriz"
                    className="w-full bg-[#121829] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Seu E-mail Corporativo <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="Ex: ana.beatriz@anota.ai"
                    className="w-full bg-[#121829] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: SELEÇÃO DA CATEGORIA DINÂMICA */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-purple-400">
                <MessageSquare size={16} /> 2. O que você quer reportar hoje? <span className="text-red-400">*</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = formData.categoria === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleChange('categoria', cat.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? `${cat.activeBg} ring-1 ring-purple-400/50 shadow-lg shadow-purple-950/40`
                          : 'bg-[#121829] border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 ${cat.color}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white leading-snug">
                            {cat.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {cat.desc}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-purple-300">
                          <span>Seção Ativa</span>
                          <ArrowRight size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SEÇÃO DINÂMICA: RELATO BASEADO NA CATEGORIA */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
              
              {/* CASO 1: BUG TÉCNICO */}
              {formData.categoria === 'bug' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <Bug size={18} />
                    <span>Detalhes do Bug / Problema Técnico</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      O que aconteceu de errado?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Extensão não abriu no CRM',
                        'Demorou muito (Timeout)',
                        'Cliquei na Tag e não preencheu',
                        'O console travou na tela',
                        'Erro visual / Quebrou a página',
                        'Outro problema'
                      ].map(tipo => (
                        <button
                          type="button"
                          key={tipo}
                          onClick={() => handleChange('bug_tipo', tipo)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                            formData.bug_tipo === tipo
                              ? 'bg-red-500/20 border-red-500 text-white font-semibold'
                              : 'bg-[#121829] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Descreva o passo a passo de como o erro aconteceu <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.bug_descricao}
                      onChange={e => handleChange('bug_descricao', e.target.value)}
                      placeholder="Ex: Eu estava no ticket #12345, cliquei no botão 'Ler Conversa', a barra de tempo bateu 30 segundos e deu erro de Timeout sem gerar as pílulas..."
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Link size={13} className="text-slate-400" /> Link do ticket/chat onde o erro ocorreu (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.bug_link_ticket}
                      onChange={e => handleChange('bug_link_ticket', e.target.value)}
                      placeholder="https://anotaai.freshdesk.com/a/tickets/..."
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* CASO 2: ERRO DE LÓGICA DA IA */}
              {formData.categoria === 'erro_ia' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <Brain size={18} />
                    <span>Detalhes do Erro de Interpretação da IA</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      O que a IA interpretou de errado? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.ia_erro_interpretacao}
                      onChange={e => handleChange('ia_erro_interpretacao', e.target.value)}
                      placeholder="Ex: O cliente falou sobre problema no repasse do iFood, mas a IA sugeriu 'suporte-cardapio' e 'duvida-login'..."
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Qual tag a IA deveria ter sugerido nesse caso? <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ia_tag_correta}
                      onChange={e => handleChange('ia_tag_correta', e.target.value)}
                      placeholder="Ex: ifoodpago-condições-repasse, suporte-financeiro"
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Você lembrou de fazer a correção manual e clicar no botão Cérebro (🧠) neste atendimento?
                    </label>
                    <div className="flex gap-3">
                      {['Sim, cliquei no cérebro 🧠', 'Não, esqueci / não cliquei'].map(opt => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleChange('ia_clicou_cerebro', opt)}
                          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                            formData.ia_clicou_cerebro === opt
                              ? 'bg-purple-600/25 border-purple-500 text-white font-semibold'
                              : 'bg-[#121829] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CASO 3: INTERFACE / USABILIDADE */}
              {formData.categoria === 'interface' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <Palette size={18} />
                    <span>Feedback sobre Interface & Usabilidade</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      O que na interface visual do OmniTag está te incomodando ou dificultando seu trabalho? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.ui_problema}
                      onChange={e => handleChange('ui_problema', e.target.value)}
                      placeholder="Ex: O botão do widget fica em cima do botão de envio de mensagem no meu monitor, ou as cores dos botões estão com pouco contraste..."
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Como poderíamos melhorar o design para o seu dia a dia?
                    </label>
                    <textarea
                      rows={3}
                      value={formData.ui_sugestao_melhoria}
                      onChange={e => handleChange('ui_sugestao_melhoria', e.target.value)}
                      placeholder="Ex: Seria ótimo poder arrastar o widget para qualquer canto da tela, ou ter atalho de teclado..."
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* CASO 4: NOVA IDEIA */}
              {formData.categoria === 'ideia' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                    <Lightbulb size={18} />
                    <span>Sua Ideia / Sugestão de Nova Funcionalidade ✨</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Qual é a sua sugestão de melhoria ou nova funcionalidade? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.ideia_sugestao}
                      onChange={e => handleChange('ideia_sugestao', e.target.value)}
                      placeholder="Ex: Gostaria que o OmniTag também sugerisse uma resposta rápida ou um resumo do chat em 2 linhas..."
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Como essa nova funcionalidade te ajudaria no dia a dia?
                    </label>
                    <textarea
                      rows={3}
                      value={formData.ideia_beneficio}
                      onChange={e => handleChange('ideia_beneficio', e.target.value)}
                      placeholder="Ex: Ajudaria a passar o caso para o N2 muito mais rápido sem precisar reler o chat todo..."
                      className="w-full bg-[#121829] border border-slate-700/80 rounded-xl p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

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
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Salvando Relato...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Enviar Relato</span>
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
