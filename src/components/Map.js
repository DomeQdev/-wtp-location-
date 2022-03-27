import { MapContainer, TileLayer, ZoomControl, Marker, Circle, Popup } from 'react-leaflet';
import { GpsFixed, Settings, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

export default ({ children, city }) => {
    const navigate = useNavigate();
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [userAngle, setUserAngle] = useState(null);

    useEffect(locate, map);

    window.addEventListener("deviceorientation", ({ alpha }) => setUserAngle(alpha));
    console.log(userAngle, userLocation);

    return <>
        <MapContainer
            center={localStorage.getItem(`${city}.bounds`)?.split(",") || (city === "warsaw" ? [52.22983095298667, 21.0117354814593] : [54.34610966679864, 18.644629872390432])}
            zoom={localStorage.getItem(`${city}.zoom`) || 16}
            minZoom={7}
            maxZoom={18}
            zoomControl={false}
            whenCreated={setMap}
            style={{ width: "100%", height: "100vh" }}
        >
            <TileLayer url={"https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"} />
            <ZoomControl position="topright" />
            <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ top: 80, right: 10, position: "absolute" }}>
                <a href onClick={() => locate()}><GpsFixed sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
            </div>
            <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ top: 120, right: 10, position: "absolute" }}>
                <a href onClick={() => navigate("/filter")}><FilterList sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
                <a href onClick={() => navigate("/settings")}><Settings sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
            </div>
            {userLocation ? <>
                <Marker position={userLocation.latlng}>
                    <Popup>Dokładność lokalizacji: {Math.floor(userLocation.accuracy)}m</Popup>
                </Marker>
                <Circle center={userLocation.latlng} radius={userLocation.accuracy} weight={0} fillColor={"#136AEC"} fillOpacity={0.2} />
            </> : null}
            {children}
        </MapContainer>
    </>;

    function locate() {
        if(!map) return;
        if(userLocation) return map.setView(userLocation.latlng, userLocation.accuracy / 0.9);
        map.locate({ watch: true })
            .once("locationfound", ({ latlng, accuracy }) => map.setView(latlng, accuracy / 0.9))
            .on("locationfound", setUserLocation);
    }
};