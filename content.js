// Stop words comuns em português + termos genéricos de atendimento
const stopWords = new Set(['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'elas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses', 'pelas', 'este', 'fosse', 'dele', 'tu', 'te', 'vocês', 'vos', 'lhes', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos', 'nossas', 'dela', 'delas', 'esta', 'estes', 'estas', 'aquele', 'aquela', 'aqueles', 'aquelas', 'isto', 'aquilo', 'estou', 'estamos', 'sou', 'somos', 'são', 'éramos', 'eram', 'fui', 'fomos', 'fora', 'olá', 'ola', 'bom', 'dia', 'tarde', 'noite', 'tudo', 'bem', 'ajuda', 'ajudar', 'gostaria', 'queria', 'pode', 'favor', 'obrigado', 'obrigada', 'cliente', 'atendimento', 'suporte', 'anota', 'ai', 'sobre', 'qualquer', 'tipo', 'relacionado', 'referente', 'dúvidas', 'dúvida', 'auxílio', 'utilizar', 'caso', 'casos', 'problema', 'problemas', 'erro', 'erros']);

// Variáveis globais para o sistema de aprendizado
var lastSuggestedTags = [];
var lastChatSummary = "";
var hasRecordedHitForCurrentChat = false;

function tokenize(text) {
  var cleaned = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
  return cleaned.split(/\s+/).filter(function(word) {
    return word.length > 3 && !stopWords.has(word);
  });
}

// Algoritmo fallback mais inteligente (Offline / Quota)
function scoreTagsFallback(chatText, learningData) {
  var lowerText = chatText.toLowerCase();
  var chatTokens = tokenize(chatText);
  var chatTokenCounts = {};
  chatTokens.forEach(function(t) { chatTokenCounts[t] = (chatTokenCounts[t] || 0) + 1; });

  var wordFrequencyInTags = {};
  tagsData.forEach(function(tag) {
    var uniqueTokens = Array.from(new Set(tokenize(tag.description + " " + tag.name)));
    uniqueTokens.forEach(function(t) { wordFrequencyInTags[t] = (wordFrequencyInTags[t] || 0) + 1; });
  });

  var numTags = tagsData.length;
  var scoredTags = tagsData.map(function(tag) {
    var score = 0;
    var tagNameClean = tag.name.toLowerCase().replace(/-/g, ' ');
    if (lowerText.includes(tagNameClean)) score += 50;
    
    var descTokens = tokenize(tag.description + " " + tagNameClean);
    descTokens.forEach(function(t) {
      if (chatTokenCounts[t]) {
        var docFreq = wordFrequencyInTags[t] || 1;
        var idf = Math.log(numTags / docFreq);
        var lengthWeight = t.length > 5 ? 1.5 : 1.0;
        score += (chatTokenCounts[t] * idf * lengthWeight);
      }
    });
    return { name: tag.name, description: tag.description, score: score };
  });

  var tagMap = {};
  scoredTags.forEach(function(t) { tagMap[t.name] = t; });

  // --- HEURÍSTICAS OFFLINE ---

  // Tenta isolar o texto APÓS o humano assumir
  var lastMarkerIndex = -1;
  ["atribuída a", "sla policy applied", "intelliassign"].forEach(function(m) {
    var idx = lowerText.lastIndexOf(m);
    if (idx > lastMarkerIndex) lastMarkerIndex = idx + m.length;
  });
  
  var postAgentText = lowerText;
  if (lastMarkerIndex !== -1) {
    postAgentText = lowerText.substring(lastMarkerIndex);
  } else {
    var greetIdx = lowerText.indexOf("estou aqui para te ajudar");
    if (greetIdx !== -1) postAgentText = lowerText.substring(greetIdx);
  }

  // Verifica se o cliente interagiu após o atendente assumir
  var cleanedPostAgent = postAgentText;
  var agentPhrases = [
    "olá", "meu nome é", "estou aqui para te ajudar", "com quem eu falo", "como posso te auxiliar",
    "já tem um tempinho", "não recebo uma mensagem", "chat será encerrado", "deseja continuar",
    "bom dia", "boa tarde", "boa noite", "tudo bem", "após mais alguns minutos", "encerrar o atendimento",
    "por falta de comunicação", "vou encerrar", "posso ajudar"
  ];
  agentPhrases.forEach(function(p) { cleanedPostAgent = cleanedPostAgent.split(p).join(""); });
  // Remove pontuações, caracteres especiais e números
  cleanedPostAgent = cleanedPostAgent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, "").replace(/\s/g, "");
  
  // Se sobrou texto suficiente, o cliente respondeu
  var customerReplied = cleanedPostAgent.length > 10;

  var hasInactivityWarning = lowerText.includes("já tem um tempinho") || 
                             lowerText.includes("ainda deseja continuar") || 
                             lowerText.includes("chat será encerrado") ||
                             lowerText.includes("falta de comunicação");

  if (hasInactivityWarning) {
    if (!customerReplied && tagMap['sem-especificação']) {
      tagMap['sem-especificação'].score += 500;
    } else if (customerReplied && tagMap['sem-resposta']) {
      tagMap['sem-resposta'].score += 500;
    }
  }

  // --- INTEGRAÇÃO COM APRENDIZADO (KNN Básico Offline) ---
  if (learningData && learningData.length > 0) {
    learningData.forEach(function(entry) {
      var entryTokens = tokenize(entry.chatSummary);
      var overlap = 0;
      entryTokens.forEach(function(t) { if (chatTokenCounts[t]) overlap++; });
      
      // Se tiver mais de 5 palavras-chave em comum com a correção passada
      if (overlap > 5) {
        var boost = overlap * 3; // Peso da semelhança
        entry.actualTags.forEach(function(tagName) {
          if (tagMap[tagName]) tagMap[tagName].score += boost;
        });
      }
    });
  }

  // Ordenar
  var sorted = scoredTags.filter(function(t) { return t.score > 2; }).sort(function(a, b) { return b.score - a.score; });
  
  // Limpar exclusões mútuas (nunca sem-resposta e sem-especificação juntos)
  var finalTags = [];
  var hasSemEsp = false;
  var hasSemResp = false;
  
  for (var i = 0; i < sorted.length; i++) {
    var t = sorted[i];
    if (t.name === 'sem-especificação') {
      if (hasSemResp) continue;
      hasSemEsp = true;
    }
    if (t.name === 'sem-resposta') {
      if (hasSemEsp) continue;
      hasSemResp = true;
    }
    finalTags.push(t);
    if (finalTags.length === 9) break;
  }
  
  return finalTags;
}

