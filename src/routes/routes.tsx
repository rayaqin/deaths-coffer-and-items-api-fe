import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/HomePage/HomePage'
import WrongRouteMsg from '../components/WrongRouteMsg/WrongRouteMsg'
import ItemsPage from '../pages/ItemsPage/ItemsPage'
import CalculatorPage from '../pages/CalculatorPage/CalculatorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/items', element: <ItemsPage /> },
      { path: '/calculator', element: <CalculatorPage /> },
      { path: '*', element: <WrongRouteMsg /> },
    ],
  },
])
