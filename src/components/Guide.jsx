import { t } from '../i18n/index.js'

export default function Guide({ lang }) {
  const steps = t(lang, 'howToUseSteps')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t(lang, 'guideTitle')}</h1>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-2">{t(lang, 'aboutService')}</h2>
        <p className="text-sm text-slate-600">{t(lang, 'aboutText')}</p>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-3">{t(lang, 'howToUse')}</h2>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-600">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-3">{t(lang, 'tariffs')}</h2>
        <div className="space-y-2">
          {[
            { label: t(lang, 'tariffFree'), color: 'text-slate-600', bg: 'bg-slate-100' },
            { label: t(lang, 'tariffTrial'), color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: t(lang, 'tariffSub'), color: 'text-green-700', bg: 'bg-green-50' },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} ${item.color} text-sm font-medium px-4 py-2.5 rounded-lg`}>
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-2">{t(lang, 'dbUpdate')}</h2>
        <p className="text-sm text-slate-600">{t(lang, 'dbUpdateText')}</p>
      </section>

      <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h2 className="font-semibold text-amber-800 mb-2">⚠️ {t(lang, 'important')}</h2>
        <p className="text-sm text-amber-700">{t(lang, 'importantText')}</p>
      </section>
    </div>
  )
}
