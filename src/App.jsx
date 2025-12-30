import './App.css'
import Layout from './Layout'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import NewGame from './pages/NewGame'
import Room from './pages/Room'
import JoinRoom from './pages/JoinRoom'
import Game from './pages/Game'
import EditGame from './pages/EditGame'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/crear-partida' element={<NewGame />} />
          <Route path='/modificar-partida/:roomId' element={<EditGame />} />
          <Route path='/sala/:roomId' element={<Room />} />
          <Route path='/partida/:roomId' element={<Game />} />
          <Route path='/unirse' element={<JoinRoom />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
