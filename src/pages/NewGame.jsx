import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Title } from "../components/ui/Title";
import '../css/pages/newGame.css'
import { PlayersSelection } from "../components/configGame/PlayersSelection";
import { CategoryCard } from "../components/configGame/CategoryCard";
import { useConfigGame } from "../hooks/configGame/useConfigGame";
import { IMPOSTORS, PLAYERS } from "../utils/constants";

export default function NewGame() {
  const navigate = useNavigate()
  const {
    configGame,
    categories,
    addPlayer,
    removePlayer,
    setCategory,
    setNewRoom,
    onChangePlayerName,
    checkMinimumPlayers,
    checkMaximumPlayers,
  } = useConfigGame()

  const { players, impostors, category: currentCategory } = configGame

  return (
    <>
      <Title
        text="Configura tu partida"
      />
      <section className="new-game">
        <PlayersSelection
          label="Jugadores"
          players={players}
          sectionKey={PLAYERS}
          isMin={checkMinimumPlayers(PLAYERS)}
          isMax={checkMaximumPlayers(PLAYERS)}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
        />
        <PlayersSelection
          label="Impostores"
          players={impostors}
          sectionKey={IMPOSTORS}
          isMin={checkMinimumPlayers(IMPOSTORS)}
          isMax={checkMaximumPlayers(IMPOSTORS)}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
        />
        <div className="new-game-box">
          <span className="new-game-box-title">Categorías</span>
          <div className="new-game-box-categories">
            {categories?.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                currentCategory={currentCategory}
                setCategory={setCategory}
              />
            ))}
          </div>
        </div>
        <div className="new-game-box">
          <span className="new-game-box-title">Tu nombre</span>
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            onChange={({ target }) => onChangePlayerName(target.value)}
          />
        </div>
        <div className="new-game-create">
          <Button
            text="Crear partida"
            onClick={() => setNewRoom(configGame)}
            disabled={configGame.category === null}
          />
          <span className="back-link" onClick={() => navigate('/')}>Volver al inicio</span>
        </div>
      </section>
    </>
  )
}