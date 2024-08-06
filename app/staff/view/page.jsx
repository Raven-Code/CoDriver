'use client';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import {
    Box,
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
    TableSortLabel,
    Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const labelStyle = {
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

function StaffView(){
    const [ isHovering, setIsHovering ] = useState( false );
    const [ bookings, setBookings ] = useState( [] ); // deletion function
    const [ sortConfig, setSortConfig ] = useState( { key: null, direction: 'asc' } ); // sorting function
    const [ selectedRows, setSelectedRows ] = useState( [] ); // for selecting multiple rows for deletion
    const [ selectedBooking, setSelectedBooking ] = useState( null );
    const [ isItemSelected, setIsItemSelected ] = useState( false );
    const [ viewModalOpen, setViewModalOpen ] = useState( false );
    const [ open, setOpen ] = React.useState( false );
    const [ page, setPage ] = useState( 0 );
    const rowsPerPage = 5; //max rows per page = 5

    const handleOpen = () => setOpen( true );
    const handleClose = () => setOpen( false );

    const handleOpenViewModal = () => setViewModalOpen( true );
    const handleCloseViewModal = () => setViewModalOpen( false );

    const handlePageChange = (state, newPage) => setPage( newPage );

    const bookingButtonStyle = {
        padding: '8px',
        width: '30%',
        color: 'white',
        backgroundColor: isHovering ? '#064f4f' : '#088F8F',
        cursor: 'pointer',
    };

    useEffect( () => {
        const fetchData = async() => {
            try{
                const response = await axios.get( '/api/bookings/getbooking' );
                setBookings( response.data );
            } catch(error){
                console.error( 'Error fetching bookings:', error );
            }
        };
        fetchData();
    }, [] );

    const handleSort = field => {
        let direction = 'asc';
        if(sortConfig.key === field && sortConfig.direction === 'asc'){
            direction = 'desc';
        }
        setSortConfig( { key: field, direction } );
    };

    const handleViewBooking = bookingId => {
        // Find the booking with the matching ID in the bookings array
        const booking = bookings.find( booking => booking.bookingId === bookingId );
        // If the booking is found, update the selectedBooking state with the data
        if(booking){
            setSelectedBooking( booking );
            handleOpenViewModal(); // Open the view booking modal
        }
    };

    const sortedBookings = [ ...bookings ].sort( (a, b) => {
        if(a[sortConfig.key] < b[sortConfig.key]){
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if(a[sortConfig.key] > b[sortConfig.key]){
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    } );

    const handleDelete = async bookingId => {
        try{
            await axios.delete( `/api/bookings/deletebooking/${bookingId}` );
            setBookings( oldBookings =>
                oldBookings.filter( booking => booking.bookingId !== bookingId ),
            );
        } catch(error){
            console.error( 'Error deleting booking:', error );
        }
    };

    const handleSelectedRows = async bookingId => {
        if(selectedRows.includes( bookingId )){
            setSelectedRows( oldSelectedRows =>
                oldSelectedRows.filter( rowId => rowId !== bookingId ),
            );
        }else{
            setSelectedRows( oldSelectedRows => [ ...oldSelectedRows, bookingId ] );
        }
    };

    useEffect( () => {
        setIsItemSelected( selectedRows.length > 0 );
    }, [ selectedRows ] );

    const handleDeleteSelected = async() => {
        try{
            await Promise.all(
                selectedRows.map( bookingId =>
                    axios.delete( `/api/bookings/deletebooking/${bookingId}` ),
                ),
            );
            setBookings( oldBookings =>
                oldBookings.filter( booking => !selectedRows.includes( booking.bookingId ) ),
            );
            setSelectedRows( [] );
        } catch(error){
            console.error( 'Error deleting bookings:', error );
        }
    };

    const displayedBookings = sortedBookings.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const reloadPg = () => {
        window.location.reload();
    };

    return (
        <div
            style={{
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                padding: '20px',
            }}>
            <div
                style={{
                    display: 'inline-block',
                    // backgroundColor: 'rgba(64, 20, 115, 0.9)',
                    color: 'white',
                    padding: '20px',
                    width: '100%',
                }}>
                <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Staff View</h1>
                <h4 style={{ textAlign: 'center', marginBottom: '40px' }}>Select rows to delete</h4>
                <div style={{ height: '50vh', overflow: 'auto' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            color="primary"
                                            checked={selectedRows.length === sortedBookings.length}
                                            indeterminate={
                                                selectedRows.length > 0 &&
                                                selectedRows.length < sortedBookings.length
                                            }
                                            onChange={() =>
                                                selectedRows.length === sortedBookings.length
                                                    ? setSelectedRows( [] )
                                                    : setSelectedRows(
                                                        sortedBookings.map(
                                                            booking => booking.bookingId,
                                                        ),
                                                    )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            sx={{ ...labelStyle }}
                                            active={sortConfig.key === 'bookingId'}
                                            direction={
                                                sortConfig.key === 'bookingId'
                                                    ? sortConfig.direction
                                                    : 'asc'
                                            }
                                            onClick={() => handleSort( 'bookingId' )}>
                                            ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            sx={{ ...labelStyle }}
                                            active={sortConfig.key === 'scheduledTime'}
                                            direction={
                                                sortConfig.key === 'scheduledTime'
                                                    ? sortConfig.direction
                                                    : 'asc'
                                            }
                                            onClick={() => handleSort( 'scheduledTime' )}>
                                            Scheduled Time
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            sx={{ ...labelStyle }}
                                            active={sortConfig.key === 'scheduledDate'}
                                            direction={
                                                sortConfig.key === 'scheduledDate'
                                                    ? sortConfig.direction
                                                    : 'asc'
                                            }
                                            onClick={() => handleSort( 'scheduledDate' )}>
                                            Scheduled Date
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            sx={{ ...labelStyle }}
                                            active={sortConfig.key === 'paymentMethod'}
                                            direction={
                                                sortConfig.key === 'paymentMethod'
                                                    ? sortConfig.direction
                                                    : 'asc'
                                            }
                                            onClick={() => handleSort( 'paymentMethod' )}>
                                            Payment Method
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            sx={{ ...labelStyle }}
                                            active={sortConfig.key === 'status'}
                                            direction={
                                                sortConfig.key === 'status'
                                                    ? sortConfig.direction
                                                    : 'asc'
                                            }
                                            onClick={() => handleSort( 'status' )}>
                                            Status
                                        </TableSortLabel>
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
                                                    <PreviewIcon sx={{ color: '#088F8F' }}/>
                                                </IconButton>
                                            </div>
                                            <div style={{ margin: 'auto' }}>
                                                <IconButton>
                                                    <DeleteIcon sx={{ color: '#c40000' }}/>
                                                </IconButton>
                                            </div>
                                        </div>
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
                                                checked={selectedRows.includes( booking.bookingId )}
                                                onChange={() =>
                                                    handleSelectedRows( booking.bookingId )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontSize: '16px' }}>
                                            {booking.bookingId}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontSize: '16px' }}>
                                            {booking.scheduledTime} HRS
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontSize: '16px' }}>
                                            {booking.scheduledDate}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', fontSize: '16px' }}>
                                            {booking.paymentMethod === 'cash' ||
                                            booking.paymentMethod === 'qrCode'
                                                ? booking.paymentMethod.toUpperCase()
                                                : 'CREDITCARD'}
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
                                                            handleViewBooking( booking.bookingId )
                                                        }>
                                                        <PreviewIcon sx={{ color: '#088F8F' }}/>
                                                    </IconButton>
                                                </div>
                                                <div style={{ margin: 'auto' }}>
                                                    <IconButton
                                                        onClick={() => {
                                                            handleDelete( booking.bookingId );
                                                            reloadPg();
                                                        }}>
                                                        <DeleteIcon sx={{ color: '#c40000' }}/>
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) )}
                            </TableBody>

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
                                        {/* Step 4: Display the selected booking data inside the Modal */}
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
                    count={sortedBookings.length} // Total number of rows
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handlePageChange}
                    rowsPerPageOptions={[ rowsPerPage ]} // Provide only the desired rows per page value as an array
                />

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
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
                        className="deleteButton"
                        disabled={!isItemSelected}
                        onMouseOver={e => {
                            if(isItemSelected){
                                setIsHovering( true );
                                e.target.style.background = '#064f4f';
                            }
                        }}
                        onMouseOut={e => {
                            if(isItemSelected){
                                setIsHovering( false );
                                e.target.style.background = '#088F8F';
                            }
                        }}>
                        Delete Selected
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
                                Delete warning!
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Are you sure you want to delete the following bookings:
                            </Typography>
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
                                        backgroundColor: '#c40000',
                                    }}
                                    onClick={() => {
                                        handleDeleteSelected();
                                        reloadPg();
                                        handleClose();
                                    }}>
                                    Delete
                                </button>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default StaffView;
