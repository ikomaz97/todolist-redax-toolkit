// api/[...all].js — Vercel Serverless Function catch-all прокси для API social-network.samuraijs.com
// Все запросы с фронтенда на /api/* идут сюда, избегая CORS блокировок

const API_BASE = 'https://social-network.samuraijs.com/api/1.1'
const API_KEY = '28d75e0b-b50c-4f2a-9805-5ee2b50ca199'

module.exports = async (req, res) => {
  try {
    // Формируем URL целевого API: /api/auth/me → /auth/me
    const path = req.url.replace('/api', '')
    const targetUrl = `${API_BASE}${path}`

    // Формируем заголовки для запроса к целевому API
    const headers = {
      'Content-Type': 'application/json',
      'API-KEY': API_KEY,
    }

    // Копируем Authorization заголовок, если он есть (токен авторизации)
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization
    }

    // Читаем тело запроса, если есть
        // Vercel может отдать уже распарсенное тело через req.body или строку
        let body
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          if (req.body && typeof req.body === 'object') {
            body = JSON.stringify(req.body)
          } else if (req.body && typeof req.body === 'string') {
            body = req.body
          } else {
            // Если тело не распарсено, читаем через stream
            body = await new Promise((resolve) => {
              let data = ''
              req.on('data', (chunk) => { data += chunk })
              req.on('end', () => resolve(data || undefined))
            })
          }
        }

        // Логируем для диагностики
        console.log(`[Proxy] ${req.method} ${targetUrl} body:`, body ? body.substring(0, 100) : 'none')

        const fetchOptions = {
          method: req.method,
          headers,
        }
        if (body) {
          fetchOptions.body = body
        }

        const response = await fetch(targetUrl, fetchOptions)

    const text = await response.text()
    try {
      const data = JSON.parse(text)
      res.status(response.status).json(data)
    } catch {
      res.status(response.status).send(text)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Proxy failed', details: error.message })
  }
}