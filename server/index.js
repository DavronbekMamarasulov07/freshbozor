import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const ORDERS_FILE = path.join(__dirname, 'orders.json')

function loadEnvFiles() {
  for (const file of ['.env', '.env.local']) {
    const filePath = path.join(ROOT_DIR, file)
    if (!fs.existsSync(filePath)) continue
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eqIdx = line.indexOf('=')
      if (eqIdx === -1) continue
      const key = line.slice(0, eqIdx).trim()
      let val = line.slice(eqIdx + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      if (!process.env[key]) {
        process.env[key] = val
      }
    }
  }
}

loadEnvFiles()

const PORT = Number(process.env.API_PORT || 3001)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || ''
const OPERATOR_CHAT_ID = String(
  process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || ''
).trim()

const STATUS_META = {
  new: {
    emoji: '🟡',
    label: 'Yangi buyurtma',
    actions: ['accept', 'cancel'],
  },
  accepted: {
    emoji: '🔵',
    label: 'Operator qabul qildi (Tayyorlanmoqda)',
    actions: ['deliver', 'cancel'],
  },
  delivering: {
    emoji: '🚚',
    label: "Kuryer yo'lda (Yetkazilmoqda)",
    actions: ['complete', 'cancel'],
  },
  delivered: {
    emoji: '✅',
    label: 'Yetkazib berildi',
    actions: [],
  },
  cancelled: {
    emoji: '❌',
    label: 'Bekor qilindi',
    actions: ['restore'],
  },
}

const ACTION_CONFIG = {
  accept: {
    nextStatus: 'accepted',
    btnText: '✅ Qabul qilish',
    toast: 'Buyurtma qabul qilindi!',
  },
  deliver: {
    nextStatus: 'delivering',
    btnText: '🚚 Yetkazishga chiqarish',
    toast: "Kuryer yo'lga chiqdi!",
  },
  complete: {
    nextStatus: 'delivered',
    btnText: '✔️ Yetkazildi',
    toast: 'Buyurtma muvaffaqiyatli yetkazildi!',
  },
  cancel: {
    nextStatus: 'cancelled',
    btnText: '❌ Bekor qilish',
    toast: 'Buyurtma bekor qilindi.',
  },
  restore: {
    nextStatus: 'new',
    btnText: '↩️ Qayta ochish',
    toast: 'Buyurtma qayta ochildi.',
  },
}

function readOrdersStore() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return []
    const parsed = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
    return Array.isArray(parsed.orders) ? parsed.orders : []
  } catch {
    return []
  }
}

function writeOrdersStore(orders) {
  const tmp = `${ORDERS_FILE}.tmp`
  fs.writeFileSync(tmp, JSON.stringify({ orders }, null, 2), 'utf8')
  fs.renameSync(tmp, ORDERS_FILE)
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatMoney(amount, currency = "so'm") {
  const num = Math.round(Number(amount) || 0)
  return `${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currency}`
}

function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    })
  } catch {
    return isoString
  }
}

function buildOrderInlineKeyboard(order) {
  const meta = STATUS_META[order.status] || STATUS_META.new
  if (meta.actions.length === 0) return { inline_keyboard: [] }
  const row = meta.actions.map((actionKey) => ({
    text: ACTION_CONFIG[actionKey].btnText,
    callback_data: `ord:${order.id}:${actionKey}`,
  }))
  return { inline_keyboard: [row] }
}

