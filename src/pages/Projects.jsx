import React from 'react';
import clientAxios from '../config/clientAxios';
import Cookies from 'universal-cookie';
import PreviewProject from '../components/Project/PreviewProject';
import useAuth from '../hooks/useAuth';
import { setProjects, setUser } from '../redux/Slices/Project/ProjectSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Projects() {
	const { auth } = useAuth();
	const projects = useSelector((state) => state.projects);
	const dispatch = useDispatch();
	const cookie = new Cookies();
	const { token } = cookie.get('access-token');

	React.useEffect(() => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		const getProjects = async () => {
			try {
				const response = await clientAxios('/projects', config);
				dispatch(setProjects(response.data));
				dispatch(setUser(auth));
			} catch (error) {
				console.log(error);
			}
		};
		getProjects();
	}, []);

	return (
		<>
			<h1 className='text-3xl font-black'>Projects</h1>

			<div className='shadow mt-10 rounded-lg p-5'>
				{projects.projects.length !== 0 ? (
					projects.projects.map((project) => (
						<PreviewProject project={project} key={project._id} />
					))
				) : (
					<p className='text-center text-gray-600 p-5'>No hay proyectos</p>
				)}
			</div>
		</>
	);
}
