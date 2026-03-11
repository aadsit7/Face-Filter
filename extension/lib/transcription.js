/**
 * Transcription Module - Speech-to-text using Web Speech API or external services
 */

class TranscriptionEngine {
  constructor() {
    this.engine = 'webspeech'; // 'webspeech', 'deepgram', 'whisper'
    this.apiKey = '';
    this.recognition = null;
    this.isListening = false;
    this.fullTranscript = '';
    this.interimTranscript = '';

    // Callbacks
    this.onResult = null;       // (text, isFinal) => {}
    this.onError = null;        // (error) => {}
    this.onStateChange = null;  // (isListening) => {}
  }

  /**
   * Configure the transcription engine
   */
  configure(options = {}) {
    this.engine = options.engine || 'webspeech';
    this.apiKey = options.apiKey || '';
  }

  /**
   * Start transcription
   */
  async start() {
    switch (this.engine) {
      case 'webspeech':
        return this._startWebSpeech();
      case 'deepgram':
        return this._startDeepgram();
      case 'whisper':
        // Whisper is batch-only; handled after recording stops
        this.isListening = true;
        this._notifyStateChange();
        return true;
      default:
        return this._startWebSpeech();
    }
  }

  /**
   * Stop transcription
   */
  stop() {
    this.isListening = false;
    this._notifyStateChange();

    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }

    if (this._deepgramSocket) {
      this._deepgramSocket.close();
      this._deepgramSocket = null;
    }

    return this.fullTranscript;
  }

  /**
   * Get the full transcript
   */
  getTranscript() {
    return this.fullTranscript;
  }

  /**
   * Reset transcript
   */
  reset() {
    this.fullTranscript = '';
    this.interimTranscript = '';
  }

  /**
   * Transcribe an audio blob using Whisper API (batch mode)
   */
  async transcribeBlob(audioBlob) {
    if (this.engine !== 'whisper' || !this.apiKey) {
      return this.fullTranscript;
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.status}`);
      }

      const data = await response.json();
      this.fullTranscript = data.text;
      return data;
    } catch (err) {
      console.error('Whisper transcription failed:', err);
      if (this.onError) this.onError(err);
      return null;
    }
  }

  // ===== Web Speech API =====

  _startWebSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Web Speech API not supported');
      if (this.onError) this.onError(new Error('Web Speech API not supported'));
      return false;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      let interim = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (finalText) {
        this.fullTranscript += finalText;
        if (this.onResult) this.onResult(finalText.trim(), true);
      }

      if (interim) {
        this.interimTranscript = interim;
        if (this.onResult) this.onResult(interim, false);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        if (this.onError) this.onError(new Error('Microphone access denied'));
      } else if (event.error !== 'no-speech') {
        if (this.onError) this.onError(new Error(event.error));
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (this.isListening && this.recognition) {
        try {
          this.recognition.start();
        } catch (e) {
          // Already started, ignore
        }
      }
    };

    try {
      this.recognition.start();
      this.isListening = true;
      this._notifyStateChange();
      return true;
    } catch (err) {
      console.error('Failed to start recognition:', err);
      if (this.onError) this.onError(err);
      return false;
    }
  }

  // ===== Deepgram Streaming =====

  async _startDeepgram() {
    if (!this.apiKey) {
      if (this.onError) this.onError(new Error('Deepgram API key required'));
      return false;
    }

    try {
      const socket = new WebSocket(
        'wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&diarize=true&punctuate=true',
        ['token', this.apiKey]
      );

      this._deepgramSocket = socket;

      socket.onopen = () => {
        this.isListening = true;
        this._notifyStateChange();

        // Stream audio data to Deepgram
        if (audioManager && audioManager.mediaStream) {
          const mediaRecorder = new MediaRecorder(audioManager.mediaStream, {
            mimeType: 'audio/webm;codecs=opus',
          });
          this._deepgramRecorder = mediaRecorder;

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
              socket.send(event.data);
            }
          };

          mediaRecorder.start(250); // 250ms chunks for real-time
        }
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'Results') {
          const transcript = data.channel?.alternatives?.[0]?.transcript || '';
          const isFinal = data.is_final;

          if (transcript) {
            if (isFinal) {
              this.fullTranscript += transcript + ' ';
              if (this.onResult) this.onResult(transcript, true);
            } else {
              this.interimTranscript = transcript;
              if (this.onResult) this.onResult(transcript, false);
            }
          }
        }
      };

      socket.onerror = (err) => {
        console.error('Deepgram WebSocket error:', err);
        if (this.onError) this.onError(err);
      };

      socket.onclose = () => {
        if (this._deepgramRecorder) {
          this._deepgramRecorder.stop();
          this._deepgramRecorder = null;
        }
      };

      return true;
    } catch (err) {
      console.error('Deepgram connection failed:', err);
      if (this.onError) this.onError(err);
      return false;
    }
  }

  _notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.isListening);
    }
  }
}

// Global instance
const transcription = new TranscriptionEngine();
