import { useState, useCallback } from 'react'

const VIEWS_KEY = 'guest_views'
const QUESTIONS_KEY = 'guest_questions'
const MAX_VIEWS = 3
const MAX_QUESTIONS = 3

export function useGuestLimit() {
  const [views, setViews] = useState(() => parseInt(localStorage.getItem(VIEWS_KEY) || '0'))
  const [questions, setQuestions] = useState(() => parseInt(localStorage.getItem(QUESTIONS_KEY) || '0'))
  const [limitModal, setLimitModal] = useState(null) // 'views' | 'questions' | null

  const canView = views < MAX_VIEWS
  const canAsk = questions < MAX_QUESTIONS

  const trackView = useCallback(() => {
    if (views >= MAX_VIEWS) {
      setLimitModal('views')
      return false
    }
    const next = views + 1
    localStorage.setItem(VIEWS_KEY, next)
    setViews(next)
    if (next >= MAX_VIEWS) setLimitModal('views')
    return true
  }, [views])

  const trackQuestion = useCallback(() => {
    if (questions >= MAX_QUESTIONS) {
      setLimitModal('questions')
      return false
    }
    const next = questions + 1
    localStorage.setItem(QUESTIONS_KEY, next)
    setQuestions(next)
    return true
  }, [questions])

  const closeLimitModal = useCallback(() => setLimitModal(null), [])

  return { views, questions, canView, canAsk, trackView, trackQuestion, limitModal, closeLimitModal, MAX_VIEWS, MAX_QUESTIONS }
}
