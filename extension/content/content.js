/**
 * Content Script - Injected into web pages
 * Provides floating recording indicator and mini-transcript overlay
 */

(function () {
  'use strict';

  let isRecording = false;
  let indicator = null;
  let miniTranscript = null;

  // ===== Create Floating UI Elements =====
  function createIndicator() {
    if (indicator) return;

    indicator = document.createElement('button');
    indicator.id = 'second-brain-indicator';
    indicator.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
      </svg>
    `;
    indicator.style.display = 'none';
    document.body.appendChild(indicator);

    indicator.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'TOGGLE_RECORDING' });
    });

    // Mini transcript panel
    miniTranscript = document.createElement('div');
    miniTranscript.id = 'second-brain-mini-transcript';
    document.body.appendChild(miniTranscript);
  }

  // ===== Message Handling =====
  chrome.runtime.onMessage.addListener((message) => {
    switch (message.type) {
      case 'RECORDING_STATE':
        isRecording = message.isRecording;
        updateUI();
        break;

      case 'TOGGLE_RECORDING':
        // Relay to popup
        chrome.runtime.sendMessage({
          type: isRecording ? 'STOP_RECORDING' : 'START_RECORDING',
        });
        break;

      case 'TRANSCRIPT_UPDATE':
        updateMiniTranscript(message.text);
        break;
    }
  });

  function updateUI() {
    createIndicator();

    if (isRecording) {
      indicator.style.display = 'flex';
      indicator.classList.add('recording');
      miniTranscript.classList.add('visible');
    } else {
      indicator.classList.remove('recording');
      miniTranscript.classList.remove('visible');
      // Hide indicator after a delay
      setTimeout(() => {
        if (!isRecording && indicator) {
          indicator.style.display = 'none';
        }
      }, 2000);
    }
  }

  function updateMiniTranscript(text) {
    if (!miniTranscript) return;
    miniTranscript.textContent = text;
    miniTranscript.scrollTop = miniTranscript.scrollHeight;
  }

  // ===== Initialize =====
  createIndicator();
})();
