-- Second Brain Database Schema
-- Run: psql -d second_brain -f migrations/001_initial_schema.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- ===== Users =====
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ===== Sessions (Recordings) =====
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  raw_transcript TEXT,
  mode VARCHAR(50) DEFAULT 'listen',  -- 'listen', 'talk', 'text-capture'
  duration VARCHAR(20),
  source TEXT,                          -- URL source for text captures
  audio_url TEXT,                       -- S3/blob URL for audio file
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_created ON sessions(created_at DESC);

-- ===== Structured Notes =====
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  title VARCHAR(255),
  summary TEXT,
  raw_transcript TEXT,
  key_topics JSONB DEFAULT '[]',
  action_items JSONB DEFAULT '[]',
  decisions JSONB DEFAULT '[]',
  questions JSONB DEFAULT '[]',
  people JSONB DEFAULT '[]',
  ideas JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  sentiment VARCHAR(20) DEFAULT 'neutral',
  importance VARCHAR(20) DEFAULT 'medium',
  follow_ups JSONB DEFAULT '[]',
  embedding vector(1536),              -- For semantic search (OpenAI embedding size)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notes_user ON notes(user_id);
CREATE INDEX idx_notes_session ON notes(session_id);
CREATE INDEX idx_notes_created ON notes(created_at DESC);
CREATE INDEX idx_notes_tags ON notes USING gin(tags);
CREATE INDEX idx_notes_people ON notes USING gin(people);
CREATE INDEX idx_notes_fulltext ON notes USING gin(
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '') || ' ' || COALESCE(raw_transcript, ''))
);

-- ===== Chat History =====
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,            -- 'user' or 'assistant'
  content TEXT NOT NULL,
  context_notes JSONB DEFAULT '[]',     -- IDs of notes used for context
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_user ON chat_history(user_id);
CREATE INDEX idx_chat_created ON chat_history(created_at DESC);

-- ===== Knowledge Graph Entities =====
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,            -- 'person', 'topic', 'project', 'place'
  name VARCHAR(255) NOT NULL,
  metadata JSONB DEFAULT '{}',
  mention_count INTEGER DEFAULT 1,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_entities_user ON entities(user_id);
CREATE INDEX idx_entities_type ON entities(type);
CREATE UNIQUE INDEX idx_entities_unique ON entities(user_id, type, name);

-- ===== Entity-Note Relationships =====
CREATE TABLE IF NOT EXISTS entity_notes (
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  PRIMARY KEY (entity_id, note_id)
);

-- ===== Updated At Trigger =====
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sessions_timestamp BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_notes_timestamp BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
