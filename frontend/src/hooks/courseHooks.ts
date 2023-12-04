import {useState, useEffect} from 'react';
import apiHooks from './ApiHooks';
export const useCourses = () => {
	const [courses, setCourses] = useState([]);
	const [threshold, setThreshold] = useState<number | null>(null); // Add this line

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response = await apiHooks.getAllCourses(token);
				setCourses(response);
			} catch (error) {
				console.error('Error fetching courses');
			}
		};

		const getThreshold = async () => {
			// Add this function
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response = await apiHooks.getAttendanceThreshold(token);
				console.log(response, 'thresholdresponse');
				setThreshold(response.attendancethreshold);
			} catch (error) {
				console.log(error);
			}
		};
		getThreshold();
		fetchCourses();
	}, []);

	return {courses, threshold}; // Return threshold along with courses
};
