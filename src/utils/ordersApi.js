export async function submitOrder(orderPayload) {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })

    const data = await response.json()
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        order: orderPayload,
        telegram: { ok: false, error: data?.error || `Server error (${response.status})` },
      }
    }

    return {
      ok: true,
      order: data.order,
      telegram: data.telegram || { ok: false, error: 'Unknown status' },
    }
  } catch (err) {
    return {
      ok: false,
      order: orderPayload,
      telegram: {
        ok: false,
        error: err instanceof Error ? err.message : 'Server unreachable',
      },
    }
  }
}

export async function fetchOrderStatus(orderId) {
  try {
    const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.ok ? data.order : null
  } catch {
    return null
  }
}
