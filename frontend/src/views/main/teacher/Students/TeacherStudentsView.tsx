import {CircularProgress} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import MainViewButton from '../../../../components/main/buttons/MainViewButton';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks'; // Import apiHooks
import InputField from '../../../../components/main/course/createcourse/coursedetails/InputField';
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
			if (user) {
				const students = await apiHooks.getStudentsByInstructorId(
					user.userid,
					token,
				);
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
						className="m-4 bg-white rounded shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 min-w-max"
					>
						<div className="px-6 py-4 text-sm sm:text-base">
							<div className="font-bold text-lg mb-2">
								{student.first_name} {student.last_name}
							</div>
							{student.email && <p>Email: {student.email}</p>}
							{student.username && <p>Username: {student.username}</p>}
							{student.studentnumber && <p>Student Number: {student.studentnumber}</p>}
							{student.roleid && <p>Role ID: {student.roleid}</p>}
							{student.studentgroupid && (
								<p>Student Group ID: {student.studentgroupid}</p>
							)}
							{student.created_at && <p>Created At: {student.created_at}</p>}

							<div className="flex flex-wrap justify-between">
								<MainViewButton
									path={`/teacher/students/${student.userid}`}
									text="Details"
								/>
								<MainViewButton
									path={`/teacher/students/${student.userid}/attendances`}
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
