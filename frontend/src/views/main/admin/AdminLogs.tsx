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
	const [trigger, setTrigger] = useState(0);

	useEffect(() => {
		setIsLoading(true);
		const getLogs = async () => {
			const token = localStorage.getItem('userToken');
			if (!token) {
				toast.error('No token available');
				setIsLoading(false);
				return;
			}

			try {
				let logsResult = await apiHooks.fetchLogs(token, lineLimit);
				let errorLogsResult = await apiHooks.fetchErrorLogs(token, lineLimit);

				if (!Array.isArray(logsResult) || !Array.isArray(errorLogsResult)) {
					toast.error('Expected an array from fetchLogs and fetchErrorLogs');
					setIsLoading(false);
					return;
				}
				logsResult = logsResult.filter(log => log.line.trim() !== '');
				errorLogsResult = errorLogsResult.filter(log => log.line.trim() !== '');
				setLogs(logsResult.reverse());
				setErrorLogs(errorLogsResult.reverse());
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
	}, [lineLimit, trigger]);
	const handleShowMore = () => {
		if (lineLimit < 500) {
			setIsLoading(true);
			setLineLimit(lineLimit + 100);
		}
	};

	const handleReset = () => {
		setLineLimit(100);
		setTrigger(prevTrigger => prevTrigger + 1);
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
								Show older logs
							</button>
							<button
								onClick={handleReset}
								className="m-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							>
								Reset/Reload
							</button>
						</div>
						{logs.length === 0 ? (
							<p>No logs found</p>
						) : (
							<>
								<h2 className=" p-4 text-white border rounded bg-slate-500 m-6">
									Logs:
								</h2>

								<div className="p-4 m-6 flex flex-col justify-center items-center">
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														User Email
													</th>

													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Message
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Time
													</th>
												</tr>
											</thead>
											<tbody className="bg-white text-black  divide-y divide-gray-200">
												{logs.map((log, index) => {
													try {
														const parsedLog = JSON.parse(log.line);
														return (
															<tr key={index}>
																<td className="px-6 py-4 text-xs text-left whitespace-nowrap">
																	{parsedLog.useremail}
																</td>
																<td className="px-6 py-4 text-xs text-left whitespace-nowrap ">
																	{parsedLog.msg}
																</td>
																<td className="px-6 py-4 text-xs text-left whitespace-nowrap">
																	{new Date(parsedLog.time).toLocaleString()}
																</td>
															</tr>
														);
													} catch (error) {
														console.error(`Error parsing log line: ${log.line}`, error);
														return null;
													}
												})}
											</tbody>
										</table>
									</div>
								</div>
							</>
						)}

						{errorLogs.length === 0 ? (
							<p>No error logs found</p>
						) : (
							<>
								<h2 className=" bg-slate-500 border rounded text-white p-4 m-6">
									Error Logs:
								</h2>
								<div className="p-4 m-6 flex flex-col justify-center items-center">
									<pre className="p-4 border rounded text-white bg-black overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														User Email
													</th>

													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Message
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
														Time
													</th>
												</tr>
											</thead>
											<tbody className="bg-white text-black divide-y divide-gray-200">
												{errorLogs.map((log, index) => {
													try {
														const parsedLog = JSON.parse(log.line);
														return (
															<tr key={index}>
																<td className="px-6 py-4 text-xs text-left whitespace-nowrap">
																	{parsedLog.useremail}
																</td>
																<td className="px-6 py-4 text-xs text-left whitespace-nowrap ">
																	{parsedLog.msg}
																</td>
																<td className="px-6 py-4 text-xs text-left whitespace-nowrap">
																	{new Date(parsedLog.time).toLocaleString()}
																</td>
															</tr>
														);
													} catch (error) {
														console.error(`Error parsing log line: ${log.line}`, error);
														return null;
													}
												})}
											</tbody>
										</table>
									</pre>
								</div>
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default AdminLogs;
