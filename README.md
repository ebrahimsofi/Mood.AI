# 🎵 Mood Analyzer - Music Suggester

A cyberpunk-themed web application that analyzes your mood using AI and recommends Spotify music based on your emotions.

## ✨ Features

- 📸 **Real-time Camera Capture**: Uses your webcam to capture your photo
- 🤖 **AI-Powered Emotion Detection**: Leverages Google Gemini AI to analyze facial expressions and detect emotions
- 🎧 **Smart Music Recommendations**: Fetches personalized Spotify tracks based on your detected mood
- 🌆 **Cyberpunk UI**: Stunning neon-themed interface with glitch effects, glassmorphism, and smooth animations
- ⚡ **Real-time Processing**: Fast mood analysis and instant music suggestions

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- A modern web browser with camera access
- Spotify Developer Account (for API credentials)
- Google AI Studio Account (for Gemini API key)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd project-mood.ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   The `.env` file is already created with your API keys. Make sure it contains:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3000
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Open your browser**:
   
   Navigate to `http://localhost:3000`

## 🎮 How to Use

1. **Grant Camera Permissions**: Allow the browser to access your camera when prompted
2. **Position Yourself**: Make sure your face is clearly visible in the camera preview
3. **Capture Your Mood**: Click the "SCAN EMOTION" button
4. **View Results**: See your detected emotion and personalized music recommendations
5. **Explore Music**: Click on any track card to open it in Spotify

## 🎨 Supported Emotions

The AI can detect the following emotions:

- 😊 Happy
- 😢 Sad
- ⚡ Energetic
- 😌 Calm
- 😠 Angry
- 🎉 Excited
- 😔 Melancholic
- 😰 Anxious
- ☮️ Peaceful
- 😐 Neutral
- 🌟 Joyful
- 😴 Tired
- 💕 Romantic
- 🎯 Focused
- 🕰️ Nostalgic

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**: Server framework
- **Google Generative AI SDK**: For Gemini AI integration
- **Axios**: HTTP client for Spotify API
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

### Frontend
- **HTML5**: Structure and Canvas API for image capture
- **CSS3**: Cyberpunk styling with animations
- **Vanilla JavaScript**: Camera access and API communication
- **WebRTC**: Real-time camera streaming

### APIs
- **Google Gemini AI**: Emotion detection from images
- **Spotify Web API**: Music recommendations and track data

## 📁 Project Structure

```
project-mood.ai/
├── .env                    # Environment variables (API keys)
├── .gitignore             # Git ignore file
├── package.json           # Node.js dependencies
├── server.js              # Express backend server
├── public/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Cyberpunk-themed CSS
│   └── app.js             # Frontend JavaScript
└── README.md              # This file
```

## 🔒 Security Notes

- The `.env` file contains sensitive API keys and should **NEVER** be committed to version control
- The `.gitignore` file is configured to prevent accidental commits
- For production deployment, use environment variables from your hosting platform

## 🎯 API Endpoints

### POST `/analyze-mood`
Analyzes the mood from a base64-encoded image.

**Request Body**:
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response**:
```json
{
  "mood": "happy"
}
```

### POST `/get-recommendations`
Gets Spotify music recommendations based on mood.

**Request Body**:
```json
{
  "mood": "happy"
}
```

**Response**:
```json
{
  "tracks": [
    {
      "id": "track_id",
      "name": "Track Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "image": "https://...",
      "external_url": "https://open.spotify.com/track/..."
    }
  ],
  "mood": "happy"
}
```

### GET `/health`
Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "message": "Mood Analyzer API is running"
}
```

## 🐛 Troubleshooting

### Camera not working
- Make sure you've granted camera permissions in your browser
- Check if another application is using the camera
- Try using HTTPS (required for camera access on some browsers)

### No music recommendations
- Verify your Spotify API credentials are correct
- Check if your Spotify app is in Development mode (may need to add users to allowlist)
- Ensure you have an active internet connection

### Mood detection errors
- Verify your Gemini API key is valid
- Make sure your face is clearly visible in the camera
- Check the browser console for detailed error messages

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful emotion detection
- **Spotify** for comprehensive music API
- **Orbitron** and **Rajdhani** fonts from Google Fonts

---

**Enjoy your personalized mood-based music experience! 🎵✨**
