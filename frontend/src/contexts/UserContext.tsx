import PropTypes from 'prop-types';
import React, {Dispatch, SetStateAction, createContext, useState} from 'react';

interface User {
	role: string;
	// add other properties as needed
	username: string;
}

interface UserContextProps {
	user: User | null; // Allow null
	setUser: Dispatch<SetStateAction<User | null>>; // Allow null
	update: boolean;
	setUpdate: Dispatch<SetStateAction<boolean>>;
}

interface UserProviderProps {
	children: React.ReactNode;
}

export const UserContext = createContext<UserContextProps>({
	user: null, // Default value is an empty User object
	setUser: () => {},
	update: true,
	setUpdate: () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
	const [user, setUser] = useState<User | null>(null); // Initialize to null
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
