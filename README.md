# Todolist — IT-INCUBATOR

**SPA-приложение для управления задачами** с авторизацией, drag-and-drop, пагинацией и переключением темы.  
Разработано в рамках обучения в **IT-INCUBATOR**.

🔗 **Демо:** [https://ikomaz97.github.io/todolist-redax-toolkit](https://ikomaz97.github.io/todolist-redax-toolkit)

---

## 🚀 Быстрый старт

```bash
pnpm i
pnpm dev        # → http://localhost:3000
pnpm build      # production-сборка
pnpm deploy     # деплой на GitHub Pages
```

---

## 🧱 Стек

| Технология | Версия | Назначение |
|---|---|---|
| React | 19.1 | UI |
| TypeScript | 5.8 | Типизация |
| Vite + SWC | 7.0 | Сборка |
| Redux Toolkit + RTK Query | 2.8 | Стейт-менеджмент, работа с API |
| React Router | 7.6 | Маршрутизация |
| MUI (Material UI) | 7.1 | Компоненты + темизация |
| Emotion / Styled | 11.14 | Стилизация |
| React Hook Form + Zod | 7.58 / 3.25 | Формы + валидация |
| @dnd-kit | 6.3 / 10.0 | Drag-and-drop |
| Framer Motion | 12.36 | Анимации |
| React Window + TanStack Virtual | — | Виртуализация списков |
| React Google Recaptcha | 3.1 | Капча |
| Vitest | 3.2 | Тестирование |

---

## 🏗 Архитектура

```
src/
├── app/                    # Store, baseApi, app-slice, App.tsx, Main.tsx
├── common/                 # Переиспользуемое
│   ├── components/         #   Header, EditableSpan, ErrorSnackbar,
│   │                       #   DndContext, SortableItem, ProtectedRoute, ...
│   ├── hooks/              #   useAppDispatch, useAppSelector, хуки DnD
│   ├── routing/            #   Routing.tsx, Path
│   ├── theme/              #   getTheme() — светлая/тёмная тема MUI
│   ├── enums/              #   TaskStatus, TaskPriority, ResultCode
│   ├── types/              #   BaseResponse, FieldError, RequestStatus
│   ├── constants/          #   AUTH_TOKEN, PAGE_SIZE
│   └── utils/              #   createAppSlice, handleError
└── features/               # Модули (feature-based)
    ├── auth/               # Аутентификация
    │   ├── api/            #   authApi (login, logout, me, captcha)
    │   ├── lib/schemas/    #   loginSchema (Zod)
    │   └── ui/             #   Login, Captcha
    └── todolists/          # Тудулисты + задачи
        ├── api/            #   todolistsApi, tasksApi (RTK Query)
        ├── lib/            #   DomainTodolist, FilterValues, createTaskModel
        └── ui/             #   Todolists, TodolistItem, Tasks, ...
```

---

## ✨ Возможности

### 🔐 Авторизация
- Логин / логаут через `/auth/login`
- Запрос `me` при загрузке — автоопределение сессии
- **ReCAPTCHA** при ошибке CaptchaError
- Защита маршрутов через `ProtectedRoute`

### 📋 Тудулисты
- **CRUD**: создание, удаление, переименование
- **Reorder**: drag-and-drop с оптимистичным обновлением кэша
- Фильтрация: **All / Active / Completed**
- Скелетон при загрузке

### ✅ Задачи
- **CRUD**: создание, удаление, обновление (статус, приоритет, заголовок)
- **Пагинация**: `PAGE_SIZE = 4`, при заполнении страницы задача переходит на следующую
- **Reorder**: drag-and-drop внутри тудулиста
- **Оптимистичные обновления** с откатом при ошибке

### 🎨 UI / UX
- Светлая / тёмная тема (MUI, кастомная палитра)
- Анимации появления/исчезновения (Framer Motion)
- Drag Overlay — превью перетаскиваемого элемента
- Кастомный `EditableSpan` с тултипом для длинных заголовков
- Глобальный `ErrorSnackbar` для ошибок API

---

## 🌐 Переменные окружения

Создайте файл `.env` в корне:

```env
VITE_BASE_URL=https://your-api-url.com
VITE_API_KEY=your-api-key
```

---

## 🔌 API (бэкенд)

Приложение использует внешний REST API:
- **Base URL** — задаётся через `VITE_BASE_URL`
- **API-KEY** — передаётся в заголовках
- **Авторизация** — Bearer-токен из `localStorage`
- **Credentials** — `include` (куки)
- Ответы стандартизированы через `BaseResponse<T>`: `resultCode`, `messages`, `fieldsErrors`

**Эндпоинты:**
| Группа | Эндпоинты |
|---|---|
| `authApi` | `auth/login` (POST/DELETE), `auth/me` (GET), `security/get-captcha-url` (GET) |
| `todolistsApi` | `todo-lists` (GET/POST), `todo-lists/:id` (PUT/DELETE), `todo-lists/:id/reorder` (PUT) |
| `tasksApi` | `todo-lists/:id/tasks` (GET/POST), `todo-lists/:id/tasks/:taskId` (PUT/DELETE), `.../reorder` (PUT) |

---

## 🧪 Тестирование

```bash
pnpm vitest
```

---

## 📄 Лицензия

Учебный проект IT-INCUBATOR.
