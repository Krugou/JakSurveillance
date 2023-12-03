import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ReportIcon from '@mui/icons-material/Report';
import Tooltip from '@mui/material/Tooltip';
import {UserContext} from '../../../contexts/UserContext';
import EditTopicsModal from '../modals/EditTopicsModal';
import {toast} from 'react-toastify';
import apiHooks from '../../../hooks/ApiHooks';
interface Course {
	courseid: number;
	course_name: string;
	startDate: string;
	endDate: string;
	code: string;
	student_group: number | null;
	topic_names: string;
	selected_topics: string;
	instructor_name: string;
	usercourseid: number;
}

interface StudentCourseGridProps {
	courses: Course[];
	showEndedCourses: boolean;
	updateView?: () => void;
}

const StudentCourseGrid: React.FC<StudentCourseGridProps> = ({
	courses,
	showEndedCourses,
	updateView,
}) => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate();
	const [courseName, setCourseName] = useState('');
	const [courseTopics, setCourseTopics] = useState<string[]>([]);
	const [modifiedTopics, setModifiedTopics] = useState<string[]>([]);
	const [initialCourseTopics, setInitialCourseTopics] = useState<string[]>([]);
	const [usercourseid, setUsercourseid] = useState<number>(0);
	const [open, setOpen] = useState(false);
	const [newTopic, setNewTopic] = useState('');

	// Open and close the modal
	const handleOpen = (
		thisCourseName,
		thisCourseTopics,
		thisusercourseid,
		allTopicsArray,
	) => {
		setOpen(true);
		// Set the course name and topics
		setCourseName(thisCourseName);
		// Set the initial topics to be used in the reset function (student's topics)
		setInitialCourseTopics(thisCourseTopics);
		// Set the course topics to be used in the modal (all topics in the course)
		setCourseTopics(allTopicsArray);
		// Set the modified topics
		setModifiedTopics(thisCourseTopics);
		// Set the usercourseid to be used in the save function
		setUsercourseid(thisusercourseid);
	};

	// Handle the topic change
	const handleTopicChange = topic => {
		toast.info('Topics changed');
		// If the topic is already in the modified topics array, remove it
		setModifiedTopics(prevTopics =>
			prevTopics.includes(topic)
				? prevTopics.filter(t => t !== topic)
				: [...prevTopics, topic],
		);
	};
	const handleDeleteTopic = topic => {
		// If the topic is already in the modified topics array, remove it
		setCourseTopics(prevTopics => prevTopics.filter(t => t !== topic));
		setModifiedTopics(prevTopics => prevTopics.filter(t => t !== topic));
	};

	// Reset the data
	const resetData = () => {
		// Reset the topics to the initial topics
		setCourseTopics(initialCourseTopics);
		setModifiedTopics(initialCourseTopics);
	};

	const handleSave = async usercourseid => {
		console.log(usercourseid, 'USERCOURSEID');
		console.log(modifiedTopics, 'MODIFIED TOPICS');
		const token = localStorage.getItem('userToken');
		if (!token) {
			throw new Error('No token available');
		}
		try {
			const response = await apiHooks.updateUserCourseTopics(
				token,
				usercourseid,
				modifiedTopics,
			);
			console.log(response);
			toast.success('Topics saved');

			// Rerender the view after saving the topics
			updateView && updateView();
		} catch (error) {
			toast.error('Error saving topics');
		}

		setOpen(false);
	};

	let additionalClasses = '';

	if (courses.length === 2) {
		additionalClasses = 'grid-cols-1 md:grid-cols-2';

	} else if (courses.length >= 3) {
		additionalClasses = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
	}
	else if (courses.length === 1) {
		additionalClasses = 'grid-cols-1';
	}

	return (
		<div className={`grid ${additionalClasses} h-fit sm:max-h-[20em] overflow-hidden sm:overflow-y-scroll gap-4 mt-4`}>
			{courses
				.filter(course => {
					const endDate = new Date(course.endDate);
					const isCourseEnded =
						endDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
					return !isCourseEnded || showEndedCourses;
				})
				.map((course, index) => {
					// Format the dates
					const startDate = new Date(course.startDate).toLocaleDateString();
					const endDate = new Date(course.endDate);
					const endDateString = endDate.toLocaleDateString();
					const studentsTopicsArray = course.selected_topics
						? course.selected_topics.split(',')
						: course.topic_names
						? course.topic_names.split(',')
						: [];
					// Format the topics
					const topics = course.selected_topics
						? // If the course has selected topics by the student, use those
						  course.selected_topics.replace(/,/g, ', ') // Replace commas with commas and spaces
						: // Otherwise use the default topics
						course.topic_names
						? course.topic_names.replace(/,/g, ', ')
						: 'You have no assigned topics on this course';

					const allTopicsArray = course?.topic_names.split(',');
					// Check if the course has ended
					const isCourseEnded =
						endDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

					return (
						<Tooltip
							placement="top"
							title={isCourseEnded ? 'Course has ended' : ''}
							key={index}
						>
							<div
								className={`p-6 bg-white shadow-md rounded-lg relative ${
									isCourseEnded ? 'opacity-50' : ''
								}`}
							>
								{isCourseEnded && (
									<div className="absolute top-2 right-2">
										<ReportIcon style={{color: 'red'}} />
									</div>
								)}
								<h2 className="text-2xl underline font-bold mb-2 text-black">
									{course.course_name + ' ' + course.code}
								</h2>
								<p className="mb-1">
									<strong>Assigned Topics:</strong> {topics}
								</p>
								{user?.role !== 'student' && (
									<p className="mb-1">
										<strong>All Topics on course:</strong>{' '}
										{course?.topic_names.replace(/,/g, ', ')}
									</p>
								)}
								<p className="mb-1">
									<strong>Start Date:</strong> {startDate}
								</p>
								<p className="mb-1">
									<strong>End Date:</strong> {endDateString}
								</p>
								<p className="mb-1">
									<strong>Course Instructors:</strong> {course.instructor_name}
								</p>
								<button
									className={`mt-4 font-bold py-2 px-4 rounded ${
										isCourseEnded
											? 'bg-metropoliaSupportRed hover:bg-red-900'
											: 'bg-metropoliaTrendGreen hover:bg-green-700'
									} text-white`}
									onClick={() =>
										user?.role === 'student'
											? navigate(`/student/courses/attendance/${course.usercourseid}`)
											: navigate(
													`/${user?.role}/students/attendance/${course.usercourseid}`,
											  )
									}
								>
									Attendance
								</button>
								{user?.role === 'counselor' && (
									<>
										<button
											className={`mt-4 ml-4 font-bold py-2 px-4 rounded ${
												isCourseEnded
													? 'bg-metropoliaSupportRed hover:bg-red-900'
													: 'bg-metropoliaTrendGreen hover:bg-green-700'
											} text-white`}
											onClick={() =>
												handleOpen(
													course.course_name,
													studentsTopicsArray,
													course.usercourseid,
													allTopicsArray,
												)
											}
										>
											Edit Topics for Student
										</button>
										<EditTopicsModal
											open={open}
											setOpen={setOpen}
											courseName={courseName} // replace 'courseName' with the actual course name
											newTopic={newTopic}
											setNewTopic={setNewTopic}
											courseTopics={courseTopics}
											setCourseTopics={setCourseTopics}
											modifiedTopics={modifiedTopics}
											handleTopicChange={handleTopicChange}
											handleDeleteTopic={handleDeleteTopic}
											resetData={resetData}
											counselor={true}
											usercourseid={usercourseid}
											handleSave={handleSave}
										/>
									</>
								)}
							</div>
						</Tooltip>
					);
				})}
		</div>
	);
};

export default StudentCourseGrid;
