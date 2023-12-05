import React, {useContext} from 'react';
import {UserContext} from '../../../contexts/UserContext';
import ProfileInfo from '../../../components/profiles/ProfileInfo';
/*
const getAttendanceColorClass = (attendance: number): string => {
	if (attendance >= 90) {
		return 'bg-metropoliaTrendGreen';
	} else if (attendance >= 50) {
		return 'bg-metropoliaMainOrange';
	} else {
		return 'bg-metropoliaSupportRed';
	}
};
*/
import {useNavigate} from 'react-router-dom'; // Import useNavigate

const StudentProfile: React.FC = () => {
	const {user} = useContext(UserContext);
	const navigate = useNavigate(); // Initialize useNavigate

	// Error handling
	if (!user) {
		return <div>No user data available.</div>;
	}

	return (
		<div className="flex flex-col items-center justify-center h-fit p-10 bg-white rounded-lg font-sans">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Student Profile</h1>
			<div className="text-md sm:text-xl mb-4">
				<ProfileInfo user={user} />
				<p className="mb-5 mt-5">
					<strong>Student Group:</strong>{' '}
					<span className="profileStat">{user.group_name}</span>
				</p>
			</div>
			<button
				className="px-4 py-2 mt-4 bg-metropoliaMainOrange transition text-white rounded hover:bg-metropoliaSecondaryOrange"
				onClick={() => navigate('/student/courses')} // Navigate to /student/courses when the button is clicked
			>
				My Courses
			</button>
		</div>
	);
};

export default StudentProfile;
