import React from 'react';
import Alert from '../../Alert';
import { useDispatch } from 'react-redux';
import { searchCollaboratorThunk } from '../../../redux/Slices/Project/ThunkReducers';

export default function FormCollaborator({ project }) {
	const [email, setEmail] = React.useState({
		email: '',
	});
	const [alert, setAlert] = React.useState({
		msg: '',
		error: false,
	});
	const [error, setError] = React.useState({
		blank: '',
	});
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (email.email !== '') {
			setError('');
			const response = await dispatch(searchCollaboratorThunk(email));
			switch (response.payload.response.status) {
				case 0:
					setAlert({ msg: 'NETWORK FAILED', error: true });
					break;
				case 200:
					setAlert('');
				default:
					setAlert({ msg: response.payload.response.data.msg, error: true });
					break;
			}
		} else {
			setError({ blank: "Must don't have empty fields" });
		}
	};

	const handleChangeForm = (e) => {
		setEmail({ [e.target.name]: e.target.value });
	};

	return (
		<>
			<form className='py-5 px-5 md:w-full' onSubmit={handleSubmit}>
				{error.blank ? (
					<Alert error={true}>{error.blank}</Alert>
				) : alert.msg ? (
					<Alert error={alert.error}>{alert.msg}</Alert>
				) : null}
				<div className='mb-3'>
					<div className='text-sm font-bold text-gray-700 tracking-wide'>
						Email Collaborator
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent mt-1'
						type='email'
						placeholder='User Email'
						name='email'
						onChange={handleChangeForm}
					/>
				</div>

				<div className='mt-5'>
					<button
						className='bg-sky-600 text-gray-100 p-3 w-full rounded-md tracking-wide
												font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-sky-700
												shadow-lg transition-colors duration-500 ease-out'
						type='submit'
					>
						Search Collaborator
					</button>
				</div>
			</form>
		</>
	);
}
