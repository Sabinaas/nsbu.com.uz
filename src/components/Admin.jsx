import { useState, useEffect } from 'react'
import { t } from '../i18n/index.js'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function Admin({ lang, user }) {
  const [tab, setTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, trial: 0, subscribed: 0, blocked: 0 })

  // Проверка доступа
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <div className="text-slate-500">Доступ запрещён</div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (tab === 'users') loadUsers()
  }, [tab])

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await fetch('/.netlify/functions/admin-users')
      const data = await res.json()
      setUsers(data.users || [])
      setStats({
        total: data.users?.length || 0,
        trial: data.users?.filter(u => u.status === 'trial').length || 0,
        subscribed: data.users?.filter(u => u.status === 'subscribed').length || 0,
        blocked: data.users?.filter(u => u.is_blocked).length || 0,
      })
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function toggleBlock(userId, isBlocked) {
    await fetch('/.netlify/functions/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_block', userId, isBlocked: !isBlocked }),
    })
    loadUsers()
  }

  async function grantAccess(userId) {
    await fetch('/.netlify/functions/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'grant_subscription', userId }),
    })
    loadUsers()
  }

  const navItems = [
    { key: 'dashboard', icon: '📊', label: 'Дашборд' },
    { key: 'users', icon: '👥', label: 'Пользователи' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">🛡️ Админ-панель</h1>
        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">ADMIN</span>
      </div>

      {/* Nav */}
      <div className="flex gap-2 mb-6">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === item.key ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Всего пользователей', value: stats.total, color: 'blue', icon: '👥' },
              { label: 'На триале', value: stats.trial, color: 'green', icon: '🎉' },
              { label: 'С подпиской', value: stats.subscribed, color: 'purple', icon: '💎' },
              { label: 'Заблокированы', value: stats.blocked, color: 'red', icon: '🚫' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="text-2xl mb-1">{card.icon}</div>
                <div className="text-2xl font-bold text-slate-800">{card.value}</div>
                <div className="text-xs text-slate-500">{card.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-3">Информация о системе</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>Сайт</span><span className="font-medium">nsbu.com.uz</span></div>
              <div className="flex justify-between"><span>Email авторизация</span><span className="text-green-600 font-medium">✅ Активна</span></div>
              <div className="flex justify-between"><span>ИИ-консультант</span><span className="text-green-600 font-medium">✅ Активен</span></div>
              <div className="flex justify-between"><span>Стандартов в базе</span><span className="font-medium">22</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">Пользователи</h2>
            <button onClick={loadUsers} className="text-xs text-blue-600 hover:underline">↻ Обновить</button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">Загрузка...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Нет пользователей</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs">
                  <tr>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Статус</th>
                    <th className="text-left px-4 py-3">Регистрация</th>
                    <th className="text-right px-4 py-3">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.is_blocked ? 'bg-red-100 text-red-700' :
                          u.status === 'subscribed' ? 'bg-purple-100 text-purple-700' :
                          u.status === 'trial' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {u.is_blocked ? '🚫 Заблокирован' :
                           u.status === 'subscribed' ? '💎 Подписка' :
                           u.status === 'trial' ? '🎉 Триал' : '🔓 Бесплатный'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(u.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => grantAccess(u.id)}
                            className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                          >
                            + Подписка
                          </button>
                          <button
                            onClick={() => toggleBlock(u.id, u.is_blocked)}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              u.is_blocked
                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                            }`}
                          >
                            {u.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
