import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import apihooks from '../../../../hooks/ApiHooks';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
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
	const {id} = useParams<{id: string}>();
	const [courseData, setCourseData] = useState<CourseDetail | null>(null);

	// Replace with actual data fetching

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
			}
		};

		fetchCourses();
	}, [id]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		// Handle the form submission here
	};

	console.log(courseData);
	return (
		<BackgroundContainer>
			<h2 className="text-gray-800 font-semibold mb-6 text-md sm:text-2xl">
				Modify Course
			</h2>
			<form
				onSubmit={handleSubmit}
				className="bg-white md:w-2/4 xl:w-1/4 w-full sm:w-2/3 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 mx-auto"
			>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm sm:text-lg font-bold mb-2"
						htmlFor="courseName"
					>
						Course Name
					</label>
					<input
						className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="courseName"
						type="text"
						value={courseData?.name}
					/>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm sm:text-lg font-bold mb-2"
						htmlFor="courseCode"
					>
						Course Code
					</label>
					<input
						className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="courseCode"
						type="text"
						value={courseData?.code}
					/>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm sm:text-lg font-bold mb-2"
						htmlFor="startDate"
					>
						Start Date
					</label>
					<input
						className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="startDate"
						type="text"
						value={courseData?.start_date}
					/>
				</div>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm sm:text-lg font-bold mb-2"
						htmlFor="endDate"
					>
						End Date
					</label>
					<input
						className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="endDate"
						type="date"
						value={courseData?.end_date}
					/>
				</div>
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
