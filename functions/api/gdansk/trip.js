import { point, nearestPointOnLine, lineString } from "@turf/turf";
import routes from "./routes.json";

export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let route = url.searchParams.get('route');
    let trip = url.searchParams.get('trip');
    let start = url.searchParams.get('start');
    let service = url.searchParams.get('service');

    if (!route || !trip || !start) return new Response("{error:true}", { status: 400 });

    let date = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).zeroPad()}-${new Date().getDate().zeroPad()}`

    let shape = await fetch(`https://ckan2.multimediagdansk.pl/shapes?date=${date}&routeId=${route}&tripId=${trip}`, {
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!shape) return new Response("{error:true}", { status: 500 });

    let stopTimes = await fetch(`https://ckan2.multimediagdansk.pl/stopTimes?date=${date}&routeId=${route}`, {
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!stopTimes) return new Response("{error:true}", { status: 500 });

    let order = stopTimes.stopTimes.findIndex(stopTime => stopTime.tripId === Number(trip) && stopTime.stopSequence === 0 && stopTime.departureTime.split("T")[1] === start && stopTime.busServiceName === service);
    if(order === -1) return new Response("{error:true}", { status: 500 });

    let stopTime = stopTimes.stopTimes.slice(order).filter((x, i) => x.stopSequence === i);
    if (!stopTime[0]) return new Response("{error:true}", { status: 500 });

    let stops = await fetch("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json", {
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);

    let line = lineString(shape.coordinates.map(x => [x[1], x[0]]));
    return new Response(JSON.stringify({
        line: routes[route].line,
        headsign: null,
        color: routes[route].color,
        shape: shape.coordinates.map(x => [x[1], x[0]]),
        stops: stopTime.map(stop => {
            let stopData = stops?.stops?.find(s => s.stopId === stop.stopId);
            let nearest = nearestPointOnLine(line, point([stopData?.stopLat, stopData?.stopLon]), { units: 'meters' });
            return {
                name: `${stopData?.stopName} ${stopData?.stopCode}`,
                id: stop.stopId,
                on_request: stop.onDemand === 1,
                location: [stopData?.stopLat, stopData?.stopLon],
                arrival: czas(stop.arrivalTime.split("T")[1]),
                departure: czas(stop.departureTime.split("T")[1]),
                onLine: nearest.properties.location,
                index: nearest.properties.index
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

function groupDuplicates(array, sortByKey = "location") {
    let groups = {};
    array.forEach(item => {
        let key = item[sortByKey];
        groups[key] = groups[key] || [];
        groups[key].push(item);
    });
    return Object.values(groups);
}