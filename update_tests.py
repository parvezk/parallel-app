import os

with open("src/utils/testUtils.tsx", "r") as f:
    content = f.read()

content = content.replace('const _client = createClient({\n  url: "http://localhost:3000/api/graphql",\n  exchanges: [cacheExchange, fetchExchange],\n});\n', "")
content = content.replace('import { createClient, cacheExchange, fetchExchange } from "urql";\n', "")

with open("src/utils/testUtils.tsx", "w") as f:
    f.write(content)
