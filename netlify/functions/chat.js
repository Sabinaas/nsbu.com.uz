const Anthropic = require('@anthropic-ai/sdk')

const SYSTEM_PROMPT = `Ты эксперт-практик по НСБУ Узбекистана с 15-летним стажем.
Отвечай на том языке, на котором задан вопрос (русский или узбекский).
Всегда указывай НСБУ №__, пункт/раздел.
Формат ответа:
1) Прямой ответ
2) Ссылка на стандарт
3) Пример

Если не уверен — рекомендуй lex.uz.
С 2025 года действуют обновлённые редакции (приказ МЭФ от 14.06.2024 №130).
Будь конкретным, точным и практичным.`

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { message, lang, context } = body
  if (!message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No message' }) }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let userContent = message
  if (context && context.length > 0) {
    const ctxText = context
      .map(s => `НСБУ №${s.number}: ${s.nameRu}`)
      .join('\n')
    userContent = `Контекст — возможно релевантные стандарты:\n${ctxText}\n\nВопрос: ${message}`
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const reply = response.content[0].text

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    }
  } catch (err) {
    console.error('Anthropic error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI service error' }),
    }
  }
}
