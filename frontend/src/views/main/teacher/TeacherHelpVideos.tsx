import React from 'react';
import VideoDropdown from "../../../components/main/dropdown/VideoDropdown";// Import the VideoDropdown component

const TeacherHelpVideos: React.FC = () => {
    return (
        <div className="bg-gray-100 p-5">
            <h1 className="text-2xl font-semibold mb-10 text-center">Teacher Help Videos</h1>
            <div className="space-y-6 flex flex-col">
                <VideoDropdown title="How do I create a course?" src="video-url-1.mp4" />
                <VideoDropdown title="How do I create an attendance?" src="video-url-2.mp4" />
            </div>
        </div>
    );
};

export default TeacherHelpVideos;
