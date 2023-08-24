'use client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const validationSchema = Yup.object().shape({
	locationName: Yup.string().required('Location Name is required!'),
	locationAddress: Yup.string().required('Location To is required!'),
	locationLat: Yup.number().required('Location Latitude is required!'),
	locationLong: Yup.number().required('Location Longitude is required!'),
});

function SavingLocation({}) {
	const [savedLocations, setSavedLocations] = useState([]);
	const [successMessage, setSuccessMessage] = useState(false);
	const [currentLocation, setCurrentLocation] = useState(null);
	const [selectedLocationId, setSelectedLocationId] = useState(null);

	const fetchLocations = async () => {
		try {
			const response = await axios.get('/api/locations');
			const { locations } = response.data;
			setSavedLocations(locations);
		} catch (error) {
			console.error(error);
			alert('An error occurred while fetching locations.');
		}
	};

	const saveLocationToDatabase = async locationData => {
		try {
			const response = await axios.post('/api/locations', { locationData, method: 'post' });
			if (response.error) console.error(response.error);
		} catch (error) {
			console.error(error);
			window.alert('An error occurred while saving into the database.');
		}
	};

	const updateLocationInDatabase = async (locationId, locationData) => {
		try {
			await axios.post(`/api/locations`, { locationData, locationId, method: 'put' });
		} catch (error) {
			console.error(error);
			window.alert('An error occurred while updating the location.');
		}
	};

	const deleteLocationFromDatabase = async locationId => {
		try {
			await axios.post(`/api/locations`, { locationId, method: 'delete' });
		} catch (error) {
			console.error(error);
			alert('An error occurred while deleting the location.');
		}
	};

	const formik = useFormik({
		initialValues: {
			locationName: '',
			locationAddress: '',
			locationLat: '',
			locationLong: '',
		},
		validationSchema,
		onSubmit: async (values, { resetForm }) => {
			try {
				if (selectedLocationId) {
					// Update the existing location
					const data = {
						locationName: values.locationName,
						locationAddress: values.locationAddress,
						locationLat: currentLocation.lat,
						locationLong: currentLocation.lng,
					};
					await updateLocationInDatabase(selectedLocationId, data);
					setSelectedLocationId(null);
				} else {
					// Save the new location
					const data = {
						locationName: values.locationName,
						locationAddress: values.locationAddress,
						locationLat: currentLocation.lat,
						locationLong: currentLocation.lng,
					};
					await saveLocationToDatabase(data);
				}

				// Fetch the updated list of locations
				fetchLocations();

				setSuccessMessage(true);
				setTimeout(() => {
					setSuccessMessage(false);
				}, 3000);

				resetForm();
			} catch (error) {
				console.error(error);
				alert('An error occurred while saving.');
			}
		},
	});

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					setCurrentLocation({
						lat: latitude,
						lng: longitude,
					});
				},
				error => {
					console.error(error);
					alert('An error occurred while fetching location.');
				}
			);
		}
		fetchLocations();
		const pollingInterval = setInterval(() => {
			fetchLocations();
		}, 5000);

		return () => {
			clearInterval(pollingInterval);
		};
	}, []);

	const handleGetCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					// the formik.setfieldvalue part can remove if you dont wan the lat and long to be autofilled current location once button is clicked
					formik.setFieldValue('locationLat', latitude);
					formik.setFieldValue('locationLong', longitude);
					setCurrentLocation({
						lat: latitude,
						lng: longitude,
					});
					reverseGeocode(latitude, longitude);
				},
				error => {
					console.error(error);
				}
			);
		}
	};

	const reverseGeocode = async (latitude, longitude) => {
		try {
			await axios.get(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${data.apiKey}`
			);
		} catch (error) {
			console.error(error);
		}
	};

	const handleGo = location => {
		const { locationLat, locationLong } = location;

		if (locationLat && locationLong) {
			setCurrentLocation({
				lat: parseFloat(locationLat),
				lng: parseFloat(locationLong),
			});
		}
	};

	const handlePlaceChanged = () => {
		const { locationLat, locationLong } = formik.values;

		if (locationLat && locationLong) {
			setCurrentLocation({
				lat: parseFloat(locationLat),
				lng: parseFloat(locationLong),
			});
		}
	};

	const handleEditLocation = location => {
		formik.setValues({
			locationName: location.locationName,
			locationAddress: location.locationAddress,
			locationLat: location.locationLat,
			locationLong: location.locationLong,
		});
		setSelectedLocationId(location.locationId);
	};

	const handleDeleteLocation = async locationId => {
		try {
			await deleteLocationFromDatabase(locationId);
			setSavedLocations(prevLocations => {
				return prevLocations.filter(location => location.locationId !== locationId);
			});
		} catch (error) {
			console.error(error);
			alert('An error occurred while deleting the location.');
		}
	};

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: googleMapsApiKey,
		id: 'google-map-script',
	});
	const renderMap = () => {
		return isLoaded && currentLocation ? (
			<GoogleMap
				mapContainerClassName='w-full'
				mapContainerStyle={{ height: '500px' }}
				center={currentLocation}
				zoom={15}>
				<Marker position={currentLocation} />
			</GoogleMap>
		) : null;
	};

	const showMsg = () => {
		return successMessage ? (
			<p className='text-center p-2 z-40 font-success'>Location Saved</p>
		) : null;
	};

	return (
		<div className='flex p-5 text-black dark:text-white mt-12'>
			<div className='w-6/12 flex-auto'>
				<div className='bg-opacity-80 bg-secondary rounded-lg shadow-md p-5'>
					<h2 className='text-center'>Locations</h2>
				</div>
				{savedLocations.map(location => (
					<div
						key={location.locationId}
						className='bg-opacity-80 bg-secondary rounded-lg shadow-md mt-5 p-5'>
						<div className='sm:text-sm md:text-md text-lg'>
							<b>Name:</b> {location.locationName}
						</div>
						<div className='sm:text-sm md:text-md text-lg'>
							<b>Address:</b> {location.locationAddress}
						</div>
						<div className='sm:text-sm md:text-md text-lg'>
							<b>Latitude:</b> {location.locationLat}
						</div>
						<div className='sm:text-sm md:text-md text-lg'>
							<b>Longitude:</b> {location.locationLong}
						</div>
						<div className='join mt-2'>
							<button
								type='button'
								className='btn btn-primary join-item'
								onClick={() => handleEditLocation(location)}>
								Edit
							</button>
							<button
								type='button'
								className='btn btn-primary join-item'
								onClick={() => handleGo(location)}>
								Search
							</button>
							<button
								type='button'
								className='btn btn-primary join-item'
								onClick={() => handleDeleteLocation(location.locationId)}>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
			<div className='bg-opacity-80 bg-secondary p-5 rounded-lg shadow-md w-3/5 mx-4 flex-auto'>
				<h2 className='text-center'>Add Location</h2>
				<form onSubmit={formik.handleSubmit}>
					<div className='relative z-0 w-full mb-6 group'>
						<input
							type='text'
							name='locationName'
							value={formik.values.locationName}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							id='locationName'
							className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							placeholder=' '
							autoComplete='off'
						/>
						<label
							htmlFor='locationName'
							className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
							Location Name
						</label>
					</div>
					{formik.touched.locationName && formik.errors.locationName ? (
						<div className='text-error'>{formik.errors.locationName}</div>
					) : null}
					<div className='relative z-0 w-full mb-6 group'>
						<input
							type='text'
							name='locationAddress'
							value={formik.values.locationAddress}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							id='locationAddress'
							className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							placeholder=' '
							autoComplete='off'
						/>
						<label
							htmlFor='locationAddress'
							className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
							Location Address
						</label>
					</div>
					{formik.touched.locationAddress && formik.errors.locationAddress ? (
						<div className='text-error'>{formik.errors.locationAddress}</div>
					) : null}
					<div className='relative z-0 w-full mb-6 group'>
						<input
							type='number'
							name='locationLat'
							value={formik.values.locationLat}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							id='locationLat'
							className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							placeholder=' '
							autoComplete='off'
						/>
						<label
							htmlFor='locationLat'
							className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
							Latitude
						</label>
					</div>
					{formik.touched.locationLat && formik.errors.locationLat ? (
						<div className='text-error'>{formik.errors.locationLat}</div>
					) : null}
					<div className='relative z-0 w-full mb-6 group'>
						<input
							type='number'
							name='locationLong'
							value={formik.values.locationLat}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							id='locationLong'
							className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
							placeholder=' '
							autoComplete='off'
						/>
						<label
							htmlFor='locationLong'
							className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
							Longitude
						</label>
					</div>
					{formik.touched.locationLong && formik.errors.locationLong ? (
						<div className='text-error'>{formik.errors.locationLong}</div>
					) : null}
					<button
						type='button'
						className='btn btn-primary'
						onClick={handleGetCurrentLocation}>
						Use Current Location
					</button>
					<br />
					<div className='join mt-4'>
						<button
							type='button'
							className='btn btn-primary join-item'
							onClick={handlePlaceChanged}>
							Search
						</button>
						<button type='submit' className='btn btn-primary join-item'>
							Save
						</button>
					</div>
					{showMsg()}
				</form>
			</div>
			<div className='rounded-lg shadow-md bg-secondary flex-auto w-screen px-2'>
				<h2 className='text-center'>Map</h2>
				{renderMap()}
			</div>
		</div>
	);
}

export default SavingLocation;
