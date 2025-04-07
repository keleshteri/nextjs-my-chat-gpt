-- Create embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  vector VECTOR(1536), -- OpenAI embeddings are 1536 dimensions
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read embeddings from their documents
CREATE POLICY "Users can read embeddings from their documents" ON embeddings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = embeddings.document_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create policy to allow users to insert embeddings to their documents
CREATE POLICY "Users can insert embeddings to their documents" ON embeddings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = embeddings.document_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create policy to allow users to update embeddings from their documents
CREATE POLICY "Users can update embeddings from their documents" ON embeddings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = embeddings.document_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create policy to allow users to delete embeddings from their documents
CREATE POLICY "Users can delete embeddings from their documents" ON embeddings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = embeddings.document_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create index on document_id for faster lookups
CREATE INDEX IF NOT EXISTS embeddings_document_id_idx ON embeddings (document_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_embeddings_updated_at
BEFORE UPDATE ON embeddings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 