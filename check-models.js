// Script to check OpenAI model access
import { config } from 'dotenv';
import OpenAI from 'openai';

// Load environment variables from .env file
config();

// Get API key from environment
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('Error: OPENAI_API_KEY not found in environment variables');
  process.exit(1);
}

console.log('API Key found:', apiKey.substring(0, 10) + '...');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: apiKey
});

// Function to check models
async function checkModels() {
  try {
    console.log('Checking available OpenAI models...');
    
    // List available models
    const response = await openai.models.list();
    
    console.log('\nYou have access to the following models:');
    
    // Sort models by ID
    const sortedModels = response.data.sort((a, b) => a.id.localeCompare(b.id));
    
    // Display models
    sortedModels.forEach(model => {
      console.log(`- ${model.id}`);
    });
    
    // Check specifically for embedding model
    const hasEmbeddingModel = sortedModels.some(model => 
      model.id === 'text-embedding-ada-002');
    
    console.log('\nSpecific model checks:');
    console.log(`- text-embedding-ada-002 (needed for this project): ${hasEmbeddingModel ? '✅ Available' : '❌ Not available'}`);
    
    // Check for completion models
    const hasChatModel = sortedModels.some(model => 
      model.id.includes('gpt-3.5-turbo'));
    
    console.log(`- gpt-3.5-turbo models: ${hasChatModel ? '✅ Available' : '❌ Not available'}`);
    
  } catch (error) {
    console.error('Error checking models:');
    console.error(error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run the model check
checkModels(); 