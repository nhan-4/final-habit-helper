// Storage Helper Functions for Habit Helper
// Provides localStorage abstraction for habits and tracking data

/**
 * Retrieve all habits from localStorage
 * @returns {Array} Array of habit objects
 */
function getHabits() {
    try {
        const habitsJSON = localStorage.getItem('habits');
        return habitsJSON ? JSON.parse(habitsJSON) : [];
    } catch (error) {
        console.error('Error reading habits from localStorage:', error);
        return [];
    }
}

/**
 * Save habits array to localStorage
 * @param {Array} habits - Array of habit objects
 * @returns {boolean} Success status
 */
function saveHabits(habits) {
    try {
        localStorage.setItem('habits', JSON.stringify(habits));
        return true;
    } catch (error) {
        console.error('Error saving habits to localStorage:', error);
        return false;
    }
}

/**
 * Get tracking data for a specific habit
 * @param {string} habitId - Unique habit identifier
 * @returns {Object} Tracking data object (date-keyed)
 */
function getTracking(habitId) {
    try {
        const trackingJSON = localStorage.getItem(`tracking_${habitId}`);
        return trackingJSON ? JSON.parse(trackingJSON) : {};
    } catch (error) {
        console.error(`Error reading tracking data for habit ${habitId}:`, error);
        return {};
    }
}

/**
 * Save tracking data for a specific habit
 * @param {string} habitId - Unique habit identifier
 * @param {Object} trackingData - Tracking data object
 * @returns {boolean} Success status
 */
function saveTracking(habitId, trackingData) {
    try {
        localStorage.setItem(`tracking_${habitId}`, JSON.stringify(trackingData));
        return true;
    } catch (error) {
        console.error(`Error saving tracking data for habit ${habitId}:`, error);
        return false;
    }
}

/**
 * Generate a unique ID for a new habit
 * @returns {string} Unique identifier (timestamp-based)
 */
function generateHabitId() {
    return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} ISO date string
 */
function getTodayISO() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Calculate the current streak for a habit
 * @param {string} habitId - Unique habit identifier
 * @param {Object} habit - Habit object with frequency settings
 * @returns {number} Current streak count
 */
function calculateStreak(habitId, habit) {
    const trackingData = getTracking(habitId);
    const today = new Date();
    let currentDate = new Date(today);
    let streak = 0;
    
    // Get habit creation date
    const createdDate = new Date(habit.createdDate);
    
    // Helper function to check if a date should be tracked based on frequency
    function shouldTrackDate(date) {
        if (habit.frequency === 'daily') {
            return true;
        } else if (habit.frequency === 'custom' && habit.daySelection && habit.daySelection.length > 0) {
            const dayOfWeek = date.getDay();
            return habit.daySelection.includes(dayOfWeek);
        }
        return false;
    }
    
    // Iterate backwards from today
    while (currentDate.getTime() >= createdDate.getTime()) {
        const dateISO = currentDate.toISOString().split('T')[0];
        
        // Check if this date should be tracked based on frequency
        if (shouldTrackDate(currentDate)) {
            // Check if completed on this date
            if (trackingData[dateISO] && trackingData[dateISO].completed) {
                streak++;
            } else {
                // Streak broken - stop counting
                break;
            }
        }
        
        // Move to previous day
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
}

/**
 * Get the current habit index (for multi-habit navigation)
 * @returns {number} Current habit index (default 0)
 */
function getCurrentHabitIndex() {
    try {
        const index = localStorage.getItem('currentHabitIndex');
        return index !== null ? parseInt(index) : 0;
    } catch (error) {
        console.error('Error reading current habit index from localStorage:', error);
        return 0;
    }
}

/**
 * Save the current habit index
 * @param {number} index - Habit index to save
 * @returns {boolean} Success status
 */
function saveCurrentHabitIndex(index) {
    try {
        localStorage.setItem('currentHabitIndex', index.toString());
        return true;
    } catch (error) {
        console.error('Error saving current habit index to localStorage:', error);
        return false;
    }
}
