import React from 'react';
import MainViewButton from '../../../components/main/buttons/MainViewButton';
const MainView: React.FC = () => {

    return (
        <div className="flex flex-col items-center justify-center h-1/2">
            <h1 className="text-4xl font-bold mb-8">Student Dashboard</h1>
            <MainViewButton path='/student/attendance' text='View Courses' />
            <MainViewButton path='/student/profile' text='View Profile' />
            <MainViewButton path='/student/courses' text='View Attendance' />
        </div>
    );
};

export default MainView;
