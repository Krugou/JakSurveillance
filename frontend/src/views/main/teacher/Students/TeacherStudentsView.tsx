import {CircularProgress} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import MainViewButton from '../../../../components/main/buttons/MainViewButton';
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
}
// this is view for teacher to see the list of students in single course
const TeacherStudentsView: React.FC = () => {
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			toast.error('No token available');
			throw new Error('No token available');
		}
		const fetchStudents = async () => {
			const userid = 3; // Replace with actual instructor ID
			const students = await apiHooks.getStudentsByInstructorId(userid, token);
			console.log(
				'🚀 ~ file: TeacherStudentsView.tsx:22 ~ fetchStudents ~ students:',
				students,
			);
			setStudents(students);
			setLoading(false);
		};

		fetchStudents();
	}, []);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<BackgroundContainer>
			<div className="flex flex-wrap w-3/4 bg-gray-100 p-5">
				{students.map(student => (
					<div
						key={student.userid}
						className="m-4 bg-white rounded shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
					>
						<div className="px-6 py-4">
							<div className="font-bold text-xl mb-2">
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
							<div className="flex justify-between">
								<MainViewButton
									path={`/teacher/students/${student.userid}`}
									text="Student details"
								/>
								<MainViewButton
									path={`/teacher/students/${student.userid}/attendances`}
									text="Student Attendance"
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
