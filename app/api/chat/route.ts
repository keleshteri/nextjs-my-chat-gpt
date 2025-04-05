import { Configuration, OpenAIApi } from 'openai-edge';
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
} = process.env;

const config = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const dataClient = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = dataClient.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
    try {
        console.log("[API] Chat endpoint called");
        const { messages } = await req.json();
        console.log("[API] Received messages:", JSON.stringify(messages));

        const lastUserMessage = messages[messages.length - 1]?.content;
        console.log("[API] Last user message:", lastUserMessage);

        let docContext = '';

        // Using standard OpenAI for embeddings
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
        
        try {
            console.log("[API] Querying database for relevant documents");
            const collection = await db.collection(ASTRA_DB_COLLECTION);
            const cursor = collection.find(null, {
                sort: { $vector: embedData.data[0].embedding }, limit: 10
            });

            const documents = await cursor.toArray();
            const docsMap = documents?.map((doc) => doc.text)
            docContext = JSON.stringify(docsMap);
            console.log("[API] Found context documents:", documents?.length || 0);

        } catch (error) {
            console.error("[API] Error in database query:", error);
            docContext = "";
        }

        const template = {
            role: "system",
            content: `
            You are a helpful assistant that can answer questions about the following documents:
            START CONTEXT
            ${docContext}
            END CONTEXT
            -----
            Question: ${lastUserMessage}
            -----
            `
        }

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
        
        // Create a message in the format that the AI package expects
        const responseMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: responseData.choices[0].message.content,
        };
        
        console.log("[API] Formatted response message:", JSON.stringify(responseMessage));
        
        // Implement a custom response that returns the message directly
        // This bypasses the streaming format which seems to be causing issues
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
