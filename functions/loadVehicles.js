export const onRequestGet = async() => {
    let data = await fetch("https://mkuran.pl/gtfs/warsaw/vehicles.json").then(res => res.json()).catch(() => null);
    if (!data || !data.positions) return new Response("[]");
    return new Response(JSON.stringify(data.positions.map(x => {
        let trip = x.trip_id.split("/");
        trip.shift();
        return {
            line: x.id.split("/")[1],
            type: x.id.split("/")[1].length === 3 ? "bus" : "tram",
            location: [x.lat, x.lon],
            deg: Math.floor(x.bearing + 360),
            brigade: x.id.split("/")[2],
            tab: x.side_number,
            lastPing: new Date(x.timestamp).getTime(),
            trip: trip.join("/")
        }
    })));
};