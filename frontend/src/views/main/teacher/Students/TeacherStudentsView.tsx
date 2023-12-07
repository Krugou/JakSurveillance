import {CircularProgress} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
import InputField from '../../../../components/main/course/createcourse/coursedetails/InputField';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';

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

const TeacherStudentsView: React.FC = () => {
	const {user} = React.useContext(UserContext);
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

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
				setStudents(students);
				setLoading(false);
			}

			if (user?.role === 'counselor') {
				const students = await apiHooks.fetchAllStudents(token);
				setStudents(students);
				setLoading(false);
			}
		};

		fetchStudents();
	}, []);

	if (loading) {
		return <CircularProgress />;
	}

	const filteredStudents = students.filter(student =>
		Object.values(student).some(
			value =>
				typeof value === 'string' &&
				value.toLowerCase().includes(searchTerm.toLowerCase()),
		),
	);

	return (
		<div className="2xl:w-9/12 w-full mx-auto">
			<h1 className="text-2xl text-center p-3 bg-white rounded-lg w-fit ml-auto mr-auto font-bold mb-4">
				Your Students
			</h1>
			<div className="w-full max-h-[40em] 2xl:max-h-[60em] overflow-y-scroll rounded-xl bg-gray-100 p-2 sm:p-5">
				<div className="w-11/12 sm:w-[20em] lg:ml-4 ml-2 mb-4">
					<InputField
						type="text"
						name="search"
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						placeholder="Search..."
						label="Search by name"
					/>
				</div>
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
								<p>{student.email}</p>
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
