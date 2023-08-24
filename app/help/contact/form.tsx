'use client';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import Confetti from 'react-confetti';
/**
 * Renders a contact form for users to submit their contact information and message.
 * Upon submission, sends the data to a server using a POST request and displays a thank you message with confetti if the submission is successful.
 *
 * @returns {JSX.Element} The rendered contact form page.
 */
export default function ContactForm(): JSX.Element {
	const [isSubmitted, setSubmitted] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	/**
	 * Handles form submission event.
	 * Sends a POST request to the server with the form data.
	 * Updates the state variable 'isSubmitted' to true if the response status is 200.
	 * @param e The form submission event
	 */
	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const res = await axios.post('/api/contact', { name, email, message });
			if (res.status === 200) setSubmitted(true);
		} catch (err: any) {
			console.error('Error:', err);
		}
	};

	return isSubmitted ? (
		<div>
			<h1 className='text-center font-semibold text-3xl'>Thank you for your message!</h1>
			<Confetti />
		</div>
	) : (
		<form onSubmit={onSubmit} className='flex flex-col gap-8'>
			<div>
				<label className='label font-semibold'>
					<span className='label-text'>Full Name</span>
				</label>
				<input
					className='input w-full input-bordered input-primary'
					value={name}
					onChange={e => setName(e.target.value)}
					type='text'
					placeholder='Name'
					required
				/>
			</div>
			<div>
				<label className='label font-semibold'>
					<span className='label-text'>Email</span>
				</label>
				<input
					className='input w-full input-bordered input-primary'
					value={email}
					onChange={e => setEmail(e.target.value)}
					type='email'
					placeholder='Email'
					required
				/>
			</div>
			<div>
				<label className='label font-semibold'>
					<span className='label-text'>Message</span>
				</label>
				<textarea
					className='textarea w-full textarea-primary'
					value={message}
					onChange={e => setMessage(e.target.value)}
					required
				/>
			</div>
			<button className='btn btn-primary' type='submit'>
				Submit
			</button>
		</form>
	);
}
