import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './Slices/Project/ProjectSlice';

export const store = configureStore({
	reducer: {
		projects: projectsReducer,
	},
});
