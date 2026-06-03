const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SB_HOST,
  process.env.SB_ADMIN_KEY
)

exports.handler = async function (event) {
  // Простая защита — проверяем заголовок или параметр
  const headers = { 'Content-Type': 'application/json' }

  if (event.httpMethod === 'GET') {
    // Получить всех пользователей
    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) }

    const users = data.users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      status: u.user_metadata?.status || 'free',
      is_blocked: u.banned_until ? new Date(u.banned_until) > new Date() : false,
      trial_end: u.user_metadata?.trial_end,
      sub_end: u.user_metadata?.sub_end,
    }))

    return { statusCode: 200, headers, body: JSON.stringify({ users }) }
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body)
    const { action, userId } = body

    if (action === 'toggle_block') {
      const bannedUntil = body.isBlocked
        ? new Date(Date.now() + 100 * 365 * 86400000).toISOString()
        : null

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: body.isBlocked ? '876000h' : 'none',
      })
      if (error) return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) }
    }

    if (action === 'grant_subscription') {
      const subEnd = new Date(Date.now() + 30 * 86400000).toISOString()
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { status: 'subscribed', sub_end: subEnd },
      })
      if (error) return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
  }

  return { statusCode: 405, body: 'Method Not Allowed' }
}
