import React, {useContext} from 'react';
import ProfileInfo from '../../../components/profiles/ProfileInfo';
import {UserContext} from '../../../contexts/UserContext';
/**
 * AdminProfile component.
 * This component is responsible for rendering the profile information of an admin.
 * It fetches the user data from the UserContext.
 * If no user data is available, it renders an error message.
 *
 * @returns {JSX.Element} The rendered AdminProfile component.
 */
const AdminProfile: React.FC = () => {
	/**
	 * User context.
	 *
	 * @type {React.Context<UserContext>}
	 */
	const {user} = useContext(UserContext);

	// Error handling
	if (!user) {
		return <div>No user data available.</div>;
	}
	/**
	 * Render the component.
	 *
	 * @returns {JSX.Element} The rendered JSX element.
	 */
	return (
		<div className="flex flex-col items-center justify-center h-fit p-5 sm:p-10 rounded-lg bg-white font-sans">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Admin Profile</h1>
			<div className="text-md sm:text-xl mb-4">
				<ProfileInfo user={user} />
			</div>
		</div>
	);
};

export default AdminProfile;
