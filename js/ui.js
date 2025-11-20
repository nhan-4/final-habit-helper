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

/**
 * Render the home screen with habit data
 * @param {Object} habit - Habit object to display
 * @param {number} streak - Current streak count
 */
function renderHomeScreen(habit, streak) {
    // Update habit name
    const habitNameDisplay = document.getElementById('habit-name-display');
    if (habitNameDisplay) {
        habitNameDisplay.textContent = habit.name;
    }
    
    // Update streak number
    const streakNumber = document.getElementById('streak-number');
    if (streakNumber) {
        streakNumber.textContent = streak;
    }
    
    // Update streak label (singular vs plural)
    const streakLabel = document.querySelector('.streak-label');
    if (streakLabel) {
        streakLabel.textContent = streak === 1 ? 'day streak' : 'days streak';
    }
    
    // Update streak message with encouraging text
    const streakMessage = document.getElementById('streak-message');
    if (streakMessage) {
        if (streak === 0) {
            streakMessage.textContent = "Let's get started! 🌟";
        } else if (streak === 1) {
            streakMessage.textContent = "Great start! Keep it up! 💪";
        } else if (streak < 7) {
            streakMessage.textContent = "You're building momentum! 🚀";
        } else if (streak < 30) {
            streakMessage.textContent = "Amazing consistency! 🎉";
        } else if (streak < 100) {
            streakMessage.textContent = "You're unstoppable! 🔥";
        } else {
            streakMessage.textContent = "Legendary streak! 🏆";
        }
    }
    
    // Update creation date
    const createdDateEl = document.getElementById('habit-created-date');
    if (createdDateEl) {
        const createdDate = new Date(habit.createdDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = createdDate.toLocaleDateString('en-US', options);
        createdDateEl.textContent = `Started on ${formattedDate}`;
    }
}

/**
 * Render navigation indicators for multi-habit support
 * @param {number} currentIndex - Current habit index
 * @param {number} totalHabits - Total number of habits
 */
function renderNavigationIndicators(currentIndex, totalHabits) {
    const navContainer = document.getElementById('habit-navigation');
    if (!navContainer) {
        return;
    }
    
    // Clear existing content
    navContainer.innerHTML = '';
    
    // Only show navigation if there are multiple habits
    if (totalHabits <= 1) {
        navContainer.style.display = 'none';
        return;
    }
    
    navContainer.style.display = 'flex';
    
    // Create left arrow
    const leftArrow = document.createElement('button');
    leftArrow.className = 'nav-arrow nav-arrow-left';
    leftArrow.innerHTML = '&#8249;'; // Left angle bracket
    leftArrow.setAttribute('aria-label', 'Previous habit');
    navContainer.appendChild(leftArrow);
    
    // Create dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'nav-dots';
    
    // Create dots
    for (let i = 0; i < totalHabits; i++) {
        const dot = document.createElement('span');
        dot.className = i === currentIndex ? 'nav-dot active' : 'nav-dot';
        dot.setAttribute('aria-label', `Habit ${i + 1} of ${totalHabits}`);
        dotsContainer.appendChild(dot);
    }
    
    navContainer.appendChild(dotsContainer);
    
    // Create right arrow
    const rightArrow = document.createElement('button');
    rightArrow.className = 'nav-arrow nav-arrow-right';
    rightArrow.innerHTML = '&#8250;'; // Right angle bracket
    rightArrow.setAttribute('aria-label', 'Next habit');
    navContainer.appendChild(rightArrow);
    
    // Create habit counter
    const counter = document.createElement('div');
    counter.className = 'habit-counter';
    counter.textContent = `${currentIndex + 1} of ${totalHabits}`;
    navContainer.appendChild(counter);
}
