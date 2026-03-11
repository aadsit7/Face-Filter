/**
 * Audio Module - Handles microphone capture, recording, and waveform visualization
 */

class AudioManager {
  constructor() {
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.analyserNode = null;
    this.audioContext = null;
    this.isRecording = false;
    this.startTime = null;
    this.timerInterval = null;
    this.onDataAvailable = null;
    this.onStop = null;
    this.onVisualize = null;
  }

  /**
   * Request microphone access and set up audio pipeline
   */
  async initialize() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      // Set up AudioContext for visualization
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;
      source.connect(this.analyserNode);

      return true;
    } catch (err) {
      console.error('Microphone access denied:', err);
      return false;
    }
  }

  /**
   * Start recording audio
   */
  startRecording() {
    if (!this.mediaStream) {
      console.error('Audio not initialized');
      return false;
    }

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      mimeType: this._getSupportedMimeType(),
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
        if (this.onDataAvailable) {
          this.onDataAvailable(event.data);
        }
      }
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, {
        type: this.mediaRecorder.mimeType,
      });
      if (this.onStop) {
        this.onStop(audioBlob);
      }
    };

    this.mediaRecorder.start(1000); // Capture in 1-second chunks
    this.isRecording = true;
    this.startTime = Date.now();
    this._startTimer();
    this._startVisualization();

    return true;
  }

  /**
   * Stop recording
   */
  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this._stopTimer();
      return true;
    }
    return false;
  }

  /**
   * Get the elapsed recording time formatted as MM:SS
   */
  getElapsedTime() {
    if (!this.startTime) return '00:00';
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  /**
   * Get frequency data for visualization
   */
  getFrequencyData() {
    if (!this.analyserNode) return new Uint8Array(0);
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);
    return data;
  }

  /**
   * Get waveform data for visualization
   */
  getWaveformData() {
    if (!this.analyserNode) return new Uint8Array(0);
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteTimeDomainData(data);
    return data;
  }

  /**
   * Draw waveform visualization on a canvas
   */
  drawWaveform(canvas) {
    if (!canvas || !this.analyserNode) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const data = this.getWaveformData();
    const barCount = 64;
    const barWidth = width / barCount;
    const frequencyData = this.getFrequencyData();

    ctx.clearRect(0, 0, width, height);

    // Draw frequency bars
    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor(i * frequencyData.length / barCount);
      const value = frequencyData[dataIndex] / 255;
      const barHeight = value * height * 0.8;

      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      // Gradient based on intensity
      const hue = 258 - value * 30; // Purple range
      const saturation = 60 + value * 30;
      const lightness = 45 + value * 20;
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      ctx.beginPath();
      ctx.roundRect(x + 1, y, barWidth - 2, barHeight, 2);
      ctx.fill();
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this._stopTimer();
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.isRecording = false;
  }

  // ===== Private Methods =====

  _getSupportedMimeType() {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return 'audio/webm';
  }

  _startTimer() {
    this._stopTimer();
    this.timerInterval = setInterval(() => {
      const timerEl = document.getElementById('recording-timer');
      if (timerEl) {
        timerEl.textContent = this.getElapsedTime();
      }
    }, 1000);
  }

  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  _startVisualization() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas) return;

    const animate = () => {
      if (!this.isRecording) {
        // Draw flat line when not recording
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#2a2a3d';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }
      this.drawWaveform(canvas);
      requestAnimationFrame(animate);
    };
    animate();
  }
}

// Global instance
const audioManager = new AudioManager();
