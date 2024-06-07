import './HomePage.scss';
import { appendThemeClass, useTheme } from '../../utils/ThemeContext';
// import cn from 'classnames';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="home-page-outer-shell">
      <div className="inner-shell">
        Home
      </div>
    </div>
  );
};

export default HomePage;
