import re

with open("src/app/components/Issue.tsx", "r") as f:
    content = f.read()

content = content.replace('selectedKeys={[issueStatus]}', 'selectedKeys={[issueStatus.toString()]}')
content = content.replace('key={opt.value}', 'key={opt.value.toString()}')

with open("src/app/components/Issue.tsx", "w") as f:
    f.write(content)
