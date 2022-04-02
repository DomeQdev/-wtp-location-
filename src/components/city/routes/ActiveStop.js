import { BottomSheet } from "react-spring-bottom-sheet";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VehicleMarker from "./VehicleMarker";

export default ({ city, vehicles }) => {
    const { id } = useParams();
    const [departures, setDepartures] = useState([]);

    useEffect(() => {
        fetch(`/api/${city}/stop?id=${id}`).then(res => res.json()).then(setDepartures).catch(() => null);
    }, []);

    return <>
        {departures.filter(departure => vehicles.find(x => x.tab === departure.vehicle && x.type === departure.type)).map(departure => <VehicleMarker vehicle={vehicles.find(x => x.tab === departure.vehicle && x.type === departure.type)} key={departure.trip || departure.tab} />)}
    </>;
};