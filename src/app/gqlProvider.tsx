"use client";
import { PropsWithChildren, useMemo } from "react";
import { Provider, createClient, cacheExchange, fetchExchange } from "urql";
//local
import { getToken } from "@/utils/token";

export default function GQLProvider({ children }: PropsWithChildren) {
  const [urqlClient] = useMemo(() => {
    const urqlClient = createClient({
      url: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
      exchanges: [cacheExchange, fetchExchange],

      fetchOptions: () => {
        const token = getToken();
        return token
          ? {
              headers: { authorization: `Bearer ${token}` },
            }
          : {};
      },
    });

    return [urqlClient];
  }, []);
  return <Provider value={urqlClient}>{children}</Provider>;
}
