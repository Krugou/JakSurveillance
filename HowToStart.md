# Getting Started with Metropolia Attendance App

This guide provides step-by-step instructions on how to set up and start the Metropolia Attendance app backend and build the frontend.

## Prerequisites

Before you start, you need to obtain an API key from the Metropolia Open Data API. This key is required for course creation and lecture creation, as it fetches course information from the Metropolia Open Data API.

1. Obtain an API key from the Metropolia Open Data API.
2. Place the API key in a `.env` file in the backend folder.

## Installation

Follow these steps to install and run the application:

1. Install MariaDB server and ensure it's running.
2. Set up your `.env` file using the provided `.env.example` in the backend folder as a guide.
3. Navigate to the project root folder.
4. Run the application:

- For a production build, run `npm run all`. This will build and start both the frontend and backend.
- for normal production build run `npm run build` in frontend folder.
- For development mode, run `npm run alldev`. This will start both the frontend and backend in development mode.

After following these steps, your Metropolia Attendance App should be up and running!
