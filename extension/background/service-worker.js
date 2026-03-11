/**
 * Background Service Worker - Handles extension lifecycle, context menus,
 * side panel management, and cross-tab communication
 */

// ===== Extension Install / Update =====
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on first install
    chrome.storage.local.set({
      settings: {
        apiProvider: 'anthropic',
        apiKey: '',
        transcriptionEngine: 'webspeech',
        ttsEngine: 'browser',
        storageMode: 'local',
      },
    });
  }

  // Create context menu
  chrome.contextMenus.create({
    id: 'second-brain-capture',
    title: 'Capture to Second Brain',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'second-brain-start-recording',
    title: 'Start Recording',
    contexts: ['page'],
  });
});

// ===== Context Menu Handlers =====
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'second-brain-capture' && info.selectionText) {
    // Save selected text as a quick note
    const sessions = (await getStorage('sessions')) || [];
    const notes = (await getStorage('notes')) || [];

    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const session = {
      id,
      rawTranscript: info.selectionText,
      mode: 'text-capture',
      source: tab.url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessions.unshift(session);
    await setStorage('sessions', sessions);

    const note = {
      id: `note-${id}`,
      sessionId: id,
      title: `Captured from ${new URL(tab.url).hostname}`,
      summary: info.selectionText.substring(0, 200),
      rawTranscript: info.selectionText,
      tags: ['text-capture', 'web'],
      keyTopics: [],
      actionItems: [],
      decisions: [],
      questions: [],
      people: [],
      ideas: [],
      sentiment: 'neutral',
      importance: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.unshift(note);
    await setStorage('notes', notes);

    // Show notification
    chrome.action.setBadgeText({ text: '1' });
    chrome.action.setBadgeBackgroundColor({ color: '#6c5ce7' });
    setTimeout(() => chrome.action.setBadgeText({ text: '' }), 3000);
  }

  if (info.menuItemId === 'second-brain-start-recording') {
    // Toggle recording via content script
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_RECORDING' });
  }
});

// ===== Message Handler =====
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'OPEN_SIDE_PANEL':
      chrome.sidePanel.open({ tabId: sender.tab?.id });
      break;

    case 'RECORDING_STARTED':
      chrome.action.setBadgeText({ text: 'REC' });
      chrome.action.setBadgeBackgroundColor({ color: '#e74c3c' });
      // Notify all tabs
      broadcastToTabs({ type: 'RECORDING_STATE', isRecording: true, mode: message.mode });
      break;

    case 'RECORDING_STOPPED':
      chrome.action.setBadgeText({ text: '' });
      broadcastToTabs({ type: 'RECORDING_STATE', isRecording: false });
      break;

    case 'GET_NOTES':
      getStorage('notes').then(notes => sendResponse(notes || []));
      return true; // Async response

    case 'SEARCH_NOTES':
      searchNotes(message.query).then(results => sendResponse(results));
      return true;
  }
});

// ===== Side Panel Configuration =====
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});

// ===== Helper Functions =====
async function getStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => resolve(result[key]));
  });
}

async function setStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

async function broadcastToTabs(message) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, message);
    } catch {
      // Tab might not have content script
    }
  }
}

async function searchNotes(query) {
  const notes = (await getStorage('notes')) || [];
  const queryLower = query.toLowerCase();

  return notes.filter(note => {
    const text = [
      note.title || '',
      note.summary || '',
      note.rawTranscript || '',
      ...(note.tags || []),
    ].join(' ').toLowerCase();

    return text.includes(queryLower);
  });
}
