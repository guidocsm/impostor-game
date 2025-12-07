import { useNavigate, useNavigation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import '../css/pages/home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <section className="home-config">
      <Button
        text="Crear una sala"
        type="main"
        onClick={() => navigate('/crear-partida')}
      />
      <Button
        text="Unirme a una sala"
        type="main-hover"
        onClick={() => navigate('/unirse')}
      />
    </section>
  )
}