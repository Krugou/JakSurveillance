import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import apiHooks from '../../../hooks/ApiHooks';

const AdminErrorLogs = () => {
	const [lineLimit, setLineLimit] = useState(100);
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
				let errorLogsResult = await apiHooks.fetchErrorLogs(token, lineLimit);

				if (!Array.isArray(errorLogsResult)) {
					toast.error('Expected an array from fetchLogs and fetchErrorLogs');
					setIsLoading(false);
					return;
				}

				errorLogsResult = errorLogsResult.filter(log => log.line.trim() !== '');

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
		<div className="p-4 m-1 w-full bg-white">
			{isLoading ? (
				<div className="flex justify-center items-center">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
				</div>
			) : (
				<div className="flex flex-col justify-center ">
					<h1 className="text-2xl font-bold text-center mb-4">Admin Error Logs</h1>
					<div className="p-2 bg-metropoliaSupportWhite w-full     mb-4 md:mb-0 flex flex-col justify-center items-center">
						<div className="flex justify-center items-center">
							<button
								onClick={handleShowMore}
								className={`m-4 font-bold py-2 px-4 rounded ${
									lineLimit >= 500
										? 'bg-gray-500 cursor-not-allowed'
										: 'bg-blue-500 hover:bg-blue-700 text-white'
								}`}
								disabled={lineLimit >= 5000}
							>
								Show older Error logs
							</button>
							<button
								onClick={handleReset}
								className="m-2 bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded"
							>
								Reset/Reload
							</button>
						</div>
					</div>
					<div className="flex-grow border border-metropoliaMainGrey p-6 rounded-lg shadow-md">
						{errorLogs.length === 0 ? (
							<p>No error logs found</p>
						) : (
							<>
								<h2 className=" p-4 text-white border rounded bg-slate-500 m-6">
									Error Logs:
								</h2>

								<div className="p-4 m-6 flex flex-col justify-center items-center">
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-6 py-3 text-left text-xs sm:text-sm md:text-base font-medium text-gray-500 uppercase tracking-wider">
														User Email
													</th>

													<th className="px-6 py-3 text-left text-xs sm:text-sm md:text-base font-medium text-gray-500 uppercase tracking-wider">
														Message
													</th>
													<th className="px-6 py-3 text-left text-xs sm:text-sm md:text-base font-medium text-gray-500 uppercase tracking-wider">
														Time
													</th>
												</tr>
											</thead>
											<tbody className="bg-white text-black divide-y divide-gray-200 overflow-auto h-64">
												{errorLogs.map((log, index) => {
													try {
														const parsedLog = JSON.parse(log.line);
														return (
															<tr key={index}>
																<td className="px-6 py-4 text-xs sm:text-sm md:text-base text-left whitespace-nowrap">
																	{parsedLog.useremail}
																</td>
																<td className="px-6 py-4 text-xs sm:text-sm md:text-base text-left whitespace-nowrap overflow-hidden text-overflow-ellipsis ">
																	{parsedLog.msg}
																</td>
																<td className="px-6 py-4 text-xs sm:text-sm md:text-base text-left whitespace-nowrap">
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
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminErrorLogs;
