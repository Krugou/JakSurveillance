
import React from 'react';
import logo from '../assets/images/metropolia_s_oranssi_en.png';


interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="flex items-center p-4 m-4 justify-between">
            <a href="/">
                <img src={logo} alt="Logo" className="w-24 sm:w-32 md:w-48 lg:w-64 h-auto mr-4" />
            </a>
            <h1 className="text-xs sm:text-sm md:text-lg lg:text-xl ">{title}</h1>
        </header>
    );
};

export default Header;
