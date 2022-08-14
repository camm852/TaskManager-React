import React from 'react';
import clientAxios from '../config/clientAxios';
import Cookies from 'universal-cookie';
import { pick } from 'lodash';

const AuthContext = React.createContext();

const currentUser = (cookie) => {
	const user = localStorage.getItem('user');
	const { token } = cookie.get('access-token') ?? '';
	return user && token ? JSON.parse(user) : {};
};

export function AuthProvider({ children }) {
	const cookie = new Cookies();
	const [auth, setAuth] = React.useState(currentUser(cookie));

	React.useEffect(() => {
		const authUser = async () => {
			const { token } = cookie.get('access-token') || '';
			if (!token) {
				return;
			}

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				const { data } = await clientAxios('/users/profile', config);
				localStorage.setItem(
					'user',
					JSON.stringify(pick(data.user, ['_id', 'name', 'email']))
				);
				setAuth(pick(data.user, ['_id', 'email', 'name']));
			} catch (error) {
				console.log(error);
			}
		};
		if (!auth._id) {
			authUser();
		}
	}, []);

	const logOut = () => {
		setTimeout(() => {
			localStorage.clear();
			cookie.remove('access-token');
			window.location.reload(false);
		}, [500]);
	};

	return (
		<AuthContext.Provider
			value={{
				auth,
				setAuth,
				logOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthContext;
