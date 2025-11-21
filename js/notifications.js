// Notification Helper Functions for Habit Helper
// Handles browser notification permissions, scheduling, and display

/**
 * Check if notifications are supported in this browser
 * @returns {boolean} True if notifications are supported
 */
function isNotificationSupported() {
    return 'Notification' in window;
}

/**
 * Get the current notification permission status
 * @returns {string} 'granted', 'denied', or 'default'
 */
function getNotificationPermission() {
    if (!isNotificationSupported()) {
        return 'denied';
    }
    return Notification.permission;
}

/**
 * Request notification permission from the user
 * @returns {Promise<string>} Permission status ('granted', 'denied', or 'default')
 */
async function requestNotificationPermission() {
    if (!isNotificationSupported()) {
        console.warn('Notifications are not supported in this browser');
        return 'denied';
    }
    
    if (Notification.permission === 'granted') {
        return 'granted';
    }
    
    if (Notification.permission === 'denied') {
        return 'denied';
    }
    
    try {
        const permission = await Notification.requestPermission();
        return permission;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return 'denied';
    }
}

/**
 * Create and display a notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 * @returns {Notification|null} Notification instance or null if failed
 */
function showNotification(title, options = {}) {
    if (!isNotificationSupported()) {
        console.warn('Notifications are not supported');
        return null;
    }
    
    if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
    }
    
    try {
        const notification = new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'habit-helper',
            requireInteraction: false,
            ...options
        });
        
        // Handle notification click
        notification.onclick = function(event) {
            event.preventDefault();
            window.focus();
            notification.close();
            
            // Call custom click handler if provided
            if (options.onClick) {
                options.onClick();
            }
        };
        
        return notification;
    } catch (error) {
        console.error('Error showing notification:', error);
        return null;
    }
}

/**
 * Create a habit reminder notification
 * @param {Object} habit - Habit object
 * @param {number} streak - Current streak
 * @returns {Notification|null} Notification instance or null
 */
function showHabitNotification(habit, streak) {
    const title = `${habit.name}!`;
    let body = '';
    
    if (streak === 0) {
        body = "Time to start your streak! Let's do this! 🌟";
    } else if (streak === 1) {
        body = "You're on day 1! Keep the momentum going! 💪";
    } else {
        body = `You're on day ${streak}! Keep up the amazing work! 🔥`;
    }
    
    // Add encouraging text based on streak
    if (streak >= 7 && streak < 30) {
        body += "\nYou're building a real habit! 🎉";
    } else if (streak >= 30 && streak < 100) {
        body += "\nYou're unstoppable! 🚀";
    } else if (streak >= 100) {
        body += "\nLegendary dedication! 🏆";
    }
    
    return showNotification(title, {
        body: body,
        onClick: () => {
            // Focus on the specific habit when clicked
            const habits = getHabits();
            const habitIndex = habits.findIndex(h => h.id === habit.id);
            if (habitIndex !== -1) {
                saveCurrentHabitIndex(habitIndex);
                location.reload();
            }
        }
    });
}

/**
 * Calculate the delay in milliseconds until the next notification time
 * @param {string} notificationTime - Time in HH:MM format (24-hour)
 * @returns {number} Delay in milliseconds, or -1 if time has passed today
 */
function calculateNotificationDelay(notificationTime) {
    if (!notificationTime) {
        return -1;
    }
    
    const [hours, minutes] = notificationTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime.getTime() <= now.getTime()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delay = scheduledTime.getTime() - now.getTime();
    return delay;
}

/**
 * Schedule a notification for a specific habit
 * @param {Object} habit - Habit object with notificationTime
 * @param {Function} callback - Optional callback after notification is shown
 * @returns {number|null} Timeout ID or null if failed
 */
function scheduleHabitNotification(habit, callback) {
    if (!habit || !habit.notificationTime) {
        console.warn('Cannot schedule notification: invalid habit or time');
        return null;
    }
    
    const delay = calculateNotificationDelay(habit.notificationTime);
    
    if (delay < 0) {
        console.warn('Notification time has passed for today');
        return null;
    }
    
    // Check if today is a scheduled day based on frequency
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    if (habit.frequency === 'custom' && habit.daySelection && habit.daySelection.length > 0) {
        if (!habit.daySelection.includes(dayOfWeek)) {
            console.log('Today is not a scheduled day for this habit');
            return null;
        }
    }
    
    console.log(`Scheduling notification for ${habit.name} in ${Math.round(delay / 1000 / 60)} minutes`);
    
    const timeoutId = setTimeout(() => {
        const currentStreak = calculateStreak(habit.id, habit);
        showHabitNotification(habit, currentStreak);
        
        if (callback) {
            callback();
        }
        
        // Schedule next notification for tomorrow
        scheduleHabitNotification(habit, callback);
    }, delay);
    
    return timeoutId;
}

/**
 * Get notification settings for a specific habit
 * @param {string} habitId - Habit ID
 * @returns {Object} Notification settings object
 */
function getNotificationSettings(habitId) {
    try {
        const settingsJSON = localStorage.getItem(`notification_settings_${habitId}`);
        return settingsJSON ? JSON.parse(settingsJSON) : { enabled: true };
    } catch (error) {
        console.error(`Error reading notification settings for habit ${habitId}:`, error);
        return { enabled: true };
    }
}

/**
 * Save notification settings for a specific habit
 * @param {string} habitId - Habit ID
 * @param {Object} settings - Settings object with enabled property
 * @returns {boolean} Success status
 */
function saveNotificationSettings(habitId, settings) {
    try {
        localStorage.setItem(`notification_settings_${habitId}`, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error(`Error saving notification settings for habit ${habitId}:`, error);
        return false;
    }
}

/**
 * Check if notifications are enabled for a specific habit
 * @param {string} habitId - Habit ID
 * @returns {boolean} True if enabled
 */
function areNotificationsEnabled(habitId) {
    const settings = getNotificationSettings(habitId);
    return settings.enabled !== false;
}

/**
 * Toggle notifications for a specific habit
 * @param {string} habitId - Habit ID
 * @returns {boolean} New enabled status
 */
function toggleNotifications(habitId) {
    const settings = getNotificationSettings(habitId);
    const newEnabled = !settings.enabled;
    saveNotificationSettings(habitId, { enabled: newEnabled });
    return newEnabled;
}

/**
 * Initialize notifications for all habits
 * Schedules notifications for habits with notifications enabled
 * @returns {Array} Array of timeout IDs
 */
function initializeNotifications() {
    const habits = getHabits();
    const timeoutIds = [];
    
    habits.forEach(habit => {
        if (areNotificationsEnabled(habit.id)) {
            const timeoutId = scheduleHabitNotification(habit);
            if (timeoutId) {
                timeoutIds.push(timeoutId);
            }
        }
    });
    
    return timeoutIds;
}

// Store timeout IDs globally for cleanup
let activeNotificationTimeouts = [];

/**
 * Start notification scheduling for all enabled habits
 */
function startNotifications() {
    // Clear any existing timeouts
    stopNotifications();
    
    // Initialize new notifications
    activeNotificationTimeouts = initializeNotifications();
    
    console.log(`Started ${activeNotificationTimeouts.length} notification schedules`);
}

/**
 * Stop all scheduled notifications
 */
function stopNotifications() {
    activeNotificationTimeouts.forEach(timeoutId => {
        clearTimeout(timeoutId);
    });
    activeNotificationTimeouts = [];
    
    console.log('Stopped all notification schedules');
}
