'use client';
import { Trash } from '@/app/partials/icons';
import {
	Alert,
	Box,
	Button,
	Checkbox,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import SavedLocation from '../../location/view/page';
export const metadata = {
	title: 'Booking - Customer | CoDriver',
};
const lableStyle = {
	color: 'white',
	fontSize: '20px',
	'& .MuiTableSortLabel-icon': {
		color: 'white !important',
	},
};

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	height: 500,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	overflow: 'auto',
	boxShadow: 24,
	p: 4,
};

const validationSchema = Yup.object().shape({
	locationTo: Yup.string().required('Location To is required!'),
	locationFrom: Yup.string().required('Location From is required!'),
	scheduledTime: Yup.number()
		.required('Time is required!')
		.test('isValidTime', 'Invalid time format', value => {
			// Regular expression to check if the input matches the 24-hour clock format (HH:mm)
			const timePattern = /^(?:2[0-3]|[01]?[0-9])[0-5][0-9]$/;
			return timePattern.test(value);
		}),
	scheduledDate: Yup.date()
		.required('Date is required!')
		.min(new Date(), 'Date cannot be in the past!'),
	paymentMethod: Yup.string().required('Payment Method is required!'),
});

const bookingButtonStyle = {
	padding: '8px',
	width: '30%',
	color: 'white',
	backgroundColor: '#088F8F',
	cursor: 'pointer',
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY || '');

