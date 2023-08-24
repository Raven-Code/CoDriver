import { cxnPool } from '@/Database';

const tableName = 'bookings';

// Function to create a new booking
function createBooking(bookingData) {
	return new Promise((resolve, reject) => {
		cxnPool.getConnection((err, connection) => {
			if (err) {
				reject(err);
				return;
			}
			const insertQuery = `INSERT INTO ${tableName} (locationTo, locationFrom, scheduledTime, scheduledDate, paymentMethod, status, custId, driverId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
			const insertValues = [
				bookingData.locationTo,
				bookingData.locationFrom,
				bookingData.scheduledTime,
				bookingData.scheduledDate,
				bookingData.paymentMethod,
				bookingData.status,
				bookingData.custId,
				bookingData.driverId,
			];
			connection.query(insertQuery, insertValues, (error, results, fields) => {
				connection.release();
				if (error) {
					reject(error);
				} else {
					resolve(results.insertId); // Assuming you have an auto-incrementing bookingId in the table
				}
			});
		});
	});
}

// Function to get all bookings for a customer by their customerId
function getBookingsByCustomerId(custId) {
	return new Promise((resolve, reject) => {
		cxnPool.getConnection((err, connection) => {
			if (err) {
				reject(err);
				return;
			}

			const query = `SELECT * FROM ${tableName} WHERE custId = ?`;
			connection.query(query, [custId], (error, results, fields) => {
				connection.release();
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});
	});
}

// Function to get all bookings from the table
function getAllBookings() {
	return new Promise((resolve, reject) => {
		cxnPool.getConnection((err, connection) => {
			if (err) {
				reject(err);
				return;
			}

			const query = `SELECT * FROM ${tableName}`;
			connection.query(query, (error, results, fields) => {
				connection.release();
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});
	});
}

// Function to delete a booking by its bookingId
function deleteBooking(bookingId) {
	return new Promise((resolve, reject) => {
		cxnPool.getConnection((err, connection) => {
			if (err) {
				reject(err);
				return;
			}

			const deleteQuery = `DELETE FROM ${tableName} WHERE bookingId = ?`;
			connection.query(deleteQuery, [bookingId], (error, results, fields) => {
				connection.release();
				if (error) {
					reject(error);
				} else {
					resolve(results.affectedRows > 0);
				}
			});
		});
	});
}

// Function to delete multiple bookings by their bookingIds
function deleteSelectedBookings(bookingIds) {
	return new Promise((resolve, reject) => {
		cxnPool.getConnection((err, connection) => {
			if (err) {
				reject(err);
				return;
			}

			const deleteQuery = `DELETE FROM ${tableName} WHERE bookingId IN (?)`;
			connection.query(deleteQuery, [bookingIds], (error, results, fields) => {
				connection.release();
				if (error) {
					reject(error);
				} else {
					resolve(results.affectedRows > 0);
				}
			});
		});
	});
}

// Function to update the status and driverId for a booking
function acceptedBooking(bookingId, status, driverId) {
	return new Promise((resolve, reject) => {
		cxnPool.getConnection((err, connection) => {
			if (err) {
				reject(err);
				return;
			}

			const updateQuery = `UPDATE ${tableName} SET status = ?, driverId = ? WHERE bookingId = ?`;
			connection.query(
				updateQuery,
				[status, driverId, bookingId],
				(error, results, fields) => {
					connection.release();
					if (error) {
						reject(error);
					} else {
						resolve(results.affectedRows > 0);
					}
				}
			);
		});
	});
}

export { acceptedBooking, createBooking, deleteBooking, deleteSelectedBookings, getAllBookings, getBookingsByCustomerId };

