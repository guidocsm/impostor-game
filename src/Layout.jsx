import { Outlet, useLocation } from 'react-router-dom'
import './css/layout.css'
import { LogoIcon, NinjaIcon } from '../public/icons/Icons'

export default function Layout() {
  const location = useLocation()

  return (
    <>
      <header>
        <div className="logo">
          <LogoIcon />
        </div>
        {location.pathname === '/' && <p>El juego de pistas donde uno de ustedes no sabe la palabra secreta</p>}
      </header>
      <Outlet />
    </>
  )
}