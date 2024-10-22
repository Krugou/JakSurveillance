import React from 'react';
import Card from '../../../components/main/cards/Card';
import FeedbackCard from '../../../components/main/cards/FeedbackCard';
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

      <div className='grid grid-cols-1 gap-4 p-5 ml-auto mr-auto sm:grid-cols-2 lg:grid-cols-3 w-fit'>
        <Card
          path='/teacher/mainview'
          title='Teacher Dashboard'
          description='Access and manage your teaching modules'
        />
        <Card
          path='/counselor/mainview'
          title='Counselor Dashboard'
          description='Access and manage student counseling services'
        />
        <Card
          path='/admin/courses/'
          title='Course Management'
          description='Create, update, and delete courses'
        />
        <Card
          path='/admin/users/'
          title='User Management'
          description='Manage user accounts and permissions'
        />
        <Card
          path='/admin/newuser/'
          title='User Registration'
          description='Register a new user'
        />
        <Card
          path='/admin/lectures/'
          title='Lecture Management'
          description='View and manage all lectures'
        />
        <Card
          path='/admin/settings/'
          title='Server Configuration'
          description='Manage server settings and configurations'
        />
        <Card
          path='/admin/dashboard/'
          title='Server Dashboard'
          description='View server statistics and usage'
        />
        <FeedbackCard role='admin' />
      </div>
    </>
  );
};

export default AdminMainView;
