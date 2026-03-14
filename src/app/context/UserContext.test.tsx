import React from "react";
import { render, screen } from "@testing-library/react";
import { UserProvider, useUserContext } from "./UserContext";
import "@testing-library/jest-dom";

const TestComponent = () => {
  const { theme } = useUserContext();
  return <div data-testid="theme-value">{theme}</div>;
};

describe("UserProvider", () => {
  test("defaults to light theme when no initialTheme is provided", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
  });

  test("uses provided initialTheme", () => {
    render(
      <UserProvider initialTheme="dark">
        <TestComponent />
      </UserProvider>
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
  });
});
