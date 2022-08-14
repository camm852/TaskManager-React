import React from 'react';
import Alert from '../../Alert';
import PRIORITY from '../../../helpers/priorty';
import useDropDown from '../../../hooks/useDropDown';
import useSocket from '../../../hooks/useSocket';
import Spinner from '../../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { handleModalTask } from '../../../redux/Slices/Project/ProjectSlice';
import {
	newTaskThunk,
	updateTaskThunk,
} from '../../../redux/Slices/Project/ThunkReducers';
import { useParams } from 'react-router-dom';

export default function FormTask() {
	const [taskForm, setTaskForm] = React.useState({
		name: '',
		description: '',
		deliveryDate: '',
	});
	const [spinner, setSpinner] = React.useState(false);
	const [error, setError] = React.useState({
		blank: '',
	});
	const [alert, setAlert] = React.useState('');
	const [priority, setPriority, DropDown] = useDropDown(PRIORITY);
	const { newTaskSocket, updateTaskSocket } = useSocket();
	const params = useParams();
	const updateTask = useSelector((state) => state.projects.updateTask);
	const dispatch = useDispatch();

	React.useEffect(() => {
		// for edit task
		if (updateTask !== '') {
			console.log(updateTask);
			setTaskForm({
				name: updateTask.name ?? '',
				description: updateTask.description ?? '',
				deliveryDate: updateTask.deliveryDate.split('T')[0] ?? '',
			});
			setPriority(updateTask.priority);
		}
	}, []);

	const validateForm = () => {
		// valide if the form is correct
		if (
			[
				taskForm.name,
				taskForm.description,
				taskForm.deliveryDate,
				priority,
			].includes('')
		) {
			setError({ blank: "Must don't have empty fields" });
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validate = validateForm();
		if (validate) {
			setSpinner(true);
			let _taskForm = {
				...taskForm,
				project: params.id,
				priority,
			};
			if (updateTask) {
				_taskForm = {
					..._taskForm,
					id: updateTask._id,
				};
			}

			let response;
			if (!updateTask) {
				response = await dispatch(newTaskThunk(_taskForm));
			} else {
				response = await dispatch(updateTaskThunk(_taskForm));
			}
			switch (response.payload.response.status) {
				case 0:
					setAlert({ msg: 'NETWORK FAILED', error: true });
					break;
				case 200:
					setAlert({
						msg: !updateTask
							? 'Task created succesfully'
							: 'Task updated succesfully',
						error: false,
					});
					if (!updateTask) {
						newTaskSocket(response.payload.response.data); //socket propagation
					} else {
						const task = {
							...response.payload.response.data,
							completed: updateTask.completed,
						};
						updateTaskSocket(task);
					}
					break;
				default:
					setAlert({ msg: response.payload.response.data.msg, error: true });

					break;
			}
		}
		setTimeout(() => {
			setSpinner(false);
			dispatch(handleModalTask());
		}, 1000);
	};

	const handleChangeForm = (e) => {
		setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
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
						Name Task
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent mt-1'
						type='text'
						placeholder='Name Task'
						name='name'
						value={taskForm.name}
						onChange={handleChangeForm}
					/>
				</div>
				<div className='mb-3'>
					<div className='text-sm font-bold text-gray-700 tracking-wide'>
						Description
					</div>
					<textarea
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent mt-1'
						placeholder='Description Task'
						rows={1}
						name='description'
						value={taskForm.description}
						onChange={handleChangeForm}
					/>
				</div>
				<div className='mb-4'>
					<div className='text-sm font-bold text-gray-700 tracking-wide'>
						Delivery Date
					</div>
					<input
						className='w-full text-lg text-slate-600 py-2 border-b border-gray-300 focus:outline-none focus:border-sky-600 bg-transparent'
						type='date'
						name='deliveryDate'
						value={taskForm.deliveryDate}
						onChange={handleChangeForm}
					/>
				</div>
				<div className='mb-4'>
					<div className='text-sm font-bold text-gray-700 tracking-wide'>
						Priority
					</div>
					<div className='flex justify-start'>
						<DropDown />
					</div>
				</div>

				<div className='mt-5'>
					<button
						className='bg-sky-600 text-gray-100 p-3 w-full rounded-md tracking-wide
												font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-sky-700
												shadow-lg transition-colors duration-500 ease-out'
						type='submit'
					>
						{spinner ? (
							<Spinner small={true} />
						) : !updateTask ? (
							'Create Task'
						) : (
							'Update Task'
						)}
					</button>
				</div>
			</form>
		</>
	);
}
