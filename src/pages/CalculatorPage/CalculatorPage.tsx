import { appendThemeClass, useTheme } from '../../utils/ThemeContext'
import './CalculatorPage.scss'
// import cn from 'classnames';

const CalculatorPage: React.FC = () => {
  const { theme } = useTheme()
  const apiURL: string = import.meta.env.VITE_DEATHS_COFFER_API_URL

  return (
    <div className="calculator-page-outer-shell">
      <div className="inner-shell">Calculcator</div>
    </div>
  )
}

export default CalculatorPage
