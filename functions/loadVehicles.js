export const onRequestGet = async () => {
    let data = await fetch("https://mkuran.pl/gtfs/warsaw/vehicles.json").then(res => res.json()).catch(() => null);
    let skm = await getSKM();
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
    }).concat(skm)));
};


async function getSKM() {
    let data = await fetch("https://new-api.domeqalt.repl.co/get/skmPredict").then(res => res.json()).catch(() => null);
    if (!data) return [];
    return data.map(skm => ({
        line: skm.line,
        type: "skm",
        location: skm.location,
        deg: 0,
        previous: skm.previousLocation,
        brigade: null,
        tab: skm.trip.replace(/\//g, "."),
        lastPing: Date.now(),
        trip: skm.trip
    }))
}