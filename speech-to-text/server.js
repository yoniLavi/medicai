require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AssemblyAI } = require('assemblyai');

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '.wav');
  }
});

const upload = multer({ storage: storage });

// AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || "9285148a8d754af988ca889442c37098",
});

// Transcription endpoint
app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('Transcribing file:', req.file.filename);
    
    const params = {
      audio: req.file.path,
      speech_model: "slam-1", // Latest, faster model
    };

    const transcript = await client.transcripts.transcribe(params);
    
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
    
    // Check if transcription failed
    if (transcript.status === "error") {
      console.error('Transcription failed:', transcript.error);
      throw new Error(`Transcription failed: ${transcript.error}`);
    }
    
    console.log('Transcription completed:', transcript.text);
    
    res.json({
      success: true,
      transcript: transcript.text,
      timestamp: new Date().toISOString(),
      status: transcript.status
    });

  } catch (error) {
    console.error('Error transcribing audio:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Transcription failed',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 