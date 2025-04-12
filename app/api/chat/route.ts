import { Configuration, OpenAIApi } from 'openai-edge';
import { GraphKnowledgeBase } from '@/app/lib/graphDB';

const {
    NEO4J_URI,
    NEO4J_USER,
    NEO4J_PASSWORD,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
} = process.env;

const config = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Initialize GraphRAG knowledge base
const graphKB = new GraphKnowledgeBase(
    NEO4J_URI!,
    NEO4J_USER!,
    NEO4J_PASSWORD!,
    ASTRA_DB_APPLICATION_TOKEN!
);

export async function POST(req: Request) {
    try {
        console.log("[API] Chat endpoint called");
        const { messages } = await req.json();
        console.log("[API] Received messages:", JSON.stringify(messages));

        const lastUserMessage = messages[messages.length - 1]?.content;
        console.log("[API] Last user message:", lastUserMessage);

        // Get embeddings for the user message
        console.log("[API] Fetching embeddings for user message");
        const embedResponse = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "text-embedding-3-small",
                input: lastUserMessage,
                encoding_format: "float",
            })
        });
        
        const embedData = await embedResponse.json();
        console.log("[API] Embeddings API response status:", embedResponse.status);
        
        // Get context using GraphRAG
        let graphContext = '';
        try {
            console.log("[API] Retrieving graph-based context");
            graphContext = await graphKB.getGraphContext(
                lastUserMessage,
                embedData.data[0].embedding
            );
            console.log("[API] Retrieved graph context");
        } catch (error) {
            console.error("[API] Error retrieving graph context:", error);
            graphContext = "";
        }

        const template = {
            role: "system",
            content: `
            You are a helpful assistant that can answer questions using graph-based knowledge retrieval.
            The context below includes both directly relevant information and related concepts from the knowledge graph.
            
            START CONTEXT
            ${graphContext}
            END CONTEXT
            -----
            Question: ${lastUserMessage}
            -----
            
            When answering:
            1. Use information from both directly relevant nodes and their connected concepts
            2. If you reference related concepts, explain how they connect to the main topic
            3. If the context is insufficient, say so and answer based on your general knowledge
            `
        };

        console.log("[API] Sending request to OpenAI");
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            stream: false,
            messages: [template, ...messages],
        });
        
        const responseData = await response.json();
        console.log("[API] Received response from OpenAI:", 
                    responseData.choices ? 
                    responseData.choices[0].message.content.substring(0, 50) + "..." : 
                    "No choices in response");
        
        return new Response(
            JSON.stringify({
                role: "assistant",
                content: responseData.choices[0].message.content
            }),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {
        console.error("[API] Error in chat route:", error);
        return new Response(JSON.stringify({ error: "An error occurred processing your request" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
