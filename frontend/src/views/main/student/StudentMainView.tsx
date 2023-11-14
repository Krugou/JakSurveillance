import React from 'react';
import Card from "../../../components/main/cards/Card";
import BackgroundContainer from "../../../components/main/background/background";
const MainView: React.FC = () => {

    return (
        <BackgroundContainer>
            <h1 className="text-4xl font-bold mb-8">Student Dashboard</h1>
        <div className="flex flex- w-full items-center justify-center h-1/2">
            <Card path='/student/attendance' title="View attendance" description="View your own attendance" />
            <Card path='/student/profile' title='View Profile' description="View your own profile"/>
            <Card path='/student/courses' title='View Courses' description="View your own courses"/>
        </div>
        </BackgroundContainer>
    );
};

export default MainView;
