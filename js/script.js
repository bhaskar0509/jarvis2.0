// JavaScript code with greeting handling

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
const content = document.querySelector('.content') // Flag to check if greeting is in progress




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

// Stop the glowing effect and start listening when the button is clicked
btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    btn.classList.remove('glow');
    recognition.start();
});

// Listen for commands after recognition starts
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    content.textContent = transcript;
    takeCommand(transcript);
};

// Function to process commands
function takeCommand(message) {
    clearTimeout(inactivityTimeout);
    clearTimeout(recognitionTimeout);

    if (isGreeting) {
        // If greeting is in progress, don't process any commands
        return;
    }

    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How may I help you today?");
        showButton();
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("stop")) {
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

// Start interaction only after user presses "Enter"
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        speak("I am Jarvis!");
        isGreeting = true; // Set greeting flag to true
        wishMe(); // Call the greeting function
        showButton();

        // Wait for the greeting to finish before allowing command processing
        setTimeout(() => {
            isGreeting = false; // Reset greeting flag after greeting is done
            recognition.start(); // Start listening for "Hello Jarvis" after greeting
        }, 3000); // Wait for 3 seconds to allow greeting to finish
    }
});

// Allow the button to restart recognition after it has been stopped
recognition.onend = () => {
    btn.classList.add('glow');
};





