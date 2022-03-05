import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Polyline, useMap } from 'react-leaflet';
import { toast } from 'react-toastify';
import { BottomSheet } from "react-spring-bottom-sheet";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { PanTool, DirectionsBus, Tram } from '@mui/icons-material';
import { lineString, point, nearestPointOnLine } from '@turf/turf';
import StopMarker from "./StopMarker";
import VehicleMarker from "./VehicleMarker";

import "react-spring-bottom-sheet/dist/style.css"

const ActiveVehicle = ({ vehicles }) => {
    const navigate = useNavigate();
    const map = useMap();

    const { darkTheme } = JSON.parse(localStorage.getItem("settings") || "{}");

    const { tab, type } = useParams();
    const [activeVehicle, setActiveVehicle] = useState(null);
    const [{ trip, vehicle, success, id }, setAPIResponse] = useState({});

    useEffect(() => {
        if (!vehicles.length) return;

        let v = vehicles.find(vehicle => vehicle.tab === tab && vehicle.type === type);
        if (!v) {
            toast.error(activeVehicle ? "Utracono połącznie z pojazdem." : "Nie znaleziono pojazdu.");
            return navigate("/");
        };
        setActiveVehicle(v);
        if (!success || id !== v.trip) fetch(`https://wtp-test.2137.workers.dev/tripInfo?trip=${v.trip}&vehicle=${type}${tab.split("+")[0]}`).then(res => res.json()).then(res => {
            if (!res.trip && !res.vehicle) return navigate("/");

            res.trip.stops = res.trip.stops?.map(stop => {
                stop.onLine = nearestPointOnLine(lineString(res.trip.shapes), point(stop.location), { units: 'meters' }).properties.location;
                return stop;
            });
            setAPIResponse(res);
            map.setView(v.location, 17);
        });
    }, [vehicles]);

    return <>
        {activeVehicle ? <VehicleMarker vehicle={activeVehicle} trip={trip} /> : null}
        {trip ? <Polyline positions={trip?.shapes} pathOptions={{ color: trip.color, weight: 7 }} /> : null}
        {trip ? trip?.stops.map(stop => <StopMarker stop={stop} trip={trip} key={stop.name} />) : null}
        <BottomSheet
            open={true}
            onDismiss={() => navigate("/")}
            blocking={false}
            style={{
                zIndex: 30000,
                position: "absolute",
            }}
            header={<div style={{ display: "inline-flex", alignItems: "center" }}>{activeVehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: trip?.color }} /> : <Tram style={{ height: "22px", width: "22px", fill: trip?.color }} />} <b>{trip?.line}</b>&nbsp;» {trip?.headsign}</div>}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6]}
        >
            <List>
                {trip ? trip.stops?.map((stop, i) => (
                    <ListItem button key={stop.name}>
                        <ListItemAvatar>
                            <Avatar sx={{ width: 24, height: 24, backgroundColor: vehicle?.type === "bus" ? "#006b47" : "#007bff" }}>
                                {i + 1}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            {stop.on_request ? <PanTool style={{ width: "15px", height: "15px" }} /> : null} {stop.name}
                        </ListItemText>
                    </ListItem>
                )).reduce((prev, curr) => [prev, <Divider variant="inset" component="li" key={Math.random()} sx={{ backgroundColor: "#DCCDCD" }} />, curr]) : null}
            </List>
        </BottomSheet>
    </>;
};

export default ActiveVehicle;