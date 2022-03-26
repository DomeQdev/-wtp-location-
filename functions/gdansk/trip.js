export const onRequestGet = async ({ request }) => {
    let url = new URL(request.url);
    let route = url.searchParams.get('route');
    let trip = url.searchParams.get('trip');
    if(!route || !trip) return new Response("{error:true}", { status: 400 });

    let date = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).zeroPad()}-${new Date().getDate().zeroPad()}`
    
    let shape = await fetch(`https://ckan2.multimediagdansk.pl/shapes?date=${date}&routeId=${route}&tripId=${trip}`).then(res => res.json()).catch(() => null);
    if(!shape) return new Response("{error:true}", { status: 500 });
    
    let stopTimes = await fetch(`https://ckan2.multimediagdansk.pl/stopTimes?date=${date}&routeId=${route}`).then(res => res.json()).catch(() => null);
    if(!stopTimes) return new Response("{error:true}", { status: 500 });

    let stopTime = stopTimes.filter(stopTime => stopTime.tripId === Number(trip));
    if(!stopTime[0]) return new Response("{error:true}", { status: 500 });

    return new Response(JSON.stringify({
        shape: shape.coordinates.map(x => [x[1], x[0]]),
        stops: stopTime.map(stop => {
            return {
                id: stop.stopId,
                location: [],
                name: "",
                time: czas(stop.departureTime.split("T")[1])
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