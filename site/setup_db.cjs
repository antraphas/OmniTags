const mysql = require('mysql2/promise');

async function createTables() {
  const connection = await mysql.createConnection({
    host: '137.131.132.59',
    port: 3306,
    user: 'makay',
    password: '100491Rt**',
    database: 'omniforms'
  });

  const createAvaliacoes = `
    CREATE TABLE IF NOT EXISTS avaliacoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      tempo_uso VARCHAR(100),
      nota_usabilidade INT,
      posicionamento_tags VARCHAR(100),
      utilidade_console VARCHAR(100),
      velocidade_ia INT,
      precisao_ia INT,
      aprendizado_cerebro VARCHAR(100),
      impacto_tempo VARCHAR(100),
      nps INT,
      comentarios_adicionais TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  const createFeedbacks = `
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      categoria VARCHAR(100) NOT NULL,
      bug_tipo VARCHAR(150),
      bug_descricao TEXT,
      bug_link_ticket VARCHAR(500),
      ia_erro_interpretacao TEXT,
      ia_tag_correta VARCHAR(255),
      ia_clicou_cerebro VARCHAR(50),
      ui_problema TEXT,
      ui_sugestao_melhoria TEXT,
      ideia_sugestao TEXT,
      ideia_beneficio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  await connection.execute(createAvaliacoes);
  console.log('Tabela avaliacoes criada com sucesso!');
  await connection.execute(createFeedbacks);
  console.log('Tabela feedbacks criada com sucesso!');

  const [tables] = await connection.execute('SHOW TABLES;');
  console.log('Tabelas existentes no banco:', tables);

  await connection.end();
}

createTables().catch(console.error);
