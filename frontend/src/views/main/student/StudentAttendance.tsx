import React from 'react';

interface Course {
    id: number;
    name: string;
    attendance: number;
}

const courses: Course[] = [
    { id: 1, name: 'Course 1', attendance: 90 },
    { id: 2, name: 'Course 2', attendance: 85 },
    // add more courses as needed
];


const StudentAttendance: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-1/2 p-8 bg-gray-100">
            <h1 className="text-xl sm:text-4xl font-bold mb-8">Student Attendance</h1>
            {courses.map((course) => (
                <div key={course.id} className="text-md sm:text-xl mb-4">
                    <p className="mb-5"><strong>Course Name:</strong> <span className="profileStat">{course.name}</span></p>
                    <p className="mb-4"><strong>Attendance:</strong> <span className="profileStat">{course.attendance}%</span></p>
                </div>
            ))}
        </div>
    );
};

export default StudentAttendance;
