import { cxnPool } from '@/Database';

const tableName = "locations";

// const createLocationsTable = () => {
// 	const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS ${tableName} (
//       locationId INT AUTO_INCREMENT PRIMARY KEY,
//       locationName VARCHAR(255) NOT NULL,
//       locationAddress VARCHAR(255) NOT NULL,
//       locationLat DECIMAL(10, 6) NOT NULL,
//       locationLong DECIMAL(10, 6) NOT NULL,
//       acctId INT NOT NULL, -- New column to store the account ID
//       FOREIGN KEY (acctId) REFERENCES accounts(acctId) -- Assuming 'accounts' table has 'acctId' as the primary key
//     )
//   `;

// 	cxnPool.query(createTableQuery, (err) => {
// 		if (err) {
// 			console.error('Error creating locations table:', err);
// 		}
// 	});
// };

// // Call the function to create the table
// createLocationsTable();


// Function to save a location (create) using MySQL
const saveLocation = (locationData) => {
	const { locationName, locationAddress, locationLat, locationLong } = locationData;
	const query = `INSERT INTO ${tableName} (locationName, locationAddress, locationLat, locationLong) VALUES (?, ?, ?, ?)`;
	return new Promise((resolve, reject) => {
		cxnPool.query(query, [locationName, locationAddress, locationLat, locationLong], (err, result) => {
			if (err) {
				console.error('Error saving location:', err);
				reject(err);
			} else {
				resolve(result.insertId);
			}
		});
	});
};

const deleteLocation = (locationId) => {
	const query = `DELETE FROM ${tableName} WHERE locationId = ?`;
	return new Promise((resolve, reject) => {
		cxnPool.query(query, [locationId], (err, result) => {
			if (err) {
				console.error('Error deleting location:', err);
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
};

const updateLocation = (locationId, updatedData) => {
	const { locationName, locationAddress, locationLat, locationLong } = updatedData;
	const query = `UPDATE ${tableName} SET locationName = ?, locationAddress = ?, locationLat = ?, locationLong = ? WHERE locationId = ?`;
	return new Promise((resolve, reject) => {
		cxnPool.query(query, [locationName, locationAddress, locationLat, locationLong, locationId], (err, result) => {
			if (err) {
				console.error('Error updating location:', err);
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
};

const getLocations = () => {
	const query = `SELECT * FROM ${tableName}`;
	return new Promise((resolve, reject) => {
		cxnPool.query(query, (err, rows) => {
			if (err) {
				console.error('Error fetching locations:', err);
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

const getLocationById = (locationId) => {
	const query = `SELECT * FROM ${tableName} WHERE locationId = ?`;
	return new Promise((resolve, reject) => {
		cxnPool.query(query, [locationId], (err, row) => {
			if (err) {
				console.error('Error fetching location by ID:', err);
				reject(err);
			} else {
				resolve(row[0]);
			}
		});
	});
};

const getLocationsByAccountId = (req, res) => {
	const { acctId } = req.params;
	const query = `SELECT * FROM locations WHERE acctId = ?`;
	locationPool.query(query, [acctId], (err, results) => {
		if (err) {
			console.error('Error fetching locations:', err);
			res.status(500).json({ error: 'An error occurred while fetching locations.' });
		} else {
			res.status(200).json(results);
		}
	});
};

export { deleteLocation, getLocationById, getLocations, getLocationsByAccountId, saveLocation, updateLocation };

