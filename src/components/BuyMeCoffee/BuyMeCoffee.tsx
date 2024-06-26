import React, { useState, useEffect } from 'react';
import { SiBuymeacoffee } from "react-icons/si";
import './BuyMeCoffee.scss';
import { appendThemeClass, useTheme } from '../../utils/ThemeContext';

const BuyMeCoffee: React.FC = () => {
  const [isWiggling, setIsWiggling] = useState(false);
  const { theme } = useTheme()
 

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWiggling(prev => !prev);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    window.open('https://buymeacoffee.com/rhykee', '_blank');
  };


  return (
    <button onClick={handleClick} className={appendThemeClass("coffee-button", theme)}>
      <SiBuymeacoffee size="2rem" className={`cup ${isWiggling ? 'wiggle' : ''}`} />
      <span>buy me coffee</span>
    </button>
  );
};

export default BuyMeCoffee;