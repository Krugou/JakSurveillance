'use strict';

//const baseUrl = 'https://jaksec.northeurope.cloudapp.azure.com/backend/';
const baseUrl = 'http://localhost:3002/';

const doFetch = async (url: string, options: RequestInit) => {
	const response = await fetch(url, options);
	const json = await response.json();

	if (!response.ok) {
		const message = json.error ? `${json.error}` : json.message;
		throw new Error(message || response.statusText);
	}
	return json;
};
interface LoginInputs {
	username: string;
	password: string;
}
const postLogin = async (inputs: LoginInputs) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: inputs.username,
			password: inputs.password,
		}),
	};

	return await doFetch(baseUrl + 'users', options);
};
interface CreateCourseInputs {
	formData: FormData;
}

const createCourse = async (inputs: CreateCourseInputs) => {
	const {formData} = inputs;
	const options: RequestInit = {
		method: 'POST',
		body: formData,
	};

	const url = `${baseUrl}courses/create`; // append the endpoint to the baseUrl
	return doFetch(url, options);
};
interface CourseCheckInputs {
	codes: string;
}
const checkIfCourseExists = async (inputs: CourseCheckInputs) => {
	const {codes} = inputs;

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			codes: codes,
		}),
	};
	const url = `${baseUrl}courses/check`;
	return await doFetch(url, options);
};

const getAllTopicGroupsAndTopicsInsideThem = async () => {
	const response = await doFetch(baseUrl + 'courses/topics', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	return response;
};

const apiHooks = {
	postLogin,
	createCourse,
	checkIfCourseExists,
	getAllTopicGroupsAndTopicsInsideThem,
};
export default apiHooks;
