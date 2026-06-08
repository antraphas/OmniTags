// ==================== OMNITAGS POPUP v2.0 ====================
// Provedores padrão (built-in) — IDs e configurações fixas
var DEFAULT_PROVIDERS = {
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
  gemini: {
    name: 'Google Gemini',
    url: '__gemini__',
    keyLink: 'https://aistudio.google.com/app/apikey',
    models: ['gemini-2.5-flash'],
    builtIn: true
  }
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
  var providerSelect = document.getElementById('primary-provider');
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
  var currentModels = {}; // provider_id -> [model, ...]

  // ==================== LOAD CONFIG TAB ====================
  function loadConfig() {
    chrome.storage.local.get(['apiKeys', 'primaryProvider', 'customProviders', 'customModels'], function(result) {
      currentApiKeys = result.apiKeys || {};
      var customProviders = result.customProviders || {};
      var customModels = result.customModels || {};

      // Merge default + custom providers
      currentProviders = {};
      Object.keys(DEFAULT_PROVIDERS).forEach(function(id) {
        currentProviders[id] = JSON.parse(JSON.stringify(DEFAULT_PROVIDERS[id]));
        // Apply custom models if user modified them
        if (customModels[id]) {
          currentProviders[id].models = customModels[id];
        }
      });
      Object.keys(customProviders).forEach(function(id) {
        currentProviders[id] = customProviders[id];
        currentProviders[id].builtIn = false;
        if (customModels[id]) {
          currentProviders[id].models = customModels[id];
        }
      });

      // Build provider select
      providerSelect.innerHTML = '';
      Object.keys(currentProviders).forEach(function(id) {
        var opt = document.createElement('option');
        opt.value = id;
        opt.textContent = currentProviders[id].name;
        providerSelect.appendChild(opt);
      });
      if (result.primaryProvider && currentProviders[result.primaryProvider]) {
        providerSelect.value = result.primaryProvider;
      }

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
      header.innerHTML = '<div class="provider-name">' +
        escapeHTML(prov.name) +
        ' <span class="provider-badge ' + (prov.builtIn ? 'built-in' : 'custom-badge') + '">' +
        (prov.builtIn ? 'padrão' : 'custom') + '</span>' +
        '</div>' +
        '<span class="provider-chevron">▼</span>';

      header.addEventListener('click', function() {
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

      var keyInput = document.createElement('input');
      keyInput.type = 'password';
      keyInput.className = 'input-field';
      keyInput.setAttribute('data-key-provider', id);
      keyInput.placeholder = id === 'gemini' ? 'AIzaSy...' : id === 'groq' ? 'gsk_...' : 'sk-...';
      keyInput.value = currentApiKeys[id] || '';
      keyField.appendChild(keyInput);
      body.appendChild(keyField);

      // URL field (only for custom)
      if (!prov.builtIn) {
        var urlField = document.createElement('div');
        urlField.className = 'provider-field';
        urlField.innerHTML = '<label>URL da API</label>';
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
          // Update select
          var opt = providerSelect.querySelector('option[value="' + id + '"]');
          if (opt) opt.remove();
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
    var primary = providerSelect.value;

    // Collect API keys from all inputs
    var keys = {};
    document.querySelectorAll('[data-key-provider]').forEach(function(input) {
      var pid = input.getAttribute('data-key-provider');
      var val = input.value.trim();
      if (val) keys[pid] = val;
    });

    // Collect URLs for custom providers
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

    if (Object.keys(keys).length === 0) {
      statusMsg.style.color = '#ef4444';
      statusMsg.textContent = 'Insira pelo menos uma chave de API.';
      return;
    }

    chrome.storage.local.set({
      apiKeys: keys,
      primaryProvider: primary,
      customProviders: customProviders,
      customModels: customModels
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

      // Accuracy
      var total = hits + misses;
      if (total > 0) {
        var pct = Math.round((hits / total) * 100);
        document.getElementById('m-accuracy').textContent = pct + '%';
        document.getElementById('m-accuracy-sub').textContent = hits + ' acertos em ' + total + ' aprendizados';
      } else {
        document.getElementById('m-accuracy').textContent = '—';
        document.getElementById('m-accuracy-sub').textContent = 'clique no 🧠 após corrigir tags para gerar dados';
      }

      // Last provider/model
      document.getElementById('m-last-provider').textContent = metrics.lastProvider || '—';
      document.getElementById('m-last-model').textContent = metrics.lastModel || '—';
      document.getElementById('m-last-time').textContent = metrics.lastTime ? (metrics.lastTime + 's') : '—';

      // Chart
      renderChart(metrics.tokensByProvider || {});
    });
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

  // ==================== RESET METRICS ====================
  resetMetricsBtn.addEventListener('click', function() {
    if (confirm('Tem certeza que deseja resetar todas as métricas? O aprendizado NÃO será apagado.')) {
      chrome.storage.local.set({ omnitagsMetrics: {} }, function() {
        loadDashboard();
      });
    }
  });

  // ==================== BACKUP TAB ====================
  function loadBackup() {
    chrome.storage.local.get(['learningData'], function(result) {
      var data = result.learningData || [];
      learningCount.textContent = data.length + ' correções salvas';
    });
  }

  exportBtn.addEventListener('click', function() {
    chrome.storage.local.get(['learningData', 'apiKeys', 'primaryProvider', 'customProviders', 'customModels', 'omnitagsMetrics'], function(result) {
      var data = {
        learningData: result.learningData || [],
        apiKeys: result.apiKeys || {},
        primaryProvider: result.primaryProvider || 'groq',
        customProviders: result.customProviders || {},
        customModels: result.customModels || {},
        omnitagsMetrics: result.omnitagsMetrics || {},
        exportedAt: new Date().toISOString(),
        version: '2.0'
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

        if (Array.isArray(imported)) {
          newLearning = imported;
        } else {
          newLearning = imported.learningData || [];
          newApiKeys = imported.apiKeys;
          newPrimary = imported.primaryProvider;
          newCustomProviders = imported.customProviders;
          newCustomModels = imported.customModels;
          newMetrics = imported.omnitagsMetrics;
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
