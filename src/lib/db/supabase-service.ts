import { supabase } from '../supabase';
import { User, Chat, Message, Document, Embedding } from './models/types';

// User operations
export const userService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data as User;
  },
  
  async createUser(userData: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  },
  
  async updateUser(id: string, userData: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  }
};

// Chat operations
export const chatService = {
  async getChats(userId: string) {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Chat[];
  },
  
  async getChat(id: string) {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Chat;
  },
  
  async createChat(chatData: Partial<Chat>) {
    const { data, error } = await supabase
      .from('chats')
      .insert(chatData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Chat;
  },
  
  async updateChat(id: string, chatData: Partial<Chat>) {
    const { data, error } = await supabase
      .from('chats')
      .update(chatData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Chat;
  },
  
  async deleteChat(id: string) {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Message operations
export const messageService = {
  async getMessages(chatId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as Message[];
  },
  
  async createMessage(messageData: Partial<Message>) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Message;
  },
  
  async updateMessage(id: string, messageData: Partial<Message>) {
    const { data, error } = await supabase
      .from('messages')
      .update(messageData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Message;
  },
  
  async deleteMessage(id: string) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Document operations
export const documentService = {
  async getDocuments(userId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Document[];
  },
  
  async getDocument(id: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Document;
  },
  
  async createDocument(documentData: Partial<Document>) {
    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Document;
  },
  
  async updateDocument(id: string, documentData: Partial<Document>) {
    const { data, error } = await supabase
      .from('documents')
      .update(documentData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Document;
  },
  
  async deleteDocument(id: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Embedding operations
export const embeddingService = {
  async getEmbedding(id: string) {
    const { data, error } = await supabase
      .from('embeddings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Embedding;
  },
  
  async createEmbedding(embeddingData: Partial<Embedding>) {
    const { data, error } = await supabase
      .from('embeddings')
      .insert(embeddingData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Embedding;
  },
  
  async updateEmbedding(id: string, embeddingData: Partial<Embedding>) {
    const { data, error } = await supabase
      .from('embeddings')
      .update(embeddingData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Embedding;
  },
  
  async deleteEmbedding(id: string) {
    const { error } = await supabase
      .from('embeddings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}; 