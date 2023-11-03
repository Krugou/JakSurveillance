import React from 'react';
import {useParams} from 'react-router-dom';
import MainViewButton from '../../../../components/main/buttons/MainViewButton';

// this is view for teacher to see the single student details
const TeacherStudentDetail: React.FC = () => {
	const {id} = useParams<{id: string}>();

	// Replace with actual data fetching
	const student = {
		name: `Student ${id}`,
		course: 'Course Name',
	};

	return (
		<div className="bg-gray-100 p-5">
			<div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
				<div className="px-6 py-4">
					<div className="font-bold text-xl mb-2">{student.name}</div>
					<p className="text-gray-700 text-base">
						Enrolled in: {student.course}
					</p>
					<MainViewButton
						path={`/teacher/students/${id}/modify`}
						text="Modify details"
					/>
				</div>
			</div>
		</div>
	);
};

export default TeacherStudentDetail;
