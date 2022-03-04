import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Polyline, useMap } from 'react-leaflet';
import { toast } from 'react-toastify';
import { Drawer, Toolbar, Divider, List, ListItem, ListItemIcon, ListItemText, } from "@mui/material";
import { Inbox, } from "@mui/icons-material";
import { lineString, point, nearestPointOnLine } from '@turf/turf';
import StopMarker from "./StopMarker";
import VehicleMarker from "./VehicleMarker";

const ActiveVehicle = ({ vehicles }) => {
    const navigate = useNavigate();
    const map = useMap();

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
        if (!success || id !== v.trip) fetch(`/tripInfo?trip=${v.trip}&vehicle=${type}${tab.split("+")[0]}`).then(res => res.json()).then(res => {
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
        <Drawer
            sx={{
                width: 290,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 290,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <List>
                {trip ? trip.stops?.map((stop, i) => (
                    <ListItem button key={stop.name}>
                        <ListItemIcon>
                            {i+1}
                        </ListItemIcon>
                        <ListItemText primary={stop.name} />
                    </ListItem>
                )) : null}
            </List>
            <Divider />
        </Drawer>
    </>;
};

export default ActiveVehicle;