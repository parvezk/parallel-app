import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";
process.env.NEXT_PUBLIC_GRAPHQL_API_URL = "http://localhost:3000/api/graphql";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  redirect: jest.fn(),
}));

// Mock lucide-react to avoid ESM load errors with --experimental-vm-modules
jest.mock("lucide-react", () => ({
  __esModule: true,
  Boxes: () => null,
  LayoutGrid: () => null,
  Settings: () => null,
  Menu: () => null,
  Trash2: () => null,
  Sun: () => null,
  Moon: () => null,
  LogOut: () => null,
}));

