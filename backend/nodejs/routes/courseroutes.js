import ExcelJS from 'exceljs';
import express from 'express';
import multer from 'multer';
const upload = multer();
const router = express.Router();
router.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
router.post('/create', upload.single('file'), async (req, res) => {
    console.log('Received request'); // Debugging line
    const { courseName, courseCode, studentGroup } = req.body;
    console.log('Request body:', req.body); // Debugging line
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    // Read the Excel file from the buffer
    await workbook.xlsx.load(req.file.buffer);
    console.log(req.file.buffer); // Debugging line
    console.log('Loaded workbook'); // Debugging line
    console.log(workbook.worksheets.map(ws => ws.name));
    // Get the first worksheet
    const worksheet = workbook.getWorksheet('Sheet0');
    if (!worksheet) {
        console.error('Worksheet not found');
        res.status(500).send('Internal server error');
        return;
    }
    console.log('Got worksheet'); // Debugging line
    // Convert the worksheet to JSON
    const jsonData = worksheet.getRows(2, worksheet.rowCount).map(row => {
        let rowValue = {};
        row.eachCell((cell, colNumber) => {
            const headerCell = worksheet.getRow(1).getCell(colNumber);
            if (headerCell && cell) {
                rowValue[headerCell.value] = cell.value;
            }
        });
        return rowValue;
    });
    console.log('Converted worksheet to JSON'); // Debugging line
    console.log('Course Name:', courseName);
    console.log('Course Code:', courseCode);
    console.log('Student Group:', studentGroup);
    console.table(jsonData);
    res.status(200).send('File uploaded and data logged successfully');
});
export default router;
