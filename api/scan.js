export const config = {
  api: {
    bodyParser: { sizeLimit: '6mb' }
  }
};

const PROMPT = '分析此日本收據，只回傳JSON不含其他文字：{"storeName":"店名繁中","storeNameJp":"日文原名","date":"YYYY-MM-DD","total":數字,"items":[{"name":"品名繁中","nameJp":"日文","price":數字,"tax":"8%或10%"}]}';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const requiredPassword = process.env.APP_PASSWORD;
  if (requiredPassword) {
    const provided = req.headers['x-app-password'] || '';
    if (provided !== requiredPassword) {
      return res.status(401).json({ error: '密碼錯誤' });
    }
  }

  const { image, mediaType } = req.body || {};
  if (!image || typeof image !== 'string') {
    return res.status(400).json({ error: '缺少圖片資料' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server 沒設定 ANTHROPIC_API_KEY' });
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
            { type: 'text', text: PROMPT }
          ]
        }]
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(r.status).json({ error: 'Anthropic API 錯誤', details: errText.slice(0, 500) });
    }

    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Function error', message: e.message });
  }
}
