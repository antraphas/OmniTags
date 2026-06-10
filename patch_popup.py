import sys

with open('popup.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update DEFAULT_PROVIDERS order
code = code.replace("""var DEFAULT_PROVIDERS = {
  groq: {""", """var DEFAULT_PROVIDERS = {
  gemini: {
    name: 'Google Gemini',
    url: '__gemini__',
    keyLink: 'https://aistudio.google.com/app/apikey',
    models: ['gemini-2.5-flash'],
    builtIn: true
  },
  groq: {""")

code = code.replace("""  gemini: {
    name: 'Google Gemini',
    url: '__gemini__',
    keyLink: 'https://aistudio.google.com/app/apikey',
    models: ['gemini-2.5-flash'],
    builtIn: true
  }
};""", """};""")

# 2. Add enabledProviders state
code = code.replace("var currentApiKeys = {};", "var currentApiKeys = {};\n  var currentEnabledProviders = {};")
code = code.replace("chrome.storage.local.get(['apiKeys', 'primaryProvider', 'customProviders', 'customModels'], function(result) {", "chrome.storage.local.get(['apiKeys', 'enabledProviders', 'customProviders', 'customModels'], function(result) {")
code = code.replace("currentApiKeys = result.apiKeys || {};", "currentApiKeys = result.apiKeys || {};\n      currentEnabledProviders = result.enabledProviders || { gemini: true, groq: true, openrouter: true };")

# 3. Remove primary provider logic from loadConfig
code = code.replace("""      // Build provider select
      providerSelect.innerHTML = '';
      Object.keys(currentProviders).forEach(function(id) {
        var opt = document.createElement('option');
        opt.value = id;
        opt.textContent = currentProviders[id].name;
        providerSelect.appendChild(opt);
      });
      if (result.primaryProvider && currentProviders[result.primaryProvider]) {
        providerSelect.value = result.primaryProvider;
      }""", "/* primary provider logic removed */")

# 4. Add toggle and textarea to renderProviders
header_replacement = """      var isEnabled = currentEnabledProviders[id] !== false;
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
      });"""
code = code.replace("""      header.innerHTML = '<div class="provider-name">' +
        escapeHTML(prov.name) +
        ' <span class="provider-badge ' + (prov.builtIn ? 'built-in' : 'custom-badge') + '">' +
        (prov.builtIn ? 'padrão' : 'custom') + '</span>' +
        '</div>' +
        '<span class="provider-chevron">▼</span>';

      header.addEventListener('click', function() {
        card.classList.toggle('open');
      });""", header_replacement)

key_input_replacement = """      var keyInput = document.createElement('textarea');
      keyInput.className = 'input-field';
      keyInput.setAttribute('data-key-provider', id);
      keyInput.placeholder = 'Chaves de API (uma por linha)\\nPara rotação automática';
      var keys = currentApiKeys[id] || [];
      if(!Array.isArray(keys) && typeof keys === 'string') keys = [keys];
      keyInput.value = keys.join('\\n');"""
code = code.replace("""      var keyInput = document.createElement('input');
      keyInput.type = 'password';
      keyInput.className = 'input-field';
      keyInput.setAttribute('data-key-provider', id);
      keyInput.placeholder = id === 'gemini' ? 'AIzaSy...' : id === 'groq' ? 'gsk_...' : 'sk-...';
      keyInput.value = currentApiKeys[id] || '';""", key_input_replacement)

# 5. Save config
save_logic = """  saveBtn.addEventListener('click', function() {
    // Collect enabled states
    var enabledStates = {};
    document.querySelectorAll('[data-toggle-provider]').forEach(function(input) {
      enabledStates[input.getAttribute('data-toggle-provider')] = input.checked;
    });

    // Collect API keys
    var keys = {};
    document.querySelectorAll('[data-key-provider]').forEach(function(input) {
      var pid = input.getAttribute('data-key-provider');
      var val = input.value.trim();
      if (val) {
        var parts = val.split('\\n').map(function(k) { return k.trim(); }).filter(function(k) { return k.length > 0; });
        if(parts.length > 0) keys[pid] = parts;
      }
    });"""

code = code.replace("""  saveBtn.addEventListener('click', function() {
    var primary = providerSelect.value;

    // Collect API keys from all inputs
    var keys = {};
    document.querySelectorAll('[data-key-provider]').forEach(function(input) {
      var pid = input.getAttribute('data-key-provider');
      var val = input.value.trim();
      if (val) keys[pid] = val;
    });""", save_logic)

save_storage = """    chrome.storage.local.set({
      apiKeys: keys,
      enabledProviders: enabledStates,
      customProviders: customProviders,
      customModels: customModels
    }, function() {"""
code = code.replace("""    chrome.storage.local.set({
      apiKeys: keys,
      primaryProvider: primary,
      customProviders: customProviders,
      customModels: customModels
    }, function() {""", save_storage)

# Handle remove provider logic update
code = code.replace("""          // Update select
          var opt = providerSelect.querySelector('option[value="' + id + '"]');
          if (opt) opt.remove();""", "// Select removed")

# Add missing variables that were removed
code = code.replace("var providerSelect = document.getElementById('primary-provider');", "/* var providerSelect = document.getElementById('primary-provider'); */")


with open('popup.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("popup.js patched")
