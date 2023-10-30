import React from 'react';

interface Part {
    id: number;
    course: string;
    part: string;
    date: string;
    attendance: string;
    length?: number;
}

const PartAttendance: Part[] = [
    { id: 1, course: 'Programming', part: 'Math', date: '27.10.2023', attendance: "Present", length: 3 },
    { id: 2, course: 'Programming', part: 'Physics', date: '28.10.2023', attendance: "Not Present", length: 3 },
    { id: 3, course: 'Programming', part: 'English', date: '28.10.2023', attendance: "Not Present", length: 3 },
    { id: 4, course: 'Programming', part: 'Chemistry', date: '29.10.2023', attendance: "Present", length: 3 },
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
            <h1 className="text-xl sm:text-4xl font-bold mb-8">Part Attendance</h1>
            {PartAttendance.map((part) => (
                <div key={part.id} className="flex align-start flex-row text-md border border-black rounded sm:text-xl m-4 p-4">
                    <p className="p-2 m-2"><strong>Date:</strong> <span className="profileStat">{part.date}</span></p>
                    <p className="p-2 m-2"><strong>Course:</strong> <span className="profileStat">{part.course}</span></p>
                    <p className="p-2 m-2"><strong>Part:</strong> <span className="profileStat">{part.part}</span></p>
                    <p className="p-2 m-2"><strong>Length:</strong> <span className="profileStat">{part.length}h</span></p>
                    <p className="p-2 m-2"><strong>Attendance:</strong> <span className={`profileStat ${getAttendanceColorClass(part.attendance)}`}>{part.attendance}</span></p>
                </div>
            ))}
        </div>
    );
};

export default StudentAttendance;
