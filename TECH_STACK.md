# ThinkGrid Frontend - Technical Documentation

This document provides a detailed overview of the frontend architecture, tech stack, and file structure.

## 🛠 Tech Stack & Dependencies

The frontend is a modern Single Page Application (SPA) designed with professional aesthetics.

### Core Framework
- **React 19**: The latest version of the React library for building user interfaces.
- **Vite**: A fast build tool and development server, replacing Create React App for better performance.

### Styling & Design
- **Vanilla CSS**: Used for all styling (modular and global sheets) to ensure maximum performance and pixel-perfect control.
- **Lucide React**: A clean and consistent icon library used throughout the application.
- **Google Fonts**: Uses modern typography (e.g., 'Inter', 'Outfit', 'Outfit') for a premium feel.

### Networking & State
- **Axios**: Promise-based HTTP client used for all API communication with the backend.
- **React Context API**: Used for global state management (specifically for Authentication status).

---

## 📂 File Structure & Purpose (src/)

### Core Files
- **`main.jsx`**: The application entry point. Renders the `<App />` component into the DOM.
- **`App.jsx`**: Configures the main application layout and React Router logic.
- **`App.css`**: Contains global styles, CSS variables (color tokens), and base resets.

### `api/`
- **`client.js`**: Configures the Axios instance, including base URL (from environment variables) and request/response interceptors to handle authentication tokens.
- **`auth.js`, `users.js`, `rooms.js`, `materials.js`, `messages.js`**: Feature-specific API service calls that communicate with the backend.

### `components/layout/`
- **`MainLayout.jsx`**: The primary wrapper for the dashboard that includes the Sidebar and Right Panel.
- **`Sidebar.jsx`**: The main navigation bar with tabs for Home, Messages, Rooms, Materials, etc.
- **`RightPanel.jsx`**: Displays current user status, quick actions, and connectivity information.

### `context/`
- **`AuthContext.jsx`**: Provides global access to the current logged-in user's data and handle login/logout logic.

### `pages/`
*Individual high-level views:*
- **`Home.jsx`**: The dashboard feed, featuring profile cards and progress stats.
- **`Materials.jsx`**: The Hub for discovering and saving study resources.
- **`Rooms.jsx`**: Discussion group listings and real-time chat interface.
- **`Activity.jsx`**: Personal history and timeline of user interactions (Saves, Joins).
- **`Messages.jsx`**: Direct messaging inbox and chat threads.
- **`Explore.jsx`**: Community hub for finding and connecting with other users.
- **`Labs.jsx`**: Interface for active sessions and live collaboration.
- **`Login.jsx` & **`Register.jsx`**: Authentication pages with modern branding.

### Assets/Configuration
- **`.env`**: Stores the backend API endpoint (`VITE_API_URL`).
- **`.gitignore`**: Ensures sensitive local config and `node_modules` are not tracked.
- **`index.html`**: The single HTML entry point where the React app is mounted.
