import React from 'react';

interface AttendeesProps {
	arrayOfStudents: string[];
}

const Attendees: React.FC<AttendeesProps> = ({arrayOfStudents}) => {
	const arrayOfStudentstest = ['Aaa B.', 'bbb C.', 'ccc D.'];
	const students =
		arrayOfStudents.length > 0 ? arrayOfStudents : arrayOfStudentstest;
	return (
		<div className="text-md max-w-full sm:max-w-[15em] max-h-[25em] overflow-y-scroll sm:text-xl mb-4">
			<div className="flex flex-wrap justify-center">
				{students.map((student, index) => (
					<div
						key={index}
						className={`flex items-center justify-center m-2 p-2 rounded shadow-md ${
							index % 4 === 0
								? 'bg-metropoliaSupportRed text-white'
								: index % 4 === 1
								? 'bg-metropoliaSupportYellow'
								: index % 4 === 2
								? 'bg-metropoliaTrendLightBlue text-white'
								: 'bg-metropoliaMainOrange text-white'
						}`}
					>
						{student}
					</div>
				))}
			</div>
		</div>
	);
};

export default Attendees;
