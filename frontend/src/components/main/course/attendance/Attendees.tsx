import React from 'react';

interface AttendeesProps {
	arrayOfStudents: {
		first_name: string;
		last_name: string;
		userid: number;
		studentnumber: string;
	}[];
	socket: any;
	lectureid: string;
}

const Attendees: React.FC<AttendeesProps> = ({
	arrayOfStudents,
	socket,
	lectureid,
}) => {
	return (
		<div className="text-md max-w-full w-full sm:max-w-[15em] max-h-[15em] h-[15em] overflow-y-scroll m-2 p-2  sm:text-xl mb-4  border-2 border-metropoliaTrendGreen">
			<div className="flex flex-wrap justify-center">
				{arrayOfStudents.map((student, index) => {
					const formattedName = `${student.first_name} ${student.last_name.charAt(
						0,
					)}.`;
					return (
						<p
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
							title={`${student.first_name} ${student.last_name}`}
							onClick={() => {
								if (socket) {
									const studentName = `${student.first_name} ${student.last_name}`;
									const confirmMessage = `Are you sure you want to add ${studentName} as not attended?`;
									if (window.confirm(confirmMessage)) {
										socket.emit('manualStudentRemove', student.studentnumber, lectureid);
									}
								}
							}}
						>
							{formattedName}
						</p>
					);
				})}
			</div>
		</div>
	);
};

export default Attendees;
