import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import { Theme, User, UserContextProps } from "./UserContextType";

type UserProviderType = {
  children: ReactNode;
  initialTheme?: Theme;
};
const UserContext = createContext<UserContextProps | undefined>(undefined);
export const UserProvider = ({
  children,
  initialTheme = "light",
}: UserProviderType) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [user, setUser] = useState<User | null>(null);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({ theme, toggleTheme, user, setUser }),
    [theme, user]
  );
  // Alternative: value={{ user, setUser, theme, toggleTheme }}>
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext must be used within a UserProvider");

  return context;
};
