import React from 'react';

const name = "John Doe";
const email = "john.doe@example.com";
const attendance = 90;

const StudentProfile: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-1/2">
            <h1 className="text-4xl font-bold mb-8">Student Profile</h1>
            <div className="text-xl mb-4">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Attendance:</strong> {attendance}%</p>
            </div>
        </div>
    );
};

export default StudentProfile;