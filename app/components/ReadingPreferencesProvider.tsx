import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import {
  applyReadingPreferences,
  DEFAULT_READING_PREFERENCES,
  readReadingPreferences,
  restoreReadingPreferences,
  type ReadingPreferences,
} from '~/lib/reading-preferences'

type ReadingPreferencesContextValue = {
  preferences: ReadingPreferences
  setPreferences: (preferences: ReadingPreferences) => boolean
  resetPreferences: () => boolean
}

const ReadingPreferencesContext = createContext<ReadingPreferencesContextValue>({
  preferences: DEFAULT_READING_PREFERENCES,
  setPreferences: () => false,
  resetPreferences: () => false,
})

export function ReadingPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState(DEFAULT_READING_PREFERENCES)

  useLayoutEffect(() => {
    const saved = readReadingPreferences()
    restoreReadingPreferences(saved)
    setPreferencesState(saved)
  }, [])

  const setPreferences = useCallback((next: ReadingPreferences) => {
    const saved = applyReadingPreferences(next)
    setPreferencesState(next)
    return saved
  }, [])

  const resetPreferences = useCallback(() => setPreferences(DEFAULT_READING_PREFERENCES), [setPreferences])

  const value = useMemo(
    () => ({ preferences, setPreferences, resetPreferences }),
    [preferences, setPreferences, resetPreferences],
  )

  return <ReadingPreferencesContext.Provider value={value}>{children}</ReadingPreferencesContext.Provider>
}

export function useReadingPreferences() {
  return useContext(ReadingPreferencesContext)
}
