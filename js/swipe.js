// Swipe Navigation for Habit Helper
// Handles touch events for swipe left/right navigation between habits

/**
 * Initialize swipe navigation
 * @param {HTMLElement} container - The container element to attach swipe handlers to
 * @param {Function} onSwipeLeft - Callback when user swipes left
 * @param {Function} onSwipeRight - Callback when user swipes right
 */
function initializeSwipeNavigation(container, onSwipeLeft, onSwipeRight) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    const minSwipeDistance = 50; // Minimum distance to trigger swipe (in pixels)
    const maxVerticalDistance = 100; // Maximum vertical movement allowed for horizontal swipe
    
    // Handle touch start
    container.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });
    
    // Handle touch end
    container.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        
        handleSwipe();
    }, { passive: true });
    
    /**
     * Determine swipe direction and trigger appropriate callback
     */
    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Check if horizontal movement is significant enough
        if (Math.abs(deltaX) < minSwipeDistance) {
            return; // Not a significant swipe
        }
        
        // Check if vertical movement is too large (probably scrolling)
        if (Math.abs(deltaY) > maxVerticalDistance) {
            return; // Too much vertical movement, likely scrolling
        }
        
        // Determine direction
        if (deltaX > 0) {
            // Swipe right (go to previous habit)
            if (onSwipeRight) {
                onSwipeRight();
            }
        } else {
            // Swipe left (go to next habit)
            if (onSwipeLeft) {
                onSwipeLeft();
            }
        }
    }
}

/**
 * Navigate to a specific habit by index
 * @param {number} targetIndex - Index of habit to navigate to
 * @param {Array} habits - Array of all habits
 * @returns {Object|null} The habit at the target index, or null if invalid
 */
function navigateToHabit(targetIndex, habits) {
    if (!habits || habits.length === 0) {
        return null;
    }
    
    // Ensure index is within bounds
    if (targetIndex < 0 || targetIndex >= habits.length) {
        return null;
    }
    
    // Save current index
    saveCurrentHabitIndex(targetIndex);
    
    return habits[targetIndex];
}

/**
 * Navigate to the next habit
 * @param {number} currentIndex - Current habit index
 * @param {Array} habits - Array of all habits
 * @returns {Object} Object with new index and habit
 */
function navigateToNextHabit(currentIndex, habits) {
    if (!habits || habits.length === 0) {
        return { index: 0, habit: null };
    }
    
    const newIndex = (currentIndex + 1) % habits.length;
    const habit = navigateToHabit(newIndex, habits);
    
    return { index: newIndex, habit: habit };
}

/**
 * Navigate to the previous habit
 * @param {number} currentIndex - Current habit index
 * @param {Array} habits - Array of all habits
 * @returns {Object} Object with new index and habit
 */
function navigateToPreviousHabit(currentIndex, habits) {
    if (!habits || habits.length === 0) {
        return { index: 0, habit: null };
    }
    
    const newIndex = (currentIndex - 1 + habits.length) % habits.length;
    const habit = navigateToHabit(newIndex, habits);
    
    return { index: newIndex, habit: habit };
}
