import re

f = open('components/dashboard/admin-user-dialogs.tsx')
content = f.read()
f.close()

for m in re.finditer('from "([^"]*)"', content):
    print(m.group(1))
