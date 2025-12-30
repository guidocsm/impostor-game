import { Button } from "../components/ui/Button";
import { Title } from "../components/ui/Title";
import '../css/pages/newGame.css'
import { PlayersSelection } from "../components/configGame/PlayersSelection";
import { CategoryCard } from "../components/configGame/CategoryCard";
import { useConfigGame } from "../hooks/configGame/useConfigGame";
import { IMPOSTORS, PLAYERS } from "../utils/constants";
import { useRoomGame } from "../hooks/configGame/useRoomGame";
import { useEffect } from "react";
import { fetchPlayers } from "../services/fetch/fetchPlayers";

export default function EditGame() {
  const { room } = useRoomGame()

  const {
    configGame,
    categories,
    addPlayer,
    removePlayer,
    setCategory,
    setConfigGame,
    updateExistingRoom,
    onChangePlayerName,
    checkMinimumPlayers,
    checkMaximumPlayers,
  } = useConfigGame(room)

  const { players, impostors, category: currentCategory } = configGame

  useEffect(() => {
    if (room) {
      (async () => {
        const players = await fetchPlayers(room?.id)
        const hostPlayer = players?.find(player => player?.id === room?.hostPlayerId)

        setConfigGame(prevConfig => ({
          ...prevConfig,
          players: room?.players || 3,
          impostors: room?.impostors || 1,
          category: room?.category || null,
          hostPlayerName: hostPlayer?.name || ''
        }))
      })()
    }
  }, [room])


  return (
    <>
      <Title
        text="Modificar partida"
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
          <span>Tu nombre</span>
          <input
            type="text"
            onChange={({ target }) => onChangePlayerName(target.value)}
            value={configGame.hostPlayerName}
          />
        </div>
        <div className="new-game-create">
          <Button
            text="Modificar partida"
            onClick={() => updateExistingRoom(room?.id, room?.hostPlayerId)}
            disabled={configGame.category === null}
          />
        </div>
      </section>
    </>
  )
}