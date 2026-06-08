const tagsData = [
  {
    "name": "ação-beamer",
    "description": "Cliente fala a respeito de comunicações realizadas via beamer."
  },
  {
    "name": "acesso-remoto",
    "description": "Acesso remoto realizado."
  },
  {
    "name": "assunto-diverso",
    "description": "O cliente informa claramente o que deseja, porém o tema não se enquadra em nenhuma tag existente ou categoria de atendimento prevista (inclui demandas fora do escopo do suporte e/ou demandas não categorizadas)."
  },
  {
    "name": "cliente-leigo",
    "description": "Utilizar quando o cliente demonstrar baixa maturidade tecnológica."
  },
  {
    "name": "insatisfação",
    "description": "Cliente demonstra insatisfação com sistema."
  },
  {
    "name": "instabilidade",
    "description": "Sistema ou ferramentas ligadas ao sistema apresentam instabilidade, sempre utilizada com outra tag para demonstrar o assunto da instabilidade."
  },
  {
    "name": "liberação-teste",
    "description": "Liberação de planos de teste ou aumento no período de trial."
  },
  {
    "name": "prob-adoção",
    "description": "Utilizar quando ocorrerem problemas no processo de adoção (após os 5 primeiros pedidos)."
  },
  {
    "name": "prob-ativação",
    "description": "Utilizar quando ocorrerem problemas durante a fase de ativação (até o 5º pedido)."
  },
  {
    "name": "prob-vendas",
    "description": "Utilizar quando forem identificados erros/problemas no processo de vendas."
  },
  {
    "name": "reativação-suporte",
    "description": "Utilizar quando o cliente reativa o sistema pelo minha conta durante atendimento no chat."
  },
  {
    "name": "retencao-churn",
    "description": "Utilizar quando o cliente é encaminhado ao suporte retenção."
  },
  {
    "name": "retencao-offline",
    "description": "Utilizar quando o suporte retenção (Gerente de Contas) estiver offline (fora do horário de atendimento), e o cliente não puder ser transferido diretamente ao time."
  },
  {
    "name": "retido",
    "description": "Desistência do churn, com o problema solucionado no atendimento."
  },
  {
    "name": "sem-especificação",
    "description": "Cliente chama, não responde e não sabemos a demanda dele. Use esta tag quando o cliente é um \"fantasma\" desde o início."
  },
  {
    "name": "sem-resposta",
    "description": "Cliente disse o que queria, porém não respondeu por 20 minutos (15+5) e o atendimento travou por falta de retorno dele. Regra: Se houve qualquer execução ou resolução técnica, classifique pelo serviço realizado."
  },
  {
    "name": "sugestão",
    "description": "Sugestões de atualizações ou novas funcionalidades para o time de desenvolvimento."
  },
  {
    "name": "supervisor",
    "description": "Cliente solicita atendimento de supervisão."
  },
  {
    "name": "termos-de-uso",
    "description": "Quando cliente solicitar o \"contrato\" ou os termos de uso."
  },
  {
    "name": "troca-de-titularidade",
    "description": "Quando for instruído ao cliente solicitar troca de titularidade via minha conta. (Atualmente válido somente para clientes Tuna, clientes Ifood Pago pode ser utilizado \"ifoodpago-dados\"."
  },
  {
    "name": "vendas",
    "description": "Contratação de nova unidade/cliente novo."
  },
  {
    "name": "suporte-balança",
    "description": "Auxílio relacionado à nova funcionalidade balança (informações, configurações, reclamações)"
  },
  {
    "name": "bug-balança",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-cashback",
    "description": "Qualquer tipo de suporte relacionado à funcionalidade \"cashback\"."
  },
  {
    "name": "bug-cashback",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-cupom",
    "description": "Dúvidas ou suporte na criação / edição de cupons."
  },
  {
    "name": "bug-cupom",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-digital",
    "description": "Suporte relacionado as configurações de exibição do cardápio digital, assim como sobre o uso do mesmo. Deve ser usada nos casos em que é alterado o layout via root (de bloco para lista ou vice-versa). OBS: Se a ação realizada tiver sido relacionada ao gestor de cardápio, e não ao Cardápio Digital, buscar pelas tags específicas de gestor de cardápio."
  },
  {
    "name": "bug-digital",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-entregaai",
    "description": "Qualquer tipo de suporte relacionado ao EntregaAi."
  },
  {
    "name": "bug-entregaai",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-fidelidade",
    "description": "Dúvidas ou suporte sobre o plano fidelidade."
  },
  {
    "name": "bug-fidelidade",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-frota-garantida",
    "description": "Utilizar em chats relacionado a Frota Garantida, sendo dúvida, suporte, feedbacks e etc."
  },
  {
    "name": "bug-frota-garantida",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-funil-conversão",
    "description": "Utilizar em chats relacionado ao Funil de Conversão, sendo dúvida, suporte, feedbacks e etc."
  },
  {
    "name": "bug-funil-conversão",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-garçom",
    "description": "Dúvidas, cadastro, verificação de registro ou ajustes relacionados ao modo garçom."
  },
  {
    "name": "bug-garçom",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-mesa",
    "description": "Utilizar quando forem verificados pedidos mesa e/ou explicado o funcionamento da ferramenta."
  },
  {
    "name": "bug-mesa",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-pdv",
    "description": "Dúvidas sobre a utilização do PDV."
  },
  {
    "name": "bug-pdv",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-pedido",
    "description": "Utilizar nos casos onde pedidos são verificados. Utilizar também quando forem feitos ajustes na configuração dos pedidos ex: sequência do pedido, cancelar pedido, som dos pedidos. OBS: Certifique-se de que não há tag mais específica para o assunto tratado."
  },
  {
    "name": "bug-pedido",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-programa",
    "description": "Utilizar quando o sistema for atualizado, reiniciado ou for feita a limpeza de cache. Pode ser usada também para quando o cliente recebe ajuda para dar zoom no programa ou para arquivar as conversas do whatsapp (configuração do desktop)."
  },
  {
    "name": "bug-programa",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-relatórios",
    "description": "Verificação ou explicação sobre o uso dos relatórios. Pode ser usada também para contemplar situações relacionadas a opção \"configurações>meus clientes (novo)."
  },
  {
    "name": "bug-relatórios",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-robô",
    "description": "Utilizar apenas em casos de ajustes ou informações relacionadas as respostas ou comportamento do robô. ATENÇÃO: Em caso de o robô não respondendo, os erros normalmente são causados por falhas no computador ou no programa. A tag é apenas para a configuração do robô em si. OBS: Em casos de recuperador de vendas, use a tag específica \"suporte-recuperador-vendas\"."
  },
  {
    "name": "bug-robô",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-satisfação",
    "description": "Utilizar quando o cliente solicitar ajuda ou tiver dúvidas sobre o funcionamento da ferramenta de satisfação. O envio de pesquisa do robô, sobre a anota ai, não se inclui no satisfação."
  },
  {
    "name": "bug-satisfação",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-sob-demanda",
    "description": "Deve ser usada em todos os casos de chat relacionados à integração Sob Demanda ou a assuntos correlacionados a este tema."
  },
  {
    "name": "bug-sob-demanda",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "suporte-cloudia",
    "description": "Cliente recebe qualquer tipo de suporte relacionado ao cloudia."
  },
  {
    "name": "suporte-comandas",
    "description": "Auxílio relacionado ao sistema de comandas (informações, configurações, reclamações)."
  },
  {
    "name": "suporte-configurações-estabelecimento",
    "description": "Utilizar para qualquer suporte relacionado ao submenu “Estabelecimento”, quando não houver uma tag mais específica. Exemplos: Horário de funcionamento, Endereço, Tempo de entrega"
  },
  {
    "name": "suporte-escuta-ai",
    "description": "Cliente recebe qualquer tipo de suporte relacionado à funcionalidade ''EscutaAi''."
  },
  {
    "name": "suporte-estoque",
    "description": "Cliente solicita liberação, explicação ou auxílio referente à ferramenta de estoque (esta tag se aplica ao ''contador de estoque'' e não inclui estoque da GA)."
  },
  {
    "name": "suporte-integração-anúncios",
    "description": "Qualquer suporte às funcionalidades do Integração de anúncios do admin."
  },
  {
    "name": "suporte-minha-conta",
    "description": "Utilizar quando o cliente precisar de suporte relacionado ao submenu “Minha Conta”, desde que não exista uma tag mais específica. (ex: upsell, planos e afins, seguir utilizando tag financeira)."
  },
  {
    "name": "suporte-recuperador-vendas",
    "description": "Utilizar para qualquer tipo de suporte relacionado à funcionalidade Recuperador de Vendas."
  },
  {
    "name": "suporte-totem",
    "description": "Suporte ao totem de forma geral ou interesse em aquisição."
  },
  {
    "name": "bug-configurações",
    "description": "Quando constatado bug nas configurações do admin (regiões de atendimento, horários de funcionamento, formas de pagamento, etc)."
  },
  {
    "name": "bug-gestor-cardápio",
    "description": "Utilizar quando for identificado bug no Gestor de Cardápio."
  },
  {
    "name": "bug-kanban",
    "description": "Utilizar quando for identificado bug na tela de pedidos (Kanban) Exemplo: Pedidos só aparecem após atualizar a tela."
  },
  {
    "name": "bug-whatsapp",
    "description": "Problema diretamente vinculados ao sistema Whatsapp, atualizações ou configurações."
  },
  {
    "name": "bug-atualização",
    "description": "Utilizar apenas quando for informado que um determinado erro ocorreu após atualização geral."
  },
  {
    "name": "suporte-impressora",
    "description": "Configuração de impressoras diferentes para setores distintos; Ajustes de características específicas de impressão; Configuração simples de impressora que não envolva setorização. Pode ser utilizada nos casos em que a impressão sai duplicada devido ao fato de estar aberto dois \"admins\" no pc do cliente e também no auxílio de impressoras mobile."
  },
  {
    "name": "bug-impressora",
    "description": "Bugs referentes ao assunto acima."
  },
  {
    "name": "instalar-impressora",
    "description": "Instalação de impressora no computador do cliente."
  },
  {
    "name": "erro-impressora",
    "description": "Utilizar quando for confirmado que há um problema relacionado a impressora do cliente. Driver, cabo, bobina, guilhotina etc."
  },
  {
    "name": "erro-programa-impressão",
    "description": "Casos em que o problema de impressão é causado por erro no funcionamento do programa de impressão."
  },
  {
    "name": "agendamento",
    "description": "Dúvidas sobre agendamento, deseja configurar ou verificar pedidos agendados. Nesse último caso, pode ser utilizada junto a tag \"suporte-pedido\"."
  },
  {
    "name": "alteração-email-senha",
    "description": "Utilizar quando o cliente recebe ajuda na troca de senha ou e-mail. Pode ser usada tanto quando a troca é realizada diretamente, quanto quando o cliente é orientado sobre como alterar."
  },
  {
    "name": "bloqueio-cloudflare",
    "description": "Utilizar quando é solicitado o desbloqueio cloudfare."
  },
  {
    "name": "bloqueio-whatsapp",
    "description": "Utilizar quando o cliente informa ter o número do WhatsApp bloqueado."
  },
  {
    "name": "compre-mais",
    "description": "Dúvidas, criação ou configuração do compre+ ganhe+."
  },
  {
    "name": "computador",
    "description": "Utilizar em casos em que se verifica que os problemas que causam falha no sistema estão relacionados ao desempenho do computador ou conexão à internet."
  },
  {
    "name": "configurações-internas",
    "description": "Utilizada quando são feitos ajustes no root sem tag específica."
  },
  {
    "name": "domínio",
    "description": "Utilizar quando o cliente recebe suporte ou orientações sobre a configuração de domínio."
  },
  {
    "name": "entregador",
    "description": "Cliente tem dúvidas ou pede auxílio sobre a função \"entregador\"."
  },
  {
    "name": "Facebook-instagram",
    "description": "Utilizar quando cliente solicita suporte ao robô do facebook/instagram."
  },
  {
    "name": "gatilho-ativo",
    "description": "Cliente questiona se o sistema realiza disparo em massa de mensagens."
  },
  {
    "name": "google-meu-negocio",
    "description": "Orientações ou suporte diretamente sobre a ferramenta ''google meu negócio''."
  },
  {
    "name": "instalação",
    "description": "Instalação ou atualização dos programas no computador do cliente / instrução de instalação do celular."
  },
  {
    "name": "integração",
    "description": "Dúvidas ou auxílio na realização de integrações."
  },
  {
    "name": "kds",
    "description": "Utilizar quando o cliente precisar de suporte relacionado ao kds."
  },
  {
    "name": "LGPD-endereço",
    "description": "Constata-se algum tipo de problema relacionado com o armazenamento local de endereços."
  },
  {
    "name": "link-compartilhado",
    "description": "Utilizar depois de realizar todas as verificações necessárias e confirmar o compartilhamento do link."
  },
  {
    "name": "maquinona-garçom",
    "description": "Cliente recebe qualquer tipo de instrução ou suporte referente à funcionalidade \"App Garçom + Maquinona\"."
  },
  {
    "name": "mensagem-sazonal",
    "description": "Reclamações ou dúvidas especificamente sobre a mensagem de temporada do robô, seja ela de natal ou de algum feriado/comemoração específica."
  },
  {
    "name": "publicidade-cd-insatisfação",
    "description": "Cliente expressa qualquer feedback (positivo / negativo) ou insatisfação sobre o banner de publicidade do cardápio digital."
  },
  {
    "name": "qrcode",
    "description": "Dúvidas e suporte em geral a QR Code (geral ou mesa)."
  },
  {
    "name": "itens-proibidos",
    "description": "Utilizar quando o tema do chat estiver relacionado ao novo fluxo de controle de produtos ilícitos nos cardápios digitais da Anota AI."
  },
  {
    "name": "ajuste-produto",
    "description": "Alteração de nome, descrição, foto, montagem ou localização de item no cardápio. Usar também nos casos em que apenas orientamos o cliente sobre como realizar os ajustes."
  },
  {
    "name": "alteração-preço",
    "description": "Utilizar quando é realizada alteração de preço de item (simples ou promocional). Usar também nos casos em que apenas orientamos o cliente sobre como realizar a alteração de preço."
  },
  {
    "name": "cadastro-produto",
    "description": "Cadastro de itens no cardápio. Usar também nos casos em que apenas orientamos o cliente sobre como realizar o cadastro de produtos."
  },
  {
    "name": "clonar-cardápio",
    "description": "Utilizar quando for realizada clonagem do cardápio de uma unidade para outra."
  },
  {
    "name": "esgotar-produto",
    "description": "Esgotar ou liberar item no cardápio (referente ao botão \"esgotar\"). Usar também nos casos em que apenas orientamos o cliente sobre como esgotar/liberar o produto."
  },
  {
    "name": "importação-ifood",
    "description": "Explicações ou importação do cardápio do iFood."
  },
  {
    "name": "recuperar-cardápio",
    "description": "Utilizar quando for realizado backup e recuperação de cardápio de cliente."
  },
  {
    "name": "gestão-avançada-caixa",
    "description": "Cliente recebe qualquer tipo de ajuda ou informação sobre a parte de Caixa da Gestão avançada."
  },
  {
    "name": "gestão-avançada-estoque",
    "description": "Cliente recebe qualquer tipo de ajuda ou informação sobre a parte de Estoque da Gestão avançada."
  },
  {
    "name": "gestão-avançada-financeiro",
    "description": "Cliente recebe qualquer tipo de ajuda ou informação sobre a parte de Financeiro (menu), Compras e relatórios da Gestão avançada."
  },
  {
    "name": "gestão-avançada-nota-fiscal",
    "description": "Qualquer tipo de ajuda ou informação sobre a parte de Nota Fiscal da Gestão avançada."
  },
  {
    "name": "fin-addons",
    "description": "Informações ou suporte relacionados a addons/módulos extras, e que envolvam abertura de chamado para o time financeiro."
  },
  {
    "name": "fin-ajuste-vencimento",
    "description": "Cliente solicita alteração no vencimento da fatura."
  },
  {
    "name": "fin-bug-sincronização",
    "description": "Falha na sincronização do pagamento (ex.: pagamento no pix demorando a compensar; mensagem de cobrança em aberto no painel mesmo com pagamento em dia)."
  },
  {
    "name": "fin-churn-revertido",
    "description": "Cliente realiza o pagamento com mais de 20 dias de atraso (assinatura desativada), e é preciso gerar um ticket para o Financeiro."
  },
  {
    "name": "fin-comprovante",
    "description": "Cliente envia comprovante de pagamento válido e solicita liberação."
  },
  {
    "name": "fin-dúvida-assinatura",
    "description": "Dúvidas sobre assinatura em geral (vencimento, estorno, renovação, valor e compensação). Pode também ser utilizada nos casos de pagamento duplicado."
  },
  {
    "name": "fin-forma-pagamento",
    "description": "Alteração da forma de pagamento (de cartão para boleto, por exemplo). Seja para fatura geral, ou fatura específica."
  },
  {
    "name": "fin-indique-ganhe",
    "description": "Qualquer atendimento relacionado ao Indique e Ganhe."
  },
  {
    "name": "fin-instabilidade-superlogica",
    "description": "Problemas gerais relacionados à instabilidade do superlogica."
  },
  {
    "name": "fin-liberação-confiança",
    "description": "Pagamento da fatura está em atraso e o cliente solicita liberação em confiança."
  },
  {
    "name": "fin-liberação-negada",
    "description": "Cliente tem o pedido de liberação em confiança negado pelo suporte."
  },
  {
    "name": "fin-nota-fiscal",
    "description": "Dúvidas, problemas ao acessar a nota fiscal da fatura AnotaAI pelo admin ou e-mail, ou solicitação para alterar algum dado."
  },
  {
    "name": "fin-reajuste-valores-planos",
    "description": "Chats em que o cliente questione ou demonstre insatisfação relacionada ao reajuste dos valores dos planos."
  },
  {
    "name": "fin-reprocessar-pagamento",
    "description": "Cliente altera o cartão ou libera limite e solicita que o pagamento seja reprocessado."
  },
  {
    "name": "fin-segunda-via",
    "description": "Cliente solicita boleto ou chave pix para pagamento da fatura."
  },
  {
    "name": "fin-upsell-minha-conta",
    "description": "Cliente, sob orientação, realiza um upsell pela aba minha conta. (Atualmente válido somente de Premium para GA)"
  },
  {
    "name": "downsell",
    "description": "Cliente desejar realizar downsell."
  },
  {
    "name": "dúvida-planos",
    "description": "Quando cliente tiver dúvidas sobre planos (valores e funcionalidades)."
  },
  {
    "name": "upsell",
    "description": "Upsell não pôde ser feito pelo Minha Conta e teve que ser encaminhado como ticket para o time financeiro ou farmer."
  },
  {
    "name": "carteira-digital",
    "description": "Cliente solicita uso, desativação ou qualquer auxílio referente aos pagamentos da carteira digital/cartão de crédito."
  },
  {
    "name": "fraude-pix",
    "description": "Cliente teve sua conta de pagamento online bloqueada ou houve algum problema no repasse, onde constata-se possibilidade de fraude."
  },
  {
    "name": "ifoodpago-análise",
    "description": "Utilizar quando é feito um cálculo de repasses ou análise de pedidos POL iFood Pago."
  },
  {
    "name": "ifoodpago-condições-repasse",
    "description": "Utilizar quando o atendimento envolver dúvidas, orientações ou explicações sobre as condições de repasse IFP, tanto para Pix quanto para cartão de crédito e carteiras digitais."
  },
  {
    "name": "ifoodpago-dados",
    "description": "Utilizar sempre que houver orientação ou solicitação de alteração de dados, como troca de conta bancária para repasse ou alteração de titularidade."
  },
  {
    "name": "ifoodpago-insatisfação",
    "description": "Utilizar exclusivamente quando o cliente manifestar insatisfação que não esteja relacionada a um problema técnico ou operacional tratável pelas outras tags. Exemplos: \"As taxas são muito altas\", \"Não concordo em não poder desativar\", \"O iFood Pago não é bom\", etc."
  },
  {
    "name": "ifoodpago-portal",
    "description": "Utilizar quando for ofertado suporte relacionado ao uso ou acesso do Portal IFP, bem como em casos de erro na geração de relatórios ou na tela de transações (estornos, transações não processadas, etc)."
  },
  {
    "name": "ifoodpago-repasse-retido",
    "description": "Utilizar em qualquer situação que envolva problemas com repasse, como falha de depósito, valores divergentes, repasse estornado ou não recebido."
  },
  {
    "name": "pix-manual",
    "description": "Cliente solicita ou questiona sobre a possibilidade de utilizar sua própria chave pix nas formas de pagamento."
  },
  {
    "name": "pix-online",
    "description": "Cliente tem dúvidas ou foi auxiliado de modo geral sobre o pix online."
  },
  {
    "name": "taxa-conveniência",
    "description": "Utilizada para assuntos relacionados à taxa de conveniência do pagamento online."
  },
  {
    "name": "tuna-insatisfação",
    "description": "Cliente expressa insatisfação ou feedback negativo sobre a Tuna."
  },
  {
    "name": "tuna-suporte",
    "description": "Instruções ou auxílio referente ao acesso ou alteração de dados na Tuna, ou informações relacionadas a repasses."
  }
];
