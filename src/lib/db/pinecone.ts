import { Pinecone } from "@pinecone-database/pinecone";


const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
    throw new Error('PINECONE_API_KEY environment variable not set');
}

const pinecone = new Pinecone({
    environment: 'gcp-starter',
    apiKey,
});


export const noteIndex = pinecone.Index('ai-note-app');