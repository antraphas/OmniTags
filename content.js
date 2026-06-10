// Stop words comuns em português + termos genéricos de atendimento
const stopWords = new Set(['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'elas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses', 'pelas', 'este', 'fosse', 'dele', 'tu', 'te', 'vocês', 'vos', 'lhes', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos', 'nossas', 'dela', 'delas', 'esta', 'estes', 'estas', 'aquele', 'aquela', 'aqueles', 'aquelas', 'isto', 'aquilo', 'estou', 'estamos', 'sou', 'somos', 'são', 'éramos', 'eram', 'fui', 'fomos', 'fora', 'olá', 'ola', 'bom', 'dia', 'tarde', 'noite', 'tudo', 'bem', 'ajuda', 'ajudar', 'gostaria', 'queria', 'pode', 'favor', 'obrigado', 'obrigada', 'cliente', 'atendimento', 'suporte', 'anota', 'ai', 'sobre', 'qualquer', 'tipo', 'relacionado', 'referente', 'dúvidas', 'dúvida', 'auxílio', 'utilizar', 'caso', 'casos', 'problema', 'problemas', 'erro', 'erros']);

// Variáveis globais para o sistema de aprendizado
var lastSuggestedTags = [];
var lastChatSummary = "";

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
  var messageElements = document.querySelectorAll('.message-text, .msg-content, [data-test-id="message-text"], .conversation-message');

  if (messageElements.length > 0) {
    chatText = Array.from(messageElements).map(function(el) { return el.innerText; }).join(" \n ");
  } else {
    var mainColumn = document.querySelector('.conversation-container, .main-content, .layout-main, .center-column');
    if (mainColumn) {
      chatText = mainColumn.innerText;
    } else {
      chatText = document.body.innerText;
    }
  }
  return chatText;
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

function readCurrentTagsFromField() {
  var formControls = deepQueryAll(document, 'fw-form-control, fw-select');
  var tagsFieldSelect = null;

  for (var i = 0; i < formControls.length; i++) {
    var el = formControls[i];
    var isTags = false;
    var name = el.getAttribute('name');
    if (name && name.toLowerCase().includes('tag')) isTags = true;
    var testId = el.getAttribute('data-test-id');
    if (testId && testId.toLowerCase().includes('tag')) isTags = true;
    if (el.shadowRoot) {
      var label = el.shadowRoot.querySelector('label');
      if (label && label.textContent.toLowerCase().includes('tag')) isTags = true;
    }
    
    if (isTags) {
      if (el.tagName.toLowerCase() === 'fw-form-control' && el.shadowRoot) {
         var innerSelect = el.shadowRoot.querySelector('fw-select');
         tagsFieldSelect = innerSelect ? innerSelect : el;
      } else {
         tagsFieldSelect = el;
      }
      break; 
    }
  }

  var extracted = [];

  if (tagsFieldSelect) {
    var val = tagsFieldSelect.value;
    if (val && Array.isArray(val) && val.length > 0) {
      extracted = val.map(function(v) { return typeof v === 'object' ? (v.value || v.text || v.name) : v; });
      if (extracted.length > 0) return extracted;
    }

    if (tagsFieldSelect.shadowRoot) {
       var innerTags = deepQueryAll(tagsFieldSelect.shadowRoot, 'fw-tag');
       innerTags.forEach(function(t) {
         var text = (t.text || t.value || t.textContent || t.innerText || '').trim().replace(/×|✕|x$/gi, '').trim();
         if (text && extracted.indexOf(text) === -1) {
            extracted.push(text);
         }
       });
       if (extracted.length > 0) return extracted;
    }

    var visibleText = tagsFieldSelect.innerText || '';
    if (!visibleText && tagsFieldSelect.shadowRoot) {
       visibleText = tagsFieldSelect.shadowRoot.host.innerText || '';
    }
    if (visibleText && typeof tagsData !== 'undefined') {
       var sortedTags = tagsData.slice().sort(function(a, b) { return b.name.length - a.name.length; });
       sortedTags.forEach(function(tagObj) {
          var tagName = tagObj.name;
          if (visibleText.indexOf(tagName) !== -1) {
             visibleText = visibleText.replace(tagName, '');
             if (extracted.indexOf(tagName) === -1) extracted.push(tagName);
          }
       });
    }
    if (extracted.length > 0) return extracted;
  }

  var allFwTags = deepQueryAll(document, 'fw-tag');
  if (allFwTags.length > 0) {
    var fallbackTags = [];
    allFwTags.forEach(function(t) {
      var text = (t.text || t.value || t.textContent || t.innerText || '').trim().replace(/×|✕|x$/gi, '').trim();
      if (text.length > 0) fallbackTags.push(text);
    });
    if (fallbackTags.length > 0) return fallbackTags;
  }

  var oldTagElements = deepQueryAll(document, '.tag-item, [data-test-id="ticket-properties-tags"] .ember-power-select-multiple-option');
  if (oldTagElements.length > 0) {
    var oldTags = [];
    oldTagElements.forEach(function(t) {
      var text = t.textContent.trim().replace(/×|✕|x$/gi, '').trim();
      if (text.length > 0) oldTags.push(text);
    });
    if (oldTags.length > 0) return oldTags;
  }

  return extracted;
}

