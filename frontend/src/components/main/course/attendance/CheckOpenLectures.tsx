import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';

interface Lecture {
	lectureid: number;
	topicname: string;
	[key: string]: any; // for other properties of lecture
}

const CheckOpenLectures: React.FC = () => {
	const {user} = useContext(UserContext);
	const [openLectures, setOpenLectures] = useState<Lecture[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		if (user) {
			const fetchOpenLectures = async () => {
				try {
					const lectures = await apiHooks.getOpenLecturesByTeacher(
						user.userid,
						token,
					);
					setOpenLectures(lectures);
				} catch (error) {
					console.error('Failed to fetch open lectures:', error);
				}
			};

			fetchOpenLectures();
		}
	}, [user]);

	const handleOpenLecture = (lectureId: number) => {
		navigate(`/teacher/attendance/${lectureId}`);
	};

	return (
		<div className="flex flex-col items-center justify-center space-y-4">
			{openLectures.map((lecture: Lecture) => (
				<div
					key={lecture.lectureid}
					className="flex flex-col items-center justify-center bg-blue-200 p-4 rounded-lg shadow-md w-full max-w-md"
				>
					<h2 className="text-2xl font-bold mb-2">{lecture.topicname}</h2>

					<button
						onClick={() => handleOpenLecture(lecture.lectureid)}
						className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
					>
						Click to continue your lecture
					</button>
				</div>
			))}
		</div>
	);
};

export default CheckOpenLectures;
