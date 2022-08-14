import React from 'react';
import Alert from '../Alert';
import Spinner from '../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { handleModalProject } from '../../redux/Slices/Project/ProjectSlice';
import {
	newProjectThunk,
	updateProjectThunk,
} from '../../redux/Slices/Project/ThunkReducers';

export default function FormProject(props) {
	const [projectForm, setProjectForm] = React.useState({
		id: null,
		name: '',
		description: '',
		datePicker: '',
		customer: '',
	});
	const [error, setError] = React.useState({
		blank: '',
	});
	const [alert, setAlert] = React.useState({
		msg: '',
		error: true,
	});
	const [spinner, setSpinner] = React.useState(false);
	const project = useSelector((state) => state.projects.project);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (project && !project.collaborator) {
			setProjectForm({
				id: project._id ?? null,
				name: project.name ?? '',
				description: project.description ?? '',
				datePicker: project.datePicker.split('T')[0] ?? '',
				customer: project.customer ?? '',
			});
		}
	}, []);

	const validateForm = () => {
		if (
			[
				projectForm.name,
				projectForm.description,
				projectForm.datePicker,
				projectForm.customer,
			].includes('')
		) {
			setError({ blank: "Must don't have empty fields" });
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSpinner(true);
		const validate = validateForm();

		// valide if the form is correct
		if (!validate) {
			setSpinner(false);
			return;
		}
		setError('');

		let response;
		if (projectForm.id) {
			response = await dispatch(updateProjectThunk(projectForm));
		} else {
			response = await dispatch(newProjectThunk(projectForm));
		}
		switch (response.payload.response.status) {
			case 0:
				setAlert({ msg: 'NETWORK FAILED', error: true });
				break;
			case 404:
				setAlert({ msg: response.payload.response.data.msg, error: true });
				break;
			default:
				setAlert({
					msg: !projectForm.id
						? 'Project created succesfully'
						: 'Project p succesfully',
					error: false,
				});
		}

		setTimeout(() => {
			setSpinner(false);
			dispatch(handleModalProject());
			window.location.reload(false);
		}, 500);
	};

	const handleChangeForm = (e) => {
		setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
	};

	return (
		<>
			<form className='py-6 px-5 md:w-full' onSubmit={handleSubmit}>
				{error.blank ? (
					<Alert error={true}>{error.blank}</Alert>
				) : alert.msg ? (
					<Alert error={alert.error}>{alert.msg}</Alert>
				) : null}
				<div className='mb-3'>
					<div className='text-sm font-bold text-gray-700 tracking-wide '>
						Name Project
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
						type='text'
						placeholder='Name Project'
						name='name'
						value={projectForm.name}
						onChange={handleChangeForm}
					/>
				</div>
				<div className='mb-3'>
					<div className='text-sm font-bold text-gray-700 tracking-wide'>
						Description
					</div>
					<textarea
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
						placeholder='Description Project'
						rows={1}
						name='description'
						value={projectForm.description}
						onChange={handleChangeForm}
					/>
				</div>
				<div className='mb-4'>
					<div className='text-sm font-bold text-gray-700 tracking-wide'>
						Deliver Date
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
						type='date'
						placeholder='Name Client'
						name='datePicker'
						value={projectForm.datePicker}
						onChange={handleChangeForm}
					/>
				</div>

				<div>
					<div className='text-sm font-bold text-gray-700 tracking-wide'>
						Name Client
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
						type='text'
						placeholder='Name Client'
						name='customer'
						value={projectForm.customer}
						onChange={handleChangeForm}
					/>
				</div>

				<div className='mt-7'>
					<button
						className='bg-sky-600 text-gray-100 p-3 w-full rounded-md tracking-wide
												font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-sky-700
												shadow-lg transition-colors duration-500 ease-out'
						type='submit'
					>
						{!spinner ? (
							projectForm.id ? (
								'Update Project'
							) : (
								'Create Project'
							)
						) : (
							<Spinner small={true} />
						)}
					</button>
				</div>
			</form>
		</>
	);
}
