/**
 * Popup Controller - Main entry point for the Chrome extension popup UI
 * Orchestrates all modules: audio, transcription, AI, TTS, and storage
 */

(async function () {
  'use strict';

  // ===== State =====
  let currentTab = 'record';
  let recordingMode = 'listen'; // 'listen' or 'talk'
  let isRecording = false;
  let currentTranscript = '';

  // ===== Initialize =====
  await storage.ready();
  const settings = await storage.getSettings();

  // Configure engines from saved settings
  transcription.configure({
    engine: settings.transcriptionEngine || 'webspeech',
    apiKey: settings.transcriptionKey || '',
  });

  aiEngine.configure({
    provider: settings.apiProvider || 'anthropic',
    apiKey: settings.apiKey || '',
  });

  tts.configure({
    engine: settings.ttsEngine || 'browser',
    apiKey: settings.ttsKey || '',
    voiceId: settings.voiceId || 'default',
  });

  // ===== DOM References =====
  const elements = {
    // Tabs
    tabs: document.querySelectorAll('.tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    // Record
    modeButtons: document.querySelectorAll('.mode-btn'),
    recordBtn: document.getElementById('btn-record'),
    recordingStatus: document.querySelector('.status-text'),
    recordingTimer: document.getElementById('recording-timer'),
    transcriptContent: document.getElementById('transcript-content'),
    clearTranscript: document.getElementById('btn-clear-transcript'),
    quickActions: document.getElementById('quick-actions'),
    saveNoteBtn: document.getElementById('btn-save-note'),
    discardBtn: document.getElementById('btn-discard'),
    waveformCanvas: document.getElementById('waveform-canvas'),
    // Notes
    searchInput: document.getElementById('search-notes'),
    filterTags: document.querySelectorAll('.filter-tag'),
    notesList: document.getElementById('notes-list'),
    // Chat
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    sendChatBtn: document.getElementById('btn-send-chat'),
    voiceChatBtn: document.getElementById('btn-voice-chat'),
    // Settings
    settingsBtn: document.getElementById('btn-settings'),
    closeSettingsBtn: document.getElementById('btn-close-settings'),
    settingsPanel: document.getElementById('settings-panel'),
    sidePanelBtn: document.getElementById('btn-sidepanel'),
    // Settings inputs
    apiKeyInput: document.getElementById('api-key'),
    apiProviderSelect: document.getElementById('api-provider'),
    transcriptionEngineSelect: document.getElementById('transcription-engine'),
    transcriptionKeyInput: document.getElementById('transcription-key'),
    transcriptionKeyGroup: document.getElementById('transcription-key-group'),
    ttsEngineSelect: document.getElementById('tts-engine'),
    voiceSelect: document.getElementById('voice-select'),
    storageModeSelect: document.getElementById('storage-mode'),
    serverUrlGroup: document.getElementById('server-url-group'),
    serverUrlInput: document.getElementById('server-url'),
    exportBtn: document.getElementById('btn-export-data'),
    clearDataBtn: document.getElementById('btn-clear-data'),
  };

  // ===== Tab Navigation =====
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });

  function switchTab(tabName) {
    currentTab = tabName;
    elements.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    elements.tabContents.forEach(tc => tc.classList.toggle('active', tc.id === `tab-${tabName}`));

    if (tabName === 'notes') loadNotes();
    if (tabName === 'chat') loadChatHistory();
  }

  // ===== Recording Mode Toggle =====
  elements.modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      recordingMode = btn.dataset.mode;
      elements.modeButtons.forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  // ===== Record Button =====
  elements.recordBtn.addEventListener('click', async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  });

  async function startRecording() {
    // Initialize audio if needed
    const audioReady = await audioManager.initialize();
    if (!audioReady) {
      showStatus('Microphone access denied. Please allow microphone access.');
      return;
    }

    // Reset transcript
    transcription.reset();
    currentTranscript = '';
    elements.transcriptContent.innerHTML = '';

    // Set up transcription callbacks
    transcription.onResult = (text, isFinal) => {
      if (isFinal) {
        currentTranscript += text + ' ';
        appendTranscriptLine(text, true);
      } else {
        updateInterimTranscript(text);
      }
    };

    transcription.onError = (err) => {
      console.error('Transcription error:', err);
      showStatus(`Transcription error: ${err.message}`);
    };

    // Start recording and transcription
    audioManager.startRecording();
    await transcription.start();

    isRecording = true;
    elements.recordBtn.classList.add('recording');
    elements.quickActions.classList.add('hidden');
    showStatus('Recording...');

    // Notify background script
    chrome.runtime.sendMessage({ type: 'RECORDING_STARTED', mode: recordingMode });
  }

  function stopRecording() {
    audioManager.stopRecording();
    const finalTranscript = transcription.stop();
    currentTranscript = finalTranscript || currentTranscript;

    isRecording = false;
    elements.recordBtn.classList.remove('recording');
    showStatus('Recording stopped');

    if (currentTranscript.trim()) {
      elements.quickActions.classList.remove('hidden');
    }

    // Handle Whisper batch transcription
    if (transcription.engine === 'whisper') {
      audioManager.onStop = async (audioBlob) => {
        showStatus('Transcribing with Whisper...');
        const result = await transcription.transcribeBlob(audioBlob);
        if (result) {
          currentTranscript = result.text || result;
          elements.transcriptContent.innerHTML = '';
          appendTranscriptLine(currentTranscript, true);
          elements.quickActions.classList.remove('hidden');
        }
        showStatus('Transcription complete');
      };
    }

    chrome.runtime.sendMessage({ type: 'RECORDING_STOPPED' });
  }

  // ===== Transcript Display =====
  function appendTranscriptLine(text, isFinal) {
    // Remove placeholder
    const placeholder = elements.transcriptContent.querySelector('.placeholder-text');
    if (placeholder) placeholder.remove();

    // Remove any interim line
    const interim = elements.transcriptContent.querySelector('.interim');
    if (interim) interim.remove();

    const line = document.createElement('div');
    line.className = 'transcript-line';

    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = audioManager.getElapsedTime();

    line.textContent = text;
    line.appendChild(timestamp);

    elements.transcriptContent.appendChild(line);
    elements.transcriptContent.scrollTop = elements.transcriptContent.scrollHeight;
  }

  function updateInterimTranscript(text) {
    let interim = elements.transcriptContent.querySelector('.interim');
    if (!interim) {
      interim = document.createElement('div');
      interim.className = 'transcript-line interim';
      elements.transcriptContent.appendChild(interim);
    }
    interim.textContent = text;
    elements.transcriptContent.scrollTop = elements.transcriptContent.scrollHeight;
  }

  elements.clearTranscript.addEventListener('click', () => {
    currentTranscript = '';
    transcription.reset();
    elements.transcriptContent.innerHTML =
      '<p class="placeholder-text">Your transcript will appear here as you speak...</p>';
    elements.quickActions.classList.add('hidden');
  });

  // ===== Save & Structure Note =====
  elements.saveNoteBtn.addEventListener('click', async () => {
    if (!currentTranscript.trim()) return;

    elements.saveNoteBtn.disabled = true;
    elements.saveNoteBtn.innerHTML = `
      <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      Structuring...
    `;

    try {
      // Save the raw session
      const session = await storage.saveSession({
        rawTranscript: currentTranscript,
        mode: recordingMode,
        duration: audioManager.getElapsedTime(),
      });

      // Structure with AI
      const structured = await aiEngine.structureTranscript(currentTranscript, {
        date: new Date().toLocaleDateString(),
        duration: audioManager.getElapsedTime(),
        mode: recordingMode,
      });

      // Save structured note
      await storage.saveNote({
        sessionId: session.id,
        rawTranscript: currentTranscript,
        ...structured,
      });

      showStatus('Note saved and structured!');
      elements.quickActions.classList.add('hidden');

      // Clear transcript for next recording
      currentTranscript = '';
      elements.transcriptContent.innerHTML =
        '<p class="placeholder-text">Your transcript will appear here as you speak...</p>';
    } catch (err) {
      console.error('Failed to save note:', err);
      showStatus('Error saving note. Check your API key in settings.');
    }

    elements.saveNoteBtn.disabled = false;
    elements.saveNoteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
      </svg>
      Save & Structure
    `;
  });

  elements.discardBtn.addEventListener('click', () => {
    currentTranscript = '';
    transcription.reset();
    elements.transcriptContent.innerHTML =
      '<p class="placeholder-text">Your transcript will appear here as you speak...</p>';
    elements.quickActions.classList.add('hidden');
    showStatus('Recording discarded');
  });

  // ===== Notes Tab =====
  async function loadNotes(filter = null, searchQuery = null) {
    let notes;

    if (searchQuery) {
      notes = await storage.searchNotes(searchQuery);
    } else if (filter && filter !== 'All') {
      notes = await storage.searchByTag(filter.toLowerCase());
    } else {
      notes = await storage.getNotes();
    }

    if (notes.length === 0) {
      elements.notesList.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>${searchQuery ? 'No notes match your search.' : 'No notes yet. Start recording to build your knowledge base.'}</p>
        </div>
      `;
      return;
    }

    elements.notesList.innerHTML = notes.map(note => `
      <div class="note-card" data-id="${note.id}">
        <div class="note-card-header">
          <span class="note-card-title">${escapeHtml(note.title || 'Untitled')}</span>
          <span class="note-card-date">${formatDate(note.createdAt)}</span>
        </div>
        <div class="note-card-summary">${escapeHtml(note.summary || '')}</div>
        <div class="note-card-tags">
          ${(note.tags || []).map(tag => `<span class="note-tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
      </div>
    `).join('');

    // Note card click handlers
    document.querySelectorAll('.note-card').forEach(card => {
      card.addEventListener('click', () => showNoteDetail(card.dataset.id));
    });
  }

  async function showNoteDetail(noteId) {
    const note = await storage.getNote(noteId);
    if (!note) return;

    const detailHtml = `
      <div class="note-detail">
        <button class="text-btn back-btn" id="btn-back-notes">&larr; Back to notes</button>
        <h2 class="note-detail-title">${escapeHtml(note.title || 'Untitled')}</h2>
        <p class="note-detail-date">${formatDate(note.createdAt)} &middot; ${note.duration || ''}</p>

        <div class="note-detail-section">
          <h4>Summary</h4>
          <p>${escapeHtml(note.summary || 'No summary available.')}</p>
        </div>

        ${(note.keyTopics || []).length > 0 ? `
          <div class="note-detail-section">
            <h4>Key Topics</h4>
            <div class="note-card-tags">
              ${note.keyTopics.map(t => `<span class="note-tag">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${(note.actionItems || []).length > 0 ? `
          <div class="note-detail-section">
            <h4>Action Items</h4>
            <ul>${note.actionItems.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
          </div>
        ` : ''}

        ${(note.decisions || []).length > 0 ? `
          <div class="note-detail-section">
            <h4>Decisions</h4>
            <ul>${note.decisions.map(d => `<li>${escapeHtml(d)}</li>`).join('')}</ul>
          </div>
        ` : ''}

        ${(note.ideas || []).length > 0 ? `
          <div class="note-detail-section">
            <h4>Ideas</h4>
            <ul>${note.ideas.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
          </div>
        ` : ''}

        ${(note.questions || []).length > 0 ? `
          <div class="note-detail-section">
            <h4>Open Questions</h4>
            <ul>${note.questions.map(q => `<li>${escapeHtml(q)}</li>`).join('')}</ul>
          </div>
        ` : ''}

        ${note.rawTranscript ? `
          <div class="note-detail-section">
            <h4>Raw Transcript</h4>
            <p class="raw-transcript">${escapeHtml(note.rawTranscript)}</p>
          </div>
        ` : ''}

        <div class="note-detail-actions">
          <button class="action-btn danger" id="btn-delete-note" data-id="${note.id}">Delete Note</button>
        </div>
      </div>
    `;

    elements.notesList.innerHTML = detailHtml;

    document.getElementById('btn-back-notes').addEventListener('click', () => loadNotes());
    document.getElementById('btn-delete-note').addEventListener('click', async () => {
      await storage.deleteNote(note.id);
      if (note.sessionId) await storage.deleteSession(note.sessionId);
      loadNotes();
    });
  }

  // Search
  let searchDebounce = null;
  elements.searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      loadNotes(null, elements.searchInput.value.trim() || null);
    }, 300);
  });

  // Filter tags
  elements.filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      elements.filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      loadNotes(tag.textContent.trim());
    });
  });

  // ===== Chat Tab =====
  async function loadChatHistory() {
    const history = await storage.getChatHistory();
    if (history.length === 0) return;

    elements.chatMessages.innerHTML = history.map(msg => `
      <div class="chat-message ${msg.role}">
        <div class="message-avatar">
          ${msg.role === 'assistant'
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
          }
        </div>
        <div class="message-content">
          <p>${escapeHtml(msg.content)}</p>
        </div>
      </div>
    `).join('');

    scrollChatToBottom();
  }

  async function sendChatMessage(messageText) {
    if (!messageText.trim()) return;

    // Add user message to UI
    addChatBubble(messageText, 'user');
    await storage.saveChatMessage({ role: 'user', content: messageText });
    elements.chatInput.value = '';

    // Show typing indicator
    const typingId = addTypingIndicator();

    try {
      // Get relevant notes for context
      const allNotes = await storage.getNotes();
      const relevantNotes = await aiEngine.findRelevantNotes(messageText, allNotes);

      const notesContext = relevantNotes.map(n =>
        `[${formatDate(n.createdAt)}] "${n.title}": ${n.summary}\nTopics: ${(n.keyTopics || []).join(', ')}\nAction Items: ${(n.actionItems || []).join('; ')}`
      ).join('\n\n');

      const recentNotes = allNotes.slice(0, 5).map(n =>
        `[${formatDate(n.createdAt)}] "${n.title}": ${n.summary}`
      ).join('\n');

      // Get AI response
      const response = await aiEngine.chat(messageText, {
        notes: notesContext,
        recentNotes: recentNotes,
      });

      // Remove typing indicator and add response
      removeTypingIndicator(typingId);
      addChatBubble(response, 'assistant');
      await storage.saveChatMessage({ role: 'assistant', content: response });

      // Speak response if in talk mode
      if (recordingMode === 'talk') {
        await tts.speak(response);
      }
    } catch (err) {
      removeTypingIndicator(typingId);
      addChatBubble('Sorry, I encountered an error. Please check your API settings.', 'assistant');
    }
  }

  function addChatBubble(text, role) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${role}`;
    msg.innerHTML = `
      <div class="message-avatar">
        ${role === 'assistant'
          ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
          : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        }
      </div>
      <div class="message-content">
        <p>${escapeHtml(text)}</p>
      </div>
    `;
    elements.chatMessages.appendChild(msg);
    scrollChatToBottom();
  }

  function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const el = document.createElement('div');
    el.className = 'chat-message assistant';
    el.id = id;
    el.innerHTML = `
      <div class="message-avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <div class="message-content">
        <p class="typing-indicator">Thinking...</p>
      </div>
    `;
    elements.chatMessages.appendChild(el);
    scrollChatToBottom();
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function scrollChatToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }

  // Chat event listeners
  elements.sendChatBtn.addEventListener('click', () => {
    sendChatMessage(elements.chatInput.value);
  });

  elements.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(elements.chatInput.value);
    }
  });

  // Voice chat button
  let isVoiceChatting = false;
  elements.voiceChatBtn.addEventListener('click', async () => {
    if (isVoiceChatting) {
      // Stop voice input
      const voiceText = transcription.stop();
      isVoiceChatting = false;
      elements.voiceChatBtn.classList.remove('active');

      if (voiceText.trim()) {
        elements.chatInput.value = voiceText.trim();
        sendChatMessage(voiceText.trim());
      }
    } else {
      // Start voice input
      const audioReady = await audioManager.initialize();
      if (!audioReady) return;

      transcription.reset();
      transcription.onResult = (text, isFinal) => {
        if (isFinal) {
          elements.chatInput.value += text + ' ';
        }
      };

      await transcription.start();
      isVoiceChatting = true;
      elements.voiceChatBtn.classList.add('active');
    }
  });

  // ===== Settings =====
  elements.settingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.remove('hidden');
    loadSettingsUI();
  });

  elements.closeSettingsBtn.addEventListener('click', () => {
    saveSettingsFromUI();
    elements.settingsPanel.classList.add('hidden');
  });

  function loadSettingsUI() {
    elements.apiKeyInput.value = settings.apiKey || '';
    elements.apiProviderSelect.value = settings.apiProvider || 'anthropic';
    elements.transcriptionEngineSelect.value = settings.transcriptionEngine || 'webspeech';
    elements.transcriptionKeyInput.value = settings.transcriptionKey || '';
    elements.ttsEngineSelect.value = settings.ttsEngine || 'browser';
    elements.storageModeSelect.value = settings.storageMode || 'local';
    elements.serverUrlInput.value = settings.serverUrl || '';

    // Show/hide conditional fields
    toggleTranscriptionKeyVisibility();
    toggleServerUrlVisibility();
  }

  async function saveSettingsFromUI() {
    const newSettings = {
      apiKey: elements.apiKeyInput.value,
      apiProvider: elements.apiProviderSelect.value,
      transcriptionEngine: elements.transcriptionEngineSelect.value,
      transcriptionKey: elements.transcriptionKeyInput.value,
      ttsEngine: elements.ttsEngineSelect.value,
      voiceId: elements.voiceSelect.value,
      storageMode: elements.storageModeSelect.value,
      serverUrl: elements.serverUrlInput.value,
    };

    await storage.saveSettings(newSettings);

    // Reconfigure engines
    transcription.configure({
      engine: newSettings.transcriptionEngine,
      apiKey: newSettings.transcriptionKey,
    });

    aiEngine.configure({
      provider: newSettings.apiProvider,
      apiKey: newSettings.apiKey,
    });

    tts.configure({
      engine: newSettings.ttsEngine,
      voiceId: newSettings.voiceId,
    });

    Object.assign(settings, newSettings);
  }

  elements.transcriptionEngineSelect.addEventListener('change', toggleTranscriptionKeyVisibility);
  elements.storageModeSelect.addEventListener('change', toggleServerUrlVisibility);

  function toggleTranscriptionKeyVisibility() {
    const needsKey = elements.transcriptionEngineSelect.value !== 'webspeech';
    elements.transcriptionKeyGroup.style.display = needsKey ? 'block' : 'none';
  }

  function toggleServerUrlVisibility() {
    const needsUrl = elements.storageModeSelect.value === 'cloud';
    elements.serverUrlGroup.style.display = needsUrl ? 'block' : 'none';
  }

  // Export data
  elements.exportBtn.addEventListener('click', async () => {
    const data = await storage.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `second-brain-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Clear data
  elements.clearDataBtn.addEventListener('click', async () => {
    if (confirm('Are you sure? This will delete ALL your notes, recordings, and chat history. This cannot be undone.')) {
      await storage.clearAllData();
      location.reload();
    }
  });

  // Side panel button
  elements.sidePanelBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' });
  });

  // Load voices for TTS select
  async function loadVoices() {
    const voices = await tts.getVoices();
    elements.voiceSelect.innerHTML = '<option value="default">Default</option>';
    voices.forEach(voice => {
      const opt = document.createElement('option');
      opt.value = voice.voiceURI;
      opt.textContent = `${voice.name} (${voice.lang})`;
      elements.voiceSelect.appendChild(opt);
    });
    if (settings.voiceId) {
      elements.voiceSelect.value = settings.voiceId;
    }
  }
  loadVoices();

  // ===== Utility Functions =====
  function showStatus(text) {
    elements.recordingStatus.textContent = text;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }

  // ===== Draw initial waveform =====
  const canvas = elements.waveformCanvas;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#2a2a3d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
})();
