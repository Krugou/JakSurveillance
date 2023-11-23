import React, {useContext, useEffect, useState} from 'react';
import MainViewButton from '../../../components/main/buttons/MainViewButton';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/apiHooks';
const AdminCourses: React.FC = () => {
	const {user} = useContext(UserContext);
	const courseOptions = ['Course 1', 'Course 2', 'Course 3']; // Replace with your course options
	const [selectedCourse, setSelectedCourse] = useState(courseOptions[0]);
	const [courses, setCourses] = useState<Course[]>([]);
	const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCourse(event.target.value);
	};

	useEffect(() => {
		if (user) {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}

			// Create an async function inside the effect
			const fetchCourses = async () => {
				const fetchedCourses = await apiHooks.getCourses(token);
				console.log(
					'🚀 ~ file: AdminCourses.tsx:25 ~ fetchCourses ~ fetchedCourses:',
					fetchedCourses,
				);
				setCourses(fetchedCourses);
			};

			// Call the async function
			fetchCourses();
		}
	}, [user]);

	return (
		<div className="relative">
			<div className="h-1/2 relative overflow-x-scroll">
				<div className="max-h-96 h-96 overflow-y-scroll relative">
					<table className="table-auto w-full">
						<thead className="sticky top-0 bg-white z-10">
							<tr>
								{[
									'name',
									'code',
									'start_date',
									'end_date',
									'student_group',
									'topics',
									'instructors',
								].map((key, index) => (
									<th key={index} className="px-4 py-2">
										{key}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{courses.map((course, index) => (
								<tr key={index} className="cursor-pointer hover:bg-gray-200">
									{[
										'name',
										'code',
										'start_date',
										'end_date',
										'student_group',
										'topics',
										'instructors',
									].map((key, innerIndex) => (
										<td key={innerIndex} className="border px-2 py-2">
											{Array.isArray(course[key]) ? course[key].join(', ') : course[key]}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AdminCourses;
