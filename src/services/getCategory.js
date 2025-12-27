import { supabase } from "./supabaseClient";

export async function getCategory({ categoryId }) {
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('options')
    .eq('id',  categoryId)
    .single()

  if (categoryError) {
    console.error('Error fetching category:', categoryError)
    return;
  }

  return category
}