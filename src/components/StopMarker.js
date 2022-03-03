import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { nearestPointOnLine, lineString, point } from '@turf/turf';

export default function StopMarker({ stop, trip }) {
    const { properties, geometry } = nearest(stop.location);
    return (
        <Marker
            position={properties?.dist < 30 ? geometry?.coordinates : stop.location}
            eventHandlers={{
                click: () => {}
            }}
            icon={divIcon({
                className: '',
                html: renderToStaticMarkup(<button className={`stop_marker`} style={{ border: `3px solid ${trip.color}` }} title={`${stop.name} ${stop.on_request ? "(Ż)" : ""}`}></button>),
                iconSize: [6, 6],
                iconAnchor: [8, 7],
                popupAnchor: [0, -5]
            })}
            zIndexOffset={100}
        >
            <Popup autoPan={false}><b>{stop.name}</b></Popup>
        </Marker>
    );

    function nearest(location) {
        if (typeof location !== "object" || !trip) return null;
        return nearestPointOnLine(lineString(trip?.shapes), point(location), { units: 'meters' });
    }
}
