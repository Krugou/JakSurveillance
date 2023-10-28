import React, { useState } from 'react';

interface Course {
    id: string;
    name: string;
    parts: string[];
}

const initialCourses: Course[] = [
    { id: '1', name: 'Course 1', parts: ['Part 1', 'Part 2', 'Part 3'] },
    { id: '2', name: 'Course 2', parts: ['Part 1', 'Part 2', 'Part 3'] },
    // Add more courses as needed
];
// this is Main view for Student Counselor
const CounselorMainView: React.FC = () => {
    const [courses, setCourses] = useState(initialCourses);

    const handlePartChange = (courseId: string, part: string, isChecked: boolean) => {
        setCourses(prevCourses =>
            prevCourses.map(course =>
                course.id === courseId
                    ? { ...course, parts: isChecked ? [...course.parts, part] : course.parts.filter(p => p !== part) }
                    : course
            )
        );
    };

    return (
        <div className="m-4 bg-white rounded shadow-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
            {courses.map(course => (
                <div key={course.id} className="px-6 py-4 border-b last:border-0">
                    <h2 className="font-bold text-xl mb-2">{course.name}</h2>
                    {['Part 1', 'Part 2', 'Part 3'].map(part => (
                        <div key={part} className="mb-2">
                            <input
                                type="checkbox"
                                id={`${course.id}-${part}`}
                                checked={course.parts.includes(part)}
                                onChange={e => handlePartChange(course.id, part, e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor={`${course.id}-${part}`}>{part}</label>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CounselorMainView;