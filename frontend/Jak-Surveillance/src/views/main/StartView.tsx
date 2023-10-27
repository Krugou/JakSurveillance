import React from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/JakSec.png';

const StartView = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center ">
            <img src={logo} alt="logo" className="w-auto h-60  mb-8" />
            <div className="flex flex-col items-center m-4 p-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 md:py-4 lg:py-5 px-4 sm:px-6 md:px-8 lg:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl mb-4"
                    onClick={() => navigate('/student-login')}
                >
                    Student
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 md:py-4 lg:py-5 px-4 sm:px-6 md:px-8 lg:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl"
                    onClick={() => navigate('/teacher-login')}
                >
                    Teacher
                </button>
            </div>
        </div>
    );
};

export default StartView;