import { t } from '../i18n/index.js'

export default function Header({ lang, setLang, tab, setTab, dbDate, user, onLogin, onProfile }) {
  const navItems = [
    { key: 'standards', icon: '📋', labelKey: 'standards' },
    { key: 'ai', icon: '🤖', labelKey: 'aiConsultant' },
    { key: 'guide', icon: '📖', labelKey: 'guide' },
  ]

  return (
    <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top row */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">Н</span>
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">{t(lang, 'appName')}</div>
              <div className="text-blue-200 text-xs">
                {t(lang, 'updated')}: {dbDate}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="flex bg-blue-800 rounded-lg p-0.5 text-sm">
              <button
                onClick={() => setLang('ru')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  lang === 'ru'
                    ? 'bg-white text-blue-700'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                РУ
              </button>
              <button
                onClick={() => setLang('uz')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  lang === 'uz'
                    ? 'bg-white text-blue-700'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                УЗ
              </button>
            </div>

            {/* Auth button */}
            {user ? (
              <button
                onClick={onProfile}
                className="bg-white text-blue-700 hover:bg-blue-50 font-medium text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {user.email?.[0]?.toUpperCase()}
                </span>
                {t(lang, 'profileNav')}
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="bg-white text-blue-700 hover:bg-blue-50 font-medium text-sm px-3 py-1.5 rounded-lg transition-colors"
              >
                {t(lang, 'login')}
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-1 pb-2">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === item.key
                  ? 'bg-white text-blue-700'
                  : 'text-blue-100 hover:bg-blue-600'
              }`}
            >
              <span>{item.icon}</span>
              <span>{t(lang, item.labelKey)}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
