import React, { useState } from 'react';
import MainViewButton from "../../../components/main/buttons/MainViewButton";

interface Course {
    id: string;
    name: string;
}

const initialCourses: Course[] = [
    { id: '1', name: 'Course 1' },
    { id: '2', name: 'Course 2' },
    // Add more courses as needed
];
// this is the admin main view
const AdminMainView: React.FC = () => {
    const [courses, setCourses] = useState(initialCourses);

    const handleNameChange = (courseId: string, newName: string) => {
        setCourses(prevCourses =>
            prevCourses.map(course =>
                course.id === courseId
                    ? { ...course, name: newName }
                    : course
            )
        );
    };

    return (
        <div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
            {courses.map(course => (
                <div key={course.id} className="px-6 py-4 border-b last:border-0">
                    <input
                        type="text"
                        value={course.name}
                        onChange={e => handleNameChange(course.id, e.target.value)}
                        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
            ))}
            <MainViewButton path='/admin/courses/' text='View Courses' />
            <MainViewButton path='/admin/users/' text='View Users' />
        </div>
    );
};

export default AdminMainView;
