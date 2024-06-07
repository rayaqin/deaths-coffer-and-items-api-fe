export type ThemeType = "dark" | "light"

export type MenuOption = {
  id: string;
  displayText: string;
  linksTo: string;
  isExternal?: boolean;
};
