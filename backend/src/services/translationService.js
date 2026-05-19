const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Translates an object of strings into the target language.
 * Useful for bulk translating UI labels or candidate data.
 */
async function translateObject(obj, targetLang) {
  if (!targetLang || targetLang.toLowerCase() === 'english') {
    return obj;
  }

  try {
    const prompt = `
      Translate the following JSON object values into ${targetLang}. 
      Keep the keys exactly the same.
      Ensure the translation is natural and accurate for a civic/election context.
      Return ONLY the translated JSON object, nothing else.
      
      JSON to translate:
      ${JSON.stringify(obj, null, 2)}
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: 'You are a professional translator specialized in Indian regional languages (Kannada, Hindi). You output ONLY valid JSON.',
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON (Gemini guarantees valid JSON due to responseMimeType)
    const translated = JSON.parse(text);
    return translated;
  } catch (error) {
    console.error(`AI Translation to ${targetLang} failed:`, error.message);
    return obj; // Fallback to original
  }
}

/**
 * Translates a single string.
 */
async function translateText(text, targetLang) {
  if (!targetLang || targetLang.toLowerCase() === 'english') return text;
  
  const result = await translateObject({ text }, targetLang);
  return result.text;
}

module.exports = {
  translateText,
  translateObject
};
