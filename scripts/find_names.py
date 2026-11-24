import re

f = open('components/profile/ProfileForm.tsx')
content = f.read()
f.close()

for m in re.finditer('name="([^"]*)"', content):
    print(m.group(1))
