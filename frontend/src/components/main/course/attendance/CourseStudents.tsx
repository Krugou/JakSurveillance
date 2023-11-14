import React, {useEffect, useState} from 'react';

interface Props {
	coursestudents: {
		first_name: string;
		last_name: string;
		userid: number;
	}[];
}

const CourseStudents: React.FC<Props> = ({coursestudents}) => {
	const [bounceGroup, setBounceGroup] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setBounceGroup(prevGroup => (prevGroup + 1) % 2);
		}, 2500); // Change every 2 seconds

		return () => clearInterval(interval);
	}, []);
	return (
		<div
			className={`flex flex-row ${
				coursestudents.length === 0 ? 'justify-center' : 'justify-end'
			} bg-white p-4 rounded-lg shadow-md w-full mt-4 overflow-hidden`}
		>
			{coursestudents.length === 0 ? (
				<p className="">All students saved</p>
			) : (
				<div className="whitespace-nowrap marquee">
					{coursestudents.map((student, index) => {
						const formattedName = `${student.first_name} ${student.last_name.charAt(
							0,
						)}.`;
						const isBouncing = index % 2 === bounceGroup;
						return (
							<p
								key={student.userid}
								className={`inline-block p-2 m-2 bg-black text-white sm:text-sm font-semibold ${
									isBouncing ? 'animate-bounce' : ''
								}`}
							>
								{formattedName}
							</p>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default CourseStudents;
