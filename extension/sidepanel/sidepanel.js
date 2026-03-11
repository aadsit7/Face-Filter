/**
 * Side Panel Controller - Provides a persistent knowledge base browser
 */

(async function () {
  'use strict';

  const contentEl = document.getElementById('content');
  const searchInput = document.getElementById('search');
  const quickChatInput = document.getElementById('quick-chat');
  const quickSendBtn = document.getElementById('btn-quick-send');

  // ===== Load Notes =====
  async function loadNotes(query = null) {
    let notes;
    if (query) {
      notes = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'SEARCH_NOTES', query }, resolve);
      });
    } else {
      notes = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'GET_NOTES' }, resolve);
      });
    }

    updateStats(notes);
    renderNotes(notes);
  }

  function updateStats(notes) {
    document.getElementById('stat-notes').textContent = notes.length;

    const allTopics = new Set();
    let actionCount = 0;
    notes.forEach(n => {
      (n.keyTopics || []).forEach(t => allTopics.add(t));
      (n.tags || []).forEach(t => allTopics.add(t));
      actionCount += (n.actionItems || []).length;
    });

    document.getElementById('stat-topics').textContent = allTopics.size;
    document.getElementById('stat-actions').textContent = actionCount;
  }

  function renderNotes(notes) {
    if (!notes || notes.length === 0) {
      contentEl.innerHTML = `
        <div class="empty-state">
          <p>No notes yet. Click the microphone icon to start recording.</p>
        </div>
      `;
      return;
    }

    contentEl.innerHTML = notes.map(note => `
      <div class="note-card" data-id="${note.id}">
        <div class="note-header">
          <h3>${escapeHtml(note.title || 'Untitled')}</h3>
          <span class="date">${formatDate(note.createdAt)}</span>
        </div>
        <p class="summary">${escapeHtml(note.summary || '')}</p>
        ${(note.actionItems || []).length > 0 ? `
          <div class="action-items">
            ${note.actionItems.slice(0, 3).map(a => `
              <div class="action-item">
                <span class="bullet">&#9679;</span>
                ${escapeHtml(a)}
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="tags">
          ${(note.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // ===== Search =====
  let debounce = null;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      loadNotes(searchInput.value.trim() || null);
    }, 300);
  });

  // ===== Quick Chat =====
  quickSendBtn.addEventListener('click', () => {
    const query = quickChatInput.value.trim();
    if (!query) return;

    // Open popup to chat tab (or handle inline)
    chrome.runtime.sendMessage({ type: 'OPEN_CHAT', query });
    quickChatInput.value = '';
  });

  quickChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      quickSendBtn.click();
    }
  });

  // ===== Utilities =====
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // ===== Initialize =====
  loadNotes();

  // Listen for updates
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.notes) loadNotes();
  });
})();
