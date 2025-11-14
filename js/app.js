/**
 * app.js - Main application logic
 * Coordinates habit creation and form validation
 */

/**
 * Validate the habit form
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateHabitForm() {
    const errors = [];
    
    // Get form values
    const habitName = document.getElementById('habitName').value.trim();
    const notificationTime = document.getElementById('notificationTime').value;
    const frequency = document.getElementById('frequency').value;
    
    // Validate habit name
    if (!habitName) {
        errors.push('Please enter a habit name');
    }
    
    // Validate notification time
    if (!notificationTime) {
        errors.push('Please select a notification time');
    }
    
    // Validate day selection for custom frequency
    if (frequency === 'custom') {
        const checkedDays = document.querySelectorAll('input[name="days"]:checked');
        if (checkedDays.length === 0) {
            errors.push('Please select at least one day for custom frequency');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Get selected days from checkboxes
 * @returns {Array} Array of day numbers (0=Sunday, 6=Saturday)
 */
function getSelectedDays() {
    const checkedDays = document.querySelectorAll('input[name="days"]:checked');
    return Array.from(checkedDays).map(checkbox => parseInt(checkbox.value));
}

/**
 * Create a new habit from form data
 * @returns {Object|null} Habit object or null if validation fails
 */
function createHabitFromForm() {
    // Validate form
    const validation = validateHabitForm();
    if (!validation.isValid) {
        showErrorMessage(validation.errors.join('. '));
        return null;
    }
    
    // Get form values
    const habitName = document.getElementById('habitName').value.trim();
    const notificationTime = document.getElementById('notificationTime').value;
    const frequency = document.getElementById('frequency').value;
    
    // Create habit object
    const habit = {
        id: generateHabitId(),
        name: habitName,
        createdDate: getTodayISO(),
        notificationTime: notificationTime,
        frequency: frequency,
        daySelection: frequency === 'custom' ? getSelectedDays() : []
    };
    
    return habit;
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleHabitFormSubmit(event) {
    event.preventDefault();
    
    // Create habit from form
    const newHabit = createHabitFromForm();
    if (!newHabit) {
        return; // Validation failed
    }
    
    // Get existing habits
    const habits = getHabits();
    
    // Add new habit
    habits.push(newHabit);
    
    // Save to localStorage
    const saved = saveHabits(habits);
    
    if (saved) {
        // Show success message
        showSuccessMessage(`Great! "${newHabit.name}" habit created successfully! 🎉`);
        
        // Clear and hide form
        clearHabitForm();
        hideHabitForm();
        
        // Log for debugging
        console.log('Habit created:', newHabit);
        console.log('All habits:', habits);
    } else {
        showErrorMessage('Failed to save habit. Please try again.');
    }
}

/**
 * Initialize the application
 */
function initializeApp() {
    // Initialize UI event listeners
    initializeUI();
    
    // Add form submit listener
    const form = document.getElementById('createHabitForm');
    if (form) {
        form.addEventListener('submit', handleHabitFormSubmit);
    }
    
    // Check if habits exist
    const habits = getHabits();
    console.log('Loaded habits on startup:', habits);
    
    // If habits exist, we could show them here (for future phases)
    // For now, just show the welcome screen
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
