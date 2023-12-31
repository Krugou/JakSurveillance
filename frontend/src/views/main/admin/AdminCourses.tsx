import SortIcon from '@mui/icons-material/Sort';
import {CircularProgress} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import InputField from '../../../components/main/course/createcourse/coursedetails/InputField';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';
/**
 * Course interface.
 * This interface defines the structure of a course object.
 *
 * @interface
 * @property {string} courseid - The ID of the course.
 * @property {string} name - The name of the course.
 * @property {string} code - The code of the course.
 * @property {string} start_date - The start date of the course.
 * @property {string} end_date - The end date of the course.
 * @property {string[]} student_group - The student groups of the course.
 * @property {string[]} topics - The topics of the course.
 * @property {string[]} instructors - The instructors of the course.
 */
interface Course {
	courseid: string;
	name: string;
	code: string;
	start_date: string;
	end_date: string;
	student_group: string[];
	topics: string[];
	instructors: string[];
}
/**
 * AdminCourses component.
 * This component is responsible for rendering a list of courses for an admin.
 * It fetches the courses from the API, and allows the admin to sort and filter them.
 * If the data is loading, it renders a loading spinner.
 * If no courses are available, it renders an error message.
 *
 * @returns {JSX.Element} The rendered AdminCourses component.
 */
const AdminCourses: React.FC = () => {
	const navigate = useNavigate();

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
	const navigateToCourse = (courseId: string) => {
		navigate(`./${courseId}`);
	};
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
			setIsLoading(true);
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
		<div className="relative lg:w-fit w-full">
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
					<div className="lg:w-1/4 sm:w-[20em] w-1/2 mt-4 mb-4">
						<InputField
							type="text"
							name="search"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							placeholder="Search..."
							label="Search"
						/>
					</div>
					<div className="relative bg-gray-100">
						<div className="relative max-h-96 h-96 overflow-y-scroll">
							<table className="table-auto">
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
												<button
													aria-label={`Sort by ${key}`} // Add this line
													className="ml-2 bg-metropoliaMainOrange text-sm text-white font-bold rounded hover:bg-metropoliaMainOrangeDark focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrangeDark p-1"
													onClick={() => sortCourses(key)}
												>
													<SortIcon />
												</button>
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredCourses.map((course, index) => (
										<tr
											key={index}
											className="cursor-pointer hover:bg-gray-200"
											onClick={() => navigateToCourse(course.courseid)}
										>
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
