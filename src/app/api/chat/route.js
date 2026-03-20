import { NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY

const SYSTEM_PROMPT = `Ты — AutoMind, AI-ассистент для автовладельцев. Помогаешь записывать расходы и отвечаешь на вопросы.

ПРАВИЛА:
1. Если пользователь описывает расход — верни ТОЛЬКО JSON:
{"action":"add_expense","expenses":[{"category":"fuel","amount":3200,"description":"Заправка 50л","liters":50,"date":"2026-03-20"}]}
Категории: fuel, service, wash, parking, insurance, tires, other

2. Если изображение — распознай ВСЕ расходы, верни JSON с массивом expenses.

3. Если вопрос — верни ТОЛЬКО JSON:
{"action":"answer","text":"Твой ответ"}

4. Даты: "вчера" = вчера, "3 дня назад" = 3 дня назад. Сегодня: DATE_TODAY

5. "5 тысяч" = 5000, "3.2к" = 3200

6. ТОЛЬКО валидный JSON, без markdown.`

export async function POST(request) {
  try {
    if (!GEMINI_KEY) {
      return NextResponse.json({ action: 'answer', text: 'API ключ не настроен.' })
    }

    const { message, image, car, expensesSummary } = await request.json()
    const today = new Date().toISOString().split('T')[0]

    const context = SYSTEM_PROMPT.replace('DATE_TODAY', today)
      + `\nАвто: ${car?.brand || ''} ${car?.model || ''} ${car?.year || ''}, пробег: ${car?.mileage || '?'} км.`
      + (expensesSummary ? `\nСводка: ${expensesSummary}` : '')

    const userParts = []
    if (image) {
      const base64Data = image.split(',')[1]
      const mimeType = image.match(/data:(.*?);/)?.[1] || 'image/jpeg'
      userParts.push({ inlineData: { mimeType, data: base64Data } })
    }
    userParts.push({ text: message || 'Распознай расходы с изображения' })

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`

    const body = {
      systemInstruction: { parts: [{ text: context }] },
      contents: [{ role: 'user', parts: userParts }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini error:', JSON.stringify(data))
      return NextResponse.json({ action: 'answer', text: 'Ошибка Gemini: ' + (data.error?.message || response.status) })
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    let parsed
    try {
      const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      // Try to fix truncated JSON — find last complete expense object
      try {
        const match = rawText.match(/\{"action"\s*:\s*"add_expense"\s*,\s*"expenses"\s*:\s*\[/)
        if (match) {
          const start = rawText.indexOf(match[0])
          let jsonStr = rawText.slice(start)
          // Find all complete objects and close the array
          const objects = []
          const regex = /\{[^{}]*"category"[^{}]*"amount"[^{}]*\}/g
          let m
          while ((m = regex.exec(jsonStr)) !== null) {
            try { objects.push(JSON.parse(m[0])); } catch {}
          }
          if (objects.length > 0) {
            parsed = { action: 'add_expense', expenses: objects }
          } else {
            parsed = { action: 'answer', text: rawText }
          }
        } else {
          parsed = { action: 'answer', text: rawText || 'Не удалось обработать.' }
        }
      } catch {
        parsed = { action: 'answer', text: rawText || 'Не удалось обработать.' }
      }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ action: 'answer', text: 'Ошибка: ' + error.message })
  }
}
