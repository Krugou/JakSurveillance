import {Box, LinearProgress, Typography} from '@mui/material';
import React from 'react';

interface ProgressProps {
	currentStep: number;
	createCourseMode: string;
}

const CreateCourseProgress: React.FC<ProgressProps> = ({
	currentStep,
	createCourseMode,
}) => {
	const totalSteps = createCourseMode === 'easy' ? 5 : 4;
	const progressPercentage = (currentStep / totalSteps) * 100;
	const getStepName = () => {
		if (createCourseMode === 'easy') {
			switch (currentStep) {
				case 1:
					return 'Insert Course Students Data File';
				case 2:
					return 'Course Details';
				case 3:
					return 'Student List';
				case 4:
					return 'Add Teachers';
				case 5:
					return 'Topic Group and Topics Selector';
				default:
					return '';
			}
		} else {
			// custom mode
			switch (currentStep) {
				case 1:
					return 'Course Details';
				case 2:
					return 'Student List';
				case 3:
					return 'Add Teachers';
				case 4:
					return 'Topic Group and Topics Selector';
				default:
					return '';
			}
		}
	};
	return (
		<>
			<div className="relative w-full h-4 mb-6  bg-gray-200 rounded-full">
				{[...Array(totalSteps)].map((_, step) => (
					<div
						key={step}
						className={`absolute top-0 h-4 w-1/5 rounded-full ${
							step < currentStep ? 'bg-metropoliaMainOrange' : 'bg-gray-200'
						}`}
						style={{left: `${(step / totalSteps) * 100}%`}}
					>
						<div
							className={`absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded text-xs leading-none px-2 py-1 sm:px-3 sm:py-1.5 ${
								step === currentStep - 1 ? 'block' : 'hidden'
							}`}
							style={{left: '50%'}}
						>
							{step + 1}
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default CreateCourseProgress;
