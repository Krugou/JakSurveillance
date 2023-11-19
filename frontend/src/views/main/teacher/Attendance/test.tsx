const handleClassFinished = () => {
		const dateToday = new Date().toISOString().slice(0, 19).replace('T', ' ');
		const studentnumbers = courseStudents.map(student => student.studentnumber);
		if (classid) {
			apiHooks.finishClass(dateToday, studentnumbers, classid);
		}
}; 
    
const finishClass = async (
	date: string,
	studentnumbers: string[],
	classid: string,
) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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