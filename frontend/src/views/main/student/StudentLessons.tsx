import React from 'react';

interface Lesson {
    id: number;
    name: string;
    date: string
    attendance: string;
}

const lessonAttendance: Lesson[] = [
    { id: 1, name: 'Math', date: '27.10.2023', attendance: "Present"},
    { id: 2, name: 'Physics', date: '27.10.2023', attendance: "Not Present" },
    { id: 3, name: 'English', date: '27.10.2023', attendance: "Not Present" },
    { id: 4, name: 'Chemistry', date: '27.10.2023', attendance: "Present" },
    // add more courses as needed
];

const getAttendanceColorClass = (attendance: string) => {
    if (attendance == "Present") {
        return 'bg-metropoliaTrendGreen';
    }
    else {
        return 'bg-metropoliaSupportRed';
    }
};

const StudentAttendance: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-1/2 p-8 bg-gray-100">
            <h1 className="text-xl sm:text-4xl font-bold mb-8">Lesson Attendance</h1>
            {lessonAttendance.map((lesson) => (
                <div key={lesson.id} className="text-md sm:text-xl mb-4">
                    <p className="mb-4"><span className="profileStat">{lesson.date}</span></p>
                    <p className="mb-4"><strong>Lesson:</strong> <span className="profileStat">{lesson.name}</span></p>
                    <p className="mb-4"><strong>Attendance:</strong> <span className={`profileStat ${getAttendanceColorClass(lesson.attendance)}`}>{lesson.attendance}</span></p>
                </div>
            ))}
        </div>
    );
};

export default StudentAttendance;
