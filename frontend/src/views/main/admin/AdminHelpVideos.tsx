import React from 'react';
import VideoDropdown from '../../../components/main/dropdown/VideoDropdown'; // Import the VideoDropdown component
/**
 * AdminHelpVideos component.
 * This component is responsible for rendering a list of help videos for an admin.
 * Each video is represented by a VideoDropdown component, which includes a title and a source URL.
 *
 * @returns {JSX.Element} The rendered AdminHelpVideos component.
 */
const AdminHelpVideos: React.FC = () => {
	return (
		<div className="w-full p-5">
			<h1 className="text-2xl font-semibold mb-10 text-center">
				Admin Help Videos
			</h1>
			<div className="space-y-6 flex flex-col">
				<VideoDropdown title="How do I create a course?" src="video-url-1.mp4" />
				<VideoDropdown
					title="How do I create an attendance?"
					src="video-url-2.mp4"
				/>
				<VideoDropdown
					title="How do I access attendance data on my course?"
					src="video-url-2.mp4"
				/>
			</div>
		</div>
	);
};

export default AdminHelpVideos;
