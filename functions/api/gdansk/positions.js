import routes from './routes.json';

export const onRequestGet = async () => {
    let response = await fetch("https://ckan2.multimediagdansk.pl/gpsPositions?v=2").then(res => res.json()).catch(() => null);
    if (!response) return new Response("[]");

    return new Response(JSON.stringify(response.vehicles.map(vehicle => ({
        brigade: vehicle.vehicleService.split("-")[1],
        deg: vehicle.direction,
        lastPing: new Date(vehicle.generated).getTime(),
        line: vehicle.routeShortName,
        location: [vehicle.lat, vehicle.lon],
        tab: vehicle.vehicleCode,
        tripId: vehicle.tripId,
        start: String(String(vehicle.scheduledTripStartTime).split("T")[1]).replace("Z", ""),
        vehicleService: vehicle.vehicleService,
        headsign: vehicle.headsign,
        type: routes.find(x => x.line === String(vehicle.routeShortName))?.type || "bus",
        delay: vehicle.delay || 0
    }))));
};

Number.prototype.zeroPad = function () {
    return ('0' + this).slice(-2);
};