import { config } from 'dotenv';
import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
config();
const upload = multer();
const router: Router = express.Router();
import openData from '../utils/opendata.js';

router.get('/', (_req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express! this is courses route calling');
});
router.post('/check', express.json(), async (req: Request, res: Response) => {
    const { code, studentGroup } = req.body;

    try {
        const data = await openData.CheckOpenDataReservations(code, studentGroup);

        // Check if message is "No results"
        if ((data as any).message === 'No results') {
            res.status(404).send('No results');
            return;
        }

        res.status(200).json(data as Record<string, unknown>); // send the data as the response
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
    }
});
router.post('/create', upload.single('file'), async (req, res) => {
    console.log('Received request'); // Debugging line

    const { courseName, courseCode, studentGroup } = req.body;
    console.log('Request body:', req.body); // Debugging line
    if (!req.file) {
        console.error('No file uploaded');
        res.status(400).send('No file uploaded');
        return;
    }
    // Read the Excel file from the buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    console.log('Loaded workbook'); // Debugging line

    // Get the first worksheet
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];

    if (!worksheet) {
        console.error('Worksheet not found');
        res.status(500).send('Internal server error');
        return;
    }
    console.log('Got worksheet'); // Debugging line

    // Convert the worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log('Converted worksheet to JSON'); // Debugging line

    console.log('Course Name:', courseName);
    console.log('Course Code:', courseCode);
    console.log('Student Group:', studentGroup);
    console.table(jsonData);

    res.status(200).send('File uploaded and data logged successfully');
});

export default router;