import crypto from 'crypto';
import {Server, Socket} from 'socket.io';
import fetchReal from '../utils/fetch.js';

let hash = '';
const timestamps: {start: number; end: number; hash: string}[] = [];
interface Student {
	studentnumber: string;
	GDPR: number;
	first_name: string;
	last_name: string;
	// add other properties as needed
}
// this defines how often the hash changes or how fast student need to be in class while doing attendance
let speedOfHashChange = 6000; // milliseconds
let leewaytimes = 5;
async function fetchDataAndUpdate() {
	try {
		const response = await fetchReal.doFetch('http://localhost:3002/admin/ ', {
			method: 'GET', // or 'GET'
			headers: {
				'Content-Type': 'application/json',
			},
		});
		speedOfHashChange = response.speedofhash;
		leewaytimes = response.leewayspeed;
	} catch (error) {
		// Handle the error here
		console.error(error);
	}
}
let howMuchLeeWay = 0;
// Call the function
fetchDataAndUpdate().then(() => {
	howMuchLeeWay = speedOfHashChange * leewaytimes;
});
const updateHash = () => {
	const start = Date.now();
	hash = crypto.randomBytes(20).toString('hex');
	// console.log('Updated hash:', hash);
	const end = Date.now() + speedOfHashChange;

	timestamps.push({start, end, hash});
	const timestampslength = howMuchLeeWay / speedOfHashChange;

	if (timestamps.length > timestampslength) {
		timestamps.shift();
	}
};
// handle new socket.io connections
let SelectedClassid = '';
const ArrayOfStudents: any[] = [];
let CourseStudents: Student[] = [];
const setupSocketHandlers = (io: Server) => {
	io.on('connection', (socket: Socket) => {
		console.log('a user connected');
		// handle disconnect
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
		socket.on('getCurrentHashForQrGenerator', classid => {
			fetchReal
				.doFetch(
					'http://localhost:3002/courses/attendance/getallstudentsinclass/',
					{
						method: 'POST', // or 'GET'
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							classid: classid,
						}),
					},
				)
				.then(response => {
					CourseStudents = response;
					socket.emit('getallstudentsinclass', CourseStudents);
				})
				.catch(error => {
					console.error('Error:', error);
				});
			console.log('🚀 ~ file: socketHandlers.ts:37 ~ io.on ~ hash:', hash);
			updateHash();
			setInterval(updateHash, speedOfHashChange);
			// Emit the event every `speedOfHashChange` milliseconds
			const servertime = new Date();
			const intervalId = setInterval(() => {
				socket.emit(
					'getCurrentHashForQrGeneratorServingHashAndChangeTime',
					hash,
					speedOfHashChange,
					classid,
					servertime.getTime(),
					ArrayOfStudents,
					CourseStudents,
				);
			}, speedOfHashChange);
			SelectedClassid = classid;
			console.log('SelectedClassid:', SelectedClassid);
			// Clear the interval when the socket disconnects
			socket.on('disconnect', () => {
				clearInterval(intervalId);
			});
		});
		socket.on(
			'inputThatStudentHasArrivedToClass',
			(
				secureHash: string,
				studentId: string,
				unixtime: number,
				classid: number,
			) => {
				// find the timestamp that matches the secureHash and unixtime
				const timestamp = timestamps.find(
					t => t.hash === secureHash && unixtime >= t.start && unixtime <= t.end,
				);

				const socketId = socket.id;

				if (timestamp) {
					// Emit the 'youhavebeensavedintoclass' event only to the client who sent the event

					fetchReal
						.doFetch('http://localhost:3002/courses/attendance/', {
							method: 'POST', // or 'GET'
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								status: '1',
								date: new Date().toISOString().slice(0, 19).replace('T', ' '),
								studentnumber: studentId,
								classid: classid,
							}),
						})
						.then(response => {
							console.log('Success:', response);
							io.to(socketId).emit('youhavebeensavedintoclass', SelectedClassid);
							const student = CourseStudents.find(
								(student: Student) => student.studentnumber === studentId.toString(),
							);
							// remember to change back to 0
							if (student && student.GDPR === 1) {
								ArrayOfStudents.push(studentId);
							} else if (student) {
								ArrayOfStudents.push(
									`${student.first_name} ${student.last_name.charAt(0)}.`,
								);
							} else {
								console.log('Student not found');
							}

							CourseStudents = CourseStudents.filter(
								student => student.studentnumber !== studentId,
							);

							console.log('Accepted:', secureHash, studentId, unixtime);
						})
						.catch(error => {
							// Handle the error here
							console.error(error);
						});
				} else {
					io
						.to(socketId)
						.emit('inputThatStudentHasArrivedToClassTooSlow', SelectedClassid); // send error message to all clients
				}
			},
		);
	});
};

export default setupSocketHandlers;
