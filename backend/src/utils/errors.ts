class HttpError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message); // Call the parent constructor with the message parameter
		this.status = status; // Add the status property
	}
}

const httpError = (message: string, status: number) => {
	console.log('error used');
	const err = new HttpError(message, status);
	return err;
};

export default httpError;