function formatOrderTelegramHtml(order) {
  const meta = STATUS_META[order.status] || STATUS_META.new
  const currency = order.currency || "so'm"
  const itemLines = (order.items || [])
    .map(
      (item, idx) =>
        `${idx + 1}. <b>${escapeHtml(item.name)}</b> (${escapeHtml(item.unit)}) × ${item.quantity} = <b>${formatMoney(item.price * item.quantity, currency)}</b>`
    )
    .join('\n')

  const historyLines = (order.history || [])
    .map((entry) => {
      const m = STATUS_META[entry.status] || STATUS_META.new
      return `• ${m.emoji} ${escapeHtml(m.label)} — <i>${escapeHtml(formatTime(entry.at))}</i>`
    })
    .join('\n')

  const lines = [
    `🛒 <b>Buyurtma #${escapeHtml(order.id)}</b>`,
    `📌 <b>Holat:</b> ${meta.emoji} <b>${escapeHtml(meta.label)}</b>`,
    `🕒 Yaratilgan: ${escapeHtml(formatTime(order.createdAt))}`,
    '',
    `👤 <b>Mijoz:</b> ${escapeHtml(order.customer?.fullName)}`,
    `📞 <b>Telefon:</b> ${escapeHtml(order.customer?.phone)}`,
    `📍 <b>Manzil:</b> ${escapeHtml(order.customer?.address)}`,
    `🚚 <b>Yetkazish vaqti:</b> ${escapeHtml(order.deliveryTimeLabel || order.customer?.deliveryTime)}`,
    `💳 <b>To'lov turi:</b> ${escapeHtml(order.paymentMethodLabel || order.customer?.paymentMethod)}`,
  ]

  if (order.customer?.notes?.trim()) {
    lines.push(`📝 <b>Izoh:</b> ${escapeHtml(order.customer.notes.trim())}`)
  }

  lines.push('', `📦 <b>Mahsulotlar:</b>`, itemLines, '')
  lines.push(`💵 Mahsulotlar: ${formatMoney(order.subtotal, currency)}`)

  if (order.discountAmount > 0) {
    const promo = order.promoCode ? ` (${escapeHtml(order.promoCode)})` : ''
    lines.push(`🏷 Chegirma${promo}: -${formatMoney(order.discountAmount, currency)}`)
  }

  lines.push(
    `🛵 Yetkazib berish: ${order.deliveryFee === 0 ? 'Bepul' : formatMoney(order.deliveryFee, currency)}`
  )
  lines.push(`💰 <b>Jami to'lov: ${formatMoney(order.total, currency)}</b>`)

  if (historyLines) {
    lines.push('', `📊 <b>Bosqichlar tarixi:</b>`, historyLines)
  }

  return lines.join('\n')
}

async function callTelegram(method, payload = {}) {
  if (!BOT_TOKEN) {
    return { ok: false, description: 'TELEGRAM_BOT_TOKEN is missing' }
  }
  const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return resp.json()
}

async function sendOrderToOperator(order) {
  if (!BOT_TOKEN || !OPERATOR_CHAT_ID) {
    return { ok: false, error: 'Telegram bot credentials not configured' }
  }
  const res = await callTelegram('sendMessage', {
    chat_id: OPERATOR_CHAT_ID,
    text: formatOrderTelegramHtml(order),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: buildOrderInlineKeyboard(order),
  })
  if (!res.ok) {
    return { ok: false, error: res.description || 'Telegram sendMessage failed' }
  }
  return { ok: true, messageId: res.result?.message_id }
}

function isAuthorizedOperator(chatId, fromId) {
  if (!OPERATOR_CHAT_ID) return false
  return String(chatId) === OPERATOR_CHAT_ID || String(fromId) === OPERATOR_CHAT_ID
}

async function sendOperatorMenu(chatId) {
  const text = [
    `👋 <b>FreshBozor Operator Boshqaruv Paneli</b>`,
    '',
    `Yangi buyurtmalar kelganda shu yerga interaktiv tugmalar bilan tushadi:`,
    `• <b>✅ Qabul qilish</b> — buyurtmani tasdiqlash va yig'ish`,
    `• <b>🚚 Yetkazishga chiqarish</b> — kuryer yo'lga chiqqanda`,
    `• <b>✔️ Yetkazildi</b> — buyurtma mijozga topshirilganda`,
    `• <b>❌ Bekor qilish</b> — buyurtmani bekor qilish`,
    '',
    `Buyruqlar:`,
    `/active — Faol buyurtmalarni boshqarish`,
    `/orders — Oxirgi 10 ta buyurtma`,
    `/stats — Statistika va tushum`,
  ].join('\n')

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📋 Faol buyurtmalar', callback_data: 'cmd:active' },
          { text: '📊 Statistika', callback_data: 'cmd:stats' },
        ],
        [{ text: '📦 Oxirgi buyurtmalar', callback_data: 'cmd:orders' }],
      ],
    },
  })
}

