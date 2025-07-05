# Speech-to-Text Web Application

A simple, modern speech-to-text web application powered by AssemblyAI with a beautiful chatbot-style interface.

## Features

- 🎤 **Simple Speech Recognition** - Record and transcribe your speech
- 💬 **Chatbot Interface** - Clean, modern chat-style UI
- 🎨 **Beautiful Design** - Gradient backgrounds and smooth animations
- 📱 **Responsive** - Works on desktop and mobile devices
- 🔊 **Audio Visualizer** - Visual feedback during recording
- ⚡ **File Upload** - Secure audio processing
- 🎯 **Accurate Transcriptions** - High-quality speech recognition

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- AssemblyAI API key
- Modern web browser with microphone access

## Installation

1. **Clone or download this project**
   ```bash
   git clone <repository-url>
   cd speech-to-text
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your AssemblyAI API key**
   
   Create a `.env` file in the project root:
   ```bash
   echo "ASSEMBLYAI_API_KEY=your_api_key_here" > .env
   ```
   
   Replace `your_api_key_here` with your actual API key from [AssemblyAI](https://www.assemblyai.com/)

## How to Run

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Set up API key (replace with your actual key)
echo "ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here" > .env

# 3. Start the server
npm start

# 4. Open browser to http://localhost:3000
```

### Detailed Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API key**
   - Get your free API key from [AssemblyAI](https://www.assemblyai.com/)
   - Create a `.env` file in the project root
   - Add: `ASSEMBLYAI_API_KEY=your_actual_api_key`

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to: `http://localhost:3000`
   - Allow microphone access when prompted

5. **Test the app**
   - Click the microphone button
   - Speak clearly
   - Watch real-time transcription appear!

## Usage

1. **Click the microphone button** to start recording
2. **Speak clearly** into your microphone
3. **Click the stop button** (red) when finished speaking
4. **Wait for transcription** to appear in the chat interface
5. **Use the trash button** to clear all transcripts

## Features Explained

### Speech Transcription
- Record your speech by clicking the microphone button
- Stop recording when finished speaking
- Transcriptions appear with timestamps and checkmarks
- High-quality transcription using AssemblyAI's universal model

### Status Indicators
- **Ready** - Application is ready to record
- **Recording...** - Currently recording audio
- **Processing...** - Preparing audio for transcription
- **Transcribing...** - Sending audio to AssemblyAI for processing
- **Completed** - Transcription finished successfully

### Audio Visualizer
- Animated bars that appear during recording
- Provides visual feedback that the microphone is active

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **File Upload**: Multer middleware
- **Speech Recognition**: AssemblyAI Transcription API
- **Audio Processing**: MediaRecorder API

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

**Note**: Requires HTTPS in production for microphone access

## Troubleshooting

### Common Issues

1. **Microphone not working**
   - Ensure microphone permissions are granted
   - Check if other applications are using the microphone
   - Try refreshing the page

2. **No transcription appearing**
   - Verify your AssemblyAI API key is correct
   - Check the browser console for errors
   - Ensure stable internet connection
   - Make sure you spoke clearly and long enough

3. **Upload issues**
   - Check if the server is running on port 3000
   - Verify no firewall is blocking the connection
   - Try restarting the server
   - Check server logs for upload errors

### Development Mode

For development with auto-reload:
```bash
npm install -g nodemon  # If not already installed
npm run dev
```

## API Key Setup

### Getting an AssemblyAI API Key

1. Go to [AssemblyAI](https://www.assemblyai.com/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key
5. Add it to your `.env` file: `ASSEMBLYAI_API_KEY=your_key_here`

### Security Note

For production use, consider:
- Using environment variables for the API key
- Implementing rate limiting
- Adding user authentication
- Using HTTPS

## File Structure

```
speech-to-text/
├── package.json          # Project dependencies
├── server.js            # Backend server with Socket.IO
├── README.md           # This file
├── .env                 # Environment variables (API key)
└── public/             # Frontend files
    ├── index.html      # Main HTML file
    ├── style.css       # Styling and animations
    └── script.js       # Frontend JavaScript
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE). 