function extractChatText() {
  var chatText = "";

  // === PRIORIDADE 1: Seletores específicos de mensagem (Freshdesk Tickets clássico) ===
  var messageElements = document.querySelectorAll(
    '.message-text, .msg-content, [data-test-id="message-text"], .conversation-message'
  );
  if (messageElements.length > 0) {
    chatText = Array.from(messageElements).map(function(el) { return el.innerText; }).join("\n");
    if (chatText.trim().length > 20) return chatText;
  }

  // === PRIORIDADE 2: Freshdesk Messaging / FreshChat (confirmado por diagnóstico) ===
  // [class*="message-bubble"] e [class*="chat-message"] encontraram 20 mensagens cada
  var freshchatSelectors = [
    '[class*="message-bubble"]',
    '[class*="chat-message"]',
    '[class*="conv__bubble"]',
    '[class*="cw-message"]',
    '[class*="message__content"]',
    '[class*="msg__text"]'
  ];

  for (var s = 0; s < freshchatSelectors.length; s++) {
    var els = document.querySelectorAll(freshchatSelectors[s]);
    if (els.length > 0) {
      var candidate = Array.from(els).map(function(el) {
        return el.innerText.trim();
      }).filter(function(t) { return t.length > 0; }).join("\n");
      if (candidate.trim().length > 20) {
        console.log('[OmniTag] Chat extraído via:', freshchatSelectors[s], '(' + els.length + ' elementos)');
        return candidate;
      }
    }
  }

  // === PRIORIDADE 3: Container principal (mais seguro que body inteiro) ===
  var containerSelectors = [
    '.conversation-container',
    '.main-content',
    '.layout-main',
    '.center-column',
    '[data-test-id="conversation-content"]',
    '[data-test-id="conversation-view"]',
    '.conv-main-area',
    '.conversation-wrap',
    '.message-list'
  ];

  for (var c = 0; c < containerSelectors.length; c++) {
    var container = document.querySelector(containerSelectors[c]);
    if (container) {
      var containerText = container.innerText.trim();
      if (containerText.length > 20) {
        console.log('[OmniTag] Chat extraído via container:', containerSelectors[c]);
        return containerText;
      }
    }
  }

  // === FALLBACK: body inteiro (último recurso — pode capturar UI da página) ===
  console.warn('[OmniTag] Usando fallback body.innerText — nenhum seletor específico funcionou.');
  return document.body.innerText;
}


function censorText(text) {
  text = text.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, "[EMAIL OCULTO]");
  text = text.replace(/\b\d{3}\.?\d{3}\.?\d{3}\-?\d{2}\b/g, "[CPF OCULTO]");
  text = text.replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}\b/g, "[CNPJ OCULTO]");
  text = text.replace(/(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[\-\s]?\d{4}/g, "[TELEFONE OCULTO]");
  text = text.replace(/\b\d{13,19}\b/g, "[DADO BANCARIO OCULTO]");
  return text;
}

// ==================== SISTEMA DE APRENDIZADO ====================
// Helper: reads text from a fw-tag element in a Chrome extension isolated world.
// JS custom-element properties (t.text, t.value) are NOT accessible from isolated worlds
// because they are defined in the page's main world. We use getAttribute and shadowRoot instead.
function getFwTagText(t) {
  // 1. getAttribute works across worlds and often mirrors the JS property
  var attr = (t.getAttribute('text') || t.getAttribute('value') || '').trim();
  if (attr && !attr.match(/^[0-9a-f]{8}-/i)) return attr; // skip UUID values

  // 2. Read from fw-tag's own shadowRoot (confirmed working by diagnostic)
  if (t.shadowRoot) {
    var span = t.shadowRoot.querySelector(
      '[part="tag-text"], .tag-text, .tag-label, [class*="tag"] span, span:not([class*="icon"]):not([class*="close"]):not([class*="delete"])'
    );
    if (span) {
      var txt = span.textContent.trim();
      if (txt) return txt;
    }
    // Try any span that is not just a symbol
    var spans = t.shadowRoot.querySelectorAll('span');
    for (var s = 0; s < spans.length; s++) {
      var spanTxt = spans[s].textContent.trim();
      if (spanTxt && spanTxt.length > 1 && !spanTxt.match(/^[×✕x×]$/i)) return spanTxt;
    }
  }

  // 3. Try JS property access (works in page console, may work in some browsers/versions)
  try {
    if (t.text && typeof t.text === 'string' && t.text.trim()) return t.text.trim();
    if (t.label && typeof t.label === 'string' && t.label.trim()) return t.label.trim();
  } catch(e) {}

  // 4. textContent / innerText fallback
  return (t.textContent || t.innerText || '').trim().replace(/[×✕x×]$/gi, '').trim();
}

