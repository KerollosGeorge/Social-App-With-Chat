# Social & Real-Time Chat Site

Welcome to the **Social & Real-Time Chat Site**! This is a feature-rich social networking platform built using **Node.js**, **React.js**, and **MySQL**. It allows users to connect, share posts and stories, interact in real time, and manage their social connections.

## Features
- **User Authentication**: Secure signup, login, and authentication system.
- **Posts & Stories**: Users can create, edit, delete, and interact with posts and time-limited stories.
- **Comments**: Engage with posts through comments.
- **Friends & Connections**: Send, accept, and manage friend requests.
- **Suggested Friends**: AI-based friend suggestions to enhance user engagement.
- **Profile Management**: Users can customize their profiles with pictures, bios, and personal details.
- **Real-Time Chat**: Instant messaging powered by WebSockets.


## Tech Stack
- **Frontend**: React.js (with state management, UI libraries, and responsive design)
- **Backend**: Node.js with Express.js
- **Database**: MySQL (structured relational database for storing user data securely)
- **Real-Time Communication**: Socket.io for chat and notifications
- **Authentication**: JWT-based authentication for security

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/social-chat-site.git
   cd social-chat-site
   ```
2. Install dependencies:
   ```sh
   npm install  # For backend
   cd client && npm install  # For frontend
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory with the necessary configurations for the database and authentication keys.
4. Start the backend:
   ```sh
   npm run dev
   ```
5. Start the frontend:
   ```sh
   cd client
   npm start
   ```
6. Open the application in your browser at `http://localhost:3000`
