import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import DeleteModal from '../../../../components/main/modals/DeleteModal';
import apiHooks from '../../../../hooks/ApiHooks';

// Define your course detail structure here
interface CourseDetail {
	courseid: number;
	name: string;
	description: string;
	start_date: Date;
	end_date: Date;
	code: string;
	studentgroup_name: string;
	created_at: string;
	topic_names: string[];
	user_count: number;
	instructor_name: string;
}
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
const AdminCourseDetail: React.FC = () => {
	const {id} = useParams<{id: string}>();
	const [courseData, setCourseData] = useState<CourseDetail | null>(null);
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

			navigate('/admin/courses');
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

	useEffect(() => {
		const fetchCourse = async () => {
			if (id) {
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				const courseData = await apiHooks.getCourseDetailByCourseId(id, token);

				setCourseData(courseData);
			}
		};

		fetchCourse();
	}, [id]);

	return (
		<>
			<h2 className="font-bold text-lg">CourseId {id}</h2>
			<div className="m-4 bg-white rounded-lg shadow-lg mx-auto w-full sm:w-3/4 md:w-2/4 lg:w-2/5 2xl:w-1/5">
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
										onClick={() => navigate(`/admin/courses/${course.courseid}/modify`)}
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
									<div className="flex justify-between mb-2">
										<p className="text-gray-700">Topics:</p>
										<p>{course.topic_names?.replace(/,/g, ', ')}</p>
									</div>
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
								</div>
							</div>
						))}
					<DeleteModal
						isOpen={isDeleteModalOpen}
						onDelete={handleDelete}
						onClose={closeDeleteModal}
					/>
				</>
			</div>
		</>
	);
};

export default AdminCourseDetail;
