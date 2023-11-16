import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import apiHooks from '../../../hooks/ApiHooks';
import AddTeachers from './createcourse/AddTeachers';
import CourseDetails from './createcourse/CourseDetails';
import StudentList from './createcourse/StudentList';
import TopicGroupAndTopicsSelector from './createcourse/TopicsGroupAndTopics';
// this is view for teacher to create the course
const CreateCourseCustom: React.FC = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);
	const [courseName, setCourseName] = useState('');

	const [courseCode, setCourseCode] = useState('');
	const [studentGroup, setStudentGroup] = useState('');
	const [startDate, setStartDate] = useState('');

	const [instructorEmail, setInstructorEmail] = useState('');
	const [instructors, setInstructors] = useState([{email: ''}]);

	const [studentList, setStudentList] = useState<string[]>([]);
	const [endDate, setEndDate] = useState('');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [topicsFormData, setTopicsFormData] = useState<any>([]);

	const handleInputChange = (index, event) => {
		const values = [...instructors];
		values[index].email = event.target.value;
		setInstructors(values);
	};

	const validateFields = () => {
		switch (currentStep) {
			case 1:
				return courseCode && courseName && studentGroup && startDate && endDate;
			case 2:
				return (
					instructors &&
					instructors.length > 0 &&
					instructors.every(instructor => instructor.email)
				);
			case 3:
				return studentList && studentList.length > 0;
			case 4:
				return (
					topicsFormData &&
					topicsFormData.topicgroup &&
					topicsFormData.topics &&
					topicsFormData.topics.length > 0
				);
			default:
				return false;
		}
	};
	const incrementStep = () => {
		if (validateFields()) {
			setCurrentStep(prevStep => prevStep + 1);
		} else {
			alert('Please fill all required fields.');
		}
	};
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const courseData = {
			courseName: courseName,
			courseCode: courseCode,
			studentGroup: studentGroup,
			startDate: startDate,
			endDate: endDate,
			instructors: instructors,
			studentList: studentList,
			topicGroup: topicsFormData.topicgroup,
			topics: topicsFormData.topics,
			instructorEmail: 'teacher@metropolia.fi', // get email from userContext
		};

		const response = await apiHooks.createCourse(courseData);

		if (response) {
			navigate(`/teacher/courses/${response.courseId}`);
			console.log('Course created');
		} else {
			console.error('Course creation failed');
		}
	};
	useEffect(() => {
		setInstructorEmail('teacher@metropolia.fi'); // get email from userContext
		if (instructorEmail) {
			setInstructors([{email: instructorEmail}]);
		}
	}, [instructorEmail]);

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full  mx-auto bg-white p-6 rounded shadow-md"
		>
			{currentStep === 1 && (
				<CourseDetails
					courseCode={courseCode}
					setCourseCode={setCourseCode}
					courseName={courseName}
					setCourseName={setCourseName}
					studentGroup={studentGroup}
					setStudentGroup={setStudentGroup}
					startDate={startDate}
					setStartDate={setStartDate}
					endDate={endDate}
					setEndDate={setEndDate}
				/>
			)}
			{currentStep === 2 && (
				<AddTeachers
					instructors={instructors}
					handleInputChange={handleInputChange}
					setInstructors={setInstructors}
					instructorEmail={instructorEmail}
				/>
			)}
			{currentStep === 3 && (
				<StudentList studentList={studentList} setStudentList={setStudentList} />
			)}
			{currentStep === 4 && (
				<TopicGroupAndTopicsSelector setTopicsFormData={setTopicsFormData} />
			)}

			{currentStep > 1 && (
				<button
					type="button"
					onClick={() => setCurrentStep(prevStep => prevStep - 1)}
					className="w-full p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
				>
					Previous
				</button>
			)}
			{currentStep >= 1 && currentStep <= 3 && (
				<button
					type="button"
					className="w-full p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
					onClick={incrementStep}
				>
					Next
				</button>
			)}
			{currentStep === 4 && (
				<button
					type="submit"
					className="w-full p-2 mt-5 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
				>
					Create Course
				</button>
			)}
		</form>
	);
};

export default CreateCourseCustom;
