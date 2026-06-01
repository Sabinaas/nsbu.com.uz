import { t } from '../i18n/index.js'

export default function StandardModal({ standard: s, lang, onClose }) {
  if (!s) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                {t(lang, 'standard')} №{s.number}
              </span>
              {s.isNew && (
                <span className="ml-2 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">
                  {t(lang, 'newEdition')}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl leading-none"
            >
              ×
            </button>
          </div>

          <h2 className="text-lg font-bold text-slate-800 mb-3">
            {lang === 'uz' ? s.nameUz : s.nameRu}
          </h2>

          {s.description && (
            <p className="text-sm text-slate-600 mb-4">
              {lang === 'uz' ? (s.descriptionUz || s.description) : s.description}
            </p>
          )}

          {s.effectiveDate && (
            <div className="text-xs text-slate-400 mb-4">
              {t(lang, 'since2025')} ({s.effectiveDate})
            </div>
          )}

          <a
            href={s.lexUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            {t(lang, 'viewStandard')} → lex.uz
          </a>
        </div>
      </div>
    </div>
  )
}
