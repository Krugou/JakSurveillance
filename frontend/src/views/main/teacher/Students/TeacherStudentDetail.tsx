import React, {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import apiHooks from '../../../../hooks/ApiHooks';
import ProfileInfo from '../../../../components/profiles/ProfileInfo';
import StudentCourseGrid from '../../../../components/main/course/StudentCourseGrid';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import {UserContext} from '../../../../contexts/UserContext';
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
	const {update, setUpdate} = useContext(UserContext);
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
				// Set the student and courses state variables
				setStudent(response.user);
				setCourses(response.courses);
			} catch (error) {
				console.log(error);
				toast.error('Error fetching student data');
			}
		};

		fetchData();
	}, [id, update]);

	// If the student state variable is null, show a loading indicator
	if (!student) {
		return <div>Loading...</div>;
	}

	const updateView = () => {
		alert('updateView');
		setUpdate(!update);
	};
	return (
		<BackgroundContainer>
			<div className="bg-gray-100 rounded-lg p-5">
				<h2 className="text-2xl font-bold underline underline-offset-8 decoration-metropoliaMainOrange mb-5">
					{student.first_name + ' ' + student.last_name}'s Info
				</h2>
				<ProfileInfo user={student} />
				<div className="w-full mt-10 h-1 bg-metropoliaMainOrange rounded-md"></div>
				<h2 className="text-2xl font-bold mt-10 underline underline-offset-8 decoration-metropoliaMainOrange mb-5">
					{student.first_name + ' ' + student.last_name}'s Courses
				</h2>
				<StudentCourseGrid
					courses={courses}
					showEndedCourses={true}
					updateView={updateView}
				/>
			</div>
		</BackgroundContainer>
	);
};

export default TeacherStudentDetail;
