import React from 'react';
// import MainViewButton from '../../../components/main/buttons/MainViewButton';
// import TeacherStudentDetail from '../teacher/Students/TeacherStudentDetail';

const AdminUsers: React.FC = () => {
	// const {id} = useParams<{id: string}>();

	// Replace with actual data fetching
	const Teacher = {
		name: `Teacher ${id}`,
		course: 'Course Name',
	};

	return (
		<div className="bg-gray-100 p-5">
			{/* <TeacherStudentDetail></TeacherStudentDetail> */}
			<div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
				<div className="px-6 py-4">
					<div className="font-bold text-xl mb-2">{Teacher.name}</div>
					<p className="text-gray-700 text-base">Enrolled in: {Teacher.course}</p>
					{/* <MainViewButton
						path={`/adming/users/${id}/modify`}
						text="Modify details"
					/> */}
				</div>
			</div>
		</div>
	);
};

export default AdminUsers;
