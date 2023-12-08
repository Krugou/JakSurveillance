import PropTypes from 'prop-types';
import React, {Dispatch, SetStateAction, createContext, useState} from 'react';
/**
 * User interface represents the structure of a user object.
 */
export interface User {
	role: string;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	group_name?: string;
	created_at: string;
	userid: number;
	studentnumber?: number;
	gdpr?: number;
}
/**
 * UserContextProps interface represents the structure of the UserContext.
 */
export interface UserContextProps {
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
	update: boolean;
	setUpdate: Dispatch<SetStateAction<boolean>>;
}
/**
 * UserProviderProps interface represents the structure of the UserProvider props.
 */
export interface UserProviderProps {
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
/**
 * UserProvider is a React component that provides the UserContext to its children.
 *
 * @param {UserProviderProps} props The props that define the children of the UserProvider.
 * @returns {React.FC<UserProviderProps>} A React functional component.
 */
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
