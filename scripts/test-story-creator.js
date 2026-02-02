#!/usr/bin/env node

/**
 * Test script for Story Creator tool
 * Usage: node scripts/test-story-creator.js
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(__dirname, '../.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.warn('⚠️  No .env.local file found');
  }
}

loadEnv();

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Test configuration
const TEST_CONFIG = {
  variant: 'general',
  language: 'english', // english, russian, arabic
  model: 'arcee-ai/trinity-mini:free',
  inputs: {
    topic: 'compare from life at the past and now 2026 and 70s time ',
    tone: 'sad',
    length: 'short',
  },
};

// Language code mapping
const LANGUAGE_MAP = {
  english: 'en',
  russian: 'ru',
  arabic: 'ar',
};

async function loadPrompt(variant, language) {
  const langCode = LANGUAGE_MAP[language];
  const promptPath = join(__dirname, '../prompts/story', variant, `${langCode}.md`);
  
  console.log(`📄 Loading prompt: ${promptPath}\n`);
  
  try {
    return readFileSync(promptPath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to load prompt file: ${promptPath}`);
  }
}

function replacePlaceholders(template, values) {
  let result = template;
  
  for (const [key, value] of Object.entries(values)) {
    const placeholder = `{{${key}}}`;
    result = result.replaceAll(placeholder, value);
  }
  
  return result;
}

async function generateStory() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENROUTER_API_KEY not found in .env.local');
    process.exit(1);
  }
  
  console.log('🚀 Story Creator Test\n');
  console.log('=' .repeat(80));
  console.log('\n📋 Test Configuration:');
  console.log(`   Variant: ${TEST_CONFIG.variant}`);
  console.log(`   Language: ${TEST_CONFIG.language}`);
  console.log(`   Model: ${TEST_CONFIG.model}`);
  console.log(`   Topic: ${TEST_CONFIG.inputs.topic}`);
  console.log(`   Tone: ${TEST_CONFIG.inputs.tone}`);
  console.log(`   Length: ${TEST_CONFIG.inputs.length}`);
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Load and process prompt
  const promptTemplate = await loadPrompt(TEST_CONFIG.variant, TEST_CONFIG.language);
  const systemPrompt = replacePlaceholders(promptTemplate, TEST_CONFIG.inputs);
  
  console.log('📝 System Prompt (as LLM receives it):');
  console.log('─'.repeat(80));
  console.log(systemPrompt);
  console.log('─'.repeat(80) + '\n');
  
  // Prepare API request
  const requestBody = {
    model: TEST_CONFIG.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Create the story now.` },
    ],
    max_tokens: 1500,
    temperature: 0.8,
  };
  
  console.log('🔄 Sending request to OpenRouter...\n');
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Tools Platform',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Response received!\n');
    console.log('='.repeat(80));
    console.log('📖 Generated Story:');
    console.log('='.repeat(80) + '\n');
    console.log(data.choices[0].message.content);
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Display metadata
    console.log('📊 Metadata:');
    console.log(`   Model used: ${data.model || TEST_CONFIG.model}`);
    console.log(`   Tokens used: ${data.usage?.total_tokens || 'N/A'}`);
    console.log(`   Prompt tokens: ${data.usage?.prompt_tokens || 'N/A'}`);
    console.log(`   Completion tokens: ${data.usage?.completion_tokens || 'N/A'}`);
    console.log('\n✨ Test completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the test
generateStory();
