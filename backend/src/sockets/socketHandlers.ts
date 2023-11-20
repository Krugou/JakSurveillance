import crypto from 'crypto';
import {config} from 'dotenv';
import {Server, Socket} from 'socket.io';
import fetchReal from '../utils/fetch.js';
config();
let hash = '';
const timestamps: {start: number; end: number; hash: string}[] = [];
let speedOfHashChange = 6000; // milliseconds
let leewaytimes = 5;
let timeout = 3600000; // 1 hour

let howMuchLeeWay = 0;
interface Student {
	studentnumber: number;
	GDPR: number;
	first_name: string;
	last_name: string;
	// add other properties as needed
}
// this defines how often the hash changes or how fast student need to be in class while doing attendance
const getToken = async () => {
	try {
		const response = await fetchReal.doFetch('http://localhost:3002/users/', {
			method: 'post', // or 'GET'
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: process.env.devaccount,
				password: process.env.devpass,
			}),
		});

		return response.token;
	} catch (error) {
		// Handle the error here
		console.error(error);
	}
};
const fetchDataAndUpdate = async () => {
	try {
		const token = await getToken();
		const response = await fetchReal.doFetch('http://localhost:3002/admin/ ', {
			method: 'GET', // or 'GET'
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
		});

		speedOfHashChange = response.speedofhash;
		leewaytimes = response.leewayspeed;
		timeout = response.timeouttime;
	} catch (error) {
		// Handle the error here
		console.error(error);
	}
};
// Call the function

const updateHash = () => {
	const start = Date.now();
	hash = crypto.randomBytes(20).toString('hex');
	const end = Date.now() + speedOfHashChange;

	timestamps.push({start, end, hash});
	const timestampslength = howMuchLeeWay / speedOfHashChange;

	if (timestamps.length > timestampslength) {
		timestamps.shift();
	}
};
// handle new socket.io connections
const presentStudents: {[classid: string]: any[]} = {};
const notYetPresentStudents: {[classid: string]: Student[]} = {};
const setupSocketHandlers = (io: Server) => {
	io.on('connection', (socket: Socket) => {
		console.log('user joined: ' + socket.id);
		// handle disconnect
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
		fetchDataAndUpdate()
			.then(() => {
				howMuchLeeWay = speedOfHashChange * leewaytimes;
			})
			.catch(error => {
				console.error(error);
			});

		socket.on('createAttendanceCollection', async classid => {
			socket.join(classid);
			const token = await getToken();
			if (presentStudents[classid] && notYetPresentStudents[classid]) {
				// The lists already exist, so use them
				io
					.to(classid)
					.emit('getallstudentsinclass', notYetPresentStudents[classid]);
			} else {
				fetchReal
					.doFetch(
						'http://localhost:3002/courses/attendance/getallstudentsinclass/',
						{
							method: 'POST', // or 'GET'
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + token,
							},
							body: JSON.stringify({
								classid: classid,
							}),
						},
					)
					.then(response => {
						notYetPresentStudents[classid] = response;
						presentStudents[classid] = []; // Initialize with an empty array

						io
							.to(classid)
							.emit('getallstudentsinclass', notYetPresentStudents[classid]);
					})
					.catch(error => {
						console.error('Error:', error);
					});
			}
			updateHash();
			setInterval(updateHash, speedOfHashChange);
			// Emit the event every `speedOfHashChange` milliseconds
			const servertime = new Date();
			const intervalId = setInterval(() => {
				io
					.to(classid)
					.emit(
						'updateAttendanceCollectionData',
						hash,
						speedOfHashChange,
						classid,
						servertime.getTime(),
						presentStudents[classid],
						notYetPresentStudents[classid],
					);
			}, speedOfHashChange);

			// Clear the interval when the socket disconnects
			socket.on('disconnect', () => {
				clearInterval(intervalId);
			});
		});
		socket.on(
			'inputThatStudentHasArrivedToClass',
			async (
				secureHash: string,
				studentId: string,
				unixtime: number,
				classid: number,
			) => {
				if (studentId === '') {
					io.to(socket.id).emit('inputThatStudentHasArrivedToClassTooSlow', classid);
				}
				// find the timestamp that matches the secureHash and unixtime
				const timestamp = timestamps.find(
					t => t.hash === secureHash && unixtime >= t.start && unixtime <= t.end,
				);
				if (timestamp) {
					// Emit the 'youhavebeensavedintoclass' event only to the client who sent the event
					const token = await getToken();
					fetchReal
						.doFetch('http://localhost:3002/courses/attendance/', {
							method: 'POST', // or 'GET'
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + token,
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

							const studentIndex = notYetPresentStudents[classid].findIndex(
								(student: Student) =>
									Number(student.studentnumber) === Number(studentId),
							);

							if (studentIndex !== -1) {
								const student = notYetPresentStudents[classid][studentIndex];
								presentStudents[classid].push(
									`${student.first_name} ${student.last_name.charAt(0)}.`,
								);
								notYetPresentStudents[classid].splice(studentIndex, 1); // Remove the student from notYetPresentStudents
							} else {
								console.log('Student not found');
							}

							io.to(socket.id).emit('youhavebeensavedintoclass', classid);
						})
						.catch(error => {
							// Handle the error here
							console.error(error);
						});
				} else {
					io.to(socket.id).emit('inputThatStudentHasArrivedToClassTooSlow', classid);
				}
			},
		);
	});
};

export default setupSocketHandlers;
