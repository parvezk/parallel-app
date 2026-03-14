import * as React from "react";
import { render as rtlRender } from "@testing-library/react";
// import { Provider, createClient, cacheExchange, fetchExchange } from "urql";
import { createClient, cacheExchange, fetchExchange } from "urql";
import userEvent from "@testing-library/user-event";
// import { UserProvider } from "@/app/context/UserContext";
import Providers from "@/app/providers";

const _client = createClient({
  url: "http://localhost:3000/api/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

function render(ui: React.ReactElement, { ...renderOptions } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    /* return (
      <Provider value={client}>
        <UserProvider>{children}</UserProvider>
      </Provider>
    ); */
    return <Providers>{children}</Providers>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render, userEvent };
