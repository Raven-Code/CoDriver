import {deleteLocation, getLocations, saveLocation, updateLocation} from '@/LocationDb'; // Import your functions
import {NextRequest, NextResponse} from 'next/server';

export async function GET() {
    try {
        const locations = await getLocations(); // Get all locations
        return new NextResponse(JSON.stringify({locations}), {status: 200});
    } catch (error) {
        return new NextResponse('An error occurred while fetching locations.', {status: 500});
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json(); // Get the request body
        switch (data.method) {
            case 'post':
                try {
                    const locationId = await saveLocation(data.locationData); // Creating a new location
                    return locationId
                        ? new NextResponse(JSON.stringify({success: true}), {status: 200})
                        : new NextResponse(
                            JSON.stringify({error: 'Failed to create location.'}),
                            {status: 500}
                        );
                } catch (error) {
                    return new NextResponse(
                        JSON.stringify({error: 'An error occurred while creating a location.'}),
                        {status: 500}
                    );
                }
            case 'put':
                try {
                    const updatedLocation = await updateLocation(
                        data.locationId,
                        data.locationData
                    ); // Updating the location
                    return updatedLocation
                        ? new NextResponse(
                            JSON.stringify({message: 'Location was updated successfully.'}),
                            {status: 200}
                        )
                        : new NextResponse(
                            JSON.stringify({
                                message: `Cannot update location with id ${data.locationId}.`,
                            }),
                            {status: 500}
                        );
                } catch (error) {
                    return new NextResponse(
                        JSON.stringify({error: 'An error occurred while updating a location.'}),
                        {status: 500}
                    );
                }
            case 'delete':
                try {
                    const deletedLocation = await deleteLocation(data.locationId); // Deleting the location
                    return deletedLocation
                        ? new NextResponse(
                            JSON.stringify({message: 'Location was deleted successfully.'}),
                            {status: 200}
                        )
                        : new NextResponse(
                            JSON.stringify({
                                message: `Cannot delete location with id ${data.locationId}.`,
                            }),
                            {status: 500}
                        );
                } catch (error) {
                    return new NextResponse(
                        JSON.stringify({error: 'An error occurred while deleting a location.'}),
                        {status: 500}
                    );
                }
            default:
                return new NextResponse('Invalid method', {status: 400});
        }
    } catch (err) {
        console.error('Error: ', err);
        return new NextResponse('Bad Request', {status: 400});
    }
}
