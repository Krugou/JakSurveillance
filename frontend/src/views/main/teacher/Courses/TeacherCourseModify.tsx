import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import apihooks from '../../../../hooks/ApiHooks';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import CourseDetails from '../../../../components/main/course/createcourse/CourseDetails';
import AddTeachers from '../../../../components/main/course/createcourse/AddTeachers';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import {toast} from 'react-toastify';
// this is view for teacher to modify the single course details

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
	const [courseTopics, setCourseTopics] = useState<string[]>([]);
	const [modifiedTopics, setModifiedTopics] = useState<string[]>([]);
	const [initialCourseTopics, setInitialCourseTopics] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [instructors, setInstructors] = useState<{email: string}[]>([]);
	const [instructorEmail, setInstructorEmail] = useState('');

	const {id} = useParams<{id: string}>();

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
				const courseData = await apihooks.getCourseDetailByCourseId(id, token);
				console.log(courseData, 'COUSRDATA');
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

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const modifiedData = {
			courseName: courseName,
			courseCode: courseCode,
			studentGroup: studentGroup,
			startDate: startDate,
			endDate: endDate,
			topic_names: modifiedTopics,
			instructors: instructors.map(instructor => instructor.email),
		};
		console.log(modifiedData);
	};

	const handleInputChange = (index, event) => {
		const values = [...instructors];
		values[index].email = event.target.value;
		setInstructors(values);
	};

	const handleTopicChange = topic => {
		toast.info('Topic changed');
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

				<button
					className="mt-4 mb-4 w-full bg-white text-left shadow rounded-md p-4 focus:outline-none focus:shadow-outline"
					onClick={() => setOpen(true)}
				>
					Modify Topics
				</button>
				<Modal open={open} onClose={() => setOpen(false)}>
					<div className="p-4 bg-white rounded shadow-lg max-w-lg mx-auto mt-10">
						<h2 className="text-2xl mb-4">Edit Topics for {courseName}</h2>

						<TextField
							value={newTopic}
							onChange={e => setNewTopic(e.target.value)}
							label="New Topic"
							variant="outlined"
							className="mb-6"
							fullWidth
							required
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => {
												if (newTopic.trim() !== '') {
													setCourseTopics(prevTopics => [...prevTopics, newTopic]);
													setNewTopic('');
												}
											}}
										>
											<AddIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						{courseTopics.map((topic, index) => (
							<div key={index} className="flex items-center mb-2 mt-3">
								<Checkbox
									checked={modifiedTopics.includes(topic)}
									onChange={() => handleTopicChange(topic)}
								/>
								<p className="flex-grow">{topic}</p>
								<IconButton onClick={() => handleDeleteTopic(topic)}>
									<DeleteIcon />
								</IconButton>
							</div>
						))}
						<p className="text-sm text-gray-500 mb-4">
							Only checked topics will be included in the course, deleting them from
							the view will also exclude them.
						</p>
						<div className="flex justify-between mt-6">
							<Button
								variant="outlined"
								color="secondary"
								onClick={resetData}
								className="mr-10"
							>
								RESET
							</Button>
						</div>
					</div>
				</Modal>
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
		</BackgroundContainer>
	);
};

export default TeacherCourseModify;
