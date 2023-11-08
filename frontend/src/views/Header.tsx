import React, {useContext, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import logo from '../assets/images/metropolia_s_oranssi_en.png';
import {UserContext} from '../contexts/UserContext';
import apiHooks from '../hooks/ApiHooks';
interface HeaderProps {
	title: string;
}
const Header: React.FC<HeaderProps> = ({title}) => {
	const navigate = useNavigate();
	const location = useLocation();

	const {user, setUser} = useContext(UserContext);
	// console.log('Header', userContext);
	// const userType = userContext.user?.userType;
	const userType = 'teacher';
	// console.log('Header', userType);
	const handleNavigate = () => {
		navigate(`/${userType}/mainview`);
	};
	const getUserInfo = async () => {
		if (location.pathname === '/logout') return;
		const userToken = localStorage.getItem('userToken');
		if (userToken) {
			try {
				const user = await apiHooks.getUserInfoByToken(userToken);
				console.log(user, 'userinfomaan');
				if (user) {
					setUser(user);
					return;
				}
			} catch (error) {
				setAlert('Your session has expired, please login again.');
				console.log('TOKEN ERROR');
				localStorage.removeItem('userToken');
				setUser('');
			}
		}
	};
	useEffect(() => {
		getUserInfo();
	}, [location]); // jos taulukko tyhjä, ajetaan vain kerran
	return (
		<header className="flex items-center sm:p-4 p-0 m-4 justify-between">
			<a href="/">
				<img
					src={logo}
					alt="Logo"
					className="w-24 sm:w-32 md:w-48 lg:w-64 h-auto mr-4"
				/>
			</a>
			<div className="flex items-center m-2 p-2">
				{user && (
					<button
						className="mx-2 px-2 w-full bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
						onClick={() => navigate(`/${user.role.toLowerCase()}/profile`)}
					>
						{user.username}
					</button>
				)}
				<button
					onClick={handleNavigate}
					className="mx-2 px-2 w-full bg-metropoliaMainOrange text-white font-bold rounded hover:bg-metropoliaSecondaryOrange focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
				>
					Main View
				</button>
				<h1 className="text-xs mx-2 px-2 sm:text-sm md:text-lg lg:text-xl">
					{title}
				</h1>
			</div>
		</header>
	);
};

export default Header;
