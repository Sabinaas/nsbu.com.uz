import { useState } from 'react'
import { t } from '../i18n/index.js'
import { standards, categories } from '../data/standards.js'

export default function StandardsView({ lang, onSelect }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = standards.filter(s => {
    const name = lang === 'uz' ? s.nameUz : s.nameRu
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search)
    const matchCat = category === 'all' || s.category === category
    return matchSearch && matchCat
  })

  return (
    <div>
      {/* Search + filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t(lang, 'searchPlaceholder')}
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-1 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === cat.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat.emoji} {t(lang, cat.key === 'all' ? 'allStandards' : cat.key)}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-400 mb-3">
        {t(lang, 'active')}: {filtered.length}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => onSelect(s)}
            className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                {t(lang, 'standard')} №{s.number}
              </span>
              {s.isNew && (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">
                  {t(lang, 'newEdition')}
                </span>
              )}
            </div>
            <div className="font-medium text-slate-800 text-sm leading-snug">
              {lang === 'uz' ? s.nameUz : s.nameRu}
            </div>
            {s.effectiveDate && (
              <div className="mt-1 text-xs text-slate-400">{t(lang, 'since2025')}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
