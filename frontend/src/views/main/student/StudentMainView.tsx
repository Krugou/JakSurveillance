import React from 'react';
import BackgroundContainer from '../../../components/main/background/BackgroundContainer';
import Card from '../../../components/main/cards/Card';
import MainViewTitle from '../../../components/main/titles/MainViewTitle';
const MainView: React.FC = () => {
	return (
		<BackgroundContainer>
			<MainViewTitle role={'Student'} />
			<div className="flex flex-wrap w-full items-center justify-center h-1/2">
				<Card
					path="/student/attendance"
					title="View attendance"
					description="View your own attendance"
				/>
				<Card
					path="/student/profile"
					title="View Profile"
					description="View your own profile"
				/>
				<Card
					path="/student/courses"
					title="View Courses"
					description="View your own courses"
				/>
				<Card path='/student/qr' title='Attendance Qr Scanner' description='Scan QR to mark attendance' />
			</div>
		</BackgroundContainer>
	);
};

export default MainView;
