# Copilot Instructions - Habit Helper App

## Project Overview
A mobile-friendly habit tracking web app that helps users build and maintain habits through notifications and progress tracking. No backend—all data stored in browser localStorage. Built with vanilla HTML/CSS/JavaScript.

## Architecture & Data Flow
- **Single-page app** with localStorage as the only data store
- **Habits object**: `{ id, name, createdDate, archivedDate?, notificationTime, frequency, daySelection }`
- **Tracking data**: `{ habitId, date, completed, undoCount }` stored as date-keyed objects
- **Data isolation**: No server—all user data stays on their device
- **Background notifications**: Service worker handles push notifications when app is closed

## Key Features to Implement

### 1. Habit Management
- **Create habit**: Name (required), time (required), frequency pattern (required, e.g., daily, Mon/Wed/Fri)
- **Edit habit**: Change name, time, or frequency after creation
- **Archive habits**: Hide from main view, move to separate "Archived" section
- **Delete habits**: Permanently remove (user confirmation needed)

### 2. Notification System
- Browser push notifications at specified times
- Message format: `"{habitName}! You're on day {streak}!"` + encouraging text
- Trigger on **both** time AND frequency match (e.g., 9 AM on Mon/Wed/Fri)
- Milestone celebrations at 7, 30, 100+ days with special notifications
- Service worker required for background execution

### 3. Habit Tracking
- Manual daily checkoff (tap button, calendar day, or list item)
- Streak resets if ANY day missed (no grace periods)
- **Undo capability**: Tap to remove a checkoff anytime
- Calendar view (visual grid of completion), list view (dates only), statistics (streaks, %complete)
- Customizable history window (last 30, 90 days, all history, etc.)

### 4. Home Screen & Navigation
- One habit displayed at a time (primary focus)
- **Swipe left/right** to navigate between habits
- Show habit name, current streak, and days kept going
- Different view for archived habits (separate section)

## Project-Specific Conventions

### Styling & Aesthetics
- **Colorful, playful, cute** visual style (not minimalist)
- Light mode only (no dark mode)
- Mobile-first responsive design (phone primary, desktop secondary)
- Celebration animations for milestones (visual feedback is important)

### Data Structure & Naming
- Habit IDs: Use consistent format (timestamp-based or UUID)
- Dates: ISO format (YYYY-MM-DD) for storage consistency
- Streaks: Calculated on-demand from tracking data (not cached)
- Milestones: Track both lifetime AND current-streak achievements (preserved even if streak breaks)

### localStorage Keys
- `habits`: Array of habit objects
- `tracking_{habitId}`: Object keyed by date (YYYY-MM-DD)
- `milestones_{habitId}`: Array of achieved milestone day counts

### Browser APIs to Leverage
- **localStorage** for persistence (no sync, no backups)
- **Notification API** for push notifications
- **Service Worker** for background notification delivery
- **Touch Events** for swipe navigation
- **requestAnimationFrame** for smooth animations

## Common Development Patterns

### Adding New Features
1. Update data structure first (localStorage keys)
2. Add UI elements to relevant view (home, tracking, settings)
3. Implement localStorage read/write helpers
4. Add notification hooks if applicable
5. Test on mobile browser (phone or devtools mobile mode)

### Storage Helper Pattern
Provide utility functions for consistent data access:
```javascript
// getHabits(), saveHabits(habits)
// getTracking(habitId), saveTracking(habitId, trackingData)
// getMilestones(habitId), saveMilestones(habitId, milestones)
```

### Service Worker Pattern
Register from main app and handle `push` events:
- Listen for notification triggers (time + frequency match)
- Calculate streak in service worker context
- Use `self.registration.showNotification()` for notifications
- Store last-sent-time to avoid duplicate notifications

### Streak Calculation
Calculate on-demand by iterating tracking data backwards from today:
- Stop at first missed day or habit creation date
- Don't cache streaks (recalculate on each view)
- Handle timezone edge cases (what is "today" for user?)

### Testing Considerations
- Test on actual phone browser (iOS Safari, Android Chrome)
- Test offline behavior (close app, reopen)
- Test notification permissions (grant/deny scenarios)
- Test swipe navigation on touch devices
- Test date/time edge cases (midnight, DST, timezone changes)
- Mock Service Worker for background notification testing

## File Structure (Recommended)
```
index.html                 # Main page
css/
  styles.css              # All styling (mobile-first)
js/
  storage.js              # localStorage helpers
  habits.js               # Habit CRUD operations
  tracking.js             # Daily tracking & streak logic
  notifications.js        # Notification scheduling & display
  ui.js                   # DOM manipulation & rendering
  swipe.js                # Touch event handlers
  milestones.js           # Milestone logic & celebrations
service-worker.js          # Background notification handler
```

## No External Dependencies
- No npm packages (build from scratch)
- No frameworks (vanilla JS only)
- No build tool (plain HTML/CSS/JS files)
- No backend/API (localStorage only)

This is a **greenfield project**—establish these patterns from the start rather than refactoring later.
