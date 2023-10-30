import React from 'react';

interface Course {
    id: number;
    name: string;
    attendance: number;
}

const courses: Course[] = [
    { id: 1, name: 'Course 1', attendance: 90 },
    { id: 2, name: 'Course 2', attendance: 85 },
    { id: 3, name: 'Course 3', attendance: 70 },
    { id: 4, name: 'Course 4', attendance: 46 },
    // add more courses as needed
];

const getAttendanceColorClass = (attendance: number) => {
    if (attendance >= 90) {
        return 'bg-metropoliaTrendGreen';
    } else if (attendance >= 50) {
        return 'bg-metropoliaMainOrange';
    } else {
        return 'bg-metropoliaSupportRed';
    }
};

const StudentAttendance: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-1/2 p-8 bg-gray-100">
            <h1 className="text-xl sm:text-4xl font-bold mb-8">Student Course Attendance</h1>
            {courses.map((course) => (
                <div key={course.id} className="text-md sm:text-xl mb-4">
                    <p className="mb-5"><strong>Course Name:</strong> <span className="profileStat">{course.name}</span></p>
                    <p className="mb-4"><strong>Attendance:</strong> <span className={`profileStat ${getAttendanceColorClass(course.attendance)}`}>{course.attendance}%</span></p>
                </div>
            ))}
        </div>
    );
};

export default StudentAttendance;
