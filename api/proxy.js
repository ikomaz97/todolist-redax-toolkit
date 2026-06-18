// api/proxy.js — Vercel Serverless Function прокси для API social-network.samuraijs.com
// Все запросы с фронтенда идут на тот же домен (todolist-toolkit.vercel.app),
// а этот прокси перенаправляет их на целевой API, избегая CORS блокировок.

const API_BASE = 'https://social-network.samuraijs.com/api/1.1'
const API_KEY = '28d75e0b-b50c-4f2a-9805-5ee2b50ca199'

module.exports = async (req, res) => {
  // Формируем URL целевого API, отбрасывая префикс /api/proxy
  const targetUrl = req.url.replace('/api/proxy', API_BASE)

  // Формируем заголовки для запроса к целевому API
  const headers = {
    'Content-Type': 'application/json',
    'API-KEY': API_KEY,
  }

  // Копируем Authorization заголовок, если он есть (токен авторизации)
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization
  }

  try {
    // Парсим тело запроса, если оно есть
    let body
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    }

    // Выполняем запрос к целевому API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    })

    // Читаем ответ как текст (может быть JSON или HTML)
    const text = await response.text()

    // Пытаемся распарсить как JSON, иначе возвращаем как текст
    try {
      const data = JSON.parse(text)
      res.status(response.status).json(data)
    } catch {
      res.status(response.status).send(text)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Proxy request failed', details: error.message })
  }
}