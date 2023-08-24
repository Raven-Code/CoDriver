import { updateData } from '@/Database';
import { captalize, encrypt, sendNotification } from '@/Utils';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
	try {
		const data = await req.json(); // Get the request body
		console.log(data);
		const notificationRes = await sendNotification(
			'Account Password Reset',
			`Account ID: ${await captalize(data.acctId)}`
		);
		if (notificationRes.status !== 200) {
			console.error(notificationRes);
			return new NextResponse('Failed to send discord notification', { status: 400 });
		}
		try {
			const status: any = await updateData(data.acctId, {
				password: await encrypt(data.password),
			});
			return new NextResponse(status, { status: 200 });
		} catch (error) {
			console.error(error);
			return new NextResponse('Unable to create change password', { status: 400 });
		}
	} catch (error) {
		console.error(error);
		return new NextResponse('Bad Request', { status: 400 });
	}
}
