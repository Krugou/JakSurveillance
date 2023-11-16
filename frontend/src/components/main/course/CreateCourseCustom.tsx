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
	const addInstructor = () => {
		setInstructors([...instructors, {email: ''}]);
	};

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

	const deleteInstructor = index => {
		const newInstructors = [...instructors];
		newInstructors.splice(index, 1);
		setInstructors(newInstructors);
	};
	const deleteStudent = index => {
		const newStudentList = [...studentList];
		newStudentList.splice(index, 1);
		setStudentList(newStudentList);
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
					deleteInstructor={deleteInstructor}
					addInstructor={addInstructor}
					instructorEmail={instructorEmail}
				/>
			)}
			{currentStep === 3 && (
				<StudentList
					studentList={studentList}
					setStudentList={setStudentList}
					deleteStudent={deleteStudent}
				/>
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
					onClick={() => setCurrentStep(prevStep => prevStep + 1)}
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