import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { nearestPointOnLine, lineString, point } from '@turf/turf';

export default function StopMarker({ vehicle, stop, trip }) {
    return (
        <Marker
            key={stop.stop_id}
            position={nearest(stop.location)}
            eventHandlers={{
                click: () => {}
            }}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker`} title={`${stop.stop_name} ${stop.on_request ? "(Ż)" : ""}`}><span className={"stop-sequence"}>{stop.stop_sequence}</span></button>),
                iconSize: [30, 30],
                iconAnchor: [5, 5],
                popupAnchor: [0.5, -5]
            })}
            zIndexOffset={100}
        >
            <Popup autoPan={false}><b>{stop.name}</b></Popup>
        </Marker>
    );

    function nearest(location) {
        if (typeof location !== "object" || !trip) return null;
        return nearestPointOnLine(lineString(trip?.shapes), point(location), { units: 'meters' }).geometry.coordinates;
    }
}
