import { deleteAcct, getUserInfo, updateData } from '@/Database';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
	try {
		const { action, acctId } = await req.json(); // Get the request body
		if (action === 'delete') {
			const response = await deleteAcct(acctId);
			return new NextResponse(JSON.stringify({ response }), { status: 200 });
		} else if (action === 'edit') {
			const status =
				(await getUserInfo(acctId))[0]?.status === 'active' ? 'inactive' : 'active';
			return new NextResponse(
				JSON.stringify({ response: await updateData(acctId, { status }) }),
				{ status: 200 }
			);
		}
		throw new Error('Invalid action');
	} catch (err) {
		console.error('Error: ', err);
		return new NextResponse('Bad Request', { status: 400 });
	}
}
