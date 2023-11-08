import React, { useState } from 'react';

interface Person {
    id: number;
    name: string;
}

const initialTeachers: Person[] = [
    { id: 1, name: 'Teacher 1' },
    { id: 2, name: 'Teacher 2' },
    { id: 3, name: 'Teacher 3' },
];

const initialStudents: Person[] = [
    { id: 4, name: 'Student 1' },
    { id: 5, name: 'Student 2' },
    { id: 6, name: 'Student 3' },
];

const AdminCourseDetail: React.FC = () => {
    const [teachers] = useState<Person[]>(initialTeachers);
    const [students] = useState<Person[]>(initialStudents);

    return (
        <div className="bg-gray-100">
            <div className="w-1/3 m-auto">
                <div className="flex flex-col">
                   <h2 className="profileStat mb-4 mt-4 w-fit">
                       Course Name
                   </h2>
                    <h2 className="profileStat w-fit">
                        Course Code
                    </h2>
                </div>
                <div className="p-4 flex gap-10">
                    <div className="mb-4 rounded bg-white p-3">
                        <h2 className="text-xl font-bold mb-2">Teachers</h2>
                        <ul>
                            {teachers.map((teacher) => (
                                <li key={teacher.id} className="flex gap-5 items-center p-2">
                                    {teacher.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-4 rounded bg-white p-3">
                        <h2 className="text-xl font-bold mb-2">Students</h2>
                        <ul>
                            {students.map((student) => (
                                <li key={student.id} className="flex gap-5 items-center p-2">
                                    {student.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button className="bg-metropoliaMainOrange mb-4 text-white py-2 px-4 rounded">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default AdminCourseDetail;
