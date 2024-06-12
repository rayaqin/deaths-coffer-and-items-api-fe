import React from "react"
import { Link } from "react-router-dom"
import "./MenuItemCard.scss"

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
  return (
    <li className="menu-item-card-list-item-wrapper">
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
