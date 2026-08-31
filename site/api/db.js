import mysql from 'mysql2/promise';

let pool;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '137.131.132.59',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'makay',
      password: process.env.DB_PASSWORD || '100491Rt**',
      database: process.env.DB_NAME || 'omniforms',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000
    });
  }
  return pool;
}
