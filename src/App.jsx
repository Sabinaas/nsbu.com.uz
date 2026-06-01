import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import StandardsView from './components/StandardsView.jsx'
import AIChat from './components/AIChat.jsx'
import Guide from './components/Guide.jsx'
import StandardModal from './components/StandardModal.jsx'

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ru')
  const [tab, setTab] = useState('standards')
  const [selectedStandard, setSelectedStandard] = useState(null)
  const [dbDate] = useState(() => {
    const saved = localStorage.getItem('dbDate')
    if (saved) return saved
    const today = new Date().toLocaleDateString('ru-RU')
    localStorage.setItem('dbDate', today)
    return today
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        lang={lang}
        setLang={setLang}
        tab={tab}
        setTab={setTab}
        dbDate={dbDate}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'standards' && (
          <StandardsView
            lang={lang}
            onSelect={setSelectedStandard}
          />
        )}
        {tab === 'ai' && (
          <AIChat lang={lang} />
        )}
        {tab === 'guide' && (
          <Guide lang={lang} />
        )}
      </main>

      {selectedStandard && (
        <StandardModal
          standard={selectedStandard}
          lang={lang}
          onClose={() => setSelectedStandard(null)}
        />
      )}
    </div>
  )
}
