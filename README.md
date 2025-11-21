# Habit Helper

## What is this?

Ever wanted to build a new habit—like drinking more water, reading daily, or going for walks—but struggled to stick with it? This app is here to help!

**Habit Helper** is a simple, friendly web app that sends you cheerful reminders throughout the day to keep you on track. It celebrates your progress and shows you how many days you've kept your streak going. The goal? Make building habits feel fun and rewarding, not like a chore.

Think of it as your personal cheerleader in your pocket, nudging you to keep going and celebrating every milestone along the way. 🎉

---

## Core Features

### User Input & Setup
- Lets users input a habit and set how often they want notifications

### Home Screen Display
- Shows the user's main habit goal
- Shows how many days the user has kept their habit going
- Tracks how many days the user has been building their habit on the tracking page

### Notifications & Reminders
- Sends regular notifications (reminders) to help users stay motivated
- Sends friendly reminders

## User Engagement & Motivation

### Milestone Celebrations
- Gives encouragement at important milestones to keep users motivated
- Celebrate milestones in a cheerful, playful, and cute way to keep users excited

## Technical Requirements

### Platform
- Needs to work on phone
- Built with vanilla HTML/CSS/JavaScript (no frameworks)
- All data stored in browser localStorage
- Service Worker for background notifications

## Screenshots

### Welcome Screen
![Welcome Screen](https://github.com/user-attachments/assets/ab9af7aa-8815-4d19-b54e-fbd41b69c722)

### Create Habit Form
![Create Habit Form](https://github.com/user-attachments/assets/ef7929ee-da04-4375-b0fd-f3e60137e232)

### Habit Tracking
![Habit Home Screen](https://github.com/user-attachments/assets/c3531b6f-b83d-41c5-bba1-1f0221c2342c)

### Habit Completed
![Habit Completed](https://github.com/user-attachments/assets/e2c50e7b-c5d3-41ac-8b80-a34293a3ae98)

---

## Development & Deployment

### Tools Used
- **VS Code + GitHub Copilot**: Primary development environment for coding
- **GitHub**: Version control and code repository
- **Vercel**: Hosting and automatic deployment (provides HTTPS required for Service Workers)
- **Figma**: UI/UX design and mockups

### Deployment
- Ready for deployment to Vercel
- Automatic deployment on every push to `main` branch
- Live URL: *[To be added after Vercel deployment]*
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions

### Local Development

To run the app locally:

```bash
# Clone the repository
git clone https://github.com/nhan-4/final-habit-helper.git
cd final-habit-helper

# Start a local server (choose one method)
# Method 1: Python
python3 -m http.server 8000

# Method 2: Node.js (if you have npx)
npx http-server -p 8000

# Open in browser
# Navigate to http://localhost:8000
```

**Note:** Service Workers and notifications require HTTPS to work fully. For testing these features locally, consider using ngrok or deploy to Vercel. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

### Design
- UI mockups and design planning done in Figma
- Visual style: Colorful, playful, and cute
- Mobile-first responsive design

---

## Testing

Comprehensive testing documentation is available in [TESTING.md](TESTING.md), including:
- Manual testing checklists for mobile and desktop browsers
- Cross-browser compatibility testing
- Performance testing procedures
- Edge case testing scenarios
- Accessibility testing guidelines

---

## Known Issues & Limitations

### Browser Compatibility
- **Safari iOS**: Notifications have limited support (requires iOS 16.4+)
- **HTTPS Required**: Service Workers and notifications only work over HTTPS
- **localStorage Limits**: Browser storage is limited to ~5-10MB

### Feature Limitations
- No cloud sync - all data stored locally in browser
- No data backup/export feature (planned for future)
- No data sync between devices
- Notifications may not work in all browsers/configurations

### Testing Notes
- Service Workers do not work on `http://` (except localhost in Chrome)
- Notifications require user permission grant
- Offline mode requires initial online load to cache resources

For detailed testing procedures and issue tracking, see [TESTING.md](TESTING.md).

---

## Project Documentation

- **[PLAN.md](PLAN.md)** - Complete development plan with all phases
- **[DECISIONS.md](DECISIONS.md)** - Technical decisions and rationale
- **[TESTING.md](TESTING.md)** - Comprehensive testing documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide for Vercel and other platforms

---

## Contributing

This is a personal learning project, but suggestions and feedback are welcome! Feel free to:
- Open an issue for bugs or feature requests
- Submit a pull request with improvements
- Share your experience using the app

---

## License

This project is open source and available for learning purposes.