function saveLearningData(chatSummary, suggestedTags, actualTags) {
  var suggestedNames = suggestedTags.map(function(t) { return typeof t === 'string' ? t : t.name; }).sort();
  var actualNames = actualTags.sort();

  var entry = {
    chatSummary: chatSummary.substring(0, 300),
    suggestedTags: suggestedNames,
    actualTags: actualNames,
    timestamp: Date.now()
  };

  console.log('[OmniTag] Salvando aprendizado:', entry);

  chrome.storage.local.get(['learningData', 'omnitagsMetrics'], function(result) {
    var data = result.learningData || [];
    var metrics = result.omnitagsMetrics || {};

    // Tracking Hit vs Miss (se a IA acertou todas as tags ou não)
    var isHit = suggestedNames.length === actualNames.length &&
      suggestedNames.every(function(val, index) { return val === actualNames[index]; });
    
    if (isHit) {
      metrics.hits = (metrics.hits || 0) + 1;
    } else {
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
    return "- Conversa: \"" + entry.chatSummary.substring(0, 150) + "...\"\n" +
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
    'z-ai/glm-4.5-air:free',
    'openai/gpt-oss-120b:free',
    'qwen/qwen3-next-80b-a3b-instruct:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'qwen/qwen3-coder:free',
    'nvidia/nemotron-3-super-120b-a12b:free'
  ],
  gemini: [
    'gemini-2.5-flash'
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
    "REGRAS SOBRE TAGS ESPECIAIS:\n" +
    "- 'sem-especificação': Use SOMENTE quando o cliente NÃO interagiu após o bot, ou seja, o atendente mandou mensagem mas o cliente NUNCA respondeu nada ao atendente.\n" +
    "- 'sem-resposta': Use SOMENTE quando o cliente informou o assunto ao atendente, mas depois parou de responder e o atendente não conseguiu agir ou consultar nada.\n" +
    "- NUNCA sugira 'sem-especificação' e 'sem-resposta' juntas. São mutuamente exclusivas.\n" +
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
      
      var signature = minifyChatText(chatText).substring(0, 100);
      metrics.analyzedChats = metrics.analyzedChats || [];
      
      if (!metrics.analyzedChats.includes(signature)) {
        metrics.analyzedChats.push(signature);
        if (metrics.analyzedChats.length > 500) metrics.analyzedChats.shift();
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

async function executeAIFallback(chatText, apiKeys, enabledProviders, learningData, customProviders, customModels) {
  var queue = [];
  logToConsole("Iniciando motor OmniTag de IA...");

  var ALL_PROVIDERS = JSON.parse(JSON.stringify(PROVIDER_MODELS));
  var providerURLs = {};
  
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
  var order = ['gemini', 'groq', 'openrouter'];
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

        chrome.storage.local.get(['apiKeys', 'enabledProviders', 'learningData', 'customProviders', 'customModels'], async function(result) {
      var apiKeys = result.apiKeys || {};
      var enabledProviders = result.enabledProviders || { gemini: true, groq: true, openrouter: true };
      
      if (Object.keys(apiKeys).length > 0) {
        try {
          var aiResult = await executeAIFallback(safeText, apiKeys, enabledProviders, result.learningData, result.customProviders, result.customModels);
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

    saveLearningData(lastChatSummary, lastSuggestedTags, actualTags);
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
