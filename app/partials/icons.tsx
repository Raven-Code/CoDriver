const Facebook = () => {
	return (
		<svg
			width='28'
			height='28'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
		</svg>
	);
};

const Instagram = () => {
	return (
		<svg
			width='28'
			height='28'
			viewBox='0 0 24 24'
			strokeWidth='1'
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path stroke='none' d='M0 0h24v24H0z' />
			<rect x='4' y='4' width='16' height='16' rx='4' /> <circle cx='12' cy='12' r='3' />
			<line x1='16.5' y1='7.5' x2='16.5' y2='7.501' />
		</svg>
	);
};
const LinkedIn = () => {
	return (
		<svg
			width='28'
			height='28'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
			<rect x='2' y='9' width='4' height='12' /> <circle cx='4' cy='4' r='2' />
		</svg>
	);
};
const Twitter = () => {
	return (
		<svg
			width='28'
			height='28'
			viewBox='0 0 24 24'
			strokeWidth='1'
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'>
			<path stroke='none' d='M0 0h24v24H0z' />
			<path d='M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497 -3.753C20.18 7.773 21.692 5.25 22 4.009z' />
		</svg>
	);
};
const Trash = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className='w-6 h-6'>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
		/>
	</svg>
);
const Exclamation = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className='w-6 h-6'>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
		/>
	</svg>
);
const Check = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className='w-6 h-6'>
		<path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
	</svg>
);
export { Check, Exclamation, Facebook, Instagram, LinkedIn, Trash, Twitter };
