// src/utils/openai.js
export async function getAISuggestion(prompt) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('Missing API key in .env');
    return 'OpenAI API key not set.';
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',  // ✅ safest default model
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return 'Error: ' + (data.error?.message || 'Unknown error');
    }

    return data.choices?.[0]?.message?.content || 'No suggestion returned.';
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return 'Could not fetch suggestion.';
  }
}
