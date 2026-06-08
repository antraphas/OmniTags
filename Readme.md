# OmniTags - Ferramenta para Auxílio do uso de tags no time de Suporte Anota.AI - Versão em Desenvolvimento

## 1. Visão Geral
O **OmniTags** é uma extensão inteligente para Google Chrome desenvolvida especificamente para operar em conjunto com a plataforma Freshdesk / Freshchat. O objetivo central do sistema é atuar como um copiloto autônomo de triagem, capaz de ler históricos inteiros de conversas com clientes, interpretar o contexto e sugerir, de forma cirúrgica, as "Tags" de categorização mais adequadas para o chat.

O sistema elimina o trabalho braçal e repetitivo do agente humano de classificar conversas manualmente, reduzindo o tempo de fechamento de chats e mitigando o erro humano na geração de métricas de atendimento.

---

## 2. Arquitetura e Motor de Inteligência Artificial

A espinha dorsal do OmniTags é um motor de inferência chamado **Motor em Cascata (Fallback Engine)**, acoplado a um mecanismo avançado de Extração Visual (Modo Deus) e um ciclo de aprendizado local (Feedback Loop).

### 2.1. O Motor em Cascata (Fallback Engine)
Para garantir disponibilidade próxima a 100%, o sistema nunca confia em apenas uma única inteligência artificial. O OmniTags orquestra múltiplos provedores LLM (Large Language Models) simultaneamente:
- **Google Gemini** (gemini-2.5-flash): Modelo de altíssima velocidade e janela de contexto massiva (até 1 Milhão de tokens).
- **OpenRouter** (Llama 3.3, Qwen 2.5, etc.): Hub que roteia para as inteligências artificiais abertas mais poderosas do planeta.
- **Groq** (Llama-3.1): Hardware especializado que processa inferência em velocidade recorde (time-to-first-token quase zero).

**Como funciona a cascata:**
1. O usuário define o provedor "Primário".
2. O sistema enfileira o modelo primário e, em seguida, os secundários. Os modelos desativados no painel (marcados com ⊘) são ignorados.
3. Se o provedor principal demorar mais de **30 segundos** (Timeout) ou retornar erro (excesso de requisições, API fora do ar), o sistema **pula automaticamente** para o próximo provedor na fila de forma invisível.
4. Isso garante que a extensão sempre entregue o resultado, não importa a instabilidade da nuvem.

### 2.2. Extração de Texto Inteligente e Privacidade (Minificação)
Antes de enviar a conversa do cliente para a IA, o OmniTags processa o texto do DOM do CRM:
- **Limpeza de Lixo Eletrônico:** Assinaturas, horas, e mensagens de sistema automáticas ("Atendimento transferido") são suprimidas.
- **Censura de Dados Sensíveis (LGPD):** Expressões regulares substituem CPFs, CNPJs, e-mails, CEPs, números de cartão e telefones pela string `[DADO OCULTO]`.
- **Compressão (Minificação):** Se a conversa for gigantesca, o OmniTags extrai apenas a "Essência", enxugando as mensagens para não estourar o limite de tokens da API e baratear custos.

---

## 3. O "Modo Deus" (Extração Visual Absoluta)

O Freshdesk / Freshchat utiliza componentes web muito blindados (Web Components / Shadow DOM) onde o estado de programação das tags não é publicamente visível. 
Para contornar as barreiras do código-fonte do CRM e auditar quais tags o agente humano selecionou de fato, desenvolvemos a **Extração Visual Absoluta** (conhecida internamente como Modo Deus).

**A Regra do Modo Deus:**
1. A extensão extrai especificamente os **pixels de texto visíveis a olho nu (`innerText`)** de dentro da caixa de tags selecionadas.
2. O texto capturado é cruzado metodicamente (ordenado por tamanho de string) com o Banco de Dados oficial de tags da sua empresa (`tagsData`).
3. O sistema ignora implacavelmente menus ocultos (dropdowns) com listagens de tags. Somente se o nome exato da tag for ativamente renderizado na tela do atendente, a extensão contabiliza como uma tag real.

---

## 4. O Sistema de Aprendizado (Feedback Loop Humano-IA)

A Inteligência Artificial nem sempre acerta o contexto de um negócio muito específico no primeiro dia. Para resolver isso, o OmniTags conta com o fluxo de reforço através do botão de Cérebro 🧠 (Salvar Aprendizado).

**A lógica matemática do aprendizado:**
1. A IA lê o texto e sugere as tags "X" e "Y".
2. O agente humano lê, apaga a "Y" (pois está errada) e adiciona a "Z". As tags reais no CRM agora são "X" e "Z".
3. O usuário finaliza clicando no 🧠.
4. O *Modo Deus* é ativado e enxerga que o gabarito oficial é "X" e "Z". Ele compara isso com a previsão da máquina ("X" e "Y").
5. O sistema salva localmente a memória dessa conversão.
6. No futuro, ao enviar novos prompts para a IA, o sistema anexa o "Dossiê Histórico": *"No passado, em uma conversa com esse padrão semântico, eu achei que era Y, mas o humano exigiu Z. Ajuste o comportamento."*

O botão do cérebro é a única forma de alimentar o **Painel de Acurácia**, gerando a métrica exata de Taxa de Acertos no Dashboard.

---

## 5. Interface de Usuário e Dashboard Profissional

A extensão fornece duas interfaces para máxima produtividade:

**1. O Widget Injetável (Front-end no Freshdesk):** Renderizado discretamente abaixo da caixa de propriedades da conversa. Contém o botão de Ação, as sugestões interativas que autoinjetam a tag no banco do CRM quando clicadas, e um avançado "Mini-Console Flutuante". O Mini-Console é uma janela pop-up temporária que fornece transparência total do que a IA está realizando no background, exibindo os tempos de requisição (Ex: `⏱ 2.4s`, `TIMEOUT: Abortado`).

**2. O Painel de Comando (Popup da Extensão):** Acessível via ícone do navegador. Oferece:
- **Métricas de Bordo:** Quantidade de chats auditados, contador contínuo de Tokens trafegados e % de precisão da IA.
- **Painel de Controle de APIs e Modelos:** Onde chaves privadas são armazenadas com segurança. 
- **Gestão de Prioridades:** Capacidade de ligar/desligar modelos de linguagem (`◉` -> `⊘`) em tempo real sem excluí-los.
- **Backup Data-Center:** Exportação manual (formato `.json`) de todos os metadados de aprendizado gerados pela operação diária.

---

## 6. Procedimento Operacional Padrão (SOP de Uso)

1. **Abra a Conversa do Cliente** no Freshdesk e leia rapidamente o contexto.
2. Localize a janela **OmniTags** do lado direito inferior.
3. Clique em **Ler Conversa**. O pop-up do *Mini-Console* aparecerá exibindo o handshake com os servidores de IA e o tempo cronometrado.
4. Após o retorno, **pílulas azuis** de tags vão surgir. Clique nas pílulas que você considerar corretas. A extensão fará a injeção nativa delas no campo de tags do Freshdesk.
5. Audite o resultado final. Se faltou alguma tag específica, adicione-a manualmente pelo teclado.
6. **(Passo Crítico)**: Com as tags do atendimento validadas, clique no **Ícone do Cérebro (🧠)**. Isso engatilhará o log interno para registrar sua decisão e treinar o peso lógico do OmniTags para a próxima rodada.

---

<div align="center">
  Desenvolvido por [<Raphael Suarez/>](https://www.raphaelsuarez.com.br) - Assistente de Experiencia Junior
</div>
