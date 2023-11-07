import React from 'react';

interface AttendeesProps {
	arrayOfStudents: string[];
}
const arrayOfStudentstest = [
	'test1',
	'test2',
	'test3',
	'test4',
	'test5',
	'test6',
];

const Attendees: React.FC<AttendeesProps> = ({arrayOfStudents}) => {
	return (
		<div className="text-md sm:text-xl mb-4">
			<h2 className="text-lg font-bold mb-2">List of Attendees:</h2>
			<p>Number of Attendees: {arrayOfStudents.length + 1}</p>
			<div className="flex flex-wrap justify-center">
				{arrayOfStudents.map((student, index) => (
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

				{arrayOfStudentstest.map((student, index) => (
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
