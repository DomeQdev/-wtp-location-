import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Polyline, useMap } from 'react-leaflet';
import { toast } from 'react-toastify';
import { lineString, point, nearestPointOnLine } from '@turf/turf';
import StopMarker from "./StopMarker";
import BottomSheet from "./BottomSheet";
import VehicleMarker from "./VehicleMarker";

const ActiveVehicle = ({ vehicles }) => {
    const navigate = useNavigate();
    const map = useMap();

    const { tab, type } = useParams();
    const [activeVehicle, setActiveVehicle] = useState(null);
    const [{ success, trip, vehicle, id }, setAPIResponse] = useState({});

    useEffect(() => {
        if (!vehicles.length) return;

        let v = vehicles.find(vehicle => vehicle.tab === tab && vehicle.type === type);
        if (!v) {
            toast.error(activeVehicle ? "Utracono połącznie z pojazdem." : "Nie znaleziono pojazdu.");
            return navigate("/");
        };
        setActiveVehicle(v);
        if (!success || (v.trip && id !== v.trip)) fetch(`/tripInfo?trip=${v.trip}&vehicle=${type}${tab.split("+")[0]}`).then(res => res.json()).then(res => {
            if (!res.trip && !res.vehicle) return navigate("/");

            if(res.trip) {
                res.trip.stops = res.trip.stops?.map(stop => {
                    stop.onLine = nearestPointOnLine(lineString(res.trip.shapes), point(stop.location), { units: 'meters' }).properties.location;
                    stop.minute = (stop.time - res.trip.stops[0].time) / 1000 / 60;
                    return stop;
                });

                res.trip.alerts.map(alert => toast.warn(`${alert.title} »`, { 
                    onClick: () => window.open(alert.link, "_blank")
                }));
            }
            setAPIResponse(res);
        }).catch(() => navigate("/"));
    }, [vehicles]);

    return <>
        {activeVehicle ? <VehicleMarker vehicle={activeVehicle} trip={trip} vehicleInfo={vehicle} /> : null}
        {trip ? <Polyline positions={trip?.shapes} pathOptions={{ color: trip.color, weight: 8 }} /> : null}
        {trip ? trip?.stops.map(stop => <StopMarker stop={stop} trip={trip} key={stop.name} />) : null}
        <BottomSheet vehicle={activeVehicle} trip={trip} />
    </>;
};

export default ActiveVehicle;