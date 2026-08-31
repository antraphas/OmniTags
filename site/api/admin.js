import { getDbPool } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { password, action, id, table } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD || '100491Rt**';

    if (!password || password !== adminPassword) {
      return res.status(401).json({ error: 'Acesso negado: Senha administrativa incorreta.' });
    }

    const pool = getDbPool();

    // Ação de deletar registro
    if (action === 'delete') {
      if (!id || !table || !['avaliacoes', 'feedbacks'].includes(table)) {
        return res.status(400).json({ error: 'ID e tabela válidos são obrigatórios para exclusão.' });
      }
      await pool.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
      return res.status(200).json({ success: true, message: 'Registro removido com sucesso.' });
    }

    // Ação padrão: listar dados e computar métricas
    const [avaliacoes] = await pool.execute('SELECT * FROM avaliacoes ORDER BY created_at DESC;');
    const [feedbacks] = await pool.execute('SELECT * FROM feedbacks ORDER BY created_at DESC;');

    // Cálculo de estatísticas
    const totalAvaliacoes = avaliacoes.length;
    let somaUsabilidade = 0, countUsabilidade = 0;
    let somaVelocidade = 0, countVelocidade = 0;
    let somaPrecisao = 0, countPrecisao = 0;
    let promotores = 0, detratores = 0, neutros = 0, totalNps = 0;

    avaliacoes.forEach(a => {
      if (a.nota_usabilidade) {
        somaUsabilidade += a.nota_usabilidade;
        countUsabilidade++;
      }
      if (a.velocidade_ia) {
        somaVelocidade += a.velocidade_ia;
        countVelocidade++;
      }
      if (a.precisao_ia) {
        somaPrecisao += a.precisao_ia;
        countPrecisao++;
      }
      if (a.nps !== null && a.nps !== undefined) {
        totalNps++;
        if (a.nps >= 9) promotores++;
        else if (a.nps <= 6) detratores++;
        else neutros++;
      }
    });

    const mediaUsabilidade = countUsabilidade ? (somaUsabilidade / countUsabilidade).toFixed(1) : '0.0';
    const mediaVelocidade = countVelocidade ? (somaVelocidade / countVelocidade).toFixed(1) : '0.0';
    const mediaPrecisao = countPrecisao ? (somaPrecisao / countPrecisao).toFixed(1) : '0.0';
    const npsScore = totalNps ? Math.round(((promotores - detratores) / totalNps) * 100) : 0;

    const stats = {
      totalAvaliacoes,
      mediaUsabilidade,
      mediaVelocidade,
      mediaPrecisao,
      npsScore,
      promotores,
      detratores,
      neutros,
      totalNps,
      totalFeedbacks: feedbacks.length,
      feedbacksPorCategoria: {
        bug: feedbacks.filter(f => f.categoria === 'bug').length,
        erro_ia: feedbacks.filter(f => f.categoria === 'erro_ia').length,
        interface: feedbacks.filter(f => f.categoria === 'interface').length,
        ideia: feedbacks.filter(f => f.categoria === 'ideia').length
      }
    };

    return res.status(200).json({
      success: true,
      stats,
      avaliacoes,
      feedbacks
    });
  } catch (error) {
    console.error('Erro no painel administrativo:', error);
    return res.status(500).json({
      error: 'Erro interno ao consultar dados administrativos.',
      details: error.message
    });
  }
}
