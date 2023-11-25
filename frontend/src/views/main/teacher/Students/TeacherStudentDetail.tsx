import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import apiHooks from '../../../../hooks/ApiHooks';
import ProfileInfo from '../../../../components/profiles/ProfileInfo';
import StudentCourseGrid from '../../../../components/main/course/StudentCourseGrid';
interface StudentInfo {
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

interface Course {
	courseid: number;
	course_name: string;
	startDate: string;
	endDate: string;
	code: string;
	student_group: number | null;
	topic_names: string;
	selected_topics: string;
	instructor_name: string;
	usercourseid: number;
}
interface Student {
	// Existing properties...

	user: StudentInfo; // Replace 'any' with the actual type of 'user'
	courses: Course[];
}
const TeacherStudentDetail: React.FC = () => {
	const {id} = useParams<{id: string}>();
	const [student, setStudent] = useState<StudentInfo | null>(null); // Define the student state variable as a Student object
	const [courses, setCourses] = useState<Course[]>([]); // Define the courses state variable as an array of Course objects
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
				setStudent(response.user);
				setCourses(response.courses);
			} catch (error) {
				console.log(error);
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
			<h2 className="text-2xl font-bold mt-5 text-center">
				{student.first_name + ' ' + student.last_name}'s Courses
			</h2>
			<StudentCourseGrid courses={courses} showEndedCourses={true} />
		</div>
	);
};

export default TeacherStudentDetail;
