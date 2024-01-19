import DangerousIcon from '@mui/icons-material/Dangerous';
import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import ErrorAlert from '../../components/main/ErrorAlert.tsx';
import {UserContext} from '../../contexts/UserContext.tsx';
import apiHooks, {baseUrl} from '../../hooks/ApiHooks.ts';
/**
 * Login component.
 * This component is responsible for rendering the login form and handling the login process.
 * It uses the UserContext to set the user after a successful login.
 */
interface ServerResponse {
	builddate: string;
}
const Login: React.FC = () => {
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [alert, setAlert] = useState<string | null>('');
	const [isServerOnline, setIsServerOnline] = useState(false);
	const [newestVersion, setNewestVersion] = useState(false);
	const [loading, setLoading] = useState(true);
	const {setUser} = useContext(UserContext);
	const navigate = useNavigate();
	useEffect(() => {
		fetch(baseUrl + 'metrostation/')
			.then(response => response.json() as Promise<ServerResponse>)
			.then(data => {
				const builddate = data.builddate;
				if (builddate === import.meta.env.VITE_REACT_APP_BUILD_DATE) {
					setNewestVersion(true);
				}
				setIsServerOnline(true);
			})
			.catch(() => {
				setIsServerOnline(false);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	/**
	 * Handles the form submission.
	 * It sends a POST request to the login endpoint with the username and password,
	 * and handles the response or any errors that occur.
	 *
	 * @param {React.FormEvent} event - The form event.
	 */
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const inputs = {
			username: usernameRef.current?.value || '',
			password: passwordRef.current?.value || '',
		};
		try {
			const response = await apiHooks.postLogin(inputs);
			console.log(
				'🚀 ~ file: Login.tsx:26 ~ handleSubmit ~ response:',
				response.user,
			);
			// this navigates to the mainview of the user type
			if (response) {
				localStorage.setItem('userToken', response.token);
				setUser(response.user); // set the user info into the context
				if (
					response.user.gdpr === 0 &&
					response.user.role.toLowerCase() === 'student'
				) {
					navigate(`/gdpr`);
				} else {
					navigate(`/${response.user.role.toLowerCase()}/mainview`);
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === '403') {
					setAlert('No Metropolia internal network connection');
				} else {
					setAlert(error.message);
				}
			} else {
				toast.error('Error logging in');
				console.log(error);
			}
		}
	};

	return (
		<div className="w-full">
			<h2 className="text-gray-800 text-center font-semibold mb-6 text-md sm:text-2xl">
				Sign in using your Metropolia Account
			</h2>
			{alert && <ErrorAlert onClose={() => setAlert(null)} alert={alert} />}
			<form
				onSubmit={handleSubmit}
				className="bg-white md:w-2/4 xl:w-1/4 w-full sm:w-2/3 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 mx-auto"
			>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm sm:text-lg font-bold mb-2"
						htmlFor="username"
					>
						Username
					</label>
					<input
						className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="username"
						type="text"
						ref={usernameRef}
						placeholder="Metropolia username"
						aria-label="Metropolia username"
						autoCapitalize="none"
					/>
				</div>
				<div className="mb-6">
					<label
						className="block text-gray-700 text-sm sm:text-lg font-bold mb-2"
						htmlFor="password"
					>
						Password
					</label>
					<input
						className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						id="password"
						type="password"
						ref={passwordRef}
						aria-label="Metropolia password"
						placeholder="Metropolia password"
					/>
				</div>
				<div className="flex w-full justify-center">
					<button
						className="bg-metropoliaMainOrange w-1/2 hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 rounded-xl px-4 focus:outline-none focus:shadow-outline"
						onClick={handleSubmit}
						type="submit"
						aria-label="Sign In"
					>
						Sign In
					</button>
				</div>
			</form>
			<div className="flex flex-col items-center justify-center">
				{loading === true ? (
					<CircularProgress />
				) : import.meta.env.MODE === 'development' ? (
					<>
						<p className="bg-white m-2 p-2 rounded-xl">
							{' '}
							{isServerOnline ? <DoneIcon /> : <DangerousIcon />}{' '}
						</p>
					</>
				) : (
					<>
						<p className="animate-bounce font-medium text-xl ">
							{isServerOnline
								? ''
								: 'You are not connected to Metropolia internal network'}
						</p>
						{isServerOnline && (
							<div className="bg-white m-2 p-2 rounded-xl">
								<p className="m-2 p-2">
									Version: {newestVersion ? <DoneIcon /> : <DangerousIcon />}
								</p>
								<p className="m-2 p-2">
									Server Connection: {isServerOnline ? <DoneIcon /> : <DangerousIcon />}
								</p>
							</div>
						)}
						{!newestVersion && isServerOnline && (
							<p className="bg-white m-2 p-2 rounded-xl">
								<strong>Please reload the page until this text disappears</strong>
							</p>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Login;
