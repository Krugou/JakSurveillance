import React from 'react';
import NewStudentUser from '../../../../components/main/NewStudentUser';

const CounselorLateEnrollment: React.FC = () => {
	return (
		<div>
			<NewStudentUser mode="counselor" />
		</div>
	);
};

export default CounselorLateEnrollment;
