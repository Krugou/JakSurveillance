import React from 'react';

const MainViewTitle = ({role}) => {
	return (
		<h1 className="text-2xl md:text-4xl text-center font-bold text-metropoliaSupportBlack mb-5 mt-5">
			{role} Dashboard
		</h1>
	);
};

export default MainViewTitle;
