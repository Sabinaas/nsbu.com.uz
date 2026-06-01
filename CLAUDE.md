# NSBU-UZ — Проект

## Что это
Онлайн-справочник по НСБУ Узбекистана с ИИ-консультантом.
Сайт: https://nsbu-uz.netlify.app/
Стек: React + Vite + Tailwind CSS + Netlify Functions + Supabase

## Что уже сделано (Cowork)
- package.json, vite.config.js, tailwind.config.js, postcss.config.js
- netlify.toml
- index.html, public/favicon.svg
- src/main.jsx, src/App.jsx, src/index.css
- src/i18n/ru.js, src/i18n/uz.js, src/i18n/index.js
- src/data/standards.js (все 22 стандарта + функция findRelevantStandards)
- src/components/Header.jsx

## Что нужно сделать — ЭТАП 1

### ЗАДАЧА 1 — Удалить офлайн-режим
- Убедиться что нет Service Worker (sw.js, регистрации в main.jsx)
- Убрать любое кэширование офлайн-режима
- Убрать упоминания "Офлайн" из интерфейса

### ЗАДАЧА 2 — Переключатель языка RU/UZ
- Кнопка [РУ] [УЗ] в шапке (Header.jsx уже есть)
- Языковые пакеты ru.js и uz.js уже созданы
- Сохранять в localStorage, по умолчанию RU

### ЗАДАЧА 3 — ИИ-консультант
- Создать netlify/functions/chat.js с системным промптом:
  "Ты эксперт-практик по НСБУ Узбекистана с 15-летним стажем.
   Отвечай на том языке на котором задан вопрос.
   Всегда указывай НСБУ №__, пункт/раздел.
   Формат: 1) Прямой ответ 2) Ссылка на стандарт 3) Пример.
   Если не уверен — рекомендуй lex.uz.
   С 2025 года действуют обновлённые редакции (приказ МЭФ от 14.06.2024 №130)"
- RAG: использовать findRelevantStandards() из src/data/standards.js
- Создать src/components/AIChat.jsx

### ЗАДАЧА 4 — Автообновление базы
- Показывать дату обновления в шапке (из localStorage)
- Банер при первом открытии

### ЗАДАЧА 5 — Вкладка Руководство
- Создать src/components/Guide.jsx
- Контент на RU и UZ (тексты в i18n уже есть)
- Тарифы: Бесплатно 3+3 | Триал 10 дней | Подписка 45 000 сум/мес

## После Этапа 1
- npm run build (должно собраться без ошибок)
- git add . && git commit -m "feat: этап 1" && git push
- Netlify задеплоит автоматически

## ЭТАП 2 (после проверки Этапа 1)
- Авторизация через Supabase Auth (телефон или email + OTP)
- Таблица users: id, phone, email, created_at, status, trial_end, sub_end, role, is_blocked
- Счётчик для гостей (3 просмотра + 3 вопроса в localStorage)
- Модалка при достижении лимита
- Триал-баннер после регистрации
- Страница /profile (профиль, подписка, история запросов, избранное)
- Netlify Functions: /api/auth, /api/payment-webhook, /api/check-subscription

## ЭТАП 3 (после проверки Этапа 2)
- Админ-панель /admin (только для role = 'admin')
- Дашборд: пользователи, выручка, графики
- Управление пользователями: выдать доступ, заблокировать
- Аналитика запросов к ИИ
- Google Analytics 4 (VITE_GA_MEASUREMENT_ID)
- Microsoft Clarity (VITE_CLARITY_ID)

## Переменные окружения (в Netlify)
- ANTHROPIC_API_KEY ✅
- SUPABASE_URL (Этап 2)
- SUPABASE_ANON_KEY (Этап 2)
- SUPABASE_SERVICE_KEY (Этап 2)
- VITE_GA_MEASUREMENT_ID (Этап 3)
- VITE_CLARITY_ID (Этап 3)
- ADMIN_EMAIL (Этап 3)
