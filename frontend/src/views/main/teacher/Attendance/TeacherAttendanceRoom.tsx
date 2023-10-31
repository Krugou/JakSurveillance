import React from 'react';

const AttendanceRoom: React.FC = () => {
    const attendees = ["oppilas 1", "Oppilas 2", "Oppilas 3", "Oppilas 4", "Oppilas 5"]; // Replaced with real data

    return (
        <div className="flex flex-col w-full m-auto items-center justify-center h-1/2 p-10 bg-gray-100">
            <h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Attendance</h1>
            <div className="flex w-1/3 gap-10">
                <div className="flex flex-col w-2/3">
                <div className="bg-gray-200 h-full">
                    QR CODE
                </div>
                    <p>Date</p>
                </div>
            <div className="text-md sm:text-xl mb-4">
                <h2 className="text-lg font-bold mb-2">List of Attendees:</h2>
                <ol className="list-decimal pl-5">
                    {attendees.map((attendee, index) => (
                        <li key={index}>{attendee}</li>
                    ))}
                </ol>
            </div>
            </div>
        </div>
    );
};

export default AttendanceRoom;
