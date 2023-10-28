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
        <div className="flex flex-col items-center justify-center h-1/2">
            <h1 className="text-4xl font-bold mb-8">Student Attendance</h1>
            {courses.map((course) => (
                <div key={course.id} className="text-xl mb-4">
                    <p><strong>Course Name:</strong> {course.name}</p>
                    <p><strong>Attendance:</strong> {course.attendance}%</p>
                </div>
            ))}
        </div>
    );
};

export default StudentAttendance;