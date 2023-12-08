import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {UserContext} from '../../../contexts/UserContext.tsx';
import apiHooks from '../../../hooks/ApiHooks';
import AddTeachers from './createcourse/AddTeachers';
import CourseDetails from './createcourse/CourseDetails';
import CreateCourseProgress from './createcourse/CreateCourseProgress.tsx';
import StepButtons from './createcourse/StepButtons';
import StudentList from './createcourse/StudentList';
import TopicGroupAndTopicsSelector from './createcourse/TopicsGroupAndTopics';

// this is view for teacher to create the course
const CreateCourseEasy: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);
	const [courseName, setCourseName] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [courseCode, setCourseCode] = useState('');
	const [studentGroup, setStudentGroup] = useState('');
	const [startDate, setStartDate] = useState('');
	const [selectedFile, setSelectedFile] = useState<string>('No file selected');
	const [uploadFile, setUploadFile] = useState<string>(
		'Click here to upload a file',
	);
	type Instructor = {
		email: string;
		exists?: boolean;
	};
	const [instructorEmail, setInstructorEmail] = useState('');
	const [instructors, setInstructors] = useState<Instructor[]>([{email: ''}]);

	const [studentList, setStudentList] = useState<string[]>([]);
	const [endDate, setEndDate] = useState('');
	const [topicsFormData, setTopicsFormData] = useState<any>([]);
	const [courseExists, setCourseExists] = useState(false);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setUploadFile('File Selected Click again to change');
			setSelectedFile(selectedFile.name);
		} else {
			setUploadFile('Upload a excel file');
			setSelectedFile('No file selected');
		}
	};

	const [shouldCheckDetails, setShouldCheckDetails] = useState(true);
	const changeDateToBetterFormat = (date: string) => {
		const dateObj = new Date(date);
		return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
			2,
			'0',
		)}-${String(dateObj.getDate()).padStart(2, '0')}T${String(
			dateObj.getHours(),
		).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
	};
	const handleExcelInput = async (event: React.FormEvent) => {
		event.preventDefault();

		if (file) {
			const formDataFile = new FormData();
			formDataFile.append('file', file);
			if (user) {
				formDataFile.append('instructorEmail', user.email); // get email from userContext
			}
			formDataFile.append('checkCourseDetails', shouldCheckDetails.toString());
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const response = await apiHooks.excelInput({formDataFile}, token);

			if (response) {
				toast.success('Excel file uploaded');
				setCourseName(response.courseName);
				setStudentGroup(response.studentGroup);
				setCourseCode(response.courseCode);

				setStartDate(changeDateToBetterFormat(response.startDate));
				setEndDate(changeDateToBetterFormat(response.endDate));
				setInstructorEmail(response.instructorEmail);
				setStudentList(response.studentList);

				setCurrentStep(prevStep => prevStep + 1);
			} else {
				toast.error('Excel file upload failed');
				console.error('Excel file upload failed');
			}
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
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
			console.log(
				'🚀 ~ file: CreateCourseEasy.tsx:108 ~ handleSubmit ~ response:',
				response,
			);

			if (response) {
				toast.success('Course created');
				navigate(`/teacher/courses/${response.courseId}`);
				console.log('Course created');
			} else {
				toast.error('Course creation failed');
				console.error('Course creation failed');
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	const handleSubmitWrapper = async () => {
		await handleSubmit({} as React.FormEvent); // Call the original handleSubmit function with a dummy event
	};

	const validateFields = () => {
		switch (currentStep) {
			case 2:
				return courseCode && courseName && studentGroup && startDate && endDate;

			case 3:
				return studentList && studentList.length > 0;
			case 4:
				return (
					instructors &&
					instructors.length > 0 &&
					instructors.every(instructor => instructor.email)
				);
			case 5:
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
			case 5:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 mx-auto bg-white p-4 rounded shadow-md';
			default:
				return 'w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 mx-auto bg-white p-4 rounded shadow-md';
		}
	};

	const incrementStep = () => {
		if (currentStep === 2 && courseExists) {
			alert('A course with this code already exists.');
		} else if (
			currentStep === 4 &&
			!instructors.every(instructor => instructor.exists)
		) {
			alert('One or more instructors do not exist in the database.');
		} else if (validateFields()) {
			setCurrentStep(prevStep => prevStep + 1);
		} else {
			alert('Please fill all required fields.');
		}
	};

	useEffect(() => {
		if (instructorEmail) {
			setInstructors([{email: instructorEmail, exists: true}]);
		}
	}, [instructorEmail]);
	return (
		<div className="w-full">
			{currentStep && (
				<CreateCourseProgress currentStep={currentStep} createCourseMode="easy" />
			)}

			<form onSubmit={handleSubmit} className={getFormClassName()}>
				{currentStep === 1 && (
					<fieldset>
						<legend className="text-xl mb-3">
							Insert course by Metropolia Excel file
						</legend>
						<label className="w-full mb-2 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white transition-colors duration-300 ease-in-out">
							<svg className="w-8 h-8 fill-current" viewBox="0 0 20 20">
								<path d="M10 4a2 2 0 00-2 2v4a2 2 0 104 0V6a2 2 0 00-2-2zm0 12a6 6 0 100-12 6 6 0 000 12z" />
							</svg>
							<span className="mt-2 text-base font-medium leading-normal">
								{uploadFile}
							</span>
							<input
								type="file"
								accept=".xlsx, .xls"
								className="hidden"
								onChange={handleFileChange}
							/>
							<div className="w-full p-2 mt-2 bg-gray-100 text-gray-500 rounded-lg">
								{selectedFile}
							</div>
						</label>
						<label className="flex items-center mt-2 mb-3 space-x-3">
							<input
								type="checkbox"
								checked={shouldCheckDetails}
								onChange={() => setShouldCheckDetails(prev => !prev)}
								className="form-checkbox h-5 w-5 text-blue-600"
							/>
							<span className="text-gray-900 font-medium">
								Check course details from open data
							</span>
						</label>
						<div className="flex justify-end">
							<button
								type="button"
								className="w-40 p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
								onClick={handleExcelInput}
							>
								Next
							</button>
						</div>
					</fieldset>
				)}
				{currentStep === 2 && (
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

				{currentStep === 3 && (
					<StudentList studentList={studentList} setStudentList={setStudentList} />
				)}
				{currentStep === 4 && (
					<AddTeachers
						instructors={instructors}
						setInstructors={setInstructors}
						instructorEmail={instructorEmail}
					/>
				)}
				{currentStep === 5 && (
					<TopicGroupAndTopicsSelector setTopicsFormData={setTopicsFormData} />
				)}
				{currentStep >= 2 && (
					<StepButtons
						currentStep={currentStep}
						onPrevClick={() => setCurrentStep(prevStep => prevStep - 1)}
						onNextClick={incrementStep}
						onSubmitClick={handleSubmitWrapper} // Use the wrapper function here
						extrastep={true}
					/>
				)}
			</form>
		</div>
	);
};

export default CreateCourseEasy;
