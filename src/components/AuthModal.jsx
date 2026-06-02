import { useState } from 'react'
import { t } from '../i18n/index.js'
import { supabase } from '../lib/supabase.js'

export default function AuthModal({ lang, onClose, onSuccess }) {
  const [step, setStep] = useState('enter') // 'enter' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function sendOtp() {
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim() })
    setLoading(false)
    if (error) { setError(error.message); return }
    setStep('otp')
  }

  async function verifyOtp() {
    if (!otp.trim()) return
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    onSuccess(data.user)
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">{t(lang, 'authTitle')}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
        </div>

        {step === 'enter' ? (
          <>
            <p className="text-sm text-slate-500 mb-4">{t(lang, 'authEmailHint')}</p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendOtp()}
              placeholder="email@example.com"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
            />
            <button
              onClick={sendOtp}
              disabled={loading || !email.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? '...' : t(lang, 'sendCode')}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-1">{t(lang, 'otpSentTo')} <b>{email}</b></p>
            <p className="text-xs text-slate-400 mb-4">{t(lang, 'otpHint')}</p>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verifyOtp()}
              placeholder="123456"
              maxLength={8}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length < 8}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors mb-2"
            >
              {loading ? '...' : t(lang, 'confirm')}
            </button>
            <button onClick={() => setStep('enter')} className="w-full text-slate-400 text-sm py-1">
              ← {t(lang, 'back')}
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}

        <div className="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-700 text-center">
          {t(lang, 'trialAfterReg')}
        </div>
      </div>
    </div>
  )
}
