import { BottomSheet } from "react-spring-bottom-sheet";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMap } from "react-leaflet";
import { List, ListItem, ListItemText, ListItemAvatar, Divider, Avatar } from "@mui/material";
import { DirectionsBus, Tram, DirectionsTransit, DirectionsRailway, Subway, Train } from '@mui/icons-material';
import VehicleMarker from "./VehicleMarker";

const types = {
    bus: <DirectionsBus style={{ height: "20px", width: "20px" }} />,
    tram: <Tram style={{ height: "20px", width: "20px" }} />,
    metro: <Subway style={{ height: "20px", width: "20px" }} />,
    wkd: <DirectionsRailway style={{ height: "20px", width: "20px" }} />,
    skm: <Train style={{ height: "20px", width: "20px" }} />,
    km: <DirectionsTransit style={{ height: "20px", width: "20px" }} />
};

export default ({ city, vehicles }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const map = useMap();
    const [{ departures, name, location }, setStop] = useState([]);

    useEffect(() => {
        fetch(`/api/${city}/stop?id=${id}`).then(res => res.json()).then(res => {
            setStop(res);
            if(res?.location) map.setView(res.location, 17);
        }).catch(() => null);
    }, []);

    const dep = departures?.map(dep => {
        dep.vehicle = vehicles.find(x => x.line === dep.line && x.brigade === dep.brigade);
        return dep;
    });

    return <>
        {dep?.filter(x => x?.vehicle).map(departure => <VehicleMarker vehicle={departure?.vehicle} key={departure.trip || departure.tab} />)}
        <BottomSheet
            open={true}
            onDismiss={() => navigate("/")}
            blocking={false}
            style={{ zIndex: 30000, position: "absolute" }}
            header={<><b>{name}</b></>}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
        >
            <List>
                {dep?.map((departure, i) => (
                    <ListItem button={!!departure?.vehicle} disabled={!departure?.vehicle} key={departure.trip} onClick={() => map.setView(vehicles.find(x => x.tab === departure.vehicle && x.type === departure.type)?.location || location, 17)}>
                        <ListItemAvatar><b style={{ color: "white", backgroundColor: departure?.vehicle ? departure?.color : "#ADADAD", borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center" }}>{types[departure?.type]}&nbsp;{departure?.line}</b></ListItemAvatar>
                        <ListItemText>
                            <div style={{ float: "left", textAlign: "left", color: departure.realTime < Date.now() ? "#ADADAD" : null }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                    {departure?.headsign ? <>&nbsp;{departure.headsign}</> : null}
                                </div>
                            </div>
                            <div style={{ float: "right", textAlign: "right" }}>
                                {new Date(departure.realTime).toLocaleTimeString()}
                            </div>
                        </ListItemText>
                    </ListItem>
                )).reduce((prev, curr) => [prev, <Divider variant="inset" component="li" key={Math.random()} sx={{ backgroundColor: "#DCCDCD", marginLeft: "15px", marginRight: "15px" }} />, curr]) || <h1 style={{ textAlign: "center" }}>Ładowanie</h1>}
            </List>
        </BottomSheet>
    </>;
};