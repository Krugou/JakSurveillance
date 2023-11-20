import React, {useState, useEffect} from 'react';
import MainViewButton from '../buttons/MainViewButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
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

	const handleDeleteCourse = () => {
		console.log('Delete course');
		setIsDeleteModalOpen(false);
	};

	const openDeleteModal = () => {
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
								onClick={openDeleteModal}
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
			{isDeleteModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="fixed inset-0 bg-black opacity-50"></div>
					<div className="bg-white w-10/12 lg:w-1/3 sm:w-1/2 p-6 rounded-lg shadow-lg z-10">
						<h3 className="text-xl leading-6 font-medium text-gray-900">
							Confirmation
						</h3>
						<div className="mt-2">
							<p className="text-base text-gray-500">
								Are you sure you want to delete this course?
							</p>
						</div>
						<div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
							<button
								onClick={handleDeleteCourse}
								className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-500 text-base font-medium text-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
							>
								CANCEL
							</button>
							<button
								onClick={closeDeleteModal}
								className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
							>
								DELETE
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CourseData;
