import React from 'react';
import { DateFormat } from '../../../helpers/DateFormat';
import Swal from 'sweetalert2';
import {
	handleUpdateTask,
	handleModalTask,
} from '../../../redux/Slices/Project/ProjectSlice';
import {
	changeStateTaskThunk,
	deleteTaskThunk,
} from '../../../redux/Slices/Project/ThunkReducers';
import useSocket from '../../../hooks/useSocket';
import { useDispatch } from 'react-redux';

export default function Task({ task, project }) {
	const { deleteTaskSocket, changeStateSocket } = useSocket();
	const dispatch = useDispatch();
	const { name, description, deliveryDate, priority, state, _id, completed } =
		task;
	console.log(task);
	// who completed task
	const nameCompleted = `${completed?.name?.split(' ')[0]} ${
		completed?.name?.split(' ')[1].split('')[0]
	}`;

	const handleClick = async (e) => {
		e.preventDefault();

		const swalButtons = Swal.mixin({
			customClass: {
				confirmButton: 'bg-green-500 p-3 rounded-md text-gray-50  mr-3',
				cancelButton: 'bg-red-500 p-3 rounded-md text-gray-50  ',
			},
			buttonsStyling: false,
		});
		const result = await swalButtons.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'No, cancel!',
		});
		if (result.isConfirmed) {
			const response = await dispatch(deleteTaskThunk(_id));
			if (response.payload.response.status !== 200) {
				swalButtons.fire({
					icon: 'error',
					title: 'Oops...',
					text: response.payload.response.data.msg,
				});
				return;
			}
			swalButtons.fire('Deleted!', 'Your task has been deleted.', 'success');
			deleteTaskSocket(response.payload.response.data);
		}
	};

	const handleChangeState = async (id) => {
		// id task
		const response = await dispatch(changeStateTaskThunk(id));
		if (response.payload.response.status === 200) {
			changeStateSocket(response.payload.response.data);
		} else {
			window.location.reload(false);
		}
	};

	return (
		<>
			<div className='border-b p-5 flex justify-between items-center'>
				<div>
					<p className='mb-1 text-xl '>{name}</p>
					<p className='mb-1 text-sm text-gray-500 uppercase'>{description}</p>
					<p className='mb-1 text-sm '>{DateFormat(deliveryDate)}</p>
					<p className='text-sm  text-gray-500'>Priority: {priority}</p>
					{!state ? (
						<button
							className='bg-gray-600 p-1 text-white font-bold text-xs rounded-lg'
							onClick={() => {
								handleChangeState(_id);
							}}
						>
							Incomplete
						</button>
					) : (
						<button
							className='bg-green-600 p-1 text-white font-bold text-xs rounded-lg'
							onClick={() => {
								handleChangeState(_id);
							}}
						>
							Completed by {nameCompleted}
						</button>
					)}
				</div>

				{!project.collaborator && (
					<div className='flex gap-2'>
						<button
							className='bg-indigo-600 px-3 py-2 text-white uppercase font-bold text-sm rounded-lg'
							onClick={() => {
								dispatch(handleModalTask());
								dispatch(handleUpdateTask(task));
							}}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
								/>
							</svg>
						</button>

						<button
							className='bg-red-600 p-2 text-white uppercase font-bold text-sm rounded-lg'
							onClick={handleClick}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
								/>
							</svg>
						</button>
					</div>
				)}
			</div>
		</>
	);
}
