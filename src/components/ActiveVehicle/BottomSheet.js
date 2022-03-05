import { BottomSheet } from "react-spring-bottom-sheet";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { PanTool, DirectionsBus, Tram } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

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
            header={<div style={{ display: "inline-flex", alignItems: "center" }}>{vehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: trip?.color }} /> : <Tram style={{ height: "22px", width: "22px", fill: trip?.color }} />} <b>{trip?.line}</b>&nbsp;» {trip?.headsign}</div>}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
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
    )
}

export default Sheet;