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

	const getFormClassName = () => {
		switch (currentStep) {
			case 1:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/5 mx-auto bg-white p-4 rounded shadow-md';
			case 2:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 mx-auto bg-white p-4 rounded shadow-md';
			case 3:
				return 'w-full 2xl:w-2/3 mx-auto bg-white p-4 rounded shadow-md';
			case 4:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 mx-auto bg-white p-4 rounded shadow-md';
			default:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 mx-auto bg-white p-4 rounded shadow-md';
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
			setInstructors([{email: instructorEmail}]);
		}
	}, [instructorEmail, user]);

	return (
		<BackgroundContainer>
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
				<StepButtons
					currentStep={currentStep}
					onPrevClick={() => setCurrentStep(prevStep => prevStep - 1)}
					onNextClick={incrementStep}
					onSubmitClick={handleSubmitWrapper} // Call handleSubmitWrapper without arguments
					extrastep={false}
				/>
			</form>
		</BackgroundContainer>
	);
};

export default CreateCourseCustom;
