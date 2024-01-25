import React, {useContext, useEffect, useState} from 'react';
import Card from '../../../../components/main/cards/Card';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';

interface Lecture {
	lectureid: number;
	topicname: string;
	code: string;
	[key: string]: any;
}

const CheckOpenLectures: React.FC = () => {
	const {user} = useContext(UserContext);
	const [openLectures, setOpenLectures] = useState<Lecture[]>([]);

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
					console.log('🚀 ~ fetchOpenLectures ~ lectures:', lectures);
					setOpenLectures(lectures);
				} catch (error) {
					console.error('Failed to fetch open lectures:', error);
				}
			};

			fetchOpenLectures();
		}
	}, []);

	return openLectures.length > 0 ? (
		<div className="flex flex-row items-center justify-center animate-pulse">
			{openLectures.map((lecture: Lecture) => (
				<Card
					key={lecture.lectureid}
					path={`/teacher/attendance/${lecture.lectureid}`}
					title={
						'Lecture open code: ' +
						lecture.code +
						' topic: ' +
						lecture.topicname +
						' !'
					}
					description="Click to continue"
				/>
			))}
		</div>
	) : null;
};

export default CheckOpenLectures;
