import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import apiHooks from '../../../hooks/ApiHooks';
import GeneralLinkButton from '../buttons/GeneralLinkButton';
import DeleteModal from '../modals/DeleteModal';
interface Course {
	courseid: number;
	name: string;
	description: string;
	start_date: string;
	end_date: string;
	code: string;
	studentgroup_name: string;
	topic_names: string;
	created_at: string;
	user_count: number;
	instructor_name: string;

	// Include other properties of course here
}

interface CourseDataProps {
	courseData: object;
	updateView?: () => void;
}

const CourseData: React.FC<CourseDataProps> = ({courseData, updateView}) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

	const navigate = useNavigate();

	const handleDeleteCourse = async (courseid: number) => {
		setIsDeleteModalOpen(false);

		// Get token from local storage
		const token: string = localStorage.getItem('userToken') || '';
		try {
			await apiHooks.deleteCourse(courseid, token);

			toast.success('Course deleted');
			// Check if we are in the TeacherCourseDetail route
			if (location.pathname.includes('/teacher/courses/')) {
				// If so, navigate to TeacherCourses
				navigate('/teacher/courses');
			} else {
				// Otherwise, update the view
				if (updateView) updateView();
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	const openDeleteModal = (courseid: number) => {
		setSelectedCourseId(courseid);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
	};

	useEffect(() => {
		if (isDeleteModalOpen) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
	}, [isDeleteModalOpen]);

	const handleDelete = () => {
		if (selectedCourseId !== null) {
			handleDeleteCourse(selectedCourseId);
		}
	};

	const currentUrl = window.location.href;
	console.log(courseData);
	return (
		<>
			{Array.isArray(courseData) &&
				courseData.map((course: Course) => (
					<div
						key={course.courseid}
						className="mt-4 bg-white p-5 rounded-lg mb-4 relative"
					>
						{/* Add a relative position to the card container */}
						<Tooltip title="Modify this course">
							<EditIcon
								fontSize="large"
								className="absolute top-0 right-0 m-4 mr-16 cursor-pointer text-black bg-gray-300 rounded-full p-1 hover:text-gray-700"
								onClick={() => navigate(`/teacher/courses/${course.courseid}/modify`)}
							/>
						</Tooltip>
						<Tooltip title="Delete this course">
							<DeleteIcon
								fontSize="large"
								className="absolute top-0 right-0 m-4 cursor-pointer text-red-500 bg-gray-300 rounded-full p-1 hover:text-red-700"
								onClick={() => openDeleteModal(course.courseid)}
							/>
						</Tooltip>
						{/* Position the DeleteIcon at the top right corner */}
						<p className="font-bold text-lg">{course.name}</p>
						<p className="text-gray-700 text-base">{course.description}</p>
						<div className="mt-2">
							<div className="flex justify-between">
								<p className="text-gray-700">Start date:</p>
								<p>{new Date(course.start_date).toLocaleDateString()}</p>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-700">End date:</p>
								<p>{new Date(course.end_date).toLocaleDateString()}</p>
							</div>
							<div className="flex justify-between">
								<div className="text-gray-700">Code:</div>
								<div>{course.code}</div>
							</div>
							<div className="flex justify-between">
								<p className="text-gray-700">Student group:</p>
								<p>{course.studentgroup_name}</p>
							</div>
							<div className="flex justify-between mb-4">
								<p className="text-gray-700">Topics:</p>
								<p>{course.topic_names?.replace(/,/g, ', ')}</p>
							</div>
							{currentUrl.match(/courses\/\d+/) ? (
								<>
									<div className="w-full border-t-4 border-metropoliaMainOrange"></div>
									<h2 className="text-lg font-bold mt-4"> Additional Info</h2>
									<div className="flex justify-between">
										<p className="text-gray-700">Course Created at:</p>
										<p>{new Date(course.created_at).toLocaleDateString()}</p>
									</div>
									<div className="flex justify-between mb-4">
										<p className="text-gray-700">Amount of students</p>
										<p>{course.user_count}</p>
									</div>
									<div className="w-full border-t-4 border-metropoliaMainOrange"></div>
									<div className="mb-5 mt-4">
										<h2 className="text-gray-700 text-lg font-bold">Instructors</h2>
										<ul>
											{course.instructor_name.split(',').map((instructor, index) => (
												<li key={index}>{instructor.trim()}</li>
											))}
										</ul>
									</div>
									<GeneralLinkButton
										path={`/teacher/courses/attendances/${course.courseid}`}
										text="View attendances"
									/>
								</>
							) : (
								<div className="flex justify-between">
									<GeneralLinkButton
										path={`/teacher/courses/${course.courseid}`}
										text="View details"
									/>
									<div className="ml-2">
										<GeneralLinkButton
											path={`/teacher/courses/attendances/${course.courseid}`}
											text="View attendances"
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				))}
			<DeleteModal
				isOpen={isDeleteModalOpen}
				onDelete={handleDelete}
				onClose={closeDeleteModal}
			/>
		</>
	);
};

export default CourseData;
