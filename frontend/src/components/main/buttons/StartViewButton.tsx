import React from 'react';
import { useNavigate } from 'react-router-dom';

interface StartViewButtonProps {
    role: string;
}

const StartViewButton: React.FC<StartViewButtonProps> = ({ role }) => {
    const navigate = useNavigate();

    return (
        <button
            className="bg-metropoliaMainOrange hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 sm:py-3 md:py-4 lg:py-5 px-4 sm:px-6 md:px-8 lg:px-10 m-4 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={() => navigate(`/${role.toLowerCase()}/login`)}
        >
            {role}
        </button>
    );
};

export default StartViewButton;
