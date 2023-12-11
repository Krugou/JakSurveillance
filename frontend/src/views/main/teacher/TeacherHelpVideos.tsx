import React from 'react';
import VideoDropdown from '../../../components/main/dropdown/VideoDropdown'; // Import the VideoDropdown component
import StudentDetail from '../../../assets/videos/StudentDetail.mp4';
import TeacherAttendance from '../../../assets/videos/TeacherAttendance.mp4';
import RoleChange from '../../../assets/videos/RoleChange.mp4';
import CreateCourse from '../../../assets/videos/CreateCourse.mp4';
import CreateLecture from '../../../assets/videos/CreateLecture.mp4';
import CourseAttendance from '../../../assets/videos/CourseAttendance.mp4';
import CourseDetail from '../../../assets/videos/CourseDetails.mp4';
import StudentLecture from '../../../assets/videos/StudentLecture.mp4';


/**
 * TeacherHelpVideos component.
 * This component is responsible for rendering the help videos for teachers.
 * It uses the VideoDropdown component to display each video with a title.
 */
const TeacherHelpVideos: React.FC = () => {
	return (
		<div className="w-full p-5">
			<h1 className="text-2xl font-bold p-3 bg-white w-fit m-auto rounded-lg mb-10 text-center">
				Teacher Help Videos
			</h1>
			<div className="space-y-6 flex flex-col">
				<VideoDropdown title="How do I create a course?" src={CreateCourse} />
				<VideoDropdown
					title="How do I create an attendance?"
					src={CreateLecture}
				/>
				<VideoDropdown
					title="How do I access attendance data on my course?"
					src={CourseAttendance}
				/>
				<VideoDropdown
					title="How do I access my students details?"
					src={StudentDetail}
				/>
				<VideoDropdown
					title="How do I access and modify my course details?"
					src={CourseDetail}
				/>
				<VideoDropdown
					title="How do I access my students attendance?"
					src={TeacherAttendance}
				/>
				<VideoDropdown
					title="How do I change my role?"
					src={RoleChange}
				/>
				<VideoDropdown
					title="How can my students join to my lecture?"
					src={StudentLecture}
				/>
			</div>
		</div>
	);
};

export default TeacherHelpVideos;
