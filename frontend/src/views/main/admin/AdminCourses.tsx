import SortIcon from '@mui/icons-material/Sort';
import {CircularProgress, IconButton} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import InputField from '../../../components/main/course/createcourse/coursedetails/InputField';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/apiHooks';

const AdminCourses: React.FC = () => {
	const {user} = useContext(UserContext);
	const [courses, setCourses] = useState<Course[]>([]);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortKey, setSortKey] = useState('name');
	const [isLoading, setIsLoading] = useState(true);
	const sortedCourses = [...courses].sort((a, b) => {
		if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
		if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
		return 0;
	});

	const sortCourses = (key: string) => {
		setSortKey(key);
		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
	};

	const filteredCourses = sortedCourses.filter(course =>
		Object.values(course).some(
			value =>
				typeof value === 'string' &&
				value.toLowerCase().includes(searchTerm.toLowerCase()),
		),
	);
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
				setCourses(fetchedCourses);
				setIsLoading(false);
			};

			fetchCourses();
		}
	}, [user]);

	return (
		<div className="relative">
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<CircularProgress />
				</div>
			) : courses.length === 0 ? (
				<div className="flex justify-center items-center h-full">
					<p>No courses available</p>
				</div>
			) : (
				<>
					<div className="w-1/4 m-4 p-4">
						<InputField
							type="text"
							name="search"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							placeholder="Search..."
							label="Search"
						/>
					</div>
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
												<IconButton onClick={() => sortCourses(key)}>
													<SortIcon />
												</IconButton>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredCourses.map((course, index) => (
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
				</>
			)}
		</div>
	);
};

export default AdminCourses;
