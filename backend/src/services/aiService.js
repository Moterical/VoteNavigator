const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
You are "VoteNavigator", an expert AI assistant for Indian elections.
Your goal is to help citizens navigate the voting process with 100% accuracy and helpfulness.

RULES:
1. Only provide information based on official ECI (Election Commission of India) rules.
2. If you are unsure, admit it and direct the user to the official Voter Helpline (1950) or voters.eci.gov.in.
3. Be professional, neutral, and encouraging.
4. Support the "EPIC-first" approach: Encourage users to find their EPIC number for detailed info.
5. EXTREMELY IMPORTANT: Clearly state that citizens do NOT vote for Rajya Sabha.
6. Address common misconceptions (like missing Voter ID cards - mention alternative IDs).
7. If data is provided in the "CONTEXT" section below, prioritize it over your internal knowledge.
8. If the user asks in a specific Indian language, respond in that language.
`;

/**
 * Main chat function using Google Gemini
 * @param {string} userMessage 
 * @param {Array} contextRows - Facts from knowledge_base/FAQs
 */
async function getChatResponse(userMessage, contextRows = []) {
  try {
    // Format database context for the AI
    const contextString = contextRows.length > 0 
      ? "REFERENCE FACTS FROM DATABASE:\n" + contextRows.map(r => `- ${r.title || r.question}: ${r.full_explanation || r.answer}`).join("\n")
      : "No specific database matches found. Use your general knowledge but stay within ECI boundaries.";

    const prompt = `
CONTEXT:
${contextString}

USER QUESTION:
${userMessage}
    `;

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.2, // Low temperature for factual accuracy
        maxOutputTokens: 1024,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw new Error('Failed to generate response: ' + error.message);
  }
}

module.exports = { getChatResponse };
