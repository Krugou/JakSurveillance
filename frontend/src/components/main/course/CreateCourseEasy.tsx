import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import apiHooks from '../../../hooks/ApiHooks';
import AddTeachers from './createcourse/AddTeachers';
import CourseDetails from './createcourse/CourseDetails';
import StudentList from './createcourse/StudentList';
import TopicGroupAndTopicsSelector from './createcourse/TopicsGroupAndTopics';
// this is view for teacher to create the course
const CreateCourseEasy: React.FC = () => {
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

			formDataFile.append('instructorEmail', 'teacher@metropolia.fi'); // get email from userContext
			formDataFile.append('checkCourseDetails', shouldCheckDetails.toString());

			const response = await apiHooks.excelInput({formDataFile});

			if (response) {
				setCourseName(response.courseName);
				setStudentGroup(response.studentGroup);
				setCourseCode(response.courseCode);

				setStartDate(changeDateToBetterFormat(response.startDate));
				setEndDate(changeDateToBetterFormat(response.endDate));
				setInstructorEmail(response.instructorEmail);
				setStudentList(response.studentList);

				setCurrentStep(prevStep => prevStep + 1);
			} else {
				console.error('File upload failed');
			}
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
				<fieldset>
					<legend className="text-xl mb-3">Insert Course Students Data File</legend>
					<label className="w-full mb-2 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white transition-colors duration-300 ease-in-out">
						<svg className="w-8 h-8 fill-current" viewBox="0 0 20 20">
							<path d="M10 4a2 2 0 00-2 2v4a2 2 0 104 0V6a2 2 0 00-2-2zm0 12a6 6 0 100-12 6 6 0 000 12z" />
						</svg>
						<span className="mt-2 text-base font-medium leading-normal">
							{uploadFile}
						</span>
						<input type="file" className="hidden" onChange={handleFileChange} />
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
							Check Course Details from Open Data
						</span>
					</label>
					<button
						type="button"
						className="w-full p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
						onClick={handleExcelInput}
					>
						Next
					</button>
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
				/>
			)}
			{currentStep === 3 && (
				<AddTeachers
					instructors={instructors}
					handleInputChange={handleInputChange}
					setInstructors={setInstructors}
					instructorEmail={instructorEmail}
				/>
			)}
			{currentStep === 4 && (
				<StudentList studentList={studentList} setStudentList={setStudentList} />
			)}
			{currentStep === 5 && (
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
			{currentStep >= 2 && currentStep <= 4 && (
				<button
					type="button"
					className="w-full p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
					onClick={() => setCurrentStep(prevStep => prevStep + 1)}
				>
					Next
				</button>
			)}
			{currentStep === 5 && (
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

export default CreateCourseEasy;
