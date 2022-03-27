import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { useNavigate } from "react-router-dom";
import { renderToStaticMarkup } from 'react-dom/server';
import { ArrowUpward, DirectionsBus, Tram, DirectionsTransit } from '@mui/icons-material';

export default ({ vehicle, trip, vehicleInfo }) => {
    const icon = divIcon({
        className: 'vehicle',
        html: renderToStaticMarkup(<span className={`vehicle-marker ${vehicle.type}`}> {vehicle.deg ? <ArrowUpward style={{ transform: `rotate(${vehicle.deg}deg)`, height: "16px", width: "16px" }} /> : null}{getIcon(vehicle?.type)}&nbsp;<b className={"line-number"}>{vehicle.line}</b>{vehicle?.brigade ? <small>/{vehicle.brigade}</small> : null}</span>),
        iconSize: [vehicle.line.includes("-") ? 95 : "auto", 28],
    })
    return <Marker position={vehicle.location} icon={icon} />
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
