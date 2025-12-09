import { ShieldIcon } from '../../../public/icons/Icons'
import '../../css/components/game/crew.css'

export function Crew({ playerSession = null }) {
  return (
    <section className="crew-container">
      <div className="crew-container-box">
        <div className="crew-icon">
          <ShieldIcon />
        </div>
        <span>Eres tripulante</span>
        <p>Encuentra al impostor entre los jugadores</p>
      </div>
      <div className="crew-container-secret-word">
        <span className="crew-container-secret-word-text">La palabra secreta es:</span>
        <span className="crew-container-secret-word-value">{playerSession?.word}</span>
      </div>
    </section>
  )
}