import React from 'react';
import { Listbox, Transition } from '@headlessui/react';

export default function useDropDown(options) {
	const [selected, setSelected] = React.useState('');

	const DropDown = () => {
		return (
			<div className='w-full py-5'>
				<Listbox value={selected} onChange={setSelected} className='relative'>
					<div className='mt-1'>
						<Listbox.Button className='w-full cursor-default rounded-md border p-2 flex justify-between hover:bg-sky-200 '>
							{!selected ? (
								<span className='text-gray-400'>-- Select--</span>
							) : (
								selected
							)}
							<span>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-6 w-6 '
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
									strokeWidth={2}
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='M8 9l4-4 4 4m0 6l-4 4-4-4'
									/>
								</svg>
							</span>
						</Listbox.Button>
						<Transition
							as={React.Fragment}
							enter='transition ease-out duration-100'
							enterFrom='transform opacity-0 scale-95'
							enterTo='transform opacity-100 scale-100'
							leave='transition ease-in duration-75'
							leaveFrom='transform opacity-100 scale-100'
							leaveTo='transform opacity-0 scale-95'
						>
							<Listbox.Options className='absolute mt-1 w-full rounded-lg bg-white text-base shadow-lg overflow-y-auto'>
								{options.map((options, i) => (
									<Listbox.Option
										key={options + i}
										className={({ active }) =>
											`relative cursor-pointer select-none p-2 ${
												active ? 'bg-sky-200 text' : null
											}`
										}
										value={options}
									>
										{({ selected }) => (
											<>
												<div className='flex'>
													<span>{options}</span>
													{selected ? (
														<div className='relative pl-2 flex items-center'>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																className='h-6 w-6 '
																fill='none'
																viewBox='0 0 24 24'
																stroke='currentColor'
																strokeWidth={2}
															>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	d='M5 13l4 4L19 7'
																/>
															</svg>
														</div>
													) : null}
												</div>
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</Listbox>
			</div>
		);
	};
	return [selected, setSelected, DropDown];
}
