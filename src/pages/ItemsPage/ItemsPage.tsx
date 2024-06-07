import './ItemsPage.scss'
import { appendThemeClass, useTheme } from '../../utils/ThemeContext'
// import cn from 'classnames';

const ItemsPage: React.FC = () => {
  const { theme } = useTheme()
  const apiURL: string = import.meta.env.VITE_DEATHS_COFFER_API_URL

  return (
    <div className="items-page-outer-shell">
      <div className="inner-shell">Items</div>
    </div>
  )
}

export default ItemsPage
