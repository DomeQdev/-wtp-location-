export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let id = url.searchParams.get('id');
    if(!id) return new Response("{error:true}", { status: 400 });

    let response = await fetch(`https://ckan2.multimediagdansk.pl/departures?stopId=${id}`).then(res => res.json()).catch(() => null);
    if(!response) return new Response("{error:true}", { status: 500 });

    return new Response(JSON.stringify(response.departures.map(departure => {
        let start = new Date(departure.scheduledTripStartTime);
        return {
            line: departure.routeId,
            headsign: departure.headsign,
            delay: departure.delayInSeconds || 0,
            realTime: new Date(departure.estimatedTime).getTime(),
            scheduledTime: new Date(departure.theoreticalTime).getTime(),
            vehicle: departure.vehicleCode,
            trip: `${departure.routeId}${start.getFullYear()}${(start.getMonth() + 1).zeroPad()}${start.getDate().zeroPad()}${start.getHours().zeroPad()}${start.getMinutes().zeroPad()}`
        }
    })));
};

Number.prototype.zeroPad = function() {
    return ('0'+this).slice(-2);
};