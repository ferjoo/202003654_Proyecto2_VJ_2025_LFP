const axios = require('axios');

async function testIntegration() {
  console.log('🧪 Testing Code Analyzer Integration...\n');

  // Test backend API
  console.log('1. Testing Backend API...');
  try {
    const testCode = `using System;

public class Program
{
    static void Main(string[] args)
    {
        int x = 10;
        Console.WriteLine(x);
    }
}`;

    const response = await axios.post('http://localhost:3000/analyze', testCode, {
      headers: { 'Content-Type': 'text/plain' }
    });

    console.log('✅ Backend API is working!');
    console.log(`   - Tokens found: ${response.data.tokens.length}`);
    console.log(`   - Lexical errors: ${response.data.errors.length}`);
    console.log(`   - Syntactic errors: ${response.data.syntacticErrors.length}`);
    console.log(`   - Transpiled code: ${response.data.traduction ? 'Generated' : 'None'}`);
  } catch (error) {
    console.log('❌ Backend API test failed:', error.message);
  }

  // Test frontend
  console.log('\n2. Testing Frontend...');
  try {
    const response = await axios.get('http://localhost:3001');
    if (response.status === 200) {
      console.log('✅ Frontend is running!');
      console.log('   - React app is accessible');
    }
  } catch (error) {
    console.log('❌ Frontend test failed:', error.message);
  }

  console.log('\n🎉 Integration test completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Open http://localhost:3001 in your browser');
  console.log('2. Enter some code in the editor');
  console.log('3. Click "Analyze Code" to test the full functionality');
}

testIntegration().catch(console.error); 