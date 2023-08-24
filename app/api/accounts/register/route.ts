import { createAcct } from '@/Database';
import { captalize, sendNotification } from '@/Utils';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
	try {
		const data = await req.json(); // Get the request body
		console.info(data);
		const notificationRes = await sendNotification(
			'New account creation',
			`Type: ${await captalize(data.type)}\nUsername: ${data.username}\nEmail: ${data.email}`
		);
		if (notificationRes.status !== 200) {
			console.error(notificationRes);
			return new NextResponse('Failed to send discord notification', { status: 400 });
		}
		try {
			const status: any = await createAcct(
				data.type,
				'John Doe',
				data.username,
				data.email,
				data.password
			);
			return new NextResponse(status, { status: 200 });
		} catch (error) {
			console.error(error);
			return new NextResponse('Unable to create new account', { status: 400 });
		}
	} catch (error) {
		console.error(error);
		return new NextResponse('Bad Request', { status: 400 });
	}
}
