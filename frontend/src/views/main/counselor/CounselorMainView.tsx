import React from 'react';
import BackgroundContainer from '../../../components/main/background/background';
import Card from '../../../components/main/cards/Card';

const CounselorMainView: React.FC = () => {
	return (
		<BackgroundContainer>
			<h1 className="text-4xl font-bold text-gray-700 mb-5 underline">
				Counselor Dashboard
			</h1>

			<div className="flex 2xl:w-2/5 xl:w-5/6 lg:w-11/12 w-full flex-wrap p-5 justify-center gap-4">
				<Card
					path="/counselor/students"
					title="Students"
					description="Manage any student"
				/>

				<Card
					path="/counselor/helpvideos"
					title="Instructions"
					description="See instructions for all available tasks"
				/>
			</div>
		</BackgroundContainer>
	);
};

export default CounselorMainView;
