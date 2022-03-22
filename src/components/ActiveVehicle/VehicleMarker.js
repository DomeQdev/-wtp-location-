import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from 'react-dom/server';
import { ArrowUpward, DirectionsBus, Tram, DirectionsTransit } from '@mui/icons-material';
import { nearestPointOnLine, lineString, point } from '@turf/turf';

const VehicleMarker = ({ vehicle, trip, vehicleInfo }) => {
    const navigate = useNavigate();

    const onLine = null;

    const icon = vehicleInfo || trip ? divIcon({
        className: 'vehicle',
        html: renderToStaticMarkup(<span className={`vehicle-marker-active`}>{getIcon(vehicle?.type)}</span>),
        iconSize: [5, 5],
        iconAnchor: [15, 12],
        popupAnchor: [0, -12]
    }) : divIcon({
        className: 'vehicle',
        html: renderToStaticMarkup(<span className={`vehicle-marker ${vehicle.type}`}> {vehicle.deg ? <ArrowUpward style={{ transform: `rotate(${vehicle.deg}deg)`, height: "16px", width: "16px" }} /> : null}{getIcon(vehicle?.type)}&nbsp;<b className={"line-number"}>{vehicle.line}</b>{vehicle?.brigade ? <small>/{vehicle.brigade}</small> : null}</span>),
        iconSize: [vehicle.line.includes("-") ? 95 : "auto", 28],
    })

    return <Marker
        key={vehicle.trip}
        position={onLine && onLine?.properties?.dist < 30 ? onLine?.geometry?.coordinates : vehicle.location}
        eventHandlers={{
            click: () => navigate(`/${vehicle.type}/${vehicle.tab}`)
        }}
        vehicle={vehicle}
        icon={icon}
        zIndexOffset={10000}
    >
        {vehicleInfo ? <Popup autoPan={false}>
            <div style={{ display: "inline-flex", alignItems: "center", fontSize: 14 }}>{vehicle?.type === "bus" ? <DirectionsBus style={{ height: "22px", width: "22px", fill: trip?.color }} /> : <Tram style={{ height: "22px", width: "22px", fill: trip?.color }} />}&nbsp;<b>{vehicleInfo.brand}</b>&nbsp;{vehicleInfo.model} ({vehicle?.tab})</div><br />
            {vehicleInfo?.description ? <b>{vehicleInfo.description}<br /></b> : null}
            {vehicleInfo?.prodYear ? <><b>Rok produkcji:</b> {vehicleInfo.prodYear}<br /></> : null}
            {vehicleInfo?.registration ? <><b>Rejestracja:</b> {vehicleInfo?.registration}<br /></> : null}
            {vehicleInfo?.depot ? <><b>Zajezdnia:</b> {vehicleInfo?.depot}<br /></> : null}
            {vehicleInfo?.carrier ? <><b>Przewoźnik</b>: {vehicleInfo?.carrier}<br /></> : null}
            {vehicleInfo?.features.join(", ")}
        </Popup> : null}    
    </Marker>;
};

function getIcon(type) {
    switch(type) {
        case "bus":
            return <DirectionsBus style={{ height: "20px", width: "20px" }} />;
        case "tram":
            return <Tram style={{ height: "20px", width: "20px" }} />;
        default:
            return <DirectionsTransit style={{ height: "20px", width: "20px" }} />;
    }
}

export default VehicleMarker;