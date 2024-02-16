import {ChartDataset} from 'chart.js';
import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';

const getDayOfWeek = (date: string) => {
	const dayNames = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	return dayNames[new Date(date).getDay()];
};
interface Lecture {
	lectureid: number;
	start_date: string;
	attended: number;
	notattended: number;
	teacheremail: string;
	timeofday: string;
	coursename: string;
	state: string;
	topicname: string;
	coursecode: string;
	courseid: string;
	actualStudentCount: number;
}
const LecturesByDayChart = ({lectures}: {lectures: Lecture[] | null}) => {
	const [chartData, setChartData] = useState<ChartDataset<
		'bar',
		number[]
	> | null>(null);

	useEffect(() => {
		const dayCounts: {[key: string]: number} = {
			Monday: 0,
			Tuesday: 0,
			Wednesday: 0,
			Thursday: 0,
			Friday: 0,
		};
		if (!lectures) {
			return;
		}
		lectures.forEach(lecture => {
			const day = getDayOfWeek(lecture.start_date);
			if (day in dayCounts) {
				dayCounts[day]++;
			}
		});

		setChartData({
			label: 'Number of Lectures',
			data: Object.values(dayCounts),
			backgroundColor: 'rgba(75, 192, 192, 0.6)',
		});
	}, [lectures]);

	if (!chartData) {
		return null;
	}

	return (
		<Bar
			data={{
				labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
				datasets: [chartData],
			}}
			options={{
				responsive: true,
				plugins: {
					legend: {
						position: 'top',
					},
				},
			}}
		/>
	);
};

export default LecturesByDayChart;
