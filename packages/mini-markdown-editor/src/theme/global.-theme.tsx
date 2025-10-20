import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import React from "react";
import type { FC } from "react";

type ThemeMode = "light" | "dark";

const GlobalTheme: FC<{
  children: React.ReactNode;
  theme?: ThemeMode;
}> = ({ children, theme = "light" }) => {
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      {children}
    </ThemeProvider>
  );
};

export default GlobalTheme;
