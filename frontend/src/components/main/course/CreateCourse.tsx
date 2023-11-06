import React, {useEffect, useState} from 'react';
import apiHooks from '../../../hooks/ApiHooks';
import TopicGroupAndTopicsSelector from './createcourse/TopicsGroupAndTopics';
// this is view for teacher to create the course
const CreateCourse: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [courseName, setCourseName] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [courseCode, setCourseCode] = useState('');
	const [studentGroup, setStudentGroup] = useState('');
	const [startDate, setStartDate] = useState('');

	const [endDate, setEndDate] = useState('');
	const [topicsFormData, setTopicsFormData] = useState<any>([]);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFile(event.target.files ? event.target.files[0] : null);
	};

	const [shouldCheckDetails, setShouldCheckDetails] = useState(true);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// If the checkbox is checked, verify the course details
		if (shouldCheckDetails) {
			console.log('Checking course details...');
			const response = await apiHooks.checkIfCourseExists({
				codes: courseCode,
			});

			console.log('Received response:', response);

			// If the course details do not exist, show an error message and return
			if (!response.exists) {
				console.error('Course details do not exist');
				return;
			}

			console.log('Course details exist');
		}
		console.log(
			'🚀 ~ file: CreateCourse.tsx:42 ~ handleSubmit ~ topicsFormData.group:',
			topicsFormData,
		);
		// If both checks pass, create the course
		if (file) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('courseName', courseName);
			formData.append('courseCode', courseCode);
			formData.append('studentGroup', studentGroup);
			// for  dev testing purposes
			// formData.append('courseName', 'Mediapalvelut-projekti');
			// formData.append('courseCode', 'TX00CG61-3009');
			// formData.append('studentGroup', 'tvt21-m');
			formData.append('topicGroup', topicsFormData.topicgroup);
			formData.append('topics', topicsFormData.topics);
			formData.append('instructorEmail', 'teacher@metropolia.fi'); // get email from userContext
			formData.append('checkCourseDetails', shouldCheckDetails.toString());
			formData.append('startDate', startDate);
			formData.append('endDate', endDate);
			// Use the createCourse function here
			const response = await apiHooks.createCourse({formData});

			if (response.ok) {
				console.log('Course created successfully');
				console.log('File uploaded successfully');
			} else {
				console.error('Course creation failed');
				console.error('File upload failed');
			}
		}
	};
	useEffect(() => {
		console.log(topicsFormData);
	}, [topicsFormData]);

	return (
		<div className="flex flex-col p-5 items-center justify-center min-h-1/2 bg-gray-100">
			<h1 className="text-4xl font-bold mb-8">Create Course</h1>
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md mx-auto bg-white p-6 rounded shadow-md"
			>
				{currentStep === 1 && (
					<fieldset>
						<legend>Course Details</legend>
						<input
							type="text"
							placeholder="Course Name"
							value={courseName}
							onChange={e => setCourseName(e.target.value)}
							className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
							title="Enter the course name here example: Mediapalvelut-projekti"
						/>

						<input
							type="text"
							placeholder="Course Code"
							value={courseCode}
							onChange={e => setCourseCode(e.target.value)}
							className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
							title="Enter the course code here example: TX00CG61-3009"
						/>
						<input
							type="text"
							placeholder="Student Group"
							value={studentGroup}
							onChange={e => setStudentGroup(e.target.value)}
							className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
							title="Enter the student group here example: tvt21-m"
						/>
						{!shouldCheckDetails && (
							<>
								<input
									type="datetime-local"
									value={startDate}
									onChange={e => setStartDate(e.target.value)}
									className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
									title="Enter the start date and time for the course"
								/>

								<input
									type="datetime-local"
									value={endDate}
									onChange={e => setEndDate(e.target.value)}
									className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
									title="Enter the end date and time for the course"
								/>
							</>
						)}
					</fieldset>
				)}

				{currentStep === 2 && (
					<TopicGroupAndTopicsSelector
						topicsFormData={topicsFormData}
						setTopicsFormData={setTopicsFormData}
					/>
				)}

				{currentStep === 3 && (
					<fieldset>
						<legend>File Upload</legend>
						<label className="w-full mb-2 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
							<svg
								className="w-8 h-8"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M10 4a2 2 0 00-2 2v4a2 2 0 104 0V6a2 2 0 00-2-2zm0 12a6 6 0 100-12 6 6 0 000 12z" />
							</svg>
							<span className="mt-2 text-base leading-normal">
								Select a file
							</span>
							<input
								type="file"
								className="hidden"
								onChange={handleFileChange}
							/>
						</label>
					</fieldset>
				)}

				<label className="flex items-center space-x-3">
					<input
						type="checkbox"
						checked={shouldCheckDetails}
						onChange={() => setShouldCheckDetails(prev => !prev)}
						className="form-checkbox h-5 w-5 text-blue-600"
					/>
					<span className="text-gray-900 font-medium">
						Check Course Details
					</span>
				</label>
				{currentStep > 1 && (
					<button
						type="button"
						onClick={() => setCurrentStep(prevStep => prevStep - 1)}
						className="w-full p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
					>
						Previous
					</button>
				)}
				{currentStep < 3 && (
					<button
						type="button"
						className="w-full p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
						onClick={() => setCurrentStep(prevStep => prevStep + 1)}
					>
						Next
					</button>
				)}
				{currentStep === 3 && (
					<button
						type="submit"
						className="w-full p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
					>
						Create Course
					</button>
				)}
			</form>
		</div>
	);
};

export default CreateCourse;
