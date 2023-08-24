import { getUserInfo } from '@/Database';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
	try {
		const data = await req.json(); // Get the request body
		const dbData = await getUserInfo(data.username);
		return new NextResponse(JSON.stringify(dbData), { status: 200 });
	} catch (err) {
		console.error('Error: ', err);
		return new NextResponse('Bad Request', { status: 400 });
	}
}
