import os

ext_dir = r"c:\Users\raphael.suarez_anota\Desktop\Documentos\OmniTags\extension"

# 1. Replace OmniTags with OmniTag
for root, dirs, files in os.walk(ext_dir):
    for file in files:
        if file.endswith(('.js', '.html', '.css', '.json')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'OmniTags' in content:
                new_content = content.replace('OmniTags', 'OmniTag')
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Replaced in {file}")

# 2. Add footer to popup.html
popup_html_path = os.path.join(ext_dir, 'popup.html')
with open(popup_html_path, 'r', encoding='utf-8') as f:
    html = f.read()

footer_html = """  <footer class="app-footer-credits">
    Desenvolvido por <a href="https://www.raphaelsuarez.com.br" target="_blank" class="neon-link">&lt;Raphael Suarez/&gt;</a> - Assistente de Experiencia Junior
  </footer>
</body>"""

if 'class="app-footer-credits"' not in html:
    html = html.replace('</body>', footer_html)
    with open(popup_html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("Footer added to popup.html")

# 3. Add CSS for footer in popup.css
popup_css_path = os.path.join(ext_dir, 'popup.css')
with open(popup_css_path, 'r', encoding='utf-8') as f:
    css = f.read()

footer_css = """
/* ========== CREDITS FOOTER ========== */
.app-footer-credits {
  text-align: center;
  padding: 12px 20px;
  font-size: 10px;
  color: var(--text-muted);
  border-top: 1px solid var(--border-light);
  margin-top: auto;
  background: var(--bg-color);
}
.app-footer-credits a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 600;
}
.app-footer-credits a:hover {
  color: #fff;
}
"""

if '.app-footer-credits' not in css:
    css += footer_css
    with open(popup_css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("Footer CSS added to popup.css")
