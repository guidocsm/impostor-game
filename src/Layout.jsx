import { Outlet } from 'react-router-dom'
import './css/layout.css'
import { LogoIcon } from '../public/icons/Icons'

export default function Layout() {
  return (
    <>
      <header>
        <div className="logo">
          <LogoIcon />
        </div>
      </header>
      <Outlet />
    </>
  )
}