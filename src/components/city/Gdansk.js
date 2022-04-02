import { useEffect, useState } from "react";
import useWebSocket from 'react-use-websocket';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useMap, useMapEvents } from "react-leaflet";
import { Routes, Route } from "react-router-dom";

import VehicleMarker from "./active/VehicleMarker";

export default () => {
    const map = useMap();
    const [vehicles, setVehicles] = useState([]);
    const [bounds, setBounds] = useState(map.getBounds());

    const group = JSON.parse(localStorage?.grouping || "false");

    /*useWebSocket("wss://ws.domeqalt.repl.co/", {
        onOpen: () => console.log('opened'),
        onClose: () => console.log('closed'),
        onMessage: ({ data }) => setVehicles(JSON.parse(data)),
        shouldReconnect: () => true,
        reconnectInterval: 10000,
        reconnectAttempts: 15,
        retryOnError: true
    });*/

    useEffect(() => {
        fetch("https://static.higenku.org/https://rewrite-rewrite.wtp-location-rewrite.pages.dev/gdansk/positions").then(res => res.json()).then(setVehicles).catch(() => null);
    }, []);

    let filteredVehicles = vehicles;
    let inBounds = filteredVehicles.filter(vehicle => bounds?.contains(vehicle?.location));

    return <>
        <Events />
        <Routes>
            <Route path="/" element={group 
                ? <MarkerClusterGroup animateAddingMarkers>{filteredVehicles.map(vehicle => <VehicleMarker vehicle={vehicle} key={vehicle.trip || vehicle.tab} />)}</MarkerClusterGroup>
                : (inBounds.length <= 1050 ? inBounds.map(vehicle => <VehicleMarker vehicle={vehicle} key={vehicle.trip || vehicle.tab} />) : null)} />
            <Route path="/:type/:tab" element={<></>} />
            <Route path="/stop/:id" element={<></>} />
            <Route path="/filter" element={<></>} />
        </Routes>
    </>;

    function Events() {
        useMapEvents({
            moveend: () => {
                setBounds(map.getBounds());
                localStorage.setItem("gdansk.pos", [map.getCenter().lat, map.getCenter().lng]);
                localStorage.setItem("gdansk.zoom", map.getZoom());
            }
        });
        return null;
    }
};