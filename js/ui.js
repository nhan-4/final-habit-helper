/**
 * UI Helper Functions
 * Handles DOM manipulation and rendering
 */

/**
 * Show an element by removing the 'hidden' class
 * @param {HTMLElement|string} element - Element or selector
 */
function showElement(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
        el.classList.remove('hidden');
    }
}

/**
 * Hide an element by adding the 'hidden' class
 * @param {HTMLElement|string} element - Element or selector
 */
function hideElement(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
        el.classList.add('hidden');
    }
}

/**
 * Toggle element visibility
 * @param {HTMLElement|string} element - Element or selector
 */
function toggleElement(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
        el.classList.toggle('hidden');
    }
}

/**
 * Create a new DOM element with optional classes and attributes
 * @param {string} tag - HTML tag name
 * @param {Object} options - Optional configuration
 * @param {string|string[]} options.classes - CSS class(es) to add
 * @param {Object} options.attributes - Key-value pairs of attributes
 * @param {string} options.text - Text content
 * @param {string} options.html - HTML content
 * @returns {HTMLElement}
 */
function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.classes) {
        const classes = Array.isArray(options.classes) ? options.classes : [options.classes];
        element.classList.add(...classes);
    }
    
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    
    if (options.text) {
        element.textContent = options.text;
    }
    
    if (options.html) {
        element.innerHTML = options.html;
    }
    
    return element;
}

/**
 * Clear all children from an element
 * @param {HTMLElement|string} element - Element or selector
 */
function clearElement(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
        el.innerHTML = '';
    }
}

/**
 * Format a date to YYYY-MM-DD format
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
function getToday() {
    return formatDate(new Date());
}

/**
 * Show a toast/notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of message ('success', 'error', 'info')
 */
function showToast(message, type = 'info') {
    // TODO: Implement toast notification in future phases
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Make functions available globally
window.HabitUI = {
    showElement,
    hideElement,
    toggleElement,
    createElement,
    clearElement,
    formatDate,
    getToday,
    showToast
};
