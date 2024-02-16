import React from 'react';

const AdminLogsTable = ({
	logs,
	handleShowMore,
	handleReset,
	lineLimit,
	logType,
}) => {
	return (
		<div className="flex flex-col justify-center px-4 md:px-0">
			<h1 className="text-2xl font-bold text-center mb-4">
				Admin {logType === 'error' ? 'Error Logs' : 'Logs'}
			</h1>
			<div className="p-2 bg-metropoliaSupportWhite w-full mb-4 md:mb-0 flex flex-col justify-center items-center">
				<div className="flex flex-col md:flex-row justify-center items-center">
					<button
						onClick={handleShowMore}
						className={`m-4 font-bold py-2 px-4 rounded ${
							lineLimit >= 500
								? 'bg-gray-500 cursor-not-allowed'
								: 'bg-blue-500 hover:bg-blue-700 text-white'
						}`}
						disabled={lineLimit >= 5000}
					>
						Show older {logType === 'error' ? 'error logs' : 'Logs:'}
					</button>
					<button
						onClick={handleReset}
						className="m-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
					>
						Reset/Reload
					</button>
				</div>
			</div>
			<div className="flex-grow border border-metropoliaMainGrey p-6 rounded-lg shadow-md">
				{logs.length === 0 ? (
					<p>no {logType === 'error' ? 'Error Logs' : 'Logs:'} found.</p>
				) : (
					<>
						<h2 className=" p-4 text-white border rounded bg-slate-500 m-6">
							{logType === 'error' ? 'Error Logs:' : 'Logs:'}
						</h2>

						<div className="p-4 m-6 flex flex-col justify-center items-center">
							<div className="overflow-x-auto ">
								<div className="divide-y divide-gray-200 overflow-auto h-1/2">
									{logs.map((log, index) => {
										try {
											const parsedLog = JSON.parse(log.line);
											return (
												<div
													key={index}
													className="bg-white text-black p-4 flex flex-col justify-between"
												>
													<div
														className={`flex ${
															parsedLog.useremail ? 'justify-between' : 'justify-end'
														}`}
													>
														{parsedLog.useremail && (
															<div className="font-medium mx-2 text-gray-500 uppercase tracking-wider mb-2 text-sm">
																User Email: {parsedLog.useremail}
															</div>
														)}
														<div className="text-sm mx-2 text-right whitespace-nowrap">
															Time: {new Date(parsedLog.time).toLocaleString()}
														</div>
													</div>
													<div className="border rounded-lg p-1 md:p-2 lg:p-4 text-xs sm:text-sm md:text-base text-left overflow-hidden text-overflow-ellipsis max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
														Message: {parsedLog.msg}
													</div>
												</div>
											);
										} catch (error) {
											console.error(`Error parsing log line: ${log.line}`, error);
											return null;
										}
									})}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AdminLogsTable;
