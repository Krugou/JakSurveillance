import {CircularProgress} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import GeneralLinkButton from '../../../../components/main/buttons/GeneralLinkButton';
import InputField from '../../../../components/main/course/createcourse/coursedetails/InputField';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks'; // Import apiHooks
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
// this is view for teacher to see the list of students in single course
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

				console.log(
					'🚀 ~ file: TeacherStudentsView.tsx:32 ~ fetchStudents ~ students:',
					students,
				);

				setStudents(students);
				setLoading(false);
			}
			if (user?.role === 'counselor') {
				const students = await apiHooks.fetchAllStudents(token);

				console.log(
					'🚀 ~ file: TeacherStudentsView.tsx:32 ~ fetchStudents ~ students:',
					students,
				);
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
		<BackgroundContainer>
			<h1 className="text-2xl font-bold mb-4">Your Students</h1>
			<div className="flex flex-wrap w-3/4 bg-gray-100 p-5">
				<div className="w-full m-4 p-4">
					<InputField
						type="text"
						name="search"
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						placeholder="Search..."
						label="Search by name"
					/>
				</div>
				{filteredStudents.map(student => (
					<div
						key={student.userid}
						className="mb-4 mx-1 lg:mx-2 xl:mx-4 bg-white rounded shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 min-w-max"
					>
						<div className="px-4 lg:px-6 py-2 lg:py-4 text-sm md:text-base">
							<div className="font-bold text-lg mb-2">
								{student.first_name} {student.last_name}
							</div>
							{student.email && <p>Email: {student.email}</p>}
							{student.username && <p>Username: {student.username}</p>}
							{student.studentnumber && <p>Student Number: {student.studentnumber}</p>}
							{student.group_name && <p>Student Group: {student.group_name}</p>}
							{student.created_at && (
								<p>Account created: {new Date(student.created_at).toLocaleString()}</p>
							)}
							<div className="flex flex-wrap justify-between">
								<GeneralLinkButton
									path={`/${user?.role}/students/${student.userid}`}
									text="Details"
								/>
								<GeneralLinkButton
									path={`/${user?.role}/students/${student.userid}/attendances`}
									text="Attendance"
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</BackgroundContainer>
	);
};

export default TeacherStudentsView;
