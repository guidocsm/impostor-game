import './App.css'
import Layout from './Layout'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import NewGame from './pages/NewGame'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/crear-partida' element={<NewGame />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
