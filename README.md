# Vacancies Platform Frontend

A **React (Vite + TypeScript)** application for the Vacancies Platform. It provides a clean, professional interface for users to interact with the backend API.

## Features
-   **Sober Design**: Custom CSS for a professional look.
-   **Role-Based UI**: Interface adapts for `coder`, `gestor`, and `admin`.
-   **Functionality**:
    -   **Coders**: Browse vacancies, apply instantly, track applications.
    -   **Admins**: Create/Edit/Delete vacancies, view all user applications.
    -   **Gestors**: Manage vacancies.

## Prerequisites
-   Node.js (v18+)
-   Running `vacancies-backend` on port 3000

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root:
    ```env
    VITE_API_URL=http://localhost:3000
    VITE_API_KEY=your_secure_api_key  # Must match backend API_KEY
    ```

3.  **Run the application**:
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

## Navigation
-   **Login/Register**: Access via the top bar.
-   **Vacancies**: Main dashboard.
-   **My Applications**: Visible to logged-in Coders.
-   **All Applications**: Visible only to Admins.
-   **Create Vacancy**: Visible to Admins/Gestors on the dashboard.
