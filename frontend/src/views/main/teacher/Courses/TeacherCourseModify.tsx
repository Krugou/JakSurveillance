import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import apihooks from '../../../../hooks/ApiHooks';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import InputField from '../../../../components/main/course/createcourse/coursedetails/InputField';
import AddTeachers from '../../../../components/main/course/createcourse/AddTeachers';
// this is view for teacher to modify the single course details

interface CourseDetail {
	courseid: string;
	name: string;
	start_date: string;
	end_date: string;
	code: string;
	studentgroup_name: string;
	created_at: string;
	topic_names: string[];
	user_count: number;
	instructor_name: string;
}

const TeacherCourseModify: React.FC = () => {
	const [courseData, setCourseData] = useState<CourseDetail | null>(null);
	const [courseName, setCourseName] = useState(
		courseData ? courseData.name : '',
	);
	const [courseCode, setCourseCode] = useState(
		courseData ? courseData.code : '',
	);
	const [studentGroup, setStudentGroup] = useState(
		courseData ? courseData.studentgroup_name : '',
	);
	const [startDate, setStartDate] = useState(
		courseData ? courseData.start_date : '',
	);
	const [endDate, setEndDate] = useState(courseData ? courseData.end_date : '');

	const [instructors, setInstructors] = useState<{email: string}[]>([]);
	const [instructorEmail, setInstructorEmail] = useState('');

	const {id} = useParams<{id: string}>();

	// Replace with actual data fetching

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchCourses = async () => {
			if (id) {
				setIsLoading(true);
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const courseData = await apihooks.getCourseDetailByCourseId(id, token);
				setCourseData(courseData[0]);
				setIsLoading(false);
				setInstructorEmail(courseData[0].instructor_name);
			}
		};

		fetchCourses();
	}, [id]);

	useEffect(() => {
		if (courseData?.instructor_name) {
			setInstructors(
				courseData.instructor_name.split(',').map(email => ({email})),
			);
		}
	}, [courseData]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		const modifiedData = {
			courseName: courseName,
			courseCode: courseCode,
			studentGroup: studentGroup,
			startDate: startDate,
			endDate: endDate,
			instructors: instructors.map(instructor => instructor.email),
		};
		console.log(modifiedData);
	};

	const handleInputChange = (index, event) => {
		const values = [...instructors];
		values[index].email = event.target.value;
		setInstructors(values);
	};

	return (
		<BackgroundContainer>
			<h2 className="text-gray-800 font-semibold mb-6 text-md sm:text-2xl">
				Modify Course
			</h2>

			<form
				onSubmit={handleSubmit}
				className="bg-white md:w-2/4 xl:w-1/4 w-full sm:w-2/3 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 mx-auto"
			>
				<InputField
					label="Course Code"
					type="text"
					name="courseCode"
					value={courseData?.code}
					onChange={e => setCourseCode(e.target.value)}
				/>

				<InputField
					label="Course Name"
					type="text"
					name="courseName"
					value={courseData?.name}
					onChange={e => setCourseName(e.target.value)}
				/>
				<InputField
					label="Student Group"
					type="text"
					name="studentGroup"
					value={courseData?.studentgroup_name}
					onChange={e => setStudentGroup(e.target.value)}
				/>
				<InputField
					label="Start Date"
					type="datetime-local"
					name="startDate"
					value={new Date(courseData?.start_date || '').toISOString().slice(0, 16)}
					onChange={e => setStartDate(e.target.value)}
				/>
				<InputField
					label="End Date"
					type="datetime-local"
					name="endDate"
					value={new Date(courseData?.end_date || '').toISOString().slice(0, 16)}
					onChange={e => setEndDate(e.target.value)}
				/>
				<AddTeachers
					instructors={instructors}
					setInstructors={setInstructors}
					instructorEmail={instructorEmail}
					handleInputChange={handleInputChange}
					modify={true}
				/>
				<div className="flex w-full justify-center">
					<button
						className="bg-metropoliaMainOrange w-1/2 hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 rounded-xl px-4 focus:outline-none focus:shadow-outline"
						type="button"
						onClick={handleSubmit}
					>
						Modify Course
					</button>
				</div>
			</form>
		</BackgroundContainer>
	);
};

export default TeacherCourseModify;
