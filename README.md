# NoteHub

NoteHub is a collaborative note-taking web application where users can create, manage, and share notes securely. Owners can edit or delete their notes, while collaborators can view shared notes. Built with the **MERN stack** and a modern, responsive UI.

## Features

- Create, edit, and delete personal notes
- Share notes with collaborators (view-only access)
- Responsive UI with rich text editor
- Authentication with JWT
- Separate pages for personal and collaborated notes

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/NoteHub.git
cd NoteHub


## Setup Backend
cd server
npm install


## Create a .env file based on .env.example
Create a .env file based on .env.example

### In env file
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

## Run the backend server
npm run dev

## Setup Frontend
cd ../client
npm install
npm run dev