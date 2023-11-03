import {createContext, useState} from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
	const [user, setUser] = useState<string>('');
	const [update, setUpdate] = useState<boolean>(true);

	return (
		<UserContext.Provider value={{user, setUser, update, setUpdate}}>
			{children}
		</UserContext.Provider>
	);
};

UserProvider.propTypes = {
	children: PropTypes.node,
};