function readCurrentTagsFromField() {
  var extracted = [];

  // === STRATEGY 1: Find the Tags fw-select, then read fw-tags inside its shadow ===
  var formControls = deepQueryAll(document, 'fw-form-control, fw-select');
  var tagsFieldSelect = null;

  for (var i = 0; i < formControls.length; i++) {
    var el = formControls[i];
    var isTags = false;
    var name = el.getAttribute('name') || '';
    if (name.toLowerCase().includes('tag')) isTags = true;
    var testId = el.getAttribute('data-test-id') || '';
    if (testId.toLowerCase().includes('tag')) isTags = true;
    // Check label inside shadow root (works: fw-select[0].label = 'Tags')
    if (!isTags && el.shadowRoot) {
      var label = el.shadowRoot.querySelector('label');
      if (label && label.textContent.trim().toLowerCase() === 'tags') isTags = true;
    }
    // Also accept label that merely contains "tag"
    if (!isTags && el.shadowRoot) {
      var label2 = el.shadowRoot.querySelector('label');
      if (label2 && label2.textContent.toLowerCase().includes('tag')) isTags = true;
    }

    if (isTags) {
      if (el.tagName.toLowerCase() === 'fw-form-control' && el.shadowRoot) {
        var innerSelect = el.shadowRoot.querySelector('fw-select');
        tagsFieldSelect = innerSelect || el;
      } else {
        tagsFieldSelect = el;
      }
      break;
    }
  }

  if (tagsFieldSelect && tagsFieldSelect.shadowRoot) {
    // Read fw-tags using the robust helper (isolated-world safe)
    var innerTags = deepQueryAll(tagsFieldSelect.shadowRoot, 'fw-tag');
    innerTags.forEach(function(t) {
      var text = getFwTagText(t);
      if (text && extracted.indexOf(text) === -1) extracted.push(text);
    });
    if (extracted.length > 0) {
      console.log('[OmniTag] Tags lidas via fw-select shadow:', extracted);
      return extracted;
    }

    // fw-select.value fallback — may contain objects with text/name fields
    try {
      var val = tagsFieldSelect.value;
      if (val && Array.isArray(val) && val.length > 0) {
        var valMapped = val.map(function(v) {
          if (typeof v === 'object' && v !== null) return (v.text || v.name || v.label || v.value || '');
          if (typeof v === 'string' && !v.match(/^[0-9a-f]{8}-/i)) return v; // skip UUID strings
          return '';
        }).filter(function(v) { return v.trim().length > 0; });
        if (valMapped.length > 0) {
          console.log('[OmniTag] Tags lidas via fw-select.value:', valMapped);
          return valMapped;
        }
      }
    } catch(e) {}
  }

  // === STRATEGY 2: Global search for all fw-tag in DOM (including shadow) ===
  var allFwTags = deepQueryAll(document, 'fw-tag');
  if (allFwTags.length > 0) {
    allFwTags.forEach(function(t) {
      var text = getFwTagText(t);
      if (text && text.length > 0 && extracted.indexOf(text) === -1) extracted.push(text);
    });
    if (extracted.length > 0) {
      console.log('[OmniTag] Tags lidas via fw-tag global fallback:', extracted);
      return extracted;
    }
  }

  // === STRATEGY 3: Legacy Freshdesk / Ember selectors ===
  var oldTagElements = deepQueryAll(document, '.tag-item, [data-test-id="ticket-properties-tags"] .ember-power-select-multiple-option');
  if (oldTagElements.length > 0) {
    oldTagElements.forEach(function(t) {
      var text = (t.textContent || '').trim().replace(/[×✕x×]$/gi, '').trim();
      if (text.length > 0 && extracted.indexOf(text) === -1) extracted.push(text);
    });
    if (extracted.length > 0) {
      console.log('[OmniTag] Tags lidas via legacy selectors:', extracted);
      return extracted;
    }
  }

  // === STRATEGY 4: visibleText match against known tagsData ===
  if (tagsFieldSelect && typeof tagsData !== 'undefined') {
    var visibleText = (tagsFieldSelect.innerText || '');
    if (!visibleText && tagsFieldSelect.shadowRoot) {
      visibleText = (tagsFieldSelect.shadowRoot.host || tagsFieldSelect).innerText || '';
    }
    if (visibleText) {
      var sortedTags = tagsData.slice().sort(function(a, b) { return b.name.length - a.name.length; });
      sortedTags.forEach(function(tagObj) {
        var tagName = tagObj.name;
        if (visibleText.indexOf(tagName) !== -1) {
          visibleText = visibleText.replace(tagName, '');
          if (extracted.indexOf(tagName) === -1) extracted.push(tagName);
        }
      });
      if (extracted.length > 0) {
        console.log('[OmniTag] Tags lidas via visibleText match:', extracted);
        return extracted;
      }
    }
  }

  console.warn('[OmniTag] Nenhuma tag encontrada com nenhuma estratégia.');
  return extracted;
}

