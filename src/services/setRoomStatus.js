import { supabase } from "./supabaseClient";

export async function setRoomStatus(status) {
  const roomId = window.location.pathname.split('/').at(-1)

  const { data, error: updateError } = await supabase
    .from('rooms')
    .update({ status })
    .eq('id', roomId)
    .select();

  if (updateError) {
    console.error('Error updating room status:', updateError)
    return;
  }
}