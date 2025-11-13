/**
 * Main Application Logic
 * Initializes the app and coordinates between storage and UI
 */

// Application state
const AppState = {
    habits: [],
    currentHabitIndex: 0,
    initialized: false
};

/**
 * Initialize the application
 */
function initApp() {
    console.log('Habit Helper - Initializing...');
    
    // Load habits from storage
    AppState.habits = HabitStorage.getHabits();
    console.log(`Loaded ${AppState.habits.length} habit(s) from storage`);
    
    // Set initialized flag
    AppState.initialized = true;
    
    // Log success
    console.log('Habit Helper - Ready! 🎉');
    console.log('Try: HabitStorage.getHabits() to test localStorage functions');
}

/**
 * Run when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Make AppState available globally for debugging
window.AppState = AppState;
