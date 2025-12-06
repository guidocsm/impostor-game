import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Title } from "../components/ui/Title";
import '../css/pages/newGame.css'
import { PlayersSelection } from "../components/configGame/PlayersSelection";
import { CategoryCard } from "../components/configGame/CategoryCard";
import { useConfigGame } from "../hooks/configGame/useConfigGame";

const categoriesMock = [
  {
    id: 0,
    name: 'Futbolistas',
    icon: '⚽️',
  },
  {
    id: 1,
    name: 'Comidas',
    icon: '🍕',
  }
]

export default function NewGame() {
  const { configGame, addPlayer, removePlayer, setCategory, createNewGame } = useConfigGame()
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
            {categoriesMock.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                currentCategory={currentCategory}
                setCategory={setCategory}
              />
            ))}
          </div>
        </div>
        <Button
          text="Crear partida"
          onClick={createNewGame}
          disabled={configGame.category === null}
        />
      </section>
    </>
  )
}