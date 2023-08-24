/**
 * Renders the home page of the CoDriver application.
 *
 * @returns {JSX.Element} The rendered HTML code for the home page.
 */
export default function Home(): JSX.Element {
	return (
		<div className='hero min-h-screen bg-neutral'>
			<div className='hero-content flex-col lg:flex-row'>
				<img
					src='img/bugatti.jpeg'
					alt='Image'
					className='max-w-sm rounded-lg shadow-2xl'
				/>
				<div>
					<h1 className='text-5xl font-bold'>Welcome to CoDriver!</h1>
					<p className='py-6'>Your trusted partner for safe and efficient driving.</p>
					<a className='btn btn-primary' href='/accounts/login'>
						Login
					</a>
				</div>
			</div>
		</div>
	);
}
