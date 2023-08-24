/*
Accounts Table
| acctNo (PK) | acctID  (FK) | Name | Username | Password | Email | Status | Date Joined |

Customer Table
| acctID (PK) | Points |

Staff Table
| acctID (PK) | Role |

Accounts Methods: getID, getName, getUsername, getPassword, getEmail, deleteAccount, createAccount, updateAccount

Access gui: https://www.phpmyadmin.co/
*/
import mysql from 'mysql2';
import { encrypt, getDate } from './Utils';
// Create a connection pool to the database
export const cxnPool = mysql.createPool({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	waitForConnections: true,
	connectionLimit: 1_000_000,
	maxIdle: 1_000_000, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60_000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
});
const tableName = { accounts: 'accounts', customer: 'customer', staff: 'staff' };

/**This function takes a SQL query as a parameter and executes it using a connection pool. It returns a promise that resolves with the query result if the execution is successful, or rejects with an error message if an error occurs.
 * @param query - The SQL query to execute.
 * @returns A promise that resolves with the query result if successful, or rejects with an error message if an error occurs.
 * @throws If an error occurs during query execution. */
async function query(query: string): Promise<any> {
	return new Promise((resolve, reject) =>
		cxnPool.query(query, (error: any, data: any) => (error ? reject(error) : resolve(data)))
	);
}

/**Retrieves information for all accounts.
 * @returns A promise that resolves with an array of all accounts if successful, or rejects with an error message if an error occurs.
 * @throws If an error occurs during account retrieval. */
async function getAllAcct(): Promise<any> {
	try {
		return await query(`SELECT * FROM ${tableName.accounts}`);
	} catch (e) {
		throw new Error(`Failed to get all accounts. ${e}`);
	}
}

/**Retrieves information for a specific account.
 * @param option - The account ID or username to identify the account.
 * @returns A promise that resolves with the account information if successful, or rejects with an error message if an error occurs.
 * @throws If an error occurs during account retrieval. */
async function getUserInfo(option: string): Promise<any> {
	try {
		return await query(
			`SELECT * FROM ${tableName.accounts} WHERE ${
				option.includes('-') ? 'acctId' : 'username'
			} = '${option}'`
		);
	} catch (e) {
		throw new Error(`Failed to get ${option}'s info. ${e}`);
	}
}

/**Updates data for a specific account.
 * @param option - The account ID or username to identify the account.
 * @param data - The updated account data.
 * @returns A promise that resolves if the update is successful, or rejects with an error message if an error occurs.
 * @throws If an error occurs during data update. */
async function updateData(option: string, data: Object): Promise<boolean> {
	try {
		const acctId = option.includes('-') ? option : (await getUserInfo(option))[0].acctId;
		if (!acctId) throw new Error(`Invalid arguments! ${option}`); // Invalid acctId
		const newData = { ...(await getUserInfo(acctId))[0], ...data };
		await query(
			`UPDATE ${tableName.accounts} SET name = '${newData.name}', username = '${newData.username}', password = '${newData.password}', email = '${newData.email}', status = '${newData.status}', dateCreated = '${newData.dateCreated}' WHERE acctId = '${acctId}'`
		);
		return true;
	} catch (e) {
		throw new Error(`Failed to update Data. ${e}`);
	}
}

/**Creates a new account.
 * @param acctType - The type of the account (customer, driver, staff).
 * @param name - The name of the account holder.
 * @param user - The username for the account.
 * @param email - The email address for the account.
 * @param pass - The password for the account.
 * @returns A promise that resolves to null if successful, or rejects with an error message if an error occurs.
 * @throws If an invalid account type is provided or if an error occurs during account creation. */
async function createAcct(
	acctType: string,
	name: string,
	user: string,
	email: string,
	pass: string
): Promise<string> {
	if (!['customer', 'driver', 'staff'].includes(acctType)) {
		throw new Error(`Invalid account type, got ${acctType}`);
	}
	try {
		const acctId = `${acctType[0].toUpperCase()}-${
			((
				await query(
					`SELECT MAX(CAST(SUBSTRING_INDEX(acctId, '-', -1) AS UNSIGNED)) AS num FROM ${
						tableName.accounts
					} WHERE acctId LIKE '${acctType[0].toUpperCase()}-%'`
				)
			)[0].num || 0) + 1
		}`;
		await query(
			`INSERT INTO ${
				tableName.accounts
			} (acctId, name, username, password, email, status, dateCreated) VALUES ('${acctId}', '${name}', '${user}', '${await encrypt(
				pass
			)}', '${email}', 'active', '${getDate()}')`
		);
		if (acctType === 'staff') {
			await query(
				`INSERT INTO ${tableName.staff} (acctId, role) VALUES ('${acctId}', 'admin')`
			);
		} else {
			await query(
				`INSERT INTO ${tableName.customer} (acctId, points) VALUES ('${acctId}', 2)`
			);
		}
		return 'true';
	} catch (e) {
		console.error(e);
		return `Failed to insert account data. ${e}`;
	}
}

/**Deletes an account and related data.
 * @param option - The account ID to identify the account.
 * @returns A promise that resolves if the deletion is successful, or rejects with an error message if an error occurs.
 * @throws If an error occurs during account deletion. */
async function deleteAcct(option: string): Promise<boolean> {
	try {
		await query(`DELETE FROM ${tableName.accounts} WHERE acctId = '${option}'`);
		await query(
			`DELETE FROM ${
				option.includes('D') ? tableName.staff : tableName.customer
			} WHERE acctId = '${option}'`
		);
		return true;
	} catch (e) {
		throw new Error(`Failed to delete ${option}'s data. ${e}`);
	}
}
export { createAcct, deleteAcct, getAllAcct, getUserInfo, query, updateData };
