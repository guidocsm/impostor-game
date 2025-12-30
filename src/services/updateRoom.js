import { supabase } from "./supabaseClient"

export const updateRoom = async (roomId, payload) => {
  try {
    const response = await supabase
      .from('rooms')
      .update({
        players: payload.players,
        impostorsCount: payload.impostors,
        category: payload.category,
      })
      .eq('id', roomId)
      .select()

    return response
  } catch (error) {
    return { error }
  }
}

