import React from 'react';

export default function Alert({ children, error }) {
	return (
		<div
			className={`${
				error ? 'from-red-400 to-red-600' : 'from-green-400 to-green-600'
			}  bg-gradient-to-br text-center p-2 rounded-xl uppercase text-white font-bold text-sm mb-2`}
		>
			{children}
		</div>
	);
}
