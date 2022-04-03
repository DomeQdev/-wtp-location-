import { BottomSheet } from "react-spring-bottom-sheet";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VehicleMarker from "./VehicleMarker";

export default ({ city, vehicles }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [{ departures, name, location }, setStop] = useState([]);

    useEffect(() => {
        fetch(`/api/${city}/stop?id=${id}`).then(res => res.json()).then(setDepartures).catch(() => null);
    }, []);

    return <>
        {departures?.filter(departure => vehicles.find(x => x.tab === departure.vehicle && x.type === departure.type)).map(departure => <VehicleMarker vehicle={vehicles.find(x => x.tab === departure.vehicle && x.type === departure.type)} key={departure.trip || departure.tab} />)}
        <BottomSheet
            open={true}
            onDismiss={() => navigate("/")}
            blocking={false}
            style={{ zIndex: 30000, position: "absolute" }}
            header={<><b>{name}</b></>}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
        >
            {departures?.map(departure => <div key={departure.trip || departure.tab}>
                {JSON.stringify(departure)}
            </div>)}
        </BottomSheet>
    </>;
};