async function sendActiveOrdersList(chatId) {
  const orders = readOrdersStore()
  const active = orders.filter((o) => ['new', 'accepted', 'delivering'].includes(o.status))

  if (active.length === 0) {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: '✨ Hozirda faol (yangi yoki yo‘ldagi) buyurtmalar yo‘q.',
    })
    return
  }

  const keyboard = active.slice(0, 10).map((o) => {
    const meta = STATUS_META[o.status] || STATUS_META.new
    return [
      {
        text: `${meta.emoji} #${o.id} — ${o.customer?.fullName || 'Mijoz'} (${formatMoney(o.total)})`,
        callback_data: `ord:${o.id}:view`,
      },
    ]
  })

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text: `📋 <b>Faol buyurtmalar (${active.length} ta):</b>\nBoshqarish uchun buyurtmani tanlang:`,
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: keyboard },
  })
}

async function sendRecentOrdersList(chatId) {
  const orders = readOrdersStore().slice(0, 10)
  if (orders.length === 0) {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: '📭 Hali buyurtmalar kelib tushmagan.',
    })
    return
  }

  const lines = orders.map((o, idx) => {
    const meta = STATUS_META[o.status] || STATUS_META.new
    return `${idx + 1}. ${meta.emoji} <code>#${escapeHtml(o.id)}</code> — <b>${escapeHtml(o.customer?.fullName)}</b> • ${formatMoney(o.total)}`
  })

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text: `📦 <b>Oxirgi buyurtmalar:</b>\n\n${lines.join('\n')}`,
    parse_mode: 'HTML',
  })
}

async function sendStatsSummary(chatId) {
  const orders = readOrdersStore()
  const counts = { new: 0, accepted: 0, delivering: 0, delivered: 0, cancelled: 0 }
  let activeRevenue = 0
  let deliveredRevenue = 0

  for (const o of orders) {
    if (counts[o.status] !== undefined) counts[o.status] += 1
    if (o.status === 'delivered') deliveredRevenue += Number(o.total) || 0
    if (['new', 'accepted', 'delivering'].includes(o.status)) {
      activeRevenue += Number(o.total) || 0
    }
  }

  const text = [
    `📊 <b>FreshBozor Operator Statistikasi</b>`,
    '',
    `📦 Jami buyurtmalar: <b>${orders.length} ta</b>`,
    `🟡 Yangi: <b>${counts.new}</b>`,
    `🔵 Qabul qilingan: <b>${counts.accepted}</b>`,
    `🚚 Yo'lda: <b>${counts.delivering}</b>`,
    `✅ Yetkazilgan: <b>${counts.delivered}</b>`,
    `❌ Bekor qilingan: <b>${counts.cancelled}</b>`,
    '',
    `💵 Yetkazilgan tushum: <b>${formatMoney(deliveredRevenue)}</b>`,
    `⏳ Jarayondagi summa: <b>${formatMoney(activeRevenue)}</b>`,
  ].join('\n')

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  })
}

