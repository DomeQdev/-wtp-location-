import { BottomSheet } from "react-spring-bottom-sheet";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { PanTool, DirectionsBus, Tram, DirectionsTransit } from '@mui/icons-material';
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
            style={{ zIndex: 30000, position: "absolute" }}
            header={vehicle ? <>
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                    <b style={{ color: "white", backgroundColor: trip?.color || "#880077", borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center" }}>{getIcon(vehicle?.type, "#fff")}&nbsp;{vehicle?.line}</b>{trip?.headsign ? <>&nbsp;{trip.headsign}</> : null}
                </div>
            </> : null}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
        >
            <List>
                {trip ? trip.stops?.map((stop, i) => (
                    <ListItem button key={stop.name} onClick={() => map.setView(stop.location, 17)} ref={(ref) => {
                        if (!scrolled && trip.stops.filter(st => whereBus(st) > -35)[0]?.id === stop.id) {
                            ref?.scrollIntoView();
                            setScrolled(true);
                        }
                    }}>
                        <ListItemAvatar>
                            <Avatar sx={{ width: 15, height: 15, backgroundColor: whereBus(stop) > -35 ? trip?.color : "#9ba1ab", color: "white", marginLeft: "5px" }}>&nbsp;</Avatar>
                            {i + 1 !== trip.stops?.length ? <div style={{ borderLeft: `7px solid ${whereBus(stop) > -35 ? trip?.color : "#9ba1ab"}`, marginLeft: '9px', marginTop: '-1px', height: '100%', position: 'absolute', paddingRight: '16px' }} /> : null}
                        </ListItemAvatar>
                        <ListItemText>
                            <div style={{ float: "left", textAlign: "left", color: whereBus(stop) < -35 ? "#ADADAD" : null }}>
                                {stop.on_request ? <PanTool style={{ width: "15px", height: "15px" }} /> : null} {stop.name}
                            </div>
                            <div style={{ float: "right", textAlign: "right" }}>
                                {whereBus(stop) > -35 ? <>{!lastStop ? stop?.minute + beforeStop : stop?.minute - beforeStop} min</> : null}
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

function getIcon(type, color) {
    switch(type) {
        case "bus":
            return <DirectionsBus style={{ height: "20px", width: "20px", fill: color }} />;
        case "tram":
            return <Tram style={{ height: "20px", width: "20px", fill: color }} />;
        default:
            return <DirectionsTransit style={{ height: "20px", width: "20px", fill: color }} />;
    }
}