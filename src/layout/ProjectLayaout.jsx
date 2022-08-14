import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Project/Header';
import Sidebar from '../components/Project/Sidebar';

export default function ProjectLayaout() {
	return (
		<>
			<div className='bg-gray-100'>
				<Header />
				<div className='md:flex'>
					<Sidebar />
					<main className='px-10 py-6 flex-1'>
						<Outlet />
					</main>
				</div>
			</div>
		</>
	);
}
