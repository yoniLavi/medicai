class SpeechToTextApp {
    constructor() {
        this.socket = io();
        this.isRecording = false;
        this.scriptNode = null;
        this.audioStream = null;
        this.audioContext = null;
        this.recordingStartTime = null;
        
        this.initializeElements();
        this.initializeSocketEvents();
        this.initializeUI();
    }

    initializeElements() {
        this.recordBtn = document.getElementById('recordBtn');
        this.recordIcon = document.getElementById('recordIcon');
        this.clearBtn = document.getElementById('clearBtn');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.chatMessages = document.getElementById('chatMessages');
        this.audioVisualizer = document.getElementById('audioVisualizer');
    }

    initializeSocketEvents() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.updateStatus('Connected', 'connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.updateStatus('Disconnected', 'disconnected');
        });

        this.socket.on('transcription-status', (data) => {
            console.log('Transcription status:', data);
            if (data.status === 'ready') {
                this.updateStatus('Ready to record', 'connected');
            } else if (data.status === 'connected') {
                this.updateStatus('Recording...', 'recording');
            } else if (data.status === 'stopped') {
                this.updateStatus('Recording stopped', 'connected');
            }
        });

        this.socket.on('transcription-result', (data) => {
            console.log('Received transcription result:', data);
            this.displayTranscription(data);
        });

        this.socket.on('transcription-error', (data) => {
            console.error('Transcription error:', data.error);
            this.addSystemMessage(`Error: ${data.error}`, 'error');
            this.stopRecording();
        });
    }

    initializeUI() {
        this.recordBtn.addEventListener('click', () => {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        });

        this.clearBtn.addEventListener('click', () => {
            this.clearTranscripts();
        });

        // Initialize status
        this.updateStatus('Ready', 'ready');
    }

    async startRecording() {
        try {
            // Request microphone access
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            // Set up audio context for processing
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: 16000
            });

            const source = this.audioContext.createMediaStreamSource(this.audioStream);
            
            // Create a ScriptProcessorNode to capture raw audio data
            this.scriptNode = this.audioContext.createScriptProcessor(4096, 1, 1);
            
            // Start socket transcription
            this.socket.emit('start-recording');

            this.scriptNode.onaudioprocess = (event) => {
                if (this.isRecording) {
                    const inputBuffer = event.inputBuffer;
                    const inputData = inputBuffer.getChannelData(0);
                    
                    // Check if there's actual audio signal
                    let hasSignal = false;
                    let maxAmplitude = 0;
                    
                    // Convert float32 to int16 PCM
                    const pcmData = new Int16Array(inputData.length);
                    for (let i = 0; i < inputData.length; i++) {
                        const sample = Math.max(-1, Math.min(1, inputData[i]));
                        pcmData[i] = Math.round(sample * 32767);
                        
                        const amplitude = Math.abs(sample);
                        if (amplitude > maxAmplitude) {
                            maxAmplitude = amplitude;
                        }
                        if (amplitude > 0.01) { // Threshold for detecting speech
                            hasSignal = true;
                        }
                    }
                    
                    // Send PCM data to server
                    if (hasSignal) {
                        console.log(`Sending audio data: ${pcmData.length} samples, max amplitude: ${maxAmplitude.toFixed(3)}`);
                        this.socket.emit('audio-data', Array.from(pcmData));
                        
                        // Visual feedback - make visualizer more active with louder audio
                        this.updateVisualizerIntensity(maxAmplitude);
                    }
                }
            };

            // Connect the audio processing chain
            source.connect(this.scriptNode);
            this.scriptNode.connect(this.audioContext.destination);
            
            this.isRecording = true;
            this.recordingStartTime = new Date();
            this.updateRecordingUI(true);
            this.audioVisualizer.classList.add('active');
            
            this.addSystemMessage('Recording started...', 'info');

        } catch (error) {
            console.error('Error starting recording:', error);
            this.addSystemMessage('Error accessing microphone. Please allow microphone access.', 'error');
        }
    }



    stopRecording() {
        this.isRecording = false;
        this.socket.emit('stop-recording');

        if (this.scriptNode) {
            this.scriptNode.disconnect();
            this.scriptNode = null;
        }

        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
        }

        if (this.audioContext) {
            this.audioContext.close();
        }

        this.updateRecordingUI(false);
        this.audioVisualizer.classList.remove('active');
        this.updateStatus('Ready', 'connected');
        
        this.addSystemMessage('Recording stopped.', 'info');
    }

    updateRecordingUI(recording) {
        if (recording) {
            this.recordBtn.classList.add('recording');
            this.recordIcon.className = 'fas fa-stop';
            this.recordBtn.title = 'Stop Recording';
        } else {
            this.recordBtn.classList.remove('recording');
            this.recordIcon.className = 'fas fa-microphone';
            this.recordBtn.title = 'Start Recording';
        }
    }

    updateStatus(text, status) {
        this.statusText.textContent = text;
        this.statusIndicator.className = `status-indicator ${status}`;
    }

    displayTranscription(data) {
        const { transcript, timestamp, isFinal } = data;
        
        // Remove any existing partial message
        const existingPartial = this.chatMessages.querySelector('.transcript-message.partial');
        if (existingPartial) {
            existingPartial.remove();
        }

        if (transcript.trim()) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message transcript-message ${isFinal ? 'final' : 'partial'}`;
            
            const time = new Date(timestamp).toLocaleTimeString();
            messageDiv.innerHTML = `
                <div>${transcript}</div>
                <div class="message-time">${time} ${isFinal ? '✓' : '...'}</div>
            `;
            
            this.chatMessages.appendChild(messageDiv);
            this.scrollToBottom();
        }
    }

    addSystemMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message';
        
        let icon = 'fas fa-info-circle';
        if (type === 'error') icon = 'fas fa-exclamation-triangle';
        if (type === 'success') icon = 'fas fa-check-circle';
        
        messageDiv.innerHTML = `<i class="${icon}"></i> ${message}`;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    clearTranscripts() {
        // Keep only the welcome message
        const welcomeMessage = this.chatMessages.querySelector('.system-message');
        this.chatMessages.innerHTML = '';
        if (welcomeMessage) {
            this.chatMessages.appendChild(welcomeMessage);
        }
        this.addSystemMessage('Transcript cleared.', 'info');
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    updateVisualizerIntensity(amplitude) {
        // Update visualizer bars based on audio amplitude
        const bars = this.audioVisualizer.querySelectorAll('.visualizer-bar');
        bars.forEach((bar, index) => {
            const intensity = Math.min(1, amplitude * 10); // Scale amplitude
            const height = 20 + (intensity * 30); // 20px to 50px height
            bar.style.height = `${height}px`;
        });
    }
}

// Initialize the app when DOM is loaded and handle page unload
let speechApp;
document.addEventListener('DOMContentLoaded', () => {
    speechApp = new SpeechToTextApp();
    window.speechApp = speechApp;
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.speechApp && window.speechApp.isRecording) {
        window.speechApp.stopRecording();
    }
}); 