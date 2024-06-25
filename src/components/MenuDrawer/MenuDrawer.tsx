import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { appendThemeClass, useTheme } from '../../utils/ThemeContext'
import { MenuOption, ThemeType } from '../../utils/types'
import { Link } from 'react-router-dom'
import './MenuDrawer.scss'

const ExternalLinkButton: React.FC<{
  link: string
  onRequestClose: () => void
  displayText: string
  theme?: ThemeType
}> = ({ link, onRequestClose, displayText, theme }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <ListItemButton className={appendThemeClass('menu-drawer-button', theme)} onClick={onRequestClose}>
      <ListItemText primary={displayText} />
    </ListItemButton>
  </a>
)

const InternalNavigationButton: React.FC<{
  link: string
  onRequestClose: () => void
  displayText: string
  theme?: ThemeType
}> = ({ link, onRequestClose, displayText, theme }) => (
  <Link to={link}>
    <ListItemButton className={appendThemeClass('menu-drawer-button', theme)} onClick={onRequestClose}>
      <ListItemText primary={displayText} />
    </ListItemButton>
  </Link>
)

interface DrawerProps {
  isOpen: boolean
  onRequestClose: () => void
  menuOptions: MenuOption[]
}

const MenuDrawer: React.FC<DrawerProps> = ({
  isOpen,
  onRequestClose,
  menuOptions,
}) => {
  const { theme } = useTheme()

  const list = () => (
    <List>
      {menuOptions.map((option) => (
        <ListItem key={option.id}>
          {option.isExternal ? (
            <ExternalLinkButton
              link={option.linksTo}
              onRequestClose={onRequestClose}
              displayText={option.displayText}
              theme={theme}
            />
          ) : (
            <InternalNavigationButton
              link={option.linksTo}
              onRequestClose={onRequestClose}
              displayText={option.displayText}
              theme={theme}
            />
          )}
        </ListItem>
      ))}
    </List>
  )

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onRequestClose}
      className={appendThemeClass('menu-drawer', theme)}
    >
      {list()}
    </Drawer>
  )
}

export default MenuDrawer
