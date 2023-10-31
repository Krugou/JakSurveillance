import { formatISO } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MainViewButton from "../../../../components/main/buttons/MainViewButton";
const CreateAttendance: React.FC = () => {
    const [date, setDate] = useState<Date | Date[]>(new Date());
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedSession, setSelectedSession] = useState<string>('');
    const [selectedParticipant, setSelectedParticipant] = useState<string>('');
    const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);
    // test data

    const data = {
        "status": "success",
        "reservations": [
            {
                "id": "3583690",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-10-24T09:00:00",
                "endDate": "2023-10-24T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86499",
                        "type": "room",
                        "code": "KMD759",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583691",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T18:05:42",
                "startDate": "2023-10-25T10:00:00",
                "endDate": "2023-10-25T12:00:00",
                "resources": [
                    {
                        "id": "86494",
                        "type": "room",
                        "code": "KMD659",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583692",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-10-31T09:00:00",
                "endDate": "2023-10-31T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86499",
                        "type": "room",
                        "code": "KMD759",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583693",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-11-01T09:00:00",
                "endDate": "2023-11-01T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86494",
                        "type": "room",
                        "code": "KMD659",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583694",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-11-07T09:00:00",
                "endDate": "2023-11-07T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86499",
                        "type": "room",
                        "code": "KMD759",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583695",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-11-08T09:00:00",
                "endDate": "2023-11-08T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86494",
                        "type": "room",
                        "code": "KMD659",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583696",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-11-14T09:00:00",
                "endDate": "2023-11-14T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86499",
                        "type": "room",
                        "code": "KMD759",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583697",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-11-15T09:00:00",
                "endDate": "2023-11-15T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86494",
                        "type": "room",
                        "code": "KMD659",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583698",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-11-21T09:00:00",
                "endDate": "2023-11-21T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86499",
                        "type": "room",
                        "code": "KMD759",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583699",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-11-22T09:00:00",
                "endDate": "2023-11-22T11:30:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86494",
                        "type": "room",
                        "code": "KMD659",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583700",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-11-28T09:00:00",
                "endDate": "2023-11-28T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86499",
                        "type": "room",
                        "code": "KMD759",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583701",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-11-29T09:00:00",
                "endDate": "2023-11-29T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86494",
                        "type": "room",
                        "code": "KMD659",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583702",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-12-05T09:00:00",
                "endDate": "2023-12-05T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86499",
                        "type": "room",
                        "code": "KMD759",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583704",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-12-12T09:00:00",
                "endDate": "2023-12-12T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86499",
                        "type": "room",
                        "code": "KMD759",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            },
            {
                "id": "3583705",
                "subject": "Mediapalvelut-projekti TX00CG61-3009",
                "modifiedDate": "2023-10-23T10:55:47",
                "startDate": "2023-12-13T09:00:00",
                "endDate": "2023-12-13T12:00:00",
                "resources": [
                    {
                        "id": "127164",
                        "type": "realization",
                        "code": "TX00CG61-3009",
                        "name": "Mediapalvelut-projekti"
                    },
                    {
                        "id": "102955",
                        "type": "student_group",
                        "code": "TVT21-M",
                        "name": "TVT21-M"
                    },
                    {
                        "id": "86494",
                        "type": "room",
                        "code": "KMD659",
                        "parent": {
                            "id": "78025",
                            "type": "building",
                            "code": "KAAPO",
                            "name": "Karamalmin kampus, Karaportti 2, 02610 Espoo"
                        },
                        "name": "Oppimistila"
                    }
                ],
                "description": ""
            }
        ]
    };
    useEffect(() => {
        const dates = data.reservations.map((reservation: any) => new Date(reservation.startDate));
        setHighlightedDates(dates);
    }, []);
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
    const tileClassName = ({ date, view }) => {
        // Add class to dates in the month view only
        if (view === 'month') {
            // Check if a date React-Calendar wants to check is on the list of dates to highlight
            if (highlightedDates.find(dDate => formatISO(dDate, { representation: 'date' }) === formatISO(date, { representation: 'date' }))) {
                return 'highlight';
            }
        }
    };
    const timeOfDay = ['AP', 'IP'];
    const handleDateChangeCalendar = (date: Date) => {
        const formattedDate = formatISO(date, { representation: 'date' });
        const isHighlighted = highlightedDates.some(dDate => formatISO(dDate, { representation: 'date' }) === formattedDate);

        if (isHighlighted) {
            setDate(date);
            const hours = date.getHours();
            setSelectedLocation(hours < 12 ? 'AP' : 'IP');
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-1/2 p-10 bg-gray-100">
            <h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Fill in to open the attendance collection</h1>
            <div className="relative mt-4">
                <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select Course</option>
                    <option value="TX00CG61-3009">TX00CG61-3009</option>
                </select>
            </div>

            <div className="relative mt-4">
                <select
                    value={selectedParticipant}
                    onChange={(e) => setSelectedParticipant(e.target.value)}
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select Topic</option>
                    <option value="1">math</option>
                    <option value="2">physics</option>
                    <option value="3">Topic 3</option>
                </select>
            </div>
            <h2>Select desired date</h2>
            <Calendar onChange={handleDateChangeCalendar} tileClassName={tileClassName} />
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


            </div>
            <MainViewButton path='/teacher/attendance/attendance' text='Open' />
        </div>
    );
};

export default CreateAttendance;
