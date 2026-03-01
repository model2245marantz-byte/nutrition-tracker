import { supabase } from './supabase'

export async function parseMeal(description) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const response = await supabase.functions.invoke('parse-meal', {
    body: { description },
  })

  if (response.error) {
    throw new Error(response.error.message || 'Failed to analyze meal')
  }

  const data = response.data
  if (!data || !data.items || !data.totals) {
    throw new Error('Invalid response from meal analysis')
  }

  return data
}
