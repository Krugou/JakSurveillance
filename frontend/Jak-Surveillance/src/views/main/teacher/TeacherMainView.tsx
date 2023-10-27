import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-8">Teacher Dashboard</h1>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                onClick={() => navigate('/teacher/attendance')}
            >
                View Attendance
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => navigate('/teacher/students')}
            >
                Manage Students
            </button>
        </div>
    );
};

export default MainView;