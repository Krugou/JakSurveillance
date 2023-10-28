import React from 'react';
import { useNavigate } from 'react-router-dom';
// this is Mainview for teacher
const MainView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-1/2">
            <h1 className="text-4xl font-bold mb-8">Teacher Dashboard</h1>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                onClick={() => navigate('/teacher/attendance')}
            >
                View Attendance
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => navigate('/teacher/students')}
            >
                Manage Students
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => navigate('/teacher/courses/createcourse')}
            >
                Create Course
            </button>


        </div>
    );
};

export default MainView;