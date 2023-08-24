'use client';

import { Exclamation, Trash } from '@/app/partials/icons';
import axios from 'axios';
import { useState } from 'react';
export const metadata = {
	title: 'Search - Staff | CoDriver',
};
export default function Search() {
	const [username, setUsername] = useState('');
	const [data, setData] = useState([]);
	const [acctId, setAcctId] = useState('');
	const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (username.length === 1 || username === '')
			tableVisibility(false, 'Please enter a username to show data.');
		setUsername(e.target.value);
	};
	const tableVisibility = (state: boolean, value = '') => {
		const feedbackTarget = document.querySelector('#feedback');
		const tableTarget = document.querySelector('#tableData');
		if (feedbackTarget === null) return;
		if (state) {
			feedbackTarget?.classList.add('hidden');
			tableTarget?.classList.remove('hidden');
		} else {
			feedbackTarget?.classList.remove('hidden');
			tableTarget?.classList.add('hidden');
			feedbackTarget.textContent = value;
		}
		if (value === 'error') {
			feedbackTarget?.classList.add('text-error');
			feedbackTarget?.classList.remove('text-info');
			feedbackTarget.textContent =
				'Failed to retrieve data from the database. Please contact an administrator.';
		} else {
			feedbackTarget?.classList.add('text-info');
			feedbackTarget?.classList.remove('text-error');
		}
	};
	const deleteUser = async (e: any) => {
		const acctId = e.target.parentElement.id;
		if (window.confirm('Do you want to delete this user?')) {
			const response = await axios
				.post(`/api/data/user`, { action: 'delete', acctId })
				.catch(err => {
					console.error(err);
				});
			if (response?.status === 500) {
				console.error('Error occured while deleting user.');
			}
			await onSubmit(e);
		}
	};
	const updateStatus = async (e: any) => {
		const acctId = e.target.parentElement.id;
		if (window.confirm('Do you want to change the status of this user?')) {
			const response = await axios
				.post(`/api/data/user`, { action: 'edit', acctId })
				.catch(err => {
					console.error(err);
				});
			if (response?.status === 500) {
				console.error('Error occured while updating user status.');
			}
			await onSubmit(e);
		}
	};
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const response = await axios.post('/api/data/users', { username }).catch(err => {
			console.error(err);
			tableVisibility(false, 'error');
		});
		if (response?.data.length === 0) tableVisibility(false, 'No results found.');
		else if (response) {
			// Populate data to table
			tableVisibility(true);
			setData(
				response.data.map((acct: any, count: any) => (
					<tr key={acct.acctNo}>
						<td>{count + 1}</td>
						<td>{acct.acctNo}</td>
						<td>{acct.acctId}</td>
						<td>{acct.name}</td>
						<td>{acct.username}</td>
						<td>{acct.email}</td>
						<td>{acct.status}</td>
						<td>{acct.dateCreated}</td>
						<td className='flex items-center justify-center join'>
							<a
								className='btn join-item btn-error'
								onClick={deleteUser}
								id={acct.acctId}>
								<Trash />
							</a>
							<a
								className='btn join-item btn-warning'
								onClick={updateStatus}
								id={acct.acctId}>
								<Exclamation />
							</a>
						</td>
					</tr>
				))
			);
		}
	};
	return (
		<main className='grid min-h-full place-items-center px-6 py-24 lg:px-8'>
			<div className='text-center'>
				<p className='text-3xl text-primary'>Search Users</p>
				<div className='join my-7'>
					<form onSubmit={onSubmit}>
						<input
							className='input join-item input-primary focus:outline-none'
							placeholder='Username'
							onInput={updateForm}
						/>
						<button
							className='btn join-item rounded-r-full btn-primary text-primary-content'
							type='submit'>
							Search
						</button>
					</form>
				</div>
				<p className='text-xl text-info' id='feedback'>
					Please enter a username to show data.
				</p>
				<div className='overflow-x-auto'>
					<table
						className='sm:table-xs table-sm lg:table-md xl:table-lg hidden'
						id='tableData'>
						<thead>
							<tr>
								<th />
								<th>Account No.</th>
								<th>Account ID</th>
								<th>Full Name</th>
								<th>Username</th>
								<th>Email</th>
								<th>Status</th>
								<th>Account Creation</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>{data}</tbody>
					</table>
				</div>
			</div>
		</main>
	);
}
