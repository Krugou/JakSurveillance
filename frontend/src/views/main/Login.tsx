import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ErrorAlert from '../../components/main/ErrorAlert.tsx';
import {UserContext} from '../../contexts/UserContext.tsx';
import apiHooks from '../../hooks/ApiHooks.ts';

console.log(UserContext, 'USER CONTEXT');

const Login: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [alert, setAlert] = useState<string | null>('');
	const {setUser, user} = useContext(UserContext);
	const navigate = useNavigate();
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		console.log(username, password, user);
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
			} else {
				// 'error' could be anything else
				console.log(error);
			}
		}

		console.log('🚀 ~ file: App.tsx:41 ~ App ~ inputs:', inputs);
	};

	//const navigate = useNavigate();
	return (
		<div className="flex justify-center items-center h-1/2">
			{alert && <ErrorAlert onClose={() => setAlert(null)} alert={alert} />}
			<div className="md:w-1/2 w-2/3">
				<h1 className="sm:text-2xl text-xl font-bold mb-4 mt-4 sm:mt-0 text-center">
					Login
				</h1>
				<form
					onSubmit={handleSubmit}
					className="bg-white md:w-3/4 xl:w-1/2 w-full shadow-md rounded px-8 pt-6 pb-8 mb-4 mx-auto"
				>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="username"
							type="text"
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							id="password"
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					<div className="flex items-center justify-between">
						{/* <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='submit'
            >
              Sign In
            </button> */}
						<button
							className="bg-metropoliaMainOrange hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="button"
							//  onClick={() => navigate(`/${userType.toLowerCase()}/mainview`)}
							onClick={handleSubmit}
						>
							Sign In
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
