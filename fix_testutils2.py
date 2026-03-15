import re

with open("src/utils/testUtils.tsx", "r") as f:
    content = f.read()

content = content.replace('    /* return (\n      <Provider value={client}>\n        <UserProvider>{children}</UserProvider>\n      </Provider>\n    ); */\n', "")

with open("src/utils/testUtils.tsx", "w") as f:
    f.write(content)
