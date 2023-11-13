'use strict';

const baseUrl =
	import.meta.env.MODE === 'development'
		? 'http://localhost:3002/'
		: 'https://jaksec.northeurope.cloudapp.azure.com/api/';
console.log(`Current mode: ${import.meta.env.MODE}`);
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
interface getCourseReservations {
	code: string;
}
interface checkIfCourseExists {
	codes: string;
}

const checkIfCourseExists = async (inputs: checkIfCourseExists) => {
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

const getAllCoursesByInstructorEmail = async (email: string) => {
	// Define your fetch options
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	// Use the email to make the API request
	return await doFetch(`${baseUrl}courses/instructor/${email}`, options);
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
const getCourseDetailByCourseId = async (courseId: string) => {
	const response = await doFetch(baseUrl + 'courses/coursesbyid/' + courseId, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	return response;
};
const getCourseReservations = async (inputs: getCourseReservations) => {
	const {code} = inputs;

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			code: code,
		}),
	};
	const url = `${baseUrl}courses/checkreservations/`;
	return await doFetch(url, options);
};
interface Course {
	code: string;
}

const createClass = async (
	topicname: string,
	course: Course,
	start_date: Date,
	end_date: Date,
	timeofday: string,
) => {
	const inputDate = start_date;
	const formattedStart_date = new Date(inputDate)
		.toISOString()
		.replace('T', ' ')
		.replace('Z', '');
	const inputEndDate = end_date;
	const formattedEnd_date = new Date(inputEndDate)
		.toISOString()
		.replace('T', ' ')
		.replace('Z', '');
	const coursecode = course.code;
	const options: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			topicname,
			coursecode,
			start_date: formattedStart_date,
			end_date: formattedEnd_date,
			timeofday,
		}),
	};
	const url = `${baseUrl}courses/attendance/class/`;
	return doFetch(url, options);
};
const getUserInfoByToken = async (token: string) => {
	const options = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token,
		},
	};

	return doFetch(baseUrl + 'secure/', options);
};

const getAllCourseInfoByUserEmail = async (email: string) => {
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
	};

	// Use the email to make the API request
	return await doFetch(`${baseUrl}courses/info/${email}`, options);
};
const apiHooks = {
	postLogin,
	createCourse,
	checkIfCourseExists,
	getAllTopicGroupsAndTopicsInsideThem,
	getAllCoursesByInstructorEmail,
	getCourseDetailByCourseId,
	getCourseReservations,
	createClass,
	getUserInfoByToken,
	getAllCourseInfoByUserEmail,
};
export default apiHooks;
