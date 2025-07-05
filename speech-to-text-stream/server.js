require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { AssemblyAI } = require('assemblyai');
const path = require('path');
const { Readable } = require('stream');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// AssemblyAI client - Replace with your API key
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY ,
});

// Store active transcribers and audio streams for each socket
const activeTranscribers = new Map();
const audioStreams = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('start-recording', async () => {
    try {
      console.log('Starting transcription for:', socket.id);
      
      const transcriber = client.streaming.transcriber({
        sampleRate: 16000,
        formatTurns: true
      });

      // Create a readable stream to pipe audio data to AssemblyAI
      const audioStream = new Readable({
        read() {
          // This will be called when AssemblyAI is ready for more data
        }
      });

      // Store transcriber and stream for this socket
      activeTranscribers.set(socket.id, transcriber);
      audioStreams.set(socket.id, audioStream);

      transcriber.on('open', ({ id }) => {
        console.log(`Session opened with ID: ${id} for socket: ${socket.id}`);
        socket.emit('transcription-status', { status: 'connected', sessionId: id });
      });

      transcriber.on('error', (error) => {
        console.error('Transcription error:', error);
        socket.emit('transcription-error', { error: error.message });
      });

      transcriber.on('close', (code, reason) => {
        console.log('Session closed:', code, reason);
        socket.emit('transcription-status', { status: 'closed', code, reason });
      });

      transcriber.on('transcript', (transcript) => {
        console.log('Transcript event received:', transcript);
        socket.emit('transcription-result', {
          transcript: transcript.text,
          timestamp: new Date().toISOString(),
          isFinal: !transcript.partial
        });
      });

      transcriber.on('turn', (turn) => {
        console.log('Turn event received:', turn);
        if (!turn.transcript) {
          console.log('Turn received but no transcript');
          return;
        }
        
        console.log('Turn received with transcript:', turn.transcript);
        socket.emit('transcription-result', {
          transcript: turn.transcript,
          timestamp: new Date().toISOString(),
          isFinal: true
        });
      });

      transcriber.on('partial', (partial) => {
        console.log('Partial event received:', partial);
        if (partial.transcript) {
          console.log('Partial transcript:', partial.transcript);
          socket.emit('transcription-result', {
            transcript: partial.transcript,
            timestamp: new Date().toISOString(),
            isFinal: false
          });
        }
      });

      await transcriber.connect();
      
      // Convert Node.js Readable stream to Web ReadableStream and pipe to AssemblyAI
      const webReadableStream = Readable.toWeb(audioStream);
      webReadableStream.pipeTo(transcriber.stream());
      
      socket.emit('transcription-status', { status: 'ready' });

    } catch (error) {
      console.error('Error starting transcription:', error);
      socket.emit('transcription-error', { error: error.message });
    }
  });

  socket.on('audio-data', (audioData) => {
    const audioStream = audioStreams.get(socket.id);
    if (audioStream) {
      try {
        // Convert Int16 array to raw PCM bytes
        const int16Array = new Int16Array(audioData);
        const buffer = Buffer.from(int16Array.buffer);
        console.log(`Received audio data: ${audioData.length} samples (${buffer.length} bytes) for socket: ${socket.id}`);
        audioStream.push(buffer);
      } catch (error) {
        console.error('Error sending audio data:', error);
        socket.emit('transcription-error', { error: 'Failed to process audio data' });
      }
    } else {
      console.log(`No audio stream found for socket: ${socket.id}`);
    }
  });

  socket.on('stop-recording', async () => {
    console.log('Stopping transcription for:', socket.id);
    const transcriber = activeTranscribers.get(socket.id);
    const audioStream = audioStreams.get(socket.id);
    
    if (audioStream) {
      audioStream.push(null); // End the stream
      audioStreams.delete(socket.id);
    }
    
    if (transcriber) {
      try {
        await transcriber.close();
        activeTranscribers.delete(socket.id);
        socket.emit('transcription-status', { status: 'stopped' });
      } catch (error) {
        console.error('Error stopping transcription:', error);
        socket.emit('transcription-error', { error: error.message });
      }
    }
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    const transcriber = activeTranscribers.get(socket.id);
    const audioStream = audioStreams.get(socket.id);
    
    if (audioStream) {
      audioStream.push(null); // End the stream
      audioStreams.delete(socket.id);
    }
    
    if (transcriber) {
      try {
        await transcriber.close();
        activeTranscribers.delete(socket.id);
      } catch (error) {
        console.error('Error cleaning up transcriber:', error);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 