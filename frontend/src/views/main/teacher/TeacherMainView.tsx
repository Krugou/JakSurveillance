import React from 'react';
import Card from "../../../components/main/cards/Card";
import BackgroundContainer from "../../../components/main/background/background";

const MainView: React.FC = () => {
    return (
        <BackgroundContainer>
            <h1 className="text-4xl font-bold text-gray-700 mb-5 underline">Teacher Dashboard</h1>

            <div className="flex 2xl:w-2/5 xl:w-5/6 lg:w-11/12 w-full flex-wrap p-5 justify-center gap-4">
                <Card path="/teacher/attendance" title="View Attendance" description="View your course attendance" />

                <Card path="/teacher/students" title="Manage Students" description="Manage your students details" />

                <Card path="/teacher/courses/create" title="Create Course" description="Create a course for your students" />

                <Card path="/teacher/courses/" title="View Courses" description="View all of your courses" />

                <Card path="/teacher/attendance/createclass" title="Create new class" description="Open attendance gathering" />

                <Card path="/teacher/helpvideos" title="Instructions" description="See instructions for all your tasks" />
            </div>
        </BackgroundContainer>
    );
};

export default MainView;
