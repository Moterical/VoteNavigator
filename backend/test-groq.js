require('dotenv').config({ path: 'C:/VoteNavigator/backend/.env', override: true });
const Groq = require('groq-sdk');

async function testGroq() {
  console.log('--- TESTING GROQ (LLAMA 3) ---');
  
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ Error: GROQ_API_KEY is missing from your .env file.');
    return;
  }

  try {
    const groq = new Groq();
    console.log('API Key detected. Sending test prompt to Llama 3 (70B)...');
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "Ready to vote" if you can read this.' }],
      model: 'llama-3.3-70b-versatile',
    });

    console.log('\n✅ SUCCESS!');
    console.log('Response:', chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error('\n❌ FAILED');
    console.error(error.message);
  }
}

testGroq();
