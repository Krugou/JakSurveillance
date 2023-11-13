import React from 'react';
import background from '../../../assets/images/tausta2.png';
import Card from "../../../components/main/cards/Card";

const MainView: React.FC = () => {
    return (
        <div
            className="flex flex-col bg-gray-100 p-10 items-center"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <h1 className="text-4xl font-bold mb-8">Teacher Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Card path="/teacher/attendance" title="View Attendance" description="View your current attendance for a lesson" />

                <Card path="/teacher/students" title="Manage Students" description="Manage your students details" />

                <Card path="/teacher/courses/createcourse" title="Create Course" description="Create a course for your students" />

                <Card path="/teacher/courses/" title="View Courses" description="View all of your courses" />

                <Card path="/teacher/attendance/createattendance" title="Create new attendance" description="Create a new attendance for your lesson" />

                <Card path="/teacher/helpvideos" title="Instructions" description="See instructions for all your tasks" />
            </div>
        </div>
    );
};

export default MainView;
