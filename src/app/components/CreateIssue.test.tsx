import React from "react";
import { render, screen } from "@/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { useMutation } from "urql";
import CreateIssue from "./CreateIssue";

jest.mock("urql", () => ({
  ...jest.requireActual("urql"),
  useMutation: jest.fn(),
}));

let fetchMock: jest.Mock;
const user = userEvent.setup();

const issue = {
  id: "id",
  title: "issue title",
  content: "content",
  status: "BACKLOG",
};

describe("Create Issue", () => {
  beforeAll(() => {
    fetchMock = jest.fn();
    (global as any).fetch = fetchMock;
    (useMutation as jest.Mock).mockReturnValue([{}, jest.fn()]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without error", () => {
    render(<CreateIssue isOpen={jest.fn()} onOpenChange={jest.fn()} />);
  });

  test("renders title", () => {
    render(<CreateIssue isOpen={jest.fn()} onOpenChange={jest.fn()} />);
    expect(screen.getByText("New Issue")).toBeInTheDocument();
  });

  test("onChange event is called to update the title on user input", async () => {
    render(<CreateIssue isOpen={jest.fn()} onOpenChange={jest.fn()} />);
    const input = screen.getByPlaceholderText("Issue title");
    await user.type(input, "title");
    expect(input).toHaveValue("title");
  });

  test("update the description on user input", async () => {
    render(<CreateIssue isOpen={jest.fn()} onOpenChange={jest.fn()} />);
    const textarea = screen.getByPlaceholderText("Issue description (optional)");
    await user.type(textarea, "description");
    expect(textarea).toHaveValue("description");
  });

  test("create new issue", async () => {
    const mockCreateIssue = jest.fn().mockResolvedValue({
      data: {
        createIssue: issue,
      },
    });
    (useMutation as jest.Mock).mockReturnValue([{}, mockCreateIssue]);

    render(<CreateIssue isOpen={jest.fn()} onOpenChange={jest.fn()} />);

    const input = screen.getByPlaceholderText("Issue title");
    await user.type(input, "title");
    const textarea = screen.getByPlaceholderText("Issue description (optional)");
    await user.type(textarea, "description");

    const createBtn = screen.getByRole("button", { name: /create/i });
    expect(createBtn).toBeInTheDocument();
    await user.click(createBtn);
  });
});
