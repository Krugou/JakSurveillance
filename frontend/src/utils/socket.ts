import io from 'socket.io-client';

let socket;

const getSocket = () => {
	if (!socket) {
		const socketURL =
			import.meta.env.MODE === 'development' ? 'http://localhost:3002' : '/';
		console.log('🚀 ~ file: socket.ts:8 ~ getSocket ~ socketURL:', socketURL);
		const socketPath =
			import.meta.env.MODE === 'development' ? '' : '/api/socket.io';
		console.log('🚀 ~ file: socket.ts:11 ~ getSocket ~ socketPath:', socketPath);
		socket = io(socketURL, {
			path: socketPath,
			transports: ['websocket'],
		});
	}

	return socket;
};
export default getSocket;
