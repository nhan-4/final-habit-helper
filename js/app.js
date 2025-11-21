// Main Application Logic for Habit Helper

// Global state
let currentHabits = [];
let currentHabitIndex = 0;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    registerServiceWorker();
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
    setupCheckOffButton(habit);
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

/**
 * Setup check-off button for the current habit
 * @param {Object} habit - The habit to setup check-off for
 */
function setupCheckOffButton(habit) {
    const checkOffBtn = document.getElementById('check-off-btn');
    const checkOffStatus = document.getElementById('check-off-status');
    
    if (!checkOffBtn || !checkOffStatus) {
        return;
    }
    
    const today = getTodayISO();
    const trackingData = getTracking(habit.id);
    const isCompletedToday = trackingData[today] && trackingData[today].completed;
    
    // Update button appearance based on completion status
    if (isCompletedToday) {
        checkOffBtn.classList.add('completed');
        checkOffBtn.querySelector('.checkoff-text').textContent = 'Completed Today!';
        checkOffStatus.textContent = 'Great job! Come back tomorrow to continue your streak.';
    } else {
        checkOffBtn.classList.remove('completed');
        checkOffBtn.querySelector('.checkoff-text').textContent = 'Mark Today Complete';
        checkOffStatus.textContent = '';
    }
    
    // Setup click handler
    checkOffBtn.onclick = function() {
        handleCheckOff(habit);
    };
}

/**
 * Handle checking off a habit for today
 * @param {Object} habit - The habit to check off
 */
function handleCheckOff(habit) {
    const today = getTodayISO();
    const trackingData = getTracking(habit.id);
    
    // Check if already completed today
    if (trackingData[today] && trackingData[today].completed) {
        // Undo completion
        trackingData[today].completed = false;
        trackingData[today].undoCount = (trackingData[today].undoCount || 0) + 1;
    } else {
        // Mark as completed
        trackingData[today] = {
            completed: true,
            undoCount: 0
        };
        
        // Save tracking data
        saveTracking(habit.id, trackingData);
        
        // Calculate new streak
        const newStreak = calculateStreak(habit.id, habit);
        
        // Check for milestone
        const milestone = checkAndSaveMilestone(habit.id, newStreak);
        
        if (milestone) {
            // Show celebration modal
            setTimeout(() => {
                showCelebrationModal(habit.name, milestone);
            }, 300); // Small delay for better UX
        }
    }
    
    // Save tracking data
    saveTracking(habit.id, trackingData);
    
    // Refresh display
    displayCurrentHabit();
}

/**
 * Register service worker for background notifications
 */
async function registerServiceWorker() {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
        console.warn('Service workers are not supported in this browser');
        return;
    }
    
    try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
        });
        
        console.log('Service Worker registered successfully:', registration);
        
        // Check for updates periodically
        setInterval(() => {
            registration.update();
        }, 60000); // Check every minute
        
        // Request notification permission if not already granted
        await requestNotificationPermission();
        
        // Set up periodic notification checks (every minute)
        setupNotificationChecks(registration);
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        
    } catch (error) {
        console.error('Service Worker registration failed:', error);
    }
}

/**
 * Request notification permission from user
 */
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('Notifications are not supported in this browser');
        return false;
    }
    
    // Check current permission status
    if (Notification.permission === 'granted') {
        console.log('Notification permission already granted');
        return true;
    }
    
    if (Notification.permission === 'denied') {
        console.warn('Notification permission denied by user');
        return false;
    }
    
    // Request permission
    try {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            console.log('Notification permission granted');
            return true;
        } else {
            console.warn('Notification permission not granted:', permission);
            return false;
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
}

/**
 * Setup periodic notification checks
 */
function setupNotificationChecks(registration) {
    // Check notifications every minute
    setInterval(() => {
        if (registration.active) {
            registration.active.postMessage({
                type: 'CHECK_NOTIFICATIONS'
            });
        }
    }, 60000); // Every 60 seconds
    
    // Also check immediately on load
    setTimeout(() => {
        if (registration.active) {
            registration.active.postMessage({
                type: 'CHECK_NOTIFICATIONS'
            });
        }
    }, 1000);
}

/**
 * Handle messages from service worker
 */
function handleServiceWorkerMessage(event) {
    console.log('Message from service worker:', event.data);
    
    if (event.data && event.data.type === 'GET_HABITS') {
        // Service worker is requesting habits data
        const habits = getHabits();
        const trackingData = {};
        
        // Collect tracking data for all habits
        habits.forEach(habit => {
            trackingData[habit.id] = getTracking(habit.id);
        });
        
        // Send data back to service worker
        event.ports[0].postMessage({
            habits: habits,
            trackingData: trackingData
        });
    }
}

// Test localStorage functions in console
console.log('Habit Helper initialized. Test storage functions:');
console.log('- getHabits()');
console.log('- saveHabits([])');
console.log('- getTracking(habitId)');
console.log('- saveTracking(habitId, {})');
