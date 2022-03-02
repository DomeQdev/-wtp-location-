export const onRequestGet = async({ request }) => {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('trip');
    const vehicleId = searchParams.get('vehicle');

    let now = Date.now();
    const { success, trip, vehicle } = await fetch(`https://new-api.domeqalt.repl.co/get/tripInfo?${tripId ? `trip=${tripId}&` : ""}${vehicleId ? `vehicle=${vehicleId}` : ""}`).then(res => res.json()).catch(() => {});

    return new Response(JSON.stringify({
        success,
        trip,
        vehicle,
        time: Date.now() - now
    }));
};