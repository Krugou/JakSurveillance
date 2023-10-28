import React from 'react';
import MainViewButton from '../../../components/main/buttons/MainViewButton';
// this is Mainview for teacher
const MainView: React.FC = () => {

    return (
        <div className="flex flex-col items-center justify-center h-1/2">
            <h1 className="text-4xl font-bold mb-8">Teacher Dashboard</h1>
            <MainViewButton path='/teacher/attendance' text='View Attendance' />
            <MainViewButton path='/teacher/students' text='Manage Students' />
            <MainViewButton path='/teacher/courses/createcourse' text='Create Course' />
        </div>
    );
};

export default MainView;