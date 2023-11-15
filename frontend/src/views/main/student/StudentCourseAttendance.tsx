import React from 'react';
import {useEffect, useState, ChangeEvent} from 'react';
import {useParams} from 'react-router-dom';
import apiHooks from '../../../hooks/ApiHooks';
interface Attendance {
	date: string;
	name: string;
	start_date: string;
	timeofday: string;
	topicname: string;
	status: number;
}

const StudentCourseAttendance: React.FC = () => {
	const {usercourseid} = useParams<{usercourseid}>();
	const [attendanceData, setAttendanceData] = useState<Attendance[] | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};
	useEffect(() => {
		const fetchData = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response = await apiHooks.getAttendanceInfoByUsercourseid(
					usercourseid,
					token,
				);
				console.log(response, 'RESPONSE');
				setAttendanceData(response);
			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchData();
	}, [usercourseid]);

	if (!attendanceData) {
		return <div>Loading...</div>;
	}

	const getAttendanceColorClass = (attendance: number) => {
		if (attendance === 1) {
			return 'bg-metropoliaTrendGreen';
		} else {
			return 'bg-metropoliaSupportRed'; // You can set a default color class here if needed
		}
	};
	const filteredAttendanceData = attendanceData.filter(attendance =>
		new Date(attendance.start_date).toLocaleDateString().includes(searchTerm),
	);
	return (
		<div className="flex flex-col items-center justify-center h-1/2 p-8 bg-gray-100">
			<h1 className="text-xl sm:text-4xl font-bold mb-8">
				Attendance for Course {attendanceData[0].name}
			</h1>
			<input
				type="text"
				placeholder="Search by date"
				value={searchTerm}
				onChange={handleSearchChange}
				className="w-1/6 p-2 m-2 border border-black rounded"
			/>
			{filteredAttendanceData.map((attendance, index) => (
				<div
					key={index}
					className={`relative flex align-start flex-row text-md border border-black rounded sm:text-xl m-4 p-4 ${
						attendance.status === 0
							? 'bg-metropoliaSupportRed'
							: 'bg-metropoliaTrendGreen'
					}`}
				>
					<p className="p-2 text-white m-2">
						<strong>Date:</strong>{' '}
						<span className="profileStat">
							{new Date(attendance.start_date).toLocaleDateString()}
						</span>
					</p>
					<p className="p-2 text-white m-2">
						<strong>Duration:</strong> <span className="profileStat">unknown</span>
					</p>
					<p className="p-2  text-white m-2">
						<strong>Time of Day:</strong>{' '}
						<span className="profileStat">{attendance.timeofday}</span>
					</p>
					<p className="p-2 text-white m-2">
						<strong>Topic:</strong>{' '}
						<span className="profileStat">{attendance.topicname}</span>
					</p>

					<p className="p-2 text-white m-2">
						<strong>Status:</strong>
						<span
							className={`profileStat ${getAttendanceColorClass(attendance.status)}`}
						>
							{attendance.status === 1 ? 'Present' : 'Absent'}
						</span>
					</p>
				</div>
			))}
		</div>
	);
};

export default StudentCourseAttendance;
