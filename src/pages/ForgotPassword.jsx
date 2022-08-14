import React from 'react';
import Alert from '../components/Alert';
import clientAxios from '../config/clientAxios';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
	const [userForm, setUserForm] = React.useState({
		email: '',
	});
	const [alert, setAlert] = React.useState({
		msg: '',
		error: false,
	});
	const [error, setError] = React.useState({
		blank: '',
		email: '',
	});

	const navigate = useNavigate();

	const validateForm = () => {
		const newError = {
			blank: '',
			email: '',
		};
		if (![userForm.email].includes('')) {
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

		if (newError.blank === '' && newError.email === '') {
			setError({
				msg: '',
				email: '',
			});
			return true;
		} else {
			setError(newError);
			return false;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validate = validateForm();
		if (validate) {
			try {
				const response = await clientAxios.post(
					`/users/forgotpassword`,
					userForm
				);
				setAlert({
					msg: '',
					error: false,
				});
				const { data } = response;
				setAlert({ msg: data.msg, error: false });
				setTimeout(() => {
					navigate('/');
				}, [4000]);
			} catch (error) {
				const { msg } = error.response.data;
				setAlert({ msg: msg, error: true });
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
			<h1 className='text-sky-600 font-black text-4xl text-center capitalize'>
				Forgot password <br />
				<span className='text-slate-700 text-5xl block py-2'>Task Manager</span>
			</h1>

			<form className='my-10 px-10 py-5 lg:w-full' onSubmit={handleSubmit}>
				{error.blank ? (
					<Alert error={true}>{error.blank}</Alert>
				) : alert.msg ? (
					<Alert error={alert.error}>{alert.msg}</Alert>
				) : null}
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
				{error.email && <Alert error={true}>{error.email}</Alert>}
				<div className='mt-10'>
					<button
						className='bg-sky-600 text-gray-100 p-3 w-full rounded-md tracking-wide
												font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-sky-700
												shadow-lg transition-colors duration-500 ease-out'
					>
						Send Instructions
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
					to='/sign-up'
					className='block text-center -mt-10 lg:-mt-10 text-slate-500 hover:text-slate-600 text-sm'
				>
					Do you not have an account? Sign Up
				</Link>
			</nav>
		</>
	);
}
