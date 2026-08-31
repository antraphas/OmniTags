import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import avaliacaoHandler from './api/avaliacao.js';
import feedbackHandler from './api/feedback.js';
import adminHandler from './api/admin.js';

function apiPlugin() {
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        let body = {};
        if (req.method === 'POST') {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch (e) {
              body = {};
            }
          }
        }

        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        const mockReq = {
          ...req,
          body,
          query: Object.fromEntries(url.searchParams),
          method: req.method
        };

        try {
          if (url.pathname === '/api/avaliacao') {
            await avaliacaoHandler(mockReq, res);
          } else if (url.pathname === '/api/feedback') {
            await feedbackHandler(mockReq, res);
          } else if (url.pathname === '/api/admin') {
            await adminHandler(mockReq, res);
          } else {
            res.status(404).json({ error: 'Endpoint não encontrado' });
          }
        } catch (err) {
          console.error('API Error:', err);
          res.status(500).json({ error: err.message });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
