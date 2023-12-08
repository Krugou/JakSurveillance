import {CircularProgress} from '@mui/material';
import React, {useEffect, useState, useContext} from 'react';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
import InputField from '../../../../components/main/course/createcourse/coursedetails/InputField';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';
import {useCourses} from '../../../../hooks/courseHooks';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import WarningIcon from '@mui/icons-material/Warning';
import GeneralLinkButton from '../../../../components/main/buttons/GeneralLinkButton';

interface Student {
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	studentnumber: number;
	roleid: number;
	studentgroupid: number;
	created_at: string;
	userid: number;
	group_name: string;
}

interface SelectedCourse {
	name: string;
	code: string;
	courseid: string;
	start_date: string;
	end_date: string;
	studentgroup_name: string;
	topic_names: string;
	selected_topics: string;
	created_at: string;
}

const TeacherStudentsView: React.FC = () => {
	const {user} = useContext(UserContext);
	const [allStudents, setAllStudents] = useState<Student[]>([]);
	const [students, setStudents] = useState<Student[]>([]);

	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const {courses} = useCourses();
	const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(
		null,
	);

	// Fetch all students on mount
	useEffect(() => {
		const token: string | null = localStorage.getItem('userToken');

		if (!token) {
			toast.error('No token available');
			throw new Error('No token available');
		}

		const fetchStudents = async () => {
			if (user?.role === 'teacher') {
				const students = await apiHooks.getStudentsByInstructorId(
					user?.userid,
					token,
				);
				setAllStudents(students);
				setLoading(false);
			}

			if (user?.role === 'counselor') {
				const students = await apiHooks.fetchAllStudents(token);
				setAllStudents(students);
				setLoading(false);
			}
		};

		fetchStudents();
	}, []);

	// If loading, show loading spinner
	if (loading) {
		return <CircularProgress />;
	}

	// Filter students based on search term and selected course
	const filteredStudents = (selectedCourse ? students : allStudents).filter(
		student =>
			Object.values(student).some(
				value =>
					typeof value === 'string' &&
					value.toLowerCase().includes(searchTerm.toLowerCase()),
			),
	);
	console.log(
		'🚀 ~ file: TeacherStudentsView.tsx:67 ~ filteredStudents:',
		filteredStudents,
	);

	// This function is called when a course is selected
	const handleCourseSelect = async (value: string) => {
		if (!courses) {
			toast.error('Courses not loaded');
			return;
		}
		// Find the selected course from the courses array
		const selected = courses.find(
			(course: SelectedCourse) => `${course.name} ${course.code}` === value,
		) as SelectedCourse | undefined;

		setSelectedCourse(selected || null);

		// If the selected course is found, fetch the course details
		if (selected) {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const students = await apiHooks.getStudentsByCourseId(
					selected.courseid,
					token,
				);
				console.log(students, 'students');
				setStudents(students);
			} catch (error) {
				toast.error('Error fetching course details');
				console.log(error);
			}
		}
	};

	return (
		<div className="2xl:w-9/12 w-full mx-auto">
			<div className="flex flex-col gap-5 sm:gap-0 sm:flex-row items-center">
				<h1 className="text-2xl text-center p-3 bg-white rounded-lg w-fit ml-auto mr-auto font-bold mb-4">
					Your Students
				</h1>
			</div>
			<div className="w-full max-h-[40em] 2xl:max-h-[60em] overflow-y-scroll rounded-xl bg-gray-100 p-2 sm:p-5">
				<GeneralLinkButton
					path={`/${user?.role}/mainview`}
					text="Back to mainview"
				/>
				<div className="flex flex-col md:flex-row items-center justify-between">
					<div className="w-8/12 sm:w-[15em] mt-5 lg:ml-4 ml-0 mb-4">
						<InputField
							type="text"
							name="search"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							placeholder="Search..."
							label="Search by name"
						/>
					</div>

					<Autocomplete
						className="sm:w-[15em] w-10/12 mr-0 md:mr-4"
						freeSolo
						options={courses.map(
							(course: SelectedCourse) => `${course.name} ${course.code}`,
						)}
						onChange={(_, value) => handleCourseSelect(value as string)}
						value={
							selectedCourse ? `${selectedCourse.name} ${selectedCourse.code}` : null
						}
						renderInput={params => (
							<TextField
								{...params}
								label="Search By course"
								margin="normal"
								variant="outlined"
							/>
						)}
					/>
				</div>
				<p className="text-lg p-4 text-yellow-600 flex items-center">
					<WarningIcon fontSize="large" />
					<span className="ml-2">
						{selectedCourse
							? 'Searching only from students on the selected course.'
							: 'Searching from all students.'}
					</span>
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{filteredStudents.map(student => (
						<Link
							key={student.userid}
							to={`/${user?.role}/students/${student.userid}`}
							className="mb-4 mx-1 transition lg:mx-2 xl:mx-4 bg-white rounded shadow-lg max-w-full w-12/12 hover:bg-gray-200 transition duration-300"
						>
							<div className="px-4 flex flex-col lg:px-4 py-2 lg:py-4 text-sm md:text-base">
								<div className="font-bold text-lg mb-2 underline underline-offset-8 decoration-metropoliaMainOrange">
									{student.first_name} {student.last_name}
								</div>
								{student.email && <p>Email: </p>}
								<p className="break-all">{student.email}</p>
								<div className="flex flex-col gap-3 mt-3">
									{student.username && <p>Username: {student.username}</p>}
									{student.studentnumber && (
										<p>Student Number: {student.studentnumber}</p>
									)}
									{student.group_name && <p>Student Group: {student.group_name}</p>}
									{student.created_at && (
										<p>
											Account created: {new Date(student.created_at).toLocaleString()}
										</p>
									)}
									<div className="flex flex-wrap items-center justify-between">
										<p className="text-gray-500 hover:text-blue-500 transition duration-300">
											Click for details
										</p>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default TeacherStudentsView;
