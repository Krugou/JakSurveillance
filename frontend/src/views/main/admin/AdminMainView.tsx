import React from 'react';
import Card from '../../../components/main/cards/Card';
import MainViewTitle from '../../../components/main/titles/MainViewTitle';
/**
 * AdminMainView component.
 * This component is responsible for rendering the main view for an admin.
 * It displays a grid of cards, each of which represents a different admin task.
 * Each card includes a path to the task, a title, and a description.
 *
 * @returns {JSX.Element} The rendered AdminMainView component.
 */
const AdminMainView: React.FC = () => {
	return (
		<>
			<MainViewTitle role={'Admin'} />

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-fit mr-auto ml-auto p-5 gap-4">
				<Card
					path="/teacher/mainview"
					title="Teacher view"
					description="Teacher view"
				/>
				<Card
					path="/counselor/mainview"
					title="Counselor view"
					description="Counselor view"
				/>
				<Card
					path="/admin/courses/"
					title="Courses"
					description="Manage any course"
				/>
				<Card path="/admin/users/" title="Users" description="Manage any user" />
				<Card
					path="/admin/newuser/"
					title="New Student User"
					description="Add new student user"
				/>
				<Card
					path="/admin/lectures/"
					title="Lectures"
					description="View all lectures to check if they are active or not"
				/>
				<Card
					path="/admin/settings/"
					title="Settings"
					description="Manage your settings"
				/>

				<Card
					path="/admin/stats/"
					title="Statistics"
					description="See statistics"
				/>
				<Card
					path="/admin/feedback/"
					title="Feedback"
					description="See all feedback"
				/>
			</div>
		</>
	);
};

export default AdminMainView;
