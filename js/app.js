// Main Application Logic for Habit Helper

// Global state
let currentHabits = [];
let currentHabitIndex = 0;

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
    
    // Load habits and current index
    currentHabits = getHabits();
    currentHabitIndex = getCurrentHabitIndex();
    
    // Ensure index is valid
    if (currentHabitIndex >= currentHabits.length) {
        currentHabitIndex = 0;
        saveCurrentHabitIndex(0);
    }
    
    if (currentHabits.length > 0) {
        // Show home screen with current habit
        displayCurrentHabit();
        
        // Hide welcome screen and show home screen
        welcomeScreen.style.display = 'none';
        homeScreen.style.display = 'block';
        
        // Initialize swipe navigation
        initializeSwipeNavigation(
            homeScreen,
            handleSwipeLeft,
            handleSwipeRight
        );
        
        // Add click handlers for navigation arrows
        setupNavigationHandlers();
        
        // Initialize notifications
        initializeNotificationUI();
        checkAndRequestNotificationPermission();
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
        currentHabits = getHabits();
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
 * Check and request notification permission if needed
 */
async function checkAndRequestNotificationPermission() {
    if (!isNotificationSupported()) {
        console.warn('Notifications are not supported in this browser');
        return;
    }
    
    const permission = getNotificationPermission();
    
    if (permission === 'default') {
        // Show a friendly banner to request permission
        showNotificationPermissionBanner();
    } else if (permission === 'granted') {
        // Start scheduling notifications
        startNotifications();
    }
}

/**
 * Show a banner to request notification permission
 */
function showNotificationPermissionBanner() {
    const homeScreen = document.getElementById('home-screen');
    const notificationSettings = document.getElementById('notification-settings');
    
    if (!homeScreen || !notificationSettings) {
        return;
    }
    
    // Check if banner already exists
    if (document.getElementById('permission-banner')) {
        return;
    }
    
    const banner = document.createElement('div');
    banner.id = 'permission-banner';
    banner.className = 'permission-banner';
    banner.innerHTML = `
        <p>🔔 Enable notifications to get reminders for your habits!</p>
        <button id="enable-notifications-btn" class="btn btn-primary">Enable Notifications</button>
    `;
    
    // Insert before notification settings
    homeScreen.insertBefore(banner, notificationSettings);
    
    // Add click handler
    document.getElementById('enable-notifications-btn').addEventListener('click', async function() {
        const permission = await requestNotificationPermission();
        
        if (permission === 'granted') {
            banner.remove();
            startNotifications();
            
            // Show success message
            const container = document.createElement('div');
            container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;';
            showSuccess('Notifications enabled! 🎉', container);
            document.body.appendChild(container);
            setTimeout(() => container.remove(), 3000);
        } else {
            // Show error
            const container = document.createElement('div');
            container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;';
            showError('Permission denied. You can enable notifications in browser settings.', container);
            document.body.appendChild(container);
            setTimeout(() => container.remove(), 5000);
        }
    });
}

/**
 * Update notification UI for the current habit
 * @param {Object} habit - Current habit object
 */
function updateNotificationUI(habit) {
    const notificationToggle = document.getElementById('notification-toggle');
    
    if (!notificationToggle || !habit) {
        return;
    }
    
    // Update toggle state based on saved settings
    const enabled = areNotificationsEnabled(habit.id);
    notificationToggle.checked = enabled;
}

/**
 * Initialize notification UI elements
 */
function initializeNotificationUI() {
    const notificationToggle = document.getElementById('notification-toggle');
    const testNotificationBtn = document.getElementById('test-notification-btn');
    
    if (!notificationToggle || !testNotificationBtn) {
        return;
    }
    
    // Get current habit
    const habit = currentHabits[currentHabitIndex];
    if (!habit) {
        return;
    }
    
    // Set toggle state based on saved settings
    const enabled = areNotificationsEnabled(habit.id);
    notificationToggle.checked = enabled;
    
    // Handle toggle change
    notificationToggle.addEventListener('change', function() {
        const newEnabled = toggleNotifications(habit.id);
        
        if (newEnabled) {
            // Re-initialize notifications
            startNotifications();
            
            const container = document.createElement('div');
            container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;';
            showSuccess('Notifications enabled for this habit', container);
            document.body.appendChild(container);
            setTimeout(() => container.remove(), 2000);
        } else {
            // Stop notifications for this habit
            stopNotifications();
            
            const container = document.createElement('div');
            container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;';
            showSuccess('Notifications disabled for this habit', container);
            document.body.appendChild(container);
            setTimeout(() => container.remove(), 2000);
        }
    });
    
    // Handle test notification button
    testNotificationBtn.addEventListener('click', async function() {
        const permission = getNotificationPermission();
        
        if (permission !== 'granted') {
            const result = await requestNotificationPermission();
            if (result !== 'granted') {
                const container = document.createElement('div');
                container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;';
                showError('Please enable notifications to test', container);
                document.body.appendChild(container);
                setTimeout(() => container.remove(), 3000);
                return;
            }
        }
        
        // Show test notification
        const streak = calculateStreak(habit.id, habit);
        showHabitNotification(habit, streak);
        
        const container = document.createElement('div');
        container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;';
        showSuccess('Test notification sent! 🔔', container);
        document.body.appendChild(container);
        setTimeout(() => container.remove(), 2000);
    });
}

/**
 * Display the current habit
 */
function displayCurrentHabit() {
    if (currentHabits.length === 0) {
        return;
    }
    
    const habit = currentHabits[currentHabitIndex];
    const streak = calculateStreak(habit.id, habit);
    
    renderHomeScreen(habit, streak);
    renderNavigationIndicators(currentHabitIndex, currentHabits.length);
    updateNotificationUI(habit);
}

/**
 * Handle swipe left (next habit)
 */
function handleSwipeLeft() {
    if (currentHabits.length <= 1) {
        return;
    }
    
    const result = navigateToNextHabit(currentHabitIndex, currentHabits);
    currentHabitIndex = result.index;
    displayCurrentHabit();
}

/**
 * Handle swipe right (previous habit)
 */
function handleSwipeRight() {
    if (currentHabits.length <= 1) {
        return;
    }
    
    const result = navigateToPreviousHabit(currentHabitIndex, currentHabits);
    currentHabitIndex = result.index;
    displayCurrentHabit();
}

/**
 * Setup click handlers for navigation arrows
 */
function setupNavigationHandlers() {
    // Use event delegation since navigation elements are dynamically created
    const navContainer = document.getElementById('habit-navigation');
    if (!navContainer) {
        return;
    }
    
    navContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('nav-arrow-left')) {
            handleSwipeRight(); // Previous habit
        } else if (event.target.classList.contains('nav-arrow-right')) {
            handleSwipeLeft(); // Next habit
        }
    });
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
        
        // Request notification permission if this is the first habit
        if (habits.length === 1 && isNotificationSupported()) {
            requestNotificationPermission().then(() => {
                // Redirect after permission request
                setTimeout(() => {
                    clearForm(habitForm);
                    location.reload();
                }, 1000);
            });
        } else {
            // Clear form and redirect after brief delay
            setTimeout(() => {
                clearForm(habitForm);
                location.reload();
            }, 1500);
        }
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
