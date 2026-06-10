import sys
import re

# 1. Update popup.css
with open('popup.css', 'r', encoding='utf-8') as f:
    css = f.read()

# remove textarea block
css = re.sub(r'textarea\.input-field \{.*?\}', '', css, flags=re.DOTALL)

# add new css
new_css = """
/* ========== DYNAMIC KEYS ========== */
.keys-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}
.key-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0f1117;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid #2d3148;
}
.key-row input[type="text"], .key-row input[type="password"] {
  flex: 1;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-family: 'Inter', monospace;
  font-size: 13px;
  outline: none;
}
.key-row .radio-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}
.key-row .remove-key-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.15s;
  padding: 0 4px;
}
.key-row .remove-key-btn:hover {
  color: #ef4444;
}
.add-key-btn {
  background: transparent;
  border: 1px dashed #4f46e5;
  color: #a5b4fc;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 0;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
  margin-bottom: 12px;
}
.add-key-btn:hover {
  background: rgba(79, 70, 229, 0.1);
  border-color: #6366f1;
}

/* ========== SCROLLBAR ========== */
"""
css = css.replace('/* ========== SCROLLBAR ========== */', new_css)

with open('popup.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Update popup.js
with open('popup.js', 'r', encoding='utf-8') as f:
    js = f.read()

render_keys_old = """      var keyInput = document.createElement('textarea');
      keyInput.className = 'input-field';
      keyInput.setAttribute('data-key-provider', id);
      keyInput.placeholder = 'Chaves de API (uma por linha)\\nPara rotação automática';
      var keys = currentApiKeys[id] || [];
      if(!Array.isArray(keys) && typeof keys === 'string') keys = [keys];
      keyInput.value = keys.join('\\n');
      keyField.appendChild(keyInput);"""

render_keys_new = """      // Dynamic keys container
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
        input.placeholder = id === 'gemini' ? 'AIzaSy...' : 'sk-...';
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
      keyField.appendChild(addKeyBtn);"""

js = js.replace(render_keys_old, render_keys_new)

save_keys_old = """    // Collect API keys
    var keys = {};
    document.querySelectorAll('[data-key-provider]').forEach(function(input) {
      var pid = input.getAttribute('data-key-provider');
      var val = input.value.trim();
      if (val) {
        var parts = val.split('\\n').map(function(k) { return k.trim(); }).filter(function(k) { return k.length > 0; });
        if(parts.length > 0) keys[pid] = parts;
      }
    });"""

save_keys_new = """    // Collect API keys
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
    });"""

js = js.replace(save_keys_old, save_keys_new)

with open('popup.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("UI Patched successfully")