function extractChatId(url) {
  if (!url) return '';
  // Prioridade 1: /conversation/ID
  var convMatch = url.match(/\/conversation\/(\d+)/i);
  if (convMatch) return convMatch[1];
  
  // Prioridade 2: /tickets/ID ou /ticket/ID
  var ticketMatch = url.match(/\/tickets?\/(\d+)/i);
  if (ticketMatch) return ticketMatch[1];

  // Prioridade 3: Último segmento com 5+ dígitos
  var cleanUrl = url.split(/[?#]/)[0].replace(/\/+$/, '');
  var parts = cleanUrl.split('/');
  for (var i = parts.length - 1; i >= 0; i--) {
    if (/^\d{5,}$/.test(parts[i])) {
      return parts[i];
    }
  }
  return '';
}

function saveLearningData(chatSummary, suggestedTags, actualTags, chatUrl) {
  var suggestedNames = (suggestedTags || []).map(function(t) { return typeof t === 'string' ? t : t.name; });
  var actualNames = (actualTags || []).slice();

  // Verifica se pelo menos uma tag sugerida pela IA foi aproveitada
  var matchedTags = suggestedNames.filter(function(tag) { return actualNames.indexOf(tag) !== -1; });
  var isHit = matchedTags.length > 0;

  var entry = {
    chatSummary:   chatSummary.substring(0, 2000),
    suggestedTags: suggestedNames,
    actualTags:    actualNames,
    hitCount:      isHit ? 1 : 0,
    missCount:     isHit ? 0 : 1,
    chatUrl:       chatUrl || window.location.href,
    timestamp:     Date.now()
  };

  console.log('[OmniTag] Salvando aprendizado — isHit:', isHit, entry);

  chrome.storage.local.get(['learningData', 'omnitagsMetrics'], function(result) {
    var data = result.learningData || [];
    var metrics = result.omnitagsMetrics || {};

    if (isHit) {
      // Se acertou mas ainda não havia contabilizado via clique no botão de inserir
      if (!hasRecordedHitForCurrentChat) {
        metrics.hits = (metrics.hits || 0) + 1;
        hasRecordedHitForCurrentChat = true;
      }
    } else {
      // Nenhuma tag sugerida foi aproveitada (correção humana total) -> +1 Erro
      metrics.misses = (metrics.misses || 0) + 1;
    }

    data.push(entry);
    if (data.length > 500) {
      data = data.slice(data.length - 500);
    }
    chrome.storage.local.set({ learningData: data, omnitagsMetrics: metrics }, function() {
      console.log('[OmniTag] Aprendizado e métricas salvas! Total:', data.length);
    });
  });
}


function buildLearningPrompt(learningData) {
  if (!learningData || learningData.length === 0) return "";

  // Pega os últimos 15 exemplos
  var recent = learningData.slice(-15);
  var examples = recent.map(function(entry) {
    return "- Conversa: \"" + entry.chatSummary.substring(0, 600) + "...\"\n" +
      "  IA sugeriu: [" + entry.suggestedTags.join(", ") + "]\n" +
      "  Tags corretas: [" + entry.actualTags.join(", ") + "]";
  }).join("\n\n");

  return "\n\nAPRENDIZADO - EXEMPLOS DE CORREÇÕES ANTERIORES:\n" +
    "Abaixo estão exemplos onde a IA errou e o atendente corrigiu. Use esses exemplos para melhorar suas sugestões:\n\n" +
    examples + "\n\n" +
    "Use esses padrões para ajustar suas sugestões no chat atual.\n";
}

// ==================== MOTOR DE IA MULTI-PROVEDOR ====================

var PROVIDER_MODELS = {
  groq: [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant'
  ],
  openrouter: [
    'openai/gpt-oss-120b:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'nvidia/nemotron-3-super-120b-a12b:free'
  ],
  gemini: [
    'gemini-2.5-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite'
  ],
  toqan: [
    'toqan-agent'
  ]
};

function minifyChatText(text) {
  // Remove múltiplas quebras de linha e espaços extras
  var minified = text.replace(/\n\s*\n/g, '\n').replace(/ +/g, ' ');
  // Remove padrões de horários (ex: 10:24 AM, 15:30)
  minified = minified.replace(/\b\d{1,2}:\d{2}\s*(AM|PM|am|pm)?\b/g, '');
  // Remove datas (ex: 12/05/2023)
  minified = minified.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '');
  // Remove textos inúteis da UI do Freshdesk
  minified = minified.replace(/Histórico de conversas/gi, '');
  return minified.trim();
}

function getFullPrompt(chatText, learningData) {
  var tagsList = tagsData.map(function(t) {
    return '- Tag: "' + t.name + '" | Descrição: "' + t.description + '"';
  }).join("\n");

  var basePrompt = "Você é um assistente especializado em classificar chats de atendimento ao cliente com tags.\n\n" +
    "REGRAS IMPORTANTES:\n" +
    "1. O chat possui duas fases: a fase do BOT (automática) e a fase do ATENDENTE HUMANO.\n" +
    "2. A fase do BOT inclui todas as mensagens ANTES de um atendente humano assumir. O bot geralmente responde de forma automática e padronizada.\n" +
    "3. Mensagens de sistema como 'A conversa foi atribuída a...', 'SLA policy applied', 'IntelliAssign', etc. são apenas notificações internas e NÃO são mensagens do atendente.\n" +
    "4. A fase do ATENDENTE HUMANO começa quando uma pessoa real envia a primeira mensagem direta ao cliente após as mensagens de sistema. Cada atendente tem seu próprio nome e estilo de saudação.\n" +
    "5. Você deve IGNORAR completamente as mensagens da fase do bot. Analise APENAS o que foi conversado a partir da primeira mensagem do atendente humano em diante.\n\n" +
    "REGRAS SOBRE TAGS ESPECIAIS — LEIA COM ATENÇÃO:\n" +
    "\n" +
    "PERGUNTA-CHAVE (responda antes de escolher a tag):\n" +
    "  → O cliente enviou ALGUMA mensagem de texto ao atendente humano após ele se apresentar?\n" +
    "\n" +
    "  SE NÃO → use 'sem-especificação'\n" +
    "    Exemplos de sem-especificação:\n" +
    "      • Atendente: 'Olá, como posso ajudar?' → cliente nunca respondeu\n" +
    "      • Atendente: 'Com quem falo?' → silêncio total do cliente\n" +
    "      • Atendente enviou mensagem, sistema enviou aviso de inatividade, cliente ainda sem resposta\n" +
    "\n" +
    "  SE SIM, mas o cliente parou antes de resolver → use 'sem-resposta'\n" +
    "    Exemplos de sem-resposta:\n" +
    "      • Cliente disse 'minha impressora não liga' → atendente pediu mais info → cliente sumiu\n" +
    "      • Cliente relatou problema → atendente foi verificar → cliente não respondeu mais\n" +
    "\n" +
    "ATENÇÃO — NÃO contam como resposta do cliente:\n" +
    "  • Mensagens automáticas do sistema: 'Chat será encerrado', 'Ainda deseja continuar?', 'Já tem um tempinho que não recebo mensagem'\n" +
    "  • Notificações internas: 'SLA policy applied', 'IntelliAssign', 'A conversa foi atribuída a...'\n" +
    "  • Mensagens do próprio bot/assistente automático\n" +
    "  → Se só existem essas mensagens após a apresentação do atendente, o cliente NÃO respondeu → use 'sem-especificação'\n" +
    "\n" +
    "REGRAS ADICIONAIS:\n" +
    "- NUNCA use 'sem-especificação' e 'sem-resposta' juntas. São mutuamente exclusivas.\n" +
    "- Se o atendente realizou alguma ação ou resolução técnica, NÃO use essas tags. Classifique pelo serviço realizado.\n\n" +
    "LISTA DE TAGS VÁLIDAS E SUAS DESCRIÇÕES:\n\n" +
    tagsList + "\n\n";

  var learningPrompt = buildLearningPrompt(learningData);

  // Comprimir o texto (remove horários, espaços vazios, datas) para economizar MUITOS tokens
  // sem cortar a conversa!
  var minifiedChat = minifyChatText(chatText);

  return basePrompt + learningPrompt +
    "CONVERSA COMPLETA (analise apenas a parte pós-atendente humano):\n" + minifiedChat + "\n\n" +
    "Identifique até 9 tags que melhor representam o assunto da conversa na fase do atendente humano.\n" +
    "Considere sinônimos e erros de digitação comuns.\n" +
    "Responda EXCLUSIVAMENTE com um array JSON válido contendo os nomes exatos das tags sugeridas, sem nenhuma formatação markdown (```json) ou texto adicional. O resultado deve ser parseável por JSON.parse().\n" +
    'Exemplo exato de resposta esperada: ["suporte-impressora", "erro-impressora"]';
}

function mapNamesToTags(namesArray) {
  var finalTags = [];
  namesArray.forEach(function(tagName) {
    var foundTag = tagsData.find(function(t) { return t.name === tagName; });
    if (foundTag) finalTags.push(foundTag);
  });
  return finalTags;
}

async function fetchWithTimeout(resource, options) {
  var timeout = options.timeout || 30000; // 30 segundos por padrão
  var controller = new AbortController();
  var id = setTimeout(function() { controller.abort(); }, timeout);
  options.signal = controller.signal;
  try {
    var response = await fetch(resource, options);
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function callOpenAIFormat(chatText, apiKey, learningData, provider, model, customUrl) {
  var url = customUrl || "https://api.groq.com/openai/v1/chat/completions";
  var headers = {
    "Authorization": "Bearer " + apiKey,
    "Content-Type": "application/json"
  };
  if (provider === 'openrouter') {
    headers["HTTP-Referer"] = "https://github.com/omnitags";
    headers["X-Title"] = "OmniTag Extension";
  }

  var body = {
    model: model,
    messages: [{ role: "user", content: getFullPrompt(chatText, learningData) }],
    temperature: 0.2
  };
  
  if (provider === 'groq') {
    body.response_format = { type: "json_object" };
  }

  var response = await fetchWithTimeout(url, { method: "POST", headers: headers, body: JSON.stringify(body), timeout: 35000 });
  var data = await response.json();
  
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  
  var aiText = data.choices[0].message.content.trim();
  aiText = aiText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
  
  var match = aiText.match(/\[.*\]/s);
  if (match) aiText = match[0];

  var tokens = data.usage ? (data.usage.prompt_tokens + data.usage.completion_tokens) : Math.round((chatText.length + aiText.length) / 4);
  
  return {
    tags: mapNamesToTags(JSON.parse(aiText)),
    tokens: tokens
  };
}

async function callGemini(chatText, apiKey, learningData, model) {
  var url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
  var response = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    timeout: 30000,
    body: JSON.stringify({
      contents: [{ parts: [{ text: getFullPrompt(chatText, learningData) }] }],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
    })
  });

  var data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  // Estimate tokens for free Gemini (1 token ~ 4 chars of prompt + response)
  var textResponse = data.candidates[0].content.parts[0].text;
  var estimatedTokens = Math.round((chatText.length + textResponse.length) / 4);

  return {
    tags: mapNamesToTags(JSON.parse(textResponse)),
    tokens: estimatedTokens
  };
}

/**
 * Chama o agent Toqan para classificação de tags
 * @param {Array} messages - Array de mensagens (formato: [{role, content}])
 * @param {String} systemPrompt - Prompt do sistema (contexto)
 * @param {String} apiKey - Chave de API do Toqan
 * @param {String} baseUrl - URL Base da API do Toqan
 * @returns {String} - Resposta do agent (lista de tags)
 */
async function callToqan(messages, systemPrompt, apiKey, baseUrl) {
    try {
        baseUrl = baseUrl || 'https://api.coco.prod.toqan.ai/api';
        
        if (!apiKey) {
            throw new Error('Toqan API Key não configurada');
        }
        
        // Preparar mensagem combinando system prompt + user message
        const userMessage = messages.map(m => m.content).join('\n\n');
        const fullMessage = systemPrompt ? `${systemPrompt}\n\nHISTÓRICO DA CONVERSA:\n${userMessage}` : userMessage;
        
        // ETAPA 1: Criar conversa
        console.log('[Toqan] Criando conversa...');
        const createResponse = await fetchWithTimeout(
            `${baseUrl}/create_conversation`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': apiKey
                },
                body: JSON.stringify({
                    user_message: fullMessage
                })
            },
            30000 // 30s timeout
        );
        
        if (!createResponse.ok) {
            throw new Error(`Toqan API erro: ${createResponse.status}`);
        }
        
        const createData = await createResponse.json();
        const conversationId = createData.conversation_id;
        const requestId = createData.request_id;
        
        console.log(`[Toqan] Conversa criada: ${conversationId}`);
        
        // ETAPA 2: Polling para obter resposta
        let attempts = 0;
        const maxAttempts = 20; // 20 tentativas * 3s = 60s max
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Aguardar 3s
            
            console.log(`[Toqan] Polling tentativa ${attempts + 1}/${maxAttempts}...`);
            
            const pollResponse = await fetchWithTimeout(
                `${baseUrl}/get_answer?conversation_id=${conversationId}&request_id=${requestId}`,
                {
                    method: 'GET',
                    headers: {
                        'X-Api-Key': apiKey
                    }
                },
                10000 // 10s timeout
            );
            
            if (!pollResponse.ok) {
                throw new Error(`Toqan polling erro: ${pollResponse.status}`);
            }
            
            const pollData = await pollResponse.json();
            
            if (pollData.status === 'finished') {
                console.log('[Toqan] Resposta recebida!');
                return pollData.answer || pollData.response || '';
            } else if (pollData.status === 'error') {
                throw new Error(`Toqan erro: ${pollData.error || 'Unknown error'}`);
            }
            
            attempts++;
        }
        
        throw new Error('Toqan timeout - resposta não recebida em 60s');
        
    } catch (error) {
        console.error('[Toqan] Erro:', error);
        throw error;
    }
}


