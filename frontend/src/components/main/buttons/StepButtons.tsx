import React from 'react';

interface StepButtonsProps {
    currentStep: number;
    onPrevClick: () => void;
    onNextClick: () => void;
    onSubmitClick: () => void;
}


const StepButtons: React.FC<StepButtonsProps> = ({ currentStep, onPrevClick, onNextClick, onSubmitClick }) => {
    return (
        <div className={`flex items-center ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
            {currentStep > 1 && (
                <button
                    type="button"
                    onClick={onPrevClick}
                    className="w-40 p-2 h-fit mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
                >
                    Previous
                </button>
            )}
            {currentStep >= 1 && currentStep <= 3 && (
                <button
                    type="button"
                    className="w-40 h-fit p-2 mt-2 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
                    onClick={onNextClick}
                >
                    Next
                </button>
            )}
            {currentStep === 4 && (
                <button
                    type="submit"
                    className="w-40 h-fit p-2 mt-5 bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
                    onClick={onSubmitClick}
                >
                    Create Course
                </button>
            )}
        </div>
    );
};

export default StepButtons;


