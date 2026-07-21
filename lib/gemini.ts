const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getGeminiResponse(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) {
    return "AI unavailable. Please configure GROQ_API_KEY in your .env.local file.";
  }

  for (const modelName of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        });

        if (response.status === 429) {
          const waitTime = Math.pow(2, attempt + 1) * 1000;
          console.log(`Rate limited on ${modelName}. Waiting ${waitTime / 1000}s...`);
          await sleep(waitTime);
          continue;
        }

        if (response.status === 404) {
          console.log(`Model ${modelName} not available, trying next...`);
          break;
        }

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Groq API error (${modelName}, attempt ${attempt + 1}):`, errorData);

          if (response.status === 401 || response.status === 403) {
            return "API key error. Please check your GROQ_API_KEY in .env.local.";
          }

          if (attempt < 2) {
            await sleep(1000 * (attempt + 1));
            continue;
          }
          break;
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        console.error(`Groq API error (${modelName}, attempt ${attempt + 1}):`, err.message || error);

        if (attempt < 2) {
          await sleep(1000 * (attempt + 1));
        }
      }
    }
  }

  return "AI is temporarily busy. Please wait a moment and try again.";
}
