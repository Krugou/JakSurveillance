import React from 'react';
import Card from '../../../components/main/cards/Card';
import MainViewTitle from '../../../components/main/titles/MainViewTitle';

const MainView: React.FC = () => {
	return (
		<div className="w-full">
			<MainViewTitle role={'Student'} />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-fit m-auto p-5 justify-center items-center gap-4">
				<Card
					path="/student/qr"
					title="Attendance Qr Scanner"
					description="Scan QR to mark attendance"
				/>
				<Card
					path="/student/profile"
					title="Your Profile"
					description="View your own profile"
				/>
				<Card
					path="/student/courses"
					title="Your Courses"
					description="View your own courses"
				/>
			</div>
		</div>
	);
};

export default MainView;
