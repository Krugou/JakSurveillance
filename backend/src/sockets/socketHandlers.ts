import crypto from 'crypto';

let hash = '';
const timestamps: {start: number; end: number; hash: string}[] = [];

// this defines how often the hash changes or how fast student need to be in class while doing attendance
const speedOfHashChange = 5000; // milliseconds
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

	// console.log('Timestamps:', timestamps);
};

// update the hash immediately and then every `speedOfHashChange` milliseconds
updateHash();
setInterval(updateHash, speedOfHashChange);
// handle new socket.io connections
let SelectedClassid = '';

const setupSocketHandlers = (io: any) => {
	io.on('connection', (socket: any) => {
		console.log('a user connected');
		// handle disconnect
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
		socket.on('getCurrentHashForQrGenerator', classid => {
			// Emit the event every `speedOfHashChange` milliseconds
			const servertime = new Date();
			const intervalId = setInterval(() => {
				socket.emit(
					'getCurrentHashForQrGeneratorServingHashAndChangeTime',
					hash,
					speedOfHashChange,
					classid,
					servertime.getTime(),
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
			(secureHash: string, studentId: any, unixtime: number) => {
				console.log('secureHash:', secureHash);
				console.log('studentId:', studentId);
				console.log('unixtime:', unixtime);

				// find the timestamp that matches the secureHash and unixtime
				const timestamp = timestamps.find(
					t => t.hash === secureHash && unixtime >= t.start && unixtime <= t.end,
				);

				if (timestamp) {
					console.log('Accepted:', secureHash, studentId, unixtime);
				} else {
					io.emit('inputThatStudentHasArrivedToClassTooSlow', 'Too slow'); // send error message to all clients
				}
			},
		);
	});
};

export default setupSocketHandlers;
