import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
    path: string;
    title: string;
    description: string;
}

const Card: React.FC<CardProps> = ({ path, title, description }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(path);
    };

    return (
        <div onClick={handleCardClick} className="card-link m-3 cursor-pointer">
            <div className="relative bg-white p-4 rounded-md shadow-md transition-transform transform hover:scale-105 group w-[15rem] h-[8rem]">
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <div className="hover-bg flex items-center justify-between p-2 absolute bottom-0 left-0 w-full h-1/2 bg-metropoliaMainOrange rounded-b-md opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                    <p className="text-white inline-block">{description}</p>
                    <span className="text-white text-xl ml-1 inline-block">&#8594;</span>
                </div>
            </div>
        </div>
    );
};

export default Card;
