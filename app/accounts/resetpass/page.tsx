'use client';
import axios from 'axios';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
const errorMsg = 'Sorry, something went wrong. Please try again later.'; // Error message to display when an error occurs
export default function Register() {
	// Init form data using the useState hook
	const [data, setData] = useState({
		acctId: '',
		password: '',
		confirmPassword: '',
	});
	const [valid, setValid] = useState({
		acctId: false,
		passwordProgress: 0,
		confirmPassword: false,
		captcha: false,
	});
	const updateTooltip = (e: any) => {
		const tooltip = e.target.parentNode.querySelector('.tooltip');
		tooltip.classList.toggle('hidden');
		tooltip.classList.toggle('tooltip-open');
	};
	const updateForm = async (e: any) => {
		const { name, value } = e.target;
		const regex = {
			acctId: /^[DSC]-\d+$/,
			pass: {
				length: /^.{8,30}$/,
				uppercase: /^.*[A-Z].*/,
				lowercase: /^.*[a-z].*/,
				digit: /^.*\d.*/,
				specialChar: /[!@#$%^&*()_+{}[\]:;<>,.?~\\\/\\|]/,
			},
		};
		if (name === 'acctId' && value !== '') {
			setValid(data => ({ ...data, acctId: regex.acctId.test(value) }));
		} else if (name === 'password') {
			const passwordTests = [
				regex.pass.length,
				regex.pass.uppercase,
				regex.pass.lowercase,
				regex.pass.digit,
				regex.pass.specialChar,
			];
			const progress = passwordTests.reduce(
				(acc, test) => acc + (test.test(value) ? 100 / passwordTests.length : 0),
				0
			);
			const progressTarget = e.target.parentNode.querySelector('.progress');
			if (progress === 100) {
				progressTarget.classList.add('progress-success');
				progressTarget.classList.remove('progress-error');
			} else {
				progressTarget.classList.remove('progress-success');
				progressTarget.classList.add('progress-error');
			}
			setValid(data => ({ ...data, passwordProgress: progress }));
			setValid(data => ({ ...data, confirmPassword: false }));
		} else if (name === 'confirmPassword' && data.password === data.confirmPassword) {
			setValid(data => ({ ...data, confirmPassword: true }));
		}
		setData(data => ({ ...data, [name]: value })); // Update form data
	};
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (
			!(
				valid.acctId &&
				valid.passwordProgress === 100 &&
				valid.confirmPassword &&
				valid.captcha
			)
		)
			return console.info('Invalid form data', JSON.stringify(valid));
		try {
			const response = await axios.post('/api/accounts/resetpass', {
				acctId: data.acctId,
				password: data.password,
			});
			window.alert('Password reset successfully. Please login with your new password.');
			window.location.href = '/accounts/login';
		} catch (e) {
			console.error(errorMsg, e);
		}
	};
	return (
		<div className='flex justify-center'>
			<form className='p-2 w-full max-w-md' noValidate>
				<h5 className='text-lg pb-2 text-center mt-6 mb-7'>Reset Password</h5>
				<div className='relative z-0 w-full mb-6 group'>
					<input
						type='text'
						name='acctId'
						id='acctId'
						onChange={updateForm}
						onFocus={updateTooltip}
						onBlur={updateTooltip}
						className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
						placeholder=' '
					/>
					<label
						htmlFor='acctId'
						className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
						Account ID
					</label>
					<div
						className='tooltip tooltip-bottom w-full hidden'
						data-tip='Enter your Account ID'
					/>
				</div>
				<div className='relative z-0 w-full mb-6 group'>
					<input
						type='password'
						name='password'
						id='password'
						onChange={updateForm}
						className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
						placeholder=' '
					/>
					<label
						htmlFor='password'
						className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
						New Password
					</label>
					<progress
						className='progress w-full progress-error'
						value={valid.passwordProgress.toString()}
						max='100'
					/>
					<p className='text-sm'>
						Must contain at least an uppercase, lowercase, number & special character,
						between 8-30 characters.
					</p>
				</div>
				<div className='relative z-0 w-full mb-6 group'>
					<input
						type='password'
						name='confirmPassword'
						id='confirmPassword'
						onChange={updateForm}
						onFocus={updateTooltip}
						onBlur={updateTooltip}
						className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
						placeholder=' '
					/>
					<label
						htmlFor='confirmPassword'
						className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
						Confirm password
					</label>
					<div
						className='tooltip tooltip-bottom w-full hidden'
						data-tip='Password must match previous password'
					/>
				</div>
				<div className='mb-2'>
					<ReCAPTCHA
						sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || ''}
						onChange={() => setValid(data => ({ ...data, captcha: true }))}
						onExpired={() => setValid(data => ({ ...data, captcha: true }))}
					/>
				</div>
				<button className='btn btn-primary w-full mb-2' onClick={handleSubmit}>
					Reset Password
				</button>
				<div className='text-center'>
					New to CoDriver?&nbsp;
					<a href='/accounts/register' className='link link-primary underline'>
						Sign Up
					</a>
				</div>
			</form>
		</div>
	);
}
