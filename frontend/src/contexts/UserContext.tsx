import React, {createContext, useState, Dispatch, SetStateAction} from 'react';
import PropTypes from 'prop-types';

interface UserContextProps {
	user: string;
	setUser: Dispatch<SetStateAction<string>>;
	update: boolean;
	setUpdate: Dispatch<SetStateAction<boolean>>;
}

interface UserProviderProps {
	children: React.ReactNode;
}

export const UserContext = createContext<UserContextProps>({
	user: '',
	setUser: () => {},
	update: true,
	setUpdate: () => {},
});

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
