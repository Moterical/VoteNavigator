const voterService = require('../src/services/voterService');

async function test() {
  console.log('--- ECI Service Diagnostic ---');
  try {
    const result = await voterService.getCaptcha();
    console.log('Final Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('DIAGNOSTIC FAILED:', err.message);
  }
}

test();
