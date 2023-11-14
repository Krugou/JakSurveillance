import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ErrorAlert from '../../components/main/ErrorAlert.tsx';
import {UserContext} from '../../contexts/UserContext.tsx';
import apiHooks from '../../hooks/ApiHooks.ts';
import BackgroundContainer from "../../components/main/background/background";

const Login: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [alert, setAlert] = useState<string | null>('');
	const {setUser} = useContext(UserContext);
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		//console.log(username, password, user);
		const inputs = {username, password};

		try {
			const response = await apiHooks.postLogin(inputs);
			// this navigates to the mainview of the user type
			if (response) {
				localStorage.setItem('userToken', response.token); // set the token
				setUser(response.user); // set the user info into the context
				navigate(`/${response.user.role.toLowerCase()}/mainview`);
			}
			console.log(response, 'LOGIN RESPONSE');
		} catch (error) {
			if (error instanceof Error) {
				// Now TypeScript knows that 'error' is an instance of Error
				console.log(error.message);
				setAlert(error.message);
			} else {
				// 'error' could be anything else
				console.log(error);
			}
		}

		//console.log('🚀 ~ file: App.tsx:41 ~ App ~ inputs:', inputs);
	};

	return (
		<BackgroundContainer>
			<h2 className="text-gray-800 font-semibold text-md sm:text-2xl">
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
						value={username}
						placeholder="Metropolia username"
						onChange={e => setUsername(e.target.value)}
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
						value={password}
						placeholder="Metropolia password"
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<div className="flex w-full justify-center">
					<button
						className="bg-metropoliaMainOrange w-1/2 hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 rounded-xl px-4 focus:outline-none focus:shadow-outline"
						type="button"
						onClick={handleSubmit}
					>
						Sign In
					</button>
				</div>
			</form>
		</BackgroundContainer>
	);
};

export default Login;
