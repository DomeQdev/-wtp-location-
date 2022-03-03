export const onRequestGet = async ({ request }) => {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('trip');
    const vehicleId = searchParams.get('vehicle');

    let now = Date.now();
    const { success, trip, vehicle } = await fetch(`https://new-api.domeqalt.repl.co/get/tripInfo?${tripId ? `trip=${tripId}&` : ""}${vehicleId ? `vehicle=${vehicleId}` : ""}`).then(res => res.json()).catch(() => {});

    return new Response(JSON.stringify({
        success,
        trip: {
            line: trip[0],
            alerts: trip[1],
            color: trip[2],
            headsign: trip[3],
            shapes: trip[4],
            stops: trip[5]
        },
        vehicle: {
            brand: vehicle[0],
            model: vehicle[1],
            prodYear: vehicle[2],
            type: vehicle[3],
            registration: vehicle[4],
            tab: vehicle[5],
            carrier: vehicle[6],
            depot: vehicle[7],
            features: vehicle[8],
            description: vehicle[9]
        },
        time: Date.now() - now
    }));
};