var ftsStartTime = 0;
var ftsTimerInterval = null;

function logToConsole(msg, isError, isWarning) {
  var consoleModal = document.getElementById('fts-floating-console');
  var logsDiv = document.getElementById('fts-console-logs');
  var timerDiv = document.getElementById('fts-timer');
  
  if (!consoleModal) {
    consoleModal = document.createElement('div');
    consoleModal.id = 'fts-floating-console';
    consoleModal.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 2147483647; background: #0f1117; color: #10b981; font-family: monospace; font-size: 12px; padding: 15px; border-radius: 10px; border: 1px solid #1e293b; display: flex; flex-direction: column; text-align: left; width: 350px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);';
    
    var header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-bottom: 8px;';
    
    var title = document.createElement('div');
    title.innerHTML = '<strong>🧠 OmniTag AI</strong>';
    title.style.color = '#fff';
    
    timerDiv = document.createElement('div');
    timerDiv.id = 'fts-timer';
    timerDiv.style.cssText = 'color: #94a3b8; font-weight: bold; font-size: 12px;';
    
    header.appendChild(title);
    header.appendChild(timerDiv);
    
    logsDiv = document.createElement('div');
    logsDiv.id = 'fts-console-logs';
    logsDiv.style.cssText = 'max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 4px;';
    
    consoleModal.appendChild(header);
    consoleModal.appendChild(logsDiv);
    document.body.appendChild(consoleModal);
    
    ftsStartTime = Date.now();
    if (ftsTimerInterval) clearInterval(ftsTimerInterval);
    ftsTimerInterval = setInterval(function() {
      var elapsed = ((Date.now() - ftsStartTime) / 1000).toFixed(1);
      if (document.getElementById('fts-timer')) {
         document.getElementById('fts-timer').textContent = '⏱ ' + elapsed + 's';
      }
    }, 100);
  }

  var line = document.createElement('div');
  var now = new Date();
  var timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');
  
  if (isError) line.style.color = '#ef4444';
  else if (isWarning) line.style.color = '#f59e0b';
  else if (msg.toLowerCase().includes('sucesso')) line.style.color = '#3b82f6';
  
  line.textContent = '[' + timeStr + '] ' + msg;
  if (logsDiv) {
    logsDiv.appendChild(line);
    logsDiv.scrollTop = logsDiv.scrollHeight;
  }
}

