import PropTypes from 'prop-types';
import React, {Dispatch, SetStateAction, createContext, useState} from 'react';

interface User {
	role: string;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	group_name?: string; // Studentgroup name
	created_at: string;
	userid: number;
	studentnumber?: number;
	gdpr?: number;

	// add other properties as needed
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
/**
 * UserContext is a React context that provides and manages user data throughout the application.
 * It includes the current user and functions to update the user and the update state.
 *
 * @type {React.Context<UserContextProps>}
 */
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
