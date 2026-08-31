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
      tempo_uso,
      nota_usabilidade,
      posicionamento_tags,
      utilidade_console,
      velocidade_ia,
      precisao_ia,
      aprendizado_cerebro,
      impacto_tempo,
      nps,
      comentarios_adicionais
    } = req.body || {};

    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e E-mail são obrigatórios.' });
    }

    const pool = getDbPool();
    const query = `
      INSERT INTO avaliacoes (
        nome, email, tempo_uso, nota_usabilidade, posicionamento_tags,
        utilidade_console, velocidade_ia, precisao_ia, aprendizado_cerebro,
        impacto_tempo, nps, comentarios_adicionais
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nome.trim(),
      email.trim(),
      tempo_uso || null,
      nota_usabilidade ? Number(nota_usabilidade) : null,
      posicionamento_tags || null,
      utilidade_console || null,
      velocidade_ia ? Number(velocidade_ia) : null,
      precisao_ia ? Number(precisao_ia) : null,
      aprendizado_cerebro || null,
      impacto_tempo || null,
      nps !== undefined && nps !== null && nps !== '' ? Number(nps) : null,
      comentarios_adicionais || null
    ];

    const [result] = await pool.execute(query, values);

    return res.status(201).json({
      success: true,
      message: 'Avaliação enviada com sucesso! Obrigado pelo feedback.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    return res.status(500).json({
      error: 'Erro interno ao salvar no banco de dados. Tente novamente mais tarde.',
      details: error.message
    });
  }
}