function stopConsoleTimer(usageData) {
  if (ftsTimerInterval) clearInterval(ftsTimerInterval);
  var elapsed = ((Date.now() - ftsStartTime) / 1000).toFixed(1);
  var timerDiv = document.getElementById('fts-timer');
  if (timerDiv) {
     timerDiv.textContent = '✅ ' + elapsed + 's';
     timerDiv.style.color = '#10b981';
  }
  
  chrome.storage.local.get(['omnitagsMetrics'], function(result) {
    var metrics = result.omnitagsMetrics || {};
    metrics.lastTime = elapsed;
    
    if (usageData) {
      var provider = usageData.provider;
      var model = usageData.model;
      var tokens = usageData.tokens;
      var chatText = usageData.chatText;
      
      var chatUrl = window.location.href;
      metrics.chatHistory = metrics.chatHistory || [];
      
      // Deduplication by URL: only count a new entry if this URL was not already recorded
      var alreadyRecorded = metrics.chatHistory.some(function(entry) {
        return entry.url === chatUrl;
      });
      
      if (!alreadyRecorded) {
        var now = new Date();
        var day = String(now.getDate()).padStart(2, '0');
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var year = now.getFullYear();
        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');
        var formattedDate = day + '/' + month + '/' + year + ' - ' + hours + ':' + minutes;

        // Extrai o ID real do chat da URL (ex: /conversation/1166658770879150)
        var chatId = extractChatId(chatUrl);

        metrics.chatHistory.unshift({
          url: chatUrl,
          date: formattedDate,
          chatId: chatId,
          timestamp: Date.now()
        });
        if (metrics.chatHistory.length > 500) metrics.chatHistory.pop();
        metrics.totalChats = (metrics.totalChats || 0) + 1;
      }
      
      metrics.totalTokens = (metrics.totalTokens || 0) + tokens;
      
      metrics.tokensByProvider = metrics.tokensByProvider || {};
      metrics.tokensByProvider[provider] = (metrics.tokensByProvider[provider] || 0) + tokens;
      
      metrics.lastProvider = provider;
      metrics.lastModel = model;
    }
    
    chrome.storage.local.set({ omnitagsMetrics: metrics });
  });

  setTimeout(function() {
    var consoleModal = document.getElementById('fts-floating-console');
    if (consoleModal) consoleModal.remove();
  }, 1500);
}

async function executeAIFallback(chatText, apiKeys, enabledProviders, learningData, customProviders, customModels, toqanBaseUrl) {
  var queue = [];
  logToConsole("Iniciando motor OmniTag de IA...");

  var ALL_PROVIDERS = JSON.parse(JSON.stringify(PROVIDER_MODELS));
  var providerURLs = {
    toqan: toqanBaseUrl || 'https://api.coco.prod.toqan.ai/api'
  };
  
  if (customProviders) {
    Object.keys(customProviders).forEach(function(pid) {
      if (!ALL_PROVIDERS[pid]) ALL_PROVIDERS[pid] = customProviders[pid].models || [];
      providerURLs[pid] = customProviders[pid].url;
    });
  }
  if (customModels) {
    Object.keys(customModels).forEach(function(pid) {
      ALL_PROVIDERS[pid] = customModels[pid];
    });
  }
  
  // Define priority order
  var order = ['gemini', 'groq', 'openrouter', 'toqan'];
  Object.keys(ALL_PROVIDERS).forEach(function(p) {
    if (order.indexOf(p) === -1) order.push(p);
  });

  order.forEach(function(p) {
    if (enabledProviders && enabledProviders[p] === false) return; // skipped because disabled
    var keys = apiKeys[p];
    if (!keys || (Array.isArray(keys) && keys.length === 0)) return;
    if (!Array.isArray(keys)) keys = [keys];

    if (ALL_PROVIDERS[p]) {
      ALL_PROVIDERS[p].forEach(function(m) {
        if (!m.startsWith('!')) {
          // Enqueue for each available key
          keys.forEach(function(key) {
            queue.push({ provider: p, model: m, key: key, url: providerURLs[p] });
          });
        }
      });
    }
  });

  var minifiedLen = minifyChatText(chatText).length;
  if (minifiedLen > 12000) {
    queue = queue.filter(function(step) {
      return step.provider !== 'groq';
    });
    logToConsole("Aviso: Chat muito longo. Pulando o Groq (Limites da API).", false, true);
  }

  if (queue.length === 0) {
    logToConsole("Erro: Nenhum modelo/chave habilitada.", true);
    throw new Error("NO_KEYS");
  }

  logToConsole(queue.length + " chamadas possiveis enfileiradas.");
  var lastError = null;
  
  for (var i = 0; i < queue.length; i++) {
    var step = queue[i];
    var maskedKey = typeof step.key === 'string' ? (step.key.substring(0,6) + '...') : '...';
    logToConsole("Chamando [" + step.provider + "] -> " + step.model + " (" + maskedKey + ")");
    try {
      var res;
      if (step.provider === 'gemini') {
        res = await callGemini(chatText, step.key, learningData, step.model);
      } else if (step.provider === 'toqan') {
        logToConsole("🤖 Tentando TOQAN...");
        var messages = [{ role: "user", content: minifyChatText(chatText) }];
        var systemPrompt = getFullPrompt('', learningData);
        var rawResult = await callToqan(messages, systemPrompt, step.key, step.url);
        
        var parsedTags = [];
        if (rawResult && rawResult.trim()) {
          try {
            var cleanResult = rawResult.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
            var match = cleanResult.match(/\[.*\]/s);
            if (match) cleanResult = match[0];
            parsedTags = mapNamesToTags(JSON.parse(cleanResult));
          } catch (e) {
            console.log('[Toqan] Não foi possível parsear resposta como JSON. Tentando extrair por texto.');
            var lowerResult = rawResult.toLowerCase();
            tagsData.forEach(function(tagObj) {
              if (lowerResult.includes(tagObj.name.toLowerCase())) {
                parsedTags.push(tagObj);
              }
            });
          }
        }
        
        var estimatedTokens = Math.round((chatText.length + rawResult.length) / 4);
        res = {
          tags: parsedTags,
          tokens: estimatedTokens
        };
      } else {
        res = await callOpenAIFormat(chatText, step.key, learningData, step.provider, step.model, step.url);
      }
      logToConsole("SUCESSO: Recebeu resposta de " + step.provider + "!");
      return {
        tags: res.tags,
        provider: step.provider,
        model: step.model,
        tokens: res.tokens
      };
    } catch (err) {
      if (err.name === 'AbortError') {
         logToConsole("TIMEOUT: O provedor " + step.provider + " demorou.", true);
      } else {
         logToConsole("FALHA: " + err.message, true);
      }
      lastError = err;
    }
  }
  logToConsole("Todas as tentativas falharam.", true);
  throw lastError || new Error("ALL_MODELS_FAILED");
}

