import React, {useState} from 'react';

import BackgroundContainer from '../../../../components/main/background/background';
import CreateCourseCustom from '../../../../components/main/course/CreateCourseCustom';
import CreateCourseEasy from '../../../../components/main/course/CreateCourseEasy';
const TeacherCreateCourse: React.FC = () => {
	const [courseType, setCourseType] = useState<'easy' | 'custom' | null>(null);
	return (
		<BackgroundContainer>
			<div className="w-full pt-10 pb-10">
				<h1 className="text-4xl text-center font-bold mb-8">Create Course</h1>
				{!courseType && (
					<div className="flex justify-center space-x-4">
						<button
							className="bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
							onClick={() => setCourseType('easy')}
						>
							Easy
						</button>
						<button
							className="bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
							onClick={() => setCourseType('custom')}
						>
							Custom
						</button>
					</div>
				)}
				{courseType === 'easy' && <CreateCourseEasy />}
				{courseType === 'custom' && <CreateCourseCustom />}
			</div>
		</BackgroundContainer>
	);
};

export default TeacherCreateCourse;
