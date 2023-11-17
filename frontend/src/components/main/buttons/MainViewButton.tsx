import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MainViewButtonProps {
    path: string;
    text: string;
}

const MainViewButton: React.FC<MainViewButtonProps> = ({ path, text }) => {
    const navigate = useNavigate();
    return (
        <button
            className="bg-metropoliaMainOrange hover:hover:bg-metropoliaSecondaryOrange text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate(path)}
        >
            {text}
        </button>
    );
};

export default MainViewButton;
