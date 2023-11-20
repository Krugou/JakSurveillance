import React, {useContext, useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import logo from '../assets/images/metropolia_s_oranssi_en.png';
import ErrorAlert from '../components/main/ErrorAlert';
import NavigationButton from '../components/main/buttons/NavigationButton';
import {UserContext} from '../contexts/UserContext';
import apiHooks from '../hooks/ApiHooks';

interface HeaderProps {
	title: string;
}
const Header: React.FC<HeaderProps> = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [alert, setAlert] = useState<string | null>('');
	const {user, setUser} = useContext(UserContext);
	// console.log('Header', userContext);
	// const userType = userContext.user?.userType;
	// console.log('Header', userType);

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
				setUser(null); // or setUser({ role: '', username: '' }) for an empty User object
			}
		} else {
			if (location.pathname !== '/' && location.pathname !== '/login') {
				navigate('/login');
			}
		}
	};
	useEffect(() => {
		getUserInfo();
	}, [location]); // jos taulukko tyhjä, ajetaan vain kerran

	return (
		<header
			className={`flex items-center ${
				user ? 'sm:flex-row flex-col' : ''
			} sm:p-4 p-0 m-4 justify-between`}
		>
			{alert && <ErrorAlert onClose={() => setAlert(null)} alert={alert} />}
			<Link to={user ? `/${user.role.toLowerCase()}/mainview` : '/'}>
				<img
					src={logo}
					alt="Logo"
					className={`w-48 mb-5 sm:w-32 md:w-48 lg:w-64 h-auto mr-4 ${
						user ? '' : 'w-24'
					}`}
				/>
			</Link>
			{user && (
				<div className="flex w-full gap-10 justify-center sm:w-fit items-center m-2 p-2">
					<NavigationButton
						user={user}
						path={`/${user.role.toLowerCase()}/profile`}
						label={user.username}
					/>
					<NavigationButton user={user} path="/logout" label="Logout" />
				</div>
			)}
		</header>
	);
};

export default Header;
