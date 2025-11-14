/**
 * storage.js - localStorage helper functions for Habit Helper
 * Handles all data persistence operations
 */

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
        const habitsJson = localStorage.getItem(STORAGE_KEYS.HABITS);
        return habitsJson ? JSON.parse(habitsJson) : [];
    } catch (error) {
        console.error('Error reading habits from localStorage:', error);
        return [];
    }
}

/**
 * Save habits array to localStorage
 * @param {Array} habits - Array of habit objects to save
 * @returns {boolean} True if save was successful
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
 * @param {string} habitId - The habit ID
 * @returns {Object} Tracking data object keyed by date (YYYY-MM-DD)
 */
function getTracking(habitId) {
    try {
        const trackingJson = localStorage.getItem(STORAGE_KEYS.TRACKING_PREFIX + habitId);
        return trackingJson ? JSON.parse(trackingJson) : {};
    } catch (error) {
        console.error('Error reading tracking data from localStorage:', error);
        return {};
    }
}

/**
 * Save tracking data for a specific habit
 * @param {string} habitId - The habit ID
 * @param {Object} trackingData - Tracking data object keyed by date
 * @returns {boolean} True if save was successful
 */
function saveTracking(habitId, trackingData) {
    try {
        localStorage.setItem(
            STORAGE_KEYS.TRACKING_PREFIX + habitId,
            JSON.stringify(trackingData)
        );
        return true;
    } catch (error) {
        console.error('Error saving tracking data to localStorage:', error);
        return false;
    }
}

/**
 * Get milestones for a specific habit
 * @param {string} habitId - The habit ID
 * @returns {Array} Array of achieved milestone day counts
 */
function getMilestones(habitId) {
    try {
        const milestonesJson = localStorage.getItem(STORAGE_KEYS.MILESTONES_PREFIX + habitId);
        return milestonesJson ? JSON.parse(milestonesJson) : [];
    } catch (error) {
        console.error('Error reading milestones from localStorage:', error);
        return [];
    }
}

/**
 * Save milestones for a specific habit
 * @param {string} habitId - The habit ID
 * @param {Array} milestones - Array of milestone day counts
 * @returns {boolean} True if save was successful
 */
function saveMilestones(habitId, milestones) {
    try {
        localStorage.setItem(
            STORAGE_KEYS.MILESTONES_PREFIX + habitId,
            JSON.stringify(milestones)
        );
        return true;
    } catch (error) {
        console.error('Error saving milestones to localStorage:', error);
        return false;
    }
}

/**
 * Generate a unique ID for a new habit
 * @returns {string} Unique ID based on timestamp
 */
function generateHabitId() {
    return 'habit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Today's date
 */
function getTodayISO() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}
