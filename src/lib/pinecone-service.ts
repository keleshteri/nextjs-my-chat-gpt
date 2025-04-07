import { pinecone, pineconeIndex } from './pinecone';
import { openai } from './openai';
import { documentService, embeddingService } from './db/supabase-service';

// Function to generate embeddings using OpenAI
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
  });
  
  return response.data[0].embedding;
}

// Function to upsert embeddings to Pinecone
export async function upsertEmbeddings(
  vectors: { id: string; values: number[]; metadata?: Record<string, any> }[]
) {
  try {
    const upsertResponse = await pineconeIndex.upsert(vectors);
    return upsertResponse;
  } catch (error) {
    console.error('Error upserting embeddings to Pinecone:', error);
    throw error;
  }
}

// Function to query embeddings from Pinecone
export async function queryEmbeddings(
  vector: number[],
  topK: number = 5,
  filter?: Record<string, any>
) {
  try {
    const queryResponse = await pineconeIndex.query({
      vector,
      topK,
      includeMetadata: true,
      ...(filter && { filter }),
    });
    
    return queryResponse.matches || [];
  } catch (error) {
    console.error('Error querying embeddings from Pinecone:', error);
    throw error;
  }
}

// Function to delete embeddings from Pinecone
export async function deleteEmbeddings(ids: string[]) {
  try {
    const deleteResponse = await pineconeIndex.deleteMany(ids);
    return deleteResponse;
  } catch (error) {
    console.error('Error deleting embeddings from Pinecone:', error);
    throw error;
  }
}

// Function to process a document and store its embedding
export async function processDocument(
  documentId: string,
  content: string,
  metadata?: Record<string, any>
) {
  try {
    // Generate embedding
    const embedding = await generateEmbedding(content);
    
    // Create embedding record in Supabase
    const embeddingRecord = await embeddingService.createEmbedding({
      document_id: documentId,
      vector: embedding,
      metadata,
    });
    
    // Upsert to Pinecone
    await upsertEmbeddings([
      {
        id: embeddingRecord.id,
        values: embedding,
        metadata: {
          document_id: documentId,
          ...metadata,
        },
      },
    ]);
    
    // Update document with embedding ID
    await documentService.updateDocument(documentId, {
      embedding_id: embeddingRecord.id,
    });
    
    return embeddingRecord;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}

// Function to search for similar documents
export async function searchSimilarDocuments(
  query: string,
  userId: string,
  topK: number = 5
) {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Query Pinecone with user filter
    const matches = await queryEmbeddings(queryEmbedding, topK, {
      user_id: userId,
    });
    
    // Get document IDs from matches
    const documentIds = matches
      .map(match => match.metadata?.document_id as string)
      .filter((id): id is string => typeof id === 'string');
    
    // Fetch documents from Supabase
    const documents = await Promise.all(
      documentIds.map(id => documentService.getDocument(id))
    );
    
    return {
      documents,
      scores: matches.map(match => match.score),
    };
  } catch (error) {
    console.error('Error searching similar documents:', error);
    throw error;
  }
} 