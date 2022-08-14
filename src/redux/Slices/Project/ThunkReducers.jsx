import Cookies from 'universal-cookie';
import clientAxios from '../../../config/clientAxios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const newProjectThunk = createAsyncThunk(
	'project/newProject',
	async (projectForm) => {
		const cookie = new Cookies();
		const { token } = cookie.get('access-token');
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		try {
			const response = await clientAxios.post('/projects', projectForm, config);
			const _response = {
				response: {
					status: response.status,
					data: response.data,
				},
			};
			return _response;
		} catch (error) {
			return error;
		}
	}
);

const getProjectThunk = createAsyncThunk('project/getProject', async (id) => {
	const cookie = new Cookies();
	const { token } = cookie.get('access-token');
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};
	try {
		const response = await clientAxios(`/projects/${id}`, config);
		const _response = {
			response: {
				status: response.status,
				data: response.data,
			},
		};
		return _response;
	} catch (error) {
		return error;
	}
});

const updateProjectThunk = createAsyncThunk(
	'project/updateProject',
	async (projectForm) => {
		const cookie = new Cookies();
		const { token } = cookie.get('access-token');
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		const id = projectForm.id;
		const updateProject = lodash.pick(projectForm, [
			'name',
			'description',
			'datePicker',
			'customer',
		]);
		try {
			const response = await clientAxios.put(
				`/projects/${id}`,
				updateProject,
				config
			);
			const _response = {
				response: {
					status: response.status,
					data: response.data,
				},
			};
			return _response;
		} catch (error) {
			return error;
		}
	}
);

const deleteProjectThunk = createAsyncThunk(
	'project/deleteProject',
	async (id) => {
		const cookie = new Cookies();
		const { token } = cookie.get('access-token');
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		try {
			const response = await clientAxios.delete(`/projects/${id}`, config);
			const _response = {
				response: {
					status: response.status,
					data: response.data,
				},
			};
			return _response;
		} catch (error) {
			return error;
		}
	}
);

const newTaskThunk = createAsyncThunk('project/newTask', async (taskForm) => {
	const cookie = new Cookies();
	const { token } = cookie.get('access-token');
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};
	try {
		const response = await clientAxios.post('/tasks', taskForm, config);
		const _response = {
			response: {
				status: response.status,
				data: response.data,
			},
		};
		return _response;
	} catch (error) {
		return error;
	}
});

const updateTaskThunk = createAsyncThunk(
	'project/updateTask',
	async (taskForm) => {
		const { id } = taskForm;
		const cookie = new Cookies();
		const { token } = cookie.get('access-token');
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		try {
			const response = await clientAxios.put(`/tasks/${id}`, taskForm, config);
			const _response = {
				response: {
					status: response.status,
					data: response.data,
				},
			};
			return _response;
		} catch (error) {
			return error;
		}
	}
);

const deleteTaskThunk = createAsyncThunk('project/deleteTask', async (id) => {
	const cookie = new Cookies();
	const { token } = cookie.get('access-token');
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};
	try {
		const response = await clientAxios.delete(`/tasks/${id}`, config);
		const _response = {
			response: {
				status: response.status,
				data: response.data,
			},
		};
		return _response;
	} catch (error) {
		return error;
	}
});

const searchCollaboratorThunk = createAsyncThunk(
	'project/searchCollaborator',
	async (email) => {
		const cookie = new Cookies();
		const { token } = cookie.get('access-token');
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		try {
			const response = await clientAxios.post(
				`/projects/collaborators`,
				email,
				config
			);
			const _response = {
				response: {
					status: response.status,
					data: response.data,
				},
			};
			return _response;
		} catch (error) {
			return error;
		}
	}
);

const addCollaboratorThunk = createAsyncThunk(
	'project/addCollaborator',
	async (formCollaborator) => {
		const { id, email } = formCollaborator;
		const emailBody = { email };
		const cookie = new Cookies();
		const { token } = cookie.get('access-token');
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		try {
			const response = await clientAxios.post(
				`/projects/collaborators/${id}`,
				emailBody,
				config
			);
			const _response = {
				response: {
					status: response.status,
					data: response.data,
				},
			};
			return _response;
		} catch (error) {
			return error;
		}
	}
);

const deleteCollaboratorThunk = createAsyncThunk(
	'project/deleteCollaborator',
	async (formCollaborator) => {
		const { idProject, idCollaborator } = formCollaborator;
		const body = { idCollaborator };
		const cookie = new Cookies();
		const { token } = cookie.get('access-token');
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		try {
			const response = await clientAxios.post(
				`/projects/delete-collaborator/${idProject}`,
				body,
				config
			);
			const _response = {
				response: {
					status: response.status,
					data: response.data,
				},
			};
			return _response;
		} catch (error) {
			return error;
		}
	}
);

const changeStateTaskThunk = createAsyncThunk(
	'project/changeStateTask',
	async (id) => {
		const cookie = new Cookies();
		const { token } = cookie.get('access-token');
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};
		try {
			const response = await clientAxios.post(`/tasks/state/${id}`, {}, config);
			const _response = {
				response: {
					status: response.status,
					data: response.data,
				},
			};
			return _response;
		} catch (error) {
			return error;
		}
	}
);

export {
	newProjectThunk,
	getProjectThunk,
	updateProjectThunk,
	deleteProjectThunk,
	newTaskThunk,
	updateTaskThunk,
	deleteTaskThunk,
	searchCollaboratorThunk,
	deleteCollaboratorThunk,
	addCollaboratorThunk,
	changeStateTaskThunk,
};
