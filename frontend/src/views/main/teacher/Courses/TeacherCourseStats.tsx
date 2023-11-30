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
	return (
		<div style={{width: 300}}>
			<Autocomplete
				freeSolo
				options={options}
				renderInput={params => (
					<TextField
						{...params}
						label="freeSolo"
						margin="normal"
						variant="outlined"
					/>
				)}
			/>
		</div>
	);
};

export default TeacherCourseStats;
