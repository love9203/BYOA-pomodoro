let timeLeft = null;
let isWorkTime = true;
let isRunning = false;
let timer;
let workTime;
let restTime;
let currentFocus = '';

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update timer display
    document.getElementById('timer').textContent = display;
    
    // Update status with focus task if in work mode
    if (isWorkTime) {
        document.getElementById('status').textContent = currentFocus ? 
            `Work Time - Focus: ` : 'Work Time';
        if (currentFocus) {
            const statusEl = document.getElementById('status');
            statusEl.innerHTML = `Work Time - Focus: <span class="focus-text">${currentFocus}</span>`;
        }
    } else {
        document.getElementById('status').textContent = 'Rest Time';
    }
    
    // Update browser tab title
    const state = isWorkTime ? 'Work' : 'Rest';
    document.title = `${display} - ${state} | Pomodoro Timer`;
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
    } else {
        clearInterval(timer);
        isRunning = false;
        
        // Play alarm sound
        const alarm = document.getElementById('alarmSound');
        alarm.currentTime = 0;
        alarm.play()
          .catch(e => console.log('Error playing sound:', e));
        
        // Use a non-blocking notification
        const message = isWorkTime ? 'Rest Time!' : 'Work Time!';
        
        // Switch modes
        isWorkTime = !isWorkTime;
        timeLeft = isWorkTime ? workTime : restTime;
        updateDisplay();
        
        // Optional: Use a more modern notification
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(message);
        } else {
            // Fallback to a non-blocking alert using setTimeout
            setTimeout(() => alert(message), 100);
        }
        
        startTimer();
    }
}

function startTimer() {
    if (isRunning) return;
    
    // Always prompt for focus task in work mode
    if (isWorkTime) {
        const focusTask = prompt('What would you like to focus on this session?');
        
        // If user clicks cancel or enters empty string, don't start timer
        if (!focusTask || focusTask.trim() === '') {
            return;
        }
        
        currentFocus = focusTask;
        document.getElementById('status').textContent = `Work Time - Focus: ${currentFocus}`;
    }
    
    // Get user-defined times and convert to seconds
    if (!timeLeft) {
        const workMinutes = parseInt(document.getElementById('workTime').value);
        const restMinutes = parseInt(document.getElementById('restTime').value);
        
        workTime = workMinutes * 60;
        restTime = restMinutes * 60;
        timeLeft = isWorkTime ? workTime : restTime;
    }
    
    isRunning = true;
    timer = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = null;
    isWorkTime = true;
    updateDisplay();
}

// Add this function to initialize the display
function initializeDisplay() {
    workTime = parseInt(document.getElementById('workTime').value) * 60;
    restTime = parseInt(document.getElementById('restTime').value) * 60;
    // Use the current state to determine which time to show
    timeLeft = isWorkTime ? workTime : restTime;
    updateDisplay();
}

// Add event listeners for input changes
document.getElementById('workTime').addEventListener('change', initializeDisplay);
document.getElementById('restTime').addEventListener('change', initializeDisplay);

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initializeDisplay);

// Initialize display
updateDisplay();

// Add this new function
function toggleWorkRest() {
    // Clear existing timer if running
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
    
    // Toggle state
    isWorkTime = !isWorkTime;
    
    // Reset timer for new mode
    workTime = parseInt(document.getElementById('workTime').value) * 60;
    restTime = parseInt(document.getElementById('restTime').value) * 60;
    timeLeft = isWorkTime ? workTime : restTime;
    
    // Update display and button
    updateDisplay();
    const toggleButton = document.getElementById('toggleButton');
    toggleButton.textContent = isWorkTime ? 'Rest' : 'Work';
    toggleButton.className = isWorkTime ? 'toggle-button work' : 'toggle-button rest';
}

// Request notification permission when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
});

// Add this new function
function addFiveMinutes() {
    // Only add time if timer is running
    if (!isRunning) return;
    
    timeLeft += 300; // Add 5 minutes (300 seconds)
    updateDisplay();
}