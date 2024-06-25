import React from "react"
import { Link } from "react-router-dom"
import "./MenuItemCard.scss"
import { appendThemeClass, useTheme } from "../../utils/ThemeContext"

interface MenuItemCardProps {
  title: string
  reactIconComponent: React.ReactNode
  description: string
  link: string
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  title,
  reactIconComponent,
  description,
  link,
}) => {
  const { theme } = useTheme()

  return (
    <li className={appendThemeClass("menu-item-card-wrapper", theme)}>
      <Link to={link}>
        <div className="menu-item-card">
          {reactIconComponent}
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </Link>
    </li>
  )
}

export default MenuItemCard
