import React from 'react';

interface AttendeesProps {
	arrayOfStudents: string[];
}

const Attendees: React.FC<AttendeesProps> = ({ arrayOfStudents }) => {
	
	const arrayOfStudentstest = ['test1', 'test2'];
	const students =
		arrayOfStudents.length > 0 ? arrayOfStudents : arrayOfStudentstest;
	return (
		<div className="text-md sm:text-xl mb-4">
			<h2 className="text-lg font-bold mb-2">List of Attendees:</h2>
			<p>Number of Attendees: {students.length}</p>
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
