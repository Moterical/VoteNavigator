const { VertexAI } = require('@google-cloud/vertexai');
require('dotenv').config();

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
});

const model = 'gemini-1.5-flash';

// System prompt that defines the persona and rules
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

const generativeModel = vertexAI.getGenerativeModel({
  model: model,
  systemInstruction: SYSTEM_PROMPT,
});

/**
 * Main chat function
 * @param {string} userMessage 
 * @param {Array} contextRows - Facts from knowledge_base/FAQs
 */
async function getChatResponse(userMessage, contextRows = []) {
  try {
    // Format database context for the AI
    const contextString = contextRows.length > 0 
      ? "REFENCE FACTS FROM DATABASE:\n" + contextRows.map(r => `- ${r.title || r.question}: ${r.full_explanation || r.answer}`).join("\n")
      : "No specific database matches found. Use your general knowledge but stay within ECI boundaries.";

    const prompt = `
CONTEXT:
${contextString}

USER QUESTION:
${userMessage}
    `;

    const request = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };

    const result = await generativeModel.generateContent(request);
    const response = result.response;
    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw new Error('Failed to generate response from AI');
  }
}

module.exports = { getChatResponse };
