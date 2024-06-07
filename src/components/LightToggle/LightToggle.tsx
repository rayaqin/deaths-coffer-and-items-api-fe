import React from 'react'
import './LightToggle.scss'
import { useTheme } from '../../utils/ThemeContext'

interface LightToggleProps {
  toggleFn: () => void
}

const LightToggle: React.FC<LightToggleProps> = ({ toggleFn }) => {
  const { theme } = useTheme()

  return (
    <div className="light-toggle-outer-shell">
      <div className="toggleWrapper">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleFn}
          className="dn"
          id="dn"
        />
        <label htmlFor="dn" className="toggle">
          <span className="toggle__handler">
            <span className="crater crater--1"></span>
            <span className="crater crater--2"></span>
            <span className="crater crater--3"></span>
          </span>
          <span className="star star--1"></span>
          <span className="star star--2"></span>
          <span className="star star--3"></span>
          <span className="star star--4"></span>
          <span className="star star--5"></span>
          <span className="star star--6"></span>
        </label>
      </div>
    </div>
  )
}

export default LightToggle
