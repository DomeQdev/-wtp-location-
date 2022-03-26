import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { GpsFixed, Settings, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import "leaflet/dist/leaflet.css";

export default ({ children, city }) => {
    const navigate = useNavigate();

    return <>
        <MapContainer
            center={localStorage.bounds?.split(",") || city === "warsaw" ? [52.22983095298667, 21.0117354814593] : [54.34610966679864, 18.644629872390432]}
            zoom={localStorage.zoom || 16}
            minZoom={7}
            maxZoom={18}
            zoomControl={false}
            style={{ width: "100%", height: "100vh" }}
        >
            <TileLayer url={"https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"} />
            <ZoomControl position="topright" />
            <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ top: 80, right: 10, position: "absolute" }}>
                <a href onClick={() => alert("upcoming")}><GpsFixed sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
            </div>
            <div className="leaflet-control-zoom leaflet-bar leaflet-control" style={{ top: 120, right: 10, position: "absolute" }}>
                <a href onClick={() => navigate("/filter")}><FilterList sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
                <a href onClick={() => navigate("/settings")}><Settings sx={{ fontSize: 19, marginTop: 0.75 }} /></a>
            </div>
            {children}
        </MapContainer>
    </>;
};