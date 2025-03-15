// Elements
timeDisplay = document.querySelector("#time");
startToggle = document.querySelector("#start-toggle");
modeButtons = document.querySelectorAll("#buttons button");

// Default values
duration = 25 * 60;  // Default Pomodoro time in seconds
isRunning = false;
wasPaused = false;
startTime = null;
pauseTime = null;
elapsedTime = 0;  // Track the time elapsed during the session

// Load state from localStorage
function loadState() {
    savedState = JSON.parse(localStorage.getItem("pomodoroState"));
    if (savedState) {
        isRunning = savedState.isRunning;
        startTime = savedState.startTime;
        pauseTime = savedState.pauseTime;
        duration = savedState.duration;
        wasPaused = savedState.wasPaused;
        elapsedTime = savedState.elapsedTime;

        if (isRunning && startTime) {
            // Calculate time left based on the start time and elapsed time
            let timeLeft = duration - Math.floor((Date.now() - startTime) / 1000);
            if (timeLeft <= 0) {
                timeLeft = 0;
                isRunning = false;
                wasPaused = false;
            }
            timeDisplay.textContent = formatTime(timeLeft);
        } else if (wasPaused && pauseTime) {
            // If paused, calculate the remaining time from pause
            let timeLeft = duration - elapsedTime;
            timeDisplay.textContent = formatTime(timeLeft);
        } else {
            timeDisplay.textContent = formatTime(duration);
        }

        updateButtonText();
    }
}

// Save the current state to localStorage
function saveState() {
    localStorage.setItem("pomodoroState", JSON.stringify({
        isRunning,
        startTime,
        pauseTime,
        duration,
        wasPaused,
        elapsedTime
    }));
}

// Log session actions (start, pause, complete)
function logSession(action) {
    sessions = JSON.parse(localStorage.getItem("pomodoroSessions")) || [];
    sessions.push({ action, time: new Date().toISOString() });
    localStorage.setItem("pomodoroSessions", JSON.stringify(sessions));
}

// Format seconds into MM:SS format
function formatTime(seconds) {
    mins = Math.floor(seconds / 60);
    secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Update the start button text
function updateButtonText() {
    if (isRunning) {
        startToggle.textContent = "Pause";
    } else if (wasPaused) {
        startToggle.textContent = "Resume";
    } else {
        startToggle.textContent = "Start";
    }
}

// Start or resume the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        wasPaused = false;
        logSession("start");

        if (!startTime || wasPaused) {
            startTime = Date.now() - elapsedTime * 1000; // Adjust start time if resuming from pause
            pauseTime = null;
        }

        saveState();
        updateButtonText();
        updateTime();
    }
}

// Pause the timer
function stopTimer() {
    if (isRunning) {
        isRunning = false;
        wasPaused = true;
        pauseTime = Date.now();
        elapsedTime = Math.floor((pauseTime - startTime) / 1000); // Store elapsed time at pause
        saveState();
        updateButtonText();
    }
}

// Update the timer display in real-time
function updateTime() {
    if (!isRunning) return;

    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timeLeft = duration - elapsedTime;

    if (timeLeft <= 0) {
        timeLeft = 0;
        isRunning = false;
        wasPaused = false;
        logSession("complete");
        updateButtonText();
    }

    timeDisplay.textContent = formatTime(timeLeft);
    saveState();

    requestAnimationFrame(updateTime); // Continue updating the time
}

// Handle button clicks for Start/Pause
startToggle.addEventListener("click", function () {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

// Handle mode changes (Pomodoro, Focus, Break)
modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        stopTimer();
        wasPaused = false;
        updateButtonText();

        switch (this.textContent) {
            case "Pomodoro":
                duration = 25 * 60;
                break;
            case "Focus":
                duration = 50 * 60;
                break;
            case "Break":
                duration = 5 * 60;
                break;
        }

        startTime = null;
        pauseTime = null;
        elapsedTime = 0;
        timeDisplay.textContent = formatTime(duration);
        saveState();
    });
});

// Sync across multiple tabs
window.addEventListener("storage", function (event) {
    if (event.key === "pomodoroState") {
        loadState();
    }
});

// Initialize state on load
loadState();
