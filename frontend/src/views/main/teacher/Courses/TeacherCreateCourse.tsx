import React from 'react';

import CreateCourse from '../../../../components/main/course/CreateCourse';
import BackgroundContainer from "../../../../components/main/background/background";
const TeacherCreateCourse: React.FC = () => {
	return (
        <BackgroundContainer>
		<div className="flex flex-col p-5 items-center justify-center min-h-1/2 bg-gray-100">
			<h1 className="text-4xl font-bold mb-8">Create Course</h1>
			<CreateCourse />
		</div>
		</BackgroundContainer>
	);
};

export default TeacherCreateCourse;
