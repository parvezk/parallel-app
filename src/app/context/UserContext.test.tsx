import React from "react";
import { render, screen } from "@testing-library/react";
import { UserProvider, useUserContext } from "./UserContext";

const TestComponent = () => {
  const { theme } = useUserContext();
  return <div data-testid="theme-value">{theme}</div>;
};

describe("UserProvider", () => {
  test("defaults theme to light when no initialTheme is provided", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId("theme-value").textContent).toBe("light");
  });

  test("uses initialTheme when provided", () => {
    render(
      <UserProvider initialTheme="dark">
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId("theme-value").textContent).toBe("dark");
  });

  test("uses light initialTheme when provided", () => {
    render(
      <UserProvider initialTheme="light">
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId("theme-value").textContent).toBe("light");
  });
});
