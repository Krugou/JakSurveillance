import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import apiHooks from '../../../../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
const options = ['Option 1', 'Option 234', 'Option 3'];

const TeacherCourseStats = () => {
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response = await apiHooks.getAllCourses(token);
				console.log(response, 'response');
				setCourses(response);
			} catch (error) {
				toast.error('Error fetching courses');
				console.log(error);
			}
		};
		fetchCourses();
	}, []);
	console.log(courses, 'courses');

	const handleCourseSelect = async (value: string) => {
		const selectedCourse = courses.find(
			course => `${course.name} ${course.code}` === value,
		);
		if (selectedCourse) {
			try {
				const response = await apiHooks.getDetailsByCourseId(
					selectedCourse.courseid,
					token,
				);
				console.log(response);
			} catch (error) {
				toast.error('Error fetching course details');
				console.log(error);
			}
		}
	};
	return (
		<div style={{width: 300}}>
			<Autocomplete
				freeSolo
				options={courses.map(course => `${course.name} ${course.code}`)}
				onChange={(event, value) => handleCourseSelect(value)}
				renderInput={params => (
					<TextField
						{...params}
						label="Search courses"
						margin="normal"
						variant="outlined"
					/>
				)}
			/>
		</div>
	);
};

export default TeacherCourseStats;
