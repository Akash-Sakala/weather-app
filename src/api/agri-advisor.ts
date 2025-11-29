import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateAgriAdvice(type: string, weather: any) {
  const prompt = `
  You are an agricultural expert. Respond with 6 concise bullet points only.

  Advisory Task → ${type}

  Weather inputs:
  - Temperature: ${weather.temp}°C
  - Humidity: ${weather.humidity}%
  - Wind speed: ${weather.wind} m/s
  - Pressure: ${weather.pressure} hPa
  - Visibility: ${weather.vis}
  - Next 5-day rain trend approximation: ${weather.rain}

  Return a practical farm recommendation. Avoid generic text.
  `;

  const res = await model.generateContent(prompt);
  return res.response.text();
}