// UI Injection
function createUI() {
  if (document.getElementById('freshdesk-tag-suggester')) return;

  var container = document.createElement('div');
  container.id = 'freshdesk-tag-suggester';

  var headerDiv = document.createElement('div');
  headerDiv.className = 'fts-header';

  var titleSpan = document.createElement('span');
  titleSpan.textContent = 'OmniTag Ativo \u2728';
  headerDiv.appendChild(titleSpan);

  var btnGroup = document.createElement('div');
  btnGroup.className = 'fts-btn-group';

  var btn = document.createElement('button');
  btn.id = 'fts-btn-ler';
  btn.className = 'fts-btn';
  btn.textContent = 'Ler Conversa';
  btnGroup.appendChild(btn);

  var btnLearn = document.createElement('button');
  btnLearn.id = 'fts-btn-aprender';
  btnLearn.className = 'fts-btn fts-btn-learn';
  btnLearn.textContent = '\uD83E\uDDE0';
  btnLearn.title = 'Salvar Aprendizado: Clique após inserir as tags corretas para a IA aprender';
  btnLearn.style.display = 'none';
  btnGroup.appendChild(btnLearn);

  headerDiv.appendChild(btnGroup);

  var contentDiv = document.createElement('div');
  contentDiv.className = 'fts-content';
  contentDiv.id = 'fts-suggestions';

  var emptyMsg = document.createElement('div');
  emptyMsg.className = 'fts-empty';
  emptyMsg.textContent = 'Clique em "Ler Conversa" para sugerir tags.';
  contentDiv.appendChild(emptyMsg);

  container.appendChild(headerDiv);
  container.appendChild(contentDiv);

  injectIntoDOM(container);

  if (!container.parentElement) {
    container.style.display = 'none';
    document.body.appendChild(container);
  }

  btn.addEventListener('click', function() {
    btn.innerText = "Lendo...";
    btn.disabled = true;
    hasRecordedHitForCurrentChat = false; // Reset da flag para novo chat/leitura
    
    // Reseta o console
    var suggestionsDiv = document.getElementById('fts-suggestions');
    if (suggestionsDiv) suggestionsDiv.innerHTML = '';
    
    var rawText = extractChatText();
    if (rawText.trim().length < 10) {
      suggestionsDiv.innerHTML = '<div class="fts-empty">Pouco texto encontrado no chat.</div>';
      resetBtn(btn);
      return;
    }

    logToConsole("Texto do chat extraído com sucesso.");
    var safeText = censorText(rawText);
    lastChatSummary = safeText;

        chrome.storage.local.get(['apiKeys', 'enabledProviders', 'learningData', 'customProviders', 'customModels', 'toqan_base_url'], async function(result) {
      var apiKeys = result.apiKeys || {};
      var enabledProviders = result.enabledProviders || { gemini: true, groq: true, openrouter: true, toqan: true };
      
      if (result.enabledProviders && result.enabledProviders.toqan === undefined) {
        enabledProviders.toqan = true;
      }
      
      var hasApiKeys = Object.keys(apiKeys).length > 0;
      
      if (hasApiKeys) {
        try {
          var aiResult = await executeAIFallback(safeText, apiKeys, enabledProviders, result.learningData, result.customProviders, result.customModels, result.toqan_base_url);
          stopConsoleTimer({
            provider: aiResult.provider,
            model: aiResult.model,
            tokens: aiResult.tokens,
            chatText: safeText
          });
          
          // Deixa o console visível por 1.5s para o usuário ver o tempo final, depois mostra as tags
          setTimeout(function() {
             lastSuggestedTags = aiResult.tags;
             updateUI(aiResult.tags, false, false, false);
             var learnBtn = document.getElementById('fts-btn-aprender');
             if (learnBtn) learnBtn.style.display = 'inline-block';
             resetBtn(btn);
          }, 1500);

        } catch (err) {
          console.error("[OmniTag] Todas as IAs falharam:", err);
          stopConsoleTimer();
          
          setTimeout(function() {
             var isQuotaError = err.message && (err.message.toLowerCase().includes('quota') || err.message.includes('429'));
             var fallback = scoreTagsFallback(safeText, result.learningData);
             lastSuggestedTags = fallback;
             updateUI(fallback, true, false, isQuotaError);
             resetBtn(btn);
          }, 2000);
        }
      } else {
        stopConsoleTimer();
        var fallback2 = scoreTagsFallback(safeText, result.learningData);
        lastSuggestedTags = fallback2;
        updateUI(fallback2, false, true, false);
        resetBtn(btn);
      }
    });
  });

  btnLearn.addEventListener('click', function() {
    var actualTags = readCurrentTagsFromField();
    console.log('[OmniTag] Tags lidas do campo:', actualTags);
    console.log('[OmniTag] Chat summary disponível:', lastChatSummary ? lastChatSummary.substring(0, 80) + '...' : '(vazio)');
    
    if (actualTags.length === 0) {
      btnLearn.textContent = '\u274C';
      btnLearn.title = 'Nenhuma tag encontrada no campo de Tags do Freshdesk.';
      console.warn('[OmniTag] Nenhuma tag lida do campo! Verifique se há tags inseridas.');
      setTimeout(function() { btnLearn.textContent = '\uD83E\uDDE0'; btnLearn.title = 'Salvar Aprendizado'; }, 3000);
      return;
    }

    if (!lastChatSummary || lastChatSummary.trim().length < 10) {
      btnLearn.textContent = '\u274C';
      btnLearn.title = 'Clique em Ler Conversa antes de salvar o aprendizado.';
      console.warn('[OmniTag] Sem resumo do chat. Clique em Ler Conversa primeiro.');
      setTimeout(function() { btnLearn.textContent = '\uD83E\uDDE0'; btnLearn.title = 'Salvar Aprendizado'; }, 3000);
      return;
    }

    saveLearningData(lastChatSummary, lastSuggestedTags, actualTags, window.location.href);
    btnLearn.textContent = '\u2705';
    btnLearn.title = 'Aprendizado salvo! Tags: ' + actualTags.join(', ');
    setTimeout(function() {
      btnLearn.textContent = '\uD83E\uDDE0';
      btnLearn.title = 'Salvar Aprendizado';
      btnLearn.style.display = 'none';
    }, 3000);
  });
}

