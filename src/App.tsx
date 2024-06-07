import React, { useState } from 'react';
import { Outlet } from "react-router"
import { Provider } from "react-redux"
import "./utils/normalize.css"
import "./App.scss"
import { appendThemeClass, useTheme } from "./utils/ThemeContext"
import LightToggle from "./components/LightToggle/LightToggle"
import BurgerMenu from "./components/BurgerMenu/BurgerMenu"
import MenuDrawer from "./components/MenuDrawer/MenuDrawer"

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleBurgerClicked = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleMenuOptionSelected = (id: string) => {
    console.log(`Option ${id} selected`);
    setDrawerOpen(false);
  };

  return (
      <div className={appendThemeClass("page-outer-shell", theme)}>
        <BurgerMenu handleBurgerClicked={handleBurgerClicked} />
        <MenuDrawer
          isOpen={isDrawerOpen}
          onRequestClose={handleDrawerClose}
          menuOptions={[
            { id: "home", displayText: "Home", linksTo: "/"},
            { id: "items", displayText: "Items", linksTo: "/items"},
            { id: "calculator", displayText: "Calculator", linksTo: "/calculator" },
            { id: "api", displayText: "API", linksTo: "https://api.deaths-coffer.com/swagger-ui/index.html", isExternal: true},
            { id: "github", displayText: "GitHub", linksTo: "https://github.com/Rykee/Deaths-Coffer-Calculator", isExternal: true},
          ]}
        />
        <LightToggle toggleFn={toggleTheme} />
        <Outlet />
      </div>
  )
}

export default App;