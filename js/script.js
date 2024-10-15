
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/jarvis2.0/service-worker.js').then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
    });
}

const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

let inactivityTimeout;
let recognitionTimeout;

// Show the button initially
btn.style.display = 'block';
btn.disabled = true;

// Function to speak text using SpeechSynthesis
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

// Function to greet based on the time of the day
function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Show the glowing button
function showButton() {
    btn.style.display = 'block';
    btn.classList.add('glow');
}

// Stop the glowing effect and start listening
btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    btn.classList.remove('glow');
    recognition.start();
});

// Listen for commands
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    content.textContent = transcript;
    takeCommand(transcript);
};

// Function to process commands
function takeCommand(message) {
    clearTimeout(inactivityTimeout);
    clearTimeout(recognitionTimeout);

    // Use regular expressions for flexible command matching
    if (/hey|hello/.test(message)) {
        speak("Hello Sir, How may I help you today?");
        showButton();
    } else if (/open google/.test(message)) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (/open youtube/.test(message)) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (/stop/.test(message)) {
        speak("Goodbye, Sir.");
        recognition.stop();
        setTimeout(() => {
            location.reload();
        }, 5000);
        return;
    } else {
        speak("I didn't understand that. Could you please repeat?");
    }
}

// Start interaction after pressing "Enter"
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        speak("I am Jarvis!");
        wishMe();
        showButton();
    }
});

// Restart recognition and make the button glow
recognition.onend = () => {
    btn.classList.add('glow');
};

Key Changes:


