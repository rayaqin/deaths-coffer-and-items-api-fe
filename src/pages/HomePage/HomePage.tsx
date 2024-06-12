import "./HomePage.scss"
import { appendThemeClass, useTheme } from "../../utils/ThemeContext"
import MenuItemCard from "../../components/MenuItemCard/MenuItemCard"
import { FaCalculator } from "react-icons/fa6"
import { GiWarPick } from "react-icons/gi"

const HomePage: React.FC = () => {
  const { theme } = useTheme()

  return (
    <div className="home-page-outer-shell">
      <div className="inner-shell">
        <h1 className={appendThemeClass("home-page-title", theme)}>
          Death's Coffer Tools
        </h1>
        <section className={appendThemeClass("home-menu-box", theme)}>
          <ul className="home-menu-list">
            <MenuItemCard
              title="Calculator"
              reactIconComponent={<FaCalculator size={36} />}
              description="Get items with specific Return on Investment (ROI) values."
              link="/calculator"
            />
            <MenuItemCard
              title="Items"
              reactIconComponent={<GiWarPick size={36} />}
              description="View the items list returned by the Death's Coffer API."
              link="/items"
            />
          </ul>
        </section>
      </div>
    </div>
  )
}

export default HomePage
