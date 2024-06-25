import React, { useState } from "react"
import { Outlet } from "react-router"
import "./utils/normalize.css"
import "./App.scss"
import { appendThemeClass, useTheme } from "./utils/ThemeContext"
import LightToggle from "./components/LightToggle/LightToggle"
import BurgerMenu from "./components/BurgerMenu/BurgerMenu"
import MenuDrawer from "./components/MenuDrawer/MenuDrawer"
import { QueryClient, QueryClientProvider } from "react-query"
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary"

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const queryClient = new QueryClient()

  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const handleBurgerClicked = () => {
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  return (
    <div className={appendThemeClass("page-outer-shell", theme)}>
      <ErrorBoundary>
        <BurgerMenu handleBurgerClicked={handleBurgerClicked} />
        <MenuDrawer
          isOpen={isDrawerOpen}
          onRequestClose={handleDrawerClose}
          menuOptions={[
            { id: "home", displayText: "Home", linksTo: "/" },
            { id: "items", displayText: "Items", linksTo: "/items" },
            {
              id: "calculator",
              displayText: "Calculator",
              linksTo: "/calculator",
            },
            {
              id: "api",
              displayText: "API",
              linksTo: "https://api.deaths-coffer.com/swagger-ui/index.html",
              isExternal: true,
            },
            {
              id: "github",
              displayText: "GitHub",
              linksTo: "https://github.com/Rykee/Deaths-Coffer-Calculator",
              isExternal: true,
            },
          ]}
        />
        <LightToggle toggleFn={toggleTheme} />
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  )
}

export default App
