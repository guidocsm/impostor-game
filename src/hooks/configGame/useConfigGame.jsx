import { useState } from "react"

export function useConfigGame() {
  const [configGame, setConfigGame] = useState({
    crew: 3,
    impostors: 1,
    category: null
  })

  const addPlayer = (key) => {
    setConfigGame(prevConfig => ({
      ...prevConfig,
      [key]: prevConfig[key] + 1
    }))
  }

  const removePlayer = (key) => {
    if (checkMinimumPlayers(key)) return

    setConfigGame(prevConfig => ({
      ...prevConfig,
      [key]: prevConfig[key] - 1
    }))
  }

  const checkMinimumPlayers = (key) => {
    return (
      key === 'crew' && configGame.crew === 3 ||
      key === 'impostors' && configGame.impostors === 1
    )
  }

  const setCategory = (category = '') => {
    setConfigGame(prevConfig => ({
      ...prevConfig,
      category: category === configGame.category ? null : category,
    }))
  }

  const createNewGame = () => {
    console.log('configuración de partida', configGame)
  }

  return {
    configGame,
    addPlayer,
    removePlayer,
    setCategory,
    createNewGame,
  }
}