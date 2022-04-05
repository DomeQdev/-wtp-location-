import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import VehicleMarker from "../markers/VehicleMarker";

export default ({ city, vehicles }) => {
    const [vehicle, setVehicle] = useState(null);
    const { tab, type } = useParams();
    const map = useMap();
    const navigate = useNavigate();

    useEffect(() => {
        if (!vehicles.length) return;
        let veh = vehicles.find(x => x.tab === tab && x.type === type);
        if (!veh) {
            toast.error("Nie znaleziono takiego pojazdu");
            return navigate(`/${city}`);
        }
        setVehicle(veh);
        map.setView(veh.location, 17);
    }, [vehicles]);

    return <>
        {vehicle ? <VehicleMarker vehicle={vehicle} city={city} /> : null}
    </>;
};