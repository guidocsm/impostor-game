import { Outlet, useLocation } from 'react-router-dom'
import './css/layout.css'
import { NinjaIcon } from '../public/icons/Icons'

export default function Layout() {
  const location = useLocation()

  return (
    <>
      <header>
        <div className="logo">Imp{<NinjaIcon />}stor</div>
        {location.pathname === '/' && <p>El juego de pistas donde uno de ustedes no sabe la palabra secreta</p>}
      </header>
      <Outlet />
    </>
  )
}