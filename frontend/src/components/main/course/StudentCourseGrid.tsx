import React from 'react';
import {useNavigate} from 'react-router-dom';
import ReportIcon from '@mui/icons-material/Report';
import Tooltip from '@mui/material/Tooltip';
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
}

const StudentCourseGrid: React.FC<StudentCourseGridProps> = ({
	courses,
	showEndedCourses,
}) => {
	const navigate = useNavigate();
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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

					// Format the topics
					const topics = course.selected_topics
						? // If the course has selected topics by the student, use those
						  course.selected_topics.replace(/,/g, ', ')
						: // Otherwise use the default topics
						course.topic_names
						? course.topic_names.replace(/,/g, ', ')
						: 'You have no assigned topics on this course';

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
									<strong>Your Topics:</strong> {topics}
								</p>
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
										navigate(`/student/courses/attendance/${course.usercourseid}`)
									}
								>
									Attendance
								</button>
							</div>
						</Tooltip>
					);
				})}
		</div>
	);
};

export default StudentCourseGrid;
