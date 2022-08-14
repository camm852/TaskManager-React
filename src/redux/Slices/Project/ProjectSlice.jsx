import lodash from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import {
	addCollaboratorThunk,
	deleteCollaboratorThunk,
	deleteProjectThunk,
	getProjectThunk,
	newProjectThunk,
	searchCollaboratorThunk,
} from './ThunkReducers';

const initialState = {
	projects: [],
	user: '',
	project: '',
	updateProject: '',
	modalProject: false,
	modalTask: false,
	modalCollaborator: false,
	updateTask: '',
	searchCollaborator: '',
};

export const projectsSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		setProjects: (state, action) => {
			state.projects = action.payload;
			state.project = '';
		},
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setTasks: (state, action) => {
			console.log(action.payload);
			const { type, task } = action.payload;
			console.log(task);
			switch (type) {
				case 'new': {
					let isTask = false;
					state.project.tasks.forEach((taskStored) => {
						if (taskStored._id === task._id) {
							isTask = true;
						}
					});
					!isTask ? state.project.tasks.push(task) : null;
					break;
				}
				case 'delete': {
					const newTasks = state.project.tasks.filter(
						(taskStored) => taskStored._id !== task._id
					);
					state.project.tasks = newTasks;
					break;
				}
				case 'update': {
					const project = state.project;

					const newTasks = project.tasks.map((taskStored, i) =>
						taskStored._id !== task._id ? taskStored : task
					);
					state.project.tasks = newTasks;
					state.updateTask = '';
					break;
				}
				case 'state': {
					const { user } = task;
					state.project.tasks.forEach((taskStored, i) => {
						if (taskStored._id === task.taskStored._id) {
							state.project.tasks[i].state = task.taskStored.state;
							state.project.tasks[i].completed = {
								name: user.name,
								_id: user._id,
							};
						}
					});
					break;
				}
				default:
					break;
			}
		},
		handleModalProject: (state) => {
			state.modalProject = !state.modalProject;
		},
		handleModalTask: (state) => {
			state.modalTask = !state.modalTask;
			state.updateTask = '';
		},
		handleModalCollaborator: (state) => {
			state.modalCollaborator = !state.modalCollaborator;
		},
		handleUpdateTask: (state, action) => {
			state.updateTask = action.payload;
		},
		resetSearchCollaborator: (state, action) => {
			state.searchCollaborator = '';
		},
	},
	extraReducers: {
		[newProjectThunk.fulfilled]: (state, action) => {
			state.projects.push(action.payload.response.data);
		},
		[deleteProjectThunk.fulfilled]: (state, action) => {
			console.log(action);
			const { _id } = action.payload.response.data;
			const newProjects = state.projects.filter(
				(project) => project._id !== _id
			);
			state.projects = newProjects;
		},
		[getProjectThunk.fulfilled]: (state, action) => {
			if (action.payload.response.status === 200) {
				state.project = action.payload.response.data.project;
				const isCollaborator = lodash.find(state.project.collaborators, {
					_id: state.user._id,
				});

				if (isCollaborator) state.project.collaborator = true;
			}
		},
		[searchCollaboratorThunk.fulfilled]: (state, action) => {
			if (action.payload.response.status === 200) {
				state.searchCollaborator = action.payload.response.data;
			}
		},
		[addCollaboratorThunk.fulfilled]: (state, action) => {
			state.project.collaborators.push(action.payload.response.data);
		},
		[deleteCollaboratorThunk.fulfilled]: (state, action) => {
			const newCollaborators = state.project.collaborators.filter(
				(collaborator) => collaborator._id !== action.payload.response.data._id
			);
			state.project.collaborators = newCollaborators;
		},
	},
});

export const {
	setProjects,
	setUser,
	setTasks,
	handleModalProject,
	handleModalTask,
	handleUpdateTask,
	handleModalCollaborator,
	resetSearchCollaborator,
} = projectsSlice.actions;

export default projectsSlice.reducer;
