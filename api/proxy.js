// api/proxy.js — Vercel Serverless Function прокси для API social-network.samuraijs.com
// Все запросы с фронтенда идут на тот же домен (todolist-toolkit.vercel.app),
// а этот прокси перенаправляет их на целевой API, избегая CORS блокировок.
export default async function handler(req, res) {
  // Формируем URL целевого API, отбрасывая префикс /api/proxy
  const targetUrl = req.url.replace('/api/proxy', 'https://social-network.samuraijs.com/api/1.1')

  // Формируем заголовки для запроса к целевому API
  const headers = {
    'Content-Type': 'application/json',
    'API-KEY': '28d75e0b-b50c-4f2a-9805-5ee2b50ca199',
  }

  // Копируем Authorization заголовок, если он есть (токен авторизации)
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization
  }

  // Копируем Cookie, если они есть (для поддержки сессий)
  if (req.headers.cookie) {
    headers['Cookie'] = req.headers.cookie
  }

  try {
    // Выполняем запрос к целевому API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    })

    // Парсим ответ
    const data = await response.json()

    // Возвращаем ответ клиенту
    res.status(response.status).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Proxy request failed' })
  }
}