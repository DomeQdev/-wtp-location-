export const onRequestPost = async({ request }) => {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('trip');
    const vehicleId = searchParams.get('vehicle');

    const trip = tripId ? await fetch(`https://new-api.domeqalt.repl.co/get/trip?id=${tripId}`).then(res => res.json()) : null;
    const vehicle = vehicleId ? await fetch(`https://new-api.domeqalt.repl.co/get/vehicle?veh=${vehicleId}`).then(res => res.json()) : null;

    return new Response(JSON.stringify({
        success: true,
        trip: trip?.success ? trip : null,
        vehicle: vehicle?.success ? vehicle : null
    }));
};