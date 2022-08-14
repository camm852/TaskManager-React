import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Header() {
	const { logOut } = useAuth();

	return (
		<header className='px-4 py-3 bg-white border-b'>
			<div className='md:flex md:justify-between'>
				<h2 className='text-4xl text-sky-600 font-black text-center mb-5 md:mb-0'>
					Task-Manager
				</h2>
				<div className='flex flex-col  gap-3  md:flex-row '>
					<div className='flex items-center gap-4 justify-center'>
						<Link
							to='/projects'
							className='text-white text-sm bg-sky-600 hover:bg-sky-500 ease-in duration-150 p-2 rounded-md uppercase font-bold '
						>
							Projects
						</Link>
						<button
							type='button'
							className='text-white text-sm bg-sky-600 hover:bg-sky-500 ease-in duration-150 p-2 rounded-md uppercase font-bold '
							onClick={logOut}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
