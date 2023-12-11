import React from 'react';
import StepButton from '../../buttons/StepButton';
/**
 * StepButtons component properties
 */
interface StepButtonsProps {
	currentStep: number;
	onPrevClick: () => void;
	onNextClick: () => void;
	onSubmitClick: () => void;
	extrastep?: boolean;
}
/**
 * StepButtons is a functional component that renders a set of buttons for navigation in a multi-step process.
 * It renders a "Previous" button if the current step is greater than 1.
 * It renders a "Next" button if the current step is between 1 and 4 (or 3 if there is no extra step).
 * It renders a "Create Course" button if the current step is the last step (4 or 5 depending on whether there is an extra step).
 *
 * @param props - The properties of the step buttons.
 * @returns A JSX element.
 */
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
