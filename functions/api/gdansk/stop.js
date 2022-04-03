export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let id = url.searchParams.get('id');
    if (!id) return new Response("{error:true}", { status: 400 });

    let response = await fetch(`https://ckan2.multimediagdansk.pl/departures?stopId=${id}`).then(res => res.json()).catch(() => null);
    if (!response) return new Response("{error:true}", { status: 500 });

    let stops = await fetch("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json", {
        cf: {
            cacheTtl: 86400 * 3,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).then(res => res.stops).catch(() => []);
    let stopData = stops.find(s => s.stopShortName === id);

    return new Response(JSON.stringify({
        name: stopData ? `${stopData?.stopName || stopData?.stopDesc} ${stopData?.stopCode}` : "Przystanek",
        location: stopData ? [stopData?.stopLat, stopData?.stopLon] : null,
        departures: response.departures.map(departure => {
            let start = new Date(departure.scheduledTripStartTime);
            return {
                line: departure.routeId,
                type: departure.routeId < 20 ? "tram" : "bus",
                brigade: departure.vehicleService.split("-")[1],
                headsign: departure.headsign,
                delay: departure.delayInSeconds || 0,
                realTime: new Date(departure.estimatedTime).getTime(),
                scheduledTime: new Date(departure.theoreticalTime).getTime(),
                vehicle: String(departure.vehicleCode),
                trip: `${departure.routeId}${start.getFullYear()}${(start.getMonth() + 1).zeroPad()}${start.getDate().zeroPad()}${start.getHours().zeroPad()}${start.getMinutes().zeroPad()}`
            }
        })
    }));
};

Number.prototype.zeroPad = function () {
    return ('0' + this).slice(-2);
};