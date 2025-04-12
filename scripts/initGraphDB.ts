import { config } from 'dotenv';
import "dotenv/config";
import { GraphKnowledgeBase, KnowledgeNode, Relationship } from '../app/lib/graphDB';
import { getEmbedding } from '../app/lib/embeddings';

// Load environment variables
config();

const {
    NEO4J_URI,
    NEO4J_USER,
    NEO4J_PASSWORD,
    OPENAI_API_KEY,
} = process.env;

// Validate required environment variables
const requiredEnvVars = [
    'NEO4J_URI',
    'NEO4J_USER',
    'NEO4J_PASSWORD',
    'OPENAI_API_KEY'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

async function initializeGraph() {
    console.log('Initializing graph database...');
    
    const graphKB = new GraphKnowledgeBase(
        NEO4J_URI!,
        NEO4J_USER!,
        NEO4J_PASSWORD!
    );

    // Sample knowledge nodes
    const sampleNodes: KnowledgeNode[] = [
        {
            id: '1',
            content: 'GraphRAG combines graph-based knowledge representation with retrieval-augmented generation.',
            type: 'concept',
            embedding: await getEmbedding('GraphRAG combines graph-based knowledge representation with retrieval-augmented generation')
        },
        {
            id: '2',
            content: 'Vector embeddings enable semantic similarity search in high-dimensional space.',
            type: 'concept',
            embedding: await getEmbedding('Vector embeddings enable semantic similarity search in high-dimensional space')
        },
        {
            id: '3',
            content: 'Knowledge graphs represent information as interconnected entities and relationships.',
            type: 'concept',
            embedding: await getEmbedding('Knowledge graphs represent information as interconnected entities and relationships')
        }
    ];

    // Add nodes to the graph
    console.log('Adding nodes to the graph...');
    for (const node of sampleNodes) {
        try {
            await graphKB.addNode(node);
            console.log(`✓ Added node: ${node.id}`);
        } catch (error) {
            console.error(`✗ Failed to add node ${node.id}:`, error);
        }
    }

    // Define relationships between nodes
    const relationships: Relationship[] = [
        {
            source: '1',
            target: '2',
            type: 'USES',
            weight: 0.8
        },
        {
            source: '1',
            target: '3',
            type: 'INCORPORATES',
            weight: 0.9
        },
        {
            source: '2',
            target: '3',
            type: 'ENHANCES',
            weight: 0.7
        }
    ];

    // Add relationships to the graph
    console.log('\nAdding relationships to the graph...');
    for (const rel of relationships) {
        try {
            await graphKB.addRelationship(rel);
            console.log(`✓ Added relationship: ${rel.source} -[${rel.type}]-> ${rel.target}`);
        } catch (error) {
            console.error(`✗ Failed to add relationship ${rel.source} -> ${rel.target}:`, error);
        }
    }

    await graphKB.close();
    console.log('\n✓ Graph initialization complete!');
}

initializeGraph().catch(error => {
    console.error('Failed to initialize graph:', error);
    process.exit(1);
}); 