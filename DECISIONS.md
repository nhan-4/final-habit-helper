# Technical Decisions for Habit Helper App

## Platform & Deployment
- **App Type**: Website (responsive web app)
- **Data Storage**: Browser's built-in storage (localStorage)
- **Data Location**: Only on user's device (no server)

## User Input & Setup
- **Habit Input**: Users can input a habit name
- **Notification Settings**: 
  - Time of day (e.g., 9 AM)
  - Frequency (e.g., daily, every other day, 3x/week)
  - Both time AND frequency required
- **Editing**: Users can edit habits after creation (change name, time, frequency)

## Notifications & Reminders
- **Notification Type**: Browser notifications (pop-ups on phone/browser)
- **Background Execution**: App runs in background to send notifications even when website is closed
- **Delivery Method**: Browser push notifications
- **Notification Message**: Habit name + encouraging message (e.g., "Time to Exercise! You're on day 5!")
- **Notification Days**: Let users pick specific days (e.g., Mon/Wed/Fri for custom frequency)

## Home Screen Display
- **Layout**: One habit at a time
- **Navigation**: Swipe left/right to switch between habits
- **Content**: Shows current habit goal and days kept going

## Habit Tracking
- **Tracking Method**: Manual - users tap a button to check off each day
- **Completion Definition**: Any time during the day (no time-specific requirement)
- **Missed Days**: Streak breaks immediately if a day is missed
- **Multiple Habits**: Yes, users can track multiple habits simultaneously
- **Single User**: One user per browser (no multi-profile support)
- **Undo Capability**: Click/tap to undo anytime (easy undo for mistakes)
- **Tracking Page Display**: All of the above
  - Calendar view (which days completed)
  - List view (dates of completions)
  - Statistics (streaks, completion rates)
- **History Display**: Customizable (user picks what to show - last 30 days, 90 days, all history, etc.)

## Habit Management
- **Stopping Tracking**: Archive habits (hide from main view but keep data)
- **Archived Habits View**: Completely hidden, separate "Archived" section
- **Data Retention**: Forever (all history stays until manually deleted)
- **Data Deletion**: Users can delete individual day checkmarks

## Milestone Celebrations
- **Trigger Points**: Specific day counts (7 days, 30 days, 100 days, etc.)
- **Celebration Method**: 
  - Popup/modal with celebration message
  - Browser notification congratulating them
  - Both popup AND notification
- **Milestone Persistence**: Show both lifetime milestones + current streak milestones (keep achievements even if streak breaks)

## Visual Design
- **Aesthetic**: Colorful and playful (matches "cheerful, playful, and cute" vibe)
- **Dark Mode**: Light mode only

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript (vanilla, no framework)
- **Build**: From scratch (no template/boilerplate)