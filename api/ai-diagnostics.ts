export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Set response headers to prevent caching
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json');

  try {
    const openAiKey = process.env.OPENAI_API_KEY;
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    // We proceed only if we have the keys configured.
    // If not, we just log and exit gracefully so we don't break the caller (e.g. Sentry).
    if (!openAiKey || !discordWebhookUrl) {
      console.warn("AI Diagnostics aborted: Missing OPENAI_API_KEY or DISCORD_WEBHOOK_URL in environment.");
      return res.status(200).json({ status: 'ignored', message: 'Missing API keys' });
    }

    // Extract error details from the webhook payload (e.g., from Sentry)
    const payload = req.body || {};
    
    // We try to extract a generic error message/stack trace. Sentry payloads can be complex,
    // so we stringify the most relevant parts or the whole thing if it's small.
    let errorSummary = '';
    if (payload.project_name && payload.message) {
      errorSummary = `Project: ${payload.project_name}\nError: ${payload.message}\nURL: ${payload.url || 'N/A'}`;
    } else {
      // Fallback: stringify the body but truncate it so we don't blow up token limits
      errorSummary = JSON.stringify(payload).substring(0, 1500);
    }

    if (!errorSummary || errorSummary === '{}') {
      return res.status(400).json({ error: 'Empty payload' });
    }

    const prompt = `You are an expert React/Node.js debugging assistant. 
An error just occurred in a production Vercel/Vite/React application. 
Here is the error payload from the error tracker:

${errorSummary}

Please diagnose this error, explain what likely caused it, and suggest a precise code fix. 
Format your response concisely.`;

    // 1. Call OpenAI for diagnosis
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Or gpt-3.5-turbo
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.2
      })
    });

    if (!aiResponse.ok) {
      const aiErr = await aiResponse.text();
      console.error('OpenAI Error:', aiErr);
      throw new Error('Failed to get diagnosis from OpenAI');
    }

    const aiData = await aiResponse.json();
    const diagnosis = aiData.choices?.[0]?.message?.content || "No diagnosis generated.";

    // 2. Send the diagnosis to Discord Webhook
    const discordMessage = {
      content: `🚨 **New Production Error Detected** 🚨\n\n**Raw Error summary:**\n\`\`\`json\n${errorSummary.substring(0, 500)}\n\`\`\`\n\n🤖 **AI Diagnosis & Fix:**\n${diagnosis}`
    };

    const discordResponse = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordMessage)
    });

    if (!discordResponse.ok) {
      console.error('Discord Webhook Error:', await discordResponse.text());
      throw new Error('Failed to post to Discord');
    }

    return res.status(200).json({ status: 'success', message: 'Diagnosis sent to Discord.' });

  } catch (err) {
    console.error('AI Diagnostic Webhook Error:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error during diagnosis' });
  }
}
