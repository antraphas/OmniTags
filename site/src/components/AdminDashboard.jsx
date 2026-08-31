import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Star,
  Zap,
  Target,
  Brain,
  TrendingUp,
  Bug,
  Palette,
  Lightbulb,
  MessageSquare,
  User,
  Mail,
  Calendar,
  Link as LinkIcon,
  X,
  ExternalLink,
  ChevronRight,
  BarChart3,
  ListFilter
} from 'lucide-react';

export default function AdminDashboard({ onClose }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [data, setData] = useState({
    stats: null,
    avaliacoes: [],
    feedbacks: []
  });

  const [activeTab, setActiveTab] = useState('avaliacoes'); // 'avaliacoes' | 'feedbacks' | 'graficos'
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('todos');
  const [npsFilter, setNpsFilter] = useState('todos');
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, table, name }

  // Trava scroll da página ao abrir o painel admin e fecha com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Digite a senha de administrador.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Senha incorreta');
      }

      setData(resData);
      setIsAuthenticated(true);
      sessionStorage.setItem('omnitag_admin_pass', password);
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao conectar');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const resData = await response.json();
      if (response.ok) {
        setData(resData);
      }
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, table) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'delete', id, table })
      });
      if (response.ok) {
        setDeleteConfirm(null);
        handleRefresh();
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  // Auto-login se senha já salva na sessão
  useEffect(() => {
    const saved = sessionStorage.getItem('omnitag_admin_pass');
    if (saved) {
      setPassword(saved);
      // login silencioso
      fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: saved })
      })
        .then(res => res.json())
        .then(resData => {
          if (resData.success) {
            setData(resData);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const exportToCSV = (type) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'avaliacoes') {
      csvContent += "ID,Data,Nome,Email,TempoUso,Usabilidade,PosicionamentoTags,UtilidadeConsole,VelocidadeIA,PrecisaoIA,AprendizadoCerebro,ImpactoTempo,NPS,Comentarios\n";
      data.avaliacoes.forEach(a => {
        const row = [
          a.id,
          `"${new Date(a.created_at).toLocaleString('pt-BR')}"`,
          `"${(a.nome || '').replace(/"/g, '""')}"`,
          `"${(a.email || '').replace(/"/g, '""')}"`,
          `"${(a.tempo_uso || '').replace(/"/g, '""')}"`,
          a.nota_usabilidade,
          `"${(a.posicionamento_tags || '').replace(/"/g, '""')}"`,
          `"${(a.utilidade_console || '').replace(/"/g, '""')}"`,
          a.velocidade_ia,
          a.precisao_ia,
          `"${(a.aprendizado_cerebro || '').replace(/"/g, '""')}"`,
          `"${(a.impacto_tempo || '').replace(/"/g, '""')}"`,
          a.nps,
          `"${(a.comentarios_adicionais || '').replace(/"/g, '""')}"`
        ].join(",");
        csvContent += row + "\n";
      });
    } else {
      csvContent += "ID,Data,Nome,Email,Categoria,BugTipo,BugDescricao,BugLink,IAErro,IATagCorreta,IAClicouCerebro,UIProblema,UIMelhoria,IdeiaSugestao,IdeiaBeneficio\n";
      data.feedbacks.forEach(f => {
        const row = [
          f.id,
          `"${new Date(f.created_at).toLocaleString('pt-BR')}"`,
          `"${(f.nome || '').replace(/"/g, '""')}"`,
          `"${(f.email || '').replace(/"/g, '""')}"`,
          `"${f.categoria}"`,
          `"${(f.bug_tipo || '').replace(/"/g, '""')}"`,
          `"${(f.bug_descricao || '').replace(/"/g, '""')}"`,
          `"${(f.bug_link_ticket || '').replace(/"/g, '""')}"`,
          `"${(f.ia_erro_interpretacao || '').replace(/"/g, '""')}"`,
          `"${(f.ia_tag_correta || '').replace(/"/g, '""')}"`,
          `"${(f.ia_clicou_cerebro || '').replace(/"/g, '""')}"`,
          `"${(f.ui_problema || '').replace(/"/g, '""')}"`,
          `"${(f.ui_sugestao_melhoria || '').replace(/"/g, '""')}"`,
          `"${(f.ideia_sugestao || '').replace(/"/g, '""')}"`,
          `"${(f.ideia_beneficio || '').replace(/"/g, '""')}"`
        ].join(",");
        csvContent += row + "\n";
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `omnitag_${type}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('omnitag_admin_pass');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Filtragem de Avaliações
  const filteredAvaliacoes = data.avaliacoes.filter(a => {
    const matchesSearch =
      (a.nome || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.comentarios_adicionais || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (npsFilter === 'promotores') return a.nps >= 9;
    if (npsFilter === 'neutros') return a.nps >= 7 && a.nps <= 8;
    if (npsFilter === 'detratores') return a.nps !== null && a.nps <= 6;
    return true;
  });

  // Filtragem de Feedbacks
  const filteredFeedbacks = data.feedbacks.filter(f => {
    const matchesCategory = feedbackCategoryFilter === 'todos' || f.categoria === feedbackCategoryFilter;
    if (!matchesCategory) return false;

    const matchesSearch =
      (f.nome || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.bug_descricao || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.ia_erro_interpretacao || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.ui_problema || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.ideia_sugestao || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  /* ---------------- TELA DE LOGIN (PROTEÇÃO POR SENHA) ---------------- */
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-slate-200">
        <div className="relative w-full max-w-md bg-[#0b101d] border border-slate-700/80 rounded-3xl shadow-2xl shadow-blue-950/60 p-8 text-center space-y-6">
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Fechar"
          >
            <X size={18} />
          </button>

          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
            <Lock size={28} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Painel do Gestor
            </h2>
            <p className="text-xs text-slate-400">
              Acesso restrito para visualização das respostas e métricas coletadas no banco de dados.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle size={15} className="text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative text-left">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key size={13} className="text-slate-400" /> Senha Administrativa
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite sua senha..."
                  className="w-full bg-[#121829] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Verificando Acesso...</span>
                </>
              ) : (
                <>
                  <Unlock size={16} />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    );
  }

  /* ---------------- PAINEL ADMINISTRATIVO COMPLETO ---------------- */
  const stats = data.stats || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070b14] text-slate-200 animate-fadeIn flex flex-col">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0b101d]/95 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Painel de Gestão & Métricas</span>
              <span className="text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
                MySQL Conectado
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Banco: <strong className="text-slate-300 font-mono">omniforms</strong> • Host: <strong className="text-slate-300 font-mono">137.131.132.59</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-slate-700/80"
            title="Atualizar Dados"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-blue-400' : ''} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            onClick={() => exportToCSV(activeTab === 'feedbacks' ? 'feedbacks' : 'avaliacoes')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-slate-700/80"
            title="Exportar dados para Excel/CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-semibold transition-all"
            title="Sair do Painel"
          >
            Sair
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              title="Voltar ao Site"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-blue-500 text-left">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Total Avaliações</span>
              <User size={14} className="text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {stats.totalAvaliacoes || 0}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Respostas quantitativas</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-indigo-500 text-left">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Usabilidade Média</span>
              <Star size={14} className="text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300 mt-1">
              {stats.mediaUsabilidade || '0.0'} <span className="text-xs text-slate-500 font-normal">/ 5</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Nota de UX/Interface</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-yellow-500 text-left">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Velocidade IA</span>
              <Zap size={14} className="text-yellow-400" />
            </div>
            <div className="text-2xl font-black text-yellow-300 mt-1">
              {stats.mediaVelocidade || '0.0'} <span className="text-xs text-slate-500 font-normal">/ 5</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Percepção de tempo</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500 text-left">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Precisão IA</span>
              <Target size={14} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1">
              {stats.mediaPrecisao || '0.0'} <span className="text-xs text-slate-500 font-normal">/ 5</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Acurácia das Tags</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-purple-500 text-left">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>NPS Score</span>
              <TrendingUp size={14} className="text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300 mt-1">
              {stats.npsScore !== undefined ? `${stats.npsScore}` : '0'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {stats.promotores || 0} Promotores • {stats.detratores || 0} Detratores
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border-l-4 border-l-pink-500 text-left">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>Total Feedbacks</span>
              <MessageSquare size={14} className="text-pink-400" />
            </div>
            <div className="text-2xl font-black text-pink-300 mt-1">
              {stats.totalFeedbacks || 0}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {stats.feedbacksPorCategoria?.bug || 0} Bugs • {stats.feedbacksPorCategoria?.ideia || 0} Ideias
            </div>
          </div>

        </div>

        {/* Tab Selector & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#0b101d] border border-slate-800 w-fit">
            <button
              onClick={() => setActiveTab('avaliacoes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'avaliacoes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star size={14} />
              <span>Avaliações ({data.avaliacoes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('feedbacks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'feedbacks'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare size={14} />
              <span>Feedbacks & Bugs ({data.feedbacks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('graficos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'graficos'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 size={14} />
              <span>Resumo Visual</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab !== 'graficos' && (
            <div className="relative min-w-[260px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, email, texto..."
                className="w-full bg-[#0b101d] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}

        </div>

        {/* ---------------- ABA 1: TABELA DE AVALIAÇÕES ---------------- */}
        {activeTab === 'avaliacoes' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* NPS Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <ListFilter size={13} /> Filtro NPS:
              </span>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'promotores', label: 'Promotores (9-10)', color: 'text-emerald-400' },
                { id: 'neutros', label: 'Neutros (7-8)', color: 'text-yellow-400' },
                { id: 'detratores', label: 'Detratores (0-6)', color: 'text-red-400' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setNpsFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    npsFilter === f.id
                      ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                      : 'bg-[#0b101d] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className={f.color || ''}>{f.label}</span>
                </button>
              ))}
            </div>

            {/* Table Container */}
            <div className="bg-[#0b101d] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121829] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Data / Hora</th>
                      <th className="py-3.5 px-4">Usuário</th>
                      <th className="py-3.5 px-4 text-center">Tempo Uso</th>
                      <th className="py-3.5 px-4 text-center">Usabilidade</th>
                      <th className="py-3.5 px-4 text-center">Velocidade</th>
                      <th className="py-3.5 px-4 text-center">Precisão</th>
                      <th className="py-3.5 px-4 text-center">Impacto</th>
                      <th className="py-3.5 px-4 text-center">NPS</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredAvaliacoes.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500">
                          Nenhuma avaliação encontrada com os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredAvaliacoes.map(row => (
                        <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                            {new Date(row.created_at).toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{row.nome}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{row.email}</div>
                          </td>
                          <td className="py-3 px-4 text-center text-slate-400">
                            {row.tempo_uso || '-'}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-indigo-400">
                            {row.nota_usabilidade ? `⭐️ ${row.nota_usabilidade}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-yellow-400">
                            {row.velocidade_ia ? `⚡️ ${row.velocidade_ia}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-400">
                            {row.precisao_ia ? `🎯 ${row.precisao_ia}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-center text-[11px] text-slate-400">
                            {row.impacto_tempo || '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {row.nps !== null && row.nps !== undefined ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                                  row.nps >= 9
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : row.nps >= 7
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}
                              >
                                {row.nps}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedAvaliacao(row)}
                                className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[11px] font-semibold border border-blue-500/30 transition-all"
                              >
                                Ver Detalhes
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ id: row.id, table: 'avaliacoes', name: row.nome })}
                                className="p-1 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                                title="Excluir Registro"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ---------------- ABA 2: FEEDBACKS E BUGS ---------------- */}
        {activeTab === 'feedbacks' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'todos', label: 'Todos os Relatos', count: data.feedbacks.length },
                { id: 'bug', label: '🐞 Bugs Técnicos', count: stats.feedbacksPorCategoria?.bug || 0, color: 'text-red-400' },
                { id: 'erro_ia', label: '🧠 Erros de IA', count: stats.feedbacksPorCategoria?.erro_ia || 0, color: 'text-purple-400' },
                { id: 'interface', label: '🎨 Interface / UI', count: stats.feedbacksPorCategoria?.interface || 0, color: 'text-blue-400' },
                { id: 'ideia', label: '💡 Novas Ideias', count: stats.feedbacksPorCategoria?.ideia || 0, color: 'text-yellow-400' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setFeedbackCategoryFilter(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                    feedbackCategoryFilter === c.id
                      ? 'bg-purple-600/25 border-purple-500 text-white font-semibold'
                      : 'bg-[#0b101d] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className={c.color || ''}>{c.label}</span>
                  <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                    {c.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Feedbacks Grid */}
            {filteredFeedbacks.length === 0 ? (
              <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
                Nenhum feedback encontrado nesta categoria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFeedbacks.map(f => {
                  let badge = { text: 'Feedback', bg: 'bg-slate-800 text-slate-300', icon: MessageSquare };
                  if (f.categoria === 'bug') badge = { text: 'Bug Técnico', bg: 'bg-red-500/15 border-red-500/30 text-red-300', icon: Bug };
                  else if (f.categoria === 'erro_ia') badge = { text: 'Erro de IA', bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300', icon: Brain };
                  else if (f.categoria === 'interface') badge = { text: 'Interface / UX', bg: 'bg-blue-500/15 border-blue-500/30 text-blue-300', icon: Palette };
                  else if (f.categoria === 'ideia') badge = { text: 'Nova Ideia', bg: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300', icon: Lightbulb };

                  const BadgeIcon = badge.icon;

                  return (
                    <div
                      key={f.id}
                      className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg}`}>
                              <BadgeIcon size={13} />
                              <span>{badge.text}</span>
                            </span>
                            {f.bug_tipo && (
                              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                {f.bug_tipo}
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] font-mono text-slate-500 shrink-0">
                            {new Date(f.created_at).toLocaleString('pt-BR')}
                          </span>
                        </div>

                        {/* Specific Content by Category */}
                        {f.categoria === 'bug' && (
                          <div className="space-y-2 text-xs">
                            <div className="text-slate-300 bg-[#121829] p-3 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                              {f.bug_descricao}
                            </div>
                            {f.bug_link_ticket && (
                              <a
                                href={f.bug_link_ticket}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-mono text-[11px] hover:underline"
                              >
                                <LinkIcon size={12} />
                                <span>Ver Ticket Freshdesk</span>
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        )}

                        {f.categoria === 'erro_ia' && (
                          <div className="space-y-2 text-xs">
                            <div className="bg-[#121829] p-3 rounded-xl border border-slate-800/80 space-y-2">
                              <div>
                                <span className="text-slate-500 font-semibold block text-[10px] uppercase">O que a IA entendeu errado:</span>
                                <p className="text-slate-300 mt-0.5">{f.ia_erro_interpretacao}</p>
                              </div>
                              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                                <div>
                                  <span className="text-emerald-400 font-semibold block text-[10px] uppercase">Tag que deveria ter sugerido:</span>
                                  <span className="text-emerald-300 font-mono font-bold">{f.ia_tag_correta}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  Clicou no 🧠: <strong>{f.ia_clicou_cerebro}</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {f.categoria === 'interface' && (
                          <div className="space-y-2 text-xs">
                            <div className="bg-[#121829] p-3 rounded-xl border border-slate-800/80 space-y-2">
                              <div>
                                <span className="text-blue-400 font-semibold block text-[10px] uppercase">Problema / Incomodo na UI:</span>
                                <p className="text-slate-300 mt-0.5">{f.ui_problema}</p>
                              </div>
                              {f.ui_sugestao_melhoria && (
                                <div className="pt-2 border-t border-slate-800/60">
                                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Sugestão de Design:</span>
                                  <p className="text-slate-300 mt-0.5">{f.ui_sugestao_melhoria}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {f.categoria === 'ideia' && (
                          <div className="space-y-2 text-xs">
                            <div className="bg-[#121829] p-3 rounded-xl border border-slate-800/80 space-y-2">
                              <div>
                                <span className="text-yellow-400 font-semibold block text-[10px] uppercase">Ideia de Nova Função:</span>
                                <p className="text-slate-200 mt-0.5 font-medium">{f.ideia_sugestao}</p>
                              </div>
                              {f.ideia_beneficio && (
                                <div className="pt-2 border-t border-slate-800/60">
                                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Como ajudaria no dia a dia:</span>
                                  <p className="text-slate-300 mt-0.5">{f.ideia_beneficio}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Footer Info */}
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-slate-500" />
                          <span className="font-bold text-slate-300">{f.nome}</span>
                          <span className="text-slate-600">•</span>
                          <span className="font-mono text-slate-500">{f.email}</span>
                        </div>

                        <button
                          onClick={() => setDeleteConfirm({ id: f.id, table: 'feedbacks', name: `${badge.text} de ${f.nome}` })}
                          className="p-1 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                          title="Excluir Relato"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ---------------- ABA 3: GRÁFICOS E INSIGHTS ---------------- */}
        {activeTab === 'graficos' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card NPS Breakdown */}
              <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-purple-400" />
                  <span>Distribuição do NPS (Recomendação)</span>
                </h3>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-emerald-400 font-semibold">Promotores (Nota 9-10)</span>
                      <span className="font-bold text-white">{stats.promotores || 0}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${stats.totalNps ? ((stats.promotores || 0) / stats.totalNps) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-yellow-400 font-semibold">Neutros (Nota 7-8)</span>
                      <span className="font-bold text-white">{stats.neutros || 0}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 transition-all duration-500"
                        style={{ width: `${stats.totalNps ? ((stats.neutros || 0) / stats.totalNps) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-red-400 font-semibold">Detratores (Nota 0-6)</span>
                      <span className="font-bold text-white">{stats.detratores || 0}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${stats.totalNps ? ((stats.detratores || 0) / stats.totalNps) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Score Geral Calculado:</span>
                  <span className="text-base font-black font-mono text-purple-400">
                    NPS {stats.npsScore !== undefined ? stats.npsScore : 0}
                  </span>
                </div>
              </div>

              {/* Card Feedbacks Breakdown */}
              <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare size={16} className="text-pink-400" />
                  <span>Distribuição dos Relatos por Categoria</span>
                </h3>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-[#121829] border border-slate-800">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                      <Bug size={14} />
                      <span>Bugs Técnicos</span>
                    </div>
                    <div className="text-xl font-black text-white mt-1">
                      {stats.feedbacksPorCategoria?.bug || 0}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121829] border border-slate-800">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                      <Brain size={14} />
                      <span>Erros de IA</span>
                    </div>
                    <div className="text-xl font-black text-white mt-1">
                      {stats.feedbacksPorCategoria?.erro_ia || 0}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121829] border border-slate-800">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                      <Palette size={14} />
                      <span>Interface / UI</span>
                    </div>
                    <div className="text-xl font-black text-white mt-1">
                      {stats.feedbacksPorCategoria?.interface || 0}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#121829] border border-slate-800">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs">
                      <Lightbulb size={14} />
                      <span>Novas Ideias</span>
                    </div>
                    <div className="text-xl font-black text-white mt-1">
                      {stats.feedbacksPorCategoria?.ideia || 0}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* MODAL DE DETALHES DA AVALIAÇÃO */}
      {selectedAvaliacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0b101d] border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-slate-200">
            
            <button
              onClick={() => setSelectedAvaliacao(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div>
              <div className="text-xs font-mono text-blue-400 uppercase font-semibold">Detalhes da Avaliação #{selectedAvaliacao.id}</div>
              <h3 className="text-xl font-black text-white mt-0.5">{selectedAvaliacao.nome}</h3>
              <p className="text-xs text-slate-400 font-mono">{selectedAvaliacao.email} • {new Date(selectedAvaliacao.created_at).toLocaleString('pt-BR')}</p>
            </div>

            <div className="space-y-3 text-xs bg-[#121829] p-4 rounded-2xl border border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Tempo de Uso:</span>
                  <span className="font-semibold text-white">{selectedAvaliacao.tempo_uso || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Usabilidade:</span>
                  <span className="font-bold text-indigo-400">⭐️ {selectedAvaliacao.nota_usabilidade || '-'} / 5</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Velocidade IA:</span>
                  <span className="font-bold text-yellow-400">⚡️ {selectedAvaliacao.velocidade_ia || '-'} / 5</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Precisão Tags:</span>
                  <span className="font-bold text-emerald-400">🎯 {selectedAvaliacao.precisao_ia || '-'} / 5</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Posicionamento Tags:</span>
                  <span className="font-semibold text-slate-300">{selectedAvaliacao.posicionamento_tags || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mini-Console:</span>
                  <span className="font-semibold text-slate-300">{selectedAvaliacao.utilidade_console || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Aprendizado (🧠):</span>
                  <span className="font-semibold text-slate-300">{selectedAvaliacao.aprendizado_cerebro || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Impacto no Tempo:</span>
                  <span className="font-semibold text-emerald-300">{selectedAvaliacao.impacto_tempo || '-'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-500 block">Nota NPS Recomendação (0-10):</span>
                <span className="font-black text-purple-400 font-mono text-sm">{selectedAvaliacao.nps !== null ? selectedAvaliacao.nps : '-'}</span>
              </div>

              {selectedAvaliacao.comentarios_adicionais && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-500 block">Comentários Adicionais:</span>
                  <p className="text-slate-200 mt-1 italic">"{selectedAvaliacao.comentarios_adicionais}"</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAvaliacao(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0b101d] border border-red-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <Trash2 size={22} />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Excluir Registro?</h4>
              <p className="text-xs text-slate-400 mt-1">
                Deseja realmente remover permanentemente o registro de <strong>{deleteConfirm.name}</strong>?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.table)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
