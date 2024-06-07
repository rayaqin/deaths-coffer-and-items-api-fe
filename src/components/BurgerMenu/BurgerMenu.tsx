import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { useTheme, appendThemeClass } from '../../utils/ThemeContext';
import './BurgerMenu.scss';

interface BurgerMenuProps {
  handleBurgerClicked: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ handleBurgerClicked }) => {
  const { theme } = useTheme();
  const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === 'Space') {
      handleBurgerClicked();
    }
  };

  return (
    <button
      className={appendThemeClass('burger-menu', theme)}
      onClick={handleBurgerClicked}
      onKeyUp={handleKeyUp}
    >
      <FiMenu size={36} />
    </button>
  );
};

export default BurgerMenu;
