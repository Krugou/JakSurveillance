import crypto from 'crypto';
import {config} from 'dotenv';
import {Server, Socket} from 'socket.io';
import doFetch from '../utils/doFetch.js';
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
// this defines how often the hash changes or how fast student need to be in lecture while doing attendance
const getToken = async () => {
	try {
		// admin login to get token use dev account from .env file
		const response = await doFetch('http://localhost:3002/users/', {
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
		const response = await doFetch('http://localhost:3002/admin/ ', {
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

// Update the hash and timestamps
const updateHash = () => {
	// Generate a random hash
	const start = Date.now();
	hash = crypto.randomBytes(20).toString('hex');
	const end = Date.now() + speedOfHashChange;
	// Add the hash and timestamps to the timestamps array
	timestamps.push({start, end, hash});
	const timestampslength = howMuchLeeWay / speedOfHashChange;
	// Remove the oldest hash and timestamp if the timestamps array is too long
	if (timestamps.length > timestampslength) {
		timestamps.shift();
	}
};
// Send a POST request to the '/lecturefinished/' route
const finishLecture = async (lectureid: string, io) => {
	// Prepare the data to be sent
	const data = {
		date: new Date().toISOString().slice(0, 19).replace('T', ' '),
		studentnumbers: notYetPresentStudents[lectureid].map(
			student => student.studentnumber,
		),
		lectureid: lectureid,
	};
	const token = await getToken();
	// Send a POST request to the '/lecturefinished/' route
	try {
		const response = await fetch(
			'http://localhost:3002/courses/attendance/lecturefinished/',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token,
				},
				body: JSON.stringify(data),
			},
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		io.to(lectureid).emit('lecturefinished', lectureid);
	} catch (error) {
		console.error('Error:', error);
	}
};
// The lists of students who have arrived and who have not yet arrived
const presentStudents: {[lectureid: string]: any[]} = {};
const notYetPresentStudents: {[lectureid: string]: Student[]} = {};
// The timeout id for the lecture
let lectureTimeoutId: NodeJS.Timeout;
const setupSocketHandlers = (io: Server) => {
	io.on('connection', (socket: Socket) => {
		console.log('user joined: ' + socket.id);
		// handle disconnect
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});

		socket.on('createAttendanceCollection', async lectureid => {
			// Fetch and update data when a new lecture is started
			fetchDataAndUpdate()
				.then(() => {
					console.log('settings updated');
					howMuchLeeWay = speedOfHashChange * leewaytimes;
				})
				.catch(error => {
					console.error(error);
				});
			// Join the room with the lectureid
			socket.join(lectureid);
			// Emit the 'lecturestarted' event to the room with the lectureid
			io.to(lectureid).emit('lecturestarted', lectureid, timeout);
			// Get the list of students who have arrived and who have not yet arrived
			const token = await getToken();
			if (presentStudents[lectureid] && notYetPresentStudents[lectureid]) {
				// If the lists already exist, emit them to the room with the lectureid
				io
					.to(lectureid)
					.emit('getallstudentsinlecture', notYetPresentStudents[lectureid]);
			} else {
				// If the lists do not exist, fetch them from the server and emit them to the room with the lectureid
				doFetch(
						'http://localhost:3002/courses/attendance/getallstudentsinlecture/',
						{
							method: 'POST', // or 'GET'
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + token,
							},
							body: JSON.stringify({
								lectureid: lectureid,
							}),
						},
					)
					.then(response => {
						// Handle the response here
						notYetPresentStudents[lectureid] = response;
						presentStudents[lectureid] = [];
						// Emit the lists to the room with the lectureid
						io
							.to(lectureid)
							.emit('getallstudentsinlecture', notYetPresentStudents[lectureid]);
					})
					.catch(error => {
						console.error('Error:', error);
					});
			}
			// Update the hash every `speedOfHashChange` milliseconds
			updateHash();
			setInterval(updateHash, speedOfHashChange);
			// Emit the hash to the room with the lectureid
			const intervalId = setInterval(() => {
				io
					.to(lectureid)
					.emit(
						'updateAttendanceCollectionData',
						hash,
						lectureid,
						presentStudents[lectureid],
						notYetPresentStudents[lectureid],
					);
			}, speedOfHashChange);
			if (lectureTimeoutId) {
				clearTimeout(lectureTimeoutId);
			}
			// Set a timeout to emit 'classfinished' event after 'timeout' milliseconds
			lectureTimeoutId = setTimeout(() => {
				finishLecture(lectureid, io);
			}, timeout);

			// Handle the 'lecturefinishedwithbutton' event
			socket.on('lecturefinishedwithbutton', async (lectureid: string) => {
				finishLecture(lectureid, io);
			});
			// Clear the interval when the socket disconnects
			socket.on('disconnect', () => {
				clearInterval(intervalId);
			});
		});
		// Handle the 'inputThatStudentHasArrivedToLecture' event
		// This event is emitted when the student inputs the secure hash and unixtime
		socket.on(
			'inputThatStudentHasArrivedToLecture',
			async (
				secureHash: string,
				studentId: string,
				unixtime: number,
				lectureid: number,
			) => {
				if (studentId === '') {
					io
						.to(socket.id)
						.emit('inputThatStudentHasArrivedToLectureTooSlow', lectureid);
				}
				// find the timestamp that matches the secureHash and unixtime
				const timestamp = timestamps.find(
					t => t.hash === secureHash && unixtime >= t.start && unixtime <= t.end,
				);
				if (timestamp) {
					// Emit the 'youhavebeensavedintolecture' event only to the client who sent the event
					const token = await getToken();
					doFetch('http://localhost:3002/courses/attendance/', {
							method: 'POST', // or 'GET'
							headers: {
								'Content-Type': 'application/json',
								Authorization: 'Bearer ' + token,
							},
							body: JSON.stringify({
								status: '1',
								date: new Date().toISOString().slice(0, 19).replace('T', ' '),
								studentnumber: studentId,
								lectureid: lectureid,
							}),
						})
						.then(response => {
							console.log('Success:', response);

							const studentIndex = notYetPresentStudents[lectureid].findIndex(
								(student: Student) =>
									Number(student.studentnumber) === Number(studentId),
							);

							if (studentIndex !== -1) {
								const student = notYetPresentStudents[lectureid][studentIndex];
								presentStudents[lectureid].push(
									`${student.first_name} ${student.last_name.charAt(0)}.`,
								);
								notYetPresentStudents[lectureid].splice(studentIndex, 1); // Remove the student from notYetPresentStudents
							} else {
								console.log('Student not found');
							}

							io.to(socket.id).emit('youhavebeensavedintolecture', lectureid);
						})
						.catch(error => {
							// Handle the error here
							console.error(error);
						});
				} else {
					io
						.to(socket.id)
						.emit('inputThatStudentHasArrivedToLectureTooSlow', lectureid);
				}
			},
		);
		// Handle the 'manualstudentinsert' event
		// This event is emitted when the teacher inputs the student id
		socket.on(
			'manualstudentinsert',
			async (studentId: string, lectureid: number) => {
				console.log('manualstudentinsert', studentId, lectureid);
				// Emit the 'manualstudentinsertFailed' event only to the client who sent the event
				if (studentId === '') {
					io.to(socket.id).emit('manualstudentinsertFailedEmpty', lectureid);
					return;
				}

				const token = await getToken();
				doFetch('http://localhost:3002/courses/attendance/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + token,
						},
						body: JSON.stringify({
							status: '1',
							date: new Date().toISOString().slice(0, 19).replace('T', ' '),
							studentnumber: studentId,
							lectureid: lectureid,
						}),
					})
					.then(response => {
						console.log('Success:', response);

						const studentIndex = notYetPresentStudents[lectureid].findIndex(
							(student: Student) =>
								Number(student.studentnumber) === Number(studentId),
						);

						if (studentIndex !== -1) {
							const student = notYetPresentStudents[lectureid][studentIndex];
							presentStudents[lectureid].push(
								`${student.first_name} ${student.last_name.charAt(0)}.`,
							);
							notYetPresentStudents[lectureid].splice(studentIndex, 1); // Remove the student from notYetPresentStudents
						} else {
							console.log('Student not found');
						}
						// Emit the 'manualstudentinsertSuccess' event only to the client who sent the event
						io.to(socket.id).emit('manualstudentinsertSuccess', lectureid);
					})
					.catch(error => {
						console.error(error);
						// Emit the 'manualstudentinsertError' event only to the client who sent the event
						io.to(socket.id).emit('manualstudentinsertError', lectureid);
					});
			},
		);
	});
};

export default setupSocketHandlers;
