import React, {useEffect, useRef, useState} from 'react';
import {Socket} from 'socket.io-client';
interface Props {
	coursestudents: {
		first_name: string;
		last_name: string;
		userid: number;
		studentnumber: string;
	}[];
	socket: Socket | null;
	lectureid: number;
}

const CourseStudents: React.FC<Props> = ({
	coursestudents,
	socket,
	lectureid,
}) => {
	const scrollContainerRef = useRef(null);
	const scrollPositionRef = useRef(0);
	const [bounceGroup, setBounceGroup] = useState(0);
	const lastItemRef = useRef(null);
	const firstItemRef = useRef(null);
	useEffect(() => {
		const interval = setInterval(() => {
			setBounceGroup(prevGroup => (prevGroup + 1) % 2);
		}, 2500); // Change every 2 seconds

		return () => clearInterval(interval);
	}, []);
	const scrollDirectionRef = useRef(1);
	const scrollInterval = useRef(null);
	const scrollSlowly = () => {
		const element = scrollContainerRef.current;
		if (!element) return;
		scrollInterval.current = setInterval(() => {
			if (scrollPositionRef.current >= element.scrollWidth - element.clientWidth) {
				scrollDirectionRef.current = -1; // Change direction to left
			} else if (scrollPositionRef.current <= 0) {
				scrollDirectionRef.current = 1; // Change direction to right
			}
			scrollPositionRef.current += scrollDirectionRef.current;
			element.scrollLeft = scrollPositionRef.current;
		}, 200);
	};
	useEffect(() => {
		scrollSlowly();
		return () => {
			clearInterval(scrollInterval.current);
		};
	}, [coursestudents]);
	useEffect(() => {
		return () => {
			// Disconnect the socket when the component unmounts
			if (socket) {
				socket.disconnect();
			}
		};
	}, [socket]);
	return (
		<div
			ref={scrollContainerRef}
			onScroll={() => {
				if (scrollContainerRef.current) {
					scrollPositionRef.current = scrollContainerRef.current.scrollLeft;
				}
			}}
			onMouseEnter={() => {
				clearInterval(scrollInterval.current);
				if (scrollContainerRef.current) {
					scrollPositionRef.current = scrollContainerRef.current.scrollLeft;
				}
				setBounceGroup(null);
			}}
			onMouseLeave={() => setBounceGroup(prevGroup => (prevGroup + 1) % 2)}
			className={`flex ${
				coursestudents.length > 5 ? 'justify-start' : 'justify-center'
			} bg-white p-3 rounded-lg shadow-md w-full mt-4 overflow-hidden overflow-x-auto`}
		>
			{coursestudents.length === 0 ? (
				<p className="">All students saved</p>
			) : (
				<div
					className={`   whitespace-nowrap `}
					onMouseEnter={() => setBounceGroup(null)}
					onMouseLeave={() => setBounceGroup(prevGroup => (prevGroup + 1) % 2)}
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
								onClick={() => {
									if (socket) {
										const studentName = `${student.first_name} ${student.last_name}`;
										const confirmMessage = `Are you sure you want to add ${studentName} as attended?`;
										if (window.confirm(confirmMessage)) {
											socket.emit('manualstudentinsert', student.studentnumber, lectureid);
										}
									}
								}}
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
