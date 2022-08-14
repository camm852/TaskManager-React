import React from 'react';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner/Spinner';
import clientAxios from '../config/clientAxios';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
	const [userForm, setUserForm] = React.useState({
		fullName: '',
		email: '',
		password: '',
		repeatPassword: '',
	});

	const [error, setError] = React.useState({
		blank: '',
		name: '',
		password: '',
		matchPassword: '',
		email: '',
	});
	const [spinner, setSpinner] = React.useState(false);
	const [alert, setAlert] = React.useState({
		msg: '',
		error: false,
	});
	const navigate = useNavigate();

	const validateForm = () => {
		const newError = {
			blank: '',
			name: '',
			password: '',
			matchPassword: '',
			email: '',
		};
		if (![userForm.fullName, userForm.email, userForm.password].includes('')) {
			if (userForm.password !== userForm.repeatPassword) {
				newError.matchPassword = "Passwords don't match";
			} else {
				newError.matchPassword = '';
				if (userForm.password.length < 6) {
					newError.password = 'Between 6-15 characteres';
				} else {
					const expression = /[A-Z]/;
					if (!expression.test(userForm.password)) {
						newError.password = 'Must contain an uppercase';
					} else {
						const expression = /\W/;
						if (expression.test(userForm.password)) {
							newError.password = 'Only alphabets';
						}
					}
				}
			}
			if (userForm.fullName.length < 6) {
				newError.name = 'Between 6-20 characters';
			} else {
				const expression = /[^a-zA-Z\s\u00f1\u00d1]/;
				if (expression.test(userForm.fullName)) {
					newError.name = 'Only alphabets';
				}
			}
			if (!userForm.email.includes('@')) {
				newError.email = 'Enter a valid email';
			} else {
				//email = example@hotmail.com
				const address = userForm.email.split('@')[1]; // [hotmail.com]
				if (
					[
						'gmail.com',
						'hotmail.com',
						'outlook.com',
						'unillanos.edu.co',
					].indexOf(address) < 0
				) {
					newError.email = 'gmail, hotmail, unillanos, outlook';
				}
			}
		} else {
			newError.blank = "Must don't have empty fields";
		}

		if (
			newError.blank === '' &&
			newError.email === '' &&
			newError.password === '' &&
			newError.matchPassword === '' &&
			newError.name === ''
		) {
			setError({
				blank: '',
				name: '',
				password: '',
				matchPassword: '',
				email: '',
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
			const jsonBody = {
				name: userForm.fullName,
				email: userForm.email,
				password: userForm.password,
			};
			try {
				const response = await clientAxios.post(`users`, jsonBody);
				const { data } = response;
				setError('');
				setAlert({ ...alert, msg: data.msg });
				setTimeout(() => {
					navigate('/');
				}, 3000);
			} catch (error) {
				const msg = error.response.data;
				setSpinner(false);
				setAlert({ msg: msg.msg, error: true });
				return;
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
			<h1 className='text-sky-600 font-black text-5xl text-center capitalize'>
				Sign-Up <br />
				<span className='text-slate-700 text-6xl block py-2'>Task Manager</span>
			</h1>

			<form className='my-8 px-10 py-5' onSubmit={handleSubmit}>
				{error.blank ? (
					<Alert>{error.blank}</Alert>
				) : alert.msg ? (
					<Alert error={alert.error}>{alert.msg}</Alert>
				) : null}
				<div>
					<div className='text-sm font-bold text-gray-700 tracking-wide '>
						Full Name
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
						type='text'
						placeholder='Pepito Perez Plazas'
						name='fullName'
						onChange={handleChangeForm}
					/>
					{error.name && <Alert error={error.error}>{error.name}</Alert>}
				</div>
				<div>
					<div className='text-sm font-bold text-gray-700 tracking-wide mt-5'>
						Email Address
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
						type='text'
						placeholder='example@gmail.com'
						name='email'
						onChange={handleChangeForm}
					/>
					{error.email && <Alert error={error.error}>{error.email}</Alert>}
				</div>
				<div className='mt-5 md:block xl:flex '>
					<div className='xl:mr-1'>
						<div className='flex justify-between items-center xl:mt-0 mt-5'>
							<div className='text-sm font-bold text-gray-700 tracking-wide'>
								Password
							</div>
						</div>
						<input
							className='w-full  text-lg  text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
							type='password'
							placeholder='Enter your password'
							name='password'
							onChange={handleChangeForm}
						/>
					</div>
					<div>
						<div className='flex justify-between items-center xl:mt-0 mt-5'>
							<div className='text-sm font-bold text-gray-700 tracking-wide'>
								Repeat Password
							</div>
						</div>
						<input
							className='w-full  lg:mt-0 text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
							type='password'
							placeholder='Repeat password'
							name='repeatPassword'
							onChange={handleChangeForm}
						/>
					</div>
				</div>
				{(error.password || error.matchPassword) && (
					<Alert error={error.error}>
						{error.matchPassword ? error.matchPassword : error.password}
					</Alert>
				)}
				<div className='mt-8'>
					<button
						className='bg-sky-600 text-gray-100 p-3 w-full rounded-md tracking-wide
												font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-sky-700
												shadow-lg transition-colors duration-500 ease-out'
					>
						{!spinner ? 'Sign Up' : <Spinner small={true} />}
					</button>
				</div>
			</form>
			<nav className='lg:flex lg:justify-between px-10 capitalize '>
				<Link
					to='/'
					className='block text-center -mt-6 lg:-mt-10 text-slate-500 hover:text-slate-600 text-sm'
				>
					Do you have an account? Login in
				</Link>
				<Link
					to='/forgot-password'
					className='block text-center  -mt-10 lg:-mt-10  text-slate-500 hover:text-slate-600  text-sm'
				>
					Forgot password?
				</Link>
			</nav>
		</>
	);
}
