# Growatt Energy — сайт и Google CRM

Сайт на React / TanStack Start / Nitro, подготовленный для GitHub → Vercel.
CRM: Google Sheets + Apps Script + Gmail + Telegram. Внешняя БД и n8n не нужны.

**Текущий статус:** исходники и интеграционный код подготовлены, локальная сборка и тесты проходят. Google Таблица CRM создана. Репозиторий: https://github.com/odessamama2026/growatt-energy. Проект Vercel пока не развёрнут; Apps Script и доставка уведомлений не активированы. GA4 и Search Console не зарегистрированы. Не включайте публичный запуск, пока не заданы реальные контакты и не проверена доставка заявки.

## Структура
- `src/components/lead-form.tsx` — основная и короткая формы, подтверждение сохранения.
- `src/routes/api.leads.ts` — серверный приём заявок.
- `src/lib/crm/` — проверка данных и подписанная передача в Google.
- `google-apps-script/Code.gs` — CRM, Gmail, очередь Telegram, черновики Docs.
- `google-apps-script/appsscript.json` — разрешения Apps Script.
- `docs/SETUP-RU.md` — порядок подключения сервисов.
- `.env.example` — перечень параметров Vercel, без секретов.
- `.github/workflows/checks.yml` — автоматические проверки в GitHub.

## Локальные проверки
Node 24; `npm ci --ignore-scripts`, `npm run test:crm`, `npm run build`, `npm run typecheck`.
Сборка создаёт `.vercel/output`. Не задавайте Output Directory вручную в Vercel.

## Перед публикацией
Сначала выполните `docs/SETUP-RU.md`. Для Preview оставляйте `VITE_SITE_LIVE=false`. Сервер формы возвращает ошибку, если Google CRM не настроена; имитации успешной отправки нет.

Версия для внешнего размещения не включает неиспользуемые модули БД, входа в аккаунт и подключений исходной рабочей среды. Видимая атрибуция исходного шаблона сохранена.
