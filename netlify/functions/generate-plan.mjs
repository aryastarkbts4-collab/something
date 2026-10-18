// Netlify serverless function. The Gemini key stays on Netlify (never in index.html).
export default async (req) => {
  const reply = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
  if (req.method !== 'POST') return reply(405, { error: 'Use POST' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return reply(503, { error: 'GEMINI_API_KEY is not set in Netlify.' });
  let body;
  try { body = await req.json(); } catch { return reply(400, { error: 'Bad request' }); }
  if (typeof body.prompt !== 'string' || !body.prompt.trim() || body.prompt.length > 20000) return reply(400, { error: 'Invalid prompt' });
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: body.prompt }] }], generationConfig: body.mode === 'text' ? {} : { responseMimeType: 'application/json' } }),
      signal: AbortSignal.timeout(20000)
    });
    if (!r.ok) return reply(502, { error: 'Gemini error ' + r.status + '. Check key, quota and GEMINI_MODEL.' });
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
    return reply(200, { text });
  } catch { return reply(502, { error: 'Gemini did not respond in time.' }); }
};
