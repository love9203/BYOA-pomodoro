let timeLeft = null;
let isWorkTime = true;
let isRunning = false;
let timer;
let workTime;
let restTime;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update timer display
    document.getElementById('timer').textContent = display;
    document.getElementById('status').textContent = isWorkTime ? 'Work Time' : 'Rest Time';
    
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
        isWorkTime = !isWorkTime;
        timeLeft = isWorkTime ? workTime : restTime;
        updateDisplay();
        alert(isWorkTime ? 'Work Time!' : 'Rest Time!');
        startTimer();
    }
}

function startTimer() {
    if (isRunning) return;
    
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
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? workTime : restTime;
    updateDisplay();
    // Update toggle button text
    document.getElementById('toggleButton').textContent = 
        isWorkTime ? 'Switch to Rest' : 'Switch to Work';
}