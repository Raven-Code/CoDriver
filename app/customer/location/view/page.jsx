'use client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { useEffect, useState } from 'react';

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function SavedLocation({ onLocationSelect }){
    const [ savedLocations, setSavedLocations ] = useState( [] );
    const [ currentLocation, setCurrentLocation ] = useState( null );
    const [ selectedLocation, setSelectedLocation ] = useState( null );

    const handleLocationSelection = locationName => {
        try{
            onLocationSelect( locationName );
        } catch(e){/**/
        }
    };

    const handleViewLocation = location => {
        setSelectedLocation( location );
        setCurrentLocation( {
            lat: parseFloat( location.locationLat ),
            lng: parseFloat( location.locationLong ),
        } );
    };

    const handleGetCurrentLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation( {
                        lat: latitude,
                        lng: longitude,
                    } );
                },
                error => {
                    console.error( error );
                    alert( 'An error occurred while fetching location.' );
                },
            );
        }
    };

    const fetchLocations = async() => {
        try{
            const response = await axios.get( '/api/locations' );
            const { locations } = response.data;
            setSavedLocations( locations );
        } catch(error){
            console.error( error );
            alert( 'An error occurred while fetching locations.' );
        }
    };

    useEffect( () => {
        fetchLocations();

        navigator.geolocation.getCurrentPosition(
            position => {
                setCurrentLocation( {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                } );
            },
            error => {
                console.error( 'Error getting current location:', error );
            },
        );
    }, [] );

    const { isLoaded } = useJsApiLoader( {
        googleMapsApiKey: googleMapsApiKey,
        id: 'google-map-script',
    } );

    const renderMap = () => {
        return isLoaded && currentLocation ? (
            <GoogleMap
                mapContainerClassName="w-full mb-3"
                mapContainerStyle={{ height: '350px' }}
                center={currentLocation}
                zoom={15}>
                <Marker position={currentLocation}/>
            </GoogleMap>
        ) : null;
    };
    return (
        <div className="mx-3">
            {renderMap()}
            <div className="flex items-center">
                <h2 className="text-2xl me-3">Saved Locations</h2>
                <button onClick={handleGetCurrentLocation} className="btn btn-primary">
                    Current Location
                </button>
            </div>
            <div className="flex my-5 sm:flex-row flex-col justify-center items-center">
                {savedLocations.map( location => (
                    <div
                        key={location.locationId}
                        className="flex items-center justify-center bg-secondary rounded-lg w-72 mx-2 p-2">
                        <button
                            onClick={() => handleLocationSelection( location.locationName )}
                            className="cursor-pointer text-secondary-content">
                            <p>
                                <b>Location Name:</b> {location.locationName}
                            </p>
                            <p>
                                <b>Location Address:</b> {location.locationAddress}
                            </p>
                            <p>
                                <b>Latitude:</b> {location.locationLat}
                            </p>
                            <p>
                                <b>Longitude:</b> {location.locationLong}
                            </p>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleViewLocation( location )}
                            className="btn btn-primary ms-2">
                            View
                        </button>
                    </div>
                ) )}
            </div>
        </div>
    );
}
