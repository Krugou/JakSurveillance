import React from 'react';
import { useParams } from 'react-router-dom';

const TeacherCourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string; }>();

    // Replace with actual data fetching
    const course = {
        name: `Course ${id}`,
        description: 'Some description about the course.',
    };

    return (
        <div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{course.name}</div>
                <p className="text-gray-700 text-base">
                    {course.description}
                </p>
            </div>
        </div>
    );
};

export default TeacherCourseDetail;