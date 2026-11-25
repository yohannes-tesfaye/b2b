f = open('components/shared/ProductCard.tsx', encoding='utf-8')
content = f.read()
f.close()
lines = content.split(chr(10))
for i in range(min(80, len(lines))):
    print(i+1, lines[i].rstrip()[:140])
