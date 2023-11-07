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

const AdminCourseModify: React.FC = () => {
    const [teachers, setTeachers] = useState<Person[]>(initialTeachers);
    const [students, setStudents] = useState<Person[]>(initialStudents);
    const [teacherName, setTeacherName] = useState<string>('');
    const [studentName, setStudentName] = useState<string>('');

    const removeTeacher = (id: number) => {
        const updatedTeachers = teachers.filter((teacher) => teacher.id !== id);
        setTeachers(updatedTeachers);
    };

    const removeStudent = (id: number) => {
        const updatedStudents = students.filter((student) => student.id !== id);
        setStudents(updatedStudents);
    };

    const addTeacher = () => {
        if (teacherName.trim() !== '') {
            setTeachers([...teachers, { id: Date.now(), name: teacherName }]);
            setTeacherName('');
        }
    };

    const addStudent = () => {
        if (studentName.trim() !== '') {
            setStudents([...students, { id: Date.now(), name: studentName }]);
            setStudentName('');
        }
    };

    return (
        <div className="bg-gray-100">
            <div className="w-1/3 m-auto">
                <div className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Course Name"
                        className="m-5 p-2 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <input
                        type="text"
                        placeholder="Course code"
                        className="m-5 p-2 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="p-4 flex justify-center gap-10">
                    <div className="mb-4 rounded bg-white p-3">
                        <h2 className="text-xl font-bold mb-2">Teachers</h2>
                        <input
                            type="text"
                            placeholder="Enter teacher name"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                        />
                        <button onClick={addTeacher}>Add Teacher</button>
                        <ul>
                            {teachers.map((teacher) => (
                                <li key={teacher.id} className="flex gap-5 items-center p-2">
                                    {teacher.name}
                                    <button
                                        className="text-red-500"
                                        onClick={() => removeTeacher(teacher.id)}
                                    >
                                        X
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-4 rounded bg-white p-3">
                        <h2 className="text-xl font-bold mb-2">Students</h2>
                        <input
                            type="text"
                            placeholder="Enter student name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                        />
                        <button onClick={addStudent}>Add Student</button>
                        <ul>
                            {students.map((student) => (
                                <li key={student.id} className="flex gap-5 items-center p-2">
                                    {student.name}
                                    <button
                                        className="text-red-500"
                                        onClick={() => removeStudent(student.id)}
                                    >
                                        X
                                    </button>
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

export default AdminCourseModify;
