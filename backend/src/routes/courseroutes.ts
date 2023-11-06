import {config} from 'dotenv';
import express, {Request, Response, Router} from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import openData from '../utils/opendata.js';
import topicRoutes from './course/topicRoutes.js';
config();
const upload = multer();
const router: Router = express.Router();

import course from '../models/coursemodel.js';
import attendanceRoutes from './course/attendanceRoutes.js';
router.get('/', async (_req: Request, res: Response) => {
	try {
		const [rows] = await course.fetchAllCourses();
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.use('/attendance', attendanceRoutes);
router.use('/topics', topicRoutes);

router.post('/check', express.json(), async (req: Request, res: Response) => {
	const {codes} = req.body;

	try {
		const data = await openData.checkOpenDataRealization(codes);
		console.log('🚀 ~ file: courseroutes.ts:19 ~ router.post ~ data:', data);

		// Check if message is "No results"
		if ((data as any).message === 'No results') {
			res.status(404).json({
				exists: false,
			});
			return;
		}

		res.status(200).json({
			exists: true,
		}); // send the data as the response
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('Internal server error');
	}
});
router.post('/create', upload.single('file'), async (req, res) => {
	console.log('Received request'); // Debugging line
	console.log(req.body); // Debugging line

	const {
		courseName,
		courseCode,
		studentGroup,
		topicGroup,
		topics,
		instructorEmail,
		checkCourseDetails,
	} = req.body;
	let startDate = req.body.startDate;
	let endDate = req.body.endDate;

	console.log(checkCourseDetails);
	console.log(topicGroup);
	console.log(topics);

	// console.log('Request body:', req.body); // Debugging line
	if (!req.file) {
		console.error('No file uploaded');
		res.status(400).send('No file uploaded');
		return;
	}
	// Read the Excel file from the buffer
	const workbook = XLSX.read(req.file.buffer, {type: 'buffer'});
	console.log('Loaded workbook'); // Debugging line

	// Get the first worksheet
	const worksheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[worksheetName];

	if (!worksheet) {
		console.error('Worksheet not found');
		res.status(500).send('Internal server error');
		return;
	}
	// console.log('Got worksheet'); // Debugging line

	// Convert the worksheet to JSON
	const jsonData = XLSX.utils.sheet_to_json(worksheet);
	// console.log('Converted worksheet to JSON'); // Debugging line

	// console.log('Course Name:', courseName);
	// console.log('Course Code:', courseCode);
	// console.log('Student Group:', studentGroup);
	const finToEng = {
		Sukunimi: 'last_name',
		Etunimi: 'first_name',
		Nimi: 'name',
		Email: 'email',
		'Op.num': 'studentnumber',
		Saapumisyhmä: 'Arrival Group',
		'Hall.ryhmät': 'Admin Groups',
		Ohjelma: 'Program',
		Koulutusmuoto: 'Form of Education',
		Ilmoittautuminen: 'Registration',
		Arviointi: 'Assessment',
	};
	// console.log('Initial jsonData:', jsonData);

	const keys = Object.values(jsonData[0] as object);
	// console.log('Keys:', keys);

	let mappedData = [];
	for (let j = 1; j < jsonData.length; j++) {
		const values = Object.values(jsonData[j] as object);
		// console.log(`Values for row ${j}:`, values);

		const mappedObject: Record<string, unknown> = {};
		for (let i = 0; i < keys.length; i++) {
			mappedObject[keys[i]] = values[i];
		}
		// console.log(`Mapped object for row ${j}:`, mappedObject);

		mappedData.push(mappedObject);
	}

	// console.log('Mapped data before transformation:', mappedData);

	mappedData = mappedData.map((item: unknown) => {
		const mappedItem: Record<string, unknown> = {};
		for (const key in item as object) {
			if (finToEng[key as keyof typeof finToEng]) {
				mappedItem[finToEng[key as keyof typeof finToEng]] = (
					item as Record<string, unknown>
				)[key];
			} else {
				mappedItem[key] = (item as Record<string, unknown>)[key];
			}
		}

		return mappedItem;
	});

	// console.log('Final mapped data:', mappedData);

	const code = courseCode;
	const data = await openData.checkOpenDataRealization(code);

	if (checkCourseDetails === 'true') {
		// Extract startDate and endDate from data and convert them to Date objects
		startDate = new Date(data.realizations[0].startDate);
		// console.log(
		// 	'🚀 ~ file: courseroutes.ts:122 ~ router.post ~ startDate:',
		// 	startDate,
		// );
		endDate = new Date(data.realizations[0].endDate);
		// console.log(
		// 	'🚀 ~ file: courseroutes.ts:126 ~ router.post ~ endDate:',
		// 	endDate,
		// );
	}
	// console.table(mappedData);
	try {
		await course.insertIntoCourse(
			courseName,
			startDate,
			endDate,
			courseCode,
			studentGroup,
			mappedData,
			instructorEmail,
			topics,
			topicGroup,
		);
		res
			.status(200)
			.send({message: 'File uploaded and data logged successfully'});
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal server error:' + error);
	}
});
router.get('/instructor/:email', async (req: Request, res: Response) => {
	try {
		const courses = await course.getCoursesByInstructorEmail(req.params.email);
		res.json(courses);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});

export default router;
