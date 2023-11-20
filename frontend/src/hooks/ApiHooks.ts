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
	courseName: string;
	courseCode: string;
	studentGroup: string;
	startDate: string;
	endDate: string;
	instructors: {email: string}[];
	studentList: string[];
	topicGroup: string; // Replace 'any' with the actual type if known
	topics: string; // Replace 'any' with the actual type if known
	instructorEmail: string;
}
interface CreateCourseFile {
	formDataFile: FormData;
}
const createCourse = async (courseData: CreateCourseInputs, token: string) => {
	const options: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
		body: JSON.stringify(courseData),
	};

	const url = `${baseUrl}courses/create`; // append the endpoint to the baseUrl
	return doFetch(url, options);
};
const excelInput = async (inputs: CreateCourseFile, token: string) => {
	const {formDataFile} = inputs;
	const options: RequestInit = {
		headers: {
			Authorization: 'Bearer ' + token,
		},
		method: 'POST',
		body: formDataFile,
	};

	const url = `${baseUrl}courses/excelinput`; // append the endpoint to the baseUrl
	return doFetch(url, options);
};
interface getCourseReservations {
	code: string;
	token: string;
}
interface checkIfCourseExists {
	codes: string;
	token: string;
}

const checkIfCourseExists = async (inputs: checkIfCourseExists) => {
	const {codes, token} = inputs;

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
		body: JSON.stringify({
			codes: codes,
		}),
	};
	const url = `${baseUrl}courses/check`;
	return await doFetch(url, options);
};

const getAllCoursesByInstructorEmail = async (email: string, token: string) => {
	// Define your fetch options
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
	};

	// Use the email to make the API request
	return await doFetch(`${baseUrl}courses/instructor/${email}`, options);
};

const getAllTopicGroupsAndTopicsInsideThem = async (token: string) => {
	const response = await doFetch(baseUrl + 'courses/topics', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
	});
	return response;
};
const getCourseDetailByCourseId = async (courseId: string, token: string) => {
	const response = await doFetch(baseUrl + 'courses/coursesbyid/' + courseId, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
	});
	return response;
};
const getCourseReservations = async (inputs: getCourseReservations) => {
	const {code, token} = inputs;

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
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

const CreateLecture = async (
	topicname: string,
	course: Course,
	start_date: Date,
	end_date: Date,
	timeofday: string,
	token: string,
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
			Authorization: 'Bearer ' + token,
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

const getAllCourseInfoByUserEmail = async (token: string) => {
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
	};

	// Use the email to make the API request
	return await doFetch(`${baseUrl}courses/user/all`, options);
};
const finishClass = async (
	date: string,
	studentnumbers: string[],
	classid: string,
	token: string,
) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
		body: JSON.stringify({
			date,
			studentnumbers,
			classid,
		}),
	};
	const url = `${baseUrl}courses/attendance/classfinished/`;
	return doFetch(url, options);
};
const getAttendanceInfoByUsercourseid = async (
	usercourseid: number,
	token: string,
) => {
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
	};
	console.log(token);
	// Use the email to make the API request
	return await doFetch(
		`${baseUrl}courses/attendance/usercourse/${usercourseid}`,
		options,
	);
};
const fetchServerSettings = async (token: string) => {
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
	};
	const url = `${baseUrl}admin`;
	return doFetch(url, options);
};
const updateServerSettings = async (
	speedofhash: number,
	leewayspeed: number,
	timeouttime: number,
	attendancethreshold: number,
	token: string,
) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + token,
		},
		body: JSON.stringify({
			speedofhash,
			leewayspeed,
			timeouttime,
			attendancethreshold,
		}),
	};
	const url = `${baseUrl}admin`;
	return doFetch(url, options);
};

const apiHooks = {
	fetchServerSettings,
	postLogin,
	createCourse,
	checkIfCourseExists,
	getAllTopicGroupsAndTopicsInsideThem,
	getAllCoursesByInstructorEmail,
	getCourseDetailByCourseId,
	getCourseReservations,
	CreateLecture,
	getUserInfoByToken,
	getAllCourseInfoByUserEmail,
	finishClass,
	getAttendanceInfoByUsercourseid,
	excelInput,
	updateServerSettings,
};
export default apiHooks;
