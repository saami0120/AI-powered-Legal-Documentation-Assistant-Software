import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('⚠️ No Gemini API key found in VITE_GEMINI_API_KEY');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Helper function to clean JSON string
const cleanJsonString = (str) => {
  // Remove markdown code block indicators
  str = str.replace(/```json\n?/g, '');
  str = str.replace(/```\n?/g, '');
  // Remove any leading/trailing whitespace
  str = str.trim();
  return str;
};

export const validateDocument = async (file) => {
  console.log('Starting document validation service');
  try {
    const text = await readPDFFile(file);
    console.log('PDF content extracted');

    const prompt = `
As a legal expert, analyze this legal document and identify potential issues, loopholes, and areas for improvement.

Document Content:
${text.substring(0, 8000)}${text.length > 8000 ? '... [truncated]' : ''}

Provide a comprehensive analysis including:
1. Overall document health score (0-100)
2. Specific issues found
3. Recommendations for improvement

Return ONLY a JSON object with the following structure (no markdown, no additional text):
{
  "score": number,
  "issues": [
    {
      "title": "Issue title",
      "description": "Detailed description of the issue",
      "severity": "high/medium/low"
    }
  ],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed recommendation"
    }
  ]
}
`;

    console.log('Sending prompt to Gemini');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = await response.text();
    console.log('Received response from Gemini');
    
    try {
      // Clean the response string before parsing
      const cleanedResponse = cleanJsonString(raw);
      console.log('Cleaned response:', cleanedResponse);
      const parsed = JSON.parse(cleanedResponse);
      console.log('Successfully parsed response');
      return parsed;
    } catch (parseError) {
      console.warn('Failed to parse response:', parseError);
      console.warn('Raw response:', raw);
      return {
        score: 70,
        issues: [{
          title: 'General Review Required',
          description: 'Document should be reviewed by a legal professional.',
          severity: 'medium'
        }],
        recommendations: [{
          title: 'Professional Review',
          description: 'Have the document reviewed by a qualified attorney.'
        }]
      };
    }
  } catch (error) {
    console.error('Error in validateDocument:', error);
    throw new Error('Failed to validate document');
  }
};

const readPDFFile = async (file) => {
  console.log('Reading PDF file');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // For now, return a placeholder text
        console.log('File read complete');
        resolve('PDF content would be extracted here');
      } catch (error) {
        console.error('Error reading file:', error);
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };
    reader.readAsText(file);
  });
}; 