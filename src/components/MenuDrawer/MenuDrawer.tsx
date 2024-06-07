import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { appendThemeClass, useTheme } from '../../utils/ThemeContext';
import { MenuOption } from '../../utils/types';
import { Link } from 'react-router-dom';

import './MenuDrawer.scss';

interface DrawerProps {
  isOpen: boolean;
  onRequestClose: () => void;
  menuOptions: MenuOption[];
}

const MenuDrawer: React.FC<DrawerProps> = ({
  isOpen,
  onRequestClose,
  menuOptions,
}) => {
  const { theme } = useTheme();

  const list = () => (
    <List>
      {menuOptions.map((option) => (
        <ListItem key={option.id}>
          {option.isExternal ? (
            <ExternalLinkButton
              link={option.linksTo}
              onRequestClose={onRequestClose}
              displayText={option.displayText}
            />
          ) : (
            <InternalNavigationButton
              link={option.linksTo}
              onRequestClose={onRequestClose}
              displayText={option.displayText}
            />
          )}
        </ListItem>
      ))}
    </List>
  );

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onRequestClose}
      className={appendThemeClass('menu-drawer', theme)}
    >
      {list()}
    </Drawer>
  );
};

const ExternalLinkButton: React.FC<{
  link: string;
  onRequestClose: () => void;
  displayText: string;
}> = ({ link, onRequestClose, displayText }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <ListItemButton onClick={onRequestClose}>
      <ListItemText primary={displayText} />
    </ListItemButton>
  </a>
);

const InternalNavigationButton: React.FC<{
  link: string;
  onRequestClose: () => void;
  displayText: string;
}> = ({ link, onRequestClose, displayText }) => (
  <Link to={link}>
    <ListItemButton onClick={onRequestClose}>
      <ListItemText primary={displayText} />
    </ListItemButton>
  </Link>
);

export default MenuDrawer;