function resetBtn(btn) {
  btn.innerText = "Ler Conversa";
  btn.disabled = false;
}

function deepQueryAll(root, selector) {
  var results = [];
  var found = root.querySelectorAll(selector);
  found.forEach(function(el) { results.push(el); });
  var allElements = root.querySelectorAll('*');
  allElements.forEach(function(el) {
    if (el.shadowRoot) {
      var shadowResults = deepQueryAll(el.shadowRoot, selector);
      shadowResults.forEach(function(sr) { results.push(sr); });
    }
  });
  return results;
}

function findTagsInput() {
  var fwSelects = deepQueryAll(document, 'fw-select');
  for (var i = 0; i < fwSelects.length; i++) {
    var shadow = fwSelects[i].shadowRoot;
    if (!shadow) continue;
    var label = shadow.querySelector('label');
    if (!label || label.textContent.trim() !== 'Tags') continue;
    var input = shadow.querySelector('input.multiple-select, input#cf_Tags, input[name="cf_Tags"]');
    if (input) return input;
  }
  return null;
}

function insertTagIntoField(tagName, buttonEl) {
  // Contabiliza 1 acerto para a IA neste atendimento (se ainda não contabilizado)
  if (!hasRecordedHitForCurrentChat) {
    hasRecordedHitForCurrentChat = true;
    chrome.storage.local.get(['omnitagsMetrics'], function(result) {
      var metrics = result.omnitagsMetrics || {};
      metrics.hits = (metrics.hits || 0) + 1;
      chrome.storage.local.set({ omnitagsMetrics: metrics }, function() {
        console.log('[OmniTag] 1 Acerto contabilizado pela inserção da tag:', tagName, '| Total Hits:', metrics.hits);
      });
    });
  }

  var input = findTagsInput();

  if (input) {
    input.focus();

    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, tagName);

    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    setTimeout(function() {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, composed: true }));
      input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, composed: true }));
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, composed: true }));
    }, 400);

    buttonEl.innerText = 'Inserido!';
    buttonEl.style.color = '#0f9d58';
    setTimeout(function() { buttonEl.innerText = 'Inserir'; buttonEl.style.color = ''; }, 2000);
  } else {
    navigator.clipboard.writeText(tagName).then(function() {
      buttonEl.innerText = 'Copiado!';
      buttonEl.style.color = '#f29900';
      setTimeout(function() { buttonEl.innerText = 'Inserir'; buttonEl.style.color = ''; }, 2000);
    });
  }
}

function injectIntoDOM(container) {
  var propertiesPanel = document.getElementById('data-conversation-properties');

  if (propertiesPanel && propertiesPanel.parentElement) {
    propertiesPanel.parentElement.insertBefore(container, propertiesPanel);
    container.style.display = 'flex';
    container.classList.add('fts-inline');
    container.classList.remove('fts-floating');
    return true;
  }

  var rightSidebar = document.querySelector('.conversation-properties-sidebar, aside');
  if (rightSidebar) {
    rightSidebar.insertBefore(container, rightSidebar.firstChild);
    container.style.display = 'flex';
    container.classList.add('fts-inline');
    container.classList.remove('fts-floating');
    return true;
  }

  return false;
}

function updateUI(suggestions, hadError, noApi, isQuotaError) {
  var content = document.getElementById('fts-suggestions');
  if (!content) return;

  var escapeHTML = function(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, function(tag) {
      var charsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      };
      return charsToReplace[tag] || tag;
    });
  };

  var html = '';

  if (isQuotaError) {
    html += '<div style="font-size: 10px; color: #d93025; margin-bottom: 5px;">Limite da IA grátis atingido (aguarde 1 min). Usando busca básica.</div>';
  } else if (hadError) {
    html += '<div style="font-size: 10px; color: #d93025; margin-bottom: 5px;">Erro na IA. Mostrando resultados básicos.</div>';
  } else if (noApi) {
    html += '<div style="font-size: 10px; color: #f29900; margin-bottom: 5px;">Configure sua API Key na extensão para IA.</div>';
  }

  if (suggestions.length === 0) {
    content.innerHTML = html + '<div class="fts-empty">Nenhuma tag sugerida para esta conversa.</div>';
    return;
  }

  if (suggestions && suggestions.length > 0) {
    suggestions.forEach(function(tag) {
      html += '<div class="fts-tag" title="' + escapeHTML(tag.description) + '" data-tag="' + escapeHTML(tag.name) + '">' +
        escapeHTML(tag.name) +
        '</div>';
    });
  }

  content.innerHTML = html;

  var insertBtns = content.querySelectorAll('.fts-tag');
  insertBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var tagName = e.currentTarget.getAttribute('data-tag');
      insertTagIntoField(tagName, e.currentTarget);
    });
  });
}

var observer = new MutationObserver(function() {
  var container = document.getElementById('freshdesk-tag-suggester');
  if (!container) {
    createUI();
  } else {
    if (container.parentElement === document.body || container.style.display === 'none') {
      injectIntoDOM(container);
    }
  }
});

window.addEventListener('load', function() {
  createUI();
  observer.observe(document.body, { childList: true, subtree: true });
});
