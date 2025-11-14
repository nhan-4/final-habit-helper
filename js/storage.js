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
