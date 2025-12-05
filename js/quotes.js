// Motivational Quotes System for Habit Helper
// Provides random encouraging messages to keep users motivated

/**
 * Collection of motivational quotes organized by category
 */
const MOTIVATIONAL_QUOTES = {
    general: [
        "You're doing amazing! Keep going! 💪",
        "Every day is a new opportunity to grow! 🌱",
        "Small steps lead to big changes! 🚀",
        "You've got this! Believe in yourself! ⭐",
        "Progress, not perfection! 🎯",
        "One day at a time, you're crushing it! 🔥",
        "Your consistency is inspiring! 🌟",
        "Keep up the fantastic work! 🎉",
        "You're building something great! 🏗️",
        "Every effort counts! You're doing great! 💖"
    ],
    
    morning: [
        "Good morning! Today is a fresh start! ☀️",
        "Rise and shine! Let's make today count! 🌅",
        "New day, new possibilities! 🌈",
        "Start your day with intention! 🌸",
        "Morning is your canvas—paint it well! 🎨"
    ],
    
    evening: [
        "Great job today! Rest well! 🌙",
        "You made it through another day! 🌟",
        "Reflect on your wins today! 🏆",
        "Tomorrow is another chance to shine! ✨",
        "Rest and recharge for tomorrow! 💤"
    ],
    
    streak: [
        "Your streak is proof of your dedication! 🔥",
        "Look at that streak! You're unstoppable! 🚀",
        "Consistency is your superpower! ⚡",
        "Your commitment is inspiring! 🌟",
        "That's what determination looks like! 💪"
    ],
    
    encouragement: [
        "Don't give up! You're stronger than you think! 💪",
        "It's okay to have tough days. Keep going! 🌈",
        "You're making progress, even on hard days! 🌱",
        "Believe in your journey! 🗺️",
        "You're capable of amazing things! ⭐",
        "Every small win matters! 🎯",
        "You're not alone in this journey! 🤝",
        "Progress takes time, and you're doing great! ⏰"
    ]
};

/**
 * Get a random quote from a specific category
 * @param {string} category - Quote category (general, morning, evening, streak, encouragement)
 * @returns {string} Random quote from the category
 */
function getRandomQuote(category = 'general') {
    const quotes = MOTIVATIONAL_QUOTES[category] || MOTIVATIONAL_QUOTES.general;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

/**
 * Get a contextual quote based on time of day and streak
 * @param {number} streak - Current streak count
 * @returns {string} Contextually appropriate quote
 */
function getContextualQuote(streak = 0) {
    const hour = new Date().getHours();
    
    // Morning quotes (5 AM - 11 AM)
    if (hour >= 5 && hour < 12) {
        return getRandomQuote('morning');
    }
    
    // Evening quotes (6 PM - 10 PM)
    if (hour >= 18 && hour < 22) {
        return getRandomQuote('evening');
    }
    
    // Streak celebration quotes (if streak is significant)
    if (streak >= 7) {
        return getRandomQuote('streak');
    }
    
    // Default to general motivational quotes
    return getRandomQuote('general');
}

/**
 * Get a quote for the daily notification message
 * @param {string} habitName - Name of the habit
 * @param {number} streak - Current streak
 * @returns {string} Formatted notification message with quote
 */
function getNotificationQuote(habitName, streak) {
    const quote = getContextualQuote(streak);
    return `${habitName}! You're on day ${streak}! ${quote}`;
}

/**
 * Display a random quote in the UI
 * @param {HTMLElement} element - DOM element to display quote in
 * @param {string} category - Optional category to pull quote from
 */
function displayQuote(element, category = null) {
    if (!element) return;
    
    const quote = category ? getRandomQuote(category) : getContextualQuote();
    element.textContent = quote;
    element.classList.add('quote-fade-in');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        element.classList.remove('quote-fade-in');
    }, 500);
}

/**
 * Get quote of the day (changes daily)
 * @returns {string} Daily quote
 */
function getQuoteOfTheDay() {
    const today = new Date().toISOString().split('T')[0];
    const allQuotes = Object.values(MOTIVATIONAL_QUOTES).flat();
    
    // Use date as seed for consistent daily quote
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const index = seed % allQuotes.length;
    
    return allQuotes[index];
}
