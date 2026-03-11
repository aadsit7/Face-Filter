/**
 * Storage Module - Handles all data persistence for Second Brain
 * Supports both Chrome storage (local) and optional cloud sync
 */

class SecondBrainStorage {
  constructor() {
    this.storageMode = 'local'; // 'local' or 'cloud'
    this.serverUrl = '';
    this._initPromise = this._init();
  }

  async _init() {
    try {
      const settings = await this.getSettings();
      this.storageMode = settings.storageMode || 'local';
      this.serverUrl = settings.serverUrl || '';
    } catch (e) {
      console.warn('Storage init with defaults:', e);
    }
  }

  async ready() {
    return this._initPromise;
  }

  // ===== Settings =====
  async getSettings() {
    return this._getLocal('settings') || {};
  }

  async saveSettings(settings) {
    await this._setLocal('settings', settings);
    this.storageMode = settings.storageMode || 'local';
    this.serverUrl = settings.serverUrl || '';
  }

  // ===== Sessions (Recordings) =====
  async saveSession(session) {
    const sessions = await this.getSessions();
    session.id = session.id || this._generateId();
    session.createdAt = session.createdAt || new Date().toISOString();
    session.updatedAt = new Date().toISOString();
    sessions.unshift(session);
    await this._setLocal('sessions', sessions);

    if (this.storageMode === 'cloud') {
      await this._syncToCloud('sessions', session);
    }

    return session;
  }

  async getSessions() {
    return (await this._getLocal('sessions')) || [];
  }

  async getSession(id) {
    const sessions = await this.getSessions();
    return sessions.find(s => s.id === id) || null;
  }

  async deleteSession(id) {
    let sessions = await this.getSessions();
    sessions = sessions.filter(s => s.id !== id);
    await this._setLocal('sessions', sessions);

    // Also remove associated notes
    await this.deleteNoteBySessionId(id);
  }

  // ===== Structured Notes =====
  async saveNote(note) {
    const notes = await this.getNotes();
    note.id = note.id || this._generateId();
    note.createdAt = note.createdAt || new Date().toISOString();
    note.updatedAt = new Date().toISOString();

    const existingIndex = notes.findIndex(n => n.sessionId === note.sessionId);
    if (existingIndex >= 0) {
      notes[existingIndex] = { ...notes[existingIndex], ...note };
    } else {
      notes.unshift(note);
    }

    await this._setLocal('notes', notes);

    if (this.storageMode === 'cloud') {
      await this._syncToCloud('notes', note);
    }

    return note;
  }

  async getNotes() {
    return (await this._getLocal('notes')) || [];
  }

  async getNote(id) {
    const notes = await this.getNotes();
    return notes.find(n => n.id === id) || null;
  }

  async deleteNote(id) {
    let notes = await this.getNotes();
    notes = notes.filter(n => n.id !== id);
    await this._setLocal('notes', notes);
  }

  async deleteNoteBySessionId(sessionId) {
    let notes = await this.getNotes();
    notes = notes.filter(n => n.sessionId !== sessionId);
    await this._setLocal('notes', notes);
  }

  // ===== Search =====
  async searchNotes(query) {
    const notes = await this.getNotes();
    const queryLower = query.toLowerCase();

    return notes.filter(note => {
      const searchableText = [
        note.title || '',
        note.summary || '',
        note.rawTranscript || '',
        ...(note.tags || []),
        ...(note.actionItems || []),
        ...(note.people || []),
        ...(note.decisions || []),
        ...(note.keyTopics || []),
      ].join(' ').toLowerCase();

      return searchableText.includes(queryLower);
    });
  }

  async searchByTag(tag) {
    const notes = await this.getNotes();
    return notes.filter(note =>
      (note.tags || []).some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // ===== Chat History =====
  async saveChatMessage(message) {
    const history = await this.getChatHistory();
    message.id = message.id || this._generateId();
    message.timestamp = message.timestamp || new Date().toISOString();
    history.push(message);

    // Keep last 100 messages
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }

    await this._setLocal('chatHistory', history);
    return message;
  }

  async getChatHistory() {
    return (await this._getLocal('chatHistory')) || [];
  }

  async clearChatHistory() {
    await this._setLocal('chatHistory', []);
  }

  // ===== Data Management =====
  async exportAllData() {
    const data = {
      settings: await this.getSettings(),
      sessions: await this.getSessions(),
      notes: await this.getNotes(),
      chatHistory: await this.getChatHistory(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonString) {
    const data = JSON.parse(jsonString);
    if (data.settings) await this._setLocal('settings', data.settings);
    if (data.sessions) await this._setLocal('sessions', data.sessions);
    if (data.notes) await this._setLocal('notes', data.notes);
    if (data.chatHistory) await this._setLocal('chatHistory', data.chatHistory);
  }

  async clearAllData() {
    await chrome.storage.local.clear();
  }

  // ===== Internal Methods =====
  async _getLocal(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key] || null);
      });
    });
  }

  async _setLocal(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }

  async _syncToCloud(type, data) {
    if (!this.serverUrl) return;

    try {
      await fetch(`${this.serverUrl}/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Cloud sync failed:', e);
    }
  }

  _generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Global instance
const storage = new SecondBrainStorage();
