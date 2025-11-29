require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Spotify token cache
let spotifyToken = null;
let tokenExpiry = null;

// Get Spotify access token
async function getSpotifyToken() {
    if (spotifyToken && tokenExpiry && Date.now() < tokenExpiry) {
        return spotifyToken;
    }

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                    ).toString('base64')
                }
            }
        );

        spotifyToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        return spotifyToken;
    } catch (error) {
        console.error('Error getting Spotify token:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Spotify');
    }
}

// Map emotions to Spotify search queries
const emotionToMusicMap = {
    happy: ['happy pop', 'feel good', 'upbeat'],
    sad: ['sad acoustic', 'melancholic', 'emotional ballad'],
    energetic: ['workout', 'edm', 'high energy'],
    calm: ['chill', 'ambient', 'peaceful'],
    angry: ['metal', 'hard rock', 'aggressive'],
    excited: ['party', 'dance', 'electronic'],
    melancholic: ['blues', 'jazz', 'slow'],
    anxious: ['meditation', 'relaxing', 'soft'],
    peaceful: ['nature sounds', 'instrumental', 'zen'],
    neutral: ['top hits', 'popular', 'trending'],
    joyful: ['uplifting', 'cheerful', 'bright'],
    tired: ['lo-fi', 'chill beats', 'relaxing'],
    romantic: ['love songs', 'romantic', 'r&b'],
    focused: ['study music', 'concentration', 'focus'],
    nostalgic: ['throwback', 'classic hits', 'retro']
};

// Analyze mood using Gemini AI
app.post('/analyze-mood', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Remove data URL prefix if present
        const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

        // Initialize Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Create prompt for mood analysis
        const prompt = `Analyze the mood/emotion of the person in this image. Respond with ONLY a single word emotion from this list: happy, sad, energetic, calm, angry, excited, melancholic, anxious, peaceful, neutral, joyful, tired, romantic, focused, nostalgic. Choose the most accurate emotion based on facial expression, body language, and overall appearance.`;

        // Generate content with image
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image
                }
            }
        ]);

        const response = await result.response;
        const mood = response.text().trim().toLowerCase();

        console.log('Detected mood:', mood);

        res.json({ mood });
    } catch (error) {
        console.error('Error analyzing mood:', error);
        res.status(500).json({ error: 'Failed to analyze mood', details: error.message });
    }
});

// Get music recommendations based on mood
app.post('/get-recommendations', async (req, res) => {
    try {
        const { mood } = req.body;

        if (!mood) {
            return res.status(400).json({ error: 'No mood provided' });
        }

        const token = await getSpotifyToken();

        // Get search queries for this mood
        const queries = emotionToMusicMap[mood.toLowerCase()] || emotionToMusicMap.neutral;

        // Search for tracks using the first query
        const searchQuery = queries[0];
        const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                q: searchQuery,
                type: 'track',
                limit: 12
            }
        });

        const tracks = searchResponse.data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            image: track.album.images[0]?.url || '',
            preview_url: track.preview_url,
            external_url: track.external_urls.spotify,
            duration_ms: track.duration_ms
        }));

        res.json({ tracks, mood });
    } catch (error) {
        console.error('Error getting recommendations:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to get music recommendations',
            details: error.response?.data || error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Mood Analyzer API is running' });
});

app.listen(PORT, () => {
    console.log(`🎵 Mood Analyzer server running on http://localhost:${PORT}`);
    console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Missing'}`);
    console.log(`🎧 Spotify: ${process.env.SPOTIFY_CLIENT_ID ? 'Configured' : 'Missing'}`);
});
