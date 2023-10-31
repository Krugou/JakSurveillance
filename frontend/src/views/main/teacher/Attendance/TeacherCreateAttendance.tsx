import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import mainViewButton from "../../../../components/main/buttons/MainViewButton";
import MainViewButton from "../../../../components/main/buttons/MainViewButton";

const CreateAttendance: React.FC = () => {
    const [date, setDate] = useState<Date | Date[]>(new Date());
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedSession, setSelectedSession] = useState<string>('');
    const [selectedParticipant, setSelectedParticipant] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (calendarOpen) {
            inputRef.current?.focus();
        }
    }, [calendarOpen]);

    const handleDateChange = (newDate: Date | Date[]) => {
        setDate(newDate);
    };

    const toggleCalendar = () => {
        setCalendarOpen((prev) => !prev);
    };

    const timeOfDay = ['AP', 'IP'];

    return (
        <div className="flex flex-col items-center justify-center h-1/2 p-10 bg-gray-100">
            <h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Fill in to open the attendance collection</h1>

            <div className="text-md sm:text-xl mb-4">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        className="py-2 pl-4 pr-12 rounded border focus:ring focus:ring-blue-300 focus:outline-none"
                        value={Array.isArray(date) ? 'Multiple Dates' : date.toDateString()}
                        onClick={toggleCalendar}
                    />
                    {calendarOpen && (
                        <div className="absolute top-12 left-0 z-10">
                            <Calendar onChange={handleDateChange} value={date} />
                        </div>
                    )}
                </div>

                <div className="relative mt-4">
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Time of day</option>
                        {timeOfDay.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative mt-4">
                    <select
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select Course</option>
                    </select>
                </div>

                <div className="relative mt-4">
                    <select
                        value={selectedParticipant}
                        onChange={(e) => setSelectedParticipant(e.target.value)}
                        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select Topic</option>
                    </select>
                </div>
            </div>
            <MainViewButton path='/teacher/attendance/attendance' text='Open' />
        </div>
    );
};

export default CreateAttendance;
