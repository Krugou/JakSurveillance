import React from 'react';
import Card from '../../../components/main/cards/Card';
import MainViewTitle from '../../../components/main/titles/MainViewTitle';
/**
 * CounselorMainView component.
 * This component is responsible for rendering the main view for counselors.
 * It renders a MainViewTitle component and a grid of Card components.
 * Each Card component represents a different functionality available to counselors.
 *
 * @returns {JSX.Element} The rendered CounselorMainView component.
 */
const CounselorMainView: React.FC = () => {
	return (
		<>
			<MainViewTitle role={'Counselor'} />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-fit mr-auto ml-auto p-5 gap-4">
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
				<Card
					path="/counselor/courses/stats"
					title="Attendance statistics"
					description="See attendance statistics for all courses"
				/>
			</div>
		</>
	);
};

export default CounselorMainView;
