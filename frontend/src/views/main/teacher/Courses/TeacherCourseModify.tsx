import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import apihooks from '../../../../hooks/ApiHooks';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import InputField from '../../../../components/main/course/createcourse/coursedetails/InputField';
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

	const [instructors, setInstructors] = useState<string[]>([]);

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
			}
		};

		fetchCourses();
	}, [id]);

	useEffect(() => {
		if (courseData?.instructor_name) {
			setInstructors(courseData.instructor_name.split(','));
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
			instructors: instructors,
		};
		console.log(modifiedData);
	};
	const deleteInstructor = index => {
		const newInstructors = [...instructors];
		newInstructors.splice(index, 1);
		setInstructors(newInstructors);
	};

	const handleInputChange = (index, event) => {
		const values = [...instructors];
		values[index] = event.target.value;
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
				<h2 className="text-gray-800 font-semibold mt-8 mb-2 text-md border-t border-black sm:text-2xl">
					{' '}
					Modify Course Instructors{' '}
				</h2>
				{instructors.map((instructor, index) => (
					<div key={index} className="flex items-center mb-3">
						<div className="flex flex-col mb-3">
							<InputField
								type="text"
								name="email"
								label="Email"
								value={instructor}
								onChange={event => handleInputChange(index, event)}
							/>
						</div>
						{instructors.length > 1 && (
							<button
								className="ml-2 w-8 p-2 mt-5 bg-red-500 text-white font-bold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
								onClick={() => deleteInstructor(index)}
							>
								x
							</button>
						)}
					</div>
				))}
				<button
					className="bg-metropoliaMainOrange w-1/2 mb-4 hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 rounded-xl px-4 focus:outline-none focus:shadow-outline"
					type="button"
					onClick={() => setInstructors([...instructors, ''])}
				>
					Add Instructor
				</button>
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
