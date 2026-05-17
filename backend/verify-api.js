require('dotenv').config({ path: 'C:/VoteNavigator/backend/.env', override: true });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testConnection() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  console.log('Testing key ending in:', apiKey.slice(-4));
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log('Sending test prompt...');
    const result = await model.generateContent("What is VoteNavigator?");
    const response = await result.response;
    console.log('\n--- SUCCESS ---');
    console.log('Gemini Response:', response.text());
  } catch (error) {
    console.error('\n--- FAILED ---');
    console.error('Error Message:', error.message);
    if (error.status) console.error('HTTP Status:', error.status);
    console.error('\nPossible Causes:');
    console.error('1. The key in .env is still invalid.');
    console.error('2. "Generative Language API" is not enabled in your GCP project.');
    console.error('3. You have exceeded your quota or billing is not set up.');
  }
}

testConnection();
