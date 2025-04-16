# SmartEats Frontend

This is the **React Native frontend** for the SmartEats food delivery platform, built using **Expo Router**, **React Native Paper**, and various other libraries for maps, charts, and navigation.

## Get Started

1. Before running the frontend, make sure the backend is up and running (instructions in [backend/README.md](../backend/README.md#1-installation-and-running-the-backend-server)). In local development, this frontend app communicates with the backend at the [http://localhost:11000](http://localhost:11000). 

2. Install dependencies:

   ```bash
   # Open a terminal in the frontend folder.
   npm install
   ```

3. Start the app (web and native):

   ```bash
   npm start
   ```

   In the CLI, you can choose to run it on:
   - Web browser
   - Android emulator or device
   - iOS simulator or device (on macOS)

   **Recommend**: press `w` to open the app in a web browser for faster development.

## Project Structure

- `app/`: File-based routing with Expo Router (e.g. `/signup`, `/login`, `/driver`, `/restaurant`, `/admin`, etc.)
- `components/`: Reusable UI components like `PressableIcon`, `ProfileAvatar`, `OrderCard`, etc.
- `constants/`: Centralized static config like API endpoints (`backend.jsx`)
- `hooks/`: Custom hooks like `useAuth`, `useToast`, `useUserLocation`, etc.
- `store/`: Context providers for authentication, toast messages, and dialogs
- `utils/`: Utility functions for fees, geolocation, etc.
- `assets/`: Static images.

## Linting & Code Quality

To check and auto-fix linting issues:

```bash
# Open a terminal in the frontend folder. 
npm run lint
```

Uses ESLint with recommended rules and React-specific settings. Also integrated into GitHub Actions.

## Key Libraries

- **Expo Router** – for declarative navigation with file-based routing
- **React Native Paper** – for consistent UI components
- **react-chartjs-2** – for rendering performance charts and reports
- **@react-native-maps** – for location tracking and route display
- **Axios** – for REST API integration with the backend

## Authentication

Authentication context is shared via `useAuth()` and persisted via `AsyncStorage` (or `SessionStorage` when on the web) . Supports token-based auth for all roles: customer, driver, restaurant, and admin.


Here's the updated "Highlight Features" section for your `README.md`, combining all your key features in short bullet points:

## Highlight Features

### 📍 GPS Tracking & Location Marking

- Drivers can view their location in real-time with Google Maps integration.
- Location data is updated dynamically, providing accurate route visualizations.

### 💬 In-app Messaging

- Real-time messaging between customers, drivers, and restaurants for order updates in the `chats` screen.
- Supports direct communication with message grouping and automatic polling.

### 📊 Daily Reports for Drivers & Restaurants

- Drivers and restaurants can view daily reports on orders and earnings.
- Visualized in bar/line charts for easy tracking of performance and activity.
