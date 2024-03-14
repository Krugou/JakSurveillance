# Getting Started with Metropolia Attendance App

This guide provides step-by-step instructions on how to set up and start the Metropolia Attendance app backend and build the frontend.

## Prerequisites

Before you start, you need to obtain an API key from the Metropolia Open Data API. This key is required for course creation and lecture creation, as it fetches course information from the Metropolia Open Data API.

1. Obtain an API key from the Metropolia Open Data API.
2. Place the API key in a `.env` file in the backend folder.

## Development Installation

Follow these steps to install and run the application:

1. Install MariaDB server and ensure it's running add file [jaksec.sql] (backend/database/jaksec.sql) into your database and create users using [createusers.sql] (backend/database/createusers.sql) file.
2. Set up your `.env` file using the provided `.env.example` in the backend folder as a guide.
3. Navigate to the project root folder.
4. Run the application:

- For a production build, run `npm run all`. This will build and start both the frontend and backend.
- for normal production build run `npm run build` in frontend folder.
- For development mode, run `npm run alldev`. This will start both the frontend and backend in development mode.

## Server Installation

Follow these steps to install and run the application on a server:

1. Install MariaDB server and ensure it's running add file [jaksec.sql] (backend/database/jaksec.sql) into your database and create users using [createusers.sql] (backend/database/createusers.sql) file.
2. Set up your `.env` file using the provided `.env.example` in the backend folder as a guide.
3. Configure apache server with how its set in [readme.md](serversideconf/readme.md)
4. use example from [ecosystem.config.cjs](backend/ecosystem.config.cjs) to create your own ecosystem.config.cjs file.
5. Run the application using `pm2 start ecosystem.config.cjs`.

After following these steps, your Metropolia Attendance App should be up and running!
