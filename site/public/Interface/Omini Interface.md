# OmniTags: Guia de Interface e Usabilidade

Este documento detalha a interface gráfica, a usabilidade e a arquitetura visual da extensão **OmniTags** (versão 2.3), sendo a referência oficial para o treinamento de novos usuários e compreensão gerencial do sistema. O guia cobre desde o widget que o atendente utiliza no seu dia a dia até o painel administrativo de configurações.

---

## 1. O Widget de Operação (A Visão do Atendente)

A interface primária do OmniTags não obriga o atendente a sair da sua tela de trabalho. Ela é injetada de forma não-intrusiva diretamente no CRM (Freshdesk/Freshchat).

![Widget em Funcionamento](./LM/Interface%20em%20funcionamento.fw.png)
*Arquivo de Referência: `Interface em funcionamento.fw.png`*

**Elementos da Interface e Usabilidade:**
*   **O Botão "Ler Conversa":** É o gatilho principal. Com um clique, a extensão extrai, limpa (via LGPD) e envia todo o histórico de chat para o motor de IA em nuvem.
*   **O Mini-Console Flutuante (Terminal Negro):** Para evitar que o atendente fique "no escuro" esperando, a interface possui um terminal flutuante (log) que traz total transparência ao processo. Ele exibe, com carimbos de tempo (ex: `[14:55:10]`), o status exato da extração e do roteamento.
    *   *Métricas de Tempo:* No canto superior direito do console, há um cronômetro indicando a latência do provedor (`⏱ 1.4s` ou `✅ 6.1s`).
    *   *Logs de Cascata:* O log informa exatamente qual modelo foi chamado (ex: `gemini-2.5-flash`).
*   **Pílulas de Sugestão (Badges):** Assim que a IA responde, o widget gera botões azuis (ex: `troca-de-titularidade`). O atendente só precisa clicar no botão para injetar a tag no ticket.
*   **O Botão do Cérebro (🧠):** O botão de "Salvar Aprendizado". Fundamental para a evolução da ferramenta. É clicado pelo atendente caso ele tenha tido que corrigir a sugestão da Inteligência Artificial.

---

## 2. O Dashboard Administrativo (Visão Gerencial)

Acessado clicando no ícone da extensão no navegador, o painel principal (*Dashboard*) entrega métricas em tempo real sobre a eficiência da ferramenta e consumo de infraestrutura.

![Dashboard Principal](./LM/tela1.png)
*Arquivo de Referência: `tela1.png`*

**Elementos da Interface e Usabilidade:**
*   **Estatísticas Rápidas (Cards Superiores):** 
    *   *Chats Analisados:* Volume total de chamadas feitas à IA.
    *   *Taxa de Acerto & Acertos/Erros:* Uma métrica implacável que compara o que a IA sugeriu contra as correções finais do humano no CRM (via "Modo Deus"). Exibe de forma transparente se o modelo está performando bem (ex: `11%` de acerto, `2` corretas vs `17` erros).
    *   *Tokens Usados:* Estimativa volumétrica de "banda" consumida na IA, essencial para controle de custos (ex: `50.2k` tokens).
*   **Gráfico de Uso por Provedor:** Uma barra de progresso visual que divide qual provedor está suportando a carga principal (ex: grande volume no `gemini` com 42.9k tokens, e a reserva `groq` com 7.3k).
*   **Rodapé Técnico:** Informa o último provedor e modelo utilizados e a última medição de latência (`Tempo: 10.0s`), além do botão de risco para `Resetar Métricas`.

---

## 3. Gestão da Cascata: Configuração de Provedores

A aba de configurações é o coração da resiliência (Alta Disponibilidade) do OmniTags. É aqui que o motor em cascata é moldado.

![Aba de Configuração - Visão Geral](./LM/tela2.png)
*Arquivo de Referência: `tela2.png`*

O sistema permite habilitar ou desabilitar instâncias inteiras de Provedores de IA através de *Toggles* (interruptores liga/desliga), incluindo Google Gemini, Groq, OpenRouter e Toqan (iFood AI Platform).

### 3.1. Google Gemini (O Padrão)
![Configuração Gemini](./LM/tela3.png)
*Arquivo de Referência: `tela3.png`*
*   **Gestão de Chaves de API:** Interface segura para injeção de múltiplas *API Keys*, permitindo redundância até de chaves caso uma atinja o limite financeiro.
*   **Fila de Modelos:** Permite listar modelos (ex: `gemini-2.5-flash`) definindo a prioridade matemática do roteamento.

### 3.2. Groq (Processamento Rápido)
![Configuração Groq](./LM/tela4.png)
*Arquivo de Referência: `tela4.png`*
*   O Groq funciona de forma idêntica à interface do Gemini, mas com modelos open-source otimizados para latência zero (ex: `llama-3.3-70b-versatile`).

### 3.3. OpenRouter (Hub de Modelos Open-Source)
![Configuração OpenRouter](./LM/tela5.png)
*Arquivo de Referência: `tela5.png`*
*   Demonstra a verdadeira flexibilidade da arquitetura. O campo de modelos aceita uma variedade massiva de nomenclaturas customizadas (ex: `z-ai/glm-4.5-air:free`, `qwen/qwen3-coder:free`, etc).

### 3.4. Toqan (iFood AI Platform - Roteamento Interno)
![Configuração Toqan](./LM/tela6.png)
*Arquivo de Referência: `tela6.png`*
*   A interface do Toqan possui um diferencial: além da *API Key* e do *Nome do Modelo*, ela expõe o campo customizável de **URL da API (Base URL)**, permitindo apontar a extensão para servidores dedicados e ambientes empresariais locais (`https://api.coco.prod.toqan.ai/api`).

---

## 4. O Cérebro: Backup e Histórico de Aprendizado

A aba de **Backup** garante que o capital intelectual (o aprendizado da IA gerado pelo feedback diário humano) não seja perdido ou fique preso apenas em um navegador.

![Backup - Exportação e Importação](./LM/tela7.png)
*Arquivo de Referência: `tela7.png`*

*   **Painel de Exportação:** Um grande cérebro animado mostra o volume de memórias capturadas (ex: `2 correções salvas`). Os botões de `Exportar Backup` (baixa um arquivo `.json` completo contendo as métricas, aprendizados e chaves) e `Importar Backup` viabilizam a portabilidade do motor entre as máquinas da equipe.

![Histórico de Correções](./LM/tela8.png)
*Arquivo de Referência: `tela8.png`*

*   **Log de Auditoria de Erros (Correções Salvas):** Rolando a página, a liderança possui acesso a um feed de auditoria extremamente visual sobre as falhas da IA.
    *   *O que é exibido:* A data, a hora e um trecho censurado da conversa que gerou a confusão no LLM.
    *   *Gabarito Visual:* O painel contrasta as pílulas com fundo vermelho escuro (o que a **IA sugeriu de errado**, ex: `clonar-cardápio`, `ifoodpago-portal`) e com fundo verde (o que o **humano confirmou como Correto** através do CRM, ex: `importação-ifood`, `integração`).
    *   Esta interface de transparência absoluta permite ao gestor julgar se a IA está apenas "confusa" ou se o prompt inicial de negócio precisa de ajustes. O botão de Lixeira permite apagar "falsas memórias" que o atendente possa ter treinado por engano.
