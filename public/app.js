// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const moodSection = document.getElementById('moodSection');
const moodText = document.getElementById('moodText');
const recommendationsSection = document.getElementById('recommendationsSection');
const tracksList = document.getElementById('tracksList');
const loadingState = document.getElementById('loadingState');
const loadingText = document.getElementById('loadingText');
const errorState = document.getElementById('errorState');
const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');

// API Configuration
const API_URL = 'http://localhost:3000';

// State
let stream = null;

// Initialize camera
async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        video.srcObject = stream;
        hideError();
    } catch (error) {
        console.error('Error accessing camera:', error);
        showError('Unable to access camera. Please grant camera permissions and reload the page.');
    }
}

// Capture photo from video
function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
}

// Show loading state
function showLoading(message = 'ANALYZING NEURAL PATTERNS...') {
    loadingText.textContent = message;
    loadingState.classList.remove('hidden');
    moodSection.classList.add('hidden');
    recommendationsSection.classList.add('hidden');
    errorState.classList.add('hidden');
}

// Hide loading state
function hideLoading() {
    loadingState.classList.add('hidden');
}

// Show error
function showError(message) {
    errorText.textContent = message;
    errorState.classList.remove('hidden');
    loadingState.classList.add('hidden');
}

// Hide error
function hideError() {
    errorState.classList.add('hidden');
}

// Analyze mood
async function analyzeMood(imageData) {
    try {
        const response = await fetch(`${API_URL}/analyze-mood`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });

        if (!response.ok) {
            throw new Error('Failed to analyze mood');
        }

        const data = await response.json();
        return data.mood;
    } catch (error) {
        console.error('Error analyzing mood:', error);
        throw error;
    }
}

// Get music recommendations
async function getRecommendations(mood) {
    try {
        const response = await fetch(`${API_URL}/get-recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mood })
        });

        if (!response.ok) {
            throw new Error('Failed to get recommendations');
        }

        const data = await response.json();
        return data.tracks;
    } catch (error) {
        console.error('Error getting recommendations:', error);
        throw error;
    }
}

// Display mood
function displayMood(mood) {
    moodText.textContent = mood.toUpperCase();
    moodSection.classList.remove('hidden');

    // Add animation
    moodText.style.animation = 'none';
    setTimeout(() => {
        moodText.style.animation = 'textGlow 2s ease-in-out infinite alternate';
    }, 10);
}

// Display recommendations
function displayRecommendations(tracks) {
    tracksList.innerHTML = '';

    if (!tracks || tracks.length === 0) {
        tracksList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">No recommendations found. Try again!</p>';
        recommendationsSection.classList.remove('hidden');
        return;
    }

    tracks.forEach(track => {
        const trackCard = document.createElement('div');
        trackCard.className = 'track-card';
        trackCard.onclick = () => window.open(track.external_url, '_blank');

        trackCard.innerHTML = `
            <img src="${track.image || 'https://via.placeholder.com/300?text=No+Image'}" 
                 alt="${track.name}" 
                 class="track-image"
                 onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            <div class="track-name" title="${track.name}">${track.name}</div>
            <div class="track-artist" title="${track.artist}">${track.artist}</div>
            <div class="track-album" title="${track.album}">${track.album}</div>
        `;

        tracksList.appendChild(trackCard);
    });

    recommendationsSection.classList.remove('hidden');
}

// Format duration
function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Main capture and analyze flow
async function handleCapture() {
    try {
        // Capture photo
        showLoading('CAPTURING IMAGE...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const imageData = capturePhoto();

        // Analyze mood
        showLoading('ANALYZING NEURAL PATTERNS...');
        const mood = await analyzeMood(imageData);

        // Display mood
        hideLoading();
        displayMood(mood);

        // Get recommendations
        showLoading('SYNTHESIZING MUSIC RECOMMENDATIONS...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const tracks = await getRecommendations(mood);

        // Display recommendations
        hideLoading();
        displayRecommendations(tracks);

        // Scroll to recommendations
        setTimeout(() => {
            recommendationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);

    } catch (error) {
        console.error('Error in capture flow:', error);
        hideLoading();
        showError('An error occurred during analysis. Please try again.');
    }
}

// Event listeners
captureBtn.addEventListener('click', handleCapture);
retryBtn.addEventListener('click', () => {
    hideError();
    handleCapture();
});

// Initialize on load
window.addEventListener('load', () => {
    initCamera();
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});
