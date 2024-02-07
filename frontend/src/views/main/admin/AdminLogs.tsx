import {Slider} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import apiHooks from '../../../hooks/ApiHooks';

const AdminLogs = () => {
	const [lineLimit, setLineLimit] = useState(100);
	const [logs, setLogs] = useState<{lineNumber: number; line: string}[]>([]);
	const [errorLogs, setErrorLogs] = useState<
		{lineNumber: number; line: string}[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getLogs = async () => {
			setIsLoading(true);
			const token = localStorage.getItem('userToken');
			if (!token) {
				toast.error('No token available');
				setIsLoading(false);
				return;
			}

			try {
				const logsResult = await apiHooks.fetchLogs(token, lineLimit);
				const errorLogsResult = await apiHooks.fetchErrorLogs(token, lineLimit);

				if (!Array.isArray(logsResult) || !Array.isArray(errorLogsResult)) {
					toast.error('Expected an array from fetchLogs and fetchErrorLogs');
					setIsLoading(false);
					return;
				}

				setLogs(logsResult);
				setErrorLogs(errorLogsResult);
			} catch (error) {
				toast.error('Error fetching logs');
			}

			setIsLoading(false);
		};

		// Wait for 2 seconds before fetching logs
		const timeoutId = setTimeout(getLogs, 500);
		// Then fetch logs every 2 minutes
		const intervalId = setInterval(getLogs, 2 * 60 * 1000);
		// Clear the timeout if the component is unmounted or lineLimit changes
		return () => {
			clearTimeout(timeoutId);
			clearInterval(intervalId);
		};
	}, [lineLimit]);
	const handleShowMore = () => {
		if (lineLimit < 500) {
			setIsLoading(true);
			setLineLimit(lineLimit + 100);
		}
	};

	const handleReset = () => {
		setIsLoading(true);
		setLineLimit(100);
	};
	return (
		<div className="p-4 m-6 bg-white">
			{isLoading ? (
				<div className="flex justify-center items-center">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
				</div>
			) : (
				<>
					<h1 className="text-2xl font-bold text-center mb-4">Admin Logs</h1>
					<div className="p-4 m-6 flex flex-col justify-center items-center">
						<div className="flex justify-center ">
							<button
								onClick={handleShowMore}
								className={`m-4 font-bold py-2 px-4 rounded ${
									lineLimit >= 500
										? 'bg-gray-500 cursor-not-allowed'
										: 'bg-blue-500 hover:bg-blue-700 text-white'
								}`}
								disabled={lineLimit >= 500}
							>
								Show More
							</button>
							<button
								onClick={handleReset}
								className="m-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							>
								Reset
							</button>
						</div>
						<h2 className=" p-4 text-white border rounded bg-slate-500 m-6">Logs:</h2>
						{logs.length === 0 ? (
							<p>No logs found</p>
						) : (
							<div className="p-4 m-6 flex flex-col justify-center items-center">
								<pre className="p-4 border rounded text-white bg-black">
									{logs.map(log => `${log.lineNumber}: ${log.line}`).join('\n')}
								</pre>
							</div>
						)}

						<h2 className=" bg-slate-500 border rounded text-white p-4 m-6">
							Error Logs:
						</h2>
						{errorLogs.length === 0 ? (
							<p>No error logs found</p>
						) : (
							<div className="p-4 m-6 flex flex-col justify-center items-center">
								<pre className="p-4 border rounded text-white bg-black">
									{errorLogs.map(log => `${log.lineNumber}: ${log.line}`).join('\n')}
								</pre>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default AdminLogs;
