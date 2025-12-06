import { Outlet } from 'react-router-dom'
import './css/layout.css'

export default function Layout() {
  return (
    <>
      <div className="logo">Impostor</div>
      <Outlet />
    </>
  )
}