import React from 'react';
import StepButton from '../../buttons/StepButton';

interface StepButtonsProps {
	currentStep: number;
	onPrevClick: () => void;
	onNextClick: () => void;
	onSubmitClick: () => void;
	extrastep?: boolean;
}

const StepButtons: React.FC<StepButtonsProps> = ({
	currentStep,
	onPrevClick,
	onNextClick,
	onSubmitClick,
	extrastep = false,
}) => {
	return (
		<div
			className={`flex items-center ${
				currentStep === 1 ? 'justify-end' : 'justify-between'
			}`}
		>
			{currentStep > 1 && (
				<StepButton text="Previous" type="button" onClick={onPrevClick} />
			)}
			{currentStep >= 1 && currentStep <= (extrastep ? 4 : 3) && (
				<StepButton text="Next" type="button" onClick={onNextClick} />
			)}
			{currentStep === (extrastep ? 5 : 4) && (
				<StepButton
					text="Create Course"
					type="submit"
					onClick={onSubmitClick}
					marginTop="mt-2"
				/>
			)}
		</div>
	);
};

export default StepButtons;
