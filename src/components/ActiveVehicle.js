import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Polyline, useMap } from 'react-leaflet';
import { toast } from 'react-toastify';
import VehicleMarker from "./VehicleMarker";

const ActiveVehicle = ({ vehicles }) => {
    const navigate = useNavigate();
    const { tab, type } = useParams();
    const [ activeVehicle, setActiveVehicle ] = useState(null);
    const [ { trip, vehicle, success }, setAPIResponsse ] = useState({});

    useEffect(() => {
        if(!vehicles.length) return;

        let v = vehicles.find(vehicle => vehicle.tab === tab && vehicle.type === type);
        if(!v) {
            toast.error(activeVehicle ? "Utracono połącznie z pojazdem." : "Nie znaleziono pojazdu.");
            return navigate("/");
        };
        setActiveVehicle(v);
        if(!success) fetch(`/tripInfo?trip=${v.trip}&vehicle=${type}${tab.split("+")[0]}`).then(res => res.json()).then(setAPIResponsse);
    }, [ vehicles ]);

    return <>
        {activeVehicle ? <VehicleMarker vehicle={activeVehicle} trip={trip} /> : null}
        {trip ? <Polyline positions={trip?.shapes} pathOptions={{ color: vehicle?.type === "bus" ? "#006b47" : "#007bff", weight: 7 }} /> : null}
    </>;
};

export default ActiveVehicle;