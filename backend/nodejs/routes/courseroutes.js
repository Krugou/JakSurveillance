import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
const upload = multer();
const router = express.Router();
router.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
router.post('/create', upload.single('file'), async (req, res) => {
    console.log('Received request'); // Debugging line
    const { courseName, courseCode, studentGroup } = req.body;
    console.log('Request body:', req.body); // Debugging line
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
