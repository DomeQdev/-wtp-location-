import { BottomSheet } from "react-spring-bottom-sheet";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMap, Polyline } from "react-leaflet";
import { List, ListItem, ListItemText, ListItemAvatar, Divider } from "@mui/material";
import { DirectionsBus, Tram, DirectionsTransit, DirectionsRailway, Subway, Train, AirportShuttle } from '@mui/icons-material';
import VehicleMarker from "./VehicleMarker";
import { toast } from "react-toastify";

const types = {
    bus: <DirectionsBus style={{ height: "20px", width: "20px" }} />,
    tram: <Tram style={{ height: "20px", width: "20px" }} />,
    metro: <Subway style={{ height: "20px", width: "20px" }} />,
    wkd: <DirectionsRailway style={{ height: "20px", width: "20px" }} />,
    skm: <Train style={{ height: "20px", width: "20px" }} />,
    km: <DirectionsTransit style={{ height: "20px", width: "20px" }} />,
    trolley: <AirportShuttle style={{ height: "20px", width: "20px" }} />
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
        }).catch(() => {
            toast.error("Nie znaleziono takiego przystanku");
            navigate(`/${city}`);
        });
    }, []);

    const dep = departures?.map(dep => {
        dep.vehicle = vehicles.find(x => x.line === dep.line && x.brigade === dep.brigade);
        return dep;
    });

    return <>
        {dep?.filter(x => x?.vehicle).map(departure => <VehicleMarker vehicle={departure?.vehicle} key={departure.trip || departure.tab} />)}
        {dep?.length ? dep.filter(d => d?.shape).map(d => <Polyline positions={d?.shape} />) : null}
        <BottomSheet
            open={true}
            onDismiss={() => navigate(`/${city}`)}
            blocking={false}
            style={{ zIndex: 30000, position: "absolute" }}
            header={<><b>{name}</b></>}
            snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6, maxHeight - 40]}
        >
            <List>
                {dep?.length ? dep?.map((departure, i) => (
                    <ListItem button={!!departure?.vehicle} key={departure.trip} onClick={() => departure?.vehicle ? navigate(`/${city}/${departure?.type}/${departure?.vehicle?.tab}`) : null}>
                        <ListItemAvatar><b style={{ color: "white", backgroundColor: departure?.color, borderRadius: "25px", padding: "5px", paddingLeft: "10px", paddingRight: "10px", display: "inline-flex", alignItems: "center" }}>{types[departure?.type]}&nbsp;{departure?.line}</b></ListItemAvatar>
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
                )).reduce((prev, curr) => [prev, <Divider variant="inset" component="li" key={Math.random()} sx={{ backgroundColor: "#DCCDCD", marginLeft: "15px", marginRight: "15px" }} />, curr]) : <h3 style={{ textAlign: "center" }}>Brak odjazdów w najbliższym czasie.</h3>}
            </List>
        </BottomSheet>
    </>;
};