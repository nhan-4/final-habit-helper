# Habit Helper App - Development Plan

## Overview
This plan breaks down the development of Habit Helper into manageable phases. Each phase builds on the previous one, creating a working prototype that gets progressively more feature-rich. The approach focuses on getting something visible and testable early, then iterating.

**GitHub Issues:** All phases have been converted to GitHub issues for tracking. See [Issues #1-13](https://github.com/nhan-4/final-habit-helper/issues).

---

## Phase 1: Foundation & Setup
[→ GitHub Issue #1](https://github.com/nhan-4/final-habit-helper/issues/1)
**Goal:** Create the basic project structure and verify everything works

### Tasks
1. **Create file structure**
   - `index.html` - Main HTML file
   - `css/styles.css` - All styling
   - `js/storage.js` - localStorage helper functions
   - `js/app.js` - Main application logic
   - `js/ui.js` - DOM manipulation and rendering

2. **Build basic HTML skeleton**
   - Set up HTML5 boilerplate
   - Add meta tags for mobile viewport
   - Link CSS and JS files
   - Add basic page structure (header, main content area)

3. **Add minimal CSS**
   - Reset/normalize styles
   - Mobile-first responsive layout
   - Basic typography and colors
   - Test that styles load correctly

4. **Create storage helper functions**
   - `getHabits()` - Retrieve all habits from localStorage
   - `saveHabits(habits)` - Save habits array to localStorage
   - `getTracking(habitId)` - Get tracking data for specific habit
   - `saveTracking(habitId, trackingData)` - Save tracking data
   - Test localStorage read/write in browser console

### Deliverable
A working "Hello World" page that loads correctly on mobile and desktop, with localStorage functions ready to use.

---

## Phase 2: Habit Creation
[→ GitHub Issue #2](https://github.com/nhan-4/final-habit-helper/issues/2)

**Goal:** Let users create and save their first habit

### Tasks
1. **Build habit creation form**
   - Habit name input field (text)
   - Notification time picker (time input)
   - Frequency selector (daily, custom days)
   - Day selection checkboxes (Mon-Sun) for custom frequency
   - Submit button

2. **Add form validation**
   - Require habit name (non-empty)
   - Require notification time
   - Require at least one day selected if custom frequency
   - Show error messages for invalid input

3. **Implement habit data structure**
   ```javascript
   {
     id: timestamp or UUID,
     name: "Exercise",
     createdDate: "2025-11-13",
     notificationTime: "09:00",
     frequency: "daily" or "custom",
     daySelection: [1,3,5] // Mon, Wed, Fri (0=Sun, 6=Sat)
   }
   ```

4. **Save habit to localStorage**
   - Generate unique ID for new habit
   - Store creation date as ISO format (YYYY-MM-DD)
   - Save to habits array in localStorage
   - Clear form after successful save

5. **Add basic UI feedback**
   - Show success message after creating habit
   - Redirect to home screen showing the new habit

### Deliverable
A functional form that saves habits to localStorage and persists across page refreshes.

---

## Phase 3: Home Screen Display
[→ GitHub Issue #3](https://github.com/nhan-4/final-habit-helper/issues/3)

**Goal:** Display the user's habit with current streak

### Tasks
1. **Build home screen layout**
   - Large habit name display
   - Streak counter ("Day X" or "X days strong!")
   - Creation date ("Started on...")
   - Visual indicator if no habit exists yet

2. **Implement habit retrieval**
   - Load habits from localStorage on page load
   - Handle empty state (no habits yet)
   - Display first habit by default

3. **Calculate current streak**
   - Create `calculateStreak(habitId)` function
   - Iterate backwards from today through tracking data
   - Stop at first missed day or creation date
   - Handle frequency pattern (only count expected days)
   - Return streak count (0 if never completed or broken)

4. **Add "Create Habit" button**
   - Show prominent button if no habits exist
   - Toggle between form view and home view

5. **Style the home screen**
   - Colorful, playful design
   - Large, readable text
   - Encouraging visual elements
   - Mobile-optimized layout

### Deliverable
A home screen that displays the user's habit and calculates their current streak accurately.

---

## Phase 4: Daily Check-Off & Tracking
[→ GitHub Issue #4](https://github.com/nhan-4/final-habit-helper/issues/4)

**Goal:** Let users mark days complete and track progress

### Tasks
1. **Create check-off button**
   - Large, tappable button ("Mark Today Complete" or checkmark icon)
   - Show current date
   - Different state if already completed today

2. **Implement tracking data structure**
   ```javascript
   // Stored as tracking_{habitId}
   {
     "2025-11-13": { completed: true, undoCount: 0 },
     "2025-11-14": { completed: true, undoCount: 1 }
   }
   ```

3. **Save completion to localStorage**
   - Get today's date in ISO format
   - Check if habit should be tracked today (based on frequency)
   - Mark as completed in tracking data
   - Update UI immediately (show new streak)

4. **Add undo functionality**
   - Allow user to uncheck today or any past day
   - Update tracking data (set completed: false or remove entry)
   - Increment undoCount for audit purposes
   - Recalculate streak after undo

5. **Visual feedback for completion**
   - Animate button on tap (celebration effect)
   - Show updated streak immediately
   - Change button appearance when already completed

6. **Handle edge cases**
   - What if user checks off on wrong day?
   - What if user checks off multiple times?
   - What if user changes frequency after tracking starts?

### Deliverable
A working check-off system that saves progress and calculates streaks correctly, with undo capability.

---

## Phase 5: Multi-Habit Support & Navigation
[→ GitHub Issue #5](https://github.com/nhan-4/final-habit-helper/issues/5)

**Goal:** Support multiple habits with swipe navigation

### Tasks
1. **Update data structure for multiple habits**
   - Store array of habits in localStorage
   - Track current habit index
   - Load all habits on app start

2. **Implement swipe navigation**
   - Create `js/swipe.js` for touch event handlers
   - Listen for touchstart, touchmove, touchend events
   - Calculate swipe direction and distance
   - Transition between habits with animation

3. **Add visual navigation indicators**
   - Dot indicators showing habit count and position
   - Left/right arrow buttons for non-touch devices
   - Habit counter ("1 of 3")

4. **Handle empty states**
   - Show "Add Habit" button between habits
   - Allow creating multiple habits from home screen

5. **Preserve navigation state**
   - Remember which habit user was viewing
   - Restore on page reload

6. **Test on mobile**
   - Verify swipe gestures work smoothly
   - Test on iOS Safari and Android Chrome
   - Ensure no conflicts with browser swipe gestures

### Deliverable
Smooth swipe navigation between multiple habits with visual feedback and proper state management.

---

## Phase 6: Habit Management
[→ GitHub Issue #6](https://github.com/nhan-4/final-habit-helper/issues/6)

**Goal:** Edit, archive, and delete habits

### Tasks
1. **Build habit edit form**
   - Reuse creation form with pre-filled values
   - Add "Edit" button on home screen
   - Save changes to existing habit object
   - Preserve tracking data when editing

2. **Implement archive functionality**
   - Add `archivedDate` field to habit object
   - Hide archived habits from main navigation
   - Create separate "Archived Habits" view
   - Allow unarchiving habits

3. **Add delete functionality**
   - Confirmation dialog before deleting
   - Remove habit and ALL tracking data
   - Handle case where deleted habit was currently displayed

4. **Create settings/menu**
   - Hamburger menu or settings icon
   - Access to edit, archive, delete options
   - Link to archived habits view

5. **Build archived habits screen**
   - List all archived habits
   - Show name and date archived
   - Allow viewing history (read-only)
   - Unarchive or delete permanently

### Deliverable
Complete habit management system allowing users to edit, archive, and delete habits safely.

---

## Phase 7: Tracking History Views
[→ GitHub Issue #7](https://github.com/nhan-4/final-habit-helper/issues/7)

**Goal:** Show detailed progress with calendar, list, and statistics

### Tasks
1. **Create tracking page/modal**
   - Access from home screen (tap habit name or history icon)
   - Tab navigation between views (Calendar, List, Stats)
   - Close button to return to home

2. **Build calendar view**
   - Grid layout showing dates (mobile-friendly)
   - Highlight completed days
   - Show current month with prev/next navigation
   - Handle different month lengths
   - Visual distinction for today
   - Gray out days before habit creation

3. **Build list view**
   - Chronological list of completion dates
   - Group by month or show all
   - Tap to undo individual dates
   - Show undo count if applicable

4. **Build statistics view**
   - Current streak (with icon/badge)
   - Longest streak ever
   - Total completions
   - Completion rate (percentage)
   - Days since creation
   - Milestones achieved

5. **Add history window filter**
   - Dropdown or segmented control
   - Options: Last 30 days, 90 days, All time
   - Filter all views based on selection
   - Save preference to localStorage

6. **Style tracking views**
   - Match colorful, playful aesthetic
   - Clear visual hierarchy
   - Responsive for mobile and desktop

### Deliverable
Comprehensive tracking history with multiple visualization options and filtering.

---

## Phase 8: Browser Notifications Setup
[→ GitHub Issue #8](https://github.com/nhan-4/final-habit-helper/issues/8)

**Goal:** Request permission and schedule basic notifications

### Tasks
1. **Request notification permission**
   - Check if notifications are supported
   - Ask for permission on first habit creation
   - Handle granted, denied, default states
   - Store permission state

2. **Create basic notification**
   - Test notification on button click
   - Format message: "{habitName}! You're on day {streak}!"
   - Add icon and badge if available

3. **Schedule notification for specific time**
   - Check current time vs notification time
   - Calculate delay until next notification
   - Use setTimeout for testing (not persistent yet)

4. **Add notification settings**
   - Toggle to enable/disable notifications per habit
   - Change notification time
   - Preview notification button

5. **Handle notification clicks**
   - Open app when notification is tapped
   - Navigate to relevant habit

### Deliverable
Working browser notifications that can be scheduled and displayed, with user permission handling.

---

## Phase 9: Service Worker Integration
[→ GitHub Issue #9](https://github.com/nhan-4/final-habit-helper/issues/9)

**Goal:** Enable background notifications even when app is closed

### Tasks
1. **Create service-worker.js**
   - Basic service worker structure
   - Install and activate event listeners
   - Fetch event for offline capability (optional)

2. **Register service worker**
   - Register from main app (app.js)
   - Handle registration success/failure
   - Check if service worker is supported

3. **Implement background notification logic**
   - Service worker checks time periodically
   - Load habits and notification times from storage
   - Calculate if notification should fire (time + frequency match)
   - Show notification using `self.registration.showNotification()`

4. **Handle notification triggers**
   - Store last-sent notification timestamp
   - Avoid duplicate notifications
   - Calculate streak in service worker context

5. **Test on HTTPS**
   - Deploy to Vercel (provides HTTPS)
   - Test notifications when app is closed
   - Test on mobile device

6. **Debug service worker**
   - Use Chrome DevTools Application tab
   - Check service worker status and logs
   - Test update and unregister scenarios

### Deliverable
Fully functional background notifications via Service Worker that work even when app is closed.

---

## Phase 10: Milestone Celebrations
[→ GitHub Issue #10](https://github.com/nhan-4/final-habit-helper/issues/10)

**Goal:** Celebrate user achievements at key milestones

### Tasks
1. **Define milestone thresholds**
   - Day 7 (First week!)
   - Day 30 (One month!)
   - Day 100 (100 days!)
   - Day 365 (One year!)
   - Custom milestones (50, 200, 500, etc.)

2. **Implement milestone detection**
   - Check on each completion if streak hits milestone
   - Store achieved milestones in localStorage
   - Prevent duplicate celebrations

3. **Create celebration modal/popup**
   - Full-screen celebration animation
   - Congratulatory message
   - Confetti or particle effects
   - Share button (optional)

4. **Send celebration notification**
   - Special notification for milestones
   - Different message format
   - Badge or icon to distinguish from regular reminders

5. **Show milestone history**
   - List of all achieved milestones in stats view
   - Show date achieved
   - Persist even if streak breaks (lifetime achievements)

6. **Add visual flair**
   - Animated SVG graphics
   - Colorful, playful celebration theme
   - Sound effect (optional, with user control)

### Deliverable
Engaging milestone celebration system that motivates users to maintain their streaks.

---

## Phase 11: Polish & UX Enhancements
[→ GitHub Issue #11](https://github.com/nhan-4/final-habit-helper/issues/11)

**Goal:** Refine the user experience and visual design

### Tasks
1. **Improve animations and transitions**
   - Smooth page transitions
   - Button press feedback
   - Loading states
   - Skeleton screens while data loads

2. **Enhance mobile experience**
   - Test on various screen sizes
   - Fix any touch target sizing issues
   - Optimize for one-handed use
   - Handle landscape orientation

3. **Add onboarding flow**
   - Welcome screen for first-time users
   - Quick tutorial or tooltips
   - Explain notification permissions
   - Sample habit suggestion

4. **Improve empty states**
   - Friendly messages when no habits exist
   - Encouraging prompts to create first habit
   - Visual illustrations

5. **Add accessibility features**
   - ARIA labels for screen readers
   - Keyboard navigation support
   - Sufficient color contrast
   - Focus indicators

6. **Performance optimization**
   - Minimize JavaScript bundle size
   - Optimize images and assets
   - Lazy load non-critical resources
   - Test on slow networks

7. **Error handling**
   - Graceful degradation if localStorage is full
   - Handle timezone edge cases
   - Provide helpful error messages
   - Add error recovery options

### Deliverable
Polished, production-ready app with excellent UX and accessibility.

---

## Phase 12: Testing & Deployment
[→ GitHub Issue #12](https://github.com/nhan-4/final-habit-helper/issues/12)

**Goal:** Ensure quality and deploy to production

### Tasks
1. **Manual testing checklist**
   - Test all features on mobile (iOS Safari, Android Chrome)
   - Test on desktop browsers (Chrome, Firefox, Safari)
   - Test offline behavior
   - Test notification permissions (grant, deny, revoke)
   - Test edge cases (midnight, DST, timezone changes)
   - Test data persistence (close and reopen app)

2. **Cross-browser testing**
   - Verify Service Worker support
   - Test notification API compatibility
   - Fix any browser-specific issues

3. **Performance testing**
   - Test with many habits (10+)
   - Test with long tracking history (1+ year)
   - Check localStorage size limits
   - Measure load time and responsiveness

4. **Setup Vercel deployment**
   - Connect GitHub repo to Vercel
   - Configure build settings (if needed)
   - Set up automatic deployments on push to main
   - Verify HTTPS is enabled

5. **Test production deployment**
   - Verify Service Worker registers correctly on HTTPS
   - Test notifications on deployed version
   - Check that all assets load correctly
   - Test on real mobile devices

6. **Update README**
   - Add live URL
   - Include setup instructions
   - Document known issues or limitations
   - Add screenshots

### Deliverable
Fully tested and deployed Habit Helper app accessible via public URL.

---

## Phase 13: Future Enhancements (Optional)
[→ GitHub Issue #13](https://github.com/nhan-4/final-habit-helper/issues/13)

**Goal:** Ideas for future iterations

### Potential Features
1. **Data export/import**
   - Export habits and tracking data as JSON
   - Import from backup file
   - Share data between devices

2. **Habit categories or tags**
   - Organize habits by type (health, productivity, etc.)
   - Filter by category

3. **Custom themes**
   - Let users choose color schemes
   - Multiple playful themes

4. **Habit templates**
   - Pre-defined common habits
   - Quick-start templates with suggested settings

5. **Motivational quotes**
   - Random encouraging messages
   - Daily inspiration

6. **Streak recovery**
   - Allow one "grace day" per X days
   - Vacation mode

7. **Social features**
   - Share achievements
   - Invite friends to build habits together

8. **Analytics dashboard**
   - Visualize progress over time
   - Charts and graphs
   - Compare multiple habits

---

## Development Workflow

### Version Control
- Use Git for version control
- Follow Conventional Commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `style:` for UI/styling changes
  - `refactor:` for code restructuring
  - `docs:` for documentation
- Commit after each meaningful change
- Push to GitHub regularly

### Testing Approach
- Test after each phase on mobile device
- Use browser DevTools for debugging
- Keep notes of bugs and issues in DECISIONS.md
- Manually verify critical paths (create, track, notify)

### Deployment Schedule
- Deploy early (after Phase 4) to test on HTTPS
- Deploy after each major phase
- Test notifications on deployed version
- Keep production stable, test new features locally first

---

## Timeline Estimate

- **Phase 1-2:** 2-4 hours (Setup and basic form)
- **Phase 3-4:** 3-5 hours (Home screen and tracking)
- **Phase 5-6:** 3-5 hours (Multi-habit and management)
- **Phase 7:** 4-6 hours (History views)
- **Phase 8-9:** 5-8 hours (Notifications and Service Worker)
- **Phase 10:** 2-4 hours (Milestones)
- **Phase 11:** 3-6 hours (Polish)
- **Phase 12:** 2-4 hours (Testing and deployment)

**Total: 24-42 hours** (3-5 full days of work, or 1-2 weeks part-time)

---

## Next Steps

1. Review this plan and adjust priorities
2. Set up Figma mockups (optional but recommended)
3. Start with Phase 1: Create file structure
4. Build iteratively, testing after each phase
5. Deploy early and often to catch issues

**Remember:** You don't have to build everything at once! Start with Phases 1-4 to get a minimal working prototype, then decide what to build next based on what you learn.
