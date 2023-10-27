import React from 'react';
import { useParams } from 'react-router-dom';

const TeacherStudentDetail: React.FC = () => {
    let { id } = useParams<{ id: string; }>();

    // Replace with actual data fetching
    const student = {
        name: `Student ${id}`,
        course: 'Course Name',
    };

    return (
        <div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{student.name}</div>
                <p className="text-gray-700 text-base">
                    Enrolled in: {student.course}
                </p>
            </div>
        </div>
    );
};

export default TeacherStudentDetail;