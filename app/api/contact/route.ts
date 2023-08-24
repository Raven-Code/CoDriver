import { sendNotification } from '@/Utils';
import { NextRequest, NextResponse } from 'next/server';
export const metadata = {
	title: 'Contact | CoDriver',
};
export async function POST(req: NextRequest) {
	try {
		const data = await req.json(); // Get the request body
		const response = await sendNotification(
			'New Message!',
			`**Name**: ${data.name}\n**Email:** ${data.email}\n**Message Content:**\n\n${data.message}`
		);
		if (response.status != 200) throw new Error('Failed to send discord notification');
		return new NextResponse(JSON.stringify(response), { status: 200 });
	} catch (error) {
		console.error('Error parsing request body:', error);
		return new NextResponse('Bad Request', { status: 400 });
	}
}
