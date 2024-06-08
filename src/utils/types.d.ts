export type ThemeType = 'dark' | 'light'

export type MenuOption = {
  id: string
  displayText: string
  linksTo: string
  isExternal?: boolean
}

type Item = {
  id: number;
  name: string;
  grandExchangeGuidePrice: number;
  buyPrice: number;
  sellPrice: number;
  lastGrandExchangeUpdate: string;
  lastRuneLiteUpdate: string;
  tradeLimit: number;
  tradeVolume: number;
  iconPath: string;
};

type ItemsResponse = {
  items: Item[];
};
