import React from "react";
import { render, screen } from "@/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { useMutation } from "urql";
import Issue from "./Issue";

jest.mock("urql", () => ({
  ...jest.requireActual("urql"),
  useMutation: jest.fn(),
}));

let fetchMock: jest.Mock;

const issue = {
  id: "id",
  title: "issue title",
  content: "content",
  status: "BACKLOG",
};

describe("Issue", () => {
  beforeAll(() => {
    fetchMock = jest.fn();
    (global as any).fetch = fetchMock;
    (useMutation as jest.Mock).mockReturnValue([{}, jest.fn()]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without error", () => {
    render(<Issue issue={issue} />);
    expect(screen.getByText("issue title")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  test("changes issue status", async () => {
    render(<Issue issue={issue} />);
    const trigger = screen.getByRole("button", { name: /change status/i });
    expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);
    const option = await screen.findByRole("option", { name: "To do" });
    await userEvent.click(option);

    // Status chip and select both show "To do" after change
    expect(screen.getAllByText("To do").length).toBeGreaterThan(0);
  });

  test("deletes issue here", async () => {
    const mockDeleteIssue = jest.fn().mockResolvedValue({
      data: { deleteIssue: { id: issue.id } },
    });

    // Update the useMutation mock to return the mockDeleteIssue function
    (useMutation as jest.Mock).mockReturnValue([{}, mockDeleteIssue]);
    render(<Issue issue={issue} />);
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();

    await userEvent.click(deleteButton);
    expect(deleteButton).not.toBeDisabled();

    expect(mockDeleteIssue).toHaveBeenCalledTimes(1);
    expect(mockDeleteIssue).toHaveBeenCalledWith({ id: issue.id });
  });

});
