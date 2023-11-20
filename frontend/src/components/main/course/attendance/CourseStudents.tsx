import React, {useEffect, useRef, useState} from 'react';

interface Props {
	coursestudents: {
		first_name: string;
		last_name: string;
		userid: number;
	}[];
}

const CourseStudents: React.FC<Props> = ({coursestudents}) => {
	const [bounceGroup, setBounceGroup] = useState(0);
	const lastItemRef = useRef(null);
	const firstItemRef = useRef(null);
	useEffect(() => {
		const interval = setInterval(() => {
			setBounceGroup(prevGroup => (prevGroup + 1) % 2);
		}, 2500); // Change every 2 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			className={`flex flex-row ${
				coursestudents.length > 10 ? 'justify-start' : 'justify-center'
			} bg-white p-4 rounded-lg shadow-md w-full mt-4 overflow-hidden`}
		>
			{coursestudents.length === 0 ? (
				<p className="">All students saved</p>
			) : (
				// <div className={`whitespace-nowrap animate-slide-${slideDirection}`}>
				<div
					className={`whitespace-nowrap ${
						coursestudents.length > 8 ? 'animate-backandforth' : ''
					}`}
				>
					{coursestudents.map((student, index) => {
						const formattedName = `${student.first_name} ${student.last_name.charAt(
							0,
						)}.`;
						const isBouncing = index % 2 === bounceGroup;
						const isFirst = index === 0;
						const isLast = index === coursestudents.length - 1;
						const bgColorClass = isFirst
							? 'bg-metropoliaSupportRed'
							: isLast
							? 'bg-metropoliaSupportBlue'
							: index % 2 === 0
							? 'bg-metropoliaMainOrange'
							: 'bg-metropoliaMainGrey';
						const shapeClass = isFirst
							? 'rounded-l-lg rounded-r-none'
							: isLast
							? 'rounded-r-lg rounded-l-none'
							: 'rounded-none';
						return (
							<p
								ref={isFirst ? firstItemRef : isLast ? lastItemRef : null}
								key={student.userid}
								className={`inline-block p-2 m-2 text-white sm:text-sm font-semibold ${bgColorClass} ${shapeClass} ${
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
