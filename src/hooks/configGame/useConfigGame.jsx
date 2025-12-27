import { useEffect, useState } from "react"
import { createRoom } from "../../services/createRoom"
import { useNavigate } from "react-router-dom"
import { createPlayer } from "../../services/createPlayer"
import { supabase } from "../../services/supabaseClient"

export function useConfigGame() {
  const [configGame, setConfigGame] = useState({
    crew: 3,
    impostors: 1,
    category: null,
    hostPlayerName: ''
  })

  const navigate = useNavigate()

  const [categories, setCategories] = useState([])

  useEffect(() => {
    (async () => {
      const { data: categoriesList, error } = await supabase
        .from('categories')
        .select('name, id');
      setCategories(categoriesList)
    })()
  }, [])

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

  const setCategory = (category = null) => {
    setConfigGame(prevConfig => ({
      ...prevConfig,
      category: category?.id === configGame.category?.id ? null : category,
    }))
  }

  const onChangePlayerName = (value) => {
    setConfigGame(prevConfig => ({
      ...prevConfig,
      hostPlayerName: value
    }))
  }

  const setNewRoom = async () => {
    const response = await createRoom(configGame)

    if (response.status === 201) {
      setNewPlayerInGame(response.data[0])
    } else {
      console.log('error', response)
    }
  }

  const setNewPlayerInGame = async (data) => {
    const payload = {
      name: configGame.hostPlayerName,
      hostPlayerId: data?.hostPlayerId,
      id: data?.id,
    }

    await createPlayer(payload)
    navigate(`/sala/${data?.id}`)
  }

  return {
    configGame,
    categories,
    addPlayer,
    removePlayer,
    setCategory,
    setNewRoom,
    onChangePlayerName,
  }
}