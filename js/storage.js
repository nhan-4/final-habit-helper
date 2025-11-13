/**
 * Storage Helper Functions
 * Provides localStorage wrapper functions for habit and tracking data
 */

// Storage keys
const STORAGE_KEYS = {
    HABITS: 'habits',
    TRACKING_PREFIX: 'tracking_',
    MILESTONES_PREFIX: 'milestones_'
};

/**
 * Get all habits from localStorage
 * @returns {Array} Array of habit objects
 */
function getHabits() {
    try {
        const habits = localStorage.getItem(STORAGE_KEYS.HABITS);
        return habits ? JSON.parse(habits) : [];
    } catch (error) {
        console.error('Error reading habits from localStorage:', error);
        return [];
    }
}

/**
 * Save habits array to localStorage
 * @param {Array} habits - Array of habit objects to save
 * @returns {boolean} True if successful, false otherwise
 */
function saveHabits(habits) {
    try {
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
        return true;
    } catch (error) {
        console.error('Error saving habits to localStorage:', error);
        return false;
    }
}

/**
 * Get tracking data for a specific habit
 * @param {string} habitId - The unique ID of the habit
 * @returns {Object} Object with date keys and completion data
 */
function getTracking(habitId) {
    try {
        const key = STORAGE_KEYS.TRACKING_PREFIX + habitId;
        const tracking = localStorage.getItem(key);
        return tracking ? JSON.parse(tracking) : {};
    } catch (error) {
        console.error(`Error reading tracking data for habit ${habitId}:`, error);
        return {};
    }
}

/**
 * Save tracking data for a specific habit
 * @param {string} habitId - The unique ID of the habit
 * @param {Object} trackingData - Object with date keys and completion data
 * @returns {boolean} True if successful, false otherwise
 */
function saveTracking(habitId, trackingData) {
    try {
        const key = STORAGE_KEYS.TRACKING_PREFIX + habitId;
        localStorage.setItem(key, JSON.stringify(trackingData));
        return true;
    } catch (error) {
        console.error(`Error saving tracking data for habit ${habitId}:`, error);
        return false;
    }
}

/**
 * Get milestones achieved for a specific habit
 * @param {string} habitId - The unique ID of the habit
 * @returns {Array} Array of milestone day counts achieved
 */
function getMilestones(habitId) {
    try {
        const key = STORAGE_KEYS.MILESTONES_PREFIX + habitId;
        const milestones = localStorage.getItem(key);
        return milestones ? JSON.parse(milestones) : [];
    } catch (error) {
        console.error(`Error reading milestones for habit ${habitId}:`, error);
        return [];
    }
}

/**
 * Save milestones for a specific habit
 * @param {string} habitId - The unique ID of the habit
 * @param {Array} milestones - Array of milestone day counts
 * @returns {boolean} True if successful, false otherwise
 */
function saveMilestones(habitId, milestones) {
    try {
        const key = STORAGE_KEYS.MILESTONES_PREFIX + habitId;
        localStorage.setItem(key, JSON.stringify(milestones));
        return true;
    } catch (error) {
        console.error(`Error saving milestones for habit ${habitId}:`, error);
        return false;
    }
}

// Make functions available globally
window.HabitStorage = {
    getHabits,
    saveHabits,
    getTracking,
    saveTracking,
    getMilestones,
    saveMilestones
};
