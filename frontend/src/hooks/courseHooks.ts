import {useState, useEffect} from 'react';
import apiHooks from './ApiHooks';
export const useCourses = () => {
	const [courses, setCourses] = useState([]);

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
				toast.error('Error fetching courses');
			}
		};

		fetchCourses();
	}, []);

	return courses;
};
