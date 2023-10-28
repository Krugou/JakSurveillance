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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate(path)}
        >
            {text}
        </button>
    );
};

export default MainViewButton;