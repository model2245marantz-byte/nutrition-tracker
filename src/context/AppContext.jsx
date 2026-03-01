import { createContext, useContext, useReducer, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { todayStr, generateId, DEFAULT_TARGETS } from '../lib/utils'

const AppContext = createContext(null)

const initialState = {
  session: null,
  user: null,
  profile: null,
  meals: [],
  currentView: 'dashboard',
  toast: null,
  loading: true,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload, user: action.payload?.user || null }
    case 'SET_PROFILE':
      return { ...state, profile: action.payload }
    case 'SET_MEALS':
      return { ...state, meals: action.payload }
    case 'ADD_MEAL':
      return { ...state, meals: [action.payload, ...state.meals] }
    case 'REMOVE_MEAL':
      return { ...state, meals: state.meals.filter(m => m.id !== action.payload) }
    case 'SET_VIEW':
      return { ...state, currentView: action.payload }
    case 'SET_TOAST':
      return { ...state, toast: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'RESET':
      return { ...initialState, loading: false }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Listen for auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'SET_SESSION', payload: session })
      if (session) {
        loadUserData(session.user.id)
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: 'SET_SESSION', payload: session })
      if (session) {
        loadUserData(session.user.id)
      } else {
        dispatch({ type: 'RESET' })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(userId) {
    dispatch({ type: 'SET_LOADING', payload: true })
    await Promise.all([loadProfile(userId), loadMeals(userId)])
    dispatch({ type: 'SET_LOADING', payload: false })
  }

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist yet — create with defaults
      const newProfile = { id: userId, ...DEFAULT_TARGETS }
      const { data: created } = await supabase
        .from('user_profiles')
        .insert(newProfile)
        .select()
        .single()
      dispatch({ type: 'SET_PROFILE', payload: created || newProfile })
    } else if (data) {
      dispatch({ type: 'SET_PROFILE', payload: data })
    }
  }

  async function loadMeals(userId) {
    const { data } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .eq('date', todayStr())
      .order('created_at', { ascending: false })

    dispatch({ type: 'SET_MEALS', payload: data || [] })
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
    dispatch({ type: 'RESET' })
  }

  async function updateProfile(updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', state.user.id)
      .select()
      .single()

    if (error) throw error
    dispatch({ type: 'SET_PROFILE', payload: data })
  }

  async function addMeal(meal) {
    const row = {
      id: generateId(),
      user_id: state.user.id,
      type: meal.type,
      description: meal.description,
      items: meal.items,
      totals: meal.totals,
      date: todayStr(),
      timestamp: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('meals')
      .insert(row)
      .select()
      .single()

    if (error) throw error
    dispatch({ type: 'ADD_MEAL', payload: data })
  }

  async function deleteMeal(id) {
    const { error } = await supabase.from('meals').delete().eq('id', id)
    if (error) throw error
    dispatch({ type: 'REMOVE_MEAL', payload: id })
  }

  function showToast(message, type = 'success') {
    dispatch({ type: 'SET_TOAST', payload: { message, type } })
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3000)
  }

  function setView(view) {
    dispatch({ type: 'SET_VIEW', payload: view })
  }

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    addMeal,
    deleteMeal,
    showToast,
    setView,
    refreshMeals: () => loadMeals(state.user?.id),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
