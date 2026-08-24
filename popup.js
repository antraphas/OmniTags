// ==================== OMNITAGS POPUP v2.0 ====================
// Provedores padrão (built-in) — IDs e configurações fixas
var DEFAULT_PROVIDERS = {
  gemini: {
    name: 'Google Gemini',
    url: '__gemini__',
    keyLink: 'https://aistudio.google.com/app/apikey',
    models: ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'],
    builtIn: true
  },
  groq: {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    keyLink: 'https://console.groq.com/keys',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    builtIn: true
  },
  openrouter: {
    name: 'OpenRouter',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    keyLink: 'https://openrouter.ai/keys',
    models: [
      'z-ai/glm-4.5-air:free',
      'openai/gpt-oss-120b:free',
      'qwen/qwen3-next-80b-a3b-instruct:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'qwen/qwen3-coder:free',
      'nvidia/nemotron-3-super-120b-a12b:free'
    ],
    builtIn: true
  },
  toqan: {
    name: 'Toqan (iFood AI Platform)',
    url: 'https://api.coco.prod.toqan.ai/api',
    keyLink: '',
    models: ['toqan-agent'],
    builtIn: true
  },
};

document.addEventListener('DOMContentLoaded', function() {
  // ==================== TAB NAVIGATION ====================
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.getAttribute('data-tab');
      tabBtns.forEach(function(b) { b.classList.remove('active'); });
      tabContents.forEach(function(c) { c.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-' + target).classList.add('active');

      if (target === 'dashboard') loadDashboard();
      if (target === 'config') loadConfig();
      if (target === 'backup') loadBackup();
    });
  });

  // ==================== REFERENCES ====================
  /* var providerSelect = document.getElementById('primary-provider'); */
  var providersList = document.getElementById('providers-list');
  var saveBtn = document.getElementById('save-btn');
  var statusMsg = document.getElementById('status-message');
  var addProviderBtn = document.getElementById('add-provider-btn');
  var modal = document.getElementById('new-provider-modal');
  var exportBtn = document.getElementById('export-btn');
  var importBtn = document.getElementById('import-btn');
  var importFile = document.getElementById('import-file');
  var learningCount = document.getElementById('learning-count');
  var learningStatus = document.getElementById('learning-status');
  var resetMetricsBtn = document.getElementById('reset-metrics-btn');

  // State
  var currentProviders = {}; // merged: default + custom
  var currentApiKeys = {};
  var currentEnabledProviders = {};
  var currentModels = {}; // provider_id -> [model, ...]

  function loadConfig() {
    chrome.storage.local.get(['apiKeys', 'enabledProviders', 'customProviders', 'customModels', 'toqan_base_url'], function(result) {
      currentApiKeys = result.apiKeys || {};
      currentEnabledProviders = result.enabledProviders || { gemini: true, groq: true, openrouter: true, toqan: true };
      
      // Se enabledProviders foi salvo mas toqan não está nele, inicializa como true por padrão
      if (result.enabledProviders && result.enabledProviders.toqan === undefined) {
        currentEnabledProviders.toqan = true;
      }

      var customProviders = result.customProviders || {};
      var customModels = result.customModels || {};

      // Merge default + custom providers
      currentProviders = {};
      Object.keys(DEFAULT_PROVIDERS).forEach(function(id) {
        currentProviders[id] = JSON.parse(JSON.stringify(DEFAULT_PROVIDERS[id]));
        if (id === 'toqan' && result.toqan_base_url) {
          currentProviders[id].url = result.toqan_base_url;
        }
        // Apply custom models if user modified them
        if (customModels[id]) {
          currentProviders[id].models = customModels[id];
        }
        // Assegura que os modelos hardcoded originais sempre estejam presentes
        DEFAULT_PROVIDERS[id].models.forEach(function(m) {
          if (currentProviders[id].models.indexOf(m) === -1) {
            currentProviders[id].models.push(m);
          }
        });
      });
      Object.keys(customProviders).forEach(function(id) {
        currentProviders[id] = customProviders[id];
        currentProviders[id].builtIn = false;
        if (customModels[id]) {
          currentProviders[id].models = customModels[id];
        }
      });

/* primary provider logic removed */

      renderProviders();
    });
  }

  function renderProviders() {
    providersList.innerHTML = '';

    Object.keys(currentProviders).forEach(function(id) {
      var prov = currentProviders[id];
      var card = document.createElement('div');
      card.className = 'provider-card';
      card.setAttribute('data-provider-id', id);

      // Header
      var header = document.createElement('div');
      header.className = 'provider-header';
      var isEnabled = currentEnabledProviders[id] !== false;
      header.innerHTML = '<div class="provider-name">' +
        escapeHTML(prov.name) +
        ' <span class="provider-badge ' + (prov.builtIn ? 'built-in' : 'custom-badge') + '">' +
        (prov.builtIn ? 'padrão' : 'custom') + '</span>' +
        '</div>' +
        '<label class="toggle-switch" title="Ativar/Desativar Provedor">' +
        '<input type="checkbox" data-toggle-provider="' + id + '" ' + (isEnabled ? 'checked' : '') + '>' +
        '<span class="slider"></span></label>' +
        '<span class="provider-chevron">▼</span>';

      header.addEventListener('click', function(e) {
        if(e.target.tagName.toLowerCase() === 'input' || e.target.classList.contains('slider')) return;
        card.classList.toggle('open');
      });

      // Body
      var body = document.createElement('div');
      body.className = 'provider-body';

      // API Key field
      var keyField = document.createElement('div');
      keyField.className = 'provider-field';
      var keyLabel = '<label>Chave de API';
      if (prov.keyLink) {
        keyLabel += ' <a href="' + escapeHTML(prov.keyLink) + '" target="_blank">Obter chave →</a>';
      }
      keyLabel += '</label>';
      keyField.innerHTML = keyLabel;

      // Dynamic keys container
      var keysContainer = document.createElement('div');
      keysContainer.className = 'keys-container';
      keysContainer.setAttribute('data-provider-keys', id);

      var keys = currentApiKeys[id] || [];
      if(!Array.isArray(keys) && typeof keys === 'string') keys = [keys];
      if(keys.length === 0) keys = ['']; // Pelo menos um campo vazio

      function createKeyRow(keyValue, isPrimary) {
        var row = document.createElement('div');
        row.className = 'key-row';

        var input = document.createElement('input');
        input.type = 'password';
        input.className = 'key-input';
        input.placeholder = id === 'gemini' ? 'AIzaSy...' : (id === 'toqan' ? 'Chave de API do Toqan...' : 'sk-...');
        input.value = keyValue || '';

        var radioWrapper = document.createElement('label');
        radioWrapper.className = 'radio-wrapper';
        radioWrapper.title = 'Marcar como Principal';
        
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'primary_key_' + id;
        if(isPrimary) radio.checked = true;
        
        radioWrapper.appendChild(radio);
        radioWrapper.appendChild(document.createTextNode(' Principal'));

        var removeBtn = document.createElement('button');
        removeBtn.className = 'remove-key-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remover chave';
        removeBtn.addEventListener('click', function() {
           row.remove();
           // se era o único checked, marca o primeiro que sobrar
           if(radio.checked) {
             var firstRadio = keysContainer.querySelector('input[type="radio"]');
             if(firstRadio) firstRadio.checked = true;
           }
        });

        row.appendChild(input);
        row.appendChild(radioWrapper);
        row.appendChild(removeBtn);
        return row;
      }

      keys.forEach(function(k, idx) {
         keysContainer.appendChild(createKeyRow(k, idx === 0));
      });

      var addKeyBtn = document.createElement('button');
      addKeyBtn.className = 'add-key-btn';
      addKeyBtn.textContent = '+ Adicionar nova key';
      addKeyBtn.addEventListener('click', function() {
         var isFirst = keysContainer.children.length === 0;
         keysContainer.appendChild(createKeyRow('', isFirst));
      });

      keyField.appendChild(keysContainer);
      keyField.appendChild(addKeyBtn);
      body.appendChild(keyField);

      // URL field (only for custom or toqan)
      if (!prov.builtIn || id === 'toqan') {
        var urlField = document.createElement('div');
        urlField.className = 'provider-field';
        urlField.innerHTML = '<label>URL da API (Base URL)</label>';
        var urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.className = 'input-field';
        urlInput.setAttribute('data-url-provider', id);
        urlInput.value = prov.url || '';
        urlField.appendChild(urlInput);
        body.appendChild(urlField);
      }

      // Models
      var modelsField = document.createElement('div');
      modelsField.className = 'provider-field';
      modelsField.innerHTML = '<label>Modelos (ordem de prioridade)</label>';
      var modelsContainer = document.createElement('div');
      modelsContainer.className = 'models-container';

      var chipsDiv = document.createElement('div');
      chipsDiv.className = 'model-chips';
      chipsDiv.setAttribute('data-chips-provider', id);

      (prov.models || []).forEach(function(model) {
        chipsDiv.appendChild(createModelChip(id, model));
      });
      modelsContainer.appendChild(chipsDiv);

      // Add model row
      var addRow = document.createElement('div');
      addRow.className = 'add-model-row';
      var addInput = document.createElement('input');
      addInput.type = 'text';
      addInput.className = 'input-field';
      addInput.placeholder = 'Nome do modelo...';
      var addBtn = document.createElement('button');
      addBtn.className = 'btn btn-secondary btn-sm';
      addBtn.textContent = '+ Adicionar';
      addBtn.addEventListener('click', function() {
        var modelName = addInput.value.trim();
        if (!modelName) return;
        if (!currentProviders[id].models) currentProviders[id].models = [];
        currentProviders[id].models.push(modelName);
        chipsDiv.appendChild(createModelChip(id, modelName));
        addInput.value = '';
      });
      addRow.appendChild(addInput);
      addRow.appendChild(addBtn);
      modelsContainer.appendChild(addRow);
      modelsField.appendChild(modelsContainer);
      body.appendChild(modelsField);

      // Remove provider button (only for custom)
      if (!prov.builtIn) {
        var removeBtn = document.createElement('button');
        removeBtn.className = 'remove-provider-btn';
        removeBtn.textContent = '🗑️ Remover Provedor';
        removeBtn.addEventListener('click', function() {
          delete currentProviders[id];
          delete currentApiKeys[id];
          card.remove();
// Select removed
        });
        body.appendChild(removeBtn);
      }

      card.appendChild(header);
      card.appendChild(body);
      providersList.appendChild(card);
    });
  }

  function createModelChip(providerId, modelName) {
    var isDisabled = modelName.startsWith('!');
    var actualName = isDisabled ? modelName.substring(1) : modelName;

    var chip = document.createElement('span');
    chip.className = 'model-chip' + (isDisabled ? ' disabled-chip' : '');
    
    var toggleBtn = document.createElement('span');
    toggleBtn.className = 'toggle-model';
    toggleBtn.innerHTML = isDisabled ? '⊘' : '◉';
    toggleBtn.title = isDisabled ? 'Ativar modelo' : 'Desativar modelo';

    var nameSpan = document.createElement('span');
    nameSpan.className = 'model-name-text';
    nameSpan.textContent = ' ' + actualName + ' ';

    var removeBtn = document.createElement('span');
    removeBtn.className = 'remove-model';
    removeBtn.innerHTML = '×';

    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var models = currentProviders[providerId].models || [];
      var idx = models.indexOf(modelName);
      if (idx !== -1) {
        var newName = isDisabled ? actualName : ('!' + actualName);
        models[idx] = newName;
        var newChip = createModelChip(providerId, newName);
        chip.parentNode.replaceChild(newChip, chip);
      }
    });

    removeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var models = currentProviders[providerId].models || [];
      var idx = models.indexOf(modelName);
      if (idx !== -1) models.splice(idx, 1);
      chip.remove();
    });

    chip.appendChild(toggleBtn);
    chip.appendChild(nameSpan);
    chip.appendChild(removeBtn);
    return chip;
  }

  // ==================== SAVE CONFIG ====================
  saveBtn.addEventListener('click', function() {
    // Collect enabled states
    var enabledStates = {};
    document.querySelectorAll('[data-toggle-provider]').forEach(function(input) {
      enabledStates[input.getAttribute('data-toggle-provider')] = input.checked;
    });

    // Collect API keys
    var keys = {};
    document.querySelectorAll('[data-provider-keys]').forEach(function(container) {
      var pid = container.getAttribute('data-provider-keys');
      var collected = [];
      var rows = container.querySelectorAll('.key-row');
      
      var primaryKey = null;
      var fallbackKeys = [];
      
      rows.forEach(function(row) {
         var inputVal = row.querySelector('.key-input').value.trim();
         var isPrimary = row.querySelector('input[type="radio"]').checked;
         
         if(inputVal) {
            if(isPrimary) primaryKey = inputVal;
            else fallbackKeys.push(inputVal);
         }
      });
      
      if(primaryKey) collected.push(primaryKey);
      fallbackKeys.forEach(function(fk) { collected.push(fk); });
      
      if(collected.length > 0) {
         keys[pid] = collected;
      }
    });

    // Collect URLs for custom providers or toqan
    document.querySelectorAll('[data-url-provider]').forEach(function(input) {
      var pid = input.getAttribute('data-url-provider');
      if (currentProviders[pid]) {
        currentProviders[pid].url = input.value.trim();
      }
    });

    // Separate custom providers and custom model lists
    var customProviders = {};
    var customModels = {};

    Object.keys(currentProviders).forEach(function(id) {
      var prov = currentProviders[id];
      customModels[id] = prov.models || [];
      if (!prov.builtIn) {
        customProviders[id] = {
          name: prov.name,
          url: prov.url,
          keyLink: prov.keyLink || '',
          models: prov.models || []
        };
      }
    });

    // Validar se API Key do Toqan foi informada caso esteja ativo
    if (enabledStates['toqan'] && (!keys['toqan'] || keys['toqan'].length === 0)) {
      statusMsg.style.color = '#ef4444';
      statusMsg.textContent = '⚠️ Por favor, insira a API Key do Toqan.';
      return;
    }

    if (Object.keys(keys).length === 0) {
      statusMsg.style.color = '#ef4444';
      statusMsg.textContent = 'Insira pelo menos uma chave de API.';
      return;
    }

    var toqanUrlInput = document.querySelector('[data-url-provider="toqan"]');
    var toqanBaseUrl = toqanUrlInput ? toqanUrlInput.value.trim() : 'https://api.coco.prod.toqan.ai/api';

    chrome.storage.local.set({
      apiKeys: keys,
      enabledProviders: enabledStates,
      customProviders: customProviders,
      customModels: customModels,
      toqan_base_url: toqanBaseUrl
    }, function() {
      statusMsg.style.color = '#10b981';
      statusMsg.textContent = 'Configurações salvas com sucesso!';
      setTimeout(function() { statusMsg.textContent = ''; }, 3000);
    });
  });

  // ==================== ADD PROVIDER MODAL ====================
  addProviderBtn.addEventListener('click', function() {
    modal.style.display = 'flex';
  });

  document.getElementById('np-cancel').addEventListener('click', function() {
    modal.style.display = 'none';
  });

  document.getElementById('np-save').addEventListener('click', function() {
    var name = document.getElementById('np-name').value.trim();
    var url = document.getElementById('np-url').value.trim();
    var key = document.getElementById('np-key').value.trim();
    var model = document.getElementById('np-model').value.trim();
    var link = document.getElementById('np-link').value.trim();

    if (!name || !url) {
      alert('Nome e URL são obrigatórios.');
      return;
    }

    var id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (currentProviders[id]) {
      alert('Já existe um provedor com esse nome.');
      return;
    }

    currentProviders[id] = {
      name: name,
      url: url,
      keyLink: link,
      models: model ? [model] : [],
      builtIn: false
    };

    if (key) currentApiKeys[id] = key;

    // Add to select
    var opt = document.createElement('option');
    opt.value = id;
    opt.textContent = name;
    providerSelect.appendChild(opt);

    // Clear modal
    document.getElementById('np-name').value = '';
    document.getElementById('np-url').value = '';
    document.getElementById('np-key').value = '';
    document.getElementById('np-model').value = '';
    document.getElementById('np-link').value = '';
    modal.style.display = 'none';

    renderProviders();
  });

  // ==================== DASHBOARD ====================
  function loadDashboard() {
    chrome.storage.local.get(['omnitagsMetrics', 'learningData'], function(result) {
      var metrics = result.omnitagsMetrics || {};
      var learningData = result.learningData || [];

      // Totals
      document.getElementById('m-total-chats').textContent = formatNumber(metrics.totalChats || 0);
      document.getElementById('m-total-tokens').textContent = formatNumber(metrics.totalTokens || 0);

      // Hits / Misses
      var hits = metrics.hits || 0;
      var misses = metrics.misses || 0;
      document.getElementById('m-hits').textContent = hits;
      document.getElementById('m-misses').textContent = misses;

      // Accuracy — assertividade da IA por atendimento
      var total = hits + misses;
      if (total > 0) {
        var pct = Math.round((hits / total) * 100);
        document.getElementById('m-accuracy').textContent = pct + '%';
        document.getElementById('m-accuracy-sub').textContent =
          hits + ' de ' + total + ' atendimentos assertivos';
      } else {
        document.getElementById('m-accuracy').textContent = '—';
        document.getElementById('m-accuracy-sub').textContent = 'nenhuma interação registrada ainda';
      }

      // Last provider/model
      document.getElementById('m-last-provider').textContent = metrics.lastProvider || '—';
      document.getElementById('m-last-model').textContent = metrics.lastModel || '—';
      document.getElementById('m-last-time').textContent = metrics.lastTime ? (metrics.lastTime + 's') : '—';

      // Chart
      renderChart(metrics.tokensByProvider || {});

      // Chat history list
      renderChatHistory(metrics.chatHistory || []);
    });
  }

  // Extrai o ID do Chat da URL (ex: /conversation/1166658770879150)
  function extractChatId(url) {
    if (!url) return '';
    var convMatch = url.match(/\/conversation\/(\d+)/i);
    if (convMatch) return convMatch[1];
    var ticketMatch = url.match(/\/tickets?\/(\d+)/i);
    if (ticketMatch) return ticketMatch[1];
    var cleanUrl = url.split(/[?#]/)[0].replace(/\/+$/, '');
    var parts = cleanUrl.split('/');
    for (var i = parts.length - 1; i >= 0; i--) {
      if (/^\d{5,}$/.test(parts[i])) {
        return parts[i];
      }
    }
    return '';
  }

  function renderChart(tokensByProvider) {

    var chartEl = document.getElementById('provider-chart');
    var entries = Object.keys(tokensByProvider).map(function(key) {
      return { name: key, tokens: tokensByProvider[key] || 0 };
    }).filter(function(e) { return e.tokens > 0; });

    if (entries.length === 0) {
      chartEl.innerHTML = '<div class="chart-empty">Nenhum dado ainda. Use a extensão para gerar métricas.</div>';
      return;
    }

    var maxTokens = Math.max.apply(null, entries.map(function(e) { return e.tokens; }));

    var html = '';
    entries.forEach(function(entry) {
      var pct = Math.max(2, Math.round((entry.tokens / maxTokens) * 100));
      var colorClass = DEFAULT_PROVIDERS[entry.name] ? entry.name : 'custom';
      html += '<div class="chart-row">' +
        '<span class="chart-label">' + escapeHTML(entry.name) + '</span>' +
        '<div class="chart-bar-bg">' +
        '<div class="chart-bar-fill ' + colorClass + '" style="width:' + pct + '%"></div>' +
        '<span class="chart-bar-value">' + formatNumber(entry.tokens) + ' tokens</span>' +
        '</div></div>';
    });
    chartEl.innerHTML = html;
  }

  // ==================== CHAT HISTORY MODAL ====================
  var currentChatHistory = [];

  function renderChatHistory(history, filterQuery) {
    if (history !== undefined) currentChatHistory = history || [];
    var listEl = document.getElementById('chat-history-list');
    if (!listEl) return;

    if (!currentChatHistory || currentChatHistory.length === 0) {
      listEl.innerHTML = '<div class="chat-history-empty">Nenhum chat analisado ainda.<br><small>Clique em "Ler Conversa" em um chat do Freshdesk para registrar.</small></div>';
      return;
    }

    var query = (filterQuery || '').trim().toLowerCase();
    var filtered = currentChatHistory.filter(function(entry) {
      if (!query) return true;
      var effectiveId = (extractChatId(entry.url) || entry.chatId || '').toLowerCase();
      var dateStr = (entry.date || '').toLowerCase();
      var urlStr = (entry.url || '').toLowerCase();
      return effectiveId.indexOf(query) !== -1 || dateStr.indexOf(query) !== -1 || urlStr.indexOf(query) !== -1;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="chat-history-empty">Nenhum chat encontrado para o termo: "<strong>' + escapeHTML(query) + '</strong>"</div>';
      return;
    }

    var html = '';
    filtered.forEach(function(entry) {
      var effectiveId = extractChatId(entry.url) || entry.chatId || '';
      var idBadge = effectiveId
        ? ' <span class="chat-history-id">#' + escapeHTML(effectiveId) + '</span>'
        : '';
      html += '<a class="chat-history-item" href="' + escapeHTML(entry.url) + '" target="_blank" title="' + escapeHTML(entry.url) + '">' +
        '<span class="chat-history-icon">💬</span>' +
        '<span class="chat-history-label">Chat ' + escapeHTML(entry.date) + idBadge + '</span>' +
        '<span class="chat-history-arrow">↗</span>' +
        '</a>';
    });
    listEl.innerHTML = html;
  }

  var cardChats = document.getElementById('card-chats-analisados');
  var historyModal = document.getElementById('chat-history-modal');
  var closeHistoryBtn = document.getElementById('close-history-modal');
  var historySearchInput = document.getElementById('chat-history-search');

  if (historySearchInput) {
    historySearchInput.addEventListener('input', function(e) {
      renderChatHistory(currentChatHistory, e.target.value);
    });
  }

  if (cardChats && historyModal) {
    cardChats.addEventListener('click', function() {
      historyModal.style.display = 'flex';
      if (historySearchInput) {
        historySearchInput.value = '';
        setTimeout(function() { historySearchInput.focus(); }, 50);
      }
      renderChatHistory(currentChatHistory, '');
    });
  }
  if (closeHistoryBtn && historyModal) {
    closeHistoryBtn.addEventListener('click', function() {
      historyModal.style.display = 'none';
    });
  }
  if (historyModal) {
    historyModal.addEventListener('click', function(e) {
      if (e.target === historyModal) historyModal.style.display = 'none';
    });
  }

  // ==================== RESET METRICS ====================
  resetMetricsBtn.addEventListener('click', function() {
    if (confirm('Tem certeza que deseja resetar todas as métricas? O aprendizado NÃO será apagado.')) {
      chrome.storage.local.set({ omnitagsMetrics: {} }, function() {
        loadDashboard();
      });
    }
  });

  // ==================== BACKUP TAB ====================
  var currentCorrectionIndex = null; // tracks which correction is open in the modal

  function loadBackup() {
    chrome.storage.local.get(['learningData'], function(result) {
      var data = result.learningData || [];
      learningCount.textContent = data.length + ' correções salvas';
      renderCorrectionsList(data);
    });
  }

  function renderCorrectionsList(data) {
    var listEl = document.getElementById('corrections-list');
    var countEl = document.getElementById('corrections-count');
    if (!listEl) return;

    if (countEl) countEl.textContent = data.length;

    if (data.length === 0) {
      listEl.innerHTML = '<div class="corrections-empty">Nenhuma correção salva ainda.<br><small>Clique em 🧠 após corrigir tags para registrar.</small></div>';
      return;
    }

    // Show most recent first
    var reversed = data.slice().reverse();
    var html = '';
    reversed.forEach(function(entry, idx) {
      var realIdx = data.length - 1 - idx;
      var date = entry.timestamp
        ? new Date(entry.timestamp).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
        : '—';

      // Use saved counts (new entries) or compute on-the-fly (legacy entries)
      var hitCount  = (entry.hitCount  !== undefined) ? entry.hitCount
        : (entry.suggestedTags || []).filter(function(t) { return (entry.actualTags || []).indexOf(t) !== -1; }).length;
      var missCount = (entry.missCount !== undefined) ? entry.missCount
        : (entry.suggestedTags || []).filter(function(t) { return (entry.actualTags || []).indexOf(t) === -1; }).length;

      var statusHtml = '';
      if (hitCount > 0)  statusHtml += '<span class="correction-status status-hit">✓ ' + hitCount  + ' acerto'  + (hitCount  > 1 ? 's' : '') + '</span>';
      if (missCount > 0) statusHtml += '<span class="correction-status status-miss">✗ ' + missCount + ' erro'   + (missCount > 1 ? 's' : '') + '</span>';
      if (!statusHtml)   statusHtml = '<span class="correction-status status-hit">✓ Perfeito</span>';

      var preview = (entry.chatSummary || '').replace(/\n/g, ' ').substring(0, 80);

      html += '<div class="correction-item" data-idx="' + realIdx + '">' +
        '<div class="correction-item-top">' +
          '<span class="correction-date">' + escapeHTML(date) + '</span>' +
          '<span class="correction-statuses">' + statusHtml + '</span>' +
          '<button class="correction-delete-inline" data-idx="' + realIdx + '" title="Excluir">🗑️</button>' +
        '</div>' +
        '<div class="correction-preview-text">' + escapeHTML(preview) + (preview.length >= 80 ? '…' : '') + '</div>' +
        '<div class="correction-tags-row">' +
          '<span class="ctag-label">IA:</span>' +
          renderTagPillsCompared(entry.suggestedTags || [], entry.actualTags || []) +
          '<span class="ctag-sep">→</span>' +
          '<span class="ctag-label">Correto:</span>' +
          renderTagPills(entry.actualTags || [], 'pill-actual') +
        '</div>' +
      '</div>';
    });
    listEl.innerHTML = html;

    // Click on item → open detail modal
    listEl.querySelectorAll('.correction-item').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if (e.target.classList.contains('correction-delete-inline') ||
            e.target.closest('.correction-delete-inline')) return;
        var idx = parseInt(el.getAttribute('data-idx'));
        openCorrectionDetail(data, idx);
      });
    });

    // Inline delete buttons
    listEl.querySelectorAll('.correction-delete-inline').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var idx = parseInt(btn.getAttribute('data-idx'));
        if (confirm('Excluir esta correção?')) {
          deleteCorrection(data, idx);
        }
      });
    });
  }

  function renderTagPills(tags, cls) {
    if (!tags || tags.length === 0) return '<span class="pill-empty">—</span>';
    return tags.map(function(t) {
      return '<span class="tag-pill ' + cls + '">' + escapeHTML(t) + '</span>';
    }).join('');
  }

  // Renders suggested tag pills highlighted as hit (green) or miss (red)
  function renderTagPillsCompared(suggestedTags, actualTags) {
    if (!suggestedTags || suggestedTags.length === 0) return '<span class="pill-empty">—</span>';
    return suggestedTags.map(function(t) {
      var isHit = actualTags.indexOf(t) !== -1;
      return '<span class="tag-pill ' + (isHit ? 'pill-hit' : 'pill-miss') + '">' + escapeHTML(t) + '</span>';
    }).join('');
  }

  function openCorrectionDetail(data, idx) {
    var entry = data[idx];
    if (!entry) return;
    currentCorrectionIndex = idx;

    var date = entry.timestamp
      ? new Date(entry.timestamp).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
      : '—';

    var chatPreview = (entry.chatSummary || '(sem preview de chat)').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    var hitCount  = (entry.hitCount  !== undefined) ? entry.hitCount
      : (entry.suggestedTags || []).filter(function(t) { return (entry.actualTags || []).indexOf(t) !== -1; }).length;
    var missCount = (entry.missCount !== undefined) ? entry.missCount
      : (entry.suggestedTags || []).filter(function(t) { return (entry.actualTags || []).indexOf(t) === -1; }).length;

    var statusHtml = '';
    if (hitCount > 0)  statusHtml += '<span class="correction-status status-hit">✓ ' + hitCount  + ' acerto'  + (hitCount  > 1 ? 's' : '') + '</span> ';
    if (missCount > 0) statusHtml += '<span class="correction-status status-miss">✗ ' + missCount + ' erro'   + (missCount > 1 ? 's' : '') + '</span>';
    if (!statusHtml)   statusHtml = '<span class="correction-status status-hit">✓ IA acertou tudo</span>';

    var bodyEl = document.getElementById('correction-detail-body');
    var convId = extractChatId(entry.chatUrl);
    var chatLinkText = convId ? ('🔗 Abrir Chat #' + escapeHTML(convId)) : '🔗 Abrir Chat Original';
    var chatLinkHtml = entry.chatUrl
      ? '<div class="cd-chat-link"><a href="' + escapeHTML(entry.chatUrl) + '" target="_blank" class="cd-link-anchor">' +
          chatLinkText + '</a></div>'
      : '';

    bodyEl.innerHTML =
      '<div class="cd-date">📅 ' + escapeHTML(date) + ' &nbsp;' + statusHtml + '</div>' +
      chatLinkHtml +

      '<div class="cd-section">' +
        '<div class="cd-section-title">💬 Prévia do Chat</div>' +
        '<div class="cd-chat-preview">' + chatPreview + '</div>' +
      '</div>' +

      '<div class="cd-section">' +
        '<div class="cd-section-title">🤖 Tags sugeridas pela IA <small style="font-weight:400;text-transform:none;opacity:0.7">(verde = acertou · vermelho = errou)</small></div>' +
        '<div class="cd-tags">' + renderTagPillsCompared(entry.suggestedTags || [], entry.actualTags || []) + '</div>' +
      '</div>' +

      '<div class="cd-section">' +
        '<div class="cd-section-title">✅ Tags corretas (você escolheu)</div>' +
        '<div class="cd-tags">' + renderTagPills(entry.actualTags || [], 'pill-actual') + '</div>' +
      '</div>';

    document.getElementById('correction-detail-modal').style.display = 'flex';
  }

  function deleteCorrection(data, idx) {
    data.splice(idx, 1);
    chrome.storage.local.set({ learningData: data }, function() {
      learningCount.textContent = data.length + ' correções salvas';
      renderCorrectionsList(data);
      // Close modal if open
      var modal = document.getElementById('correction-detail-modal');
      if (modal) modal.style.display = 'none';
      var statusEl = document.getElementById('learning-status');
      if (statusEl) {
        statusEl.style.color = '#10b981';
        statusEl.textContent = 'Correção excluída.';
        setTimeout(function() { statusEl.textContent = ''; }, 2500);
      }
    });
  }

  // Modal close / delete button wiring
  var correctionModal   = document.getElementById('correction-detail-modal');
  var closeCorrectionBtn = document.getElementById('close-correction-modal');
  var deleteCorrectionBtn = document.getElementById('delete-correction-btn');

  if (closeCorrectionBtn) {
    closeCorrectionBtn.addEventListener('click', function() {
      correctionModal.style.display = 'none';
    });
  }
  if (correctionModal) {
    correctionModal.addEventListener('click', function(e) {
      if (e.target === correctionModal) correctionModal.style.display = 'none';
    });
  }
  if (deleteCorrectionBtn) {
    deleteCorrectionBtn.addEventListener('click', function() {
      if (currentCorrectionIndex === null) return;
      if (!confirm('Excluir esta correção permanentemente?')) return;
      chrome.storage.local.get(['learningData'], function(result) {
        var data = result.learningData || [];
        deleteCorrection(data, currentCorrectionIndex);
        currentCorrectionIndex = null;
      });
    });
  }

  exportBtn.addEventListener('click', function() {
    chrome.storage.local.get(['learningData', 'apiKeys', 'primaryProvider', 'customProviders', 'customModels', 'omnitagsMetrics', 'toqan_api_key', 'toqan_enabled', 'toqan_base_url'], function(result) {
      var data = {
        learningData: result.learningData || [],
        apiKeys: result.apiKeys || {},
        primaryProvider: result.primaryProvider || 'groq',
        customProviders: result.customProviders || {},
        customModels: result.customModels || {},
        omnitagsMetrics: result.omnitagsMetrics || {},
        toqan_api_key: result.toqan_api_key || '',
        toqan_enabled: result.toqan_enabled || false,
        toqan_base_url: result.toqan_base_url || 'https://api.coco.prod.toqan.ai/api',
        exportedAt: new Date().toISOString(),
        version: '2.6 Rev 24/08/2026'
      };

      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'omnitags_backup_' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      URL.revokeObjectURL(url);

      learningStatus.style.color = '#10b981';
      learningStatus.textContent = 'Backup exportado com sucesso!';
      setTimeout(function() { learningStatus.textContent = ''; }, 3000);
    });
  });

  importBtn.addEventListener('click', function() { importFile.click(); });

  importFile.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(event) {
      try {
        var imported = JSON.parse(event.target.result);

        var newLearning = [];
        var newApiKeys = null;
        var newPrimary = null;
        var newCustomProviders = null;
        var newCustomModels = null;
        var newMetrics = null;
        var newToqanApiKey = null;
        var newToqanEnabled = null;
        var newToqanBaseUrl = null;

        if (Array.isArray(imported)) {
          newLearning = imported;
        } else {
          newLearning = imported.learningData || [];
          newApiKeys = imported.apiKeys;
          newPrimary = imported.primaryProvider;
          newCustomProviders = imported.customProviders;
          newCustomModels = imported.customModels;
          newMetrics = imported.omnitagsMetrics;
          newToqanApiKey = imported.toqan_api_key;
          newToqanEnabled = imported.toqan_enabled;
          newToqanBaseUrl = imported.toqan_base_url;
        }

        chrome.storage.local.get(['learningData'], function(result) {
          var existing = result.learningData || [];
          var existingTs = {};
          existing.forEach(function(e) { existingTs[e.timestamp] = true; });

          newLearning.forEach(function(entry) {
            if (entry.chatSummary && entry.actualTags && !existingTs[entry.timestamp]) {
              existing.push(entry);
            }
          });

          var updates = { learningData: existing };
          if (newApiKeys) updates.apiKeys = newApiKeys;
          if (newPrimary) updates.primaryProvider = newPrimary;
          if (newCustomProviders) updates.customProviders = newCustomProviders;
          if (newCustomModels) updates.customModels = newCustomModels;
          if (newMetrics) updates.omnitagsMetrics = newMetrics;
          if (newToqanApiKey !== null && newToqanApiKey !== undefined) updates.toqan_api_key = newToqanApiKey;
          if (newToqanEnabled !== null && newToqanEnabled !== undefined) updates.toqan_enabled = newToqanEnabled;
          if (newToqanBaseUrl !== null && newToqanBaseUrl !== undefined) updates.toqan_base_url = newToqanBaseUrl;

          chrome.storage.local.set(updates, function() {
            learningCount.textContent = existing.length + ' correções salvas';
            learningStatus.style.color = '#10b981';
            learningStatus.textContent = 'Backup restaurado com sucesso!';
            setTimeout(function() { learningStatus.textContent = ''; }, 3000);
            loadConfig();
          });
        });
      } catch(err) {
        learningStatus.style.color = '#ef4444';
        learningStatus.textContent = 'Erro: arquivo inválido.';
        setTimeout(function() { learningStatus.textContent = ''; }, 3000);
      }
    };
    reader.readAsText(file);
    importFile.value = '';
  });

  // ==================== HELPERS ====================
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, function(tag) {
      var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
      return map[tag] || tag;
    });
  }

  function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }

  // ==================== INITIAL LOAD ====================
  loadDashboard();
  loadConfig();
  loadBackup();
});
