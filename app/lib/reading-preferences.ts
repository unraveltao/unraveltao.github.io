export type ReadingFont = 'site' | 'sans' | 'serif'
export type ReadingSize = 'small' | 'standard' | 'large'
export type ReadingLineSpacing = 'compact' | 'comfortable' | 'relaxed'
export type ReadingWidth = 'narrow' | 'standard' | 'wide'

export type ReadingPreferences = {
  font: ReadingFont
  size: ReadingSize
  lineSpacing: ReadingLineSpacing
  width: ReadingWidth
}

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  font: 'site',
  size: 'standard',
  lineSpacing: 'comfortable',
  width: 'standard',
}

const STORAGE_KEY = 'reading-preferences'

const VALUES = {
  font: ['site', 'sans', 'serif'],
  size: ['small', 'standard', 'large'],
  lineSpacing: ['compact', 'comfortable', 'relaxed'],
  width: ['narrow', 'standard', 'wide'],
} as const

function isReadingPreferences(value: unknown): value is ReadingPreferences {
  if (!value || typeof value !== 'object') return false
  const preferences = value as Partial<ReadingPreferences>
  return (
    VALUES.font.includes(preferences.font as ReadingFont) &&
    VALUES.size.includes(preferences.size as ReadingSize) &&
    VALUES.lineSpacing.includes(preferences.lineSpacing as ReadingLineSpacing) &&
    VALUES.width.includes(preferences.width as ReadingWidth)
  )
}

function readStoredPreferences(): ReadingPreferences {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    return isReadingPreferences(stored) ? stored : DEFAULT_READING_PREFERENCES
  } catch {
    return DEFAULT_READING_PREFERENCES
  }
}

/** Synchronous pre-hydration initialization keeps saved reading styles from flashing. */
export const READING_PREFERENCES_INIT = `try {
  const key = 'reading-preferences'
  const defaults = { font: 'site', size: 'standard', lineSpacing: 'comfortable', width: 'standard' }
  const allowed = {
    font: ['site', 'sans', 'serif'],
    size: ['small', 'standard', 'large'],
    lineSpacing: ['compact', 'comfortable', 'relaxed'],
    width: ['narrow', 'standard', 'wide'],
  }
  let preferences = JSON.parse(localStorage.getItem(key) || 'null')
  if (
    !preferences ||
    !allowed.font.includes(preferences.font) ||
    !allowed.size.includes(preferences.size) ||
    !allowed.lineSpacing.includes(preferences.lineSpacing) ||
    !allowed.width.includes(preferences.width)
  ) {
    preferences = defaults
  }
  const root = document.documentElement
  root.dataset.readingFont = preferences.font
  root.dataset.readingSize = preferences.size
  root.dataset.readingLineSpacing = preferences.lineSpacing
  root.dataset.readingWidth = preferences.width
} catch {
  const root = document.documentElement
  root.dataset.readingFont = 'site'
  root.dataset.readingSize = 'standard'
  root.dataset.readingLineSpacing = 'comfortable'
  root.dataset.readingWidth = 'standard'
}`

export function resolveReadingPreferences(): ReadingPreferences {
  const root = document.documentElement.dataset
  const fromDocument = {
    font: root.readingFont,
    size: root.readingSize,
    lineSpacing: root.readingLineSpacing,
    width: root.readingWidth,
  }
  return isReadingPreferences(fromDocument) ? fromDocument : readStoredPreferences()
}

function applyToDocument(preferences: ReadingPreferences) {
  const root = document.documentElement
  root.dataset.readingFont = preferences.font
  root.dataset.readingSize = preferences.size
  root.dataset.readingLineSpacing = preferences.lineSpacing
  root.dataset.readingWidth = preferences.width
}

/** Apply immediately; a storage failure still keeps the preference for this visit. */
export function applyReadingPreferences(preferences: ReadingPreferences): boolean {
  applyToDocument(preferences)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    return true
  } catch {
    return false
  }
}

export function restoreReadingPreferences(preferences: ReadingPreferences) {
  applyToDocument(preferences)
}

export function readReadingPreferences() {
  return readStoredPreferences()
}
