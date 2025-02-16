'use client';
import { Check, Trash } from '@/app/partials/icons';
import {
	Box,
	Button,
	Checkbox,
	IconButton,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const labelStyle = {
    color: 'lightgray',
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

function DriverBookings(){
    const [ isHovering, setIsHovering ] = useState( false );
    const [ isDeleteButtonHovering, setIsDeleteButtonHovering ] = useState( false );
    const [ isBookingButtonHovering, setIsBookingButtonHovering ] = useState( false );
    const [ pendingBookings, setPendingBookings ] = useState( [] );
    const [ driverBookings, setDriverBookings ] = useState( [] );
    const [ deleteModalOpen, setDeleteModalOpen ] = useState( false );
    const [ doneModalOpen, setDoneModalOpen ] = useState( false );
    const [ viewModalOpen, setViewModalOpen ] = useState( false );
    const [ viewModalOpenNo2, setViewModalOpenNo2 ] = useState( false );
    const [ pagePending, setPagePending ] = useState( 0 );
    const [ pageDriver, setPageDriver ] = useState( 0 );
    const [ bookings, setBookings ] = useState( [] ); // deletion function
    const [ selectedRows, setSelectedRows ] = useState( [] ); // for selecting multiple rows for deletion
    const [ isItemSelected, setIsItemSelected ] = useState( false );
    const [ selectedBooking, setSelectedBooking ] = useState( null );
    const [ open, setOpen ] = useState( false );
    const rowsPerPage = 5; //max rows per page = 5

    const fetchData = async() => {
        try{
            const response = await axios.get( '/api/bookings' );
            setBookings( response.data );
        } catch(error){
            console.error( 'Error fetching bookings:', error );
        }
    };

    const handleOpen = () => setOpen( true );
    const handleClose = () => {
        setOpen( false );
        window.setTimeout( () => {
            fetchData();
        }, 1000 );
    };

    const handlePageChange = (div, newPage) => {
        if(div === 'pending'){
            setPagePending( newPage );
        }else if(div === 'driver'){
            setPageDriver( newPage );
        }
    };

    const handleOpenDeleteModal = () => setDeleteModalOpen( true );
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen( false );
        window.setTimeout( () => {
            fetchData();
        }, 1000 );
    };

    const openDoneModal = bookingId => {
        const booking = driverBookings.find( booking => booking.bookingId === bookingId );
        if(booking){
            setSelectedBooking( booking );
            setDoneModalOpen( true );
        }
    };

    const closeDoneModal = bookingId => {
        setDoneModalOpen( false );
        window.setTimeout( () => {
            fetchData();
        }, 1000 );
    };

    const handleOpenViewModal = () => setViewModalOpen( true );
    const handleCloseViewModal = () => setViewModalOpen( false );

    const handleOpenviewModalno2 = () => setViewModalOpenNo2( true );
    const handleCloseviewModalno2 = () => setViewModalOpenNo2( false );

    const bookingButtonStyle = {
        padding: '8px',
        width: '30%',
        color: 'white',
        backgroundColor: '#088F8F',
        cursor: 'pointer',
    };

    useEffect( () => {
        fetchData();
    }, [] );

    const handleDrivBooking = async() => {
        try{
            await Promise.all(
                selectedRows.map( async bookingId => {
                    const bookingToUpdate = bookings.find(
                        booking => booking.bookingId === bookingId,
                    );
                    const updatedBooking = {
                        ...bookingToUpdate,
                        status: 'ongoing',
                        driverId: 2,
                    };
                    await axios.post( '/api/bookings', { updatedBooking, method: 'put' } );
                } ),
            );

            setBookings( oldBookings =>
                oldBookings.map( booking => {
                    if(selectedRows.includes( booking.bookingId )){
                        return {
                            ...booking,
                            status: 'ongoing',
                            driverId: 2,
                        };
                    }
                    return booking;
                } ),
            );

            setSelectedRows( [] );
        } catch(error){
            console.error( 'Error updating bookings:', error );
        }
    };

    const handleDelete = async bookingId => {
        try{
            await axios.post( '/api/bookings', { bookingId, method: 'delete' } );
            setBookings( oldBookings =>
                oldBookings.filter( booking => booking.bookingId !== bookingId ),
            );
        } catch(error){
            console.error( 'Error deleting booking:', error );
        }
    };

    const handleMarkDone = async e => {
        try{
            const updatedBooking = {
                ...selectedBooking,
                status: 'done',
            };
            const response = await axios.post( '/api/bookings', {
                updatedBooking,
                bookingId: selectedBooking.bookingId,
                method: 'put',
            } );
            console.log( response );
            setDriverBookings( oldDriverBookings =>
                oldDriverBookings.map( booking =>
                    booking.bookingId === selectedBooking ? { ...booking, status: 'done' } : booking,
                ),
            );
            closeDoneModal();
        } catch(error){
            console.error( 'Error updating booking status:', error );
        }
    };

    const handleSelectPending = event => {
        if(event.target.checked){
            // If the "Select All" checkbox is checked, select all pending bookings
            setSelectedRows( pendingBookings.map( booking => booking.bookingId ) );
        }else{
            // If the "Select All" checkbox is unchecked, deselect all rows
            setSelectedRows( [] );
        }
    };

    const handleSelectedRowsPending = async bookingId => {
        if(pendingBookings.some( booking => booking.bookingId === bookingId )){
            if(selectedRows.includes( bookingId )){
                setSelectedRows( oldSelectedRows =>
                    oldSelectedRows.filter( rowId => rowId !== bookingId ),
                );
            }else{
                setSelectedRows( oldSelectedRows => [ ...oldSelectedRows, bookingId ] );
            }
        }
    };

    const handleSelectID = event => {
        if(event.target.checked){
            // If the "Select All" checkbox is checked, select all pending bookings
            setSelectedRows( driverBookings.map( booking => booking.bookingId ) );
        }else{
            // If the "Select All" checkbox is unchecked, deselect all rows
            setSelectedRows( [] );
        }
    };

    const handleSelectedRowsID = async bookingId => {
        if(driverBookings.some( booking => booking.bookingId === bookingId )){
            if(selectedRows.includes( bookingId )){
                setSelectedRows( oldSelectedRows =>
                    oldSelectedRows.filter( rowId => rowId !== bookingId ),
                );
            }else{
                setSelectedRows( oldSelectedRows => [ ...oldSelectedRows, bookingId ] );
            }
        }
    };

    useEffect( () => {
        setIsItemSelected( selectedRows.length > 0 );
    }, [ selectedRows ] );

    const handleDeleteSelected = async() => {
        try{
            const bookingsToDelete = selectedRows.filter( bookingId => {
                const booking = bookings.find( booking => booking.bookingId === bookingId );
                return booking && booking.custId === 1;
            } );

            await Promise.all(
                bookingsToDelete.map( bookingId =>
                    axios.post( '/api/bookings', { bookingId, method: 'delete' } ),
                ),
            );
            setBookings( oldBookings =>
                oldBookings.filter( booking => !bookingsToDelete.includes( booking.bookingId ) ),
            );
            setSelectedRows( [] );
        } catch(error){
            console.error( 'Error deleting bookings:', error );
        }
    };

    useEffect( () => {
        // Filter bookings with "pending" status
        const pendingBookings = bookings.filter( booking => booking.status === 'pending' );
        // Filter bookings with driverId equal to 1
        const driverBookings = bookings.filter( booking => booking.driverId === 2 );

        // Update the state for each section
        setPendingBookings( pendingBookings );
        setDriverBookings( driverBookings );
    }, [ bookings ] );

    const displayedBookings = pendingBookings.slice(
        pagePending * rowsPerPage,
        pagePending * rowsPerPage + rowsPerPage,
    );

    const displayedBookingsID = driverBookings.slice(
        pageDriver * rowsPerPage,
        pageDriver * rowsPerPage + rowsPerPage,
    );

    const reloadPg = () => {
        window.location.reload();
    };

    const showDiv = () => {
        let div = document.getElementById( 'drivform' );
        if(div.style.display === 'none'){
            div.style.display = 'block';
        }else{
            div.style.display = 'none';
        }
    };

    const handleViewBooking = bookingId => {
        const booking = bookings.find( booking => booking.bookingId === bookingId );
        if(booking){
            setSelectedBooking( booking );
            handleOpenViewModal();
        }
    };

    const handleViewBookingno2 = bookingId => {
        const booking = bookings.find( booking => booking.bookingId === bookingId );
        if(booking){
            setSelectedBooking( booking );
            handleOpenviewModalno2();
        }
    };

    useEffect( () => {
        const button = document.getElementById( 'bookingButton' );
        button.addEventListener( 'click', showDiv );

        return () => {
            button.removeEventListener( 'click', showDiv );
        };
    }, [] );

    return (
        <div style={{ padding: '20px', height: '100%', display: 'flex' }}>
            <div
                style={{
                    marginRight: 'auto',
                    flex: 0.5,
                    color: 'white',
                    padding: '20px',
                    border: '4px',
                    backgroundColor: 'darkslategray',
                }}
                className="bg-secondary rounded-lg">
                <p className="text-secondary-content mb-10 text-4xl">Hi John Tan ID: 22</p>
                <p className="text-secondary-content mb-10 text-2xl">
                    Here are your current bookings :
                </p>

                <div>
                    <div style={{ height: '50vh', overflow: 'auto' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Checkbox
                                                color="primary"
                                                checked={
                                                    selectedRows.length === driverBookings.length
                                                }
                                                indeterminate={
                                                    selectedRows.length > 0 &&
                                                    selectedRows.length < driverBookings.length
                                                }
                                                onChange={handleSelectID}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ ...labelStyle, fontWeight: 'bold' }}>
                                            ID
                                        </TableCell>
                                        <TableCell sx={{ ...labelStyle, fontWeight: 'bold' }}>
                                            Date/Time
                                        </TableCell>
                                        <TableCell sx={{ ...labelStyle, fontWeight: 'bold' }}>
                                            View booking
                                        </TableCell>
                                        <TableCell sx={{ ...labelStyle, fontWeight: 'bold' }}>
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
                                                        <Check sx={{ color: 'white' }}/>
                                                    </IconButton>
                                                </div>
                                                <div style={{ margin: 'auto' }}>
                                                    <IconButton>
                                                        <Trash sx={{ color: 'white' }}/>
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedBookingsID.map( booking => (
                                        <TableRow
                                            key={booking.bookingId}
                                            style={{
                                                background: selectedRows.includes( booking.bookingId )
                                                    ? 'rgba(191, 181, 186, 0.6)'
                                                    : 'inherit',
                                            }}>
                                            <TableCell>
                                                <Checkbox
                                                    color="primary"
                                                    checked={selectedRows.includes(
                                                        booking.bookingId,
                                                    )}
                                                    onChange={() =>
                                                        handleSelectedRowsID( booking.bookingId )
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
                                                        handleViewBooking( booking.bookingId )
                                                    }
                                                    variant="contained" // Add this prop to make it a contained button
                                                    style={{ backgroundColor: '#088F8F' }} // Add your desired background color
                                                >
                                                    view
                                                </Button>
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color:
                                                        booking.status === 'ongoing'
                                                            ? '#edcd40'
                                                            : booking.status === 'done'
                                                                ? '#33b890'
                                                                : 'grey',
                                                    fontSize: '16px',
                                                }}>
                                                {' '}
                                                {booking.status}{' '}
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
                                                            onClick={() =>
                                                                openDoneModal( booking.bookingId )
                                                            }>
                                                            <Check/>
                                                        </IconButton>
                                                    </div>
                                                    <div style={{ margin: 'auto' }}>
                                                        <IconButton
                                                            onClick={() => {
                                                                handleDelete( booking.bookingId );
                                                                reloadPg();
                                                            }}>
                                                            <Trash sx={{ color: '#c40000' }}/>
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) )}
                                </TableBody>

                                {/*done modal*/}
                                <Modal
                                    open={doneModalOpen}
                                    onClose={closeDoneModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description">
                                    <Box
                                        sx={style}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'left',
                                        }}>
                                        <Typography
                                            id="modal-modal-title"
                                            sx={{ alignSelf: 'flex-start', fontWeight: 'bold' }}
                                            variant="h4"
                                            component="h2">
                                            Mark trip as done?
                                        </Typography>
                                        <hr style={{ borderTop: '2px dashed black  ' }}/>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            {selectedBooking && (
                                                <>
                                                    <h5>
                                                        <p>
                                                            Driver ID: {selectedBooking.driverId}{' '}
                                                            &nbsp; &nbsp; Customer ID:{' '}
                                                            {selectedBooking.custId}
                                                        </p>
                                                        <p>
                                                            Booking ID: {selectedBooking.bookingId}
                                                        </p>
                                                    </h5>
                                                    <hr
                                                        style={{ borderTop: '2px dashed black  ' }}
                                                    />
                                                    <p>
                                                        <b>Location From:</b>{' '}
                                                        {selectedBooking.locationFrom}
                                                    </p>
                                                    <p>
                                                        <b>Location To:</b>{' '}
                                                        {selectedBooking.locationTo}
                                                    </p>
                                                    <p>
                                                        <b>Scheduled Date/Time:</b>{' '}
                                                        {selectedBooking.scheduledDate} /{' '}
                                                        {selectedBooking.scheduledTime} HRS
                                                    </p>
                                                    <p>
                                                        <b>Status:</b> {selectedBooking.status}
                                                    </p>
                                                    <p>
                                                        <b>Payment by:</b>{' '}
                                                        {selectedBooking.paymentMethod === 'cash' ||
                                                        selectedBooking.paymentMethod === 'qrCode'
                                                            ? selectedBooking.paymentMethod.toUpperCase()
                                                            : 'CREDITCARD'}
                                                    </p>
                                                </>
                                            )}
                                        </Typography>
                                        <div
                                            style={{
                                                marginTop: 'auto',
                                                display: 'flex',
                                                gap: '10px',
                                            }}>
                                            <button
                                                style={{
                                                    padding: '8px',
                                                    width: '100px',
                                                    color: 'white',
                                                    backgroundColor: 'grey',
                                                }}
                                                onClick={closeDoneModal}>
                                                Cancel
                                            </button>
                                            <button
                                                style={{
                                                    padding: '8px',
                                                    width: '100px',
                                                    color: 'white',
                                                    backgroundColor: '#088F8F',
                                                }}
                                                onClick={() => {
                                                    handleMarkDone();
                                                    closeDoneModal();
                                                    reloadPg();
                                                }}>
                                                Confirm
                                            </button>
                                        </div>
                                    </Box>
                                </Modal>

                                {/*view modal*/}
                                <Modal
                                    open={viewModalOpen}
                                    onClose={handleCloseViewModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description">
                                    <Box
                                        sx={style}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'left',
                                        }}>
                                        <Typography
                                            id="modal-modal-title"
                                            sx={{ alignSelf: 'flex-start', fontWeight: 'bold' }}
                                            variant="h4"
                                            component="h2">
                                            Booking Details
                                        </Typography>
                                        <hr style={{ borderTop: '2px dashed black  ' }}/>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            {selectedBooking && (
                                                <>
                                                    <h5>
                                                        <p>
                                                            Driver ID: {selectedBooking.driverId}{' '}
                                                            &nbsp; &nbsp; Customer ID:{' '}
                                                            {selectedBooking.custId}
                                                        </p>
                                                        <p>
                                                            Booking ID: {selectedBooking.bookingId}
                                                        </p>
                                                    </h5>
                                                    <hr
                                                        style={{ borderTop: '2px dashed black  ' }}
                                                    />
                                                    <p>
                                                        <b>Location From:</b>{' '}
                                                        {selectedBooking.locationFrom}
                                                    </p>
                                                    <p>
                                                        <b>Location To:</b>{' '}
                                                        {selectedBooking.locationTo}
                                                    </p>
                                                    <p>
                                                        <b>Scheduled Date/Time:</b>{' '}
                                                        {selectedBooking.scheduledDate} /{' '}
                                                        {selectedBooking.scheduledTime} HRS
                                                    </p>
                                                    <p>
                                                        <b>Status:</b> {selectedBooking.status}
                                                    </p>
                                                    <p>
                                                        <b>Payment by:</b>{' '}
                                                        {selectedBooking.paymentMethod === 'cash' ||
                                                        selectedBooking.paymentMethod === 'qrCode'
                                                            ? selectedBooking.paymentMethod.toUpperCase()
                                                            : 'CREDITCARD'}
                                                    </p>
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
                        component="div"
                        count={driverBookings.length} // Total number of rows
                        page={pageDriver}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(event, newPage) => handlePageChange( 'driver', newPage )}
                        rowsPerPageOptions={[ rowsPerPage ]} // Provide only the desired rows per page value as an array
                    />

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            margin: 'auto',
                            marginTop: '30px',
                        }}>
                        <button
                            style={{
                                ...bookingButtonStyle,
                                backgroundColor: isBookingButtonHovering ? '#064f4f' : '#088F8F',
                                cursor: isBookingButtonHovering ? 'pointer' : 'default',
                            }}
                            type="button"
                            id="bookingButton"
                            onMouseOver={() => setIsBookingButtonHovering( true )}
                            onMouseOut={() => setIsBookingButtonHovering( false )}
                            className="bookingButton">
                            Pending Bookings
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
                                if(isItemSelected){
                                    handleOpenDeleteModal();
                                }
                            }}
                            disabled={!isItemSelected}
                            onMouseOver={() => {
                                if(isItemSelected) setIsDeleteButtonHovering( true );
                            }}
                            onMouseOut={() => {
                                if(isItemSelected) setIsDeleteButtonHovering( false );
                            }}
                            className="deleteButton">
                            Delete Selected
                        </button>

                        <Modal
                            open={deleteModalOpen}
                            onClose={handleCloseDeleteModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description">
                            <Box
                                sx={style}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'left',
                                }}>
                                <Typography
                                    id="modal-modal-title"
                                    sx={{ alignSelf: 'flex-start' }}
                                    variant="h4"
                                    component="h2">
                                    Delete warning!
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 4 }}>
                                    Are you sure you want to delete the following bookings:
                                </Typography>
                                <hr style={{ borderTop: '2px dashed black  ' }}/>
                                <ul style={{ color: '#088F8F', alignSelf: 'flex-start' }}>
                                    {selectedRows.map( bookingId => (
                                        <li key={bookingId}>Booking ID {bookingId}</li>
                                    ) )}
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
                id="drivform"
                style={{
                    display: 'none',
                    marginLeft: 'auto',
                    flex: 0.49,
                    backgroundColor: 'rgba(0,0,0, 0.9)',
                    padding: '20px',
                    width: '50%',
                }}>
                <h1 style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
                    Driver Booking Page
                </h1>
                <h4 style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
                    You can select bookings to process
                </h4>
                <div style={{ height: '50vh', overflow: 'auto' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            color="primary"
                                            style={{ color: 'white' }}
                                            checked={selectedRows.length === pendingBookings.length}
                                            indeterminate={
                                                selectedRows.length > 0 &&
                                                selectedRows.length < pendingBookings.length
                                            }
                                            onChange={handleSelectPending}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ ...labelStyle, fontWeight: 'bold' }}>
                                        ID
                                    </TableCell>
                                    <TableCell sx={{ ...labelStyle, fontWeight: 'bold' }}>
                                        Date/Time
                                    </TableCell>
                                    <TableCell sx={{ ...labelStyle, fontWeight: 'bold' }}>
                                        View Booking
                                    </TableCell>
                                    <TableCell sx={{ ...labelStyle, fontWeight: 'bold' }}>
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedBookings.map( booking => (
                                    <TableRow
                                        key={booking.bookingId}
                                        style={{
                                            background: selectedRows.includes( booking.bookingId )
                                                ? 'rgba(191, 181, 186, 0.6)'
                                                : 'inherit',
                                        }}>
                                        <TableCell>
                                            <Checkbox
                                                color="primary"
                                                style={{ color: 'white' }}
                                                checked={selectedRows.includes( booking.bookingId )}
                                                onChange={() =>
                                                    handleSelectedRowsPending( booking.bookingId )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontSize: '16px' }}>
                                            {booking.bookingId}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontSize: '16px' }}>
                                            {booking.scheduledDate} / {booking.scheduledTime} HRS
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                sx={{ color: 'white' }}
                                                onClick={() =>
                                                    handleViewBookingno2( booking.bookingId )
                                                }
                                                variant="contained" // Add this prop to make it a contained button
                                                style={{ backgroundColor: '#088F8F' }} // Add your desired background color
                                            >
                                                view
                                            </Button>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                color:
                                                    booking.status === 'ongoing'
                                                        ? '#edcd40'
                                                        : booking.status === 'done'
                                                            ? '#33b890'
                                                            : 'grey',
                                                fontSize: '16px',
                                            }}>
                                            {' '}
                                            {booking.status}{' '}
                                        </TableCell>
                                    </TableRow>
                                ) )}
                            </TableBody>

                            <Modal
                                open={viewModalOpenNo2}
                                onClose={handleCloseviewModalno2}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description">
                                <Box
                                    sx={style}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'left',
                                    }}>
                                    <Typography
                                        id="modal-modal-title"
                                        sx={{ alignSelf: 'flex-start', fontWeight: 'bold' }}
                                        variant="h4"
                                        component="h2">
                                        Booking Details
                                    </Typography>
                                    <hr style={{ borderTop: '2px dashed black  ' }}/>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        {selectedBooking && (
                                            <>
                                                <h5>
                                                    <p>
                                                        Driver ID: {selectedBooking.driverId} &nbsp;
                                                        &nbsp; Customer ID: {selectedBooking.custId}
                                                    </p>
                                                    <p>Booking ID: {selectedBooking.bookingId}</p>
                                                </h5>
                                                <hr style={{ borderTop: '2px dashed black  ' }}/>
                                                <p>
                                                    <b>Location From:</b>{' '}
                                                    {selectedBooking.locationFrom}
                                                </p>
                                                <p>
                                                    <b>Location To:</b> {selectedBooking.locationTo}
                                                </p>
                                                <p>
                                                    <b>Scheduled Date/Time:</b>{' '}
                                                    {selectedBooking.scheduledDate} /{' '}
                                                    {selectedBooking.scheduledTime} HRS
                                                </p>
                                                <p>
                                                    <b>Status:</b> {selectedBooking.status}
                                                </p>
                                                <p>
                                                    <b>Payment by:</b>{' '}
                                                    {selectedBooking.paymentMethod === 'cash' ||
                                                    selectedBooking.paymentMethod === 'qrCode'
                                                        ? selectedBooking.paymentMethod.toUpperCase()
                                                        : 'CREDITCARD'}
                                                </p>
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
                    component="div"
                    count={pendingBookings.length} // Total number of rows
                    page={pagePending}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(event, newPage) => handlePageChange( 'pending', newPage )}
                    rowsPerPageOptions={[ rowsPerPage ]} // Provide only the desired rows per page value as an array
                />

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                    <button
                        style={{
                            ...bookingButtonStyle,
                            cursor: isItemSelected ? 'pointer' : 'not-allowed',
                            background: isItemSelected
                                ? isHovering
                                    ? '#064f4f'
                                    : '#088F8F'
                                : 'gray',
                        }}
                        onClick={() => {
                            if(isItemSelected){
                                handleOpen();
                            }
                        }}
                        className="updateButton"
                        disabled={!isItemSelected}
                        onMouseOver={e => {
                            setIsHovering( true );
                            e.target.style.background = '#064f4f';
                        }}
                        onMouseOut={e => {
                            setIsHovering( false );
                            e.target.style.background = '#088F8F';
                        }}>
                        Accept Selected
                    </button>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description">
                        <Box
                            sx={style}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left',
                            }}>
                            <Typography
                                id="modal-modal-title"
                                sx={{ alignSelf: 'flex-start' }}
                                variant="h4"
                                component="h2">
                                Accept Booking(s)
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Are you sure you want to accept the following bookings:
                            </Typography>
                            <hr style={{ borderTop: '2px dashed black  ' }}/>
                            <ul style={{ color: '#088F8F', alignSelf: 'flex-start' }}>
                                {selectedRows.map( bookingId => (
                                    <li key={bookingId}>Booking ID {bookingId}</li>
                                ) )}
                            </ul>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                                <button
                                    style={{
                                        padding: '8px',
                                        width: '100px',
                                        color: 'white',
                                        backgroundColor: 'grey',
                                    }}
                                    onClick={handleClose}>
                                    Cancel
                                </button>

                                <button
                                    style={{
                                        padding: '8px',
                                        width: '100px',
                                        color: 'white',
                                        backgroundColor: '#088F8F',
                                    }}
                                    onClick={() => {
                                        handleDrivBooking();
                                        handleClose();
                                    }}>
                                    Confirm
                                </button>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default DriverBookings;
