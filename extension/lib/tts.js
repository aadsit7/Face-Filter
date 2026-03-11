/**
 * Text-to-Speech Module - Voice output for the assistant
 * Supports browser built-in TTS and ElevenLabs
 */

class TTSEngine {
  constructor() {
    this.engine = 'browser'; // 'browser' or 'elevenlabs'
    this.apiKey = '';
    this.voiceId = 'default';
    this.isSpeaking = false;
    this.utterance = null;
    this.onStart = null;
    this.onEnd = null;
  }

  /**
   * Configure TTS engine
   */
  configure(options = {}) {
    this.engine = options.engine || 'browser';
    this.apiKey = options.apiKey || '';
    this.voiceId = options.voiceId || 'default';
  }

  /**
   * Speak text aloud
   */
  async speak(text) {
    this.stop(); // Stop any current speech

    if (this.engine === 'elevenlabs' && this.apiKey) {
      return this._speakElevenLabs(text);
    }
    return this._speakBrowser(text);
  }

  /**
   * Stop speaking
   */
  stop() {
    if (this.isSpeaking) {
      if (this.engine === 'browser') {
        window.speechSynthesis.cancel();
      }
      if (this._audioElement) {
        this._audioElement.pause();
        this._audioElement = null;
      }
      this.isSpeaking = false;
      if (this.onEnd) this.onEnd();
    }
  }

  /**
   * Get available browser voices
   */
  getVoices() {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
      }
    });
  }

  // ===== Browser TTS =====

  _speakBrowser(text) {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      this.utterance = new SpeechSynthesisUtterance(text);
      this.utterance.rate = 1.0;
      this.utterance.pitch = 1.0;
      this.utterance.volume = 1.0;

      // Set voice if specified
      if (this.voiceId !== 'default') {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.voiceURI === this.voiceId);
        if (voice) this.utterance.voice = voice;
      }

      this.utterance.onstart = () => {
        this.isSpeaking = true;
        if (this.onStart) this.onStart();
      };

      this.utterance.onend = () => {
        this.isSpeaking = false;
        if (this.onEnd) this.onEnd();
        resolve();
      };

      this.utterance.onerror = (event) => {
        this.isSpeaking = false;
        if (this.onEnd) this.onEnd();
        reject(new Error(event.error));
      };

      window.speechSynthesis.speak(this.utterance);
    });
  }

  // ===== ElevenLabs TTS =====

  async _speakElevenLabs(text) {
    try {
      const voiceId = this.voiceId !== 'default'
        ? this.voiceId
        : '21m00Tcm4TlvDq8ikWAM'; // Default ElevenLabs voice (Rachel)

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      this._audioElement = new Audio(audioUrl);

      return new Promise((resolve, reject) => {
        this._audioElement.onplay = () => {
          this.isSpeaking = true;
          if (this.onStart) this.onStart();
        };

        this._audioElement.onended = () => {
          this.isSpeaking = false;
          URL.revokeObjectURL(audioUrl);
          if (this.onEnd) this.onEnd();
          resolve();
        };

        this._audioElement.onerror = (err) => {
          this.isSpeaking = false;
          URL.revokeObjectURL(audioUrl);
          if (this.onEnd) this.onEnd();
          reject(err);
        };

        this._audioElement.play();
      });
    } catch (err) {
      console.error('ElevenLabs TTS failed:', err);
      // Fallback to browser TTS
      return this._speakBrowser(text);
    }
  }
}

// Global instance
const tts = new TTSEngine();
