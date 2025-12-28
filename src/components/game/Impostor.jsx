import { NinjaIcon } from "../../../public/icons/Icons";
import '../../css/components/game/impostor.css'

export function Impostor() {
  return (
    <section className="impostor-container-box">
      <div className="impostor-icon">
        <NinjaIcon width={80} height={80} fill="#DC2928" />
      </div>
      <span className="impostor-text">Eres el</span>
      <span className="impostor-title">¡Impostor!</span>
      <p className="impostor-description">Encuentra la palabra secreta. ¡No te reveles!</p>
    </section>
  )
}