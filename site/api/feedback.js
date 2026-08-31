import { getDbPool } from './db.js';

export default async function handler(req, res) {
  // Configura headers CORS
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
    const {
      nome,
      email,
      categoria,
      bug_tipo,
      bug_descricao,
      bug_link_ticket,
      ia_erro_interpretacao,
      ia_tag_correta,
      ia_clicou_cerebro,
      ui_problema,
      ui_sugestao_melhoria,
      ideia_sugestao,
      ideia_beneficio
    } = req.body || {};

    if (!nome || !email || !categoria) {
      return res.status(400).json({ error: 'Nome, E-mail e Categoria do relato são obrigatórios.' });
    }

    const pool = getDbPool();
    const query = `
      INSERT INTO feedbacks (
        nome, email, categoria, bug_tipo, bug_descricao, bug_link_ticket,
        ia_erro_interpretacao, ia_tag_correta, ia_clicou_cerebro,
        ui_problema, ui_sugestao_melhoria, ideia_sugestao, ideia_beneficio
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nome.trim(),
      email.trim(),
      categoria,
      bug_tipo || null,
      bug_descricao || null,
      bug_link_ticket || null,
      ia_erro_interpretacao || null,
      ia_tag_correta || null,
      ia_clicou_cerebro || null,
      ui_problema || null,
      ui_sugestao_melhoria || null,
      ideia_sugestao || null,
      ideia_beneficio || null
    ];

    const [result] = await pool.execute(query, values);

    return res.status(201).json({
      success: true,
      message: 'Feedback/Relato enviado com sucesso! Nossa engenharia já foi notificada.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao salvar feedback:', error);
    return res.status(500).json({
      error: 'Erro interno ao salvar no banco de dados. Tente novamente mais tarde.',
      details: error.message
    });
  }
}
