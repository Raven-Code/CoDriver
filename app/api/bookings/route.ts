import { acceptedBooking, createBooking, deleteBooking, getAllBookings } from '@/BookingDb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const bookings = await getAllBookings(); // Call the MySQL version of getAllBookings
		return new NextResponse(JSON.stringify(bookings), { status: 200 });
	} catch (err) {
		console.error(err);
		return new NextResponse(JSON.stringify(err), { status: 500 });
	}
}
export async function POST(req: NextRequest) {
	const data = await req.json();
	try {
		switch (data.method) {
			case 'post':
				try {
					const bookingId = await createBooking(data.data); // Call the MySQL version of createBooking
					if (bookingId) {
						return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
					} else {
						return new NextResponse(
							JSON.stringify({ success: false, message: 'Failed to create booking' }),
							{ status: 500 }
						);
					}
				} catch (err: any) {
					return new NextResponse(
						JSON.stringify({
							success: false,
							message: 'Failed to create booking',
							error: err.message,
						}),
						{ status: 500 }
					);
				}
			case 'put':
				const { bookingId, status, driverId } = data.updatedBooking;
				try {
					const isUpdated = await acceptedBooking(bookingId, status, driverId); // Call the MySQL version of acceptedBooking
					if (isUpdated) {
						return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
					} else {
						return new NextResponse(
							JSON.stringify({ success: false, message: 'Failed to update booking' }),
							{ status: 500 }
						);
					}
				} catch (err: any) {
					return new NextResponse(
						JSON.stringify({
							success: false,
							message: 'Failed to update booking',
							error: err.message,
						}),
						{ status: 500 }
					);
				}
			case 'delete':
				const { bookingId: id } = data;
				try {
					const dltBooking = await deleteBooking(id); // Call the MySQL version of deleteBooking
					if (dltBooking) {
						console.info('Booking deleted successfully!');
						return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
					} else {
						return new NextResponse(JSON.stringify({ message: 'Booking not found.' }), {
							status: 400,
						});
					}
				} catch (err: any) {
					return new NextResponse(
						JSON.stringify({
							success: false,
							message: 'Failed to delete booking',
							error: err.message,
						}),
						{ status: 500 }
					);
				}
			default:
				return new NextResponse('Unknown Method', { status: 500 });
		}
	} catch (err) {
		console.error(err);
		return new NextResponse(JSON.stringify(err), { status: 500 });
	}
}
