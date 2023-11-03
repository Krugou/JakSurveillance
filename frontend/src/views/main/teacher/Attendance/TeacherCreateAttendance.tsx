import {formatISO} from 'date-fns';
import React, {useEffect, useRef, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MainViewButton from '../../../../components/main/buttons/MainViewButton';
import data from '../../../../data/extradatafordev';
const CreateAttendance: React.FC = () => {
	const [date, setDate] = useState<Date | Date[]>(new Date());
	const [calendarOpen, setCalendarOpen] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<string>('');
	const [selectedSession, setSelectedSession] = useState<string>('');
	const [selectedParticipant, setSelectedParticipant] = useState<string>('');
	const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

	const inputRef = useRef<HTMLInputElement | null>(null);
	// test data

	interface Reservation {
		startDate: string;
	}
	useEffect(() => {
		const dates = data.reservations.map(
			(reservation: Reservation) => new Date(reservation.startDate),
		);
		setHighlightedDates(dates);
	}, []);
	useEffect(() => {
		if (calendarOpen) {
			inputRef.current?.focus();
		}
	}, [calendarOpen]);

	const toggleCalendar = () => {
		setCalendarOpen(prev => !prev);
	};
	const tileClassName = ({date, view}: {date: Date; view: string}) => {
		// Add class to dates in the month view only
		if (view === 'month') {
			// Check if a date React-Calendar wants to check is on the list of dates to highlight
			if (
				highlightedDates.find(
					dDate =>
						formatISO(dDate, {representation: 'date'}) ===
						formatISO(date, {representation: 'date'}),
				)
			) {
				return 'highlight';
			}
		}
		return ''; // default return value
	};
	const timeOfDay = ['AP', 'IP'];
const handleDateChangeCalendar = (
	value: Date | Date[] | null | [Date | null, Date | null],
) => {
	if (value) {
		let date: Date | null = null;
		if (Array.isArray(value)) {
			date = value[0];
		} else {
			date = value;
		}

		if (date) {
			const formattedDate = formatISO(date, {representation: 'date'});
			const isHighlighted = highlightedDates.some(
				dDate => formatISO(dDate, {representation: 'date'}) === formattedDate,
			);

			if (isHighlighted) {
				setDate(date);
				const hours = date.getHours();
				setSelectedLocation(hours < 12 ? 'AP' : 'IP');
				setCalendarOpen(false);
			}
		}
	}
};
	return (
		<div className="flex flex-col items-center justify-center h-1/2 p-10 bg-gray-100">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">
				Fill in to open the attendance collection
			</h1>
			<div className="relative mt-4">
				<select
					aria-label="Session"
					value={selectedSession}
					onChange={e => setSelectedSession(e.target.value)}
					className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
				>
					<option value="">Select Course</option>
					<option value="TX00CG61-3009">TX00CG61-3009</option>
				</select>
			</div>

			<div className="relative mt-4">
				<select
					aria-label="Participant"
					value={selectedParticipant}
					onChange={e => setSelectedParticipant(e.target.value)}
					className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
				>
					<option value="">Select Topic</option>
					<option value="1">math</option>
					<option value="2">physics</option>
					<option value="3">Topic 3</option>
				</select>
			</div>
			<h2 className="m-4 p-4">Select desired date</h2>

			<div className="text-md sm:text-xl mb-4">
				<div className="relative">
					<input
						ref={inputRef}
						type="text"
						aria-label="Date"
						className="py-2 pl-4 pr-12 rounded border focus:ring focus:ring-blue-300 focus:outline-none"
						value={Array.isArray(date) ? 'Multiple Dates' : date.toDateString()}
						onClick={toggleCalendar}
					/>
					{calendarOpen && (
						<div className="absolute top-12 left-0 z-10">
							<Calendar
								onChange={handleDateChangeCalendar}
								tileClassName={tileClassName}
							/>
						</div>
					)}
				</div>

				<div className="relative mt-4">
					<select
						title="Time of Day" // Add this line
						value={selectedLocation}
						onChange={e => setSelectedLocation(e.target.value)}
						className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
					>
						<option value="">Time of day</option>
						{timeOfDay.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			</div>
			<MainViewButton path="/teacher/attendance/attendance" text="Open" />
		</div>
	);
};

export default CreateAttendance;
