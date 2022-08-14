import React from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { deleteCollaboratorThunk } from '../../../redux/Slices/Project/ThunkReducers';

export default function Collaborator({ collaborator, project }) {
	const dispatch = useDispatch();
	const handleClick = async (e) => {
		e.preventDefault();

		const formCollaborator = {
			idCollaborator: collaborator._id,
			idProject: project._id,
		};

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
			const response = await dispatch(
				deleteCollaboratorThunk(formCollaborator)
			);

			if (response.payload.response.status !== 200) {
				swalButtons.fire({
					icon: 'error',
					title: 'Oops...',
					text: response.payload.response.data.msg,
				});
				return;
			}
			swalButtons.fire(
				'Deleted!',
				'Your collaborator has been deleted.',
				'success'
			);
		}
	};

	return (
		<>
			<div className='flex justify-between p-5 border-b items-center'>
				<div>
					<p className='font-bold'>{collaborator.name}</p>
					<p className='text-xl text-gray-400 mb-2'>{collaborator.email}</p>
				</div>
				{!project.collaborator && (
					<div>
						<button
							className=' bg-red-600 p-2 text-white uppercase font-bold text-sm rounded-lg'
							onClick={handleClick}
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</>
	);
}
