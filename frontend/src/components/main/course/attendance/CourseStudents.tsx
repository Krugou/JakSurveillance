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
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const scrollPositionRef = useRef<number>(0);
	const [bounceGroup, setBounceGroup] = useState<number | null>(0);
	const lastItemRef = useRef<HTMLParagraphElement | null>(null);
	const firstItemRef = useRef<HTMLParagraphElement | null>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [startX, setStartX] = useState<number>(0);
	const [scrollLeft, setScrollLeft] = useState<number>(0);
	const [remainingTime, setRemainingTime] = useState<number>(60);

	useEffect(() => {
		let timerId;

		if (coursestudents.length === 0 && remainingTime > 0) {
			timerId = setInterval(() => {
				setRemainingTime(prevTime => prevTime - 1);
			}, 1000);
		} else if (remainingTime === 0) {
			if (socket) {
				socket.emit('lecturefinishedwithbutton', lectureid);
			}
			setRemainingTime(60); // Reset the timer
		}

		return () => {
			if (timerId) {
				clearInterval(timerId);
			}
		};
	}, [coursestudents, remainingTime, socket, lectureid]);

	const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (scrollContainerRef.current) {
			setIsDragging(true);
			setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
			setScrollLeft(scrollContainerRef.current.scrollLeft);
		}
	};

	const onMouseEnd = () => {
		setIsDragging(false);
	};
	useEffect(() => {
		const interval = window.setInterval(() => {
			setBounceGroup(prevGroup => (prevGroup !== null ? (prevGroup + 1) % 2 : 0));
		}, 4000); // Change every 4 seconds

		return () => clearInterval(interval);
	}, []);
	const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging || !scrollContainerRef.current) return;
		e.preventDefault();
		const x = e.pageX - scrollContainerRef.current.offsetLeft;
		const walk = (x - startX) * 3; //scroll-fast
		scrollContainerRef.current.scrollLeft = scrollLeft - walk;
	};
	const scrollInterval = useRef<number | null>(null);

	const scrollDirectionRef = useRef(1);
	const scrollSlowly = () => {
		const element = scrollContainerRef.current;
		if (!element) return;
		scrollInterval.current = window.setInterval(() => {
			if (scrollPositionRef.current >= element.scrollWidth - element.clientWidth) {
				scrollDirectionRef.current = -1; // Change direction to left
			} else if (scrollPositionRef.current <= 0) {
				scrollDirectionRef.current = 1; // Change direction to right
			}
			scrollPositionRef.current += scrollDirectionRef.current;
			element.scrollLeft = scrollPositionRef.current;
		}, 70);
	};
	useEffect(() => {
		scrollSlowly();
		return () => {
			if (scrollInterval.current !== null) {
				clearInterval(scrollInterval.current);
			}
		};
	}, [coursestudents]);

	return (
		<div
			ref={scrollContainerRef}
			onScroll={() => {
				if (scrollContainerRef.current) {
					scrollPositionRef.current = scrollContainerRef.current.scrollLeft;
				}
			}}
			onMouseDown={onMouseDown}
			onMouseLeave={() => {
				onMouseEnd();
				setBounceGroup(prevGroup => (prevGroup !== null ? (prevGroup + 1) % 2 : 0));
			}}
			onMouseUp={onMouseEnd}
			onMouseMove={onMouseMove}
			onMouseEnter={() => {
				if (scrollInterval.current !== null) {
					clearInterval(scrollInterval.current);
				}
				if (scrollContainerRef.current) {
					scrollPositionRef.current = scrollContainerRef.current.scrollLeft;
				}
				setBounceGroup(null);
			}}
			className={`noSelect hideScrollbar flex ${
				coursestudents.length > 5 ? 'justify-start' : 'justify-center'
			} bg-white p-3 rounded-lg shadow-md w-full mt-4 overflow-hidden overflow-x-auto`}
		>
			{coursestudents.length === 0 ? (
				<p className="">
					{remainingTime > 0
						? `All students are here. Auto closing in ${remainingTime} seconds`
						: 'All students saved'}
				</p>
			) : (
				<div className={`   whitespace-nowrap `}>
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
											console.log(socket);
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
