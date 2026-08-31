# OmniTag Web - Portal Oficial & Documentação Interativa

Portal web moderno em **React + Vite + Tailwind CSS** para distribuição, download e onboarding da extensão **OmniTag v2.6**.

## 🚀 Como Executar Localmente

```bash
# 1. Acesse a pasta do projeto
cd "extension/Site OmniTag"

# 2. Instale as dependências (caso não tenha instalado)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O site abrirá em `http://localhost:3000`.

---

## 🌐 Como Fazer Deploy na Vercel

O projeto já inclui o arquivo `vercel.json` pré-configurado para build automático com Vite.

### Opção 1: Via Vercel CLI (Mais Rápido)
```bash
# Na pasta 'extension/Site OmniTag', execute:
npx vercel
```
Siga as instruções rápidas no terminal e seu site estará online em segundos! Para produção:
```bash
npx vercel --prod
```

### Opção 2: Via GitHub / Dashboard da Vercel
1. Suba esta pasta para um repositório no seu GitHub.
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório.
3. Se o projeto estiver dentro de uma subpasta, defina **Root Directory** como `extension/Site OmniTag`.
4. As configurações de build são detectadas automaticamente:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **Deploy**.

---

## ✨ Recursos do Site
- 📥 **Botão de Download Direto** integrado ao link do Blob Storage Vercel (`OmniTag 2.6.rar`).
- 🧭 **Guia de Instalação Interativo por Navegador** com abas dedicadas para **Google Chrome, Opera / Opera GX, Brave, Edge e Mozilla Firefox**.
- 🔍 **Galeria Visual de Telas** com modal interativo **Lightbox** (expansão em tela cheia).
- 🔑 **Passo a Passo de Chaves de API** para Google Gemini AI Studio, Groq Cloud e OpenRouter.
- 🛡️ **Destaques de Engenharia e LGPD**.
