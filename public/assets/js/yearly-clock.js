const monthNeedle = document.getElementById('monthNeedle');
const dateNeedle = document.getElementById('dateNeedle');
const hourNeedle = document.getElementById('hourNeedle');
const minuteNeedle = document.getElementById('minuteNeedle');
const secondNeedle = document.getElementById('secondNeedle');

const toggleInputBoxBtn = document.getElementById('toggleInputBoxBtn');
const inputBox = document.getElementById('inputBox');

// NEW: References for digital display spans in legend
const digitalMonthDisplay = document.getElementById('digitalMonthDisplay');
const digitalDateDisplay = document.getElementById('digitalDateDisplay');
const digitalHourDisplay = document.getElementById('digitalHourDisplay');
const digitalMinuteDisplay = document.getElementById('digitalMinuteDisplay');
const digitalSecondDisplay = document.getElementById('digitalSecondDisplay');

// References for SETTING fields (editable)
const setYear = document.getElementById('setYear'); // Reference for the new year input
const setMonth = document.getElementById('setMonth');
const setDate = document.getElementById('setDate');
const setHour = document.getElementById('setHour');
const setMinute = document.getElementById('setMinute');
const setSecond = document.getElementById('setSecond');

const setCustomTimeBtn = document.getElementById('setCustomTimeBtn');
const refreshCurrentTimeBtn = document.getElementById('refreshCurrentTimeBtn');

let clockInterval; // Variable to hold the setInterval ID
let currentDisplayedTime = new Date(); // Stores the Date object currently being displayed

/**
 * Updates the clock needles based on a given Date object.
 * @param {Date} now The Date object to use for clock display.
 */
function updateClock(now) {
    // Update the global currentDisplayedTime so subsequent ticks use the correct base
    currentDisplayedTime = now;
    
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    const date = now.getDate(); // 1-31
    const month = now.getMonth(); // 0-11 (January is 0, December is 11)
    const year = now.getFullYear(); // The year from the 'now' Date object
    
    // Original line: Calculates daysInMonth. This will correctly account for leap years!
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Month needle: Original calculation (still depends on daysInMonth, which now considers 'year')
    const monthDegrees = ((month + (date - 1 + hours / 24) / daysInMonth) / 12) * 360;
    
    // --- DATE NEEDLE CALCULATION (UNCHANGED from last modification) ---
    const fractionalDayProgress = (hours / 24) + (minutes / (60 * 24)) + (seconds / (3600 * 24));
    const dateDegrees = ((date - 1 + fractionalDayProgress) / 31) * 360;
    
    // Hour needle: Original calculation (360 degrees / 24 hours, implying a 24-hour dial)
    const hourDegrees = ((hours + minutes / 60 + seconds / 3600) / 24) * 360;
    
    // Minute needle: Original calculation
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
    
    // Second needle: Original calculation
    const secondDegrees = (seconds / 60) * 360;
    
    // Apply rotations
    monthNeedle.style.transform = `translateX(-50%) rotate(${monthDegrees}deg)`;
    dateNeedle.style.transform = `translateX(-50%) rotate(${dateDegrees}deg)`;
    hourNeedle.style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
    minuteNeedle.style.transform = `translateX(-50%) rotate(${minuteDegrees}deg)`;
    secondNeedle.style.transform = `translateX(-50%) rotate(${secondDegrees}deg)`;
}

/**
 * Clears any active clock update interval.
 */
function stopClock() {
    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }
}

// Function to update the digital display in the legend
function updateDigitalDisplay(dateObj) {
    digitalMonthDisplay.textContent = String(dateObj.getMonth() + 1).padStart(2, '0');
    digitalDateDisplay.textContent = String(dateObj.getDate()).padStart(2, '0');
    digitalHourDisplay.textContent = String(dateObj.getHours()).padStart(2, '0');
    digitalMinuteDisplay.textContent = String(dateObj.getMinutes()).padStart(2, '0');
    digitalSecondDisplay.textContent = String(dateObj.getSeconds()).padStart(2, '0');
}

/**
 * Starts the clock ticking with a given initial Date object.
 * @param {Date} initialTime The Date object to start the clock from.
 */
function startClock(initialTime) {
    stopClock(); // Ensure no other intervals are running
    
    // Update immediately to the initial time
    updateClock(initialTime);
    updateDigitalDisplay(initialTime); // Update digital display immediately
    
    // Start the interval to tick every second
    clockInterval = setInterval(() => {
        initialTime.setSeconds(initialTime.getSeconds() + 1);
        updateClock(initialTime);
        updateDigitalDisplay(initialTime); // Update digital display every second
    }, 1000);
}

// Function to populate the SETTING input box fields with a given Date object (e.g., when refreshing to current time)
function populateSetInputs(dateObj) {
    setYear.value = dateObj.getFullYear(); // ADDED: Set the year input
    setMonth.value = dateObj.getMonth() + 1;
    setDate.value = dateObj.getDate();
    setHour.value = dateObj.getHours();
    setMinute.value = dateObj.getMinutes();
    setSecond.value = dateObj.getSeconds();
}

// Function to set the clock to current live time and populate ALL inputs
function setToLiveTime() {
    const now = new Date(); // Get current live time
    updateDigitalDisplay(now); // Update digital display (always running now)
    populateSetInputs(now); // Populate SETTING fields including year
    startClock(now); // Start the clock ticking from live time
}

// Event listener for "Show/Hide Input Box" button
toggleInputBoxBtn.addEventListener('click', () => {
    inputBox.classList.toggle('active');
    if (inputBox.classList.contains('active')) {
        toggleInputBoxBtn.textContent = 'Hide Time Control Panel';
        // Populate inputs with currently displayed time, including year
        populateSetInputs(currentDisplayedTime);
    } else {
        toggleInputBoxBtn.textContent = 'Show Time Control Panel';
    }
});

// Event listener for "Set Custom Time" button
setCustomTimeBtn.addEventListener('click', () => {
    // ADDED: Read year from input
    const year = parseInt(setYear.value, 10);
    const month = parseInt(setMonth.value, 10);
    const date = parseInt(setDate.value, 10);
    const hour = parseInt(setHour.value, 10);
    const minute = parseInt(setMinute.value, 10);
    const second = parseInt(setSecond.value, 10);
    
    // Crucial: Use the year from the input field to create the Date object
    const customTime = new Date(year, month - 1, date, hour, minute, second);
    
    let alertMessage = "";
    // Validate the date only if a valid Date object was created
    if (isNaN(customTime.getTime())) {
        alertMessage = "Invalid Date or Time format entered. Please use valid numbers for all fields.";
    } else if (customTime.getMonth() !== (month - 1) || customTime.getDate() !== date || customTime.getFullYear() !== year) {
        // Check if the Date object rolled over due to invalid day for month/year
        // (e.g., Feb 30th will automatically roll to March 2nd)
        alertMessage = `The date you entered (${month}/${date}/${year}) is invalid or adjusted for the specified month/year. `;
    }
    
    if (alertMessage) {
        alert(alertMessage + `The clock has adjusted to: ${customTime.toLocaleDateString()} ${customTime.toLocaleTimeString()}.`);
    }
    
    startClock(customTime);
    // After setting, update the SETTING inputs to reflect the (potentially adjusted) time
    populateSetInputs(customTime);
});

// Event listener for "Refresh to Current Time" button
refreshCurrentTimeBtn.addEventListener('click', setToLiveTime);

// Initial setup when page loads: Start the clock immediately with current time
document.addEventListener('DOMContentLoaded', setToLiveTime);

