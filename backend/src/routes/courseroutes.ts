import ExcelJS from 'exceljs';
import express, { Request, Response, Router } from 'express';
import multer from 'multer';
const upload = multer();
const router: Router = express.Router();
router.get('/', (req: Request, res: Response) => { res.send('Hello, TypeScript with Express!'); });
router.post('/create', upload.single('file'), async (req, res) => {
    const { courseName, courseCode, studentGroup } = req.body;

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Read the Excel file from the buffer
    await workbook.xlsx.load(req.file.buffer);

    // Get the first worksheet
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
        console.error('Worksheet not found');
        res.status(500).send('Internal server error');
        return;
    }
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

    console.log('Course Name:', courseName);
    console.log('Course Code:', courseCode);
    console.log('Student Group:', studentGroup);
    console.log('File Data:', jsonData);

    res.status(200).send('File uploaded and data logged successfully');
});

export default router;