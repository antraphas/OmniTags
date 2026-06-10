import sys
import re

with open('content.js', 'r', encoding='utf-8') as f:
    code = f.read()

readCurrentTagsFromField_new = """function readCurrentTagsFromField() {
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
}"""
# Use regex to replace the function definition
code = re.sub(r'function readCurrentTagsFromField\(\) \{.*?(?=function saveLearningData)', readCurrentTagsFromField_new + '\n\n', code, flags=re.DOTALL)


executeAIFallback_new = """async function executeAIFallback(chatText, apiKeys, enabledProviders, learningData, customProviders, customModels) {
  var queue = [];
  logToConsole("Iniciando motor OmniTags de IA...");

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
}"""
code = re.sub(r'async function executeAIFallback\(chatText, apiKeys, primaryProvider, learningData, customProviders, customModels\) \{.*?(?=// UI Injection)', executeAIFallback_new + '\n\n', code, flags=re.DOTALL)

# Update storage fetch
storage_fetch_new = """    chrome.storage.local.get(['apiKeys', 'enabledProviders', 'learningData', 'customProviders', 'customModels'], async function(result) {
      var apiKeys = result.apiKeys || {};
      var enabledProviders = result.enabledProviders || { gemini: true, groq: true, openrouter: true };
      
      if (Object.keys(apiKeys).length > 0) {
        try {
          var aiResult = await executeAIFallback(safeText, apiKeys, enabledProviders, result.learningData, result.customProviders, result.customModels);"""
code = re.sub(r'chrome\.storage\.local\.get\(\[\'apiKeys\', \'primaryProvider\', \'learningData\', \'customProviders\', \'customModels\'\], async function\(result\) \{.*?try \{.*?var aiResult = await executeAIFallback\(safeText, apiKeys, primary, result\.learningData, result\.customProviders, result\.customModels\);', storage_fetch_new, code, flags=re.DOTALL)

with open('content.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("content.js patched")
