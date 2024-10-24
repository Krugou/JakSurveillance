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
    <div className='flex flex-col items-center justify-center p-5 font-sans bg-white rounded-lg h-fit sm:p-10'>
      <h1 className='mt-5 mb-8 text-xl font-bold sm:text-4xl'>Admin Profile</h1>
      <div className='mb-4 text-md sm:text-xl'>
        <ProfileInfo user={user} />
      </div>
    </div>
  );
};

export default AdminProfile;
