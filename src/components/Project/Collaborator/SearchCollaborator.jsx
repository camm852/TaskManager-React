import React from 'react';
import FormCollaborator from './FormCollaborator';
import Skeleton from '../../Skeleton';
import Alert from '../../Alert';
import lodash from 'lodash';
import { useParams } from 'react-router-dom';
import { resetSearchCollaborator } from '../../../redux/Slices/Project/ProjectSlice';
import {
	addCollaboratorThunk,
	getProjectThunk,
} from '../../../redux/Slices/Project/ThunkReducers';

import { useDispatch, useSelector } from 'react-redux';

export default function SearchCollaborator() {
	const [charging, setCharging] = React.useState(false);
	const [alert, setAlert] = React.useState({
		msg: '',
		error: false,
	});
	const params = useParams();
	const projects = useSelector((state) => state.projects);
	const searchCollaborator = useSelector(
		(state) => state.projects.searchCollaborator
	);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (searchCollaborator) dispatch(resetSearchCollaborator()); //reset state for open modal

		setCharging(true);

		const { id } = params;
		const getProject = async () => {
			if (!projects.project) {
				const response = await dispatch(getProjectThunk(id));
				switch (response.payload.response.status) {
					case 0:
						setAlert({
							msg: 'NETWORK FAILED',
							error: true,
						});
						break;
					case 200:
						break;
					default:
						setAlert({
							msg: 'Project not found',
							error: true,
						});
						break;
				}
			}
			setCharging(false);
		};
		getProject();
	}, []);

	const handleAddCollaborator = async (email) => {
		const formCollaborator = {
			id: projects.project._id,
			email,
		};
		const response = await dispatch(addCollaboratorThunk(formCollaborator));
		switch (response.payload.response.status) {
			case 0:
				setAlert({
					msg: 'NETWORK FAILED',
					error: true,
				});
				break;
			case 200:
				break;
			default:
				setAlert({
					msg: response.payload.response.data.msg,
					error: true,
				});
				break;
		}
	};

	if (charging) return <Skeleton />;
	if (alert.msg) return <Alert error={alert.error}>{alert.msg}</Alert>;
	return (
		<>
			<div className='h-80'>
				<div className='mt-10 flex justify-center'>
					<FormCollaborator project={projects.project} />
				</div>

				{projects.searchCollaborator && (
					<div className='flex justify-center'>
						<div className='py-2 px-5 md:w-full rounded-lg shadow'>
							<h2 className='text-center mb-3 text-2xl font-bold'>Result:</h2>
							<div className='flex justify-between items-center'>
								<p className='text-xl'>{projects.searchCollaborator.name}</p>
								{!lodash.find(projects.project.collaborators, {
									email: projects.searchCollaborator.email,
								}) ? (
									<button
										className='p-2 bg-sky-400 rounded-lg text-white font-bold'
										onClick={() =>
											handleAddCollaborator(projects.searchCollaborator.email)
										}
									>
										Add Collaborator
									</button>
								) : (
									<button className='p-2 bg-sky-400 rounded-lg text-white font-bold'>
										Is Collaborator
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
