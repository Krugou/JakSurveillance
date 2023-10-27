import React from 'react';

interface StudentProfileProps {
    name: string;
    email: string;
    attendance: number;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ name, email, attendance }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
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