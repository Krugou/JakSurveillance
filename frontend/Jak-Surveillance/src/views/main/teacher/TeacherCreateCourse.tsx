import React, { useState } from 'react';

const TeacherCreateCourse: React.FC = () => {
    const [courseName, setCourseName] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Here you can handle the course creation logic
        console.log(`Course Created: ${courseName}`);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-8">Create Course</h1>
            <form onSubmit={handleSubmit} className="w-1/2">
                <input
                    type="text"
                    placeholder="Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="mb-4 p-2 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Create Course
                </button>
            </form>
        </div>
    );
};

export default TeacherCreateCourse;