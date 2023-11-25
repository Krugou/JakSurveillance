import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import apiHooks from '../../../../hooks/ApiHooks';
import ProfileInfo from '../../../../components/profiles/ProfileInfo';
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
	created_at: string;
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
			<ProfileInfo user={student} />
		</div>
	);
};

export default TeacherStudentDetail;
