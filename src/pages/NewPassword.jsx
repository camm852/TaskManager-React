import React from 'react';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner/Spinner';
import clientAxios from '../config/clientAxios';
import { useParams } from 'react-router-dom';

export default function NewPassword() {
	const [userForm, setUserForm] = React.useState({
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = React.useState({
		blank: '',
		password: '',
		matchPassword: '',
	});
	const [alert, setAlert] = React.useState({
		msg: '',
		error: false,
	});
	const [spinner, setSpinner] = React.useState(false);
	const params = useParams();

	React.useEffect(() => {
		// check token have sent to email
		const checkToken = async () => {
			try {
				const { token } = params;
				const response = await clientAxios.get(
					`/users/forgotpassword/${token}`
				);
			} catch (error) {
				const { msg } = error.response.data;
				setAlert({ msg: msg, error: true });
			}
		};
		checkToken();
	}, []);

	const validateForm = () => {
		const newError = {
			blank: '',
			password: '',
			matchPassword: '',
		};
		if (![userForm.password].includes('')) {
			if (userForm.password !== userForm.confirmPassword) {
				newError.matchPassword = "Passwords don't match";
				7;
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
		} else {
			newError.blank = "Must don't have empty fields";
		}

		if (
			newError.blank === '' &&
			newError.password === '' &&
			newError.matchPassword === ''
		) {
			setError({
				blank: '',
				password: '',
				matchPassword: '',
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
			setSpinner(true);
			try {
				const { token } = params;
				const dataForm = {
					password: userForm.password,
				};
				const response = await clientAxios.post(
					`/users/forgotpassword/${token}`,
					dataForm
				);
				setAlert({
					msg: '',
					error: false,
				});
				setTimeout(() => {
					setSpinner(false);
					setAlert({ ...alert, msg: response.data.msg });
				}, [2000]);
			} catch (error) {
				setSpinner(false);
				const { msg } = error.response.data;
				setAlert({ msg: msg.msg, error: true });
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
				Restore Password
				<br />
				<span className='text-slate-700 text-5xl block py-2'>Task Manager</span>
			</h1>
			{alert.msg ? (
				<div className='mt-10'>
					<Alert error={alert.error}>{alert.msg}</Alert>
				</div>
			) : (
				<form className='my-10 px-10 py-5' onSubmit={handleSubmit}>
					{error.blank ? <Alert error={true}>{error.blank}</Alert> : null}
					<div>
						<div className='text-sm font-bold text-gray-700 tracking-wide'>
							New Password
						</div>
						<input
							className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
							type='password'
							placeholder='Enter new password'
							name='password'
							onChange={handleChangeForm}
						/>
					</div>
					<div className='mt-8'>
						<div className='flex justify-between items-center'>
							<div className='text-sm font-bold text-gray-700 tracking-wide'>
								Confirm Password
							</div>
						</div>
						<input
							className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
							type='password'
							placeholder='Confirm password'
							name='confirmPassword'
							onChange={handleChangeForm}
						/>
						{(error.password || error.matchPassword) && (
							<Alert error={true}>
								{error.matchPassword ? error.matchPassword : error.password}
							</Alert>
						)}
					</div>
					<div className='mt-10'>
						<button
							className='bg-sky-600 text-gray-100 p-3 w-full rounded-md tracking-wide
												font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-sky-700
												shadow-lg transition-colors duration-500 ease-out'
						>
							{!spinner ? <p>Restore Password</p> : <Spinner small={true} />}
						</button>
					</div>
				</form>
			)}
		</>
	);
}
