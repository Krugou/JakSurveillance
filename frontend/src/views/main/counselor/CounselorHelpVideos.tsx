import React from 'react';
import VideoDropdown from '../../../components/main/dropdown/VideoDropdown';

/**
 * CounselorHelpVideos component.
 * This component is responsible for displaying help videos for counselors.
 * It renders a list of VideoDropdown components, each of which represents a help video.
 *
 * @returns {JSX.Element} The rendered CounselorHelpVideos component.
 */
const CounselorHelpVideos: React.FC = () => {
	return (
		<div className="w-full p-5">
			<h1 className="text-2xl font-bold w-fit p-3 bg-white ml-auto mr-auto rounded-lg mb-10 text-center">
				Counselor Help Videos
			</h1>
			<div className="space-y-6 flex flex-col">
				<VideoDropdown
					/**
					 * The title of the video.
					 *
					 * @type {string}
					 */
					title="How do I modify a student's topics on a course?"
					/**
					 * The source URL of the video.
					 *
					 * @type {string}
					 */
					src="video-url-1.mp4"
				/>
				<VideoDropdown
					/**
					 * The title of the video.
					 *
					 * @type {string}
					 */
					title="How do I access attendance data on a specific course?"
					/**
					 * The source URL of the video.
					 *
					 * @type {string}
					 */
					src="video-url-2.mp4"
				/>
			</div>
		</div>
	);
};

export default CounselorHelpVideos;
