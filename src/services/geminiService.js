// src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load API key from environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('⚠️ No Gemini API key found in VITE_GEMINI_API_KEY');
}

// Initialize the Gemini API client once
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate a professional legal document in plain text
 */
export const generateLegalDocument = async (documentData) => {
  try {
    let prompt = `
Please draft the following document as plain text without any markdown, asterisks, or bullet characters.
Use numbered section headings and formal legal formatting.

Generate a professional ${documentData.subType}:

Document Type: ${documentData.subType}
Jurisdiction: ${documentData.jurisdiction}
Primary Party: ${documentData.fullName}
${documentData.counterparty ? `Counterparty: ${documentData.counterparty}` : ''}

Requirements:
${documentData.details}
`;
    if (documentData.previousDocuments) {
      prompt += `
Previous Documents / Context:
${documentData.previousDocuments}
`;
    }
    prompt += `
Ensure the document follows standard conventions, includes numbered sections, and is styled as an official legal agreement.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return await response.text();
  } catch (error) {
    console.error('Error generating legal document:', error);
    throw new Error('Failed to generate legal document. Please try again later.');
  }
};

/**
 * Analyze a legal document for potential issues and recommendations
 */
export const analyzeLegalDocument = async (documentText, documentData) => {
  try {
    const prompt = `
As a legal expert, analyze this ${documentData.subType} under ${documentData.jurisdiction} jurisdiction.

Document:
${documentText.substring(0, 8000)}${documentText.length > 8000 ? '... [truncated]' : ''}

Provide a structured analysis with:
1. Compliance Score (0-100)
2. Key Risks (severity: low/medium/high)
3. Recommendations
4. Relevant Legal References

Return a JSON object: { complianceScore, risks, recommendations, relevantCases }
`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = await response.text();
    try {
      return JSON.parse(raw);
    } catch {
      console.warn('Analysis response not valid JSON, using fallback');
      return {
        complianceScore: 80,
        risks: [ { severity: 'medium', description: 'Review by a legal professional recommended.' } ],
        recommendations: ['Have the document reviewed by legal counsel.'],
        relevantCases: [ { name: 'General precedent', relevance: 'Standard legal framework.' } ]
      };
    }
  } catch (error) {
    console.error('Error analyzing legal document:', error);
    return { complianceScore: 0, risks: [], recommendations: [], relevantCases: [] };
  }
};

/**
 * Find relevant legal references based on document type and jurisdiction
 */
export const findRelevantLegalReferences = async (documentText, documentData) => {
  try {
    const prompt = `
As a legal expert, analyze this ${documentData.subType} under ${documentData.jurisdiction} and provide specific legal references.

Document Type: ${documentData.subType}
Jurisdiction: ${documentData.jurisdiction}
Document Content:
${documentText.substring(0, 8000)}${documentText.length > 8000 ? '... [truncated]' : ''}

Provide a detailed analysis of relevant legal references including:
1. Specific statutes and sections
2. Relevant case law
3. Regulatory guidelines
4. Industry standards

Format the response as a JSON array of objects with the following structure:
[
  {
    "type": "statute/case/regulation/standard",
    "name": "Name of the reference",
    "description": "Detailed explanation of relevance",
    "applicability": "How it applies to this document"
  }
]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = await response.text();
    
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      console.warn('References response not valid JSON, using fallback');
      return [{
        type: 'statute',
        name: 'General Legal Framework',
        description: 'Standard legal framework for this document type.',
        applicability: 'Provides the basic legal structure for this type of document.'
      }];
    }
  } catch (error) {
    console.error('Error finding legal references:', error);
    return [];
  }
};

/**
 * Extract and summarize key clauses from a legal document
 */
export const extractKeyClauses = async (documentText) => {
  try {
    const prompt = `
Extract and summarize the 5 most important clauses from this document:

${documentText.substring(0, 8000)}${documentText.length > 8000 ? '... [truncated]' : ''}

Return JSON array: [{ title, summary, importance }].
`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = await response.text();
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : data.clauses || [];
    } catch {
      console.warn('Clauses response not valid JSON, using fallback');
      return [ { title: 'Key Terms', summary: 'Defines core obligations of the parties.', importance: 'High' } ];
    }
  } catch (error) {
    console.error('Error extracting key clauses:', error);
    return [];
  }
};

/**
 * Provide user guidance: rights & next steps tailored to the specific document
 */
export const provideNextSteps = async (documentText, documentData) => {
  try {
    const prompt = `
As a legal expert, analyze this ${documentData.subType} and provide specific next steps and relevant case references.

Document Type: ${documentData.subType}
Jurisdiction: ${documentData.jurisdiction}
Parties:
- Primary: ${documentData.fullName}
- Counterparty: ${documentData.counterparty || 'N/A'}

Document Content:
${documentText.substring(0, 8000)}${documentText.length > 8000 ? '... [truncated]' : ''}

Provide a detailed list of next steps that should be taken, including:
1. Immediate actions required
2. Legal procedures to follow
3. Documentation needed
4. Timeline considerations
5. Potential risks to address
6. Relevant case references with external links

Format the response as a JSON array of objects with the following structure:
[
  {
    "step": "Numbered step",
    "action": "Specific action to take",
    "timeline": "When to take this action",
    "importance": "high/medium/low",
    "details": "Additional context or explanation",
    "relatedCases": [
      {
        "title": "Case title",
        "description": "Brief description of the case",
        "url": "Link to case record or documentation",
        "relevance": "How this case relates to the current document"
      }
    ]
  }
]

For relatedCases, include actual URLs to:
- Court records
- Legal databases
- Government websites
- Legal news articles
- Academic papers
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = await response.text();
    
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      console.warn('Next steps response not valid JSON, using fallback');
      return [{
        step: 1,
        action: 'Review the document thoroughly',
        timeline: 'Immediately',
        importance: 'high',
        details: 'Ensure all terms and conditions align with your requirements.',
        relatedCases: [{
          title: 'Sample Case Reference',
          description: 'A similar case in this jurisdiction',
          url: 'https://example.com/legal-database',
          relevance: 'Similar legal principles and outcomes'
        }]
      }];
    }
  } catch (error) {
    console.error('Error providing next steps:', error);
    return [];
  }
};

export default {
  generateLegalDocument,
  analyzeLegalDocument,
  findRelevantLegalReferences,
  extractKeyClauses,
  provideNextSteps
};
