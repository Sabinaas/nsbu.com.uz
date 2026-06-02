import { t } from '../i18n/index.js'
import { supabase } from '../lib/supabase.js'

export default function Profile({ lang, user, onLogout }) {
  if (!user) return null

  const trialEnd = user.user_metadata?.trial_end
  const subEnd = user.user_metadata?.sub_end
  const now = new Date()

  const isActive = subEnd && new Date(subEnd) > now
  const isTrial = trialEnd && new Date(trialEnd) > now && !isActive
  const trialDays = trialEnd ? Math.ceil((new Date(trialEnd) - now) / 86400000) : 0

  async function logout() {
    await supabase.auth.signOut()
    onLogout()
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">{t(lang, 'profile')}</h1>

      {/* User info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">
            {user.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="font-semibold text-slate-800">{user.email}</div>
            <div className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}...</div>
          </div>
        </div>

        {/* Status */}
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
          isActive ? 'bg-green-50 text-green-700' :
          isTrial ? 'bg-blue-50 text-blue-700' :
          'bg-slate-50 text-slate-500'
        }`}>
          {isActive && `✅ ${t(lang, 'statusActive')} — ${t(lang, 'until')} ${new Date(subEnd).toLocaleDateString('ru-RU')}`}
          {isTrial && `🎉 ${t(lang, 'statusTrial')} — ${trialDays} ${t(lang, 'daysLeft')}`}
          {!isActive && !isTrial && `🔓 ${t(lang, 'statusFree')}`}
        </div>
      </div>

      {/* Subscribe */}
      {!isActive && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white">
          <div className="font-bold text-lg mb-1">{t(lang, 'subscribeTitle')}</div>
          <div className="text-blue-100 text-sm mb-4">{t(lang, 'subscribeText')}</div>
          <div className="text-2xl font-bold mb-4">45 000 {t(lang, 'sumMonth')}</div>
          <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
            {t(lang, 'subscribBtn')}
          </button>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 font-medium py-3 rounded-xl transition-colors text-sm"
      >
        {t(lang, 'logout')}
      </button>
    </div>
  )
}
