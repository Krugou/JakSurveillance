import React, {useContext} from 'react';
import {UserContext} from '../../../contexts/UserContext';
import ProfileInfo from '../../../components/profiles/ProfileInfo';

const CounselorProfile: React.FC = () => {
	const {user} = useContext(UserContext);

	// Error handling
	if (!user) {
		return <div>No user data available.</div>;
	}

	return (
		<div className="flex flex-col items-center justify-center h-fit p-5 sm:p-10 bg-white rounded-lg font-sans">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">
				Counselor Profile
			</h1>
			<div className="text-md sm:text-xl mb-4">
				<ProfileInfo user={user} />
			</div>
		</div>
	);
};

export default CounselorProfile;
