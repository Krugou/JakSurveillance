import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import AddTeachers from '../../../../components/main/course/createcourse/AddTeachers';
import CourseDetails from '../../../../components/main/course/createcourse/CourseDetails';
import EditTopicsModal from '../../../../components/main/modals/EditTopicsModal';
import apiHooks from '../../../../hooks/ApiHooks';

interface CourseDetail {
	courseid: string;
	name: string;
	start_date: string;
	end_date: string;
	code: string;
	studentgroup_name: string;
	created_at: string;
	topic_names: string;
	user_count: number;
	instructor_name: string;
}

const AdminCourseModify: React.FC = () => {
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
	const [courseTopics, setCourseTopics] = useState<string[]>([]);
	const [modifiedTopics, setModifiedTopics] = useState<string[]>([]);
	const [initialCourseTopics, setInitialCourseTopics] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [instructors, setInstructors] = useState<{email: string}[]>([]);
	const [instructorEmail, setInstructorEmail] = useState('');
	const navigate = useNavigate();
	const {id} = useParams<{id: string}>();
	const [courseExists, setCourseExists] = useState(false);

	const [isLoading, setIsLoading] = useState(true);
	const [newTopic, setNewTopic] = useState('');
	useEffect(() => {
		const fetchCourses = async () => {
			if (id) {
				setIsLoading(true);
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const courseData = await apiHooks.getCourseDetailByCourseId(id, token);
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
			// Parse the topics from the courseData into an array of strings
			const topics = courseData.topic_names.split(',');
			// Set the courseTopics state
			setCourseTopics(topics);
			setModifiedTopics(topics);
			setInitialCourseTopics(topics);
		}
	}, [courseData]);
	if (isLoading) {
		return <div>Loading...</div>;
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const modifiedData = {
			courseName: courseName,
			courseCode: courseCode,
			studentGroup: studentGroup,
			start_date: startDate,
			end_date: endDate,
			topic_names: modifiedTopics,
			instructors: instructors.map(instructor => instructor.email),
		};
		const token: string | null = localStorage.getItem('userToken');

		try {
			const result = await apiHooks.modifyCourse(token, id, modifiedData);
			console.log(result);
			toast.success('Course modified successfully');
			navigate('/admin/courses/' + id);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('An unknown error occurred');
			}
		}
		console.log(modifiedData);
	};

	const handleTopicChange = topic => {
		toast.info('Topics changed');
		setModifiedTopics(prevTopics =>
			prevTopics.includes(topic)
				? prevTopics.filter(t => t !== topic)
				: [...prevTopics, topic],
		);
	};

	const handleDeleteTopic = topic => {
		setCourseTopics(prevTopics => prevTopics.filter(t => t !== topic));
		setModifiedTopics(prevTopics => prevTopics.filter(t => t !== topic));
	};
	const resetData = () => {
		setCourseTopics(initialCourseTopics);
		setModifiedTopics(initialCourseTopics);
	};

	return (
		<div className="w-full">
			<h2 className="text-gray-800 text-center font-semibold mb-6 text-md sm:text-2xl">
				Modify Course
			</h2>

			<form
				onSubmit={e => {
					e.preventDefault();
				}}
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
					courseExists={courseExists}
					setCourseExists={setCourseExists}
				/>

				<Accordion className="mt-4 mb-4" onClick={e => e.stopPropagation()}>
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
							modify={true}
						/>
					</AccordionDetails>
				</Accordion>

				<button
					className="mt-4 mb-4 w-full bg-white text-left shadow rounded-md p-4 focus:outline-none focus:shadow-outline"
					onClick={() => setOpen(true)}
				>
					Modify Topics
				</button>
				<EditTopicsModal
					open={open}
					setOpen={setOpen}
					courseName={courseName}
					newTopic={newTopic}
					setNewTopic={setNewTopic}
					courseTopics={courseTopics}
					setCourseTopics={setCourseTopics}
					modifiedTopics={modifiedTopics}
					handleTopicChange={handleTopicChange}
					handleDeleteTopic={handleDeleteTopic}
					resetData={resetData}
				/>
				<div className="flex w-full justify-center">
					<button
						className=" bg-metropoliaTrendGreen w-1/2  hover:bg-green-600 text-white font-bold py-2 rounded-xl px-4 focus:outline-none focus:shadow-outline"
						type="button"
						onClick={handleSubmit}
					>
						Finish
					</button>
				</div>
			</form>
		</div>
	);
};
export default AdminCourseModify;
