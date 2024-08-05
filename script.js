// JavaScript for Text-to-Speech Application

const textEL = document.getElementById('text');
const speakEL = document.getElementById('speak');
const pauseEL = document.getElementById('pause');
const resumeEL = document.getElementById('resume');
const stopEL = document.getElementById('stop');
const downloadEL = document.getElementById('download');
const voiceSelectEL = document.getElementById('voiceSelect');
const rateEL = document.getElementById('rate');
const pitchEL = document.getElementById('pitch');
const volumeEL = document.getElementById('volume');
const charCountEL = document.getElementById('charCount');
const livePreviewEL = document.getElementById('livePreview');
const highlightedTextEL = document.getElementById('highlightedText');
const themeSwitcherEL = document.getElementById('themeSwitcher');

let utterance;
let voices = [];
let audioBlob = null;

// Custom voice name mapping
const voiceNameMapping = {
    "Google UK English Female": "English Female",
    "Google UK English Male": "English Male",
    "Google US English": "US English",
    "Microsoft David Desktop - English (United States)": "David",
    "Microsoft Zira Desktop - English (United States)": "Zira",
    "Google Urdu": "Urdu",
    "Microsoft Urdu Desktop": "Urdu (Microsoft)",
    // Add more mappings as needed
};

// Load saved text and voice from localStorage
window.addEventListener('load', () => {
    textEL.value = localStorage.getItem('savedText') || '';
    updateCharCount();
    updateLivePreview();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    const savedVoiceIndex = localStorage.getItem('selectedVoiceIndex');
    if (savedVoiceIndex !== null) {
        voiceSelectEL.selectedIndex = savedVoiceIndex;
    }
});

// Update character count and live preview
textEL.addEventListener('input', () => {
    updateCharCount();
    updateLivePreview();
    localStorage.setItem('savedText', textEL.value);
});

// Update live text preview with highlighting
function updateLivePreview() {
    highlightedTextEL.textContent = textEL.value;
}

// Speak text
speakEL.addEventListener('click', () => {
    if (textEL.value.trim() === "") return;

    window.speechSynthesis.cancel();

    utterance = new SpeechSynthesisUtterance(textEL.value);
    utterance.voice = voices[voiceSelectEL.value];
    utterance.rate = rateEL.value;
    utterance.pitch = pitchEL.value;
    utterance.volume = volumeEL.value;

    utterance.onstart = () => {
        speakEL.querySelector('i').classList.add('blinking');
    };

    utterance.onend = () => {
        speakEL.querySelector('i').classList.remove('blinking');
        // Update download link if needed
    };

    window.speechSynthesis.speak(utterance);

    // Update button states
    pauseEL.querySelector('i').classList.remove('blinking');
    resumeEL.querySelector('i').classList.remove('blinking');
    stopEL.querySelector('i').classList.remove('blinking');
});

// Pause speaking
pauseEL.addEventListener('click', () => {
    window.speechSynthesis.pause();
    pauseEL.querySelector('i').classList.add('blinking');
    resumeEL.querySelector('i').classList.remove('blinking');
    stopEL.querySelector('i').classList.remove('blinking');
});

// Resume speaking
resumeEL.addEventListener('click', () => {
    window.speechSynthesis.resume();
    resumeEL.querySelector('i').classList.add('blinking');
    pauseEL.querySelector('i').classList.remove('blinking');
    stopEL.querySelector('i').classList.remove('blinking');
});

// Stop speaking
stopEL.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    stopEL.querySelector('i').classList.add('blinking');
    pauseEL.querySelector('i').classList.remove('blinking');
    resumeEL.querySelector('i').classList.remove('blinking');
});

// Load available voices
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelectEL.innerHTML = '';
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        const voiceName = voiceNameMapping[voice.name] || voice.name;
        option.value = index;
        option.textContent = `${voiceName} (${voice.lang})`;
        voiceSelectEL.appendChild(option);
    });

    const savedVoiceIndex = localStorage.getItem('selectedVoiceIndex');
    if (savedVoiceIndex !== null) {
        voiceSelectEL.selectedIndex = savedVoiceIndex;
    }
}

// Update character count display
function updateCharCount() {
    charCountEL.textContent = `Character Count: ${textEL.value.length}`;
}

// Save the selected voice index to localStorage
voiceSelectEL.addEventListener('change', () => {
    localStorage.setItem('selectedVoiceIndex', voiceSelectEL.selectedIndex);
});

// Theme switching functionality
themeSwitcherEL.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeSwitcherEL.textContent = document.body.classList.contains('dark-theme') ? 'Switch to Light Theme' : 'Switch to Dark Theme';
});

// Initialize tooltips
document.querySelectorAll('[title]').forEach(elem => {
    new bootstrap.Tooltip(elem);
});

// Chatbot functionality
const chatbotButton = document.getElementById('chatbotButton');
const chatbox = document.getElementById('chatbox');
const chatboxMessages = document.getElementById('chatboxMessages');
const userInput = document.getElementById('userInput');
const sendMessageButton = document.getElementById('sendMessageButton');

const chatbotResponses = {
    "hi": "Hello! How can I assist you today?",
    "hello": "Hi there! What can I do for you?",
    "how does this website work": "This website allows you to convert text into speech. Simply enter your text, choose a voice, and click on the 'Speak' button!",
    "i need help": "Sure, I am here to help. You can ask me about the features of this website or how to use the text-to-speech feature.",
    "features": "This website offers text-to-speech conversion, voice selection, and speed adjustment. You can choose different voices and control the speed of the speech.",
    "contact": "You can contact us via email at support@example.com or through our contact form on the website.",
    "goodbye": "Goodbye! Have a great day!",
    "aoa": "Walikum Assalam! Have a great day!",
    "assalamualikum": "Walikum Assalam! kesy hain ap!",
    "jazakallah": "Bht bht Shukriya!!",
    "may theek hu": "ye to bht achi bt hy, may kesy apki madad kr skta hu",
    "thanks": "You are Welcome",
    // Add more questions and answers here...
};

chatbotButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (chatbox.classList.contains('hide')) {
        chatbox.classList.remove('hide');
        chatbox.classList.add('show');
        chatbox.style.display = 'flex';
    } else {
        chatbox.classList.remove('show');
        chatbox.classList.add('hide');
        setTimeout(() => chatbox.style.display = 'none', 300);
    }
});

sendMessageButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim().toLowerCase();
    if (userMessage) {
        addMessage('ME', userInput.value);
        userInput.value = '';

        let botReply = chatbotResponses[userMessage] || "I'm not sure I understand. Can you rephrase?";
        setTimeout(() => addMessage('AI', botReply), 500);
    }
});

function addMessage(sender, text) {
    const message = document.createElement('div');
    message.classList.add('message', sender.toLowerCase());

    if (sender === 'ME') {
        message.textContent = `ME: ${text}`;
    } else if (sender === 'AI') {
        const aiIcon = document.createElement('i');
        aiIcon.classList.add('fas', 'fa-robot');
        message.appendChild(aiIcon);
        message.appendChild(document.createTextNode(` AI: ${text}`));
    }

    chatboxMessages.appendChild(message);
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
}

document.addEventListener('click', (event) => {
    if (chatbox.style.display === 'flex' && !chatbox.contains(event.target) && !chatbotButton.contains(event.target)) {
        chatbox.classList.remove('show');
        chatbox.classList.add('hide');
        setTimeout(() => chatbox.style.display = 'none', 300);
    }
});
