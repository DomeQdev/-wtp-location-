import routes from './util/routes.json';
import getTrip from './util/getTrip';

export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let id = url.searchParams.get('id');
    if (!id) return new Response("{error:true}", { status: 400 });

    let response = await fetch(`https://ckan2.multimediagdansk.pl/departures?stopId=${id}`).then(res => res.json()).catch(() => null);
    if (!response) return new Response("{error:true}", { status: 500 });

    let stops = await fetch("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json", {
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).then(res => Object.values(res)[0].stops).catch(() => []);
    let stopData = stops.find(s => s.stopId === Number(id));

    return new Response(JSON.stringify({
        name: stopData ? `${stopData?.stopName || stopData?.stopDesc} ${stopData?.stopCode || ""}` : "Przystanek",
        location: stopData ? [stopData?.stopLat, stopData?.stopLon] : null,
        departures: response.departures.map(async(departure) => {
            let trip = await getTrip(departure.routeId, departure.tripId, czas(departure.scheduledTripStartTime.split("T")[1]), departure.vehicleService);
            return {
                line: routes[String(departure.routeId)].line,
                color: trip.color,
                route: String(departure.routeId),
                type: routes[String(departure.routeId)].type,
                color: routes[String(departure.routeId)].color,
                brigade: departure.vehicleService.split("-")[1],
                headsign: departure.headsign,
                delay: departure.delayInSeconds || 0,
                realTime: new Date(departure.estimatedTime).getTime(),
                scheduledTime: new Date(departure.theoreticalTime).getTime(),
                stops: trip.stops,
                shape: trip.shape
            }
        })
    }));
};

Number.prototype.zeroPad = function () {
    return ('0' + this).slice(-2);
};

function czas(time) {
    let hours = Number(time.split(":")[0]);
    let minutes = Number(time.split(":")[1]);
    return new Date().setHours(0, 0, 0, 0) + ((hours * 60 + minutes) * 60 * 1000);
}