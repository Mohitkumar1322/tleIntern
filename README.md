# Contest Tracker

A responsive web application for tracking competitive programming contests from Codeforces and CodeChef, with integrated solution videos.

## Features

- Track upcoming and ongoing contests from Codeforces and CodeChef
- Bookmark favorite contests for quick access
- View solution videos from YouTube
- Toggle between dark and light themes (Shift+D)
- Responsive design for mobile, tablet, and desktop
- Admin interface for managing solution videos

## Tech Stack

- **Frontend**: React.js, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB



## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (v4+)
- YouTube API Key

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file:
```
MONGO_URI=mongodb://localhost:27017/contest-tracker
PORT=5000


```

Start the server:
```bash
npm start
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

## API Endpoints

### Public Endpoints
- `GET /api/contests` - Get all contests
- `GET /api/bookmarked-contests` - Get bookmarked contests
- `PATCH /api/contests/:id/bookmark` - Toggle bookmark status
- `GET /api/fetch-codeforces` - Update Codeforces contests
- `GET /api/fetch-codechef` - Update CodeChef contests
- `GET /api/update-solutions` - Update solution videos



## Responsive Design

- **Desktop**: Table view with full features
- **Tablet**: Scrollable table with adjusted UI
- **Mobile**: Card view with optimized layout


## Troubleshooting

- **API Connection Issues**: Check if backend server is running
- **Missing Videos**: Verify YouTube API key and playlist ID
- **Authentication Problems**: Clear browser storage and re-login

## Demo Video 🎥
[![Watch the Video](https://img.youtube.com/vi/5tKBIo9YvRc/0.jpg)](https://youtu.be/5tKBIo9YvRc)

## Contributors


- [Mohit Kumar](https://github.com/Mohitkumar1322)