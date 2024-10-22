import React from 'react';
import StudentAttendance from '../../../assets/videos/StudentCourseAndAttendance.mp4';
import StudentLecture from '../../../assets/videos/StudentLecture.mp4';
import VideoDropdown from '../../../components/main/dropdown/VideoDropdown'; // Import the VideoDropdown component
/**
 * StudentHelpVideos component.
 * This component is responsible for rendering the help videos for students.
 * It uses the VideoDropdown component to display each video with a title.
 */
const StudentHelpVideos: React.FC = () => {
  return (
    <div className='w-full p-5'>
      <h1 className='p-3 m-auto mb-10 text-2xl font-bold text-center bg-white rounded-lg w-fit'>
        Student Help Videos
      </h1>
      <div className='flex flex-col space-y-6'>
        <VideoDropdown
          title='How do I access my course and attendance details'
          src={StudentAttendance}
        />
        <VideoDropdown title='How do I join a lecture?' src={StudentLecture} />
      </div>
    </div>
  );
};

export default StudentHelpVideos;
