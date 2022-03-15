import { BottomSheet } from "react-spring-bottom-sheet";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { PanTool, DirectionsBus, Tram } from '@mui/icons-material';
import { lineString, point, nearestPointOnLine } from '@turf/turf';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

import "react-spring-bottom-sheet/dist/style.css"

const Sheet = ({ vehicle, trip }) => {
    const navigate = useNavigate();
    const map = useMap();
    const [scrolled, setScrolled] = useState(false);
    const lastStop = trip ? trip?.stops?.filter(stop => whereBus(stop) < -35)?.pop() : null;
    const beforeStop = trip ? lastStop?.minute || minutesUntilTimestamp(trip?.stops[0]?.time) : null;

    useEffect(() => setScrolled(false), [trip]);

    return (
        <BottomSheet
            open={true}
            onDismiss={() => navigate("/")}
            blocking={false}
            style={{
                zIndex: 30000,
                position: "absolute",
            }}
            header={<><div style={{ display: "inline-flex", alignItems: "center" }}>{vehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: trip?.color }} /> : <Tram style={{ height: "22px", width: "22px", fill: trip?.color }} />} <b>{vehicle?.line}</b>{trip?.headsign ? <>&nbsp;» {trip.headsign}</> : null}</div><div onClick={() => navigate("/")} style={{ float: "right", textAlign: "right", cursor: "pointer" }}>x</div></>}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
        >
            <List>
                {trip ? trip.stops?.map((stop, i) => (
                    <ListItem button key={stop.name} onClick={() => map.flyTo(stop.location, 17)}>
                        <ListItemAvatar>
                            <Avatar sx={{ width: 24, height: 24, backgroundColor: trip?.color, color: "white", fontSize: "15px" }}>
                                {i + 1}
                            </Avatar>
                            {i + 1 !== trip.stops?.length ? <div style={{ borderLeft: `4px solid ${trip?.color}`, marginLeft: '10px', marginTop: '0px', height: '80%', position: 'absolute', paddingRight: '16px' }} /> : null}
                        </ListItemAvatar>
                        <ListItemText ref={(ref) => {
                            if (!scrolled && trip.stops.filter(st => whereBus(st) > -35)[0]?.id === stop.id) {
                                ref?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                setScrolled(true);
                            }
                        }}>
                            <div style={{ float: "left", textAlign: "left", color: whereBus(stop) < -35 ? "#ADADAD" : null }}>
                                {stop.on_request ? <PanTool style={{ width: "15px", height: "15px" }} /> : null} {stop.name}
                            </div>
                            <div style={{ float: "right", textAlign: "right" }}>
                                {whereBus(stop) > -35 ? (vehicle?.type === "bus" || vehicle?.type === "tram" ? <>za {lastStop ? stop?.minute - beforeStop : stop?.minute + beforeStop} min</> : <>za {minutesUntil(stop?.time)}</>) : null}
                            </div>
                        </ListItemText>
                    </ListItem>
                )).reduce((prev, curr) => [prev, <Divider variant="inset" component="li" key={Math.random()} sx={{ backgroundColor: "#DCCDCD", marginRight: "10px" }} />, curr]) : <h1 style={{ textAlign: "center" }}>Brak trasy</h1>}
            </List>
        </BottomSheet>
    );

    function whereBus(stop) {
        if (!vehicle?.location || !trip) return 0;
        return stop.onLine - nearestPointOnLine(lineString(trip?.shapes), point(vehicle?.location), { units: 'meters' }).properties.location;
    }
}

export default Sheet;

function minutesUntilTimestamp(timestamp) {
    let diff = new Date(timestamp) - new Date(Date.now() + 1 * 60 * 60 * 1000);
    return Math.ceil(diff / 1000 / 60);
}

function minutesUntil(timestamp) {
    let now = new Date();
    let time = new Date(timestamp);
    let diff = time - now;
    return Math.floor(diff / 60000);
}
