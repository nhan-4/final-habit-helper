/**
 * ui.js - UI management and DOM manipulation
 * Handles rendering and user interface updates
 */

/**
 * Show the habit creation form
 */
function showHabitForm() {
    const welcomeSection = document.querySelector('.welcome');
    const formSection = document.getElementById('habitForm');
    
    if (welcomeSection) {
        welcomeSection.classList.add('hidden');
    }
    if (formSection) {
        formSection.classList.remove('hidden');
    }
}

/**
 * Hide the habit creation form
 */
function hideHabitForm() {
    const welcomeSection = document.querySelector('.welcome');
    const formSection = document.getElementById('habitForm');
    
    if (welcomeSection) {
        welcomeSection.classList.remove('hidden');
    }
    if (formSection) {
        formSection.classList.add('hidden');
    }
}

/**
 * Show a success message to the user
 * @param {string} message - The success message to display
 */
function showSuccessMessage(message) {
    // Remove any existing message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new success message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

/**
 * Show an error message to the user
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
    // Remove any existing message
    const existingMessage = document.querySelector('.error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new error message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    
    // Insert at the top of the form
    const form = document.getElementById('habitForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

/**
 * Toggle day selection checkboxes visibility based on frequency
 */
function toggleDaySelection() {
    const frequencySelect = document.getElementById('frequency');
    const daySelectionDiv = document.getElementById('daySelection');
    
    if (frequencySelect && daySelectionDiv) {
        if (frequencySelect.value === 'custom') {
            daySelectionDiv.classList.remove('hidden');
        } else {
            daySelectionDiv.classList.add('hidden');
        }
    }
}

/**
 * Clear the habit form
 */
function clearHabitForm() {
    const form = document.getElementById('createHabitForm');
    if (form) {
        form.reset();
        // Hide day selection by default
        const daySelectionDiv = document.getElementById('daySelection');
        if (daySelectionDiv) {
            daySelectionDiv.classList.add('hidden');
        }
    }
}

/**
 * Initialize UI event listeners
 */
function initializeUI() {
    // Add click handler for "Create Habit" button in welcome section
    const welcomeDiv = document.querySelector('.welcome');
    if (welcomeDiv) {
        welcomeDiv.addEventListener('click', showHabitForm);
    }
    
    // Add frequency change listener
    const frequencySelect = document.getElementById('frequency');
    if (frequencySelect) {
        frequencySelect.addEventListener('change', toggleDaySelection);
    }
    
    // Add cancel button listener
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            hideHabitForm();
            clearHabitForm();
        });
    }
}
