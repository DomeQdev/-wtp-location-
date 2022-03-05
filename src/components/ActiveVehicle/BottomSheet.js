import { BottomSheet } from "react-spring-bottom-sheet";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { PanTool, DirectionsBus, Tram } from '@mui/icons-material';
import { lineString, point, nearestPointOnLine } from '@turf/turf';
import { useNavigate } from "react-router-dom";

import "react-spring-bottom-sheet/dist/style.css"

const Sheet = ({ vehicle, trip, vehicleInfo }) => {
    const navigate = useNavigate();

    return (
        <BottomSheet
            open={true}
            onDismiss={() => navigate("/")}
            blocking={false}
            style={{
                zIndex: 30000,
                position: "absolute",
            }}
            header={<><div style={{ display: "inline-flex", alignItems: "center" }}>{vehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: trip?.color }} /> : <Tram style={{ height: "22px", width: "22px", fill: trip?.color }} />} <b>{trip?.line}</b>&nbsp;» {trip?.headsign}</div><div onClick={() => navigate("/")} style={{ float: "right", textAlign: "right", cursor: "pointer" }}>x</div></>}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
        >
            <List>
                {trip ? trip.stops?.map((stop, i) => (
                    <ListItem button key={stop.name}>
                        <ListItemAvatar>
                            <Avatar sx={{ width: 24, height: 24, backgroundColor: trip?.color, color: "white", fontSize: "15px" }}>
                                {i + 1}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <div style={{ float: "left", textAlign: "left", color: whereBus(stop) < -35 ? "#ADADAD" : null }}>
                                {stop.on_request ? <PanTool style={{ width: "15px", height: "15px" }} /> : null} {stop.name}
                            </div>
                            <div style={{ float: "right", textAlign: "right" }}>
                                {whereBus(stop) > -35 ? <>za <b>{Math.floor((whereBus(stop) / 7) / 60)}</b> min</> : null}
                            </div>
                        </ListItemText>
                    </ListItem>
                )).reduce((prev, curr) => [prev, <Divider variant="inset" component="li" key={Math.random()} sx={{ backgroundColor: "#DCCDCD" }} />, curr]) : null}
            </List>
        </BottomSheet>
    );

    function whereBus(stop) {
        if(!vehicle?.location) return 0;
        return stop.onLine - nearestPointOnLine(lineString(trip?.shapes), point(vehicle?.location), { units: 'meters' }).properties.location;
    }
}

export default Sheet;