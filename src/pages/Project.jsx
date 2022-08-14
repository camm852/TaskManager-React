import React from 'react';
import useAuth from '../hooks/useAuth';
import Skeleton from '../components/Skeleton';
import Alert from '../components/Alert';
import ModalTask from '../components/Project/Task/ModalTask';
import Task from '../components/Project/Task/Task';
import Collaborator from '../components/Project/Collaborator/Collaborator';
import ModalCollaborator from '../components/Project/Collaborator/ModalCollaborator';
import io from 'socket.io-client';
import useSocket from '../hooks/useSocket';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	handleModalCollaborator,
	handleModalTask,
	setTasks,
	setUser,
} from '../redux/Slices/Project/ProjectSlice';
import { getProjectThunk } from '../redux/Slices/Project/ThunkReducers';

export default function Project() {
	const [charging, setCharging] = React.useState(true);
	const [alert, setAlert] = React.useState({
		msg: '',
		error: false,
	});
	const { auth } = useAuth();
	const { emitSocket } = useSocket();
	const project = useSelector((state) => state.projects.project);
	const params = useParams();
	const dispatch = useDispatch();
	let socket;

	React.useEffect(() => {
		dispatch(setUser(auth));
		const { id } = params;
		const getProject = async () => {
			const response = await dispatch(getProjectThunk(id));
			switch (response.payload.response.status) {
				case 0:
					setAlert({ msg: 'NETWORK FAILED', error: true });
					setCharging(false);
					break;
				case 404:
					setAlert({ msg: response.payload.response.data.msg, error: true });
					setCharging(false);
					break;
				case 403:
					setAlert({ msg: response.payload.response.data.msg, error: true });
					setCharging(false);
				default:
					setCharging(false);
					break;
			}
		};
		getProject();
	}, []);

	React.useEffect(() => {
		socket = io(import.meta.env.VITE_API_URL);
		socket.emit('viewProject', params.id);
	});

	React.useEffect(() => {
		socket.on('newTask', (task) => {
			console.log('new task');
			dispatch(
				setTasks({
					task,
					type: 'new',
				})
			);
		});
		socket.on('deleteTask', (task) => {
			dispatch(
				setTasks({
					task,
					type: 'delete',
				})
			);
		});
		socket.on('updateTask', (task) => {
			dispatch(
				setTasks({
					task,
					type: 'update',
				})
			);
		});
		socket.on('changeStateTask', (task) => {
			dispatch(
				setTasks({
					task,
					type: 'state',
				})
			);
		});
	}, [emitSocket]);

	if (charging) return <Skeleton />;
	if (alert.msg)
		return (
			<>
				<div className='px-7  mt-11 w-full'>
					<Alert error={alert.error}>{alert.msg}</Alert>;
				</div>
			</>
		);
	else
		return (
			<>
				<div className={`flex justify-between`}>
					<h1 className='font-black text-4xl'>{project.name}</h1>
				</div>
				{!project.collaborator && (
					<div className='flex items-center justify-start gap-3 mt-8'>
						<button
							type='button'
							className='text-sm px-3 py-2 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 hover:bg-sky-500 ease-in duration-150 text-white text-center
						flex gap-2 items-center justify-center
					'
							onClick={() => dispatch(handleModalTask())}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
									clipRule='evenodd'
								/>
							</svg>
							Task
						</button>
						<button
							type='button'
							className='text-sm px-3 py-2 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 hover:bg-sky-500 ease-in duration-150 text-white text-center
						flex gap-2 items-center justify-center
					'
							onClick={() => dispatch(handleModalCollaborator())}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
									clipRule='evenodd'
								/>
							</svg>
							Collaborator
						</button>
					</div>
				)}
				<ModalTask />
				<h2 className='font-bold mt-6 text-xl'>Tasks of the project</h2>
				<div className='mt-7 shadow rounded-lg'>
					{!project.tasks?.length ? (
						<p className='text-center my-5 p-10 text-lg font-bold'>
							There are not tasks in this project
						</p>
					) : (
						project.tasks?.map((task) => (
							<Task task={task} project={project} key={task._id} />
						))
					)}
				</div>
				<ModalCollaborator />
				<h2 className='font-bold mt-6 text-xl'>Collaborators of the project</h2>
				<div className='shadow mt-10 rounded-lg'>
					{project.collaborators?.length > 0 ? (
						project.collaborators.map((collaborator) => (
							<Collaborator
								collaborator={collaborator}
								project={project}
								key={collaborator._id}
							/>
						))
					) : (
						<p className='text-center my-5 p-10 text-lg font-bold'>
							There are not Collaborators
						</p>
					)}
				</div>
			</>
		);
}
