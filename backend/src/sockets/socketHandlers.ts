import crypto from 'crypto';

let hash = '';
const timestamps: {start: number; end: number; hash: string}[] = [];

// this defines how often the hash changes or how fast student need to be in class while doing attendance
const speedOfHashChange = 6000; // milliseconds
// this defines how much lee way there is for network lag or something. speedOfHashChange * 4
const howMuchLeeWay = speedOfHashChange * 4;
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

// update the hash immediately and then every `speedOfHashChange` milliseconds
updateHash();
setInterval(updateHash, speedOfHashChange);
// handle new socket.io connections
let SelectedClassid = '';
const ArrayOfStudents: any[] = [];
const setupSocketHandlers = (io: any) => {
	io.on('connection', (socket: any) => {
		console.log('a user connected');
		// handle disconnect
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
		socket.on('getCurrentHashForQrGenerator', classid => {
			console.log(hash);
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
				);
			}, speedOfHashChange);
			SelectedClassid = classid;

			// Clear the interval when the socket disconnects
			socket.on('disconnect', () => {
				clearInterval(intervalId);
			});
		});
		socket.on(
			'inputThatStudentHasArrivedToClass',
			(secureHash: string, studentId: any, unixtime: number, classid: number) => {
				console.log('secureHash:', secureHash);
				console.log('studentId:', studentId);
				console.log('unixtime:', unixtime);
				console.log('classid:', classid);
				console.log('Timestamps:', timestamps);
				// find the timestamp that matches the secureHash and unixtime
				const timestamp = timestamps.find(
					t => t.hash === secureHash && unixtime >= t.start && unixtime <= t.end,
				);
				console.log(
					'🚀 ~ file: socketHandlers.ts:69 ~ io.on ~ timestamp:',
					timestamp,
				);

				const socketId = socket.id;
				console.log(
					'🚀 ~ file: socketHandlers.ts:71 ~ io.on ~ socketId:',
					socketId,
				);
				if (timestamp) {
					// Emit the 'youhavebeensavedintoclass' event only to the client who sent the event
					io.to(socketId).emit('youhavebeensavedintoclass', studentId);
					ArrayOfStudents.push(studentId);
					console.log('Accepted:', secureHash, studentId, unixtime);
				} else {
					ArrayOfStudents.push(studentId);
					io
						.to(socketId)
						.emit('inputThatStudentHasArrivedToClassTooSlow', studentId); // send error message to all clients
				}
			},
		);
	});
};

export default setupSocketHandlers;
