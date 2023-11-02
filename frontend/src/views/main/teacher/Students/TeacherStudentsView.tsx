import React from 'react';
import MainViewButton from "../../../../components/main/buttons/MainViewButton";
// this is view for teacher to see the list of students in single course
const TeacherStudentsView: React.FC = () => {
    const students = ['Student 1', 'Student 2', 'Student 3']; // Replace with actual data

    return (
        <div className="flex flex-wrap bg-gray-100 p-5 justify-center">
            {students.map((student, index) => (
                <div key={index} className="m-4 bg-white rounded shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{student}</div>
                        <p className="text-gray-700 text-base">
                            Some description about the student.
                        </p>
                        <MainViewButton path='/teacher/students/:id' text='Student details' />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeacherStudentsView;
