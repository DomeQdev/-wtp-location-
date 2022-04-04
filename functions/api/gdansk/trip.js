import getTrip from "./util/getTrip";

export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let tripId = url.searchParams.get("trip");
    if(!tripId) return new Response(JSON.stringify({ error: "No params provided." }), { status: 400 });
    
    let [ route, trip, start, service ] = tripId.split("_");
    if (!route || !trip || !start || !service) return new Response(JSON.stringify({ error: "No params provided." }), { status: 400 });

    let T = await getTrip(route, trip, start, service).catch(() => null);
    if(!T) return new Response(JSON.stringify({ error: "No trip found." }), { status: 404 });

    return new Response(JSON.stringify(T));
};