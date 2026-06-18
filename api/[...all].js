// api/[...all].js — Vercel Serverless Function прокси для API social-network.samuraijs.com
// ES module (type: "module" в package.json)
const API_BASE = 'https://social-network.samuraijs.com/api/1.1'
const API_KEY = '28d75e0b-b50c-4f2a-9805-5ee2b50ca199'

export default async function handler(req, res) {
  try {
    // Формируем URL целевого API: /api/auth/me → /auth/me
    const path = req.url.replace('/api', '')
    const targetUrl = `${API_BASE}${path}`

    // Заголовки для запроса к целевому API
    const headers = {
      'Content-Type': 'application/json',
      'API-KEY': API_KEY,
    }

    // Копируем Authorization заголовок, если есть (токен авторизации)
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization
    }

    // Читаем тело запроса
    let body
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body && typeof req.body === 'object') {
        body = JSON.stringify(req.body)
      } else if (req.body && typeof req.body === 'string') {
        body = req.body
      } else {
        body = await new Promise((resolve) => {
          let data = ''
          req.on('data', (chunk) => { data += chunk })
          req.on('end', () => resolve(data || undefined))
        })
      }
    }

    console.log(`[Proxy] ${req.method} ${targetUrl}`)

    const fetchOptions = { method: req.method, headers }
    if (body) fetchOptions.body = body

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