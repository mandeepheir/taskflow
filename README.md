
# TaskFlow — Task Management Dashboard

TaskFlow is a responsive task management application built with React. It helps users organize tasks, track progress, and manage priorities through a clean dashboard.

## Features

- **Create tasks** with a title, description, and priority.
- **Edit tasks** when details change.
- **Mark tasks complete** and track progress.
- **Delete tasks** you no longer need.
- **Search tasks** by their content.
- **Filter tasks** by all, active, or completed status.
- **Sort by priority** to focus on important work.
- **Dashboard statistics** for total, active, and completed tasks.
- **Persistent storage** using browser localStorage.
- **Responsive design** for desktop, tablet, and mobile screens.

## Tech Stack

- React
- JavaScript
- Vite
- CSS
- Lucide React icons
- Browser localStorage

## Getting Started

### 1. Install Node.js

Install a recent supported version of Node.js from:

https://nodejs.org/

### 2. Install dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal by Vite.

### 4. Build for production

```bash
npm run build
```

The production-ready files will be generated in the `dist` folder.

### 5. Preview the production build

```bash
npm run preview
```

## Project Structure

```text
taskflow-react/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── eslint.config.js
├── vite.config.js
└── README.md
```

## Data Storage

Tasks are stored in the browser's localStorage, so they remain available after refreshing the page in the same browser. Clearing browser storage or using a different browser may remove or hide saved tasks.

## Future Improvements

- User accounts and authentication
- Backend API integration
- Cloud-based task synchronization
- Due dates and reminders
- Drag-and-drop task organization
- Automated tests

## License

This project is available for personal learning and portfolio development.
