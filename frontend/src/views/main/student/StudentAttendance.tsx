import React, { useState } from 'react';

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

const getAttendanceColorClass = (_attendance:string, selectedOption: string) => {
    if (selectedOption === "Present") {
        return 'bg-metropoliaTrendGreen';
    } else {
        return 'bg-metropoliaSupportRed'; // You can set a default color class here if needed
    }
};

const StudentAttendance: React.FC = () => {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<{ [partId: number]: string }>(() => {
        // Initialize selectedOptions with the values from PartAttendance
        const initialSelectedOptions: { [partId: number]: string } = {};
        PartAttendance.forEach((part) => {
            initialSelectedOptions[part.id] = part.attendance;
        });
        return initialSelectedOptions;
    });

    const toggleDropdown = (partId: number) => {
        if (openDropdown === partId) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(partId);
        }
    };

    const handleOptionClick = (option: string, partId: number) => {
        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [partId]: option,
        }));
        setOpenDropdown(null);
        // You can update the "part.attendance" in your data source here if needed.
    };

    return (
        <div className="flex flex-col items-center justify-center h-1/2 p-8 bg-gray-100">
            <h1 className="text-xl sm:text-4xl font-bold mb-8">Part Attendance</h1>
            {PartAttendance.map((part) => (
                <div key={part.id} className="relative flex align-start bg-white flex-row text-md border border-black rounded sm:text-xl m-4 p-4">
                    <p className="p-2 m-2"><strong>Date:</strong> <span className="profileStat">{part.date}</span></p>
                    <p className="p-2 m-2"><strong>Course:</strong> <span className="profileStat">{part.course}</span></p>
                    <p className="p-2 m-2"><strong>Part:</strong> <span className="profileStat">{part.part}</span></p>
                    <p className="p-2 m-2"><strong>Length:</strong> <span className="profileStat">{part.length}h</span></p>
                    <p className="p-2 m-2"><strong>Attendance:</strong>
                        <button
                            onClick={() => toggleDropdown(part.id)}
                            className={`profileStat ${getAttendanceColorClass(part.attendance, selectedOptions[part.id])}`}
                        >
                            {selectedOptions[part.id] || part.attendance}
                        </button>
                    </p>
                    {openDropdown === part.id && (
                        <div className="absolute right-0 mt-2 p-1 bg-white border border-gray-300 rounded shadow-md z-10">
                            <p className="cursor-pointer hover:bg-metropoliaTrendGreen" onClick={() => handleOptionClick("Present", part.id)}>Present</p>
                            <p className="cursor-pointer hover:bg-metropoliaSupportRed" onClick={() => handleOptionClick("Not Present", part.id)}>Not Present</p>
                            {/* Add more options as needed */}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StudentAttendance;
