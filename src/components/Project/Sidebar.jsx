import React from 'react';
import useAuth from '../../hooks/useAuth';
import ModalProject from './ModalProject';
import logo from "../../TM.png"
import { useDispatch, useSelector } from 'react-redux';
import { handleModalProject } from '../../redux/Slices/Project/ProjectSlice';

export default function Sidebar() {
	const { auth } = useAuth();
	const project = useSelector((state) => state.projects.project);
	const dispatch = useDispatch();

	const handleEditProject = () => {
		dispatch(handleModalProject());
	};

	const handleNewProject = () => {
		dispatch(handleModalProject());
	};

	return (
		<aside className='md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-6'>
			<img src={logo} alt="" />
			{!project || project.collaborator ? (
				<button
					className='bg-sky-600 hover:bg-sky-500 ease-in duration-150 w-full p-2 text-white uppercase font-bold block mt-5 mx-3 text-center rounded-lg'
					onClick={handleNewProject}
				>
					<div className='flex justify-center gap-3'>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					 Project
					</div>
				</button>
			) : (
				<div>
					<button
						className='bg-sky-600 hover:bg-sky-500 ease-in duration-150 w-full p-2 text-white uppercase font-bold block mt-5 text-center rounded-lg'
						onClick={handleEditProject}
					>
						Update Info
					</button>
					<div className='mt-4'>
						<p className='font-bold'>Description: </p>
						<p className='mb-2'>{project.description}</p>
						<p className='font-bold'>Delivery Date:</p>
						<p className='mb-2'>{project.datePicker.split('T')[0]}</p>
						<p className='font-bold'>Customer:</p>
						<p>{project.customer}</p>
					</div>
				</div>
			)}
			<ModalProject />
		</aside>
	);
}
