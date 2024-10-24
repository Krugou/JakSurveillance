# Metropolia Attendance App Backend

Welcome to the TypeDoc documentation for the Metropolia Attendance App backend. This application is a convenient solution for teachers and students to take attendance during classes. It's designed to streamline the attendance process, making it easier for teachers to keep track of student attendance and for students to check in to their classes.

## Key Features

Efficient Attendance Management: Teachers can effortlessly manage and monitor student attendance through well-defined routes and controllers. The backend's structure ensures a smooth flow of data, enabling efficient attendance tracking.

Easy Check-In: Students benefit from a user-friendly check-in process, allowing them to quickly and conveniently register their attendance with just a few taps. The backend's design prioritizes a hassle-free experience for students.

## Architecture

The backend is organized into distinct components:

## Routes
Define the various endpoints that handle incoming requests from the frontend, triggering corresponding controllers.

## Controllers
Process requests from the routes, interact with models, and ensure the proper flow of information within the application.

## Models
Represent data entities and the structure of the database, defining how data is stored, retrieved, and manipulated within the backend.

## Setup

To set up the backend, follow these steps:

1. **Clone the repository**: Clone the repository to your local machine using `git clone <repository-url>`.
2. **Install dependencies**: Navigate to the `backend` directory and run `npm install` to install the required dependencies.
3. **Set up environment variables**: Create a `.env` file in the `backend` directory and add the necessary environment variables. Refer to the `.env.example` file for the required variables.
4. **Run the application**: Start the backend server by running `npm run alldev` in the `backend` directory.

## Usage

The backend provides various endpoints for managing attendance, courses, lectures, and users. Here are some key endpoints:

- **Attendance**: `/attendance` - Manage attendance records.
- **Courses**: `/courses` - Manage courses and their details.
- **Lectures**: `/lectures` - Manage lectures and their schedules.
- **Users**: `/users` - Manage user accounts and roles.

Refer to the API documentation for detailed information on each endpoint and its usage.

## Directory Structure

The backend directory is organized as follows:

- **config**: Contains configuration files for the application.
- **controllers**: Contains controller files that handle the logic for each endpoint.
- **models**: Contains model files that define the structure of the database and interact with it.
- **routes**: Contains route files that define the endpoints and their corresponding controllers.
- **utils**: Contains utility files for various helper functions.
- **tests**: Contains test files for unit testing the application.

Navigate through the documentation to gain a deep understanding of the backend codebase. Each module, class, interface, type, and function is meticulously documented to provide comprehensive insights into the structure and functionality of the code.
- **Efficient Attendance Management:** Teachers can easily manage and keep track of student attendance.
- **Easy Check-In:** Students can quickly check in to their classes with just a few taps.

Navigate through the documentation to understand the structure and functionality of the backend codebase. Each module, class, interface, type, and function is documented in detail to provide a comprehensive understanding of the code.

Happy coding!
