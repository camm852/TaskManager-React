import React from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProjectThunk } from '../../redux/Slices/Project/ThunkReducers';

export default function PreviewProject({ project }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { auth } = useAuth();
	const { name, _id, customer, creator } = project;

	const handleDeleteProject = async () => {
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
			const response = await dispatch(deleteProjectThunk(_id));
			if (response.payload.response.status !== 402) {
				swalButtons.fire({
					icon: 'error',
					title: 'Oops...',
					text: response.payload.response.data.msg,
				});
				return;
			}
			swalButtons.fire('Deleted!', 'Your project has been deleted.', 'success');
		}
	};

	return (
		<>
			<div className='border-b p-5 flex flex-col md:flex-row justify-between'>
				<div className='flex items-center gap-2'>
					<p className='flex-1 font-semibold'>
						{name}{' '}
						<span className='text-sm text-gray-500 uppercase font-semibold'>
							{customer}
						</span>
					</p>
					{creator !== auth._id && (
						<p className='p-1 bg-green-500 text-gray-100 rounded-lg uppercase font-bold text-xs'>
							Collaborator
						</p>
					)}
				</div>
				<div className='flex gap-2'>
					<button
						className='block px-1 h-8 bg-sky-600 hover:bg-sky-500 ease-in duration-150 rounded-lg text-white font-semibold text-xs'
						onClick={() => navigate(`/projects/${_id}`)}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-6 w-6'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth='2'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
							/>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
							/>
						</svg>
					</button>
					{creator === auth._id && (
						<button
							className='block px-1 h-8 bg-red-600 hover:bg-red-500 ease-in duration-150 rounded-lg text-white font-semibold text-xs'
							onClick={handleDeleteProject}
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
					)}
				</div>
			</div>
		</>
	);
}
