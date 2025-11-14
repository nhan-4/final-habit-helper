// UI Helper Functions for Habit Helper
// Handles DOM manipulation and rendering

/**
 * Show a section and hide others
 * @param {string} sectionId - ID of section to show
 */
function showSection(sectionId) {
    const sections = document.querySelectorAll('main > .container > div[id]');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

/**
 * Display error message
 * @param {string} message - Error message to display
 * @param {HTMLElement} container - Container element for error
 */
function showError(message, container) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #e53e3e; background: #fff5f5; padding: 0.75rem; border-radius: 8px; margin-top: 0.5rem; font-size: 0.875rem; border: 1px solid #feb2b2;';
    
    // Remove existing error messages
    const existingError = container.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    container.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
}

/**
 * Display success message
 * @param {string} message - Success message to display
 * @param {HTMLElement} container - Container element for message
 */
function showSuccess(message, container) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = 'color: #38a169; background: #f0fff4; padding: 0.75rem; border-radius: 8px; margin-top: 0.5rem; font-size: 0.875rem; border: 1px solid #9ae6b4;';
    
    // Remove existing messages
    const existingMessage = container.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    container.appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => successDiv.remove(), 3000);
}

/**
 * Toggle visibility of day selection checkboxes
 * @param {string} frequency - Selected frequency value
 */
function toggleDaySelection(frequency) {
    const daySelection = document.getElementById('day-selection');
    if (daySelection) {
        daySelection.style.display = frequency === 'custom' ? 'block' : 'none';
    }
}

/**
 * Clear form inputs
 * @param {HTMLFormElement} form - Form element to clear
 */
function clearForm(form) {
    form.reset();
    toggleDaySelection('daily'); // Reset day selection visibility
}
