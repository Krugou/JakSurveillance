import React from 'react';

import Card from '../../../components/main/cards/Card';
import MainViewTitle from '../../../components/main/titles/MainViewTitle';

const AdminMainView: React.FC = () => {
	return (
		<>
			<MainViewTitle role={'Admin'} />

			<div className="flex 2xl:w-2/5 xl:w-5/6 lg:w-11/12 w-full flex-wrap p-5 justify-center gap-4">
				<Card
					path="/admin/courses/"
					title="Courses"
					description="Manage any course"
				/>
				<Card path="/admin/users/" title="Users" description="Manage any user" />

				<Card
					path="/admin/helpvideos"
					title="Instructions"
					description="See instructions for all available tasks"
				/>
				<Card
					path="/admin/profile"
					title="Profile"
					description="Manage your profile"
				/>
				<Card
					path="/admin/settings/"
					title="Settings"
					description="Manage your settings"
				/>
			</div>
		</>
	);
};

export default AdminMainView;
