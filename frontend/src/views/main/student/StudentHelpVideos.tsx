import React from 'react';
import VideoDropdown from '../../../components/main/dropdown/VideoDropdown'; // Import the VideoDropdown component
import StudentLecture from '../../../assets/videos/StudentLecture.mp4';
import StudentAttendance from '../../../assets/videos/StudentCourseAndAttendance.mp4';
/**
 * StudentHelpVideos component.
 * This component is responsible for rendering the help videos for students.
 * It uses the VideoDropdown component to display each video with a title.
 */
const StudentHelpVideos: React.FC = () => {
    return (
        <div className="w-full p-5">
            <h1 className="text-2xl font-bold p-3 bg-white w-fit m-auto rounded-lg mb-10 text-center">
                Student Help Videos
            </h1>
            <div className="space-y-6 flex flex-col">
                <VideoDropdown title="How do I access my course and attendance details" src={StudentAttendance} />
                <VideoDropdown
                    title="How do I join a lecture?"
                    src={StudentLecture}
                />
            </div>
        </div>
    );
};

export default StudentHelpVideos;
