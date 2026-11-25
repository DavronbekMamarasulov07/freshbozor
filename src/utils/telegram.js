const BOT_TOKEN = import.meta.env?.VITE_TELEGRAM_BOT_TOKEN
const CHAT_ID = import.meta.env?.VITE_TELEGRAM_CHAT_ID

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatAmount(amount, currencyLabel) {
  const num = Math.round(Number(amount) || 0)
  return `${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currencyLabel}`
}

export function buildOrderTelegramMessage(order, labels) {
  const {
    currency = "so'm",
    deliveryTimeLabel,
    paymentMethodLabel,
    freeLabel = 'Bepul',
  } = labels

  const itemLines = order.items
    .map(
      (item, index) =>
        `${index + 1}. <b>${escapeHtml(item.name)}</b> (${escapeHtml(item.unit)}) × ${item.quantity} = <b>${formatAmount(item.price * item.quantity, currency)}</b>`
    )
    .join('\n')

  const lines = [
    `🛒 <b>Yangi buyurtma — FreshBozor</b>`,
    `🆔 Buyurtma: <code>#${escapeHtml(order.id)}</code>`,
    `🕒 Vaqt: ${escapeHtml(new Date(order.createdAt).toLocaleString('uz-UZ'))}`,
    '',
    `👤 <b>Mijoz:</b> ${escapeHtml(order.customer.fullName)}`,
    `📞 <b>Telefon:</b> ${escapeHtml(order.customer.phone)}`,
    `📍 <b>Manzil:</b> ${escapeHtml(order.customer.address)}`,
    `🚚 <b>Yetkazish vaqti:</b> ${escapeHtml(deliveryTimeLabel)}`,
    `💳 <b>To'lov turi:</b> ${escapeHtml(paymentMethodLabel)}`,
  ]

  if (order.customer.notes?.trim()) {
    lines.push(`📝 <b>Izoh:</b> ${escapeHtml(order.customer.notes.trim())}`)
  }

  lines.push('', `📦 <b>Mahsulotlar:</b>`, itemLines, '')
  lines.push(`💵 Mahsulotlar: ${formatAmount(order.subtotal, currency)}`)

  if (order.discountAmount > 0) {
    const promoTag = order.promoCode ? ` (${escapeHtml(order.promoCode)})` : ''
    lines.push(`🏷 Chegirma${promoTag}: -${formatAmount(order.discountAmount, currency)}`)
  }

  lines.push(
    `🛵 Yetkazib berish: ${order.deliveryFee === 0 ? freeLabel : formatAmount(order.deliveryFee, currency)}`
  )
  lines.push(`✅ <b>Jami to'lov: ${formatAmount(order.total, currency)}</b>`)

  return lines.join('\n')
}

export async function sendOrderToTelegram(order, labels) {
  if (!BOT_TOKEN || !CHAT_ID) {
    return { ok: false, error: 'Telegram bot token or chat ID is not configured.' }
  }

  const text = buildOrderTelegramMessage(order, labels)

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    const data = await response.json()
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data?.description || `Telegram API error (${response.status})`,
      }
    }

    return { ok: true, messageId: data.result?.message_id }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}

