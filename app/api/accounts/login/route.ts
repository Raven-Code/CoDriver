import { getUserInfo } from '@/Database';
import { checkEnc, jwtSign, sendNotification } from '@/Utils';
import { NextRequest, NextResponse } from 'next/server';
export const metadata = {
	title: 'Login | CoDriver',
};
/**
 * Handles a POST request to create a new account.
 *
 * @param req The request object containing the request body.
 * @returns A NextResponse object with the result of the account creation.
 */
export async function POST(req: NextRequest) {
	try {
		const data = await req.json(); // Get the request body
		// Data validation
		if (!data.username || !data.password) {
			return new NextResponse('Invalid input data', { status: 400 });
		}

		// Get data from database & validate password
		const [{ acctId, password, name, acctNo }] = await getUserInfo(data.username);
		const passwordMatch = await checkEnc(data.password, password); // If entered password matches with database password
		if (!passwordMatch) return new NextResponse('Invalid Password', { status: 400 });

		// Send discord notification
		try {
			const notificationRes = await sendNotification(
				'New account login',
				`Account ID: ${acctId}\nUsername: ${data.username}`
			);
			if (notificationRes.status !== 200) throw Error(JSON.stringify(notificationRes));
		} catch (err) {
			console.error(err);
			return new NextResponse('Failed to send discord notification', { status: 400 });
		}

		// Generate JWT Remember Me token
		try {
			const token = await jwtSign({ acctId, name, acctNo });
			return new NextResponse(JSON.stringify({ token }), { status: 200 });
		} catch (err) {
			console.error(err);
			return new NextResponse(`Unable to sign token: ${err}`, { status: 400 });
		}
	} catch (error) {
		console.error(error);
		return new NextResponse('Unable to log in user.', { status: 400 });
	}
}
