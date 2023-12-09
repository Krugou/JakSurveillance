import React, {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import apiHooks from '../../../../hooks/ApiHooks';
import ProfileInfo from '../../../../components/profiles/ProfileInfo';
import StudentCourseGrid from '../../../../components/main/course/StudentCourseGrid';
import {UserContext} from '../../../../contexts/UserContext';
import GeneralLinkButton from '../../../../components/main/buttons/GeneralLinkButton';
/**
 * StudentInfo interface.
 * This interface defines the shape of a StudentInfo object.
 */
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
/**
 * Course interface.
 * This interface defines the shape of a Course object.
 */
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
}/**
 * Student interface.
 * This interface defines the shape of a Student object.
 */
interface Student {
	// Existing properties...

	user: StudentInfo; // Replace 'any' with the actual type of 'user'
	courses: Course[];
}/**
 * TeacherStudentDetail component.
 * This component is responsible for rendering the detailed view of a single student for a teacher.
 * It fetches the student's information and the courses they are enrolled in.
 * It also provides functionality for the teacher to add or remove the student from a course.
 */
const TeacherStudentDetail: React.FC = () => {
	const {id} = useParams<{id: string}>();
	const [student, setStudent] = useState<StudentInfo | null>(null); // Define the student state variable as a Student object
	const [courses, setCourses] = useState<Course[]>([]); // Define the courses state variable as an array of Course objects
	const {user, update, setUpdate} = useContext(UserContext);
	const token = localStorage.getItem('userToken');
	useEffect(() => {
		const fetchData = async () => {
			try {
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

	const updateView = () => {
		setUpdate(!update);
	};
	const handleAddStudentToCourse = async (courseid: number | undefined) => {
		try {
			if (!token) {
				throw new Error('No token available');
			}
			if (!courseid) {
				throw new Error('No course selected');
			}
			const response = await apiHooks.updateStudentCourses(
				token,
				student?.userid,
				courseid,
			);
			console.log(response);
			// Add the student to the selected course'

			toast.success('Student added to course');

			updateView();
			// You'll need to implement this function yourself
		} catch (error) {
			console.log(error);
			error instanceof Error && toast.error(error.message);
		}
	};

	const handleRemoveStudentFromCourse = async (
		usercourseid: number | undefined,
	) => {
		try {
			if (!token) {
				throw new Error('No token available');
			}
			if (!usercourseid) {
				throw new Error('No course selected');
			}
			const response = await apiHooks.deleteStudentFromCourse(token, usercourseid);
			console.log(response);
			// Remove the student from the selected course
			toast.success('Student removed from course');
			updateView();
			// You'll need to implement this function yourself
		} catch (error) {
			console.log(error);
			error instanceof Error && toast.error(error.message);
		}
	};

	// If the student state variable is null, show a loading indicator
	if (!student) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-full sm:w-fit">
			<div className="bg-white rounded-lg p-5">
				<GeneralLinkButton
					path={`/${user?.role}/students`}
					text="Back to students"
				/>
				<h2 className="text-2xl font-bold mt-5 mb-5">
					{student.first_name + ' ' + student.last_name}'s Info
				</h2>
				<ProfileInfo user={student} />
				<div className="w-full mt-5 h-1 bg-metropoliaMainOrange rounded-md"></div>
				<h2 className="text-2xl font-bold mt-5 mb-5">
					{student.first_name + ' ' + student.last_name}'s Courses
				</h2>
				<div className="bg-gray-100 pl-2 pt-1 pb-2 pr-2">
					<StudentCourseGrid
						courses={courses}
						showEndedCourses={true}
						updateView={updateView}
						handleAddStudentToCourse={handleAddStudentToCourse}
						handleRemoveStudentFromCourse={handleRemoveStudentFromCourse}
					/>
				</div>
			</div>
		</div>
	);
};

export default TeacherStudentDetail;
