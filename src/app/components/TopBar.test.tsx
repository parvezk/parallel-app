import React from "react";
import TopBar from "./TopBar";
import { render, screen, fireEvent } from "@/utils/testUtils";
import { useQuery } from "urql";
import { useUserContext } from "@/app/context/UserContext";

/* jest.mock("urql", () => ({
  useQuery: jest.fn(),
})); */

jest.mock("urql", () => {
  const actualUrql = jest.requireActual("urql");
  return {
    ...actualUrql,
    useQuery: jest.fn(),
  };
});
/*
jest.mock("@/app/context/UserContext", () => ({
  useUserContext: jest.fn(),
})); */

jest.mock("@/app/context/UserContext", () => {
  const actualContext = jest.requireActual("@/app/context/UserContext");
  return {
    ...actualContext,
    useUserContext: jest.fn(),
  };
});

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("TopBar", () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserContext as jest.Mock).mockReturnValue({
      setUser: mockSetUser,
    });

    (useQuery as jest.Mock).mockReturnValue([
      {
        data: { user: { email: "test@example.com" } },
        fetching: false,
        error: null,
      },
      jest.fn(),
    ]);
  });

  test("renders without error", () => {
    render(<TopBar />);
    expect(screen.getByText("Parallel")).toBeInTheDocument();
    // screen.debug();
  });

  test("displays user email", () => {
    render(<TopBar />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  test("displays loading state", () => {
    (useQuery as jest.Mock).mockReturnValue([
      { data: null, fetching: true, error: null },
      jest.fn(),
    ]);
    render(<TopBar />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error state", () => {
    (useQuery as jest.Mock).mockReturnValue([
      { data: null, fetching: false, error: { message: "Error occurred" } },
      jest.fn(),
    ]);
    render(<TopBar />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  test("sets user on data change", () => {
    render(<TopBar />);
    expect(mockSetUser).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  test("handles logout", () => {
    // Mock localStorage
    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");
    
    render(<TopBar />);
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(removeItemSpy).toHaveBeenCalledWith("parallel_user_token");
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockPush).toHaveBeenCalledWith("/signin");

    removeItemSpy.mockRestore();
  });
});
