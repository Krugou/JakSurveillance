import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import apihooks from '../../../../hooks/ApiHooks';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import CourseDetails from '../../../../components/main/course/createcourse/CourseDetails';
import AddTeachers from '../../../../components/main/course/createcourse/AddTeachers';
import TopicGroupAndTopicsSelector from '../../../../components/main/course/createcourse/TopicsGroupAndTopics';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
	const [courseCode, setCourseCode] = useState<string>('');
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

	const [topicsFormData, setTopicsFormData] = useState<any>([]);

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
		if (courseData) {
			setCourseCode(courseData.code);
			setCourseName(courseData.name);
			setStudentGroup(courseData.studentgroup_name);
			const startDate = new Date(courseData.start_date || '')
				.toISOString()
				.slice(0, 16);
			setStartDate(startDate);
			const endDate = new Date(courseData.end_date || '')
				.toISOString()
				.slice(0, 16);
			setEndDate(endDate);
			if (courseData.instructor_name) {
				setInstructors(
					courseData.instructor_name.split(',').map(email => ({email})),
				);
			}
		}
	}, [courseData]);
	if (isLoading) {
		return <div>Loading...</div>;
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		console.log(topicsFormData, 'topicsFormData');
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
					modify={true}
				/>
				<Accordion className="mt-4 mb-4">
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						Modify Topics
					</AccordionSummary>
					<AccordionDetails>
						<TopicGroupAndTopicsSelector setTopicsFormData={setTopicsFormData} />
					</AccordionDetails>
				</Accordion>

				<Accordion className="mt-4 mb-4">
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel2a-content"
						id="panel2a-header"
					>
						Modify Teachers
					</AccordionSummary>
					<AccordionDetails>
						<AddTeachers
							instructors={instructors}
							setInstructors={setInstructors}
							instructorEmail={instructorEmail}
							handleInputChange={handleInputChange}
							modify={true}
						/>
					</AccordionDetails>
				</Accordion>

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
