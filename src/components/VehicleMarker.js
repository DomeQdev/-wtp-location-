import { Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from 'react-dom/server';
import { ArrowUpward, DirectionsBus, Tram } from '@mui/icons-material';
import { nearestPointOnLine, lineString, point } from '@turf/turf';

const VehicleMarker = ({ vehicle, trip }) => {
    const navigate = useNavigate();

    const onLine = trip ? nearestPointOnLine(lineString(trip?.shapes), point(vehicle.location), { units: 'meters' }) : null;

    const icon = trip ? divIcon({
        className: '',
        html: renderToStaticMarkup(<span className={`vehicle-marker-active`}>{vehicle.type === "bus" ? <DirectionsBus style={{ height: "20px", width: "20px", fill: "#000" }} /> : <Tram style={{ height: "20px", width: "20px" }} />}</span>),
        iconSize: [5, 5],
        iconAnchor: [15, 12]
    }) : divIcon({
        className: '',
        html: renderToStaticMarkup(<span className={`vehicle-marker ${vehicle.type}`}> {vehicle.deg ? <ArrowUpward style={{ transform: `rotate(${vehicle.deg}deg)`, height: "16px", width: "16px" }} /> : null}{vehicle.type === "bus" ? <DirectionsBus style={{ height: "16px", width: "16px" }} /> : <Tram style={{ height: "16px", width: "16px" }} />}&nbsp;<b className={"line-number"}>{vehicle.line}</b><small>/{vehicle.brigade}</small></span>),
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
    />;
};

export default VehicleMarker;