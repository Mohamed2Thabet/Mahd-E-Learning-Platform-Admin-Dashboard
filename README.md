# Mahd-E-Learning-Platform-Admin-Dashboard

A modern, customizable admin dashboard for managing users and roles in the Mahd E-Learning Platform. Built with React, Redux Toolkit, Vite, and styled for a beautiful, responsive experience. Includes advanced theming, authentication, and user management features.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Usage](#usage)
- [Theming](#theming)
- [Project Structure](#project-structure)
- [API & Environment](#api--environment)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Authentication**: Secure login for admin users (with demo credentials for testing).
- **User Management**: View, search, filter, edit, delete, activate, suspend, and change roles for users.
- **Role Management**: Assign and update user roles (Admin, Manager, User, etc.).
- **Profile Management**: Admins can view and update their profile and change their password.
- **Multi-theme Support**: Switch between multiple beautiful themes (Dark, Light, Blue, Sepia, and more).
- **Responsive UI**: Fully responsive and mobile-friendly design.
- **Modern UI/UX**: Built with React, styled-components, and Bootstrap for a polished look.
- **Mock Data**: Demo mode with mock users for development/testing without backend.
- **API Integration**: Easily connect to real backend APIs via environment variables or Vite proxy.

---

## Tech Stack
- **Frontend**: [React](https://react.dev/), [Redux Toolkit](https://redux-toolkit.js.org/), [React Router](https://reactrouter.com/), [styled-components](https://styled-components.com/), [Bootstrap](https://getbootstrap.com/), [React-Bootstrap](https://react-bootstrap.github.io/), [React Icons](https://react-icons.github.io/react-icons/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: Redux Toolkit
- **API**: Axios
- **Styling**: styled-components, Bootstrap, Tailwind CSS (utility classes)
- **Testing/Quality**: ESLint

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Mahd-E-Learning-Platform-Admin-Dashboard
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App
- **Development mode:**
  ```bash
  npm run dev
  # or
  yarn dev
  ```
  The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

- **Production build:**
  ```bash
  npm run build
  # or
  yarn build
  ```
  The output will be in the `dist/` folder.

- **Preview production build:**
  ```bash
  npm run preview
  # or
  yarn preview
  ```

---

## Usage

### Demo Credentials
- **Email:** `admin@example.com`
- **Password:** `admin123`

You can use these credentials to log in and explore the dashboard in demo mode (no backend required).

### User Management
- Search, filter, and sort users by name, email, role, or status.
- Edit user details, change roles, activate/suspend, or delete users.
- Assign roles such as Admin, Manager, User, etc.

### Theming
- Use the theme toggle in the UI to switch between multiple color themes (Dark, Light, Blue, Sepia, Purple, Teal, Pink, Orange, Green, Gray).
- Theme preference is saved in local storage.

---

## Project Structure
```
Mahd-E-Learning-Platform-Admin-Dashboard/
├── public/                # Static assets (logo, etc.)
├── src/
│   ├── components/        # React components (AdminDashboard, Login, ThemeToggle, UserProfile)
│   ├── context/           # Theme context provider
│   ├── services/          # API service layer (axios, mock data)
│   ├── store/             # Redux slices and store
│   ├── index.css          # Global and theme CSS
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── vite.config.js         # Vite config (proxy, plugins)
├── package.json           # Project metadata and scripts
└── README.md              # Project documentation
```

---

## API & Environment
- **API URLs** are configured via environment variables or Vite proxy (see `vite.config.js`).
- By default, the app uses mock data for users and authentication if the backend is unavailable.
- To connect to a real backend, set the following environment variables in a `.env` file:
  ```env
  VITE_API_BASE_URL=https://your-api-base-url
  VITE_API_ADMIN_URL=https://your-api-admin-url
  VITE_INTERNAL_API_KEY=your-internal-api-key
  ```
- The Vite dev server proxies `/api/v1/ums` and `/api/users` to the backend for local development.

---

## Available Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

---

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. 
