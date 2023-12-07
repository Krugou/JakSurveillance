import React from 'react';
import VideoDropdown from '../../../components/main/dropdown/VideoDropdown';
const CounselorHelpVideos: React.FC = () => {
	return (
		<div className="w-full p-5">
			<h1 className="text-2xl font-bold w-fit p-3 bg-white ml-auto mr-auto rounded-lg mb-10 text-center">
				Counselor Help Videos
			</h1>
			<div className="space-y-6 flex flex-col">
				<VideoDropdown
					title="How do I modify a student's topics on a course?"
					src="video-url-1.mp4"
				/>
				<VideoDropdown
					title="How do I access attendance data on a specific course?"
					src="video-url-2.mp4"
				/>
			</div>
		</div>
	);
};

export default CounselorHelpVideos;
