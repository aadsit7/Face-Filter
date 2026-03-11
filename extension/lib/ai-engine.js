/**
 * AI Engine Module - Handles note structuring and conversational queries
 * Supports Anthropic (Claude) and OpenAI APIs
 */

class AIEngine {
  constructor() {
    this.provider = 'anthropic'; // 'anthropic' or 'openai'
    this.apiKey = '';
    this.model = '';
  }

  /**
   * Configure the AI engine
   */
  configure(options = {}) {
    this.provider = options.provider || 'anthropic';
    this.apiKey = options.apiKey || '';
    this.model = options.model || this._getDefaultModel();
  }

  _getDefaultModel() {
    return this.provider === 'anthropic'
      ? 'claude-sonnet-4-20250514'
      : 'gpt-4o';
  }

  /**
   * Structure a raw transcript into organized notes
   * This is the core "second brain" intelligence
   */
  async structureTranscript(rawTranscript, metadata = {}) {
    const systemPrompt = `You are a personal knowledge assistant. Your job is to take raw voice transcripts and structure them into organized, searchable notes. Extract maximum value from every conversation.

Always respond in valid JSON format with this exact structure:
{
  "title": "A concise, descriptive title for this recording",
  "summary": "2-3 sentence summary of the key content",
  "keyTopics": ["topic1", "topic2"],
  "actionItems": ["Specific action item 1", "Specific action item 2"],
  "decisions": ["Decision that was made"],
  "questions": ["Unanswered question that came up"],
  "people": ["Person name mentioned"],
  "ideas": ["Interesting idea mentioned"],
  "tags": ["meeting", "brainstorm", etc.],
  "sentiment": "positive/neutral/negative",
  "importance": "high/medium/low",
  "followUps": ["Things to follow up on"]
}

Rules:
- Be thorough but concise
- Only include fields that have actual content from the transcript
- For empty arrays, use []
- Tags should be lowercase, single words or short phrases
- Action items should be specific and actionable
- Title should be max 60 characters`;

    const userPrompt = `Please structure this transcript into organized notes.

Recording context:
- Date: ${metadata.date || new Date().toLocaleDateString()}
- Duration: ${metadata.duration || 'Unknown'}
- Mode: ${metadata.mode || 'passive listen'}

Raw Transcript:
"""
${rawTranscript}
"""`;

    const response = await this._callAPI(systemPrompt, userPrompt);

    try {
      // Parse the JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (err) {
      console.error('Failed to parse structured note:', err);
      // Return a basic structure
      return {
        title: 'Untitled Recording',
        summary: rawTranscript.substring(0, 200),
        keyTopics: [],
        actionItems: [],
        decisions: [],
        questions: [],
        people: [],
        ideas: [],
        tags: ['unstructured'],
        sentiment: 'neutral',
        importance: 'medium',
        followUps: [],
      };
    }
  }

  /**
   * Chat with the knowledge base - answer questions using stored notes
   */
  async chat(userMessage, context = {}) {
    const systemPrompt = `You are Second Brain, a personal AI assistant that helps users recall and connect information from their captured notes and conversations.

You have access to the user's knowledge base context provided below. Use it to answer their questions accurately and helpfully.

Guidelines:
- Be conversational and natural
- Reference specific notes/recordings when relevant
- If you don't have enough context, say so honestly
- Suggest connections between different notes when you spot them
- Be concise but thorough
- If asked about something not in the notes, say you don't have that information captured yet

${context.notes ? `
User's Knowledge Base Context:
${context.notes}
` : 'The user has no notes captured yet.'}

${context.recentNotes ? `
Recent Notes:
${context.recentNotes}
` : ''}`;

    const response = await this._callAPI(systemPrompt, userMessage);
    return response;
  }

  /**
   * Generate a daily/weekly digest summary
   */
  async generateDigest(notes, period = 'daily') {
    const systemPrompt = `You are a personal knowledge assistant. Create a ${period} digest summary of the user's captured notes and conversations.

Format the digest as:
1. Overview (2-3 sentences)
2. Key Themes
3. Outstanding Action Items
4. Important Decisions
5. Open Questions
6. Notable Ideas

Be concise and actionable.`;

    const noteSummaries = notes.map(n =>
      `[${n.createdAt}] ${n.title}: ${n.summary}`
    ).join('\n');

    return this._callAPI(systemPrompt, `Here are the notes from this ${period} period:\n\n${noteSummaries}`);
  }

  /**
   * Semantic search - find relevant notes for a query
   */
  async findRelevantNotes(query, allNotes) {
    if (allNotes.length === 0) return [];

    // Simple keyword-based relevance scoring
    const queryWords = query.toLowerCase().split(/\s+/);

    const scored = allNotes.map(note => {
      const text = [
        note.title || '',
        note.summary || '',
        ...(note.tags || []),
        ...(note.keyTopics || []),
        ...(note.actionItems || []),
        note.rawTranscript || '',
      ].join(' ').toLowerCase();

      let score = 0;
      for (const word of queryWords) {
        if (word.length < 3) continue;
        const regex = new RegExp(word, 'gi');
        const matches = text.match(regex);
        if (matches) score += matches.length;
      }

      return { note, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.note);
  }

  // ===== API Communication =====

  async _callAPI(systemPrompt, userMessage) {
    if (!this.apiKey) {
      return 'Please configure your API key in Settings to enable AI features.';
    }

    try {
      if (this.provider === 'anthropic') {
        return this._callAnthropic(systemPrompt, userMessage);
      } else {
        return this._callOpenAI(systemPrompt, userMessage);
      }
    } catch (err) {
      console.error('AI API call failed:', err);
      return `Error: ${err.message}. Please check your API key and try again.`;
    }
  }

  async _callAnthropic(systemPrompt, userMessage) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.model || 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async _callOpenAI(systemPrompt, userMessage) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model || 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// Global instance
const aiEngine = new AIEngine();
