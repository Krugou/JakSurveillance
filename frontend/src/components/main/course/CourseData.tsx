import React, {useState, useEffect} from 'react';
import MainViewButton from '../buttons/MainViewButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import DeleteModal from '../modals/DeleteModal';
import apiHooks from '../../../hooks/ApiHooks';
import {toast} from 'react-toastify';
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
}

const CourseData: React.FC<CourseDataProps> = ({courseData}) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

	const handleDeleteCourse = async (courseid: number) => {
		setIsDeleteModalOpen(false);

		// Get token from local storage
		const token: string | null = localStorage.getItem('userToken');

		try {
			const response = await apiHooks.deleteCourse(courseid, token);
			console.log(response);
		} catch (error) {
			toast.error(error.message);
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
						<Tooltip title="Delete this course">
							<DeleteIcon
								className="absolute top-0 right-0 m-4 cursor-pointer text-red-500 hover:text-red-700"
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
							<div className="flex justify-between mb-2">
								<p className="text-gray-700">Topics:</p>
								<p>{course.topic_names?.replace(/,/g, ', ')}</p>
							</div>

							{currentUrl.match(/courses\/\d+/) ? (
								<>
									<h2 className="text-xl mt-4"> Additional Info</h2>
									<div className="flex justify-between">
										<p className="text-gray-700">Course Created at:</p>
										<p>{new Date(course.created_at).toLocaleDateString()}</p>
									</div>
									<div className="flex justify-between">
										<p className="text-gray-700">Amount of students</p>
										<p>{course.user_count}</p>
									</div>
									<div className="flex justify-between mb-2">
										<p className="text-gray-700">Instructors: </p>
										<p>{course.instructor_name}</p>
									</div>
									<MainViewButton
										path={`/teacher/courses/${course.courseid}/modify`}
										text="Modify details"
									/>
								</>
							) : (
								<MainViewButton
									path={`/teacher/courses/${course.courseid}`}
									text="View details"
								/>
							)}
						</div>
					</div>
				))}
			<DeleteModal
				isOpen={isDeleteModalOpen}
				onDelete={() => handleDeleteCourse(selectedCourseId)}
				onClose={closeDeleteModal}
			/>
		</>
	);
};

export default CourseData;
