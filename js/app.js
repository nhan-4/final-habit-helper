// Main Application Logic for Habit Helper

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Get DOM elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const homeScreen = document.getElementById('home-screen');
    const habitFormScreen = document.getElementById('habit-form-screen');
    const showFormBtn = document.getElementById('show-create-form-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const habitForm = document.getElementById('habit-form');
    const frequencySelect = document.getElementById('frequency');
    
    // Check if there are existing habits
    const habits = getHabits();
    
    if (habits.length > 0) {
        // Show home screen with first habit
        const firstHabit = habits[0];
        const streak = calculateStreak(firstHabit.id, firstHabit);
        
        renderHomeScreen(firstHabit, streak);
        
        // Hide welcome screen and show home screen
        welcomeScreen.style.display = 'none';
        homeScreen.style.display = 'block';
    } else {
        // Show welcome screen for new users
        welcomeScreen.style.display = 'block';
        homeScreen.style.display = 'none';
    }
    
    // Event Listeners
    showFormBtn.addEventListener('click', function() {
        welcomeScreen.style.display = 'none';
        habitFormScreen.style.display = 'block';
    });
    
    cancelBtn.addEventListener('click', function() {
        habitFormScreen.style.display = 'none';
        
        // Return to appropriate screen based on habits
        const currentHabits = getHabits();
        if (currentHabits.length > 0) {
            homeScreen.style.display = 'block';
        } else {
            welcomeScreen.style.display = 'block';
        }
        
        clearForm(habitForm);
    });
    
    // Toggle day selection based on frequency
    frequencySelect.addEventListener('change', function() {
        toggleDaySelection(this.value);
    });
    
    // Form submission
    habitForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Handle habit form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formMessages = document.getElementById('form-messages');
    const habitForm = document.getElementById('habit-form');
    
    // Get form values
    const habitName = document.getElementById('habit-name').value.trim();
    const notificationTime = document.getElementById('notification-time').value;
    const frequency = document.getElementById('frequency').value;
    
    // Validate habit name
    if (!habitName) {
        showError('Please enter a habit name', formMessages);
        return;
    }
    
    // Validate notification time
    if (!notificationTime) {
        showError('Please select a notification time', formMessages);
        return;
    }
    
    // Get selected days if custom frequency
    let daySelection = [];
    if (frequency === 'custom') {
        const checkedDays = document.querySelectorAll('input[name="day"]:checked');
        daySelection = Array.from(checkedDays).map(cb => parseInt(cb.value));
        
        if (daySelection.length === 0) {
            showError('Please select at least one day', formMessages);
            return;
        }
    }
    
    // Create habit object
    const habit = {
        id: generateHabitId(),
        name: habitName,
        createdDate: getTodayISO(),
        notificationTime: notificationTime,
        frequency: frequency,
        daySelection: daySelection
    };
    
    // Save habit to localStorage
    const habits = getHabits();
    habits.push(habit);
    
    if (saveHabits(habits)) {
        showSuccess('Habit created successfully!', formMessages);
        
        // Clear form and redirect after brief delay
        setTimeout(() => {
            clearForm(habitForm);
            // TODO: Phase 3 - Redirect to home screen showing the new habit
            location.reload();
        }, 1500);
    } else {
        showError('Failed to save habit. Please try again.', formMessages);
    }
}

// Test localStorage functions in console
console.log('Habit Helper initialized. Test storage functions:');
console.log('- getHabits()');
console.log('- saveHabits([])');
console.log('- getTracking(habitId)');
console.log('- saveTracking(habitId, {})');
