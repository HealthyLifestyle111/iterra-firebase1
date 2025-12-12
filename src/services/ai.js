/**
 * AI Service - Replaces Base44 AI/LLM integrations
 * Uses Firebase Functions to call external AI APIs (OpenAI, etc.)
 */

import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

/**
 * Invoke LLM (Large Language Model)
 * Replaces Base44's InvokeLLM integration
 * 
 * @param {Object} params
 * @param {string} params.prompt - The prompt to send to the LLM
 * @param {string} params.model - Model to use (default: 'gpt-4')
 * @param {number} params.temperature - Temperature (0-1, default: 0.7)
 * @param {number} params.maxTokens - Max tokens in response (default: 500)
 * @returns {Promise<{response: string, usage: Object}>}
 */
export async function invokeLLM({ prompt, model = 'gpt-4', temperature = 0.7, maxTokens = 500 }) {
  const invokeLLMFunction = httpsCallable(functions, 'invokeLLM');
  
  try {
    const result = await invokeLLMFunction({
      prompt,
      model,
      temperature,
      maxTokens
    });
    
    return result.data;
  } catch (error) {
    console.error('Error invoking LLM:', error);
    throw new Error('Failed to invoke LLM: ' + error.message);
  }
}

/**
 * Generate Image
 * Replaces Base44's GenerateImage integration
 * 
 * @param {Object} params
 * @param {string} params.prompt - Image description prompt
 * @param {string} params.size - Image size (e.g., '1024x1024')
 * @param {number} params.n - Number of images (default: 1)
 * @returns {Promise<{images: Array<{url: string}>}>}
 */
export async function generateImage({ prompt, size = '1024x1024', n = 1 }) {
  const generateImageFunction = httpsCallable(functions, 'generateImage');
  
  try {
    const result = await generateImageFunction({
      prompt,
      size,
      n
    });
    
    return result.data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image: ' + error.message);
  }
}

/**
 * Extract data from uploaded file (OCR/Document AI)
 * Replaces Base44's ExtractDataFromUploadedFile integration
 * 
 * @param {string} fileUrl - URL of the uploaded file in Firebase Storage
 * @param {string} type - Type of extraction ('text', 'form', 'table', 'all')
 * @returns {Promise<{text: string, data: Object}>}
 */
export async function extractDataFromFile(fileUrl, type = 'text') {
  const extractDataFunction = httpsCallable(functions, 'extractData');
  
  try {
    const result = await extractDataFunction({
      fileUrl,
      type
    });
    
    return result.data;
  } catch (error) {
    console.error('Error extracting data from file:', error);
    throw new Error('Failed to extract data: ' + error.message);
  }
}

/**
 * Analyze wellness intake responses using AI
 * Custom function for iTerra Wellness Platform
 * 
 * @param {Object} responses - Wellness intake form responses
 * @returns {Promise<{analysis: string, recommendations: Array}>}
 */
export async function analyzeWellnessIntake(responses) {
  const prompt = `As a wellness expert, analyze these intake responses and provide personalized recommendations:\n\n${JSON.stringify(responses, null, 2)}\n\nProvide:\n1. Overall wellness assessment\n2. Top 3 recommendations\n3. Suggested essential oils or products`;
  
  const result = await invokeLLM({
    prompt,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000
  });
  
  return {
    analysis: result.response,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate manifestation guidance using AI
 * 
 * @param {Object} manifestation - Manifestation goal and context
 * @returns {Promise<{guidance: string, actionSteps: Array}>}
 */
export async function generateManifestationGuidance(manifestation) {
  const prompt = `Create a manifestation guide for this goal: "${manifestation.goal}"\n\nContext: ${manifestation.context || 'None provided'}\n\nProvide:\n1. Visualization technique\n2. Affirmations (3-5)\n3. Action steps (3-5 concrete actions)\n4. Timeline suggestions`;
  
  const result = await invokeLLM({
    prompt,
    model: 'gpt-4',
    temperature: 0.8,
    maxTokens: 800
  });
  
  return {
    guidance: result.response,
    timestamp: new Date().toISOString()
  };
}

export default {
  invokeLLM,
  generateImage,
  extractDataFromFile,
  analyzeWellnessIntake,
  generateManifestationGuidance
};
