import React from 'react';

const name = "John Doe";
const email = "john.doe@example.com";
const attendance = 90;

const getAttendanceColorClass = (attendance: number): string => {
    if (attendance >= 90) {
        return 'bg-metropoliaTrendGreen';
    } else if (attendance >= 50) {
        return 'bg-metropoliaMainOrange';
    } else {
        return 'bg-metropoliaSupportRed';
    }
};

const StudentProfile: React.FC = () => {
    const attendanceColorClass = getAttendanceColorClass(attendance);

    return (
        <div className="flex flex-col items-center justify-center h-1/2 p-10 bg-gray-100">
            <h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Student Profile</h1>
            <div className="text-md sm:text-xl mb-4">
                <p className="mb-5">
                    <strong>Name:</strong> <span className="profileStat">{name}</span>
                </p>
                <p className="mb-5">
                    <strong>Email:</strong> <span className="profileStat">{email}</span>
                </p>
                <p>
                    <strong>Attendance:</strong> <span className={`text-white rounded p-1 ${attendanceColorClass}`}>{attendance}%</span>
                </p>
            </div>
        </div>
    );
};

export default StudentProfile;
