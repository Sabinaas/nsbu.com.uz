import { useState } from 'react'
import { t } from '../i18n/index.js'

export default function TrialBanner({ lang, trialEnd, onClose }) {
  const [visible, setVisible] = useState(true)
  if (!visible || !trialEnd) return null

  const days = Math.ceil((new Date(trialEnd) - new Date()) / 86400000)
  if (days <= 0) return null

  function close() {
    setVisible(false)
    if (onClose) onClose()
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="text-sm">
        🎉 {t(lang, 'trialActive')} — <b>{days} {t(lang, 'daysLeft')}</b>. {t(lang, 'trialText')}
      </div>
      <button onClick={close} className="text-white/70 hover:text-white text-lg leading-none flex-shrink-0">×</button>
    </div>
  )
}
