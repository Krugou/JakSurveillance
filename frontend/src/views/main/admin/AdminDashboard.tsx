import React from 'react';
import {Link, Route, Routes, useLocation} from 'react-router-dom';
import AdminErrorLogs from './AdminErrorLogs';
import AdminFeedback from './AdminFeedback';
import AdminGuide from './AdminGuide';
import AdminLogs from './AdminLogs';
import AdminStats from './AdminStats';

const AdminDashboard = () => {
	const location = useLocation();

	return (
		<div className="flex flex-col bg-slate-100 p-2 w-full rounded-lg shadow-md">
			<h2 className="text-2xl font-bold text-center m-2 p-2 text-metropolia">
				Server Dashboard
			</h2>
			<div className="flex flex-col md:flex-row">
				<div className="p-2 bg-metropoliaSupportWhite w-full md:w-64 border border-metropoliaMainGrey rounded-lg shadow-md ">
					<ul className="space-y-4">
						<li className="transition-colors duration-200 hover:bg-metropoliaMainGrey hover:text-metropoliaSupportWhite">
							<Link
								to="./"
								className={`block py-2 px-4 ${
									location.pathname === '/admin/dashboard/'
										? 'bg-metropoliaMainGrey text-metropoliaSupportWhite'
										: 'text-metropoliaMainGrey'
								}`}
							>
								Guide
							</Link>
						</li>
						<li className="transition-colors duration-200 hover:bg-metropoliaMainGrey hover:text-metropoliaSupportWhite">
							<Link
								to="./stats"
								className={`block py-2 px-4 ${
									location.pathname === '/admin/dashboard/stats'
										? 'bg-metropoliaMainGrey text-metropoliaSupportWhite'
										: 'text-metropoliaMainGrey'
								}`}
							>
								Statistics
							</Link>
						</li>

						<li className="transition-colors duration-200 hover:bg-metropoliaMainGrey hover:text-metropoliaSupportWhite">
							<Link
								to="./logs"
								className={`block py-2 px-4 ${
									location.pathname === '/admin/dashboard/logs'
										? 'bg-metropoliaMainGrey text-metropoliaSupportWhite'
										: 'text-metropoliaMainGrey'
								}`}
							>
								Logs
							</Link>
						</li>
						<li className="transition-colors duration-200 hover:bg-metropoliaMainGrey hover:text-metropoliaSupportWhite">
							<Link
								to="errorlogs"
								className={`block py-2 px-4 ${
									location.pathname === '/admin/dashboard/errorlogs'
										? 'bg-metropoliaMainGrey text-metropoliaSupportWhite'
										: 'text-metropoliaMainGrey'
								}`}
							>
								Error Logs
							</Link>
						</li>
						<li className="transition-colors duration-200 hover:bg-metropoliaMainGrey hover:text-metropoliaSupportWhite">
							<Link
								to="./user-feedback"
								className={`block py-2 px-4 ${
									location.pathname === '/admin/dashboard/user-feedback'
										? 'bg-metropoliaMainGrey text-metropoliaSupportWhite'
										: 'text-metropoliaMainGrey'
								}`}
							>
								User Feedback
							</Link>
						</li>
					</ul>
				</div>
				<div className="flex-grow  p-2  shadow-md">
					<Routes>
						<Route path="/" element={<AdminGuide />} />

						<Route path="stats" element={<AdminStats />} />
						<Route path="logs" element={<AdminLogs />} />
						<Route path="user-feedback" element={<AdminFeedback />} />
						<Route path="errorlogs" element={<AdminErrorLogs />} />
					</Routes>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
