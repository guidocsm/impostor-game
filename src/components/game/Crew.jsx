import { ShieldIcon } from '../../../public/icons/Icons'
import '../../css/components/game/crew.css'
import { CATEGORIES } from '../../utils/constants'

export function Crew({ playerSession = null }) {
  return (
    <section className="crew-container">
      <span className="crew-container-category">{CATEGORIES[playerSession?.category]?.value || ''}</span>
      <span className="crew-container-secret-word">{playerSession?.word}</span>
      <p className="crew-container-description">Da pistas sobre esta palabra. ¡No seas obvio!</p>
    </section>
  )
}