async function handleCallbackQuery(callback) {
  const chatId = callback.message?.chat?.id
  const messageId = callback.message?.message_id
  const fromId = callback.from?.id

  if (!isAuthorizedOperator(chatId, fromId)) {
    await callTelegram('answerCallbackQuery', {
      callback_query_id: callback.id,
      text: 'Sizda operator ruxsati yo‘q.',
      show_alert: true,
    })
    return
  }

  const data = String(callback.data || '')
  if (data === 'cmd:active') {
    await callTelegram('answerCallbackQuery', { callback_query_id: callback.id })
    await sendActiveOrdersList(chatId)
    return
  }
  if (data === 'cmd:orders') {
    await callTelegram('answerCallbackQuery', { callback_query_id: callback.id })
    await sendRecentOrdersList(chatId)
    return
  }
  if (data === 'cmd:stats') {
    await callTelegram('answerCallbackQuery', { callback_query_id: callback.id })
    await sendStatsSummary(chatId)
    return
  }

  const parts = data.split(':')
  if (parts[0] !== 'ord' || parts.length < 3) {
    await callTelegram('answerCallbackQuery', { callback_query_id: callback.id })
    return
  }

  const [, orderId, action] = parts
  const orders = readOrdersStore()
  const idx = orders.findIndex((o) => o.id === orderId)

  if (idx === -1) {
    await callTelegram('answerCallbackQuery', {
      callback_query_id: callback.id,
      text: 'Buyurtma topilmadi.',
      show_alert: true,
    })
    return
  }

  const order = orders[idx]

  if (action === 'view') {
    await callTelegram('answerCallbackQuery', { callback_query_id: callback.id })
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: formatOrderTelegramHtml(order),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: buildOrderInlineKeyboard(order),
    })
    return
  }

  const cfg = ACTION_CONFIG[action]
  const currentMeta = STATUS_META[order.status] || STATUS_META.new

  if (!cfg) {
    await callTelegram('answerCallbackQuery', { callback_query_id: callback.id })
    return
  }

  if (!currentMeta.actions.includes(action)) {
    await callTelegram('answerCallbackQuery', {
      callback_query_id: callback.id,
      text: `Hozirgi holat: ${currentMeta.label}`,
    })
    if (chatId && messageId) {
      await callTelegram('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: formatOrderTelegramHtml(order),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: buildOrderInlineKeyboard(order),
      })
    }
    return
  }

  const updated = {
    ...order,
    status: cfg.nextStatus,
    updatedAt: new Date().toISOString(),
    history: [
      ...(order.history || []),
      { status: cfg.nextStatus, at: new Date().toISOString() },
    ],
  }
  orders[idx] = updated
  writeOrdersStore(orders)

  await callTelegram('answerCallbackQuery', {
    callback_query_id: callback.id,
    text: `#${updated.id}: ${cfg.toast}`,
  })

  if (chatId && messageId) {
    await callTelegram('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: formatOrderTelegramHtml(updated),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: buildOrderInlineKeyboard(updated),
    })
  }
}

async function handleIncomingMessage(message) {
  const chatId = message.chat?.id
  const fromId = message.from?.id
  const text = String(message.text || '').trim()

  if (!isAuthorizedOperator(chatId, fromId)) {
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: '⛔ Ushbu bot faqat FreshBozor do‘kon operatori uchun mo‘ljallangan.',
    })
    return
  }

  if (text === '/start' || text === '/help') {
    await sendOperatorMenu(chatId)
    return
  }
  if (text === '/active') {
    await sendActiveOrdersList(chatId)
    return
  }
  if (text === '/orders') {
    await sendRecentOrdersList(chatId)
    return
  }
  if (text === '/stats') {
    await sendStatsSummary(chatId)
    return
  }

  const orderMatch = text.match(/#?(FB-\d+)/i)
  if (orderMatch) {
    const id = orderMatch[1].toUpperCase()
    const order = readOrdersStore().find((o) => o.id === id)
    if (!order) {
      await callTelegram('sendMessage', {
        chat_id: chatId,
        text: `Buyurtma <code>#${escapeHtml(id)}</code> topilmadi.`,
        parse_mode: 'HTML',
      })
      return
    }
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: formatOrderTelegramHtml(order),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: buildOrderInlineKeyboard(order),
    })
    return
  }

  await sendOperatorMenu(chatId)
}

let pollingActive = true
let lastUpdateOffset = 0

