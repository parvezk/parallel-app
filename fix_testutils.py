import re

with open("src/utils/testUtils.tsx", "r") as f:
    content = f.read()

content = re.sub(r'// import { Provider, createClient, cacheExchange, fetchExchange } from "urql";\n', "", content)
content = re.sub(r'// import { UserProvider } from "@/app/context/UserContext";\n', "", content)
content = re.sub(r'\s*/\* return \(\n\s*<Provider value=\{client\}>\n\s*<UserProvider>\{children\}</UserProvider>\n\s*</Provider>\n\s*\);\n\s*\*/\n', "\n", content)

with open("src/utils/testUtils.tsx", "w") as f:
    f.write(content)
