import { Pinecone } from '@pinecone-database/pinecone';

const pineconeApiKey = process.env.PINECONE_API_KEY || '';
const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT || '';
const pineconeIndex = process.env.PINECONE_INDEX || '';

export const pinecone = new Pinecone({
  apiKey: pineconeApiKey,
  environment: pineconeEnvironment,
});

export const pineconeIndex = pinecone.Index(pineconeIndex); 