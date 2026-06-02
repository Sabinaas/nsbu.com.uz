import { t } from '../i18n/index.js'

export default function LimitModal({ type, lang, onClose, onLogin }) {
  if (!type) return null

  const isViews = type === 'views'

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6 text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">{isViews ? '📋' : '🤖'}</div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">
          {t(lang, isViews ? 'limitViewsTitle' : 'limitQuestionsTitle')}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {t(lang, isViews ? 'limitViewsText' : 'limitQuestionsText')}
        </p>

        <div className="space-y-3">
          <button
            onClick={onLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {t(lang, 'registerFree')}
          </button>
          <button
            onClick={onClose}
            className="w-full text-slate-400 hover:text-slate-600 text-sm py-2 transition-colors"
          >
            {t(lang, 'laterBtn')}
          </button>
        </div>

        <div className="mt-4 bg-green-50 rounded-xl p-3">
          <div className="text-xs text-green-700 font-medium">{t(lang, 'trialBenefit')}</div>
        </div>
      </div>
    </div>
  )
}
