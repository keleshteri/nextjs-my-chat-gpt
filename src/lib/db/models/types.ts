export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  metadata?: Record<string, any>;
  embedding_id?: string;
}

export interface Embedding {
  id: string;
  document_id: string;
  vector: number[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
} 