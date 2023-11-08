import React, { useState } from 'react';
import MainViewButton from "../../../../components/main/buttons/MainViewButton";

const AdminCourses: React.FC = () => {
    const courseOptions = ['Course 1', 'Course 2', 'Course 3']; // Replace with your course options
    const [selectedCourse, setSelectedCourse] = useState(courseOptions[0]);

    const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourse(event.target.value);
    };

    return (
        <div className="bg-gray-100 p-5">
        <div className="container m-auto w-1/3">
            <h1 className="text-2xl font-semibold mb-4">School Courses</h1>
            <div className="mb-4">
                <label htmlFor="courseSelect">Select a Course:</label>
                <select
                    id="courseSelect"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    className="border p-2 rounded-md w-full"
                >
                    {courseOptions.map((course, index) => (
                        <option key={index} value={course}>
                            {course}
                        </option>
                    ))}
                </select>
            </div>
            <div className="p-4 bg-white rounded-md">
                <h2 className="text-xl font-semibold mb-2">Selected Course</h2>
                <div className="p-2 border flex justify-between items-center rounded-md">
                    {selectedCourse}
                    <div>
                        <MainViewButton path='/admin/courses/:id' text='See details' />
                        <MainViewButton path='/admin/courses/:id/modify' text='Modify details' />
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AdminCourses;