async function startTelegramPolling() {
  if (!BOT_TOKEN || !OPERATOR_CHAT_ID) {
    console.warn('[bot] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing — polling disabled.')
    return
  }

  try {
    await callTelegram('setMyCommands', {
      commands: [
        { command: 'active', description: 'Faol buyurtmalarni boshqarish' },
        { command: 'orders', description: 'Oxirgi 10 ta buyurtma' },
        { command: 'stats', description: 'Statistika va tushum' },
        { command: 'help', description: "Operator qo'llanmasi" },
      ],
    })
  } catch (err) {
    console.warn('[bot] setMyCommands failed:', err.message)
  }

  console.log(`[bot] Operator Telegram bot polling started (chat: ${OPERATOR_CHAT_ID})`)

  while (pollingActive) {
    try {
      const resp = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateOffset}&timeout=20`,
        { signal: AbortSignal.timeout(28000) }
      )
      const data = await resp.json()

      if (!data.ok) {
        if (data.error_code === 409) {
          console.warn('[bot] 409 Conflict: another bot poller is active. Retrying in 5s...')
          await new Promise((r) => setTimeout(r, 5000))
        } else {
          console.warn('[bot] getUpdates error:', data.description)
          await new Promise((r) => setTimeout(r, 3000))
        }
        continue
      }

      for (const update of data.result || []) {
        lastUpdateOffset = update.update_id + 1
        if (update.callback_query) {
          await handleCallbackQuery(update.callback_query)
        } else if (update.message) {
          await handleIncomingMessage(update.message)
        }
      }
    } catch (err) {
      if (!pollingActive) break
      if (err.name !== 'TimeoutError' && err.name !== 'AbortError') {
        console.warn('[bot] polling retry:', err.message)
      }
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 1024 * 1024) reject(new Error('Payload too large'))
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`)

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, {
      ok: true,
      botConfigured: Boolean(BOT_TOKEN && OPERATOR_CHAT_ID),
    })
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/orders') {
    const orders = readOrdersStore()
    const idsParam = url.searchParams.get('ids')
    if (idsParam) {
      const wanted = new Set(idsParam.split(',').map((s) => s.trim()))
      sendJson(res, 200, { ok: true, orders: orders.filter((o) => wanted.has(o.id)) })
      return
    }
    sendJson(res, 200, { ok: true, orders: orders.slice(0, 30) })
    return
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/orders/')) {
    const orderId = decodeURIComponent(url.pathname.replace('/api/orders/', '')).trim()
    const order = readOrdersStore().find((o) => o.id === orderId)
    if (!order) {
      sendJson(res, 404, { ok: false, error: 'Order not found' })
      return
    }
    sendJson(res, 200, { ok: true, order })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/orders') {
    try {
      const body = await readJsonBody(req)
      if (!body?.customer?.fullName || !body?.customer?.phone || !body?.customer?.address) {
        sendJson(res, 400, { ok: false, error: 'Missing required customer fields' })
        return
      }

      const now = new Date().toISOString()
      const orders = readOrdersStore()
      const orderId = body.id || `FB-${Math.floor(100000 + Math.random() * 900000)}`
      const order = {
        ...body,
        id: orderId,
        status: 'new',
        createdAt: body.createdAt || now,
        updatedAt: now,
        history: [{ status: 'new', at: now }],
      }

      const tg = await sendOrderToOperator(order)
      if (tg.messageId) {
        order.telegramMessageId = tg.messageId
      }

      orders.unshift(order)
      writeOrdersStore(orders)

      sendJson(res, 201, { ok: true, order, telegram: tg })
    } catch (err) {
      sendJson(res, 400, { ok: false, error: err.message || 'Invalid request' })
    }
    return
  }

  sendJson(res, 404, { ok: false, error: 'Not found' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[api] FreshBozor order server listening on http://127.0.0.1:${PORT}`)
  startTelegramPolling()
})

function shutdown() {
  pollingActive = false
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(0), 500)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
