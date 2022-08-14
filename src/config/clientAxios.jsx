import axios from 'axios';

import React from 'react';

const clientAxios = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export default clientAxios;
