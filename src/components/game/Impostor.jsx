import { NinjaIcon } from "../../../public/icons/Icons";
import '../../css/components/game/impostor.css'

export function Impostor() {
  return (
    <section className="impostor-container">
      <div className="impostor-container-box">
        <div className="impostor-icon">
          <NinjaIcon fill="#DC2928" />
        </div>
        <span>Eres el impostor</span>
        <p>Engaña a los demás jugadores y no te dejes atrapar</p>
      </div>
    </section>
  )
}