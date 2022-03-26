export const onRequestGet = async () => {
    let response = await fetch("https://ckan2.multimediagdansk.pl/gpsPositions?v=2").then(res => res.json()).catch(() => null);
    if (!response) return new Response("[]");

    return new Response(JSON.stringify(response.vehicles.map(vehicle => {
        let start = new Date(vehicle.scheduledTripStartTime);
        return {
            brigade: vehicle.vehicleService.split("-")[1],
            deg: vehicle.direction,
            lastPing: new Date(generated).getTime(),
            line: vehicle.routeShortName,
            location: [vehicle.lat, vehicle.lon],
            tab: vehicle.vehicleCode,
            trip: `${vehicle.routeId}${start.getFullYear()}${(start.getMonth() + 1).zeroPad()}${start.getDate().zeroPad()}${start.getHours().zeroPad()}${start.getMinutes().zeroPad()}`,
            type: vehicle.routeShortName < 20 ? "tram" : "bus",
            delay: vehicle.delay || 0
        }
    })));
};

Number.prototype.zeroPad = function() {
    return ('0'+this).slice(-2);
};