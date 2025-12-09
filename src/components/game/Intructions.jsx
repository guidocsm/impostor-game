import '../../css/components/game/intructions.css'

export function Intructions({ setIsOpen }) {
  return (
    <section>
      <span className="intructions-title">Instrucciones del juego</span>
      <ul className="instructions-list">
        <li className="instruction">- <span className="intruction-title">Preparación:</span> elige un tema (ej. objetos, ciudades) y una palabra secreta. Todos menos uno recibirán la palabra; ese jugador será el impostor.</li>
        <li className="instruction">- <span className="intruction-title">Pistas:</span> por turnos, cada jugador dice una palabra relacionada con la secreta, sin revelarla. El impostor debe fingir que sabe la palabra mientras trata de adivinarla.</li>
        <li className="instruction">- <span className="intruction-title">Debate y votación:</span> tras dar pistas, discutan quién creen que es el impostor y voten.</li>
        <li className="instruction">
          - <span className="intruction-title">Desenlace: </span>
          si la mayoría vota al impostor: gana el grupo.
          Si votan a un inocente: el impostor gana si adivina la palabra secreta.
        </li>
      </ul>
      <p className="intructions-advice">Consejos: no uses palabras demasiado obvias y presta atención a lo que dicen los demás para deducir o engañar. Ideal para grupos grandes y muchas risas.</p>
      <span
        onClick={() => setIsOpen(false)}
        className="close-intructions"
      >
        Cerrar
      </span>
    </section>
  )
}