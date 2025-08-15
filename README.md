# Real-time Chat Application

A full-stack, real-time chat platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This application is designed to be a responsive and intuitive messaging service, demonstrating skills in modern web development practices. The core functionality includes instant messaging, user authentication, and state management, making it a robust and scalable project.

This project was developed as a way to apply and showcase foundational skills in web development and programming, with a focus on creating a seamless user experience through team collaboration and self-driven learning.

## Features

-   **Real-time Messaging**: Instant, bidirectional communication between users powered by Socket.IO.
-   **User Authentication**: Secure user registration and login functionality using JSON Web Tokens (JWT).
-   **Full-Stack Architecture**: Built with a Node.js/Express.js backend and a React.js frontend.
-   **Efficient State Management**: Utilizes Redux Toolkit for predictable and centralized state management on the client-side.
-   **Responsive UI Design**: The interface is built with Tailwind CSS, ensuring a seamless experience on both desktop and mobile devices.
-   **Database Integration**: MongoDB is used for storing user data and chat histories.

## Tech Stack

| Category      | Technology                                                                          |
|---------------|-------------------------------------------------------------------------------------|
| **Frontend** | `React`, `Redux Toolkit`, `Tailwind CSS`, `Socket.IO Client` |
| **Backend** | `Node.js`, `Express.js`, `MongoDB`, `Socket.IO`, `JSON Web Token (JWT)` |
| **Languages** | `JavaScript`, `HTML/CSS`                                                      |
| **Tools** | `VS Code`, `Postman`, `Git`, `GitHub`                                               |

## Getting Started

Follow these instructions to get a local copy of the project up and running on your machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (Node Package Manager) installed on your machine. You will also need a MongoDB database instance (either local or a cloud service like MongoDB Atlas).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/vijay4229/Realtime-Chat.git](https://github.com/vijay4229/Realtime-Chat.git)
    cd Realtime-Chat
    ```

2.  **Backend Setup:**
    -   Navigate to the backend directory and install the dependencies.
        ```sh
        # from the root directory
        npm install
        ```
    -   Create a `.env` file in the root directory.
    -   Add the following environment variables to your `.env` file. Replace the placeholder values with your actual credentials.
        ```env
        PORT=5000
        MONGO_DB_URI=your_mongodb_connection_string
        SECRET=your_jwt_secret_key
        ```
    -   Start the backend server.
        ```sh
        npm run start
        ```
        The server should now be running on `http://localhost:5000`.

3.  **Frontend Setup:**
    -   Open a new terminal window.
    -   Navigate to the `frontend` directory and install the dependencies.
        ```sh
        # from the root directory
        cd frontend
        npm install
        ```

        Also add `.env` file with 
        REACT_SERVER_URL = http://localhost:5000

    -   Start the frontend development server.
        ```sh
        npm run dev
        ```
    -   The application should now be running and accessible at `http://localhost:3000`.

## Usage

Once the application is running:
1.  Navigate to `http://localhost:3000` in your browser.
2.  You will be prompted to either **Sign Up** for a new account or **Log In** with existing credentials.
3.  After logging in, you can see other users and start a real-time chat with them.

---
**Vijaykumar**