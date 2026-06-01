import { ru } from './ru.js'
import { uz } from './uz.js'

export const translations = { ru, uz }

export function t(lang, key) {
  return translations[lang]?.[key] ?? translations.ru[key] ?? key
}
