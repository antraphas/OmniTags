import sys
with open('content.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines[800:]):
    print(f"{i+801}: {line.strip()}")
