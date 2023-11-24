import React, {useState} from 'react';
import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import GeneralLinkButton from '../../../../components/main/buttons/GeneralLinkButton';
const CounselorStudentsView: React.FC = () => {
	const [students, setStudents] = useState<string[]>([]); // Replace with actual data
	if (!students) {
		const students = ['Student 1', 'Student 2', 'Student 3']; // Replace with actual data
		setStudents(students);
	}

	return (
		<BackgroundContainer>
			<div className="flex flex-wrap w-3/4 bg-gray-100 p-5">
				{students.map((student, index) => (
					<div
						key={index}
						className="m-4 bg-white rounded shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
					>
						<div className="px-6 py-4">
							<div className="font-bold text-xl mb-2">{student}</div>
							<p className="text-gray-700 text-base">
								Some description about the student.
							</p>
							<div className="flex justify-between">
								<GeneralLinkButton
									path="/counselor/students/:id"
									text="Student details"
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</BackgroundContainer>
	);
};

export default CounselorStudentsView;
