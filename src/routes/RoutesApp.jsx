import React from 'react';
import AuthLayout from '../layout/AuthLayout';
import ProjectLayaout from '../layout/ProjectLayaout';
import ForgotPassword from '../pages/ForgotPassword';
import NewPassword from '../pages/NewPassword';
import SignUp from '../pages/SignUp';
import ConfirmAccount from '../pages/ConfirmAccount';
import App from '../App';
import useAuth from '../hooks/useAuth';
import Projects from '../pages/Projects';
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useLocation,
} from 'react-router-dom';
import Project from '../pages/Project';
import Cookies from 'universal-cookie';

export default function RoutesApp() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={
						<IsLoggedIn>
							<AuthLayout />
						</IsLoggedIn>
					}
				>
					<Route index element={<App />} />
					<Route path='/sign-up' element={<SignUp />} />
					<Route path='/forgot-password' element={<ForgotPassword />} />
					<Route path='/forgot-password/:token' element={<NewPassword />} />
					<Route path='/confirm/:token' element={<ConfirmAccount />} />
				</Route>

				<Route
					path='/projects'
					element={
						<RequireAuth>
							<ProjectLayaout />
						</RequireAuth>
					}
				>
					<Route index element={<Projects />} />
					<Route path=':id' element={<Project />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

function RequireAuth({ children }) {
	const { auth } = useAuth();
	const location = useLocation();
	const cookie = new Cookies();
	let accessToken = false;
	try {
		const { token } = cookie.get('access-token');
		accessToken = true;
	} catch (error) {
		accessToken = false;
	}

	if (!auth._id || !accessToken) {
		return (
			<>
				<Navigate to='/' state={{ from: location }} replace />
			</>
		);
	}

	return children;
}

function IsLoggedIn({ children }) {
	const { auth } = useAuth();
	const location = useLocation();
	const cookie = new Cookies();

	let accessToken = false;
	try {
		const { token } = cookie.get('access-token');
		accessToken = true;
	} catch (error) {
		accessToken = false;
	}

	if (auth._id && accessToken) {
		return (
			<>
				<Navigate to='/projects' state={{ from: location }} replace />
			</>
		);
	}
	return children;
}
