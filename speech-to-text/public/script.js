class SpeechToTextApp {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioStream = null;
        this.audioChunks = [];
        this.recordingStartTime = null;
        
        this.initializeElements();
        this.initializeUI();
    }

    initializeElements() {
        this.recordBtn = document.getElementById('recordBtn');
        this.recordIcon = document.getElementById('recordIcon');
        this.clearBtn = document.getElementById('clearBtn');
        this.statusText = document.getElementById('statusText');
        this.chatMessages = document.getElementById('chatMessages');
        this.audioVisualizer = document.getElementById('audioVisualizer');
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
        this.updateStatus('Ready');
    }

    async startRecording() {
        try {
            // Request microphone access with optimized settings for speech
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000, // Optimal for speech recognition
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true // Helps with consistent volume
                }
            });

            // Set up media recorder with compression for faster uploads
            const options = {
                mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 16000 // Compressed for faster upload
            };
            
            // Fallback for browsers that don't support opus compression
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = 'audio/webm';
                options.audioBitsPerSecond = 32000; // Still compressed
            }
            
            this.mediaRecorder = new MediaRecorder(this.audioStream, options);

            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.processRecording();
            };

            this.mediaRecorder.start();
            
            this.isRecording = true;
            this.recordingStartTime = new Date();
            this.updateRecordingUI(true);
            this.audioVisualizer.classList.add('active');
            this.updateStatus('Recording...');
            
            this.addSystemMessage('Recording started... Speak clearly for best results.', 'info');
            
            // Show recording timer for user feedback
            this.startRecordingTimer();

        } catch (error) {
            console.error('Error starting recording:', error);
            this.addSystemMessage('Error accessing microphone. Please allow microphone access.', 'error');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
        }

        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
        }

        this.isRecording = false;
        this.stopRecordingTimer();
        this.updateRecordingUI(false);
        this.audioVisualizer.classList.remove('active');
        this.updateStatus('Processing...');
        
        const duration = Math.floor((new Date() - this.recordingStartTime) / 1000);
        this.addSystemMessage(`Recording stopped (${duration}s). Processing audio...`, 'info');
    }

    async processRecording() {
        try {
            // Create audio blob from recorded chunks
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            
            // Convert to WAV format for better compatibility
            const wavBlob = await this.convertToWav(audioBlob);
            
            // Upload and transcribe
            await this.uploadAndTranscribe(wavBlob);
            
        } catch (error) {
            console.error('Error processing recording:', error);
            this.addSystemMessage('Error processing recording. Please try again.', 'error');
            this.updateStatus('Error');
        }
    }

    async convertToWav(webmBlob) {
        // For now, just return the original blob
        // In a production app, you might want to convert to WAV format
        return webmBlob;
    }

    async uploadAndTranscribe(audioBlob) {
        try {
            // Show upload progress
            this.updateStatus('Uploading audio...');
            
            // Create form data
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');
            
            // Upload to server with progress tracking
            const response = await fetch('/transcribe', {
                method: 'POST',
                body: formData
            });
            
            this.updateStatus('Transcribing speech...');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.displayTranscription(result);
                this.updateStatus('Completed');
                this.addSystemMessage('Transcription completed successfully!', 'success');
            } else {
                throw new Error(result.error || 'Transcription failed');
            }
            
        } catch (error) {
            console.error('Error uploading audio:', error);
            this.addSystemMessage(`Transcription failed: ${error.message}`, 'error');
            this.updateStatus('Error');
        }
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

    updateStatus(text) {
        this.statusText.textContent = text;
    }

    displayTranscription(data) {
        const { transcript, timestamp } = data;
        
        if (transcript.trim()) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message transcript-message final';
            
            const time = new Date(timestamp).toLocaleTimeString();
            messageDiv.innerHTML = `
                <div>${transcript}</div>
                <div class="message-time">${time} ✓</div>
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
        this.updateStatus('Ready');
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    startRecordingTimer() {
        this.recordingTimer = setInterval(() => {
            if (this.isRecording && this.recordingStartTime) {
                const elapsed = Math.floor((new Date() - this.recordingStartTime) / 1000);
                this.updateStatus(`Recording... ${elapsed}s`);
            }
        }, 1000);
    }

    stopRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }
}

// Initialize the app when DOM is loaded
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