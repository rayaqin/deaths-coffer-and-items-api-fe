import React from 'react'
import { FaCloudRain } from 'react-icons/fa6'
import './WrongRouteMsg.scss'

const WrongRouteMsg: React.FC = () => {
  return (
    <div className="page-404">
      <FaCloudRain />
      <div>The page you're looking for doesn't exist.</div>
      <div>Or at least not on this path.</div>
    </div>
  )
}

export default WrongRouteMsg