function CustomerBookingsUnwrapped() {
	const [isDeleteButtonHovering, setIsDeleteButtonHovering] = useState(false);
	const [isBookingButtonHovering, setIsBookingButtonHovering] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [bookings, setBookings] = useState([]); // deletion function
	const [filteredBookings, setFilteredBookings] = useState([]);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]); // for selecting multiple rows for deletion
	const [isItemSelected, setIsItemSelected] = useState(false);
	const [page, setPage] = useState(0);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [showCreditCardPopup, setShowCreditCardPopup] = useState(false);
	const [creditCardValid, setCreditCardValid] = useState(false);
	const [showSavedLocationTo, setShowSavedLocationTo] = useState(false);
	const [selectedLocationTo, setSelectedLocationTo] = useState('');
	const [showSavedLocationFrom, setShowSavedLocationFrom] = useState(false);
	const [selectedLocationFrom, setSelectedLocationFrom] = useState('');
	const [accountName, setAccountName] = useState(''); // Replace the default value with an empty string or any other appropriate value
	const locationToRef = useRef();
	const locationFromRef = useRef();

	const fetchData = async () => {
		try {
			const response = await axios.get(`/api/bookings?custId=${1}`);
			setBookings([...response.data]);
		} catch (error) {
			console.error('Error fetching bookings:', error);
		}
	};

	const handleLocationToSelect = locationName => {
		setSelectedLocationTo(locationName);
		formik.setFieldValue('locationTo', locationName); // Update formik's locationTo value
		setShowSavedLocationTo(false); // Hide the overlay when a location is selected
	};

	const handleLocationFromSelect = locationName => {
		setSelectedLocationFrom(locationName);
		formik.setFieldValue('locationFrom', locationName); // Update formik's locationFrom value
		setShowSavedLocationFrom(false); // Hide the overlay when a location is selected
	};

	const handleLocationToFieldClick = () => {
		setShowSavedLocationTo(prev => !prev); // Toggle the showSavedLocationTo state
	};

	const handleLocationFromFieldClick = () => {
		setShowSavedLocationFrom(prev => !prev); // Toggle the showSavedLocationFrom state
	};

	const rowsPerPage = 5; //max rows per page = 5

	const handlePageChange = (state, newPage) => setPage(newPage);

	const handleCloseSnackbar = () => setOpenSnackbar(false);

	const stripe = useStripe();
	const elements = useElements();

	const handleOpenDeleteModal = () => setDeleteModalOpen(true);
	const handleCloseDeleteModal = () => {
		setDeleteModalOpen(false);
		setTimeout(() => {
			fetchData();
		}, 1000);
	};

	const handleOpenViewModal = () => setViewModalOpen(true);
	const handleCloseViewModal = () => setViewModalOpen(false);

	useEffect(() => {
		const handleClick = e => {
			//     handleClickOutside(e);
		};

		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, []);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		const filtered = bookings.filter(booking => booking.custId === 1);
		setFilteredBookings(filtered);
		setPage(0);
	}, [bookings]);

	useEffect(() => {
		setIsItemSelected(selectedRows.length > 0);
	}, [selectedRows]);

	useEffect(() => {
		const button = document.getElementById('bookingButton');
		button.addEventListener('click', showDiv2);

		return () => {
			button.removeEventListener('click', showDiv2);
		};
	}, []);

	const handleCreditCardSubmit = async event => {
		event.preventDefault();

		try {
			if (!stripe || !elements) {
				// Stripe is not loaded yet, do not proceed
				return;
			}

			// Create a payment method using the CardElement
			const cardElement = elements.getElement(CardElement);
			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: 'card',
				card: cardElement,
			});

			if (error) {
				console.error('Error creating payment method:', error);
				// Handle error (e.g., show error message to the user)
			} else {
				// Payment method was created successfully
				// You can now submit the booking form with the payment method ID
				// and other required booking data
				formik.setFieldValue('paymentMethod', paymentMethod.id);
				setShowCreditCardPopup(false); // Close the credit card popup
				formik.handleSubmit(); // Submit the main booking form
			}
		} catch (error) {
			console.error('Error submitting credit card details:', error);
			// Handle error (e.g., show error message to the user)
		}
	};

	const handleFormSubmit = async (values, { resetForm }) => {
		try {
			const data = {
				locationTo: values.locationTo,
				locationFrom: values.locationFrom,
				scheduledTime: values.scheduledTime,
				scheduledDate: values.scheduledDate,
				paymentMethod: values.paymentMethod,
				status: 'pending',
				custId: 1,
				driverId: null,
			};
			if (values.paymentMethod === 'creditCard') {
				// Step 3: Show the credit card popup when the payment method is "creditCard"
				setShowCreditCardPopup(true);
			} else {
				// Step 6: If the payment method is not "creditCard," post the form data directly
				await axios.post('/api/bookings', { data, method: 'post' });
				window.location.href = '#';
				setOpenSnackbar(true);
				resetForm();
				fetchData();
			}
		} catch (err) {
			console.error(err);
			window.alert('An error occurred while submitting the booking.');
		}
	};

	const formik = useFormik({
		initialValues: {
			locationTo: '',
			locationFrom: '',
			scheduledTime: '',
			scheduledDate: '',
			paymentMethod: '',
		},
		validationSchema,
		onSubmit: handleFormSubmit,
	});

	const handleDelete = async bookingId => {
		try {
			await axios.post('/api/bookings', { bookingId, method: 'delete' });
			setBookings(oldBookings =>
				oldBookings.filter(booking => booking.bookingId !== bookingId)
			);
		} catch (error) {
			console.error('Error deleting booking:', error);
		}
	};

	const handleSelectedRows = async bookingId => {
		if (filteredBookings.some(booking => booking.bookingId === bookingId)) {
			if (selectedRows.includes(bookingId)) {
				setSelectedRows(oldSelectedRows =>
					oldSelectedRows.filter(rowId => rowId !== bookingId)
				);
			} else {
				setSelectedRows(oldSelectedRows => [...oldSelectedRows, bookingId]);
			}
		}
	};

	const handleDeleteSelected = async () => {
		try {
			const bookingsToDelete = selectedRows.filter(bookingId => {
				const booking = bookings.find(booking => booking.bookingId === bookingId);
				return booking && booking.custId === 1;
			});

			await Promise.all(
				bookingsToDelete.map(bookingId =>
					axios.post('/api/bookings', { bookingId, method: 'delete' })
				)
			);
			setBookings(oldBookings =>
				oldBookings.filter(booking => !bookingsToDelete.includes(booking.bookingId))
			);
			setSelectedRows([]);
		} catch (error) {
			console.error('Error deleting bookings:', error);
		}
	};

	const displayedBookings = filteredBookings.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	const showSnackbar = () => {
		return (
			<div style={{ position: 'relative' }}>
				<Snackbar
					open={openSnackbar}
					autoHideDuration={5000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}>
					<Alert onClose={handleCloseSnackbar} severity='success' sx={{ width: '100%' }}>
						Booking submitted successfully!
					</Alert>
				</Snackbar>
			</div>
		);
	};

	const showDiv2 = () => {
		let div = document.getElementById('custform');
		if (div.style.display === 'none') {
			div.style.display = 'block';
		} else {
			div.style.display = 'none';
		}
	};

	const handleViewBooking = bookingId => {
		// Find the booking with the matching ID in the bookings array
		const booking = bookings.find(booking => booking.bookingId === bookingId);
		// If the booking is found, update the selectedBooking state with the data
		if (booking) {
			setSelectedBooking(booking);
			handleOpenViewModal(); // Open the view booking modal
		}
	};

	return (
		<div style={{ padding: '20px', height: '100%', display: 'flex', columnGap: '20px' }}>
			<div
				style={{
					display: 'block',
					marginRight: 'auto',
					flex: 0.5,
					backgroundColor: 'rgba(0, 0, 0, 0.9)',
					color: 'white',
					padding: '20px',
					width: '50%',
					height: '100%',
				}}>
				<h1 style={{ textAlign: 'left', marginBottom: '40px' }} className='text-4xl'>
					Hi John Tan ID: 22
				</h1>
				<h4 style={{ textAlign: 'left', marginBottom: '40px' }} className='text-2xl'>
					Here are your current bookings :
				</h4>
				<div>
					<div style={{ height: '50vh', overflow: 'auto' }}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>
											<Checkbox
												color='primary'
												style={{
													color: 'white',
												}}
												checked={
													selectedRows.length === filteredBookings.length
												}
												indeterminate={
													selectedRows.length > 0 &&
													selectedRows.length < filteredBookings.length
												}
												onChange={() =>
													selectedRows.length === filteredBookings.length
														? setSelectedRows([])
														: setSelectedRows(
																filteredBookings.map(
																	booking => booking.bookingId
																)
														  )
												}
											/>
										</TableCell>
										<TableCell sx={{ ...lableStyle, fontWeight: 'bold' }}>
											ID
										</TableCell>
										<TableCell sx={{ ...lableStyle, fontWeight: 'bold' }}>
											Date/Time
										</TableCell>
										<TableCell sx={{ ...lableStyle, fontWeight: 'bold' }}>
											View booking
										</TableCell>
										<TableCell sx={{ ...lableStyle, fontWeight: 'bold' }}>
											Status
										</TableCell>
										<TableCell>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													flexWrap: 'wrap',
												}}>
												<div style={{ margin: 'auto' }}>
													<IconButton>
														<Trash sx={{ color: 'white' }} />
													</IconButton>
												</div>
											</div>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{displayedBookings.map(booking => (
										<TableRow
											key={booking.bookingId}
											style={{
												background: selectedRows.includes(booking.bookingId)
													? 'rgba(191, 181, 186, 0.6)'
													: 'inherit',
											}}>
											<TableCell>
												<Checkbox
													color='primary'
													style={{
														color: 'white',
													}}
													checked={selectedRows.includes(
														booking.bookingId
													)}
													onChange={() =>
														handleSelectedRows(booking.bookingId)
													}
												/>
											</TableCell>
											<TableCell sx={{ color: 'white', fontSize: '16px' }}>
												{booking.bookingId}
											</TableCell>
											<TableCell sx={{ color: 'white', fontSize: '16px' }}>
												{booking.scheduledDate} / {booking.scheduledTime}{' '}
												HRS
											</TableCell>
											<TableCell>
												<Button
													sx={{ color: 'white' }}
													onClick={() =>
														handleViewBooking(booking.bookingId)
													}
													variant='contained' // Add this prop to make it a contained button
													style={{ backgroundColor: '#088F8F' }} // Add your desired background color
												>
													view
												</Button>
											</TableCell>
											<TableCell sx={{ color: 'white', fontSize: '16px' }}>
												{booking.status}
											</TableCell>
											<TableCell>
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														flexWrap: 'wrap',
													}}>
													<div style={{ margin: 'auto' }}>
														<IconButton
															onClick={() => {
																handleDelete(booking.bookingId);
															}}>
															<Trash sx={{ color: '#c40000' }} />
														</IconButton>
													</div>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>

								<Modal
									open={viewModalOpen}
									onClose={handleCloseViewModal}
									aria-labelledby='modal-modal-title'
									aria-describedby='modal-modal-description'>
									<Box
										sx={style}
										style={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'left',
										}}>
										<Typography
											id='modal-modal-title'
											sx={{ alignSelf: 'flex-start', fontWeight: 'bold' }}
											variant='h4'
											component='h2'>
											Booking Details
										</Typography>
										<hr style={{ borderTop: '2px dashed black  ' }} />
										<Typography id='modal-modal-description' sx={{ mt: 2 }}>
											{/* Step 4: Display the selected booking data inside the Modal */}
											{selectedBooking && (
												<>
													<h5>
														<p>Driver ID: {selectedBooking.driverId}</p>
														<p>Customer ID: {selectedBooking.custId}</p>
													</h5>
													<hr
														style={{ borderTop: '2px dashed black  ' }}
													/>
													<p>Booking ID: {selectedBooking.bookingId}</p>
													<p>
														Location From:{' '}
														{selectedBooking.locationFrom}
													</p>
													<p>Location To: {selectedBooking.locationTo}</p>
													<p>
														Scheduled Date:{' '}
														{selectedBooking.scheduledDate}
													</p>
													<p>
														Scheduled Time:{' '}
														{selectedBooking.scheduledTime}
													</p>
													<p>Status: {selectedBooking.status}</p>
												</>
											)}
										</Typography>
									</Box>
								</Modal>
							</Table>
						</TableContainer>
					</div>

					<TablePagination
						sx={{
							color: '#C0C0C0',
							fontWeight: 'bold',
							'.MuiTablePagination-displayedRows': {
								margin: 'auto',
								textAlign: 'center',
								fontSize: '20px',
							},
						}}
						component='div'
						count={filteredBookings.length} // Total number of rows
						page={page}
						rowsPerPage={rowsPerPage}
						onPageChange={handlePageChange}
						rowsPerPageOptions={[rowsPerPage]} // Provide only the desired rows per page value as an array
					/>

					<div
						style={{ display: 'flex', justifyContent: 'space-evenly', margin: 'auto' }}>
						<button
							style={{
								...bookingButtonStyle,
								backgroundColor: isBookingButtonHovering ? '#064f4f' : '#088F8F',
								cursor: isBookingButtonHovering ? 'pointer' : 'default',
							}}
							type='button'
							id='bookingButton'
							onMouseOver={() => setIsBookingButtonHovering(true)}
							onMouseOut={() => setIsBookingButtonHovering(false)}
							className='bookingButton'>
							Make a booking
						</button>

						<button
							style={{
								...bookingButtonStyle,
								cursor: isItemSelected ? 'pointer' : 'not-allowed',
								backgroundColor: isItemSelected
									? isDeleteButtonHovering
										? '#064f4f'
										: '#088F8F'
									: 'gray',
							}}
							onClick={() => {
								if (isItemSelected) {
									handleOpenDeleteModal();
								}
							}}
							disabled={!isItemSelected}
							onMouseOver={() => {
								if (isItemSelected) setIsDeleteButtonHovering(true);
							}}
							onMouseOut={() => {
								if (isItemSelected) setIsDeleteButtonHovering(false);
							}}
							className='deleteButton'>
							Delete Selected
						</button>

						<Modal
							open={deleteModalOpen}
							onClose={handleCloseDeleteModal}
							aria-labelledby='modal-modal-title'
							aria-describedby='modal-modal-description'>
							<Box
								sx={style}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'left',
								}}>
								<Typography
									id='modal-modal-title'
									sx={{ alignSelf: 'flex-start' }}
									variant='h4'
									component='h2'>
									Delete warning!
								</Typography>
								<Typography id='modal-modal-description' sx={{ mt: 4 }}>
									Are you sure you want to delete the following bookings:
								</Typography>
								<hr style={{ borderTop: '2px dashed black  ' }} />
								<ul style={{ color: '#088F8F', alignSelf: 'flex-start' }}>
									{selectedRows.map(bookingId => (
										<li key={bookingId}>Booking ID {bookingId}</li>
									))}
								</ul>
								<div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
									<button
										style={{
											padding: '8px',
											width: '100px',
											color: 'white',
											backgroundColor: 'grey',
										}}
										onClick={handleCloseDeleteModal}>
										Cancel
									</button>

									<button
										style={{
											padding: '8px',
											width: '100px',
											color: 'white',
											backgroundColor: '#c40000',
										}}
										onClick={() => {
											handleDeleteSelected();
											handleCloseDeleteModal();
										}}>
										Delete
									</button>
								</div>
							</Box>
						</Modal>
					</div>
				</div>
			</div>

			<div
				id='custform'
				style={{
					display: 'none',
					marginLeft: 'auto',
					flex: 0.5,
					backgroundColor: 'rgba(255, 255, 255, 0.9)',
					color: 'white',
					padding: '20px',
					width: '50%',
					height: '100%',
				}}>
				<h1 style={{ textAlign: 'center', color: 'black', marginBottom: '40px' }}>
					Customer Booking Page
				</h1>
				<h4 style={{ textAlign: 'center', color: 'black', marginBottom: '40px' }}>
					Create a booking below!
				</h4>

				<form onSubmit={formik.handleSubmit}>
					<div style={{ padding: '20px', height: '50vh' }}>
						<div style={{ marginBottom: '20px' }}>
							<TextField
								color='secondary'
								fullWidth
								id='locationTo'
								name='locationTo'
								label='Location To'
								placeholder='Select a location'
								value={formik.values.locationTo}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.touched.locationTo && Boolean(formik.errors.locationTo)
								}
								helperText={formik.touched.locationTo && formik.errors.locationTo}
								onClick={handleLocationToFieldClick}
								ref={locationToRef}
							/>
							{showSavedLocationTo && (
								<div
									style={{
										position: 'absolute',
										top: '100%',
										left: 0,
										right: 0,
										bottom: 0,
										zIndex: 1,
										background: 'rgba(0, 0, 0, 0.5)',
									}}>
									<SavedLocation onLocationSelect={handleLocationToSelect} />
								</div>
							)}
						</div>

						<div style={{ marginBottom: '20px' }}>
							<TextField
								color='secondary'
								fullWidth
								id='locationFrom'
								name='locationFrom'
								label='Location From'
								placeholder='Select a location'
								value={formik.values.locationFrom}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.touched.locationFrom &&
									Boolean(formik.errors.locationFrom)
								}
								helperText={
									formik.touched.locationFrom && formik.errors.locationFrom
								}
								onClick={handleLocationFromFieldClick}
								ref={locationFromRef}
							/>
							{showSavedLocationFrom && (
								<div
									style={{
										position: 'absolute',
										top: '100%',
										left: 0,
										right: 0,
										bottom: 0,
										zIndex: 1,
										background: 'rgba(0, 0, 0, 0.5)',
									}}>
									<SavedLocation onLocationSelect={handleLocationFromSelect} />
								</div>
							)}
						</div>

						<div
							style={{
								marginBottom: '20px',
								display: 'flex',
								justifyContent: 'space-between',
							}}>
							<TextField
								color='secondary'
								fullWidth
								id='scheduledTime'
								name='scheduledTime'
								label='Scheduled Time'
								type='number'
								placeholder='24 hour standard (xxxx)'
								value={formik.values.scheduledTime}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								style={{ width: '40%' }}
								error={
									formik.touched.scheduledTime &&
									Boolean(formik.errors.scheduledTime)
								}
								helperText={
									formik.touched.scheduledTime && formik.errors.scheduledTime
								}
							/>

							<TextField
								color='secondary'
								fullWidth
								id='scheduledDate'
								name='scheduledDate'
								type='date'
								value={formik.values.scheduledDate}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								style={{ width: '40%' }}
								error={
									formik.touched.scheduledDate &&
									Boolean(formik.errors.scheduledDate)
								}
								helperText={
									formik.touched.scheduledDate && formik.errors.scheduledDate
								}
							/>
						</div>

						<div
							style={{
								marginBottom: '20px',
								display: 'flex',
								justifyContent: 'space-between',
							}}>
							<FormControl style={{ width: '40%' }}>
								<InputLabel>Payment Method</InputLabel>
								<Select
									color='secondary'
									id='paymentMethod'
									name='paymentMethod'
									value={formik.values.paymentMethod}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={
										formik.touched.paymentMethod &&
										Boolean(formik.errors.paymentMethod)
									}>
									<MenuItem value=''>Select Payment Method</MenuItem>
									<MenuItem value='creditCard'>Credit Card</MenuItem>
									<MenuItem value='cash'>Cash</MenuItem>
									<MenuItem value='qrCode'>QR Code</MenuItem>
								</Select>
							</FormControl>

							<div style={{ width: '40%' }}>
								<TextField
									color='secondary'
									type='text'
									label='Fare Cost'
									value={'$$$$'}
									InputProps={{
										readOnly: true,
									}}
								/>
							</div>
						</div>
					</div>

					<div>{showSnackbar()}</div>

					<div
						style={{
							alignItems: 'center',
							justifyContent: 'space-around',
							display: 'flex',
							marginTop: '52px',
							position: 'sticky',
						}}>
						<button
							type='submit'
							disabled={!formik.isValid}
							style={{
								width: '30%',
								padding: '8px',
								color: 'white',
								backgroundColor: formik.isValid ? '#088F8F' : 'rgba(0,0,0,0.6)',
								cursor: formik.isValid ? 'pointer' : 'not-allowed',
							}}
							onMouseOver={e => {
								if (formik.isValid) {
									e.target.style.backgroundColor = '#064f4f';
								}
							}}
							onMouseOut={e => {
								if (formik.isValid) {
									e.target.style.backgroundColor = '#088F8F';
								}
							}}>
							Submit
						</button>
					</div>
				</form>
				{showCreditCardPopup && (
					<Modal
						open={showCreditCardPopup}
						onClose={() => {
							setShowCreditCardPopup(false), setCreditCardValid(false);
						}}
						aria-labelledby='modal-modal-title'
						aria-describedby='modal-modal-description'>
						<Box
							sx={style}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'left',
							}}>
							<Typography
								id='modal-modal-title'
								sx={{ alignSelf: 'flex-start', fontWeight: 'bold' }}
								variant='h4'
								component='h2'>
								Credit Card Details
							</Typography>
							<hr style={{ borderTop: '2px dashed black' }} />
							<form onSubmit={handleCreditCardSubmit}>
								<div>
									<CardElement
										options={{
											style: {
												base: {
													fontSize: '16px',
													color: '#424770',
													'::placeholder': {
														color: '#aab7c4',
													},
												},
												invalid: {
													color: '#9e2146',
												},
											},
										}}
										onChange={event => setCreditCardValid(event.complete)}
									/>
								</div>
								<div style={{ marginTop: '50%', display: 'flex', gap: '10px' }}>
									<button
										style={{
											padding: '8px',
											width: '100px',
											color: 'white',
											backgroundColor: 'grey',
										}}
										onClick={() => {
											setShowCreditCardPopup(false),
												setCreditCardValid(false);
										}}>
										Cancel
									</button>
									<button
										type='submit'
										style={{
											color: 'white',
											width: '100px',
											backgroundColor: creditCardValid ? '#088F8F' : 'gray',
											cursor: creditCardValid ? 'pointer' : 'not-allowed',
										}}
										disabled={!creditCardValid}>
										Submit
									</button>
								</div>
							</form>
						</Box>
					</Modal>
				)}
			</div>
		</div>
	);
}

const CustomerBookings = () => (
	<Elements stripe={stripePromise}>
		<CustomerBookingsUnwrapped />
	</Elements>
);

export default CustomerBookings;
