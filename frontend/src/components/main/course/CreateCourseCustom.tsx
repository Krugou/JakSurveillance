import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {UserContext} from '../../../contexts/UserContext.tsx';
import apiHooks from '../../../hooks/ApiHooks';
import BackgroundContainer from '../background/BackgroundContainer';
import AddTeachers from './createcourse/AddTeachers';
import CourseDetails from './createcourse/CourseDetails';
import StepButtons from './createcourse/StepButtons';
import StudentList from './createcourse/StudentList';
import TopicGroupAndTopicsSelector from './createcourse/TopicsGroupAndTopics';
// this is view for teacher to create the course
const CreateCourseCustom: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);
	const [courseName, setCourseName] = useState('');
	type Instructor = {
		email: string;
		exists?: boolean;
	};
	const [courseCode, setCourseCode] = useState('');
	const [studentGroup, setStudentGroup] = useState('');
	const [startDate, setStartDate] = useState('');

	const [instructorEmail, setInstructorEmail] = useState('');
	const [instructors, setInstructors] = useState<Instructor[]>([{email: ''}]);

	const [studentList, setStudentList] = useState<string[]>([]);
	const [endDate, setEndDate] = useState('');
	const [topicsFormData, setTopicsFormData] = useState<any>([]);
	const [courseExists, setCourseExists] = useState(false);

	const validateFields = () => {
		switch (currentStep) {
			case 1:
				return courseCode && courseName && studentGroup && startDate && endDate;
			case 2:
				return studentList && studentList.length > 0;
			case 3:
				return (
					instructors &&
					instructors.length > 0 &&
					instructors.every(instructor => instructor.email)
				);

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

	const getFormClassName = () => {
		switch (currentStep) {
			case 1:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/5 mx-auto bg-white p-4 rounded shadow-md';
			case 2:
				return 'w-full 2xl:w-2/3 mx-auto bg-white p-4 rounded shadow-md';
			case 3:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 mx-auto bg-white p-4 rounded shadow-md';
			case 4:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 mx-auto bg-white p-4 rounded shadow-md';
			default:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 mx-auto bg-white p-4 rounded shadow-md';
		}
	};

	const incrementStep = () => {
		if (courseExists) {
			alert('A course with this code already exists.');
		} else if (!instructors.every(instructor => instructor.exists)) {
			alert('One or more instructors do not exist in the database.');
		} else if (validateFields()) {
			setCurrentStep(prevStep => prevStep + 1);
		} else {
			alert('Please fill all required fields.');
		}
	};
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		let email = '';
		if (user) {
			email = user.email;
		}
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
			instructorEmail: email, // get email from userContext
		};
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		const response = await apiHooks.createCourse(courseData, token);

		if (response) {
			toast.success('Course created');
			navigate(`/teacher/courses/${response.courseId}`);
			console.log('Course created');
		} else {
			toast.error('Course creation failed');
			console.error('Course creation failed');
		}
	};

	const handleSubmitWrapper = async () => {
		await handleSubmit({} as React.FormEvent);
	};

	useEffect(() => {
		let email = '';
		if (user) {
			email = user.email;
		}
		setInstructorEmail(email); // get email from userContext
		if (instructorEmail) {
			setInstructors([{email: instructorEmail, exists: true}]);
		}
	}, [instructorEmail, user]);

	return (
		<div className="w-full m-auto">
			<form onSubmit={event => handleSubmit(event)} className={getFormClassName()}>
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
						courseExists={courseExists}
						setCourseExists={setCourseExists}
					/>
				)}

				{currentStep === 2 && (
					<StudentList studentList={studentList} setStudentList={setStudentList} />
				)}
				{currentStep === 3 && (
					<AddTeachers
						instructors={instructors}
						setInstructors={setInstructors}
						instructorEmail={instructorEmail}
					/>
				)}
				{currentStep === 4 && (
					<TopicGroupAndTopicsSelector setTopicsFormData={setTopicsFormData} />
				)}
				<StepButtons
					currentStep={currentStep}
					onPrevClick={() => setCurrentStep(prevStep => prevStep - 1)}
					onNextClick={incrementStep}
					onSubmitClick={handleSubmitWrapper}
					extrastep={false}
				/>
			</form>
		</div>
	);
};

export default CreateCourseCustom;
