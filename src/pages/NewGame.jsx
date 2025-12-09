import { Button } from "../components/ui/Button";
import { Title } from "../components/ui/Title";
import '../css/pages/newGame.css'
import { PlayersSelection } from "../components/configGame/PlayersSelection";
import { CategoryCard } from "../components/configGame/CategoryCard";
import { useConfigGame } from "../hooks/configGame/useConfigGame";

export default function NewGame() {
  const {
    configGame,
    categories,
    addPlayer,
    removePlayer,
    setCategory,
    setNewRoom,
    onChangePlayerName
  } = useConfigGame()

  const { crew, impostors, category: currentCategory } = configGame

  return (
    <>
      <Title
        text="Crear partida"
      />
      <section className="new-game">
        <PlayersSelection
          label="Tripulantes"
          players={crew}
          className={crew === 3 ? 'disabled' : ''}
          sectionKey="crew"
          addPlayer={addPlayer}
          removePlayer={removePlayer}
        />
        <PlayersSelection
          label="Impostores"
          players={impostors}
          className={impostors === 1 ? 'disabled' : ''}
          sectionKey="impostors"
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
          <span>Tu nombre</span>
          <input
            type="text"
            onChange={({ target }) => onChangePlayerName(target.value)}
          />
        </div>
        <Button
          text="Crear partida"
          onClick={() => setNewRoom(configGame)}
          disabled={configGame.category === null}
        />
      </section>
    </>
  )
}