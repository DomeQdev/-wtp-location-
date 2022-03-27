import { useEffect, useState } from "react";
import useWebSocket from 'react-use-websocket';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useMapEvents } from "react-leaflet";
import { Routes, Route } from "react-router-dom";

import Map from "../Map";
import VehicleMarker from "./active/VehicleMarker";

export default () => {
    const [vehicles, setVehicles] = useState([]);
    const [bounds, setBounds] = useState(localStorage.getItem("warsaw.bounds"));

    const group = JSON.parse(localStorage?.grouping || "false");

    useWebSocket("wss://ws.domeqalt.repl.co/", {
        onOpen: () => console.log('opened'),
        onClose: () => console.log('closed'),
        onMessage: ({ data }) => setVehicles(JSON.parse(data)),
        shouldReconnect: () => true,
        reconnectInterval: 10000,
        reconnectAttempts: 15,
        retryOnError: true
    });

    useEffect(() => {
        fetch("/warsaw/positions").then(res => res.json()).then(setVehicles).catch(() => null);
    }, []);

    const filteredVehicles = vehicles;

    return <Map city={"warsaw"}>
        <Events />
        <Routes>
            <Route path="/" element={group 
                ? <MarkerClusterGroup>{filteredVehicles.map(vehicle => <VehicleMarker vehicle={vehicle} key={vehicle.trip || vehicle.tab} />)}</MarkerClusterGroup>
                : null} />
            <Route path="/:type/:tab" element={<></>} />
            <Route path="/filter" element={<></>} />
        </Routes>
    </Map>;

    function Events() {
        useMapEvents({
            moveend: ({ target: map }) => {
                setBounds(map.getBounds());
                localStorage.setItem("warsaw.bounds", [map.getCenter().lat, map.getCenter().lng]);
                localStorage.setItem("warsaw.zoom", map.getZoom());
            }
        });
        return null;
    }
};