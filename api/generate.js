const MODEL = 'openai/gpt-oss-120b';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

function buildPrompt(topic) {
  return `You are a startup idea generator helping founders discover innovative business opportunities.

The user is exploring the space: "${topic}"

Generate exactly 4 unique, creative, and viable startup ideas in this space.

For EACH idea, provide:
1. Startup Name (catchy, memorable, 1-3 words)
2. Tagline (one punchy sentence, under 12 words)
3. Description (2-3 sentences explaining what the product does and who it's for)
4. Problem Solved (1-2 sentences describing the core pain point addressed)

Respond ONLY with valid JSON, no markdown, no explanation, no preamble. Use this exact structure:

{
  "ideas": [
    {
      "name": "StartupName",
      "tagline": "Punchy tagline here",
      "description": "What the product does and who uses it.",
      "problem": "The specific pain point this solves."
    }
  ]
}`;
}

function parseIdeasPayload(raw) {
  const clean = String(raw).replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Could not parse AI response.');
    }
    return JSON.parse(match[0]);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: 'Server is missing GROQ_API_KEY.' });
  }

  const topic = String(req.body?.topic || '').trim();
  if (!topic) {
    return res.status(400).json({ message: 'Topic is required.' });
  }

  try {
    const groqResponse = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.8,
        max_tokens: 1200,
        messages: [
          {
            role: 'system',
            content: 'Return only valid JSON matching the requested schema.'
          },
          {
            role: 'user',
            content: buildPrompt(topic)
          }
        ]
      })
    });

    const groqData = await groqResponse.json().catch(() => ({}));

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        message: groqData.error?.message || `Groq API error ${groqResponse.status}`
      });
    }

    const raw = groqData.choices?.[0]?.message?.content || '';
    const parsed = parseIdeasPayload(raw);
    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Unexpected server error.'
    });
  }
};
