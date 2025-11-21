// Service Worker for Habit Helper
// Enables background notifications even when app is closed

const CACHE_NAME = 'habit-helper-v1';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/storage.js',
    '/js/ui.js',
    '/js/swipe.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found, otherwise fetch from network
                return response || fetch(event.request);
            })
            .catch((error) => {
                console.error('[Service Worker] Fetch failed:', error);
            })
    );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push notification received');
    
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (error) {
            console.error('[Service Worker] Error parsing push data:', error);
        }
    }
    
    const title = data.title || 'Habit Helper';
    const options = {
        body: data.body || 'Time to work on your habit!',
        icon: data.icon || '/icon-192.png',
        badge: data.badge || '/badge-72.png',
        vibrate: [200, 100, 200],
        data: data,
        requireInteraction: false
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click event - open app when notification is clicked
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // If a window is already open, focus it
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise, open a new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// Helper function to get habits and tracking data from the main app
async function getHabitsFromStorage() {
    try {
        // Try to get habits from a client (main app)
        const allClients = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
        
        if (allClients.length > 0) {
            // Ask the client for habits data
            return new Promise((resolve) => {
                const messageChannel = new MessageChannel();
                messageChannel.port1.onmessage = (event) => {
                    resolve({
                        habits: event.data.habits || [],
                        trackingData: event.data.trackingData || {}
                    });
                };
                
                allClients[0].postMessage(
                    { type: 'GET_HABITS' },
                    [messageChannel.port2]
                );
                
                // Timeout after 5 seconds
                setTimeout(() => resolve({ habits: [], trackingData: {} }), 5000);
            });
        }
        
        return { habits: [], trackingData: {} };
    } catch (error) {
        console.error('[Service Worker] Error getting habits:', error);
        return { habits: [], trackingData: {} };
    }
}

// Helper function to calculate streak
function calculateStreakForHabit(habit, trackingData) {
    const today = new Date();
    let currentDate = new Date(today);
    let streak = 0;
    
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
        
        if (shouldTrackDate(currentDate)) {
            if (trackingData[dateISO] && trackingData[dateISO].completed) {
                streak++;
            } else {
                break;
            }
        }
        
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
}

// Helper function to check if notification should be sent
function shouldSendNotification(habit, currentTime, lastSentTime) {
    // Parse notification time (format: "HH:MM")
    const [hours, minutes] = habit.notificationTime.split(':').map(Number);
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentDay = currentDate.getDay();
    
    // Check if current time matches notification time (within 1 minute)
    const timeMatches = currentHours === hours && currentMinutes === minutes;
    
    if (!timeMatches) {
        return false;
    }
    
    // Check frequency
    let frequencyMatches = false;
    if (habit.frequency === 'daily') {
        frequencyMatches = true;
    } else if (habit.frequency === 'custom' && habit.daySelection) {
        frequencyMatches = habit.daySelection.includes(currentDay);
    }
    
    if (!frequencyMatches) {
        return false;
    }
    
    // Check if we already sent a notification today
    const todayISO = currentDate.toISOString().split('T')[0];
    if (lastSentTime && lastSentTime.startsWith(todayISO)) {
        return false;
    }
    
    return true;
}

// Storage for last notification times (persisted in service worker)
const lastNotificationTimes = {};

// Periodic notification check (called by periodic background sync or alarm)
async function checkAndSendNotifications() {
    console.log('[Service Worker] Checking for notifications...');
    
    try {
        const { habits, trackingData } = await getHabitsFromStorage();
        const currentTime = new Date();
        const currentTimeISO = currentTime.toISOString();
        
        for (const habit of habits) {
            // Get last sent time for this habit
            const lastSentTime = lastNotificationTimes[habit.id];
            
            if (shouldSendNotification(habit, currentTime, lastSentTime)) {
                // Get tracking data to calculate streak
                const habitTracking = trackingData[habit.id] || {};
                const streak = calculateStreakForHabit(habit, habitTracking);
                
                // Generate notification message
                let message = `${habit.name}! You're on day ${streak}!`;
                if (streak === 0) {
                    message = `Time for ${habit.name}! Let's start your streak! 🌟`;
                } else if (streak === 1) {
                    message = `${habit.name}! Great start! Keep it up! 💪`;
                } else if (streak === 7) {
                    message = `${habit.name}! 🎉 One week streak! Keep it up!`;
                } else if (streak === 30) {
                    message = `${habit.name}! 🏆 30 days! You're amazing!`;
                } else if (streak === 100) {
                    message = `${habit.name}! 🔥 100 days! Legendary!`;
                }
                
                // Show notification
                await self.registration.showNotification('Habit Helper', {
                    body: message,
                    icon: '/icon-192.png',
                    badge: '/badge-72.png',
                    vibrate: [200, 100, 200],
                    data: { habitId: habit.id, streak: streak },
                    requireInteraction: false,
                    tag: `habit-${habit.id}`
                });
                
                // Update last notification time
                lastNotificationTimes[habit.id] = currentTimeISO;
                
                console.log(`[Service Worker] Notification sent for habit: ${habit.name}`);
            }
        }
    } catch (error) {
        console.error('[Service Worker] Error checking notifications:', error);
    }
}

// Message handler for communication with main app
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data && event.data.type === 'CHECK_NOTIFICATIONS') {
        checkAndSendNotifications();
    }
});
