import os

for root, dirs, files in os.walk('components'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            path = os.path.join(root, f)
            try:
                content = open(path, encoding='utf-8').read()
                if 'deleteUser' in content:
                    print(path)
            except:
                pass
