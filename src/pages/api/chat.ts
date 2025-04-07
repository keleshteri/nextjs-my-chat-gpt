import type { NextApiRequest, NextApiResponse } from 'next';

type ChatResponse = {
  message: string;
  timestamp: string;
};

// Simple response templates for demonstration
const RESPONSES = [
  "I understand your question about \"{message}\". Let me help you with that.",
  "That's an interesting point about \"{message}\". Here's what I think...",
  "I'm processing your request about \"{message}\". Here's my response.",
  "Thanks for asking about \"{message}\". I'd be happy to assist you.",
  "I've analyzed your query regarding \"{message}\". Here's what I found.",
  "Your question about \"{message}\" is important. Let me address it.",
  "I'm here to help with your inquiry about \"{message}\". Here's my answer.",
  "I've received your message about \"{message}\". Here's my response.",
  "I understand you're interested in \"{message}\". Let me provide some information.",
  "Your request about \"{message}\" has been processed. Here's what I can tell you."
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', timestamp: new Date().toISOString() });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required', timestamp: new Date().toISOString() });
    }

    // Generate a more realistic response
    const randomIndex = Math.floor(Math.random() * RESPONSES.length);
    const responseTemplate = RESPONSES[randomIndex];
    const responseMessage = responseTemplate.replace('{message}', message);
    
    // Add some additional context to make it more realistic
    const additionalContext = [
      "\n\nIn a real implementation, this would be connected to an AI model like GPT-4 or Claude.",
      "\n\nThis is a placeholder response. In a production environment, this would be connected to a real AI service.",
      "\n\nThis response is generated from a template. In the future, this will be replaced with actual AI-generated content.",
      "\n\nThis is a simulated response. The actual implementation would use an AI model to generate personalized answers."
    ];
    
    const randomContextIndex = Math.floor(Math.random() * additionalContext.length);
    const finalResponse = responseMessage + additionalContext[randomContextIndex];

    const response = {
      message: finalResponse,
      timestamp: new Date().toISOString(),
    };

    // Simulate a delay to mimic API latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return res.status(500).json({ 
      message: 'An error occurred while processing your request', 
      timestamp: new Date().toISOString() 
    });
  }
} 