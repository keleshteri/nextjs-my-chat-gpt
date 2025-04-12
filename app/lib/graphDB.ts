import { Driver } from 'neo4j-driver';
import neo4j from 'neo4j-driver';
import { VectorDoc } from '@datastax/astra-db-ts';
import { getEmbedding } from './embeddings';

// Define interfaces for graph nodes and relationships
export interface GraphNode {
  id: string;
  content: string;
  embedding: number[];
}

export interface GraphRelationship {
  from: string;
  to: string;
  type: string;
}

export interface KnowledgeNode {
  id: string;
  content: string;
  type: string;
  embedding: number[];
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
  weight: number;
}

// Constants for Neo4j queries
const ADD_NODE = `
  CREATE (n:Node {id: $id, content: $content, embedding: $embedding})
  RETURN n
`;

// We'll construct this dynamically to handle relationship types
const ADD_RELATIONSHIP_BASE = `
  MATCH (from:Node {id: $fromId})
  MATCH (to:Node {id: $toId})
  CREATE (from)-[r:%s]->(to)
  RETURN r
`;

const FIND_RELATED = `
  MATCH (n:Node {id: $id})-[r]->(related:Node)
  RETURN related
  LIMIT $limit
`;

const FIND_SIMILAR = `
  MATCH (n:Node)
  WHERE n.id <> $id
  WITH n, gds.similarity.cosine(n.embedding, $embedding) AS similarity
  ORDER BY similarity DESC
  LIMIT $limit
  RETURN n
`;

export class GraphKnowledgeBase {
  private driver: Driver;

  constructor(uri: string, username: string, password: string) {
    this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  }

  async addNode(node: KnowledgeNode): Promise<GraphNode> {
    const session = this.driver.session();
    try {
      const graphNode: GraphNode = {
        id: node.id,
        content: node.content,
        embedding: node.embedding
      };
      
      await session.run(ADD_NODE, graphNode);
      return graphNode;
    } finally {
      await session.close();
    }
  }

  async addRelationship(relationship: Relationship): Promise<GraphRelationship> {
    const session = this.driver.session();
    try {
      // Sanitize the relationship type to be valid in Cypher
      const safeType = relationship.type.replace(/[^A-Za-z0-9_]/g, '_').toUpperCase();
      
      // Construct the query with the relationship type directly in the query
      const query = ADD_RELATIONSHIP_BASE.replace('%s', safeType);
      
      const graphRelationship: GraphRelationship = {
        from: relationship.source,
        to: relationship.target,
        type: safeType
      };
      
      await session.run(query, {
        fromId: graphRelationship.from,
        toId: graphRelationship.to
      });
      
      return graphRelationship;
    } finally {
      await session.close();
    }
  }

  async findRelatedNodes(id: string, limit: number = 5): Promise<GraphNode[]> {
    const session = this.driver.session();
    try {
      const result = await session.run(FIND_RELATED, { id, limit });
      return result.records.map(record => record.get('related').properties as GraphNode);
    } finally {
      await session.close();
    }
  }

  async findSimilarNodes(content: string, limit: number = 5): Promise<GraphNode[]> {
    const session = this.driver.session();
    try {
      const embedding = await getEmbedding(content);
      const result = await session.run(FIND_SIMILAR, { 
        embedding,
        limit
      });
      return result.records.map(record => record.get('n').properties as GraphNode);
    } finally {
      await session.close();
    }
  }

  async close() {
    await this.driver.close();
  }
} 