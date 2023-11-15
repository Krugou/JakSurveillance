import React from 'react';

import CreateCourse from '../../../../components/main/course/CreateCourse';
import BackgroundContainer from "../../../../components/main/background/background";
const TeacherCreateCourse: React.FC = () => {
	return (
        <BackgroundContainer>
			<div className="w-full pt-10 pb-10">
			<h1 className="text-4xl text-center font-bold mb-8">Create Course</h1>
			<CreateCourse />
			</div>
		</BackgroundContainer>
	);
};

export default TeacherCreateCourse;
