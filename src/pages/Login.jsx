import React from 'react';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner/Spinner';
import useAuth from '../hooks/useAuth.jsx';
import Cookies from 'universal-cookie';
import clientAxios from '../config/clientAxios';
import logo from "../TM.png"
import { pick } from 'lodash';
import { Link } from 'react-router-dom';

export default function Login() {
	const [userForm, setUserForm] = React.useState({
		email: '',
		password: '',
	});
	const [alert, setAlert] = React.useState({
		msg: '',
		error: false,
	});
	const [error, setError] = React.useState({
		blank: '',
	});
	const [spinner, setSpinner] = React.useState(false);
	const { setAuth } = useAuth();
	const cookie = new Cookies();

	const validateForm = () => {
		const newError = {
			blank: '',
		};
		if ([userForm.email, userForm.password].includes('')) {
			newError.blank = "Must don't have empty fields";
		}

		if (newError.blank === '') {
			setError({
				blank: '',
			});
			return true;
		} else {
			setError({ ...newError, error: true });
			return false;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validate = validateForm();
		if (validate) {
			setSpinner(true);
			try {
				const response = await clientAxios.post(`/users/login`, userForm);
				setAlert({
					msg: '',
					error: false,
				});
				cookie.set('access-token', pick(response.data, ['token']), {
					path: '/',
				});
				localStorage.setItem(
					'user',
					JSON.stringify(pick(response.data, ['_id', 'name', 'email']))
				);
				setTimeout(() => {
					setAuth(pick(response.data, ['_id', 'name', 'email']));
					setSpinner(false);
				}, 2000);
			} catch (error) {
				console.log(error)
				setSpinner(false);
				setAlert({ msg: error.response.data.msg, error: true });
			}
		}
	};

	const handleChangeForm = (e) => {
		setUserForm({
			...userForm,
			[e.target.name]: e.target.value,
		});
	};
	return (
		<>
			<img src={logo} alt="logo" className='w-1/2 m-auto' />
			<form className='my-8 px-10 py-3' onSubmit={handleSubmit}>
				<div className='py-2'>
					{error.blank ? (
						<Alert error={true}>{error.blank}</Alert>
					) : alert.msg ? (
						<Alert error={alert.error}>{alert.msg}</Alert>
					) : null}
				</div>
				<div>
					<div className='text-sm font-bold text-gray-700 tracking-wide'>
						Email Address
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
						type='text'
						placeholder='example@gmail.com'
						name='email'
						onChange={handleChangeForm}
					/>
				</div>
				<div className='mt-8'>
					<div className='flex justify-between items-center'>
						<div className='text-sm font-bold text-gray-700 tracking-wide'>
							Password
						</div>
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
						type='password'
						placeholder='Enter your password'
						name='password'
						onChange={handleChangeForm}
					/>
				</div>
				<div className='mt-10'>
					<button
						className='bg-sky-600 text-gray-100 p-3 w-full rounded-md tracking-wide
												font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-sky-700
												shadow-lg transition-colors duration-500 ease-out'
					>
						{!spinner ? <p>Log In</p> : <Spinner small={true} />}
					</button>
				</div>
			</form>
			<nav className='lg:flex lg:justify-between px-10 capitalize '>
				<Link
					to='sign-up'
					className='block text-center -mt-6 lg:-mt-10 text-slate-500 hover:text-slate-600 text-sm'
				>
					Do you not have an account? Sign Up
				</Link>
				<Link
					to='forgot-password'
					className='block text-center  -mt-10 lg:-mt-10  text-slate-500 hover:text-slate-600  text-sm'
				>
					Forgot password?
				</Link>
			</nav>
		</>
	);
}
