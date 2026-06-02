import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import Header from './components/Header.jsx'
import StandardsView from './components/StandardsView.jsx'
import AIChat from './components/AIChat.jsx'
import Guide from './components/Guide.jsx'
import Profile from './components/Profile.jsx'
import StandardModal from './components/StandardModal.jsx'
import LimitModal from './components/LimitModal.jsx'
import AuthModal from './components/AuthModal.jsx'
import TrialBanner from './components/TrialBanner.jsx'
import { useGuestLimit } from './hooks/useGuestLimit.js'

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ru')
  const [tab, setTab] = useState('standards')
  const [selectedStandard, setSelectedStandard] = useState(null)
  const [user, setUser] = useState(null)
  const [authModal, setAuthModal] = useState(false)
  const [dbDate] = useState(() => {
    const saved = localStorage.getItem('dbDate')
    if (saved) return saved
    const today = new Date().toLocaleDateString('ru-RU')
    localStorage.setItem('dbDate', today)
    return today
  })

  const { trackView, trackQuestion, canView, canAsk, limitModal, closeLimitModal, MAX_VIEWS, MAX_QUESTIONS } = useGuestLimit()

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  function handleSelectStandard(s) {
    if (user) { setSelectedStandard(s); return }
    if (!trackView()) return
    setSelectedStandard(s)
  }

  function handleAuthSuccess(u) {
    setUser(u)
    setAuthModal(false)
    // Activate 10-day trial if new user
    const trialKey = `trial_shown_${u.id}`
    if (!localStorage.getItem(trialKey)) {
      localStorage.setItem(trialKey, '1')
    }
  }

  const trialEnd = user
    ? (() => {
        const key = `trial_end_${user.id}`
        if (!localStorage.getItem(key)) {
          const end = new Date(Date.now() + 10 * 86400000).toISOString()
          localStorage.setItem(key, end)
        }
        return localStorage.getItem(key)
      })()
    : null

  return (
    <div className="min-h-screen bg-slate-50">
      {user && trialEnd && (
        <TrialBanner lang={lang} trialEnd={trialEnd} />
      )}

      <Header
        lang={lang}
        setLang={setLang}
        tab={tab}
        setTab={setTab}
        dbDate={dbDate}
        user={user}
        onLogin={() => setAuthModal(true)}
        onProfile={() => setTab('profile')}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'standards' && (
          <StandardsView
            lang={lang}
            onSelect={handleSelectStandard}
            user={user}
            canView={user || canView}
            MAX_VIEWS={MAX_VIEWS}
          />
        )}
        {tab === 'ai' && (
          <AIChat
            lang={lang}
            user={user}
            canAsk={user || canAsk}
            trackQuestion={trackQuestion}
            onNeedAuth={() => setAuthModal(true)}
          />
        )}
        {tab === 'guide' && <Guide lang={lang} />}
        {tab === 'profile' && (
          <Profile
            lang={lang}
            user={user}
            onLogout={() => { setUser(null); setTab('standards') }}
          />
        )}
      </main>

      {selectedStandard && (
        <StandardModal
          standard={selectedStandard}
          lang={lang}
          onClose={() => setSelectedStandard(null)}
        />
      )}

      {limitModal && (
        <LimitModal
          type={limitModal}
          lang={lang}
          onClose={closeLimitModal}
          onLogin={() => { closeLimitModal(); setAuthModal(true) }}
        />
      )}

      {authModal && (
        <AuthModal
          lang={lang}
          onClose={() => setAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
