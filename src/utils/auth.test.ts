import { signup } from "./auth";

// Mock the dependencies
jest.mock("@/db/db", () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ id: "1", email: "test@example.com", createdAt: new Date().toISOString() }]),
    query: {
      users: {
        findFirst: jest.fn()
      }
    }
  }
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedpassword"),
  compare: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockedtoken"),
  verify: jest.fn()
}));

describe("signup", () => {
  it("should throw an error if password is less than 8 characters", async () => {
    await expect(signup({ email: "test@example.com", password: "short" })).rejects.toThrow(
      "Password must be at least 8 characters long"
    );
  });

  it("should succeed if password is 8 characters or more", async () => {
    const result = await signup({ email: "test@example.com", password: "validpassword" });
    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("token");
  });
});
