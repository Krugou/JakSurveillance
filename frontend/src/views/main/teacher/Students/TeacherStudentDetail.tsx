import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import apiHooks from '../../../../hooks/ApiHooks';

interface Student {
	email: string;
	first_name: string;
	last_name: string;
	role: string;
	roleid: number;
	staff: number;
	studentnumber: string;
	userid: number;
	username: string;
	// Include other properties of student here
}

const TeacherStudentDetail: React.FC = () => {
	const {id} = useParams<{id: string}>();
	const [student, setStudent] = useState<Student | null>(null); // Define the student state variable as a Student object

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const response: Student = await apiHooks.getUserInfoByUserid(
					token,
					id as string,
				);
				console.log(response);
				setStudent(response); // Set the student state variable with the response
			} catch (error) {
				toast.error('Error fetching student data');
			}
		};

		fetchData();
	}, [id]);

	if (!student) {
		return <div>Loading...</div>;
	}

	return (
		<div className="bg-gray-100 p-5">
			<div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
				<p>Email: {student?.email}</p>
				<p>First Name: {student?.first_name}</p>
				<p>Last Name: {student?.last_name}</p>
				<p>Role: {student?.role}</p>
				<p>Role ID: {student?.roleid}</p>
				<p>Staff: {student?.staff}</p>
				<p>Student Number: {student?.studentnumber}</p>
				<p>User ID: {student?.userid}</p>
				<p>Username: {student?.username}</p>
			</div>
		</div>
	);
};

export default TeacherStudentDetail;
